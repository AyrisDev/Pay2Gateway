import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    ClipboardList,
    CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import TransactionChart from '@/components/admin/TransactionChart';
import QueryRangeSelector from '@/components/admin/QueryRangeSelector';

async function getStats(rangeDays: number = 30) {
    const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !transactions) return null;

    const successfulTransactions = transactions.filter(t => t.status === 'succeeded');
    const totalRevenue = successfulTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const successfulCount = successfulTransactions.length;
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const totalCount = transactions.length;
    const successRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;

    // Calculate unique customers
    const uniqueCustomers = new Set(
        transactions
            .filter(t => t.customer_name || t.customer_phone)
            .map(t => t.customer_name || t.customer_phone)
    ).size;

    // Dynamic chart data based on range
    const chartData = Array.from({ length: rangeDays }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (rangeDays - 1 - i));
        return {
            date: d.toISOString().split('T')[0],
            displayDate: format(d, 'd MMM', { locale: tr }),
            amount: 0
        };
    });

    successfulTransactions.forEach(t => {
        const dateStr = new Date(t.created_at).toISOString().split('T')[0];
        const dayMatch = chartData.find(d => d.date === dateStr);
        if (dayMatch) {
            dayMatch.amount += Number(t.amount);
        }
    });

    return {
        transactions,
        totalRevenue,
        successfulCount,
        pendingCount,
        successRate,
        totalCount,
        uniqueCustomers,
        chartData
    };
}

export default async function AdminDashboard(props: {
    searchParams: Promise<{ range?: string }>;
}) {
    const searchParams = await props.searchParams;
    const range = searchParams.range ? parseInt(searchParams.range) : 30;
    const stats = await getStats(range);

    if (!stats) {
        return <div className="p-10 font-bold text-gray-500 font-sans tracking-tight uppercase">Henüz bir işlem verisi bulunamadı.</div>;
    }

    const recentTransactions = stats.transactions.slice(0, 5);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Total Revenue */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Toplam Ciro</p>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                            <TrendingUp size={14} />
                            <span>Sistem Aktif <span className="text-gray-400 font-medium lowercase">gerçek zamanlı veri</span></span>
                        </div>
                    </div>
                </div>

                {/* Successful Transactions */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">İşlem Sayısı</p>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.successfulCount}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Tamamlanan Ödeme</p>
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Başarı Oranı</p>
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">%{stats.successRate.toFixed(1)}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{stats.totalCount} Toplam İstek</p>
                    </div>
                </div>

                {/* Unique Customers */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tekil Müşteri</p>
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.uniqueCustomers}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Farklı Ödeme Kaynağı</p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Charts */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 leading-none">İşlem Hacmi</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Son {range} günlük toplam hacim</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <QueryRangeSelector />
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                            {range} günlük veri gösteriliyor
                        </p>
                    </div>
                </div>

                <TransactionChart data={stats.chartData} />
            </div>

            {/* Bottom Section: Recent Transactions Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-sans tracking-tight">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center text-sans tracking-tight">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Son İşlemler</h2>
                    <Link href="/admin/transactions" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        Tümünü Gör
                    </Link>
                </div>

                <div className="overflow-x-auto text-sans tracking-tight">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-6">İşlem ID</th>
                                <th className="px-10 py-6">Müşteri / Ref</th>
                                <th className="px-10 py-6">Tarih</th>
                                <th className="px-10 py-6 text-right pr-20">Tutar</th>
                                <th className="px-10 py-6 text-center">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentTransactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">#{t.stripe_pi_id?.slice(-8).toUpperCase() || 'EXTERNAL'}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{t.id.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs uppercase tracking-tighter">
                                                {t.customer_name ? t.customer_name.slice(0, 2).toUpperCase() : (t.source_ref_id ? t.source_ref_id.slice(0, 2).toUpperCase() : 'PI')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900">{t.customer_name || t.source_ref_id || 'Sistem Ödemesi'}</span>
                                                <span className="text-[10px] text-gray-400 font-bold truncate max-w-[150px] mt-1">{t.customer_phone || t.callback_url || 'doğrudan-ödeme'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xs font-bold text-gray-500 uppercase">
                                            {format(new Date(t.created_at), 'dd MMM yyyy', { locale: tr })}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right pr-20">
                                        <span className="text-sm font-black text-gray-900">
                                            {Number(t.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                        </span>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
