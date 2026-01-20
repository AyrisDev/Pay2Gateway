'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Building2 } from 'lucide-react';

export default function MerchantLoginPage() {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // We use an API route to verify the key and set a cookie
            const response = await fetch(`/api/merchants/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: id, apiKey })
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/merchant/${id}`);
                router.refresh();
            } else {
                setError(data.error || 'Geçersiz anahtar.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-100 mb-6">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Firma Girişi</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">P2CGateway Güvenli Erişim Paneli</p>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                    <div className="space-y-2">
                        <p className="text-sm font-black text-gray-900 leading-tight">Yönetim anahtarınızı girin</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Size özel tanımlanan API Secret Key ile giriş yapın.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="••••••••••••••••"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-mono font-bold text-gray-900"
                                />
                            </div>
                            {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest pl-2">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Doğrulanıyor...' : 'Paneli Aç'}
                            {!isLoading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>

                <div className="text-center pt-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>

            <div className="mt-20 flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-full border border-blue-100">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">SSL 256-bit Uçtan Uca Şifreleme</span>
            </div>
        </div>
    );
}
