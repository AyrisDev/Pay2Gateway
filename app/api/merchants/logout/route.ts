import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const { identifier } = await req.json();
        const cookieStore = await cookies();

        // We don't know the exact UUID easily if they provide a short_id, 
        // but we can try to clear both or just clear the one we know.
        // Actually, since we set it for both in the auth route, let's clear common ones.

        // A better way: clear all cookies starting with merchant_auth_
        // But Next.js cookies API doesn't support listing/clearing by pattern easily.

        // So we'll just clear the one for the provided identifier.
        cookieStore.delete(`merchant_auth_${identifier}`);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
