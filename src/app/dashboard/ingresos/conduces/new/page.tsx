"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, ChevronDown, Eye, Save, X, Truck, Package, Search, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const MOCK_CLIENTS = [
    { id: "1", rnc: "101010101", name: "COMPAÑIA DOMINICANA DE TELEFONOS S.A.", trade: "CLARO", address: "Av. John F. Kennedy 27, Santo Domingo" },
    { id: "2", rnc: "130000001", name: "JUAN ANTONIO PEREZ ROSARIO", trade: "", address: "C/ Las Mercedes 12, Santiago" },
    { id: "3", rnc: "130819985", name: "ALTICE DOMINICANA S.A.", trade: "ALTICE", address: "Av. 27 de Febrero 450, Santo Domingo" },
];

const MOCK_PRODUCTS = [
    { id: "1", code: "SRV-001", name: "Servidor Rack Mount 1U", weight: "12 kg" },
    { id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", weight: "2.5 kg" },
    { id: "3", code: "PRD-003", name: "Monitor UltraSharp 27", weight: "6.5 kg" },
    { id: "4", code: "PRD-004", name: "Caja de Cables Cat6", weight: "15 kg" },
];

type Item = { id: number; name: string; ref: string; qty: number; weight: string; desc: string };

function ItemRow({ item, onUpdate, onRemove }: { item: Item; onUpdate: (field: keyof Item, value: any) => void; onRemove: () => void; }) {
    const [prodOpen, setProdOpen] = useState(false);

    return (
        <tr className="border-b border-border/60 hover:bg-primary/[0.02] group/row transition-colors">
            <td className="py-2 px-2">
                <Popover open={prodOpen} onOpenChange={setProdOpen}>
                    <PopoverTrigger asChild>
                        <div className={cn(
                            "flex items-center justify-between h-9 px-3 rounded-lg border text-sm cursor-pointer transition-all",
                            item.name ? "border-border text-foreground hover:border-primary/50" : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate">{item.name || "Buscar mercancía..."}</span>
                            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar producto..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron productos</CommandEmpty>
                                <CommandGroup>
                                    {MOCK_PRODUCTS.map(p => (
                                        <CommandItem key={p.id} onSelect={() => {
                                            onUpdate("name", p.name); onUpdate("ref", p.code); onUpdate("weight", p.weight);
                                            setProdOpen(false);
                                        }} className="flex justify-between cursor-pointer py-2">
                                            <div>
                                                <p className="font-medium text-sm">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.code}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{p.weight}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </td>
            <td className="py-2 px-1.5"><Input value={item.ref} onChange={e => onUpdate("ref", e.target.value)} className="h-9 min-w-[80px]" placeholder="Código" /></td>
            <td className="py-2 px-1.5"><Input value={item.desc} onChange={e => onUpdate("desc", e.target.value)} className="h-9 min-w-[150px]" placeholder="Detalles de empaque..." /></td>
            <td className="py-2 px-1.5"><Input value={item.weight} onChange={e => onUpdate("weight", e.target.value)} className="h-9 min-w-[80px]" placeholder="Ej. 5 kg" /></td>
            <td className="py-2 px-1.5 w-24">
                <Input type="number" value={item.qty} onChange={e => onUpdate("qty", Math.max(1, parseFloat(e.target.value) || 1))} className="h-9 text-right" min={1} />
            </td>
            <td className="py-2 px-2 text-center w-10">
                <button onClick={onRemove} className="text-muted-foreground/40 hover:text-destructive transition-colors"><X className="w-4 h-4" /></button>
            </td>
        </tr>
    );
}

export default function NuevoConducePage() {
    const todayISO = new Date().toISOString().split("T")[0];
    const [documentNumber, setDocumentNumber] = useState("CON-0043");
    const [date, setDate] = useState(todayISO);
    const [clientSearch, setClientSearch] = useState("");
    const [clientOpen, setClientOpen] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [transportista, setTransportista] = useState("");
    const [chasis, setChasis] = useState("");
    const [placa, setPlaca] = useState("");
    const [chofer, setChofer] = useState("");
    const [cedulaChofer, setCedulaChofer] = useState("");
    const [notes, setNotes] = useState("");
    const [address, setAddress] = useState("");
    const [saved, setSaved] = useState(false);

    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "", ref: "", qty: 1, weight: "", desc: "" }
    ]);

    const addItem = () => setItems(p => [...p, { id: Date.now(), name: "", ref: "", qty: 1, weight: "", desc: "" }]);
    const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
    const updateItem = (id: number, field: keyof Item, value: any) => setItems(p => p.map(i => i.id !== id ? i : { ...i, [field]: value }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const filteredClients = MOCK_CLIENTS.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.rnc.includes(clientSearch)
    );

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500 bg-muted/20">
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-5 py-3.5 shadow-2xl">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div><p className="font-bold text-sm">Conduce Generado</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/ingresos/conduces">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <h1 className="text-base font-bold">Generar Conduce (Guía de Remisión)</h1>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {/* Top Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b divide-x">
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-2">Datos de Entrega</h3>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold">Cliente Destino *</Label>
                                <Popover open={clientOpen} onOpenChange={setClientOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input value={client ? client.name : clientSearch} onChange={e => { setClientSearch(e.target.value); setClient(null); }} onFocus={() => setClientOpen(true)} placeholder="Buscar cliente..." className="pr-10" />
                                            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-[360px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar cliente..." value={clientSearch} onValueChange={setClientSearch} />
                                            <CommandList>
                                                <CommandGroup>
                                                    {filteredClients.map(c => (
                                                        <CommandItem key={c.id} onSelect={() => { setClient(c); setAddress(c.address); setClientOpen(false); }} className="flex flex-col items-start cursor-pointer py-2">
                                                            <span className="font-medium">{c.trade || c.name}</span>
                                                            <span className="text-xs text-muted-foreground">{c.name} · {c.rnc}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm">Dirección de Entrega</Label>
                                <Textarea value={address} onChange={e => setAddress(e.target.value)} className="min-h-[80px]" placeholder="Ingresa la ubicación exacta de entrega de la mercancía" />
                            </div>
                        </div>

                        <div className="p-6 space-y-4 bg-muted/10">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="font-bold">Datos del Traslado</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">No.</span>
                                    <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} className="text-lg font-bold font-mono w-40 border-0 bg-transparent text-right" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-sm">Fecha de Salida</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                                <div className="space-y-1.5"><Label className="text-sm">Compañía Transportista</Label><Input value={transportista} onChange={e => setTransportista(e.target.value)} placeholder="Ej. Transporte Local SRL" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-sm">Ficha / Chasis</Label><Input value={chasis} onChange={e => setChasis(e.target.value)} placeholder="Ej. F-14" /></div>
                                <div className="space-y-1.5"><Label className="text-sm">Placa Vehículo</Label><Input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="Ej. L123456" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-sm">Nombre del Chofer</Label><Input value={chofer} onChange={e => setChofer(e.target.value)} placeholder="Nombre completo" /></div>
                                <div className="space-y-1.5"><Label className="text-sm">Cédula del Chofer</Label><Input value={cedulaChofer} onChange={e => setCedulaChofer(e.target.value)} placeholder="000-0000000-0" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="p-6 pt-2">
                        <div className="flex items-center gap-2 mb-4 mt-4 text-primary">
                            <Package className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Mercancía Empacada</h3>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50 border-b text-muted-foreground font-semibold text-left">
                                        <th className="py-3 px-4">Artículo</th>
                                        <th className="py-3 px-3">Código</th>
                                        <th className="py-3 px-3">Observaciones / Empaque</th>
                                        <th className="py-3 px-3">Peso</th>
                                        <th className="py-3 px-3 text-right">Cant.</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <ItemRow key={item.id} item={item} onUpdate={(field, val) => updateItem(item.id, field, val)} onRemove={() => removeItem(item.id)} />
                                    ))}
                                </tbody>
                            </table>
                            <div className="bg-muted/10 p-2 border-t">
                                <Button variant="ghost" size="sm" onClick={addItem} className="text-primary hover:text-primary hover:bg-primary/10">
                                    <Plus className="w-4 h-4 mr-1" /> Añadir Artículo
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-muted/5 space-y-3">
                        <Label>Notas Generales de Remisión</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instrucciones especiales de entrega o advertencias..." className="min-h-[80px]" />
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-4 flex items-center justify-between z-20">
                <Link href="/dashboard/ingresos/conduces"><Button variant="ghost">Cancelar</Button></Link>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2"><Eye className="w-4 h-4" /> Vista Previa (Impresión)</Button>
                    <Button className="bg-gradient-brand border-0 text-white gap-2 shadow-lg hover:scale-105 transition-transform" onClick={handleSave}>
                        <Save className="w-4 h-4" /> Guardar Conduce
                    </Button>
                </div>
            </div>
        </div>
    );
}
