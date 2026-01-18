'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callback_url') || '/';

    return (
        <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl shadow-xl border border-red-50">
            <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                    <XCircle className="w-16 h-16 text-red-600" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarısız</h1>
            <p className="text-gray-600 mb-8">
                İşleminiz maalesef tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
            </p>

            <div className="flex flex-col gap-3">
                <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition"
                >
                    <RotateCcw size={18} />
                    Tekrar Dene
                </Link>
                <Link
                    href={callbackUrl}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white text-gray-600 border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                    <ArrowLeft size={18} />
                    Mağazaya Dön
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutErrorPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
