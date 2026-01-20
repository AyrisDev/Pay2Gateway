import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TransactionChart from '@/components/admin/TransactionChart';

async function getMerchantData(identifier: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    // Fetch merchant details
    const query = supabaseAdmin
        .from('merchants')
        .select('*');

    if (isUUID) {
        query.eq('id', identifier);
    } else {
        query.eq('short_id', identifier);
    }

    const { data: merchant, error: mError } = await query.single();

    if (mError || !merchant) return null;

    const id = merchant.id; // Always use UUID for internal lookups

    // Fetch merchant transactions
    const { data: transactions, error: tError } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('merchant_id', id)
        .order('created_at', { ascending: false });

    if (tError) return null;

    const successfulTransactions = transactions.filter(t => t.status === 'succeeded');
    const totalRevenue = successfulTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const successfulCount = successfulTransactions.length;
    const totalCount = transactions.length;
    const successRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;

    // Last 30 days chart data
    const chartData = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (29 - i));
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
        merchant,
        transactions,
        totalRevenue,
        successfulCount,
        successRate,
        totalCount,
        chartData
    };
}

export default async function MerchantDashboardPage(props: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await props.params;
    const identifier = resolvedParams.id;
    const data = await getMerchantData(identifier);
    const cookieStore = await cookies();

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 mb-4">
                    <Search size={40} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Firma Bulunamadı</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs max-w-xs leading-relaxed">
                    Erişmeye çalıştığınız firma ID'si geçersiz veya yetkiniz yok.
                </p>
                <Link href="/" className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Geri Dön</Link>
            </div>
        );
    }

    // Check Authentication
    const isAuth = cookieStore.get(`merchant_auth_${data.merchant.id}`) || cookieStore.get(`merchant_auth_${identifier}`);
    if (!isAuth) {
        redirect(`/merchant/${identifier}/login`);
    }

    const { merchant, transactions, totalRevenue, successfulCount, successRate, totalCount, chartData } = data;
    const recentTransactions = transactions.slice(0, 8);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Merchant Info Header */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100">
                        {merchant.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{merchant.name}</h1>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Hoş Geldiniz, İşlemlerinizi Buradan Takip Edebilirsiniz</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 text-center">Durum</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-black text-gray-900 uppercase">Aktif</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6 group hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toplam Ciro</p>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-gray-900">{totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-lg">₺</span></h3>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter mt-3 flex items-center gap-1">
                            <TrendingUp size={14} /> Başarılı İşlemlerden Gelen
                        </p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İşlem Sayısı</p>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-gray-900">{successfulCount} <span className="text-lg text-gray-300">/ {totalCount}</span></h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mt-3 flex items-center gap-1">
                            Ödeme Girişi Denemesi
                        </p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Başarı Oranı</p>
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-gray-900">%{successRate.toFixed(1)}</h3>
                        <div className="w-full bg-gray-50 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: `${successRate}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="mb-10">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Günlük Gelir Grafiği</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Son 30 günlük işlem hacmi</p>
                </div>
                <TransactionChart data={chartData} />
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center px-10">
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Son İşlemler</h2>
                    <Link href={`/merchant/${identifier}/transactions`} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                        Bütün İşlemleri Gör
                    </Link>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                            <th className="px-10 py-6">İşlem No</th>
                            <th className="px-10 py-6">Referans / Müşteri</th>
                            <th className="px-10 py-6">Tarih</th>
                            <th className="px-10 py-6 text-right">Tutar</th>
                            <th className="px-10 py-6 text-center">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentTransactions.map((t) => (
                            <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-10 py-8">
                                    <span className="text-xs font-black text-gray-900 font-mono">#{t.stripe_pi_id?.slice(-8).toUpperCase() || 'EXT-' + t.id.slice(0, 4)}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900 uppercase">{t.customer_name || t.source_ref_id || 'SİSTEM'}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t.customer_phone || 'İletişim Yok'}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-xs font-bold text-gray-400 uppercase">
                                    {format(new Date(t.created_at), 'dd MMM yyyy, HH:mm', { locale: tr })}
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recentTransactions.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <Wallet className="w-12 h-12 text-gray-200 mx-auto" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Henüz bir işlem bulunmuyor</p>
                    </div>
                )}
            </div>
        </div>
    );
}
