'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface AnalyticsBarChartProps {
    data: {
        label: string;
        amount: number;
    }[];
}

export default function AnalyticsBarChart({ data }: AnalyticsBarChartProps) {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="#F1F5F9"
                    />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#F8FAFC' }}
                    />
                    <Bar
                        dataKey="amount"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#2563EB" />
                        ))}
                    </Bar>
                </BarChart>
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
