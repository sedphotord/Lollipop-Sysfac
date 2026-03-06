"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, ChevronDown, Save, Search, Settings2, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const MOCK_SUPPLIERS = [
    { id: "1", rnc: "101010101", name: "Dell Technologies", email: "ventas@dell.com", phone: "809-555-1000", address: "Miami, FL" },
    { id: "2", rnc: "130000001", name: "Office Depot RD", email: "corporativo@officedepot.com.do", phone: "829-111-2222", address: "Av. 27 de Febrero, SD" },
    { id: "3", rnc: "130819985", name: "APC Distribuidores", email: "info@apc.do", phone: "809-999-8888", address: "Zona Industrial de Herrera" },
];

const MOCK_PRODUCTS = [
    { id: "1", code: "SRV-001", name: "Servidor Rack Mount 1U", cost: 45000, itbis: 18 },
    { id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", cost: 75000, itbis: 18 },
    { id: "3", code: "PRD-003", name: "Monitor UltraSharp 27", cost: 18000, itbis: 18 },
    { id: "4", code: "SVC-004", name: "Instalación de Red", cost: 5000, itbis: 18 },
];

type Item = { id: number; name: string; ref: string; qty: number; cost: number; disc: number; itbis: number; desc: string };

function ItemRow({ item, onUpdate, onRemove }: { item: Item; onUpdate: (field: keyof Item, value: any) => void; onRemove: () => void; }) {
    const [prodOpen, setProdOpen] = useState(false);
    const lineTotal = item.cost * item.qty * (1 - item.disc / 100);

    return (
        <tr className="border-b border-border/60 hover:bg-primary/[0.02] group/row transition-colors">
            <td className="py-2 px-2">
                <Popover open={prodOpen} onOpenChange={setProdOpen}>
                    <PopoverTrigger asChild>
                        <div className={cn(
                            "flex items-center justify-between h-9 px-3 rounded-lg border text-sm cursor-pointer transition-all",
                            item.name ? "border-border text-foreground hover:border-primary/50" : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate">{item.name || "Buscar producto..."}</span>
                            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar catálogo..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron productos</CommandEmpty>
                                <CommandGroup>
                                    {MOCK_PRODUCTS.map(p => (
                                        <CommandItem key={p.id} onSelect={() => {
                                            onUpdate("name", p.name); onUpdate("ref", p.code); onUpdate("cost", p.cost); onUpdate("itbis", p.itbis);
                                            setProdOpen(false);
                                        }} className="flex justify-between cursor-pointer py-2">
                                            <div>
                                                <p className="font-medium text-sm">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.code}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-mono">RD${p.cost.toLocaleString()}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </td>
            <td className="py-2 px-1.5"><Input value={item.ref} onChange={e => onUpdate("ref", e.target.value)} className="h-9 min-w-[80px]" placeholder="Código" /></td>
            <td className="py-2 px-1.5"><Input type="number" value={item.cost || ""} onChange={e => onUpdate("cost", parseFloat(e.target.value) || 0)} className="h-9 text-right min-w-[90px]" placeholder="0.00" /></td>
            <td className="py-2 px-1.5 w-20">
                <div className="relative">
                    <Input type="number" value={item.disc || ""} onChange={e => onUpdate("disc", parseFloat(e.target.value) || 0)} className="h-9 text-right pr-6" max={100} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                </div>
            </td>
            <td className="py-2 px-1.5">
                <Select value={String(item.itbis)} onValueChange={v => onUpdate("itbis", Number(v))}>
                    <SelectTrigger className="h-9 min-w-[100px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="18">ITBIS 18%</SelectItem>
                        <SelectItem value="16">ITBIS 16%</SelectItem>
                        <SelectItem value="0">Exento</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="py-2 px-1.5 w-24">
                <Input type="number" value={item.qty} onChange={e => onUpdate("qty", Math.max(1, parseFloat(e.target.value) || 1))} className="h-9 text-right" min={1} />
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

export default function NuevaOrdenCompraPage() {
    const todayISO = new Date().toISOString().split("T")[0];
    const in15Days = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [documentNumber, setDocumentNumber] = useState("OC-0104");
    const [date, setDate] = useState(todayISO);
    const [deliveryDate, setDeliveryDate] = useState(in15Days);
    const [supplierSearch, setSupplierSearch] = useState("");
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [supplier, setSupplier] = useState<any>(null);
    const [paymentTerms, setPaymentTerms] = useState("Neto 30 días");
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(false);

    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "", ref: "", qty: 1, cost: 0, disc: 0, itbis: 18, desc: "" }
    ]);

    const subtotal = items.reduce((a, i) => a + i.cost * i.qty * (1 - i.disc / 100), 0);
    const discountTotal = items.reduce((a, i) => a + i.cost * i.qty * (i.disc / 100), 0);
    const taxTotal = items.reduce((a, i) => a + i.cost * i.qty * (1 - i.disc / 100) * (i.itbis / 100), 0);
    const total = subtotal + taxTotal;

    const addItem = () => setItems(p => [...p, { id: Date.now(), name: "", ref: "", qty: 1, cost: 0, disc: 0, itbis: 18, desc: "" }]);
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
                        <div><p className="font-bold text-sm">Orden Guardada</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/gastos/ordenes">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h1 className="text-base font-bold">Generar Orden de Compra</h1>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2"><Settings2 className="w-4 h-4" /> Personalizar</Button>
            </div>

            {/* Main Form */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {/* Top Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b divide-x">
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-2">Información del Proveedor</h3>
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Proveedor *</Label>
                                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input value={supplier ? supplier.name : supplierSearch} onChange={e => { setSupplierSearch(e.target.value); setSupplier(null); }} onFocus={() => setSupplierOpen(true)} placeholder="Buscar suplidor por nombre o RNC..." className="h-10 pr-10" />
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
                                                            <span className="text-xs text-muted-foreground">RNC/Cédula: {s.rnc}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</Label><Input value={supplier?.phone || ""} readOnly className="bg-muted/30" /></div>
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Correo</Label><Input value={supplier?.email || ""} readOnly className="bg-muted/30" /></div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 bg-muted/5">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold">Detalles de la Orden</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">No.</span>
                                    <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} className="text-lg font-bold font-mono w-40 border-0 bg-transparent text-right focus-visible:ring-0 p-0" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha de Orden *</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10" /></div>
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha Esperada</Label><Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="h-10" /></div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Términos de Pago</Label>
                                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Al Contado">Al Contado</SelectItem>
                                        <SelectItem value="Neto 15 días">Neto 15 días</SelectItem>
                                        <SelectItem value="Neto 30 días">Neto 30 días</SelectItem>
                                        <SelectItem value="Neto 60 días">Neto 60 días</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/30 border-b text-xs text-muted-foreground font-semibold text-left uppercase tracking-wide">
                                    <th className="py-3 px-4">Artículo a Comprar</th>
                                    <th className="py-3 px-3">Código</th>
                                    <th className="py-3 px-3">Costo Unitario</th>
                                    <th className="py-3 px-3 text-right">Desc %</th>
                                    <th className="py-3 px-3">Impuesto</th>
                                    <th className="py-3 px-3 text-right">Cant.</th>
                                    <th className="py-3 px-3 text-right">Total Costo</th>
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
                            <Button variant="outline" size="sm" onClick={addItem} className="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800">
                                Agregar línea
                            </Button>
                        </div>
                    </div>

                    {/* Totals & Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x border-b">
                        <div className="p-6 space-y-4">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Notas para el Proveedor</Label>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instrucciones de entrega, sucursal destino, etc..." className="min-h-[120px] bg-muted/10 text-sm" />
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <span>Subtotal</span>
                                <span className="font-mono">RD$ {subtotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            {discountTotal > 0 && (
                                <div className="flex justify-between text-destructive text-sm">
                                    <span>Descuentos</span>
                                    <span className="font-mono">-RD$ {discountTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <span>ITBIS Estimado</span>
                                <span className="font-mono">RD$ {taxTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between border-t border-border/60 pt-3 font-bold text-lg text-foreground">
                                <span>Costo Total Estimado</span>
                                <span className="font-mono text-emerald-600">RD$ {total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-4 flex items-center justify-between z-20">
                <Link href="/dashboard/gastos/ordenes"><Button variant="ghost">Descartar</Button></Link>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 text-foreground font-semibold border-muted-foreground/30 hover:bg-muted/50" onClick={handleSave}>Guardar Borrador</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white gap-2 shadow-lg shadow-emerald-500/20" onClick={handleSave}>
                        <CheckCircle2 className="w-4 h-4" /> Finalizar y Enviar OC
                    </Button>
                </div>
            </div>
        </div>
    );
}
