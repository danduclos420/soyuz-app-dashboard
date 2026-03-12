import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const addr = session.shipping_details?.address;
    const shippingAddress = addr ? (addr as unknown as Record<string, string>) : {};

    await supabaseAdmin.from('orders').insert({
      customer_email: session.customer_email || '',
      customer_name: session.shipping_details?.name || '',
      order_type: 'retail',
      status: 'confirmed',
      subtotal: (session.amount_subtotal || 0) / 100,
      tax_amount: (session.total_details?.amount_tax || 0) / 100,
      shipping_amount: (session.total_details?.amount_shipping || 0) / 100,
      total_amount: (session.amount_total || 0) / 100,
      stripe_session_id: session.id,
      affiliate_code: session.metadata?.affiliate_code || null,
      shipping_address: shippingAddress,
    });
  }

  return NextResponse.json({ received: true });
}
