'use client';

import React from 'react';
import {
    Globe,
    ShieldCheck,
    Bell,
    Trash2,
    Smartphone,
    Monitor,
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ayarlar</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Platform tercihlerinizi yönetin</p>
                </div>
                <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 transition active:scale-95">
                    Değişiklikleri Kaydet
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Section */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Globe size={24} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Genel Ayarlar</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Mağaza Adı</label>
                                <input type="text" defaultValue="froyd Store" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Destek E-postası</label>
                                <input type="email" defaultValue="support@froyd.io" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Para Birimi</label>
                                <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                    <option>Türk Lirası (₺)</option>
                                    <option>US Dollar ($)</option>
                                    <option>Euro (€)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Zaman Dilimi</label>
                                <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                    <option>Istanbul (GMT+3)</option>
                                    <option>London (GMT+0)</option>
                                    <option>New York (EST)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Güvenlik</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px]">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900">İki Faktörlü Doğrulama</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Hesabınıza ekstra bir güvenlik katmanı ekleyin</p>
                                </div>
                                <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px]">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900">API Erişimi</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Harici uygulamalar için anahtar yönetimi</p>
                                </div>
                                <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Anahtarları Düzenle</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Notifications & Danger Zone */}
                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                <Bell size={20} />
                            </div>
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Bildirimler</h2>
                        </div>
                        <div className="space-y-4">
                            {['Yeni Satışlar', 'Müşteri Mesajları', 'Sistem Güncellemeleri'].map((item) => (
                                <label key={item} className="flex items-center gap-4 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-2 border-gray-100 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition">{item}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="bg-red-50 p-8 rounded-[40px] border border-red-100 space-y-6">
                        <div className="flex items-center gap-4 text-red-600">
                            <Trash2 size={20} />
                            <h2 className="text-lg font-black uppercase tracking-tight">Tehlikeli Bölge</h2>
                        </div>
                        <p className="text-xs font-bold text-red-400 leading-relaxed uppercase tracking-wider">
                            Mağaza verilerini kalıcı olarak silmek veya hesabı kapatmak için bu bölümü kullanın. Bu işlem geri alınamaz.
                        </p>
                        <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition shadow-lg shadow-red-100">
                            Mağazayı Devre Dışı Bırak
                        </button>
                    </section>
                </div>
            </div>

            {/* Footer Meta */}
            <div className="pt-12 text-center">
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em]">v1.0.4 Platinum Enterprise Edition</p>
            </div>
        </div>
    );
}
