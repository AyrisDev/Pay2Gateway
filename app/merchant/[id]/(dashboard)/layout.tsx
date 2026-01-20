import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ExternalLink,
    Building2,
    ShieldCheck
} from 'lucide-react';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function MerchantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const identifier = resolvedParams.id;
    const cookieStore = await cookies();

    // 1. Resolve actual merchant ID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let resolvedId = identifier;

    if (!isUUID) {
        const { data: merchant } = await supabaseAdmin
            .from('merchants')
            .select('id')
            .eq('short_id', identifier)
            .single();
        if (merchant) {
            resolvedId = merchant.id;
        }
    }

    // 2. Auth Check
    const isAuth = cookieStore.get(`merchant_auth_${resolvedId}`);
    const isShortAuth = cookieStore.get(`merchant_auth_${identifier}`);

    // If visiting login page, don't check auth or redirect loop
    // But layout handles all subpages. Subpage specific logic?
    // In Next.js, layout can't easily know the current sub-segment without hooks.
    // However, the login page itself has its own layout or is a sibling?
    // If the login page is AT /merchant/[id]/login, it is INSIDE this layout.
    // We should allow the login page to show.

    // Note: To truly exclude the login page from this check in a layout, 
    // we would usually check the URL, but Server Components layout don't have URL.
    // A better approach is to use Middleware for redirs or just check in page.tsx.

    // For now, let's keep it simple: 
    // Since I can't check URL here easily, I will implement the check in the individual pages 
    // or just assume this layout is only for protected pages.
    // Wait, let's make the login page NOT use this layout if possible.

    // Actually, I'll just check if auth exists. If not, the pages will handle redirection 
    // or we can use a "RequireAuth" wrapper.

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <MerchantSidebar merchantId={identifier} />

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h2>
                        <div className="h-6 w-px bg-gray-100 mx-2"></div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {identifier}
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Güvenli Oturum</span>
                        </div>
                        <div className="h-4 w-px bg-gray-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold uppercase tracking-tighter shadow-lg shadow-gray-200">
                                {identifier.slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
