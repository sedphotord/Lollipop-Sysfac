"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
    { name: "Ene", ingresos: 4000, gastos: 2400 },
    { name: "Feb", ingresos: 3000, gastos: 1398 },
    { name: "Mar", ingresos: 2000, gastos: 9800 },
    { name: "Abr", ingresos: 2780, gastos: 3908 },
    { name: "May", ingresos: 1890, gastos: 4800 },
    { name: "Jun", ingresos: 2390, gastos: 3800 },
    { name: "Jul", ingresos: 3490, gastos: 4300 },
    { name: "Ago", ingresos: 4490, gastos: 3800 },
    { name: "Sep", ingresos: 5490, gastos: 4300 },
    { name: "Oct", ingresos: 4490, gastos: 2800 },
    { name: "Nov", ingresos: 3490, gastos: 2300 },
    { name: "Dic", ingresos: 6490, gastos: 3300 },
];

export function IngresosGastosBar() {
    const { theme } = useTheme();

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="gastos" name="Gastos" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
        </ResponsiveContainer>
    );
}
