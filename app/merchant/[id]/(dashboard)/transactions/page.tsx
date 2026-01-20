import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    CreditCard,
    Search,
    Filter,
    Download,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getMerchantTransactions(identifier: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const query = supabaseAdmin
        .from('merchants')
        .select('id')

    if (isUUID) {
        query.eq('id', identifier);
    } else {
        query.eq('short_id', identifier);
    }

    const { data: merchant } = await query.single();
    if (!merchant) return null;

    const { data, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

    if (error) return null;
    return data;
}

export default async function MerchantTransactionsPage(props: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await props.params;
    const identifier = resolvedParams.id;
    const transactions = await getMerchantTransactions(identifier);
    const cookieStore = await cookies();

    if (!transactions) return <div className="p-10 text-gray-400 font-black uppercase text-xs animate-pulse">İşlemler yükleniyor...</div>;

    // Resolve merchant UUID briefly for auth check
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let resolvedId = identifier;
    if (!isUUID) {
        const { data: merchant } = await supabaseAdmin.from('merchants').select('id').eq('short_id', identifier).single();
        if (merchant) resolvedId = merchant.id;
    }

    if (!cookieStore.get(`merchant_auth_${resolvedId}`)) {
        redirect(`/merchant/${identifier}/login`);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">İşlem Listesi</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tüm ödeme hareketleri</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition">
                        <Download size={16} />
                        Dışa Aktar (.CSV)
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                            <th className="px-10 py-6">İşlem No</th>
                            <th className="px-10 py-6">Müşteri / Referans</th>
                            <th className="px-10 py-6">Tarih</th>
                            <th className="px-10 py-6 text-right">Tutar</th>
                            <th className="px-10 py-6 text-center">Durum</th>
                            <th className="px-10 py-6 text-right">Gateway</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((t) => (
                            <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900 font-mono">#{t.stripe_pi_id?.slice(-8).toUpperCase() || 'EXT-' + t.id.slice(0, 4)}</span>
                                        <span className="text-[9px] text-gray-300 font-bold uppercase mt-1">{t.id.slice(0, 8)}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900 uppercase">{t.customer_name || t.source_ref_id || 'SİSTEM'}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t.customer_phone || 'İletişim Yok'}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-xs font-bold text-gray-400 uppercase">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} />
                                        {format(new Date(t.created_at), 'dd MMM yyyy, HH:mm', { locale: tr })}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right font-black text-gray-900 text-sm">
                                    {Number(t.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'succeeded' ? 'bg-emerald-50 text-emerald-600' :
                                        t.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {t.status === 'succeeded' ? 'Başarılı' : t.status === 'failed' ? 'Hatalı' : 'Bekliyor'}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">
                                        {t.provider || 'STRIPE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto">
                            <CreditCard size={32} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Henüz bir işlem kaydedilmemiş</p>
                    </div>
                )}
            </div>
        </div>
    );
}
