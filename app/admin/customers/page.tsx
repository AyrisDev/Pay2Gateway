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
import { supabaseAdmin } from '@/lib/supabase';

async function getCustomers() {
    const { data: transactions, error } = await supabaseAdmin
        .from('transactions')
        .select('*');

    if (error || !transactions) return null;

    // Group transactions by name or phone
    const customerMap = new Map();

    transactions.forEach(t => {
        const key = t.customer_name || t.customer_phone || 'Unknown';
        if (!customerMap.has(key)) {
            customerMap.set(key, {
                id: t.id,
                name: t.customer_name || 'İsimsiz Müşteri',
                phone: t.customer_phone || 'Telefon Yok',
                spent: 0,
                orders: 0,
                status: 'New'
            });
        }
        const c = customerMap.get(key);
        c.orders += 1;
        if (t.status === 'succeeded') {
            c.spent += Number(t.amount);
        }
    });

    const customers = Array.from(customerMap.values()).map(c => {
        if (c.orders > 5) c.status = 'High Value';
        else if (c.orders > 1) c.status = 'Active';
        return c;
    });

    return customers;
}

export default async function CustomersPage() {
    const customers = await getCustomers();

    if (!customers) return <div className="p-10 font-black text-gray-400 uppercase tracking-widest animate-pulse">Müşteriler yükleniyor...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Müşteriler</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Müşteri portföyünüzü yönetin</p>
                </div>
                <button className="flex items-center justify-center gap-3 px-8 py-4 bg-[#2563EB] text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95 uppercase text-xs tracking-widest">
                    <Plus size={18} />
                    Yeni Müşteri Ekle
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">{customers.length.toLocaleString('tr-TR')}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Toplam Müşteri</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-600">
                        <ArrowUpRight size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">Gerçek</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Canlı Veri</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-16 h-16 bg-orange-50 rounded-[20px] flex items-center justify-center text-orange-600">
                        <Phone size={32} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-gray-900">{customers.filter(c => c.phone !== 'Telefon Yok').length}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Telefon Kayıtlı</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                            type="text"
                            placeholder="İsim veya telefon ile ara..."
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                        />
                    </div>
                    <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 px-6 py-4">
                        Görünümü Filtrele
                    </button>
                </div>

                <div className="overflow-x-auto text-sans tracking-tight">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="px-10 py-8">Müşteri Bilgileri</th>
                                <th className="px-10 py-8">Segment</th>
                                <th className="px-10 py-8">Sipariş</th>
                                <th className="px-10 py-8">Toplam Harcama</th>
                                <th className="px-10 py-8 text-right">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.map((customer, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-black text-sm uppercase tracking-tighter">
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
                                            customer.status === 'High Value' ? 'bg-blue-50 text-blue-600' :
                                                customer.status === 'New' ? 'bg-indigo-50 text-indigo-600' :
                                                    'bg-gray-50 text-gray-400'
                                            }`}>
                                            {customer.status === 'Active' ? 'Aktif' :
                                                customer.status === 'High Value' ? 'VIP' :
                                                    customer.status === 'New' ? 'Yeni Üye' : 'İnaktif'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="text-sm font-black text-gray-900">{customer.orders}</span>
                                    </td>
                                    <td className="px-10 py-10">
                                        <span className="text-sm font-black text-gray-900">
                                            {customer.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                        </span>
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition">
                                                <Phone size={18} />
                                            </button>
                                            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-900 hover:bg-gray-100 transition">
                                                <MoreHorizontal size={18} />
                                            </button>
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
