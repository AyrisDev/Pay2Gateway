import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PaymentProviderFactory } from '@/lib/payment-providers';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, ref_id, callback_url, customer_name, customer_phone, merchant_id } = await req.json();

        if (!amount || !currency || !merchant_id) {
            return NextResponse.json(
                { error: 'Tutar, para birimi ve firma ID zorunludur.' },
                { status: 400 }
            );
        }

        // 1. Fetch Merchant to check provider (Support both UUID and Short ID)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(merchant_id);

        const query = supabaseAdmin
            .from('merchants')
            .select('*');

        if (isUUID) {
            query.eq('id', merchant_id);
        } else {
            query.eq('short_id', merchant_id);
        }

        const { data: merchant, error: merchantError } = await query.single();

        if (merchantError || !merchant) {
            return NextResponse.json({ error: 'Firma bulunamadı.' }, { status: 404 });
        }

        // Use the actual UUID for DB operations
        const resolvedMerchantId = merchant.id;

        const provider = merchant.payment_provider || 'stripe';
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK_PAYMENTS === 'true';

        let clientSecret = '';
        let providerTxId = '';
        let nextAction = 'none';
        let redirectUrl = '';

        if (useMock) {
            clientSecret = 'mock_secret_' + Math.random().toString(36).substring(7);
            providerTxId = clientSecret;
        } else {
            // 2. Use Factory to create intent based on provider
            const intent = await PaymentProviderFactory.createIntent(provider, {
                amount,
                currency,
                merchantId: resolvedMerchantId,
                refId: ref_id,
                customerName: customer_name,
                customerPhone: customer_phone,
                callbackUrl: callback_url,
                providerConfig: merchant.provider_config
            });

            clientSecret = intent.clientSecret;
            providerTxId = intent.providerTxId;
            nextAction = intent.nextAction || 'none';
            redirectUrl = intent.redirectUrl || '';
        }

        // 3. Log transaction in Supabase
        const { error: dbError } = await supabaseAdmin
            .from('transactions')
            .insert({
                amount,
                currency,
                status: 'pending',
                stripe_pi_id: providerTxId, // We keep using this column for now or we could use provider_tx_id if we updated schema
                source_ref_id: ref_id,
                customer_name,
                customer_phone,
                callback_url,
                merchant_id: resolvedMerchantId,
                provider: provider,
                metadata: {
                    nextAction,
                    redirectUrl
                }
            });

        if (dbError) {
            console.error('Database log error:', dbError);
        }

        return NextResponse.json({
            clientSecret: clientSecret,
            nextAction,
            redirectUrl,
            provider
        });
    } catch (err: any) {
        console.error('Internal Error:', err);
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}
