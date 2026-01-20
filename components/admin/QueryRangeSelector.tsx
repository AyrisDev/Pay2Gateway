'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QueryRangeSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get('range') || '30';

    const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRange = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('range', newRange);
        router.push(`/admin?${params.toString()}`);
    };

    return (
        <select
            value={currentRange}
            onChange={handleRangeChange}
            className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <option value="30">Son 30 Gün</option>
            <option value="7">Son 7 Gün</option>
            <option value="14">Son 14 Gün</option>
        </select>
    );
}
