import React from 'react';
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Monitor,
    Smartphone,
    Calendar
} from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

async function getAnalyticsData() {
    const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: true });

    if (error || !transactions) return null;

    const successfulTransactions = transactions.filter(t => t.status === 'succeeded');
    const totalRevenue = successfulTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const avgOrderValue = successfulTransactions.length > 0 ? totalRevenue / successfulTransactions.length : 0;

    // Monthly data for chart (grouped by month or last 12 periods)
    // To keep it simple and meaningful, let's show last 12 days for "Gelir Trendi"
    const last12Periods = Array.from({ length: 12 }, (_, i) => {
        const d = subDays(new Date(), 11 - i);
        return {
            date: d.toISOString().split('T')[0],
            label: format(d, 'd MMM', { locale: tr }),
            amount: 0
        };
    });

    successfulTransactions.forEach(t => {
        const dateStr = new Date(t.created_at).toISOString().split('T')[0];
        const periodMatch = last12Periods.find(p => p.date === dateStr);
        if (periodMatch) {
            periodMatch.amount += Number(t.amount);
        }
    });

    return {
        totalRevenue,
        avgOrderValue,
        chartData: last12Periods,
        totalCount: transactions.length,
        successCount: successfulTransactions.length,
    };
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    if (!data) return <div className="p-10 font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Veriler hazırlanıyor...</div>;

    const metrics = [
        { label: 'Dönüşüm Oranı', value: '3.24%', trend: '+0.8%', positive: true }, // Mocked for now
        { label: 'Ort. Sipariş Tutarı', value: `${data.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺`, trend: '+12%', positive: true },
        { label: 'Başarılı İşlem', value: data.successCount.toString(), trend: '+24%', positive: true },
        { label: 'İşlem Başarısı', value: `${((data.successCount / (data.totalCount || 1)) * 100).toFixed(1)}%`, trend: '-0.2%', positive: false },
    ];

    const maxChartAmount = Math.max(...data.chartData.map(d => d.amount), 100);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analizler</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Sistem performans verileri</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-600 hover:bg-gray-50 transition uppercase tracking-widest">
                        <Calendar size={18} className="text-gray-300" />
                        Son 30 Gün
                    </button>
                </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {metrics.map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{item.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-black text-gray-900 leading-none">{item.value}</h3>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${item.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                                {item.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {item.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10 text-sans tracking-tight">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Ciro Trendi (12 Gün)</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gerçekleşen</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-72 flex items-end justify-between gap-4">
                        {data.chartData.map((d, i) => {
                            const h = (d.amount / maxChartAmount) * 90 + 5; // 5% to 95%
                            return (
                                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-xl transition-all duration-500 group-hover:bg-blue-600 cursor-pointer relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl pointer-events-none whitespace-nowrap z-20">
                                            {d.amount.toLocaleString('tr-TR')} ₺
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-300 uppercase tracking-tighter text-center">
                                        {d.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-1 gap-8 text-sans tracking-tight">
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Cihaz Dağılımı</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Mobil', value: '64%', icon: Smartphone, color: 'bg-blue-600', width: '64%' },
                                { label: 'Masaüstü', value: '28%', icon: Monitor, color: 'bg-indigo-400', width: '28%' },
                                { label: 'Tablet', value: '8%', icon: Globe, color: 'bg-indigo-100', width: '8%' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-black text-gray-900 uppercase tracking-widest">
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} className="text-gray-300" />
                                            <span>{item.label}</span>
                                        </div>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#2563EB] p-10 rounded-[40px] shadow-2xl shadow-blue-200 text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-black leading-tight">Analizleriniz hazır! <br /> Bu ay başarılı bir grafik çiziyorsunuz.</h3>
                            <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition active:scale-95 shadow-xl uppercase tracking-widest">
                                Akıllı İpuçlarını Aç
                            </button>
                        </div>
                        <BarChart3 className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
