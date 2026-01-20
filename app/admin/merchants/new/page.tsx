'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Globe,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Smartphone,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function NewMerchantPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [paymentProvider, setPaymentProvider] = useState('stripe');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/merchants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    webhook_url: webhookUrl,
                    payment_provider: paymentProvider
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Firma eklenemedi.');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/merchants');
                router.refresh();
            }, 2000);
        } catch (err: any) {
            alert(err.message || 'Firma eklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center text-emerald-500 mx-auto shadow-lg shadow-emerald-100">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-gray-900">Firma Başarıyla Oluşturuldu!</h2>
                        <p className="text-gray-500 font-medium text-lg">Yönlendiriliyorsunuz...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/merchants"
                        className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-md transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Yeni Firma Kaydı</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Sisteme yeni bir işletme entegre edin</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm space-y-8">
                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">İşletme / Firma Adı</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                                    <Building2 size={20} />
                                </div>
                                <input
                                    required
                                    type="text"
                                    placeholder="Örn: Global Teknoloji A.Ş."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-3xl text-base font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Provider Selection */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ödeme Altyapısı (Gateway)</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'stripe', name: 'Stripe', icon: CreditCard, desc: 'Global kart ödemeleri' },
                                    { id: 'cryptomus', name: 'Cryptomus', icon: Globe, desc: 'Kripto Para' },
                                    { id: 'nuvei', name: 'Nuvei', icon: ShieldCheck, desc: 'E-commerce Experts' },
                                    { id: 'paykings', name: 'PayKings', icon: ShieldCheck, desc: 'High Risk Specialist' },
                                    { id: 'seurionpay', name: 'SecurionPay', icon: CreditCard, desc: 'Simple Payments' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPaymentProvider(p.id)}
                                        className={`p-6 rounded-3xl border-2 text-left transition-all space-y-2 ${paymentProvider === p.id
                                            ? 'border-blue-500 bg-blue-50/50'
                                            : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentProvider === p.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                            <p.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-gray-900 leading-tight">{p.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{p.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Webhook Input */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Geri Dönüş (Webhook) URL</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                                    <Globe size={20} />
                                </div>
                                <input
                                    type="url"
                                    placeholder="https://firma.com/api/callback"
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-3xl text-base font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed px-1">
                                Ödeme sonuçlarını gerçek zamanlı almak için firmanın API uç noktasını buraya girebilirsiniz. (Opsiyonel)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading || !name}
                                className="w-full bg-[#2563EB] text-white py-6 rounded-3xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <span>Firmayı Kaydet ve Ödeme Almaya Başla</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-xl shadow-blue-100">
                        <h4 className="font-black text-xl mb-4">Hızlı Başlangıç</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <p className="text-sm font-medium leading-normal opacity-90">Firma ismi sisteme özel bir ID ile kaydedilir.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Smartphone size={16} />
                                </div>
                                <p className="text-sm font-medium leading-normal opacity-90">Kayıt sonrası hemen ödeme linki oluşturulur.</p>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-sm font-medium leading-normal opacity-90">Tüm işlemler 256-bit SSL ile korunur.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-900">
                            <CreditCard size={20} className="text-blue-600" />
                            <h4 className="font-black">Desteklenen Kartlar</h4>
                        </div>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed">
                            Visa, Mastercard, Troy ve tüm yerel banka kartları ile ödeme alabilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
