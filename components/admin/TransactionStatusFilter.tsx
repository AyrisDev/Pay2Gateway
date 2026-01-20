'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function TransactionStatusFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get('status') || '';

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === currentStatus) return;

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('status', value);
        } else {
            params.delete('status');
        }
        router.push(`/admin/transactions?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl">
            <Filter size={18} className="text-gray-400" />
            <select
                value={currentStatus}
                onChange={handleStatusChange}
                className="bg-transparent border-none text-sm font-bold text-gray-600 outline-none cursor-pointer"
            >
                <option value="">Tüm Durumlar</option>
                <option value="succeeded">Başarılı</option>
                <option value="pending">Bekliyor</option>
                <option value="failed">Hatalı</option>
            </select>
        </div>
    );
}
