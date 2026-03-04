"use client";

import { useTheme } from "next-themes";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, CartesianGrid } from "recharts";

const data = [
    { name: "Ene", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 2000 },
    { name: "Abr", total: Math.floor(Math.random() * 5000) + 2000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 4000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 3000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 5000 },
    { name: "Ago", total: Math.floor(Math.random() * 5000) + 4000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 6000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 7000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 8000 },
    { name: "Dic", total: Math.floor(Math.random() * 5000) + 9000 },
];

export function OverviewChart() {
    const { theme } = useTheme();

    // Custom colors based on the theme we set in globals.css
    const colorPrimary = "hsl(180 85% 35%)";
    const colorGradientEnd = "hsl(180 85% 20%)";

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colorPrimary} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `RD$${value}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                    type="monotone"
                    dataKey="total"
                    stroke={colorPrimary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: colorGradientEnd }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
