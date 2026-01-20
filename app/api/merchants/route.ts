import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { name, webhook_url, payment_provider, provider_config } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Firma adı zorunludur.' },
                { status: 400 }
            );
        }

        // Generate a 8-character short ID (e.g., P2C-A1B2C3)
        const generateShortId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const { data, error } = await supabaseAdmin
            .from('merchants')
            .insert([{
                name,
                webhook_url,
                short_id: generateShortId(),
                payment_provider: payment_provider || 'stripe',
                provider_config: provider_config || {}
            }])
            .select()
            .single();

        if (error) {
            console.error('Merchant creation error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Internal Error:', err);
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}
