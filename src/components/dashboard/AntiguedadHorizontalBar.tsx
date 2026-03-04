"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface AgingData {
    name: string;
    value: number;
}

export function AntiguedadHorizontalBar({
    data,
    color = "#10b981"
}: {
    data: AgingData[],
    color?: string
}) {
    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                barSize={16}
            >
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    width={60}
                />
                <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Monto']}
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
