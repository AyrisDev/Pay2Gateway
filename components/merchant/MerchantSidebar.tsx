'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CreditCard,
    ExternalLink,
    Terminal,
    Building2,
    ShieldCheck,
    LogOut
} from 'lucide-react';

export default function MerchantSidebar({ merchantId }: { merchantId: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/merchants/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: merchantId })
            });
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error('Logout failed');
        }
    };

    const navItems = [
        { label: 'Panel', icon: LayoutDashboard, href: `/merchant/${merchantId}` },
        { label: 'İşlemler', icon: CreditCard, href: `/merchant/${merchantId}/transactions` },
        { label: 'Entegrasyon', icon: Terminal, href: `/merchant/${merchantId}/integration` },
    ];

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <Building2 size={24} />
                </div>
                <div>
                    <h1 className="font-black text-gray-900 leading-tight text-lg">P2C<span className="text-blue-600">Merchant</span></h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Firma Yönetim Paneli</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-2">
                <p className="px-6 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Menü</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-gray-500'} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 space-y-2">
                <div className="p-6 bg-blue-50/50 rounded-3xl space-y-4 border border-blue-100/50 mb-4">
                    <div className="flex items-center gap-2 text-blue-600">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Güvenli Oturum</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Verileriniz 256-bit şifreleme ile korunmaktadır.</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-colors group"
                >
                    <LogOut size={20} className="text-red-200 group-hover:text-red-400" />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
