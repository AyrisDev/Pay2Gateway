'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface TransactionChartProps {
    data: {
        displayDate: string;
        amount: number;
    }[];
}

export default function TransactionChart({ data }: TransactionChartProps) {
    return (
        <div className="h-72 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#F1F5F9"
                    />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                        interval={3} // Show fewer labels for clarity
                    />
                    <YAxis
                        hide
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#2563EB"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white">
                    {payload[0].value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </p>
            </div>
        );
    }
    return null;
}
