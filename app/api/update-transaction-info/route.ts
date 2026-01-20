import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { stripe_id, customer_name, customer_phone } = await req.json();

        if (!stripe_id) {
            return NextResponse.json({ error: 'Missing stripe_id' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('transactions')
            .update({
                customer_name,
                customer_phone
            })
            .eq('stripe_pi_id', stripe_id);

        if (error) {
            console.error('Update transaction info error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
