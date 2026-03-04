"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
    ArrowLeft, CheckCircle2, ChevronDown, Eye,
    HelpCircle, Info, Pencil, Plus, Save, X, Settings2, FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const DEFAULT_CLIENTS = [
    { id: "1", rnc: "101010101", name: "COMPAÑIA DOMINICANA DE TELEFONOS S.A.", trade: "CLARO", type: "SRL", status: "Activo", email: "facturacion@claro.com.do", phone: "809-220-0000", address: "Av. John F. Kennedy 27, Santo Domingo" },
    { id: "2", rnc: "130000001", name: "JUAN ANTONIO PEREZ ROSARIO", trade: "", type: "Persona Física", status: "Activo", email: "jperez@gmail.com", phone: "829-555-1234", address: "C/ Las Mercedes 12, Santiago" },
    { id: "3", rnc: "130819985", name: "ALTICE DOMINICANA S.A.", trade: "ALTICE", type: "SRL", status: "Activo", email: "cxp@altice.com.do", phone: "809-200-1111", address: "Av. 27 de Febrero 450, Santo Domingo" },
];

const MOCK_PRODUCTS = [
    { id: "1", code: "SRV-001", name: "Consultoría IT", price: 5000, itbis: 18 },
    { id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", price: 85000, itbis: 18 },
    { id: "3", code: "SFT-007", name: "Licencia Microsoft Office 365", price: 6500, itbis: 18 },
    { id: "4", code: "PRD-003", name: "Libro de Contabilidad", price: 1500, itbis: 0 },
];

const PAYMENT_TERMS = [
    "Vencimiento manual",
    "Neto 15 días",
    "Neto 30 días",
    "Neto 60 días",
    "Pago contra entrega",
];

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
type Client = typeof DEFAULT_CLIENTS[0];
type Item = { id: number; name: string; ref: string; qty: number; price: number; disc: number; itbis: number; desc: string };

// ─────────────────────────────────────────────
//  NEW CONTACT PANEL
// ─────────────────────────────────────────────
function NewContactPanel({ onSave, onCancel }: { onSave: (c: Client) => void; onCancel: () => void }) {
    const [tab, setTab] = useState<"cliente" | "proveedor">("cliente");
    const [form, setForm] = useState({ rnc: "", name: "", trade: "", type: "RNC", email: "", phone: "", address: "" });
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between">
                    <h2 className="font-bold text-base text-slate-800">Nuevo contacto</h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-2 px-6 pt-4">
                    {(["cliente", "proveedor"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={cn(
                            "px-5 py-1.5 rounded-full text-sm font-medium capitalize transition-all border",
                            tab === t ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-muted/40"
                        )}>{t === "cliente" ? "Cliente" : "Proveedor"}</button>
                    ))}
                </div>
                <div className="px-6 py-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Tipo de identificación</Label>
                        <Select value={form.type} onValueChange={set("type")}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RNC">RNC</SelectItem>
                                <SelectItem value="Cedula">Cédula</SelectItem>
                                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Número</Label>
                        <Input value={form.rnc} onChange={e => set("rnc")(e.target.value)} className="h-9" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Nombre o Razón social *</Label>
                        <Input value={form.name} onChange={e => set("name")(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Correo electrónico</Label>
                        <Input type="email" placeholder="Ejemplo@email.com" value={form.email} onChange={e => set("email")(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Teléfono</Label>
                        <Input placeholder="809-000-0000" value={form.phone} onChange={e => set("phone")(e.target.value)} className="h-9" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Dirección</Label>
                        <Input value={form.address} onChange={e => set("address")(e.target.value)} className="h-9" />
                    </div>
                </div>
                <div className="px-6 pb-5 flex items-center justify-between gap-3 border-t pt-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Ir a formulario avanzado
                    </button>
                    <Button onClick={() => {
                        if (!form.name) return;
                        onSave({ ...form, id: Date.now().toString(), status: "Activo", trade: form.trade || "" });
                    }} disabled={!form.name} className="bg-gradient-brand border-0 text-white">
                        Crear contacto
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  ITEM ROW
// ─────────────────────────────────────────────
function ItemRow({ item, onUpdate, onRemove }: {
    item: Item;
    onUpdate: (field: keyof Item, value: any) => void;
    onRemove: () => void;
}) {
    const [prodOpen, setProdOpen] = useState(false);
    const lineTotal = item.price * item.qty * (1 - item.disc / 100);

    return (
        <tr className="border-b border-border/60 hover:bg-primary/[0.02] group/row transition-colors">
            <td className="py-1.5 px-2">
                <Popover open={prodOpen} onOpenChange={setProdOpen}>
                    <PopoverTrigger asChild>
                        <div className={cn(
                            "flex items-center justify-between h-8 px-2.5 rounded-lg border text-sm cursor-pointer transition-all min-w-[150px]",
                            item.name ? "border-border text-foreground hover:border-primary/50" : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate text-xs">{item.name || "Buscar producto o servicio..."}</span>
                            <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-1 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start" side="bottom">
                        <Command>
                            <CommandInput placeholder="Buscar en catálogo..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron productos</CommandEmpty>
                                <CommandGroup>
                                    {MOCK_PRODUCTS.map(p => (
                                        <CommandItem key={p.id} onSelect={() => {
                                            onUpdate("name", p.name); onUpdate("ref", p.code);
                                            onUpdate("price", p.price); onUpdate("itbis", p.itbis);
                                            setProdOpen(false);
                                        }} className="flex justify-between cursor-pointer py-2">
                                            <div>
                                                <p className="font-medium text-sm">{p.name}</p>
                                                <p className="text-xs text-muted-foreground">{p.code}</p>
                                            </div>
                                            <span className="text-sm font-mono">RD${p.price.toLocaleString()}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </td>
            <td className="py-1.5 px-1.5">
                <Input value={item.ref} onChange={e => onUpdate("ref", e.target.value)} className="h-8 text-xs min-w-[80px]" placeholder="Ref." />
            </td>
            <td className="py-1.5 px-1.5">
                <Input type="number" value={item.price || ""} onChange={e => onUpdate("price", parseFloat(e.target.value) || 0)} className="h-8 text-xs text-right min-w-[80px]" placeholder="0.00" />
            </td>
            <td className="py-1.5 px-1.5 w-20">
                <div className="relative">
                    <Input type="number" value={item.disc || ""} onChange={e => onUpdate("disc", parseFloat(e.target.value) || 0)} className="h-8 text-xs text-right pr-5 min-w-[52px]" placeholder="0" min={0} max={100} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                </div>
            </td>
            <td className="py-1.5 px-1.5">
                <Select value={String(item.itbis)} onValueChange={v => onUpdate("itbis", Number(v))}>
                    <SelectTrigger className="h-8 text-xs min-w-[100px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="18">ITBIS 18%</SelectItem>
                        <SelectItem value="16">ITBIS 16%</SelectItem>
                        <SelectItem value="0">Exento</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="py-1.5 px-1.5">
                <Input value={item.desc} onChange={e => onUpdate("desc", e.target.value)} className="h-8 text-xs min-w-[100px]" placeholder="Descripción adicional" />
            </td>
            <td className="py-1.5 px-1.5 w-20">
                <Input type="number" value={item.qty} onChange={e => onUpdate("qty", Math.max(1, parseFloat(e.target.value) || 1))} className="h-8 text-xs text-right" min={1} />
            </td>
            <td className="py-1.5 px-2 text-right text-xs font-mono text-foreground/70 whitespace-nowrap">
                RD$ {lineTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </td>
            <td className="py-1.5 px-1.5 w-8">
                <button onClick={onRemove} className="opacity-0 group-hover/row:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all p-0.5 rounded">
                    <X className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
    );
}

// ─────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────
export default function NewCotizacionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const todayISO = new Date().toISOString().split("T")[0];
    // Default validity: 30 days from now
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [quoteNumber, setQuoteNumber] = useState("COT-0001");
    const [clients, setClients] = useState(DEFAULT_CLIENTS);
    const [client, setClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientOpen, setClientOpen] = useState(false);
    const [newContactOpen, setNewContactOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: "", ref: "", qty: 1, price: 0, disc: 0, itbis: 18, desc: "" },
        { id: 2, name: "", ref: "", qty: 1, price: 0, disc: 0, itbis: 18, desc: "" },
        { id: 3, name: "", ref: "", qty: 1, price: 0, disc: 0, itbis: 18, desc: "" },
    ]);
    const [paymentTerms, setPaymentTerms] = useState("Neto 30 días");
    const [date, setDate] = useState(todayISO);
    const [validUntil, setValidUntil] = useState(in30Days);
    const [notes, setNotes] = useState("");
    const [terms, setTerms] = useState("");
    const [footer, setFooter] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [saved, setSaved] = useState(false);

    // Load from existing quote if converting
    useEffect(() => {
        const fromQuote = searchParams.get('from');
        if (fromQuote) {
            const savedData = sessionStorage.getItem(`quote_${fromQuote}`);
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.clientId) {
                        const c = DEFAULT_CLIENTS.find(cl => cl.id === data.clientId);
                        if (c) setClient(c);
                    }
                    if (data.items) setItems(data.items);
                    if (data.notes) setNotes(data.notes);
                    if (data.terms) setTerms(data.terms);
                } catch (_) { }
            }
        }
    }, [searchParams]);

    const subtotal = items.reduce((a, i) => a + i.price * i.qty * (1 - i.disc / 100), 0);
    const discountTotal = items.reduce((a, i) => a + i.price * i.qty * (i.disc / 100), 0);
    const taxTotal = items.reduce((a, i) => a + i.price * i.qty * (1 - i.disc / 100) * (i.itbis / 100), 0);
    const total = subtotal + taxTotal;

    const addItem = () => setItems(p => [...p, { id: Date.now(), name: "", ref: "", qty: 1, price: 0, disc: 0, itbis: 18, desc: "" }]);
    const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
    const updateItem = (id: number, field: keyof Item, value: any) =>
        setItems(p => p.map(i => i.id !== id ? i : { ...i, [field]: value }));

    const handleSave = () => {
        // Save current quote data to sessionStorage with ID
        const quoteData = {
            quoteNumber, date, validUntil, paymentTerms, notes, terms, footer, vendedor,
            clientId: client?.id,
            client: client ? { name: client.name, rnc: client.rnc, address: client.address, phone: client.phone, email: client.email } : null,
            items, totals: { subtotal, discount: discountTotal, tax: taxTotal, total }
        };
        sessionStorage.setItem(`quote_${quoteNumber}`, JSON.stringify(quoteData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleConvertToInvoice = () => {
        // Build invoice preview data from this quote
        const invoiceData = {
            tipo: "B02", ncf: "PS000000001",
            date: new Date().toISOString().split("T")[0],
            dueDate: `${new Date().getFullYear()}-12-31`,
            paymentTerms, notes, terms, footer, vendedor,
            client: client ? { name: client.name, rnc: client.rnc, address: client.address, phone: client.phone, email: client.email } : null,
            items: items.filter(i => i.name).map(i => ({
                id: i.id, description: i.name + (i.desc ? ` - ${i.desc}` : ""),
                qty: i.qty, price: i.price, discount: i.price * i.qty * (i.disc / 100),
                tax: i.price * i.qty * (1 - i.disc / 100) * (i.itbis / 100),
                total: i.price * i.qty * (1 - i.disc / 100),
            })),
            totals: { subtotal, discount: discountTotal, tax: taxTotal, total }
        };
        sessionStorage.setItem('invoice_preview_data', JSON.stringify(invoiceData));
        // Save form state for the invoice form too (so it can be pre-filled)
        sessionStorage.setItem('invoice_from_quote', JSON.stringify({
            clientId: client?.id, items, notes, terms, paymentTerms
        }));
        router.push('/dashboard/invoices/new?from=quote');
    };

    const handlePreview = () => {
        const previewData = {
            type: "quote", quoteNumber, date, validUntil, paymentTerms, notes, terms, footer, vendedor,
            client: client ? { name: client.name, rnc: client.rnc, address: client.address, phone: client.phone, email: client.email } : null,
            items: items.filter(i => i.name).map(i => ({
                id: i.id, description: i.name + (i.desc ? ` - ${i.desc}` : ""),
                qty: i.qty, price: i.price, discount: i.price * i.qty * (i.disc / 100),
                tax: i.price * i.qty * (1 - i.disc / 100) * (i.itbis / 100),
                total: i.price * i.qty * (1 - i.disc / 100),
            })),
            totals: { subtotal, discount: discountTotal, tax: taxTotal, total }
        };
        sessionStorage.setItem('invoice_preview_data', JSON.stringify(previewData));
        router.push('/dashboard/invoices/preview?type=quote');
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.rnc.includes(clientSearch)
    );

    return (
        <>
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-5 py-3.5 shadow-2xl shadow-emerald-500/40">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Cotización guardada</p>
                            <p className="text-xs text-emerald-200">Borrador disponible</p>
                        </div>
                    </div>
                </div>
            )}

            {newContactOpen && (
                <NewContactPanel
                    onSave={c => { setClients(p => [c, ...p]); setClient(c); setNewContactOpen(false); }}
                    onCancel={() => setNewContactOpen(false)}
                />
            )}

            <div className="min-h-screen bg-muted/20" style={{ fontFamily: 'var(--font-inter), var(--font-avenir), system-ui, sans-serif' }}>
                {/* ── Page header ── */}
                <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/ingresos/cotizaciones">
                            <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <h1 className="text-base font-bold text-foreground">Nueva cotización</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors">
                            <Settings2 className="w-3.5 h-3.5" /> Personalizar opciones
                        </button>
                    </div>
                </div>

                {/* ── Top config bar ── */}
                <div className="bg-background/80 backdrop-blur-sm border-b px-6 py-2">
                    <div className="max-w-5xl mx-auto flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">Vendedor</Label>
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                            <Select value={vendedor} onValueChange={setVendedor}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto min-w-[80px]">
                                    <SelectValue placeholder="Busca..." /><ChevronDown className="w-3 h-3 opacity-60" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["María López", "Carlos Pérez", "Admin"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* ── Main content ── */}
                <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-4">

                    {/* ── Document card ── */}
                    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">

                        {/* Header: logo + Quote Number */}
                        <div className="grid grid-cols-2 border-b divide-x">
                            <div className="p-5 flex items-center gap-4">
                                <div className="w-20 h-14 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-muted-foreground/50 shrink-0 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <span className="font-black text-2xl text-gradient">PS</span>
                                    <span className="text-[9px] group-hover:text-primary/60 transition-colors">Logo</span>
                                </div>
                                <div>
                                    <p className="font-bold text-base text-foreground">Sed Photo</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">RNC: 130123456</p>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-end gap-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Cotización / Proforma</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">No.</span>
                                    <Input
                                        value={quoteNumber}
                                        onChange={e => setQuoteNumber(e.target.value)}
                                        className="text-lg font-bold font-mono w-40 text-right border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-foreground bg-transparent"
                                    />
                                    <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Client + Dates */}
                        <div className="grid grid-cols-2 border-b divide-x">
                            <div className="p-5 space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Contacto *</Label>
                                    <Popover open={clientOpen} onOpenChange={setClientOpen}>
                                        <PopoverTrigger asChild>
                                            <div className="relative">
                                                <Input
                                                    value={client ? client.name : clientSearch}
                                                    onChange={e => { setClientSearch(e.target.value); setClient(null); }}
                                                    onFocus={() => setClientOpen(true)}
                                                    placeholder="Buscar..."
                                                    className="pr-32 h-9 focus-visible:ring-primary/30"
                                                />
                                                {!client && (
                                                    <button onClick={e => { e.stopPropagation(); setNewContactOpen(true); setClientOpen(false); }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 whitespace-nowrap">
                                                        <Plus className="w-3 h-3" /> Nuevo contacto
                                                    </button>
                                                )}
                                                {client && (
                                                    <button onClick={() => setClient(null)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="w-[360px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar cliente o RNC..." value={clientSearch} onValueChange={setClientSearch} />
                                                <CommandList>
                                                    <CommandEmpty>No se encontraron clientes</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredClients.map(c => (
                                                            <CommandItem key={c.id} onSelect={() => { setClient(c); setClientOpen(false); setClientSearch(""); }}
                                                                className="flex flex-col items-start cursor-pointer gap-0 py-2">
                                                                <span className="font-medium text-sm">{c.trade || c.name}</span>
                                                                <span className="text-xs text-muted-foreground">{c.name} · RNC {c.rnc}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">RNC o Cédula</Label>
                                    <div className="relative">
                                        <Input value={client?.rnc || ""} readOnly className="h-8 text-sm bg-muted/20 text-muted-foreground cursor-default" />
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground font-medium">Teléfono</Label>
                                    <Input value={client?.phone || ""} readOnly className="h-8 text-sm bg-muted/20 text-muted-foreground cursor-default" />
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Fecha *</Label>
                                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 text-sm" />
                                    </div>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-5" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Condiciones de pago</Label>
                                        <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-5" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Válida hasta *</Label>
                                        <Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="h-9 text-sm" />
                                    </div>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-5" />
                                </div>
                            </div>
                        </div>

                        {/* Items grid */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-secondary/30 text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                                        <th className="py-2.5 px-2 text-left">Producto / Servicio</th>
                                        <th className="py-2.5 px-1.5 text-left">Referencia</th>
                                        <th className="py-2.5 px-1.5 text-left">Precio</th>
                                        <th className="py-2.5 px-1.5 text-right w-20">Desc %</th>
                                        <th className="py-2.5 px-1.5 text-left">Impuesto</th>
                                        <th className="py-2.5 px-1.5 text-left">Descripción</th>
                                        <th className="py-2.5 px-1.5 text-right w-20">Cantidad</th>
                                        <th className="py-2.5 px-2 text-right">Total</th>
                                        <th className="w-8" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <ItemRow key={item.id} item={item}
                                            onUpdate={(field, val) => updateItem(item.id, field, val)}
                                            onRemove={() => removeItem(item.id)} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add line */}
                        <div className="px-3 py-2 border-b">
                            <button onClick={addItem} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors py-1">
                                <Plus className="w-4 h-4" /> Agregar línea
                            </button>
                        </div>

                        {/* Totals */}
                        <div className="grid grid-cols-2 gap-6 p-5 border-b">
                            <div>
                                <div className="border-2 border-dashed border-border/60 rounded-xl h-20 flex flex-col items-center justify-center text-muted-foreground/50 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <Pencil className="w-5 h-5 mb-1 group-hover:text-primary/50 transition-colors" />
                                    <span className="text-xs font-medium">Utilizar mi firma</span>
                                    <span className="text-[10px] mt-0.5">175 x 51 pixeles</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono">RD$ {subtotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Descuento</span>
                                    <span className="font-mono text-destructive">-RD$ {discountTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>ITBIS</span>
                                    <span className="font-mono">RD$ {taxTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-base text-foreground">
                                    <span>Total</span>
                                    <span className="font-mono text-gradient">RD$ {total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer fields */}
                        <div className="p-5 grid grid-cols-2 gap-4 border-b">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    Términos y condiciones <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                </Label>
                                <Textarea value={terms} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTerms(e.target.value)}
                                    placeholder="Visible en la impresión del documento"
                                    className="text-sm min-h-[80px] resize-none bg-muted/10 focus-visible:ring-primary/30" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    Notas <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                </Label>
                                <Textarea value={notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                                    className="text-sm min-h-[80px] resize-none bg-muted/10 focus-visible:ring-primary/30" />
                            </div>
                        </div>
                        <div className="px-5 py-4 border-b">
                            <Label className="text-xs text-muted-foreground font-medium block mb-1.5">Pie de cotización</Label>
                            <Textarea value={footer} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFooter(e.target.value)}
                                placeholder="Visible en la impresión del documento"
                                className="text-sm min-h-[56px] resize-none bg-muted/10 focus-visible:ring-primary/30" />
                        </div>
                        <div className="px-5 py-2 text-xs text-muted-foreground/60">
                            Los campos marcados con * son obligatorios
                        </div>
                    </div>

                    {/* Info block */}
                    <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center gap-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Info className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Guarda primero para poder{" "}
                            <button className="text-primary underline hover:no-underline">agregar comentarios</button>.
                        </p>
                    </div>
                </div>

                {/* ── Fixed bottom action bar ── */}
                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-lg px-6 py-3 flex items-center justify-between z-20">
                    <Link href="/dashboard/ingresos/cotizaciones">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Cancelar</Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 hover:bg-secondary/50 hover:text-primary hover:border-primary/30" onClick={handlePreview}>
                            <Eye className="w-4 h-4" /> Vista previa
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400"
                            onClick={handleConvertToInvoice}
                        >
                            <FileText className="w-4 h-4" /> Convertir a Factura
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={handleSave}>
                            Guardar y crear nueva
                        </Button>
                        <div className="flex">
                            <Button className="rounded-r-none bg-gradient-brand border-0 text-white gap-2 shadow-sm" onClick={handleSave}>
                                <Save className="w-4 h-4" /> Guardar
                            </Button>
                            <Button className="rounded-l-none bg-gradient-brand border-0 border-l border-white/20 text-white px-2 shadow-sm">
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
