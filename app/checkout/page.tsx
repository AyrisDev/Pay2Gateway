'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import MockCheckoutForm from '@/components/checkout/MockCheckoutForm';
import { Loader2, AlertCircle, ArrowLeft, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import

function CheckoutContent() {
    const searchParams = useSearchParams();
    const amount = parseFloat(searchParams.get('amount') || '100');
    const currency = searchParams.get('currency') || 'TL';
    const refId = searchParams.get('ref_id') || 'SEC-99231-TX';
    const callbackUrl = searchParams.get('callback_url') || '/';

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isMock = process.env.NEXT_PUBLIC_USE_MOCK_PAYMENTS === 'true';

    useEffect(() => {
        if (amount <= 0) {
            setError('Geçersiz işlem tutarı.');
            return;
        }

        fetch('/api/create-payment-intent', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency, ref_id: refId, callback_url: callbackUrl }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                }
            })
            .catch(() => setError('Ödeme başlatılamadı. Lütfen tekrar deneyin.'));
    }, [amount, currency, refId, callbackUrl]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md mx-auto mt-20">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-700 mb-2">Hata Oluştu</h2>
                <p className="text-red-600 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Header */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rotate-45 transform"></div>
                    </div>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">froydPay</span>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    <UserCircle size={24} />
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row items-stretch max-w-7xl mx-auto w-full px-6 py-12 gap-12">
                {/* Left Column: Product Info */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-end space-y-8 order-2 lg:order-1">
                    <div className="relative group perspective-1000">
                        <div className="w-full max-w-[400px] aspect-square relative rounded-[40px] overflow-hidden shadow-2xl shadow-blue-200/50 transform group-hover:rotate-y-6 transition-transform duration-500 border-8 border-white">
                            <Image
                                src="/digital_nft_asset.png"
                                alt="Digital NFT Product"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8 pt-20">
                                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Premium Dijital Varlık</span>
                                <h3 className="text-white text-2xl font-black tracking-tight uppercase">CyberCube #082</h3>
                                <p className="text-gray-300 text-sm mt-2 line-clamp-2">froyd ağına ömür boyu erişim sağlayan özel, yüksek sadakatli 3D üretken dijital koleksiyon parçası.</p>
                            </div>
                        </div>

                        {/* Gloss Effect */}
                        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    <div className="text-center lg:text-right space-y-2 hidden lg:block">
                        <p className="text-gray-400 text-sm font-medium">Satıcı: <span className="text-gray-900 uppercase">Froyd Digital Media INC.</span></p>
                        <p className="text-gray-400 text-sm">Müşteri Desteği: <span className="text-blue-600 hover:underline cursor-pointer">help@froyd.io</span></p>
                    </div>
                </div>

                {/* Right Column: Payment Form */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start order-1 lg:order-2">
                    {!clientSecret ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-gray-100 shadow-sm w-full max-w-md">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Ödeme ekranı hazırlanıyor...</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            {isMock ? (
                                <MockCheckoutForm amount={amount} currency={currency} callbackUrl={callbackUrl} clientSecret={clientSecret} refId={refId} />
                            ) : (
                                <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                    <CheckoutForm
                                        amount={amount}
                                        currency={currency}
                                        callbackUrl={callbackUrl}
                                        piId={clientSecret.split('_secret')[0]}
                                    />
                                </Elements>
                            )}

                            <div className="mt-8 flex justify-center lg:justify-start">
                                <Link href={callbackUrl} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition translate-x-0 hover:-translate-x-1 duration-200">
                                    <ArrowLeft size={16} />
                                    Mağazaya Dön
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 text-center">
                <p className="text-[#94A3B8] text-[10px] font-medium tracking-tight uppercase">
                    © 2026 froydPay Inc. Tüm hakları saklıdır.
                </p>
            </footer>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
