'use client';

import React, { useState } from 'react';
import { Loader2, CreditCard, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MockCheckoutFormProps {
    amount: number;
    currency: string;
    callbackUrl: string;
    clientSecret: string;
    refId?: string;
}

export default function MockCheckoutForm({ amount, currency, callbackUrl, clientSecret, refId }: MockCheckoutFormProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing'>('idle');

    const handleMockPayment = async (mode: 'success' | 'failed') => {
        if (mode === 'success' && (!name || !phone)) {
            alert('Lütfen ad soyad ve telefon numaranızı giriniz.');
            return;
        }

        setIsLoading(true);
        setStatus('processing');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (mode === 'success') {
            try {
                await fetch('/api/mock-complete-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientSecret,
                        status: 'succeeded',
                        customer_name: name,
                        customer_phone: phone
                    }),
                });
            } catch (e) {
                console.error('Mock update fail', e);
            }

            router.push(`/checkout/success?callback_url=${encodeURIComponent(callbackUrl)}&payment_intent=${clientSecret}`);
        } else {
            alert('Ödeme başarısız (Test Modu)');
            setIsLoading(false);
            setStatus('idle');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
            <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOPLAM TUTAR</p>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-none">
                    {amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency.toUpperCase() === 'TRY' || currency.toUpperCase() === 'TL' ? '₺' : currency.toUpperCase()}
                </h2>
                {refId && (
                    <p className="text-xs text-blue-500 font-medium tracking-tight">
                        Referans: #{refId}
                    </p>
                )}
            </div>

            <div className="space-y-5">
                {/* Customer Details */}
                <div className="grid grid-cols-1 gap-4 pb-4 border-b border-gray-50">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">Ad Soyad</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">Telefon Numarası</label>
                        <input
                            type="tel"
                            placeholder="05XX XXX XX XX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                        <CreditCard size={14} className="text-gray-400" />
                        Kart Numarası
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value="4242 4242 4242 4242"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none text-lg font-mono tracking-wider"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                            <span className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center text-gray-400 font-bold uppercase italic border border-gray-300">VISA</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase">Son Kullanma</label>
                        <input
                            type="text"
                            readOnly
                            value="12/26"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none text-lg font-mono tracking-wider"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
                            CVC
                            <HelpCircle size={14} className="text-gray-300" />
                        </label>
                        <input
                            type="password"
                            readOnly
                            value="***"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none text-lg font-mono tracking-widest"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => handleMockPayment('success')}
                        disabled={isLoading}
                        className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-100 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-5 h-5 text-white" />
                        ) : (
                            <>
                                <Lock size={18} className="text-blue-200 group-hover:scale-110 transition-transform" />
                                <span>Güvenle Öde: {amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency.toUpperCase() === 'TRY' || currency.toUpperCase() === 'TL' ? '₺' : currency.toUpperCase()}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Failed scenario trigger for testing */}
                {process.env.NEXT_PUBLIC_USE_MOCK_PAYMENTS === 'true' && !isLoading && (
                    <button
                        onClick={() => handleMockPayment('failed')}
                        className="w-full text-[10px] text-gray-300 hover:text-red-400 transition uppercase tracking-widest font-bold"
                    >
                        Hata Testi Yap (Sadece Test Modu)
                    </button>
                )}
            </div>

            <div className="space-y-4 text-center border-t border-gray-50 pt-8">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">256-BIT SSL ŞİFRELİ İŞLEM</p>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-40">
                    <div className="flex items-center gap-1 text-[8px] font-black gray-800">
                        <span className="bg-gray-800 text-white px-1 rounded">Stripe</span> GÜVENCESİYLE
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-black text-gray-800 uppercase tracking-tighter">
                        <ShieldCheck size={10} /> PCI DSS UYUMLU
                    </div>
                </div>
            </div>
        </div>
    );
}
