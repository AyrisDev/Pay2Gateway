'use client';

import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Loader2, Lock, ShieldCheck, HelpCircle } from 'lucide-react';

interface CheckoutFormProps {
    amount: number;
    currency: string;
    callbackUrl: string;
    piId: string;
}

export default function CheckoutForm({ amount, currency, callbackUrl, piId }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!name || !phone) {
            setMessage("Lütfen ad soyad ve telefon numaranızı giriniz.");
            return;
        }

        setIsLoading(true);

        // 1. Update customer info in our database
        try {
            await fetch('/api/update-transaction-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stripe_id: piId,
                    customer_name: name,
                    customer_phone: phone,
                }),
            });
        } catch (err) {
            console.error('Info update error:', err);
        }

        // 2. Confirm payment in Stripe
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?callback_url=${encodeURIComponent(callbackUrl)}`,
                payment_method_data: {
                    billing_details: {
                        name: name,
                        phone: phone,
                    }
                }
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message ?? "Bir hata oluştu.");
        } else {
            setMessage("Beklenmedik bir hata oluştu.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
            <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TOPLAM TUTAR</p>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-none">
                    {amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {currency.toUpperCase() === 'TRY' || currency.toUpperCase() === 'TL' ? '₺' : currency.toUpperCase()}
                </h2>
                <p className="text-xs text-blue-500 font-medium tracking-tight">
                    Güvenli ve Şifreli İşlem
                </p>
            </div>

            <div className="space-y-6">
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
                            required
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
                            required
                        />
                    </div>
                </div>

                <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

                {message && (
                    <div id="payment-message" className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
                        {message}
                    </div>
                )}

                <button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
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
        </form>
    );
}
