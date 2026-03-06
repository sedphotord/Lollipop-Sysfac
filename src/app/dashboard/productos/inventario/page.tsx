"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Package, TrendingDown, TrendingUp, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";

export default function InventarioPage() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        try {
            const raw = companyStorage.get("products");
            const prods: any[] = raw ? JSON.parse(raw) : [];
            // Filter only physical products (not services) with price/cost info
            setItems(prods.filter(p => p.type !== "service" && (p.price || p.salePrice)));
        } catch { setItems([]); }
    }, []);

    const totalValCosto = items.reduce((a, i) => a + ((i.cost || 0) * (i.stock || 0)), 0);
    const totalValVenta = items.reduce((a, i) => a + (((i.price || i.salePrice || 0)) * (i.stock || 0)), 0);
    const margen = totalValCosto > 0 ? ((totalValVenta - totalValCosto) / totalValCosto * 100) : 0;
    const bajoStock = items.filter(i => (i.stock || 0) <= (i.minStock || i.stockMin || 3) && (i.stock || 0) > 0).length;
    const sinStock = items.filter(i => (i.stock || 0) === 0).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Valor de Inventario</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Análisis de costo vs. precio de venta de tu inventario físico.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Valor al Costo", v: `RD$ ${totalValCosto.toLocaleString()}`, i: Warehouse, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Valor al Precio Venta", v: `RD$ ${totalValVenta.toLocaleString()}`, i: TrendingUp, c: "text-emerald-600 bg-emerald-500/10" },
                    { l: "Margen Promedio", v: `${margen.toFixed(1)}%`, i: BarChart3, c: "text-violet-600 bg-violet-500/10" },
                    { l: "Stock Crítico", v: `${bajoStock + sinStock} productos`, i: TrendingDown, c: bajoStock + sinStock > 0 ? "text-rose-600 bg-rose-500/10" : "text-emerald-600 bg-emerald-500/10" },
                ].map((k, idx) => (
                    <Card key={idx} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                            <Package className="w-10 h-10 opacity-30" />
                            <p className="text-sm">No hay productos físicos registrados todavía.</p>
                            <p className="text-xs">Agrega productos desde la sección Gestión de Productos.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr className="text-left">
                                        <th className="py-3 px-4 font-semibold">Producto</th>
                                        <th className="py-3 px-4 text-right font-semibold">Stock</th>
                                        <th className="py-3 px-4 text-right font-semibold">Costo Unit.</th>
                                        <th className="py-3 px-4 text-right font-semibold">Precio Venta</th>
                                        <th className="py-3 px-4 text-right font-semibold">Val. Costo</th>
                                        <th className="py-3 px-4 text-right font-semibold">Val. Venta</th>
                                        <th className="py-3 px-4 text-right font-semibold">Margen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {items.map((item, i) => {
                                        const cost = item.cost || 0;
                                        const price = item.price || item.salePrice || 0;
                                        const stock = item.stock || 0;
                                        const minStock = item.minStock || item.stockMin || 3;
                                        const m = cost > 0 ? ((price - cost) / cost * 100) : 0;
                                        return (
                                            <tr key={i} className="hover:bg-muted/20 transition-colors">
                                                <td className="py-3 px-4 font-semibold">
                                                    {item.name}
                                                    {stock === 0 && <Badge variant="outline" className="ml-2 text-[10px] text-red-600 border-red-500/30 bg-red-500/10">Sin stock</Badge>}
                                                    {stock > 0 && stock <= minStock && <Badge variant="outline" className="ml-2 text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">Stock bajo</Badge>}
                                                </td>
                                                <td className={cn("py-3 px-4 text-right tabular-nums font-medium", stock === 0 ? "text-red-500" : stock <= minStock ? "text-amber-600" : "")}>{stock}</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">RD$ {cost.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right tabular-nums">RD$ {price.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right tabular-nums font-semibold">RD$ {(cost * stock).toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right tabular-nums font-semibold text-emerald-600">RD$ {(price * stock).toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right font-bold text-violet-600">{m.toFixed(1)}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
