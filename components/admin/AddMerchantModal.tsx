'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Building2, Globe, CheckCircle2, Loader2 } from 'lucide-react';

interface AddMerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMerchantModal({ isOpen, onClose }: AddMerchantModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/merchants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, webhook_url: webhookUrl }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Firma eklenemedi.');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setName('');
                setWebhookUrl('');
                router.refresh();
            }, 2000);
        } catch (err: any) {
            console.error('Error adding merchant:', err);
            alert(err.message || 'Firma eklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Building2 size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Yeni Firma Ekle</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {success ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Firma Eklendi!</h3>
                                <p className="text-gray-500 text-sm mt-1">Firma başarıyla kaydedildi, yönlendiriliyorsunuz...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Firma Adı</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Örn: X Firması Limited"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Geri Dönüş (Webhook) URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://firma.com/api/callback"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium ml-1">Ödeme başarılı olduğunda sistemin bu adrese veri göndermesini istiyorsanız girin.</p>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        'Firmayı Oluştur'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
