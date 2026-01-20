'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import MockCheckoutForm from '@/components/checkout/MockCheckoutForm';
import { Loader2, AlertCircle, ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link'; // Added Link import

function CheckoutContent() {
    const searchParams = useSearchParams();
    const amount = parseFloat(searchParams.get('amount') || '100');
    const currency = searchParams.get('currency') || 'TL';
    const refId = searchParams.get('ref_id') || 'SEC-99231-TX';
    const callbackUrl = searchParams.get('callback_url') || '/';
    const merchantId = searchParams.get('merchant_id') || null;

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
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
            body: JSON.stringify({
                amount,
                currency,
                ref_id: refId,
                callback_url: callbackUrl,
                merchant_id: merchantId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                    setPaymentData(data);

                    // Auto-redirect if it's a redirect action
                    if (data.nextAction === 'redirect' && data.redirectUrl) {
                        setTimeout(() => {
                            window.location.href = data.redirectUrl;
                        }, 2000); // 2 second delay to show the message
                    }
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
                    <span className="font-bold text-gray-900 text-lg tracking-tight">P2CGateway</span>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    <UserCircle size={24} />
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row items-stretch w-full overflow-hidden">
                {/* Left Column: Product Info (Cover Image) */}
                <div className="flex-1 min-h-[500px] lg:min-h-0 relative group order-2 lg:order-1">
                    <img
                        src="/digital_nft_asset.png"
                        alt="Digital NFT Product"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Content on Image */}
                    <div className="relative h-full flex flex-col justify-between p-12">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Premium Dijital Varlık</span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white text-5xl font-black tracking-tight uppercase leading-none">CyberCube #082</h3>
                                <p className="text-gray-300 text-lg mt-4 max-w-lg leading-relaxed">P2C ağına ömür boyu erişim sağlayan özel, yüksek sadakatli 3D üretken dijital koleksiyon parçası.</p>
                            </div>

                            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-8">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Satıcı</p>
                                    <p className="text-white font-medium text-sm">Ayris Digital Media INC.</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Destek</p>
                                    <p className="text-blue-400 font-medium text-sm hover:underline cursor-pointer">help@ayris.dev</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Form */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start order-1 lg:order-2 p-8 lg:p-20">
                    {!clientSecret ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-gray-100 shadow-sm w-full max-w-md">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Ödeme ekranı hazırlanıyor...</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            {paymentData?.nextAction === 'redirect' ? (
                                <div className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm text-center space-y-8 animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                                        <Loader2 className="animate-spin" size={40} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Ödeme Sayfasına Yönlendiriliyorsunuz</h3>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Lütfen tarayıcınızı kapatmayın</p>
                                    </div>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto">Sizi güvenli ödeme adımına aktarıyoruz. Bu işlem birkaç saniye sürebilir.</p>
                                    <button
                                        onClick={() => window.location.href = paymentData.redirectUrl}
                                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition shadow-xl"
                                    >
                                        Hemen Git
                                    </button>
                                </div>
                            ) : isMock ? (
                                <MockCheckoutForm amount={amount} currency={currency} callbackUrl={callbackUrl} clientSecret={clientSecret} refId={refId} />
                            ) : paymentData?.provider === 'stripe' ? (
                                <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                    <CheckoutForm
                                        amount={amount}
                                        currency={currency}
                                        callbackUrl={callbackUrl}
                                        piId={clientSecret.split('_secret')[0]}
                                    />
                                </Elements>
                            ) : (
                                <div className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm text-center">
                                    <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-900">{paymentData?.provider.toUpperCase()} Entegrasyonu</h3>
                                    <p className="text-gray-400 text-sm mt-2 uppercase font-bold tracking-widest">Bu ödeme yöntemi geliştirme aşamasındadır.</p>
                                </div>
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
                    © 2026 P2CGateway Inc. Tüm hakları saklıdır.
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
