import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { data, error } = await supabaseAdmin
            .from('merchants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { name, webhook_url, payment_provider, provider_config } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Firma adı zorunludur.' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('merchants')
            .update({
                name,
                webhook_url,
                payment_provider,
                provider_config
            })
            .eq('id', id)
            .select()
            .single();

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

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { error } = await supabaseAdmin
            .from('merchants')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: `Internal Server Error: ${err.message}` },
            { status: 500 }
        );
    }
}
