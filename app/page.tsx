'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CreditCard, LayoutDashboard, Zap } from 'lucide-react';

export default function Home() {
  const [randomAmount, setRandomAmount] = useState(150);
  const [refId, setRefId] = useState('DEMO-123');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Random amount between 50 and 5000
    setRandomAmount(Math.floor(Math.random() * 4950) + 50);
    // Random ref id
    setRefId(`DEMO-${Math.floor(Math.random() * 900) + 100}`);
  }, []);

  // Return a static version or null during SSR to avoid mismatch
  // Or just use the state which will be '150' and 'DEMO-123' on server
  // and then update on client. The mismatch happens because of Math.random() in JSX.

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
          <Zap size={16} />
          <span>v1.0.0 Yayında</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
          Ödemelerinizi <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">froyd</span> ile Güvenceye Alın
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Stripe altyapısı ile projelerinize kolayca ödeme geçidi ekleyin. Merkezi yönetim paneli ile tüm işlemlerinizi tek bir yerden takip edin.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/checkout?amount=${randomAmount}&currency=TRY&ref_id=${refId}&callback_url=http://localhost:3000`}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {mounted ? `Test Ödemesi Başlat (${randomAmount.toLocaleString('tr-TR')} ₺)` : 'Ödeme Sayfasını Test Et'}
          </Link>
          <Link
            href="/admin"
            className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-gray-200 transition"
          >
            Admin Panelini Gör
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Güvenli Altyapı</h3>
            <p className="text-gray-600 leading-relaxed">
              Stripe Elements kullanarak kart bilgilerini asla sunucularınızda saklamazsınız. Tam güvenlik garantisi.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Dinamik Ödeme</h3>
            <p className="text-gray-600 leading-relaxed">
              Herhangi bir URL parametresi ile ödeme başlatın. Projelerinize entegre etmek sadece bir dakika sürer.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Merkezi Takip</h3>
            <p className="text-gray-600 leading-relaxed">
              Tüm projelerinizden gelen ödemeleri tek bir admin panelinden, anlık grafikler ve raporlarla izleyin.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">© 2026 froyd Payment Platforms. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
