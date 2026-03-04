"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ArrowDown, ArrowUp, Save, Search, Plus, Trash2, Calendar, FileText, CheckCircle2, Box, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock Products Catalog for selection
const MOCK_PRODUCTS = [
    { id: "P-001", code: "LT-XPS15", name: "Laptop Dell XPS 15", price: 125000, cost: 95000, stock: 15, unit: "und" },
    { id: "P-002", code: "KB-LOGI", name: "Teclado Mecánico Logitech", price: 4500, cost: 2800, stock: 42, unit: "und" },
    { id: "P-003", code: "MO-SM27", name: "Monitor Samsung 27\"", price: 18500, cost: 14000, stock: 8, unit: "und" },
    { id: "P-004", code: "UP-APC", name: "UPS APC 1500VA", price: 9550, cost: 7200, stock: 24, unit: "und" },
    { id: "P-005", code: "MA-APL", name: "Apple Magic Mouse", price: 5500, cost: 4100, stock: 30, unit: "und" },
];

const ALMACENES = ["Principal", "Tienda Norte", "Almacén Secundario", "Vehículo Reparto"];
const MOTIVOS = [
    "Conteo Físico (Inventario)",
    "Mercancía Dañada / Avería",
    "Uso Interno de la Empresa",
    "Mercancía Vencida",
    "Pérdida / Robo",
    "Ajuste Inicial de Sistema"
];

