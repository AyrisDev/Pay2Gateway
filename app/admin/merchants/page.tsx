'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Building2,
    Copy,
    ExternalLink,
    MoreVertical,
    Globe,
    Check,
    Pencil,
    Trash2,
    X
} from 'lucide-react';

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMerchant, setEditingMerchant] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchMerchants();
    }, []);

    const fetchMerchants = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/merchants');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setMerchants(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEditClick = (merchant: any) => {
        setEditingMerchant({ ...merchant });
        setIsEditModalOpen(true);
    };

    const handleUpdateMerchant = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/merchants/${editingMerchant.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editingMerchant.name,
                    webhook_url: editingMerchant.webhook_url,
                    payment_provider: editingMerchant.payment_provider,
                    provider_config: editingMerchant.provider_config
                })
            });
            if (!response.ok) throw new Error('Güncelleme başarısız.');

            await fetchMerchants();
            setIsEditModalOpen(false);
            setEditingMerchant(null);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteMerchant = async (id: string) => {
        if (!confirm('Bu firmayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            const response = await fetch(`/api/merchants/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Silme işlemi başarısız.');
            await fetchMerchants();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Firmalar (Merchants)</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ödeme alan tüm işletmeler</p>
                    </div>
                </div>

                <Link
                    href="/admin/merchants/new"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                    <Plus size={18} />
                    Yeni Firma Ekle
                </Link>
            </div>

            {/* Merchant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : merchants.map((m) => {
                    const identifier = m.short_id || m.id;
                    const paymentLink = typeof window !== 'undefined'
                        ? `${window.location.origin}/checkout?merchant_id=${identifier}&amount=0`
                        : `https://p2cgateway.com/checkout?merchant_id=${identifier}&amount=0`;

                    return (
                        <div key={m.id} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {m.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900">{m.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">ID: {identifier}</span>
                                            {m.short_id && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded border border-blue-100 uppercase tracking-tighter transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-700">Short Link Active</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEditClick(m)}
                                        className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Düzenle"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMerchant(m.id)}
                                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Sil"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* API Key Section */}
                                <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-transparent hover:border-gray-100 transition-colors">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">API Anahtarı (Secret Key)</label>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 bg-white px-4 py-2 rounded-xl text-[11px] font-mono text-gray-400 truncate border border-gray-100/50">
                                            {m.api_key || '••••••••••••••••'}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(m.api_key, m.id + '-key')}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {copiedId === m.id + '-key' ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Webhook Section */}
                                <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-transparent hover:border-gray-100 transition-colors">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Webhook URL</label>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-gray-600 truncate px-1">{m.webhook_url || 'Ayarlanmamış'}</span>
                                        <Globe size={14} className="text-gray-300 shrink-0" />
                                    </div>
                                </div>

                                {/* Payment Link Section */}
                                <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50 space-y-2">
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ödeme Linki</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-white px-4 py-2 rounded-xl text-[11px] font-mono text-gray-400 truncate border border-blue-100/30">
                                            {paymentLink}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentLink, m.id)}
                                            className="p-2 bg-white text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition shadow-sm shrink-0"
                                        >
                                            {copiedId === m.id ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">Bu linki tutar ve referans ekleyerek değiştirebilirsiniz.</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktif</span>
                                </div>
                                <a
                                    href={`/admin/transactions?merchant_id=${m.id}`}
                                    className="flex items-center gap-2 text-xs font-black text-[#2563EB] hover:underline"
                                >
                                    Tüm İşlemleri Gör
                                    <ExternalLink size={12} />
                                </a>
                                <Link
                                    href={`/merchant/${identifier}`}
                                    className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
                                >
                                    Firma Paneli
                                    <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {!isLoading && merchants.length === 0 && (
                    <div className="col-span-full p-20 bg-white rounded-[40px] border border-gray-100 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-200">
                            <Building2 size={40} />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <p className="text-lg font-black text-gray-900">Henüz firma bulunmuyor</p>
                            <p className="text-gray-400 text-sm mt-1 font-bold">İlk firmanızı ekleyerek ödeme almaya başlayın.</p>
                        </div>
                        <Link
                            href="/admin/merchants/new"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition shadow-xl shadow-gray-200"
                        >
                            <Plus size={20} />
                            Firma Ekleyerek Başlayın
                        </Link>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Firmayı Düzenle</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Firma bilgilerini güncelle</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateMerchant} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Firma Adı</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={editingMerchant?.name || ''}
                                                onChange={(e) => setEditingMerchant({ ...editingMerchant, name: e.target.value })}
                                                placeholder="Örn: Ayris Teknoloji"
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Ödeme Altyapısı (Gateway)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'stripe', name: 'Stripe' },
                                                { id: 'cryptomus', name: 'Cryptomus' },
                                                { id: 'nuvei', name: 'Nuvei' },
                                                { id: 'paykings', name: 'PayKings' },
                                                { id: 'securionpay', name: 'SecurionPay' },
                                            ].map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setEditingMerchant({ ...editingMerchant, payment_provider: p.id })}
                                                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${editingMerchant?.payment_provider === p.id
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    {p.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Webhook URL (Geri Dönüş)</label>
                                        <div className="relative">
                                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                            <input
                                                type="url"
                                                value={editingMerchant?.webhook_url || ''}
                                                onChange={(e) => setEditingMerchant({ ...editingMerchant, webhook_url: e.target.value })}
                                                placeholder="https://siteniz.com/webhook"
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium px-1">Ödeme başarılı olduğunda bu adrese bildirim gönderilecektir.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 text-gray-400 font-black text-sm uppercase tracking-widest hover:text-gray-600 transition"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
