import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

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
    const { error } = await supabaseAdmin
        .from('transactions')
        .update({ status: 'succeeded' })
        .eq('stripe_pi_id', paymentIntent.id);

    if (error) {
        console.error('Error updating transaction success:', error);
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
