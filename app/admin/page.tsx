import React from 'react';
import { supabaseAdmin } from '@/lib/supabase';
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

async function getStats() {
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

    // Last 30 days chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
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
        const dayMatch = last30Days.find(d => d.date === dateStr);
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
        chartData: last30Days
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

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

                {/* Total Customers */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Toplam Müşteri</p>
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.uniqueCustomers.toLocaleString('tr-TR')}</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                            <TrendingUp size={14} />
                            <span>{stats.totalCount} <span className="text-gray-400 font-medium lowercase">toplam işlem kaydı</span></span>
                        </div>
                    </div>
                </div>

                {/* Pending Payments */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bekleyen Ödemeler</p>
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <ClipboardList size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.pendingCount}</h3>
                        <div className="flex items-center gap-1 mt-2 text-orange-500 font-bold text-xs uppercase tracking-tighter">
                            <ClipboardList size={14} />
                            <span>İşlem Bekliyor <span className="text-gray-400 font-medium lowercase">onay aşamasında</span></span>
                        </div>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Başarı Oranı</p>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900">{stats.successRate.toFixed(1)}%</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                            <TrendingUp size={14} />
                            <span>Optimized <span className="text-gray-400 font-medium lowercase">ödeme dönüşüm oranı</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Volume Line Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 leading-none">İşlem Hacmi</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Son 30 günlük toplam hacim</p>
                        </div>
                        <select className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none">
                            <option>Son 30 Gün</option>
                            <option>Son 7 Gün</option>
                        </select>
                    </div>

                    <div className="h-64 relative flex items-end justify-between px-4 pb-12">
                        {/* Dynamic SVG Chart */}
                        {(() => {
                            const maxAmount = Math.max(...stats.chartData.map(d => d.amount), 100);
                            const points = stats.chartData.map((d, i) => ({
                                x: (i / 29) * 100, // 0 to 100%
                                y: 100 - (d.amount / maxAmount) * 80 - 10 // 10 to 90% (lower y is higher value)
                            }));

                            const dLine = points.reduce((acc, p, i) =>
                                i === 0 ? `M 0 ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
                            );

                            const dArea = `${dLine} L 100 100 L 0 100 Z`;

                            return (
                                <svg
                                    viewBox="0 0 100 100"
                                    className="absolute inset-0 w-full h-full text-blue-500 overflow-visible px-4 pt-10 pb-12"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d={dLine}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d={dArea}
                                        fill="url(#chartGradient)"
                                        stroke="none"
                                    />
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            );
                        })()}

                        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-bold text-gray-300 uppercase px-8 pb-4 border-t border-gray-50 pt-4">
                            <span>{stats.chartData[0].displayDate}</span>
                            <span>{stats.chartData[10].displayDate}</span>
                            <span>{stats.chartData[20].displayDate}</span>
                            <span>Bugün</span>
                        </div>
                    </div>
                </div>

                {/* Revenue by Source Donut Chart */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 leading-none mb-10 uppercase tracking-tight">Kaynak Bazlı Ciro</h3>

                    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="24" fill="none" />
                                <circle cx="96" cy="96" r="80" stroke="#2563EB" strokeWidth="24" fill="none" strokeDasharray="502" strokeDashoffset="200" strokeLinecap="round" />
                                <circle cx="96" cy="96" r="80" stroke="#60A5FA" strokeWidth="24" fill="none" strokeDasharray="502" strokeDashoffset="400" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-sans">
                                <p className="text-2xl font-black text-gray-900 truncate max-w-[120px] text-center">{stats.totalRevenue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Toplam Ciro</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full px-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <span className="text-xs font-bold text-gray-900">Kart (60%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span className="text-xs font-bold text-gray-900">Havale (20%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                <span className="text-xs font-bold text-gray-900">Cüzdan (15%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                                <span className="text-xs font-bold text-gray-400 text-center uppercase tracking-tighter">Diğer (5%)</span>
                            </div>
                        </div>
                    </div>
                </div>
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
                                            <span className="text-sm font-black text-gray-900">#{t.stripe_pi_id.slice(-8).toUpperCase()}</span>
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
