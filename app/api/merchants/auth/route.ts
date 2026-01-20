import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { identifier, apiKey } = await req.json();

        if (!identifier || !apiKey) {
            return NextResponse.json({ error: 'Eksik bilgi.' }, { status: 400 });
        }

        // 1. Resolve merchant by ID or short_id
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        const query = supabaseAdmin
            .from('merchants')
            .select('*');

        if (isUUID) {
            query.eq('id', identifier);
        } else {
            query.eq('short_id', identifier);
        }

        const { data: merchant, error } = await query.single();

        if (error || !merchant) {
            return NextResponse.json({ error: 'Firma bulunamadı.' }, { status: 404 });
        }

        // 2. Verify API Key
        if (merchant.api_key !== apiKey) {
            return NextResponse.json({ error: 'Geçersiz anahtar.' }, { status: 401 });
        }

        // 3. Set Auth Cookie (simplified for now)
        // Store the merchant ID in a cookie
        const cookieStore = await cookies();
        cookieStore.set(`merchant_auth_${merchant.id}`, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Also set a temporary short_id link if needed
        if (merchant.short_id) {
            cookieStore.set(`merchant_auth_${merchant.short_id}`, 'true', {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
