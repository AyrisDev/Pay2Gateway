import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
    Search,
    Filter,
    Download,
    ExternalLink,
    MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import TransactionSearch from '@/components/admin/TransactionSearch';
import TransactionStatusFilter from '@/components/admin/TransactionStatusFilter';

async function getTransactions(filters: { merchant_id?: string; q?: string; status?: string }) {
    let query = supabaseAdmin
        .from('transactions')
        .select('*, merchants(name)')
        .order('created_at', { ascending: false });

    if (filters.merchant_id) {
        query = query.eq('merchant_id', filters.merchant_id);
    }

    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    if (filters.q) {
        // First, search for merchants matching the name to get their IDs
        const { data: matchedMerchants } = await supabaseAdmin
            .from('merchants')
            .select('id')
            .ilike('name', `%${filters.q}%`);

        const merchantIds = matchedMerchants?.map(m => m.id) || [];

        // Construct OR query parts
        let orParts = [
            `stripe_pi_id.ilike.%${filters.q}%`,
            `source_ref_id.ilike.%${filters.q}%`,
            `customer_name.ilike.%${filters.q}%`
        ];

        if (merchantIds.length > 0) {
            orParts.push(`merchant_id.in.(${merchantIds.join(',')})`);
        }

        query = query.or(orParts.join(','));
    }

    const { data, error } = await query;

    if (error) {
        console.error('Fetch error:', error);
        return [];
    }
    return data;
}

export default async function TransactionsPage(props: {
    searchParams: Promise<{ merchant_id?: string; q?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const transactions = await getTransactions({
        merchant_id: searchParams.merchant_id,
        q: searchParams.q,
        status: searchParams.status
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <TransactionSearch />
                    <TransactionStatusFilter />
                </div>

                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                    <Download size={18} />
                    CSV Olarak İndir
                </button>
            </div>

            {/* Full Transactions Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-sans tracking-tight">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-6">Firma</th>
                                <th className="px-10 py-6">İşlem ID</th>
                                <th className="px-10 py-6">Referans / Kaynak</th>
                                <th className="px-10 py-6">Tarih & Saat</th>
                                <th className="px-10 py-6">Tutar</th>
                                <th className="px-10 py-6 text-center">Durum</th>
                                <th className="px-10 py-6 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t: any) => (
                                <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                                                {t.merchants?.name || 'Doğrudan'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-gray-900 uppercase">#{t.stripe_pi_id?.slice(-12).toUpperCase() || 'MOCK'}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{t.customer_name || t.source_ref_id || 'Doğrudan Ödeme'}</span>
                                            {t.customer_phone ? (
                                                <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider mt-1">{t.customer_phone}</span>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-bold truncate max-w-[200px] mt-1">{t.callback_url || 'Geri dönüş yok'}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xs font-bold text-gray-500">
                                            {format(new Date(t.created_at), 'dd MMM yyyy, HH:mm', { locale: tr })}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 font-black text-gray-900">
                                        {Number(t.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {t.currency.toUpperCase() === 'TRY' ? '₺' : t.currency.toUpperCase()}
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${t.status === 'succeeded' ? 'bg-emerald-50 text-emerald-600' :
                                                t.status === 'failed' ? 'bg-red-50 text-red-600' :
                                                    'bg-orange-50 text-orange-600'
                                                }`}>
                                                {t.status === 'succeeded' ? 'Başarılı' :
                                                    t.status === 'failed' ? 'Hatalı' : 'Bekliyor'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {t.callback_url && (
                                                <a href={t.callback_url} target="_blank" className="p-2 text-gray-300 hover:text-blue-600 transition">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                            <button className="p-2 text-gray-300 hover:text-gray-900 transition">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Search size={32} />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">İşlem bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}
