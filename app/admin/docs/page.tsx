'use client';

import React from 'react';
import {
    Code2,
    Terminal,
    Globe,
    Webhook,
    Copy,
    Check,
    ArrowRight,
    Zap,
    ShieldCheck,
    MessageSquare
} from 'lucide-react';

export default function DocumentationPage() {
    const [copied, setCopied] = React.useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const checkoutUrlCode = `https://p2cgateway.com/checkout?merchant_id=YOUR_MERCHANT_ID&amount=100&currency=TRY&ref_id=ORDER_123&callback_url=https://yoursite.com/success`;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">API Dokümantasyonu</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-3 px-1">P2CGateway Entegrasyon Rehberi</p>
            </div>

            {/* Quick Start Card */}
            <div className="bg-blue-600 rounded-[40px] p-12 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-2xl font-black">Hızlı Başlangıç</h2>
                    </div>
                    <p className="text-blue-100 text-lg max-w-2xl leading-relaxed font-medium">
                        P2CGateway'i projenize entegre etmek için sadece bir URL oluşturmanız yeterlidir.
                        Karmaşık SDK'lar veya kütüphanelerle uğraşmanıza gerek yok.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Integration Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Method 1: Checkout Redirect */}
                <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">1. Ödeme Sayfasına Yönlendirme</h3>
                    </div>

                    <p className="text-gray-500 font-medium leading-relaxed">
                        Müşterinizi ödeme yapması için aşağıdaki URL yapısını kullanarak P2CGateway checkout sayfasına yönlendirin.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group">
                            <code className="text-xs font-mono text-gray-600 break-all leading-relaxed">
                                {checkoutUrlCode}
                            </code>
                            <button
                                onClick={() => copyToClipboard(checkoutUrlCode, 'url')}
                                className="absolute right-4 top-4 p-2 bg-white rounded-xl shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {copied === 'url' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Parametreler</h4>
                        <div className="space-y-3">
                            {[
                                { key: 'merchant_id', desc: 'Firma ID\'niz (Firmalar sayfasından alabilirsiniz)' },
                                { key: 'amount', desc: 'Ödeme tutarı (Örn: 100.00)' },
                                { key: 'currency', desc: 'Para birimi (TRY, USD, EUR)' },
                                { key: 'ref_id', desc: 'Sizin sisteminizdeki sipariş numarası' },
                                { key: 'callback_url', desc: 'Ödeme sonrası yönlendirilecek adres' },
                            ].map((p) => (
                                <div key={p.key} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <span className="text-xs font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">{p.key}</span>
                                    <span className="text-xs text-gray-500 font-medium">{p.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Method 2: Webhooks */}
                <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                            <Webhook size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">2. Webhook Bildirimleri</h3>
                    </div>

                    <p className="text-gray-500 font-medium leading-relaxed">
                        Ödeme tamamlandığında sistemimiz otomatik olarak firmanıza tanımlı olan Webhook URL'ine bir POST isteği gönderir.
                    </p>

                    <div className="bg-gray-900 rounded-3xl p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">JSON Payload Örneği</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <pre className="text-xs font-mono text-blue-400 overflow-x-auto leading-relaxed">
                            {`{
  "status": "succeeded",
  "transaction_id": "tx_821...",
  "ref_id": "ORDER-123",
  "amount": 100.00,
  "currency": "TRY",
  "customer": {
    "name": "Ahmet Yılmaz",
    "phone": "555..."
  }
}`}
                        </pre>
                    </div>

                    <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 space-y-3">
                        <h4 className="text-orange-700 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Güvenlik Notu
                        </h4>
                        <p className="text-orange-600/80 text-xs font-medium leading-normal">
                            Webhook isteklerinin P2CGateway'den geldiğini doğrulamak için API Key'inizi HTTP başlığında (X-P2C-Signature) kontrol etmelisiniz.
                        </p>
                    </div>
                </div>
            </div>

            {/* API Resources Section */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Terminal size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Geliştirici Kaynakları</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="p-8 bg-gray-50 rounded-[32px] text-left hover:bg-blue-50 group transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                            <Code2 size={20} />
                        </div>
                        <h4 className="font-black text-gray-900 mb-2">SDK & Kütüphaneler</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Çok Yakında</p>
                    </button>
                    <button className="p-8 bg-gray-50 rounded-[32px] text-left hover:bg-emerald-50 group transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-4">
                            <Globe size={20} />
                        </div>
                        <h4 className="font-black text-gray-900 mb-2">API Referansı</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Görüntüle</p>
                    </button>
                    <button className="p-8 bg-gray-50 rounded-[32px] text-left hover:bg-purple-50 group transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all mb-4">
                            <MessageSquare size={20} />
                        </div>
                        <h4 className="font-black text-gray-900 mb-2">Teknik Destek</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Geliştirici Topluluğu</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
