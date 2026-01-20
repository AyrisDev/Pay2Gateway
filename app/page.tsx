'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, LayoutDashboard, Zap, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [randomAmount, setRandomAmount] = useState(150);
  const [refId, setRefId] = useState('DEMO-123');
  const [mounted, setMounted] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();

  const placeholders = ['P2C-X7R2B9', 'P2C-A1B2C3', 'MERCHANT-ID'];

  useEffect(() => {
    setMounted(true);
    setRandomAmount(Math.floor(Math.random() * 4950) + 50);
    setRefId(`DEMO-${Math.floor(Math.random() * 900) + 100}`);

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMerchantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (merchantId.trim()) {
      router.push(`/merchant/${merchantId.trim()}/login`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Mini Nav */}
      <nav className="absolute top-0 w-full py-8 px-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-black text-gray-900 tracking-tight text-lg">P2CGateway</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition">Sistem Paneli</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-16 text-center relative">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100/50">
          <Zap size={12} fill="currentColor" />
          <span>v1.2.0 Global Deployment</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tight mb-8">
          Ödemelerinizi <span className="text-blue-600">Tek Bir</span> <br /> Kanaldan Yönetin
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
          Sınırları aşan bir ödeme deneyimi. Stripe'ın küresel gücünü, Nuvei'nin esnekliğini ve <br className="hidden md:block" />
          kripto dünyasının özgürlüğünü tek bir entegrasyonla işinize katın. <br className="hidden md:block" />
          Her işlemde <strong>maksimum dönüşüm</strong>, her saniyede <strong>tam güvenlik</strong>.
        </p>

        <div className="flex flex-col items-center justify-center gap-10 mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/checkout?amount=${randomAmount}&currency=TRY&ref_id=${refId}&callback_url=http://localhost:3000`}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95"
            >
              {mounted ? `Canlı Test: ${randomAmount.toLocaleString('tr-TR')} ₺ Ödeme Sayfası` : 'Ödeme Sayfasını Test Et'}
            </Link>
          </div>

          <div className="h-px w-20 bg-gray-100"></div>

          {/* Merchant Portal Quick Access */}
          <div className="w-full max-w-md bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
            <div className="flex items-center gap-3 justify-center mb-2">
              <Building2 size={20} className="text-blue-600" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Firma Yönetim Portalı</h3>
            </div>
            <form onSubmit={handleMerchantLogin} className="flex gap-2">
              <input
                type="text"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder={`Örn: ${placeholders[placeholderIndex]}`}
                className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300"
              />
              <button
                type="submit"
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Kayıtlı firmanızın paneline erişmek için ID giriniz.</p>
          </div>
        </div>
      </header>

      {/* Supported Gateways */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Desteklenen Altyapılar</p>
          <h2 className="text-3xl font-black text-gray-900 mb-16">Global Ödeme Çözümleri ile Tam Entegrasyon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
            {['Stripe', 'Cryptomus', 'Nuvei', 'PayKings', 'SecurionPay'].map((brand) => (
              <div key={brand} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-xl text-gray-400">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Snippet Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          <div className="p-12 lg:p-20 flex-1 space-y-8">
            <h2 className="text-4xl font-black text-white leading-tight">Tek Satır Kodla Ödeme Almaya Başlayın</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              API dokümantasyonumuz sayesinde projelerinize saniyeler içinde ödeme kabiliyeti kazandırın.
              Karmaşık backend süreçlerini biz halledelim, siz işinizi büyütün.
            </p>
            <Link href="/admin/docs" className="inline-flex items-center gap-3 text-blue-400 font-bold hover:gap-5 transition-all">
              Dokümantasyonu İncele <Zap size={20} />
            </Link>
          </div>
          <div className="flex-1 bg-black/40 p-8 lg:p-12 font-mono text-sm leading-relaxed overflow-x-auto border-l border-white/5">
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <pre className="text-blue-300">
              {`// Ödeme Linki Oluşturun
const checkoutUrl = "https://p2cgateway.com/checkout";
const params = {
  merchant_id: "m_92183",
  amount: 250.00,
  currency: "TRY",
  ref_id: "ORDER_923",
  callback_url: "https://siteniz.com/succes"
};

// Müşteriyi yönlendirin
window.location.href = \`\${checkoutUrl}?\${new URLSearchParams(params)}\`;`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 bg-blue-50/50 p-20 rounded-[64px] border border-blue-100/50">
          <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">İşinizi Bugün Büyütün</h2>
          <p className="text-lg text-gray-600 mb-10">P2CGateway ile global pazarlara açılmak artık çok daha kolay.</p>
          <Link
            href="/admin"
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-200 uppercase tracking-widest"
          >
            Hemen Ücretsiz Başlayın
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-50 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <Zap size={14} fill="currentColor" />
          </div>
          <span className="font-black text-gray-900 tracking-tight">P2CGateway</span>
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 P2CGateway Platformu. Tüm hakları saklıdır.</p>
        <div className="pt-4">
          <a
            href="https://ayris.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-blue-600 transition"
          >
            Created by <span className="text-gray-400">AyrisTech</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
