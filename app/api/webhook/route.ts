import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { getOrderConfirmationTemplate } from '@/lib/email-templates';
import { refreshQBToken, createQBSalesReceipt, QBToken } from '@/lib/quickbooks';

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
    
    // 1. Fetch line items with expanded product to get SKU metadata
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    const items = lineItems.data.map(item => {
      const product = item.price?.product as Stripe.Product;
      const sku = product?.metadata?.sku || '';
      
      return {
        description: item.description,
        quantity: item.quantity,
        unit_amount: item.amount_total / 100,
        currency: item.currency,
        sku: sku,
      };
    });

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
      affiliate_code: session.metadata?.affiliate_code || null,
      stripe_payment_id: session.payment_intent as string,
      stripe_payment_status: session.payment_status,
      status: 'paid', // Since it's checkout.session.completed
      shipping_address: shippingAddress,
    }).select().single();

    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
    }

    // 3. Handle Affiliate Commission
    if (order && session.metadata?.affiliate_code) {
      const { data: affiliate } = await (supabaseAdmin
        .from('affiliates')
        .select('id, commission_rate, total_sales') as any)
        .eq('affiliate_code', session.metadata.affiliate_code)
        .single();

      if (affiliate) {
        const commissionRate = affiliate.commission_rate || 15; // Updated to 15% as per V1 preference
        const commissionAmount = ((order as any).subtotal * commissionRate) / 100;
        
        // Insert Commission
        await (supabaseAdmin.from('commissions') as any).insert({
          affiliate_id: affiliate.id,
          order_id: (order as any).id,
          amount: commissionAmount,
          status: 'pending'
        });

        // Update Affiliate Stats (Total Sales for Ranking/Points)
        await (supabaseAdmin.from('affiliates') as any)
          .update({ 
            total_sales: (affiliate.total_sales || 0) + (order as any).subtotal,
            updated_at: new Date().toISOString()
          })
          .eq('id', affiliate.id);
          
        console.log(`Commission of ${commissionAmount} attributed to affiliate ${affiliate.id}`);
      }
    }

    // 4. Trigger Email Notification via Resend (Phase 8)
    if (order) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: [(order as any).customer_email],
          subject: `Confirmed: Transmission Received (#${(order as any).id.slice(-8)})`,
          html: getOrderConfirmationTemplate(order),
        });
        console.log('Order confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    console.log('Order created successfully:', (order as any)?.id);

    // 5. QuickBooks Integration (Deduct Stock via SalesReceipt)
    try {
      const { data: qbConfig } = await (supabaseAdmin.from('app_config') as any)
        .select('value')
        .eq('key', 'quickbooks_token')
        .maybeSingle();

      if (qbConfig) {
        let token = qbConfig.value as QBToken;

        // Refresh token if needed
        if (Date.now() >= token.expires_at) {
          console.log('[Webhook] QB Token expired, refreshing for SalesReceipt...');
          const newToken = await refreshQBToken(token.refresh_token);
          token = { ...token, ...newToken, realmId: token.realmId };
          await (supabaseAdmin.from('app_config') as any).upsert({
            key: 'quickbooks_token',
            value: token,
            updated_at: new Date().toISOString()
          });
        }

        console.log('[Webhook] Creating QuickBooks SalesReceipt for order:', (order as any).id);
        const qbItems = items.filter(i => i.sku).map(i => ({
          sku: i.sku,
          quantity: i.quantity || 1,
          amount: i.unit_amount,
          description: i.description || ''
        }));

        if (qbItems.length > 0) {
          const qbResult = await createQBSalesReceipt(token, {
            customerName: (order as any).customer_name,
            customerEmail: (order as any).customer_email,
            items: qbItems
          });
          console.log('[Webhook] QuickBooks SalesReceipt created successfully:', qbResult.SalesReceipt?.Id);
        } else {
          console.warn('[Webhook] No items with SKUs found for QuickBooks sync.');
        }
      }
    } catch (qbError: any) {
      console.error('[Webhook] QuickBooks Sync Failed:', qbError.message);
      // We don't want to fail the whole webhook if QB sync fails, but we log it.
    }
  }

  return NextResponse.json({ received: true });
}
