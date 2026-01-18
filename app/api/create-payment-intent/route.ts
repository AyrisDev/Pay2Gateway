import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, ref_id, callback_url, customer_name, customer_phone } = await req.json();

        if (!amount || !currency) {
            return NextResponse.json(
                { error: 'Tutar ve para birimi zorunludur.' },
                { status: 400 }
            );
        }

        const useMock = process.env.NEXT_PUBLIC_USE_MOCK_PAYMENTS === 'true';
        let clientSecret = 'mock_secret_' + Math.random().toString(36).substring(7);
        let stripeId = 'mock_pi_' + Math.random().toString(36).substring(7);

        if (!useMock) {
            // 1. Create PaymentIntent in Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe uses subunits (e.g., cents)
                currency: currency.toLowerCase(),
                metadata: {
                    ref_id,
                    callback_url,
                    customer_name,
                    customer_phone,
                },
            });
            clientSecret = paymentIntent.client_secret!;
            stripeId = paymentIntent.id;
        }

        // 2. Log transaction in Supabase with 'pending' status
        const { error: dbError } = await supabaseAdmin
            .from('transactions')
            .insert({
                amount,
                currency,
                status: 'pending',
                stripe_pi_id: stripeId,
                source_ref_id: ref_id,
                customer_name,
                customer_phone,
                callback_url,
            });

        if (dbError) {
            console.error('Database log error:', dbError);
        }

        return NextResponse.json({
            clientSecret: clientSecret,
        });
    } catch (err: any) {
        console.error('Internal Error:', err);
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}
