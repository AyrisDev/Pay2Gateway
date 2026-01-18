import React from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import {
    Search,
    Filter,
    Download,
    ExternalLink,
    MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

async function getTransactions() {
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="İşlem ID veya referans ile ara..."
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                        <Filter size={18} />
                        Filtreler
                    </button>
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
                                <th className="px-10 py-6">İşlem ID</th>
                                <th className="px-10 py-6">Referans / Kaynak</th>
                                <th className="px-10 py-6">Tarih & Saat</th>
                                <th className="px-10 py-6">Tutar</th>
                                <th className="px-10 py-6 text-center">Durum</th>
                                <th className="px-10 py-6 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
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
