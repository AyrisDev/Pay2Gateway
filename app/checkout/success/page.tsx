'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get('callback_url');
    const paymentIntent = searchParams.get('payment_intent');

    useEffect(() => {
        if (callbackUrl) {
            // Redirect after a short delay
            const timer = setTimeout(() => {
                try {
                    // Handle potential relative URLs by providing a base
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
                    const url = new URL(callbackUrl, baseUrl);
                    url.searchParams.append('status', 'success');
                    if (paymentIntent) url.searchParams.append('payment_intent', paymentIntent);
                    window.location.href = url.toString();
                } catch (e) {
                    console.error('URL parse error:', e);
                    // Fallback to direct navigation if URL parsing fails
                    window.location.href = callbackUrl;
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [callbackUrl, paymentIntent]);

    return (
        <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl shadow-xl border border-green-50">
            <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h1>
            <p className="text-gray-600 mb-8">
                İşleminiz başarıyla tamamlandı. Birazdan geldiğiniz sayfaya yönlendirileceksiniz.
            </p>

            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                <p className="text-sm text-gray-400">Yönlendiriliyor...</p>

                {callbackUrl && (
                    <a
                        href={callbackUrl}
                        className="text-blue-600 hover:underline text-sm font-medium mt-4"
                    >
                        Yönlendirme olmazsa buraya tıklayın
                    </a>
                )}
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-blue-600" />}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
