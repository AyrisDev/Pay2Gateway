import React from 'react';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    MoreHorizontal,
    ArrowUpRight
} from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';

import CustomerSearch from '@/components/admin/CustomerSearch';

async function getFilteredCustomers(queryText?: string) {
    const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !transactions) return null;

    // Group transactions by name or phone
    const customerMap = new Map();

    transactions.forEach(t => {
        // We use a combination of name and phone as a key if possible, 
        // fallback to whichever is available
        const key = (t.customer_phone || t.customer_name || 'Unknown').toLowerCase().trim();

        if (!customerMap.has(key)) {
            customerMap.set(key, {
                id: t.id,
                name: t.customer_name || 'İsimsiz Müşteri',
                phone: t.customer_phone || 'Telefon Yok',
                spent: 0,
                orders: 0,
                lastOrder: t.created_at,
                status: 'New'
            });
        }

        const c = customerMap.get(key);
        c.orders += 1;
        if (t.status === 'succeeded') {
            c.spent += Number(t.amount);
        }
        // Update last order date if this transaction is newer
        if (new Date(t.created_at) > new Date(c.lastOrder)) {
            c.lastOrder = t.created_at;
        }
    });

    let customers = Array.from(customerMap.values()).map(c => {
        if (c.orders > 5 && c.spent > 1000) c.status = 'High Value';
        else if (c.orders > 1) c.status = 'Active';
        return c;
    });

    // Client-side search (since customers are derived)
    if (queryText) {
        const q = queryText.toLowerCase();
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q)
        );
    }

    return customers;
}

export default async function CustomersPage(props: {
    searchParams: Promise<{ q?: string }>;
}) {
    const searchParams = await props.searchParams;
    const customers = await getFilteredCustomers(searchParams.q);

    if (!customers) return <div className="p-10 font-black text-gray-400 uppercase tracking-widest animate-pulse">Müşteriler yükleniyor...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Müşteriler</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Müşteri portföyünüzü yönetin</p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Canlı Veritabanı Bağlantısı</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8 group hover:border-blue-500 transition-colors">
                    <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">{customers.length.toLocaleString('tr-TR')}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Sorgulanan Müşteri</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-600">
                        <ArrowUpRight size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">%{((customers.filter(c => c.status === 'High Value' || c.status === 'Active').length / (customers.length || 1)) * 100).toFixed(0)}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Bağlılık Oranı</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-16 h-16 bg-orange-50 rounded-[20px] flex items-center justify-center text-orange-600">
                        <Phone size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">{customers.filter(c => c.phone !== 'Telefon Yok').length}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">İletişim Bilgili</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CustomerSearch />
                    <div className="bg-gray-50 px-6 py-4 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sıralama: En Son Ödeme</span>
                    </div>
                </div>

                <div className="overflow-x-auto text-sans tracking-tight">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-8">Müşteri Bilgileri</th>
                                <th className="px-10 py-8">Segment</th>
                                <th className="px-10 py-8">Sipariş</th>
                                <th className="px-10 py-8">Toplam Harcama</th>
                                <th className="px-10 py-8 text-right">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.map((customer, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm uppercase tracking-tighter group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {customer.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{customer.name}</span>
                                                <span className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">{customer.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            customer.status === 'High Value' ? 'bg-blue-600 text-white' :
                                                customer.status === 'New' ? 'bg-indigo-50 text-indigo-600' :
                                                    'bg-gray-50 text-gray-400'
                                            }`}>
                                            {customer.status === 'Active' ? 'Aktif' :
                                                customer.status === 'High Value' ? 'VIP' :
                                                    customer.status === 'New' ? 'Yeni Üye' : 'İnaktif'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="text-sm font-black text-gray-900">{customer.orders} İşlem</span>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="text-sm font-black text-gray-900">
                                            {customer.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                        </span>
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Son İşlem</span>
                                                <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                                                    {new Date(customer.lastOrder).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {customers.length === 0 && (
                    <div className="p-20 text-center">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Müşteri bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}
