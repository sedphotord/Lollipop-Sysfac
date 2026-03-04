"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
    { name: "Nómina", value: 12080 },
    { name: "Mercadeo", value: 6040 },
    { name: "Alquiler oficina", value: 4530 },
    { name: "Misceláneo", value: 2416 },
    { name: "Todo lo demás", value: 9060 },
];

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#cbd5e1"];

export function ResumenGastosDonut() {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: any) => `RD$ ${Number(value).toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
