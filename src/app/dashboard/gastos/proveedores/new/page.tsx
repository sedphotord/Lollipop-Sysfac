"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, ChevronDown, Save, Search, Settings2, Receipt, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const MOCK_SUPPLIERS = [
    { id: "1", rnc: "101010101", name: "Dell Technologies", type: "RNC" },
    { id: "2", rnc: "130000001", name: "Juan Pérez (Reparaciones)", type: "Cedula" },
    { id: "3", rnc: "130819985", name: "APC Distribuidores", type: "RNC" },
];

const MOCK_ACCOUNTS = [
    { id: "1", code: "5-1-01", name: "Compras de Mercancía" },
    { id: "2", code: "6-1-10", name: "Honorarios Profesionales" },
    { id: "3", code: "6-1-15", name: "Gastos de Mantenimiento" },
    { id: "4", code: "6-1-20", name: "Suministros de Oficina" },
];

type Item = { id: number; account: string; qty: number; cost: number; itbis: number; retentionItbis: number; retentionIsr: number; desc: string };

function ItemRow({ item, onUpdate, onRemove }: { item: Item; onUpdate: (field: keyof Item, value: any) => void; onRemove: () => void; }) {
    const [accOpen, setAccOpen] = useState(false);
    const lineTotal = item.cost * item.qty;

    return (
        <tr className="border-b border-border/60 hover:bg-primary/[0.02] group/row transition-colors">
            <td className="py-2 px-2">
                <Popover open={accOpen} onOpenChange={setAccOpen}>
                    <PopoverTrigger asChild>
                        <div className={cn(
                            "flex items-center justify-between h-9 px-3 rounded-lg border text-sm cursor-pointer transition-all",
                            item.account ? "border-border text-foreground hover:border-primary/50" : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate">{item.account || "Seleccionar Cuenta..."}</span>
                            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar cuenta contable..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron cuentas</CommandEmpty>
                                <CommandGroup>
                                    {MOCK_ACCOUNTS.map(a => (
                                        <CommandItem key={a.id} onSelect={() => {
                                            onUpdate("account", `${a.code} - ${a.name}`);
                                            setAccOpen(false);
                                        }} className="flex flex-col items-start cursor-pointer py-2">
                                            <span className="font-medium text-sm">{a.name}</span>
                                            <span className="text-xs text-muted-foreground">{a.code}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </td>
            <td className="py-2 px-1.5"><Input value={item.desc} onChange={e => onUpdate("desc", e.target.value)} className="h-9 min-w-[150px]" placeholder="Descripción del gasto..." /></td>
            <td className="py-2 px-1.5 w-20"><Input type="number" value={item.qty} onChange={e => onUpdate("qty", Math.max(1, parseFloat(e.target.value) || 1))} className="h-9 text-right" min={1} /></td>
            <td className="py-2 px-1.5"><Input type="number" value={item.cost || ""} onChange={e => onUpdate("cost", parseFloat(e.target.value) || 0)} className="h-9 text-right min-w-[90px]" placeholder="0.00" /></td>
            <td className="py-2 px-1.5">
                <Select value={String(item.itbis)} onValueChange={v => onUpdate("itbis", Number(v))}>
                    <SelectTrigger className="h-9 min-w-[100px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="18">ITBIS 18%</SelectItem>
                        <SelectItem value="0">Exento</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="py-2 px-1.5">
                <Select value={String(item.retentionIsr)} onValueChange={v => onUpdate("retentionIsr", Number(v))}>
                    <SelectTrigger className="h-9 min-w-[120px] border-amber-500/30 text-amber-700 bg-amber-50/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Sin Ret ISR</SelectItem>
                        <SelectItem value="2">Ret ISR 2%</SelectItem>
                        <SelectItem value="10">Ret ISR 10%</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="py-2 px-2 text-right text-sm font-mono whitespace-nowrap">
                RD$ {lineTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </td>
            <td className="py-2 px-2 text-center w-10">
                <button onClick={onRemove} className="text-muted-foreground/40 hover:text-destructive transition-colors"><X className="w-4 h-4" /></button>
            </td>
        </tr>
    );
}

export default function NuevaFacturaProveedorPage() {
    const todayISO = new Date().toISOString().split("T")[0];

    const [documentNumber, setDocumentNumber] = useState("FP-0050");
    const [date, setDate] = useState(todayISO);
    const [ncf, setNcf] = useState("");
    const [comprobanteType, setComprobanteType] = useState("B01");
    const [supplierSearch, setSupplierSearch] = useState("");
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [supplier, setSupplier] = useState<any>(null);
    const [paymentTerms, setPaymentTerms] = useState("Al Contado");
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(false);

    const [items, setItems] = useState<Item[]>([
        { id: 1, account: "", qty: 1, cost: 0, itbis: 18, retentionItbis: 0, retentionIsr: 0, desc: "" }
    ]);

    const subtotal = items.reduce((a, i) => a + i.cost * i.qty, 0);
    const taxTotal = items.reduce((a, i) => a + i.cost * i.qty * (i.itbis / 100), 0);
    const retIsrTotal = items.reduce((a, i) => a + i.cost * i.qty * (i.retentionIsr / 100), 0);
    // Standard rule: 30% retention of ITBIS if applying ISR, simplfied here as 0 unless manually set logic.
    // We'll just mock ITBIS retention as 0 for UI simplicity unless needed.
    const retItbisTotal = 0;
    const total = subtotal + taxTotal - retIsrTotal - retItbisTotal;

    const addItem = () => setItems(p => [...p, { id: Date.now(), account: "", qty: 1, cost: 0, itbis: 18, retentionItbis: 0, retentionIsr: 0, desc: "" }]);
    const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
    const updateItem = (id: number, field: keyof Item, value: any) => setItems(p => p.map(i => i.id !== id ? i : { ...i, [field]: value }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const filteredSuppliers = MOCK_SUPPLIERS.filter(s =>
        s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || s.rnc.includes(supplierSearch)
    );

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500 bg-muted/20 text-sm">
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-5 py-3.5 shadow-2xl">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div><p className="font-bold text-sm">Gasto Registrado</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/gastos/proveedores">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-primary" />
                        <h1 className="text-base font-bold">Registrar Factura de Proveedor o Gasto</h1>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {/* Top Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b divide-x">
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-2">Información del Suplidor</h3>
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Proveedor *</Label>
                                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input value={supplier ? supplier.name : supplierSearch} onChange={e => { setSupplierSearch(e.target.value); setSupplier(null); }} onFocus={() => setSupplierOpen(true)} placeholder="Buscar suplidor..." className="h-10 pr-10" />
                                            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-[360px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar suplidor..." value={supplierSearch} onValueChange={setSupplierSearch} />
                                            <CommandList>
                                                <CommandGroup>
                                                    {filteredSuppliers.map(s => (
                                                        <CommandItem key={s.id} onSelect={() => { setSupplier(s); setSupplierOpen(false); }} className="flex flex-col items-start cursor-pointer py-2">
                                                            <span className="font-medium">{s.name}</span>
                                                            <span className="text-xs text-muted-foreground">{s.type}: {s.rnc}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">RNC / Cédula</Label><Input value={supplier?.rnc || ""} readOnly className="bg-muted/30" /></div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 bg-muted/5">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold">Datos del Comprobante Fiscal</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">Reg.</span>
                                    <Input value={documentNumber} readOnly className="text-base font-bold font-mono w-24 border-0 bg-transparent text-right p-0" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tipo CF *</Label>
                                    <Select value={comprobanteType} onValueChange={setComprobanteType}>
                                        <SelectTrigger className="h-10 border-primary/40"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="B01">B01 - Crédito Fiscal</SelectItem>
                                            <SelectItem value="B11">B11 - Comprobante de Compras</SelectItem>
                                            <SelectItem value="B13">B13 - Gastos Menores</SelectItem>
                                            <SelectItem value="B14">B14 - Regímenes Especiales</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">NCF (Opcional si es B11/B13) *</Label><Input value={ncf} onChange={e => setNcf(e.target.value)} placeholder="B010..." className="h-10 text-primary font-mono font-bold" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha de Factura *</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10" /></div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Condición</Label>
                                    <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Al Contado">A Crédito (Pendiente)</SelectItem><SelectItem value="Pagado">Pagado</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/30 border-b text-xs text-muted-foreground font-semibold text-left uppercase tracking-wide">
                                    <th className="py-3 px-4">Cuenta Contable / Categoría</th>
                                    <th className="py-3 px-3">Descripción</th>
                                    <th className="py-3 px-3 text-right">Cant.</th>
                                    <th className="py-3 px-3 text-right">Costo U.</th>
                                    <th className="py-3 px-3">ITBIS</th>
                                    <th className="py-3 px-3">Retención ISR</th>
                                    <th className="py-3 px-3 text-right">Subtotal</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <ItemRow key={item.id} item={item} onUpdate={(field, val) => updateItem(item.id, field, val)} onRemove={() => removeItem(item.id)} />
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-muted/10 p-2 border-t px-4 py-3">
                            <Button variant="outline" size="sm" onClick={addItem} className="text-primary border-primary/30 hover:bg-primary/5">
                                Agregar línea de gasto
                            </Button>
                        </div>
                    </div>

                    {/* Totals & Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x border-b">
                        <div className="p-6 space-y-4">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Observaciones Internas</Label>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Motivo del gasto, aprobación..." className="min-h-[120px] bg-muted/10 text-sm" />
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <span>Subtotal</span>
                                <span className="font-mono">RD$ {subtotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <span>ITBIS</span>
                                <span className="font-mono">RD$ {taxTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            {retIsrTotal > 0 && (
                                <div className="flex justify-between text-amber-600 text-sm">
                                    <span>Retención ISR</span>
                                    <span className="font-mono">-RD$ {retIsrTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-border/60 pt-3 font-bold text-lg text-foreground">
                                <span>Total Neto</span>
                                <span className="font-mono text-primary">RD$ {total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-4 flex items-center justify-between z-20">
                <Link href="/dashboard/gastos/proveedores"><Button variant="ghost">Cancelar</Button></Link>
                <div className="flex gap-3">
                    <Button className="bg-gradient-brand border-0 text-white gap-2 shadow-lg hover:scale-105 transition-transform" onClick={handleSave}>
                        <Save className="w-4 h-4" /> Guardar Gasto / Factura
                    </Button>
                </div>
            </div>
        </div>
    );
}
