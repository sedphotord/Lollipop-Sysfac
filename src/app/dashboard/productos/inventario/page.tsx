"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Package, Plus, TrendingDown, TrendingUp, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
    { name: "Laptop Dell XPS 15", costo: 65000, precio: 85000, stock: 8, minStock: 3 },
    { name: "Monitor Samsung 27\"", costo: 24000, precio: 32000, stock: 2, minStock: 2 },
    { name: "UPS APC 1500VA", costo: 14000, precio: 18000, stock: 5, minStock: 2 },
    { name: "Teclado Mecánico Logitech", costo: 6500, precio: 8500, stock: 0, minStock: 3 },
    { name: "Libro de Contabilidad", costo: 800, precio: 1500, stock: 24, minStock: 10 },
];

export default function InventarioPage() {
    const totalValCosto = ITEMS.reduce((a, i) => a + (i.costo * i.stock), 0);
    const totalValVenta = ITEMS.reduce((a, i) => a + (i.precio * i.stock), 0);
    const margen = totalValCosto > 0 ? ((totalValVenta - totalValCosto) / totalValCosto * 100) : 0;
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Valor de Inventario</h2><p className="text-muted-foreground mt-1 text-sm">Análisis de costo vs. precio de venta de tu inventario físico.</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { l: "Valor al Costo", v: `RD$ ${totalValCosto.toLocaleString()}`, i: Warehouse, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Valor al Precio Venta", v: `RD$ ${totalValVenta.toLocaleString()}`, i: TrendingUp, c: "text-emerald-600 bg-emerald-500/10" },
                    { l: "Margen Promedio", v: `${margen.toFixed(1)}%`, i: BarChart3, c: "text-violet-600 bg-violet-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b"><tr className="text-left"><th className="py-3 px-4 font-semibold">Producto</th><th className="py-3 px-4 text-right font-semibold">Stock</th><th className="py-3 px-4 text-right font-semibold">Costo Unit.</th><th className="py-3 px-4 text-right font-semibold">Precio Venta</th><th className="py-3 px-4 text-right font-semibold">Val. Costo</th><th className="py-3 px-4 text-right font-semibold">Val. Venta</th><th className="py-3 px-4 text-right font-semibold">Margen</th></tr></thead>
                            <tbody className="divide-y divide-border/60">
                                {ITEMS.map((item, i) => {
                                    const m = item.costo > 0 ? ((item.precio - item.costo) / item.costo * 100) : 0;
                                    return (
                                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                                            <td className="py-3 px-4 font-semibold">
                                                {item.name}
                                                {item.stock <= item.minStock && <Badge variant="outline" className="ml-2 text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">Stock bajo</Badge>}
                                            </td>
                                            <td className={cn("py-3 px-4 text-right tabular-nums font-medium", item.stock === 0 ? 'text-red-500' : item.stock <= item.minStock ? 'text-amber-600' : '')}>{item.stock}</td>
                                            <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">RD$ {item.costo.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right tabular-nums">RD$ {item.precio.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right tabular-nums font-semibold">RD$ {(item.costo * item.stock).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right tabular-nums font-semibold text-emerald-600">RD$ {(item.precio * item.stock).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-right font-bold text-violet-600">{m.toFixed(1)}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
