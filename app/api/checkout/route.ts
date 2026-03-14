import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { items, affiliateCode, customerEmail } = await req.json();

    const lineItems = items.map((item: {
      name: string;
      price: number;
      quantity: number;
      sku: string;
      image?: string;
    }) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            sku: item.sku
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: customerEmail,
      metadata: {
        affiliate_code: affiliateCode || '',
      },
      payment_intent_data: {
        metadata: {
          affiliate_code: affiliateCode || '',
        },
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['CA', 'US'],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
