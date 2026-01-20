'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function TransactionSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (searchTerm === currentQ) return;

        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }
            router.push(`/admin/transactions?${params.toString()}`);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchParams, router]);

    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="İşlem ID veya referans ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
            />
        </div>
    );
}