function AjusteBuilderContent() {
    const router = useRouter();
    const todayISO = new Date().toISOString().split("T")[0];

    const [fecha, setFecha] = useState(todayISO);
    const [almacen, setAlmacen] = useState("Principal");
    const [tipo, setTipo] = useState("disminucion"); // incremento | disminucion
    const [motivo, setMotivo] = useState("");
    const [notas, setNotas] = useState("");

    const [items, setItems] = useState<{ id: string, productId: string, qty: number, cost: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showProducts, setShowProducts] = useState(false);

    // Calculate dynamic totals based on type
    const totalImpact = items.reduce((acc, item) => acc + (item.qty * item.cost), 0);

    const handleAddProduct = (product: typeof MOCK_PRODUCTS[0]) => {
        // Prevent adding duplicates
        if (items.some(i => i.productId === product.id)) return;

        setItems([...items, {
            id: crypto.randomUUID(),
            productId: product.id,
            qty: 1,
            cost: product.cost // default impact cost
        }]);
        setSearchQuery("");
        setShowProducts(false);
    };

    const handleUpdateItem = (idx: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: parseFloat(value) || 0 };
        setItems(newItems);
    };

    const handleRemoveItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleSave = (asDraft: boolean = false) => {
        if (!motivo) {
            alert("Por favor seleccione un motivo para el ajuste.");
            return;
        }
        if (items.length === 0) {
            alert("Debe agregar al menos un producto al ajuste.");
            return;
        }

        const adjustment = {
            id: `AJ-${Math.floor(Math.random() * 10000)}`,
            fecha,
            almacen,
            motivo,
            tipo,
            itemsCount: items.length,
            monto_impacto: totalImpact,
            status: asDraft ? "borrador" : "aplicado",
            notas,
            items
        };

        const existingRaw = localStorage.getItem('ajustes_inventario');
        let existing = [];
        try { existing = JSON.parse(existingRaw || '[]'); } catch { }
        existing.unshift(adjustment);
        localStorage.setItem('ajustes_inventario', JSON.stringify(existing));

        router.push('/dashboard/productos/ajustes');
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* Header */}
            <div className="bg-background border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/productos/ajustes')}
                        className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            {tipo === 'incremento' ? <ArrowDown className="w-5 h-5 text-emerald-600" /> : <ArrowUp className="w-5 h-5 text-rose-600" />}
                            Nuevo Ajuste de Inventario
                        </h1>
                        <p className="text-sm text-muted-foreground">Incrementa o reduce mercancía sin generar factura.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => handleSave(true)}>
                        Guardar Borrador
                    </Button>
                    <Button
                        className="bg-primary text-white gap-2 shadow-sm"
                        onClick={() => handleSave(false)}
                        disabled={items.length === 0 || !motivo}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Aplicar Ajuste
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Form Details */}
                <div className="col-span-1 lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex bg-muted/50 p-1 rounded-xl">
                            <button
                                className={cn("flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors", tipo === 'disminucion' ? "bg-white shadow-sm text-rose-600" : "text-muted-foreground hover:text-foreground")}
                                onClick={() => setTipo('disminucion')}
                            >
                                <ArrowUp className="w-4 h-4" /> Salida (-)
                            </button>
                            <button
                                className={cn("flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors", tipo === 'incremento' ? "bg-white shadow-sm text-emerald-600" : "text-muted-foreground hover:text-foreground")}
                                onClick={() => setTipo('incremento')}
                            >
                                <ArrowDown className="w-4 h-4" /> Entrada (+)
                            </button>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha *</Label>
                            <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="h-10" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><Box className="w-3.5 h-3.5" /> Almacén Afectado *</Label>
                            <Select value={almacen} onValueChange={setAlmacen}>
                                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {ALMACENES.map(a => (
                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Motivo del Ajuste *</Label>
                            <Select value={motivo} onValueChange={setMotivo}>
                                <SelectTrigger className="h-10"><SelectValue placeholder="Seleccione la razón" /></SelectTrigger>
                                <SelectContent>
                                    {MOTIVOS.map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Notas Adicionales</Label>
                            <textarea
                                className="w-full text-sm min-h-[100px] resize-none bg-muted/10 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                placeholder="Justificación o detalles..."
                                value={notas}
                                onChange={e => setNotas(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={cn("border rounded-2xl p-6 shadow-sm", tipo === 'incremento' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20")}>
                        <h4 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Impacto {tipo === 'incremento' ? 'Positivo' : 'Negativo'} Total</h4>
                        <div className={cn("text-3xl font-black tabular-nums break-words", tipo === 'incremento' ? "text-emerald-700" : "text-rose-700")}>
                            RD$ {totalImpact.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {tipo === 'incremento'
                                ? "Este monto incrementará la valoración total del inventario en contabilidad."
                                : "Este monto se registrará como gasto/pérdida afectando los estados financieros."}
                        </p>
                    </div>
                </div>

                {/* Right Column: Items Picker */}
                <div className="col-span-1 lg:col-span-3 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[500px]">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                            Productos a Ajustar
                        </h3>

                        {/* Product Search */}
                        <div className="relative mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar producto a modificar por nombre o código..."
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setShowProducts(true); }}
                                    onFocus={() => setShowProducts(true)}
                                    className="pl-9 h-11 bg-muted/30 border-dashed border-2 hover:border-solid hover:border-primary/50 transition-all focus:border-primary focus:border-solid text-base"
                                />
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showProducts && searchQuery.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl overflow-hidden z-20 max-h-[300px] overflow-y-auto">
                                    {MOCK_PRODUCTS.filter(p =>
                                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        p.code.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">No hay productos que coincidan.</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {MOCK_PRODUCTS.filter(p =>
                                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                p.code.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).map((prod) => (
                                                <button
                                                    key={prod.id}
                                                    className="w-full flex items-center justify-between p-3 hover:bg-muted text-left border-b last:border-0"
                                                    onClick={() => handleAddProduct(prod)}
                                                >
                                                    <div>
                                                        <div className="font-semibold text-sm">{prod.name}</div>
                                                        <div className="text-xs text-muted-foreground flex gap-2">
                                                            <span className="font-mono">{prod.code}</span>
                                                            <span>•</span>
                                                            <span>Disp: {prod.stock}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                                                        Costo: RD$ {prod.cost.toLocaleString()}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dismiss overlay if clicking outside */}
                            {showProducts && (
                                <div className="fixed inset-0 z-10" onClick={() => setShowProducts(false)} />
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="border-2 border-dashed rounded-xl py-16 flex flex-col items-center justify-center text-muted-foreground/50 bg-muted/5">
                                <Box className="w-12 h-12 mb-4" />
                                <p className="font-medium text-foreground">Aún no hay productos en la lista</p>
                                <p className="text-sm mt-1 max-w-sm text-center">Busca y selecciona los productos a los que deseas realizar el ajuste de inventario.</p>
                            </div>
                        ) : (
                            <div className="border rounded-xl overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[40%]">Producto</TableHead>
                                            <TableHead className="text-center">Stock Actual</TableHead>
                                            <TableHead className="w-[120px] text-center">Cantidad</TableHead>
                                            <TableHead className="w-[150px] text-right">Costo Unit.</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, idx) => {
                                            const prod = MOCK_PRODUCTS.find(p => p.id === item.productId)!;
                                            return (
                                                <TableRow key={item.id} className="group">
                                                    <TableCell>
                                                        <div className="font-semibold text-sm">{prod.name}</div>
                                                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{prod.code}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="font-mono bg-background">
                                                            {prod.stock} {prod.unit}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <div className="relative">
                                                            <span className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold", tipo === 'incremento' ? 'text-emerald-600' : 'text-rose-600')}>
                                                                {tipo === 'incremento' ? '+' : '-'}
                                                            </span>
                                                            <Input
                                                                type="number"
                                                                min="0.1"
                                                                className={cn("h-9 pl-6 text-center font-bold", tipo === 'incremento' ? 'text-emerald-700 bg-emerald-50 focus-visible:ring-emerald-500' : 'text-rose-700 bg-rose-50 focus-visible:ring-rose-500')}
                                                                value={item.qty || ''}
                                                                onChange={e => handleUpdateItem(idx, 'qty', e.target.value)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="p-2">
                                                        <Input
                                                            type="number"
                                                            className="h-9 text-right tabular-nums bg-white"
                                                            value={item.cost || ''}
                                                            onChange={e => handleUpdateItem(idx, 'cost', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold tabular-nums">
                                                        RD$ {(item.cost * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50" onClick={() => handleRemoveItem(idx)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-900">
                                    <span className="font-bold">Advertencia:</span> Revisar los costos unitarios es crucial. El costo reflejado es el promedio ponderado actual. Modificarlo cambiará el impacto financiero en el diario contable.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense layer
export default function NewAjustePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[50vh]"><div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />Cargando...</div>}>
            <AjusteBuilderContent />
        </Suspense>
    );
}
