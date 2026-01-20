import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
    Terminal,
    Copy,
    Check,
    Globe,
    Webhook,
    Zap,
    ShieldCheck,
    Code2
} from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getMerchant(identifier: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const query = supabaseAdmin
        .from('merchants')
        .select('*');

    if (isUUID) {
        query.eq('id', identifier);
    } else {
        query.eq('short_id', identifier);
    }

    const { data, error } = await query.single();
    return data;
}

export default async function MerchantIntegrationPage(props: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await props.params;
    const identifier = resolvedParams.id;
    const merchant = await getMerchant(identifier);
    const cookieStore = await cookies();

    if (!merchant) return null;

    if (!cookieStore.get(`merchant_auth_${merchant.id}`)) {
        redirect(`/merchant/${identifier}/login`);
    }

    const checkoutUrl = `https://p2cgateway.com/checkout?merchant_id=${merchant.short_id || merchant.id}&amount=100&currency=TRY&ref_id=SİPARİŞ_123&callback_url=https://siteniz.com/basarili`;

    return (
        <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Teknik Entegrasyon</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Ödeme sistemini sitenize nasıl bağlarsınız?</p>
            </div>

            {/* Quick Start Card */}
            <div className="bg-gray-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                <Zap size={24} />
                            </div>
                            <h2 className="text-2xl font-black">Hızlı Ödeme Linki</h2>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                            Entegrasyonun en basit yolu, müşterilerinizi aşağıdaki URL yapısını kullanarak ödeme sayfasına yönlendirmektir.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sizin Hazır Linkiniz</p>
                        <div className="bg-black p-4 rounded-xl border border-white/5 font-mono text-[10px] text-blue-400 break-all leading-relaxed">
                            {checkoutUrl}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Credentials */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Kimlik Bilgileri</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Merchant ID (Firma Kimliği)</label>
                            <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
                                <code className="text-xs font-mono font-bold text-gray-600 truncate">{merchant.id}</code>
                                <Copy size={14} className="text-gray-300 cursor-pointer" />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">API Secret Key</label>
                            <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
                                <code className="text-xs font-mono font-bold text-gray-600">••••••••••••••••••••••••</code>
                                <button className="text-[10px] font-black text-blue-600 uppercase">Göster</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Webhooks */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                            <Webhook size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Webhook Yapılandırması</h3>
                    </div>

                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Ödeme başarılı olduğunda sistemimiz belirtilen adrese bir POST isteği gönderir.
                    </p>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mevcut Webhook URL</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${merchant.webhook_url ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {merchant.webhook_url ? 'AKTİF' : 'AYARLANMAMIŞ'}
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <code className="text-xs font-bold text-gray-600 truncate block">
                                {merchant.webhook_url || 'https://henuz-bir-adres-tanimlanmadi.com'}
                            </code>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-2 leading-relaxed">
                            Webook URL adresinizi değiştirmek için <br /> destek ekibi ile iletişime geçin.
                        </p>
                    </div>
                </div>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'API Referansı', icon: Code2, color: 'blue' },
                    { title: 'Hazır Kütüphaneler', icon: Terminal, color: 'emerald' },
                    { title: 'Teknik Destek', icon: Globe, color: 'purple' },
                ].map((r) => (
                    <div key={r.title} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 hover:border-gray-300 transition-colors cursor-pointer group">
                        <div className={`w-12 h-12 bg-${r.color}-50 rounded-2xl flex items-center justify-center text-${r.color}-600 group-hover:bg-${r.color}-600 group-hover:text-white transition-all`}>
                            <r.icon size={22} />
                        </div>
                        <span className="text-sm font-black text-gray-900 leading-tight">{r.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
