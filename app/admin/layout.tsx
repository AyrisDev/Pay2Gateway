'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CreditCard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Search,
    Bell,
    MessageSquare,
    ChevronDown,
    Wallet
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client'; // Assuming a client-side Supabase client utility

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { label: 'Genel Bakış', icon: LayoutDashboard, href: '/admin' },
        { label: 'İşlemler', icon: CreditCard, href: '/admin/transactions' },
        { label: 'Müşteriler', icon: Users, href: '/admin/customers' },
        { label: 'Analizler', icon: BarChart3, href: '/admin/analytics' },
        { label: 'Ayarlar', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
                <div className="p-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-gray-900 leading-tight">froyd Admin</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Yönetim Paneli</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.label === 'Müşteriler' || item.label === 'Analizler' || item.label === 'Ayarlar' ? (item.href === pathname ? item.href : item.href) : item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 group ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-500'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 w-full rounded-2xl transition-all duration-200 group"
                    >
                        <LogOut size={22} className="text-gray-300 group-hover:text-red-500" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 gap-8">
                    <div className="flex-1 flex items-center">
                        <h2 className="text-xl font-black text-gray-900 mr-8 shrink-0">Yönetim Paneli</h2>
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input
                                type="text"
                                placeholder="İşlemlerde ara..."
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition">
                                <Bell size={24} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition">
                                <MessageSquare size={24} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900 leading-none">Admin</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">Süper Admin</p>
                            </div>
                            <div className="relative w-12 h-12 rounded-2xl bg-orange-100 overflow-hidden ring-4 ring-orange-50">
                                <div className="absolute inset-0 flex items-center justify-center text-orange-500 font-bold font-mono">AD</div>
                                {/* Fallback avatar if needed */}
                            </div>
                            <ChevronDown size={18} className="text-gray-300" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
