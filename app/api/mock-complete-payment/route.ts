import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { clientSecret, status, customer_name, customer_phone } = await req.json();

        if (process.env.NEXT_PUBLIC_USE_MOCK_PAYMENTS !== 'true') {
            return NextResponse.json({ error: 'Mock payments are disabled' }, { status: 403 });
        }

        // Update transaction in Supabase
        const { error } = await supabaseAdmin
            .from('transactions')
            .update({
                status,
                customer_name,
                customer_phone
            })
            .eq('stripe_pi_id', clientSecret); // In mock mode, we use clientSecret as the ID

        if (error) {
            console.error('Mock update DB error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
