import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const supabaseAdmin = getSupabaseAdmin();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Fetch line items to store in JSONB
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const items = lineItems.data.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unit_amount: item.amount_total / 100,
      currency: item.currency,
    }));

    const addr = session.shipping_details?.address;
    const shippingAddress = addr ? (addr as unknown as Record<string, string>) : {};

    // 2. Create the order in Supabase
    // Using mapping from README Phase 1.1
    const { data: order, error: orderError } = await (supabaseAdmin.from('orders') as any).insert({
      customer_email: session.customer_email || session.customer_details?.email || '',
      customer_name: session.shipping_details?.name || '',
      items: items,
      subtotal: (session.amount_subtotal || 0) / 100,
      discount_amount: (session.total_details?.amount_discount || 0) / 100,
      total: (session.amount_total || 0) / 100,
      rep_code: session.metadata?.affiliate_code || null,
      stripe_payment_id: session.payment_intent as string,
      stripe_payment_status: session.payment_status,
      status: 'paid', // Since it's checkout.session.completed
      shipping_address: shippingAddress,
    }).select().single();

    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
    }

    // 3. Handle Rep Commission (Phase 5/6)
    if (order && session.metadata?.affiliate_code) {
      const { data: rep } = await (supabaseAdmin
        .from('reps')
        .select('id, commission_rate') as any)
        .eq('code', session.metadata.affiliate_code)
        .single();

      if (rep) {
        const commissionAmount = ((order as any).subtotal * (rep.commission_rate || 10)) / 100;
        await (supabaseAdmin.from('commissions') as any).insert({
          rep_id: rep.id,
          order_id: (order as any).id,
          amount: commissionAmount,
          status: 'pending'
        });
      }
    }

    // 4. Trigger Email Notification via Resend (Phase 8)
    console.log('Order created successfully:', (order as any)?.id);
  }

  return NextResponse.json({ received: true });
}
