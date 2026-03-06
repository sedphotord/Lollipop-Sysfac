"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Package, Calendar, Search, History, RefreshCcw, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";

// Build kardex from real data: adjustments + invoice_emitted items
function buildKardexFromRealData(productId: string, products: any[]) {
    const entries: any[] = [];

    // Load adjustment movements
    try {
        const adjustments: any[] = JSON.parse(companyStorage.get("inventory_adjustments") || "[]");
        adjustments.forEach(adj => {
            (adj.items || []).forEach((item: any) => {
                if (item.productId === productId || item.id === productId) {
                    entries.push({
                        id: `ADJ-${adj.id}-${productId}`,
                        date: adj.date || adj.fecha || adj.createdAt?.split("T")[0] || "—",
                        type: adj.type === "entrada" ? "entrada" : adj.type === "salida" ? "salida" : item.qty > 0 ? "entrada_ajuste" : "salida_ajuste",
                        qty: Math.abs(item.qty || item.cantidad || 0),
                        cost: item.cost || item.costo || 0,
                        ref: `Ajuste ${adj.id}`,
                    });
                }
            });
        });
    } catch { }

    // Load invoice items (sales = salida)
    try {
        const invoices: any[] = JSON.parse(companyStorage.get("invoice_emitted") || "[]");
        invoices.forEach(inv => {
            (inv.items || inv.lineas || []).forEach((item: any) => {
                if (item.productId === productId || item.id === productId) {
                    entries.push({
                        id: `INV-${inv.id}-${productId}`,
                        date: inv.date || inv.fecha || "—",
                        type: "salida",
                        qty: Math.abs(item.quantity || item.cantidad || 0),
                        cost: item.unitPrice || item.precio || item.precioVenta || 0,
                        ref: `Factura ${inv.ncf || inv.id}`,
                    });
                }
            });
        });
    } catch { }

    // Sort by date ASC
    entries.sort((a, b) => a.date.localeCompare(b.date));

    let runningQty = 0;
    let runningValue = 0;
    return entries.map(r => {
        const isEntrada = r.type.includes("entrada");
        if (isEntrada) { runningQty += r.qty; runningValue += r.qty * r.cost; }
        else { runningQty -= r.qty; runningValue -= r.qty * r.cost; }
        return { ...r, isEntrada, runningQty, runningValue };
    });
}

function KardexContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryProductId = searchParams.get("productId");
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>(queryProductId || "");

    useEffect(() => {
        try { setProducts(JSON.parse(companyStorage.get("products") || "[]")); } catch { }
    }, []);

    const activeProduct = products.find(p => (p.id || p.productId) === selectedProductId);

    const kardexView = useMemo(() => {
        if (!selectedProductId || !activeProduct) return [];
        return buildKardexFromRealData(selectedProductId, products);
    }, [selectedProductId, products, activeProduct]);

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "entrada": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-2 py-0"><ArrowDownRight className="w-3 h-3 mr-1" /> Compra/Entrada</Badge>;
            case "entrada_ajuste": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 py-0"><RefreshCcw className="w-3 h-3 mr-1" /> Ajuste (+)</Badge>;
            case "salida": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-2 py-0"><ArrowUpRight className="w-3 h-3 mr-1" /> Venta/Salida</Badge>;
            case "salida_ajuste": return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-2 py-0"><RefreshCcw className="w-3 h-3 mr-1" /> Ajuste (-)</Badge>;
            default: return <Badge variant="outline">{type}</Badge>;
        }
    };

    function exportCSV() {
        const headers = ["Fecha", "Referencia", "Tipo", "Costo Unit.", "Entradas", "Salidas", "Saldo Físico", "Saldo Valorado"];
        const rows = kardexView.map(r => [r.date, r.ref, r.type, r.cost, r.isEntrada ? r.qty : "", !r.isEntrada ? r.qty : "", r.runningQty, r.runningValue]);
        const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v ?? "")}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `kardex_${selectedProductId}.csv`; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="min-h-screen bg-muted/20 pb-20 animate-in fade-in duration-500">
            <div className="bg-background border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/dashboard/productos")} className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2"><History className="w-5 h-5 text-blue-500" />Kardex (Historial de Movimientos)</h1>
                        <p className="text-sm text-muted-foreground">Trazabilidad completa de inventario por producto.</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2" onClick={exportCSV} disabled={!selectedProductId}><Download className="w-4 h-4" /> Exportar CSV</Button>
            </div>

            <div className="max-w-6xl mx-auto mt-8 px-4 space-y-6">
                <div className="bg-card border rounded-2xl p-4 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger className="w-full pl-10 h-10 border-border rounded-xl">
                                <SelectValue placeholder={products.length === 0 ? "No hay productos en inventario" : "Selecciona un producto para ver su Kardex..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(p => (
                                    <SelectItem key={p.id || p.productId} value={p.id || p.productId}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{p.sku || p.code || p.id} — {p.nombre || p.name}</span>
                                            <span className="text-muted-foreground ml-4">{p.stock ?? p.quantity ?? 0} unds</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {!selectedProductId ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/60 rounded-2xl bg-white/50 p-8 text-center mt-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-blue-100"><Package className="w-8 h-8" /></div>
                        <h3 className="text-lg font-semibold text-foreground">Selecciona un Producto</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Utiliza el buscador superior para elegir un producto y explorar todos sus movimientos históricos.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                                <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
                                <p className="text-blue-100 text-sm font-medium">Producto Activo</p>
                                <h3 className="text-xl font-bold mt-1 max-w-[90%] truncate" title={activeProduct?.nombre || activeProduct?.name}>{activeProduct?.nombre || activeProduct?.name}</h3>
                                <p className="text-blue-200 text-sm mt-3 font-mono opacity-80">{activeProduct?.sku || activeProduct?.code || activeProduct?.id}</p>
                            </div>
                            <div className="bg-white border rounded-2xl p-5 shadow-sm"><p className="text-muted-foreground text-sm font-medium">Costo Promedio</p><h3 className="text-2xl font-bold mt-1">RD$ {(activeProduct?.costo || activeProduct?.cost || activeProduct?.precio || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</h3></div>
                            <div className="bg-white border rounded-2xl p-5 shadow-sm"><p className="text-muted-foreground text-sm font-medium">Existencia Actual</p><h3 className={cn("text-2xl font-bold mt-1", (activeProduct?.stock ?? activeProduct?.quantity ?? 0) === 0 ? "text-red-500" : "text-emerald-600")}>{activeProduct?.stock ?? activeProduct?.quantity ?? 0} unds</h3></div>
                            <div className="bg-white border rounded-2xl p-5 shadow-sm"><p className="text-muted-foreground text-sm font-medium">Movimientos</p><h3 className="text-2xl font-bold mt-1">{kardexView.length}</h3></div>
                        </div>

                        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                                <h3 className="font-semibold">Libro Auxiliar (Ledger)</h3>
                                <span className="text-xs text-muted-foreground">
                                    {kardexView.length === 0 ? "Sin movimientos registrados" : `${kardexView.length} movimientos`}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 border-b text-xs uppercase text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Fecha</th>
                                            <th className="px-4 py-3 text-left">Documento / Ref</th>
                                            <th className="px-4 py-3 text-left">Tipo de Mov.</th>
                                            <th className="px-4 py-3 text-right">Costo Unit.</th>
                                            <th className="px-4 py-3 text-center bg-blue-50/50">Entradas</th>
                                            <th className="px-4 py-3 text-center bg-amber-50/50">Salidas</th>
                                            <th className="px-4 py-3 text-center font-bold bg-slate-50 border-l">Saldo Físico</th>
                                            <th className="px-4 py-3 text-right font-bold bg-slate-50">Saldo Valorado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {kardexView.length > 0 ? kardexView.map((row, index) => (
                                            <tr key={index} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground tabular-nums flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{row.date}</td>
                                                <td className="px-4 py-3 font-medium whitespace-nowrap">{row.ref}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{getTypeBadge(row.type)}</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{(row.cost || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-3 text-center font-semibold text-blue-600 bg-blue-50/10">{row.isEntrada ? `+${row.qty}` : "—"}</td>
                                                <td className="px-4 py-3 text-center font-semibold text-amber-600 bg-amber-50/10">{!row.isEntrada ? `-${row.qty}` : "—"}</td>
                                                <td className="px-4 py-3 text-center font-bold bg-slate-50 border-l border-slate-100 tabular-nums">{row.runningQty}</td>
                                                <td className="px-4 py-3 text-right font-medium text-muted-foreground bg-slate-50 tabular-nums">{row.runningValue.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No se encontraron movimientos. Los ajustes de inventario y facturas emitidas aparecerán aquí.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function KardexPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Cargando Kardex...</div>}>
            <KardexContent />
        </Suspense>
    );
}
