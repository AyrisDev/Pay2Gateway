import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object as any;

    // Handle the business logic based on event type
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSucceeded(session);
            break;
        case 'payment_intent.payment_failed':
            await handlePaymentFailed(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent: any) {
    // 1. Update status in our DB
    const { data: transaction, error: updateError } = await supabaseAdmin
        .from('transactions')
        .update({ status: 'succeeded' })
        .eq('stripe_pi_id', paymentIntent.id)
        .select('*')
        .single();

    if (updateError) {
        console.error('Error updating transaction success:', updateError);
        return;
    }

    // 2. If callback_url exists, notify the merchant (firm)
    if (transaction && transaction.callback_url) {
        try {
            console.log(`Sending callback to: ${transaction.callback_url}`);

            const response = await fetch(transaction.callback_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'success',
                    amount: transaction.amount,
                    currency: transaction.currency,
                    ref_id: transaction.source_ref_id,
                    transaction_id: transaction.id,
                    stripe_id: transaction.stripe_pi_id,
                    customer_name: transaction.customer_name,
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                console.warn(`Callback failed with status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error sending callback:', err);
        }
    }
}

async function handlePaymentFailed(paymentIntent: any) {
    const { error } = await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed' })
        .eq('stripe_pi_id', paymentIntent.id);

    if (error) {
        console.error('Error updating transaction failure:', error);
    }
}
