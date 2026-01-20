import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 mb-8 animate-bounce">
                <Search size={40} />
            </div>

            <h1 className="text-9xl font-black text-gray-200 leading-none">404</h1>
            <div className="-mt-12 bg-white px-8 py-2 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900">Sayfa Bulunamadı</h2>
            </div>

            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-8 max-w-xs leading-relaxed">
                Aradığınız sayfa taşınmış veya silinmiş olabilir. Kaybolmuş hissetmeyin, sizi ana sayfaya götürelim.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-sm">
                <Link
                    href="/"
                    className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl"
                >
                    Ana Sayfaya Dön
                </Link>
                <Link
                    href="/admin"
                    className="flex-1 px-8 py-4 bg-white text-gray-900 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition"
                >
                    Panele Git
                </Link>
            </div>

            <div className="mt-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                    P2CGateway Sistemleri Aktif
                </div>
            </div>
        </div>
    );
}
