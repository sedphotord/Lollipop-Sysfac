"use client";

import React, { useState, Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Package, Calendar, Search, History, RefreshCcw, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock Product List
const MOCK_PRODUCTS = [
    { id: "PROD-101", nombre: "Monitor Dell 24\"", sku: "MD24-001", stock: 15, costo: 6500, valor: 97500 },
    { id: "PROD-102", nombre: "Teclado Mecánico RGB", sku: "TM-RGB-02", stock: 32, costo: 2100, valor: 67200 },
    { id: "PROD-103", nombre: "Mouse Inalámbrico Logitech", sku: "ML-WL-05", stock: 0, costo: 850, valor: 0 },
    { id: "PROD-104", nombre: "Laptop Lenovo ThinkPad", sku: "LL-TP-08", stock: 5, costo: 45000, valor: 225000 },
];

// Mock Kardex Records (Simulating database history ordered by date ASC)
const MOCK_KARDEX_RECORDS = [
    { id: "K-001", date: "2024-10-01", type: "entrada", qty: 20, cost: 6500, ref: "Compra FC-1020", product: "PROD-101" },
    { id: "K-002", date: "2024-10-05", type: "salida", qty: 2, cost: 6500, ref: "Venta B01-0001", product: "PROD-101" },
    { id: "K-003", date: "2024-10-12", type: "salida", qty: 5, cost: 6500, ref: "Venta B01-0005", product: "PROD-101" },
    { id: "K-004", date: "2024-10-12", type: "entrada_ajuste", qty: 2, cost: 6500, ref: "Devolución NC-1", product: "PROD-101" },

    { id: "K-005", date: "2024-09-15", type: "entrada", qty: 50, cost: 2100, ref: "Inv. Inicial", product: "PROD-102" },
    { id: "K-006", date: "2024-09-18", type: "salida", qty: 10, cost: 2100, ref: "Venta B32-0040", product: "PROD-102" },
    { id: "K-007", date: "2024-10-02", type: "salida_ajuste", qty: 8, cost: 2100, ref: "Ajuste Merma", product: "PROD-102" },

    { id: "K-008", date: "2024-08-01", type: "entrada", qty: 10, cost: 45000, ref: "Compra FC-099", product: "PROD-104" },
    { id: "K-009", date: "2024-08-20", type: "salida", qty: 3, cost: 45000, ref: "Venta B01-0002", product: "PROD-104" },
    { id: "K-010", date: "2024-11-05", type: "salida", qty: 2, cost: 45000, ref: "Venta B01-0010", product: "PROD-104" },
];

function KardexContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryProductId = searchParams.get('productId');

    const [selectedProductId, setSelectedProductId] = useState<string>(queryProductId || "");
    const [searchTerm, setSearchTerm] = useState("");

    const activeProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);

    // Compute running balance based on history
    const kardexView = useMemo(() => {
        if (!selectedProductId) return [];

        const records = MOCK_KARDEX_RECORDS.filter(k => k.product === selectedProductId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let runningQty = 0;
        let runningValue = 0;

        return records.map(record => {
            const isEntrada = record.type.includes("entrada");

            if (isEntrada) {
                runningQty += record.qty;
                runningValue += (record.qty * record.cost);
            } else {
                runningQty -= record.qty;
                runningValue -= (record.qty * record.cost);
            }

            return {
                ...record,
                isEntrada,
                runningQty,
                runningValue
            };
        });
    }, [selectedProductId]);


    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'entrada': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-2 py-0"><ArrowDownRight className="w-3 h-3 mr-1" /> Compra/Entrada</Badge>;
            case 'entrada_ajuste': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 py-0"><RefreshCcw className="w-3 h-3 mr-1" /> Ajuste/Devolución (+)</Badge>;
            case 'salida': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-2 py-0"><ArrowUpRight className="w-3 h-3 mr-1" /> Venta/Salida</Badge>;
            case 'salida_ajuste': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-2 py-0"><RefreshCcw className="w-3 h-3 mr-1" /> Ajuste/Merma (-)</Badge>;
            default: return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-background border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard/productos')} className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-500" />
                            Kardex (Historial de Movimientos)
                        </h1>
                        <p className="text-sm text-muted-foreground">Trazabilidad completa de inventario por producto.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Exportar Excel
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 px-4 space-y-6">

                {/* Filters */}
                <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger className="w-full pl-10 h-10 border-border bg-white rounded-xl">
                                <SelectValue placeholder="Selecciona un producto para ver su Kardex..." />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_PRODUCTS.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{p.sku} - {p.nombre}</span>
                                            <span className="text-muted-foreground ml-4">{p.stock} unds</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Optional Date Range could go here */}
                </div>

                {/* Content Area */}
                {!selectedProductId ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/60 rounded-2xl bg-white/50 p-8 text-center mt-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-blue-100">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Selecciona un Producto</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Utiliza el buscador superior para elegir un producto y explorar todos sus movimientos históricos (Entradas, Salidas, Ajustes).</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Widget */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
                                <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
                                <p className="text-blue-100 text-sm font-medium">Producto Activo</p>
                                <h3 className="text-xl font-bold mt-1 max-w-[90%] truncate" title={activeProduct?.nombre}>{activeProduct?.nombre}</h3>
                                <p className="text-blue-200 text-sm mt-3 font-mono opacity-80">{activeProduct?.sku}</p>
                            </div>

                            <div className="bg-white border rounded-2xl p-5 shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Costo Promedio (Actual)</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">RD$ {activeProduct?.costo.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            </div>

                            <div className="bg-white border rounded-2xl p-5 shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Existencia (Saldo Físico)</p>
                                <h3 className={cn("text-2xl font-bold mt-1", activeProduct?.stock === 0 ? "text-red-500" : "text-emerald-600")}>
                                    {activeProduct?.stock} unds
                                </h3>
                            </div>

                            <div className="bg-white border rounded-2xl p-5 shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Valoración de Inventario</p>
                                <h3 className="text-2xl font-bold mt-1 text-foreground">RD$ {activeProduct?.valor.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            </div>
                        </div>

                        {/* Kardex Ledger Table */}
                        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                                <h3 className="font-semibold">Libro Auxiliar (Ledger)</h3>
                                <span className="text-xs text-muted-foreground">Mostrando {kardexView.length} movimientos</span>
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
                                            <th className="px-4 py-3 text-right font-bold bg-slate-50">Saldo Valorado (RD$)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y relative">
                                        {kardexView.length > 0 ? kardexView.map((row, index) => (
                                            <tr key={index} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{row.date}</td>
                                                <td className="px-4 py-3 font-medium whitespace-nowrap">{row.ref}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{getTypeBadge(row.type)}</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{(row.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>

                                                {/* Entradas column */}
                                                <td className="px-4 py-3 text-center font-semibold text-blue-600 bg-blue-50/10">
                                                    {row.isEntrada ? `+${row.qty}` : "-"}
                                                </td>

                                                {/* Salidas column */}
                                                <td className="px-4 py-3 text-center font-semibold text-amber-600 bg-amber-50/10">
                                                    {!row.isEntrada ? `-${row.qty}` : "-"}
                                                </td>

                                                {/* Saldo Fisico running */}
                                                <td className="px-4 py-3 text-center font-bold bg-slate-50 border-l border-slate-100 tabular-nums">
                                                    {row.runningQty}
                                                </td>

                                                {/* Saldo Valorado running */}
                                                <td className="px-4 py-3 text-right font-medium text-muted-foreground bg-slate-50 tabular-nums">
                                                    {row.runningValue.toLocaleString()}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                                    No se encontraron movimientos para este producto.
                                                </td>
                                            </tr>
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
