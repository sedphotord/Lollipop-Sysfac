"use client";

import { companyStorage } from "@/lib/company-storage";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
    ArrowLeft, Check, CheckCircle2, ChevronDown, Eye,
    HelpCircle, Info, Pencil, Plus, Save, Search, Trash2, UserPlus, X, Settings2,
    Send, FilePlus, FileText, Printer, Mail, DollarSign
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { generateNextNCF } from "@/lib/ncf";

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  MOCK DATA
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const DEFAULT_CLIENTS = [
    { id: "1", rnc: "101010101", name: "COMPA├æIA DOMINICANA DE TELEFONOS S.A.", trade: "CLARO", type: "SRL", status: "Activo", email: "facturacion@claro.com.do", phone: "809-220-0000", address: "Av. John F. Kennedy 27, Santo Domingo" },
    { id: "2", rnc: "130000001", name: "JUAN ANTONIO PEREZ ROSARIO", trade: "", type: "Persona Física", status: "Activo", email: "jperez@gmail.com", phone: "829-555-1234", address: "C/ Las Mercedes 12, Santiago" },
    { id: "3", rnc: "130819985", name: "ALTICE DOMINICANA S.A.", trade: "ALTICE", type: "SRL", status: "Activo", email: "cxp@altice.com.do", phone: "809-200-1111", address: "Av. 27 de Febrero 450, Santo Domingo" },
];

const MOCK_PRODUCTS = [
    { id: "1", code: "SRV-001", name: "Consultoría IT", price: 5000, itbis: 18 },
    { id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", price: 85000, itbis: 18 },
    { id: "3", code: "SFT-007", name: "Licencia Microsoft Office 365", price: 6500, itbis: 18 },
    { id: "4", code: "PRD-003", name: "Libro de Contabilidad", price: 1500, itbis: 0 },
];

const TIPOS = [
    { code: "B01", name: "Crédito Fiscal" },
    { code: "B02", name: "Consumo" },
    { code: "B14", name: "Gubernamental" },
    { code: "B15", name: "Exportación" },
];

// NCF series starting numbers per type
const NCF_SERIES: Record<string, string> = {
    B01: "B0100000001",
    B02: "B0200000001",
    B04: "B0400000001",
    B14: "B1400000001",
    B15: "B1500000001",
};

const PAYMENT_TERMS = [
    "Vencimiento manual",
    "De contado",
    "Neto 15 días",
    "Neto 30 días",
    "Neto 60 días",
];

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  TYPES
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
type Client = typeof DEFAULT_CLIENTS[0];
type Item = { id: number; name: string; ref: string; qty: number; price: number; disc: number; itbis: number; desc: string };

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  NEW CONTACT DIALOG (inline, not a Dialog component to avoid accessibility warning)
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function NewContactPanel({ onSave, onCancel }: { onSave: (c: Client) => void; onCancel: () => void }) {
    const [tab, setTab] = useState<"cliente" | "proveedor">("cliente");
    const [form, setForm] = useState({ rnc: "", name: "", trade: "", type: "RNC", email: "", phone: "", address: "", municipio: "" });
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const MUNICIPIOS = ["Santo Domingo", "Santiago", "San Cristóbal", "La Vega", "Puerto Plata", "San Pedro de Macorís", "Hig├╝ey", "Barahona", "Moca", "Bonao"];

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
                            <SelectTrigger className="h-9"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RNC">RNC</SelectItem>
                                <SelectItem value="Cedula">Cédula</SelectItem>
                                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Número</Label>
                        <Input placeholder="" value={form.rnc} onChange={e => set("rnc")(e.target.value)} className="h-9" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Nombre o Razón social *</Label>
                        <Input placeholder="" value={form.name} onChange={e => set("name")(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Municipio / Provincia</Label>
                        <Select value={form.municipio} onValueChange={set("municipio")}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                {MUNICIPIOS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Dirección</Label>
                        <Input placeholder="" value={form.address} onChange={e => set("address")(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Correo electrónico</Label>
                        <Input type="email" placeholder="Ejemplo@email.com" value={form.email} onChange={e => set("email")(e.target.value)} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Teléfono</Label>
                        <Input placeholder="___-___-____" value={form.phone} onChange={e => set("phone")(e.target.value)} className="h-9" />
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

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  HELPERS
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const CURRENCY_SYMBOLS: Record<string, string> = { DOP: "RD$", USD: "US$", EUR: "Ôé¼" };
const DEFAULT_RATES: Record<string, number> = { DOP: 1, USD: 58.5, EUR: 63.5 };
/** Converts a DOP amount to the display currency and formats it */
function fmtCurrency(amount: number, moneda: string, rate = 1) {
    const sym = CURRENCY_SYMBOLS[moneda] || moneda;
    const converted = rate > 0 ? amount / rate : amount;
    return `${sym} ${converted.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  ITEM ROW
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function ItemRow({ item, onUpdate, onRemove, currency, exchangeRate }: {
    item: Item;
    onUpdate: (field: keyof Item, value: any) => void;
    onRemove: () => void;
    currency: string;
    exchangeRate: number;
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
                            item.name
                                ? "border-border text-foreground hover:border-primary/50"
                                : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate text-xs">{item.name || "Buscar producto o servicio..."}</span>
                            <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-1 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0" align="start" side="bottom">
                        <Command>
                            <CommandInput placeholder="Buscar en cat├ílogo..." />
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
                {fmtCurrency(lineTotal, currency, exchangeRate)}
            </td>
            <td className="py-1.5 px-1.5 w-8">
                <button onClick={onRemove} className="opacity-0 group-hover/row:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all p-0.5 rounded">
                    <X className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
    );
}

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  MAIN COMPONENT (Inner)
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function InvoiceBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get Dec 31 of current year
    const currentYear = new Date().getFullYear();
    const dec31 = `${currentYear}-12-31`;
    const todayISO = new Date().toISOString().split("T")[0];

    const [tipo, setTipo] = useState("B01");
    const [ncf, setNcf] = useState("");
    const [ncfModalOpen, setNcfModalOpen] = useState(false);
    const [ncfForm, setNcfForm] = useState({ autoNum: true, tipoNcf: "B01", siguienteNum: "1", fechaVenc: `${new Date().getFullYear() + 1}-03-03`, pieFactura: "" });
    const [plantilla, setPlantilla] = useState("standard");
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
    const [paymentTerms, setPaymentTerms] = useState("Vencimiento manual");
    const [date, setDate] = useState(todayISO);
    const [dueDate, setDueDate] = useState(dec31);
    const [notes, setNotes] = useState("");
    const [terms, setTerms] = useState("");
    const [footer, setFooter] = useState("");
    const [almacen, setAlmacen] = useState("Principal");
    const [vendedor, setVendedor] = useState("");
    const [listaPrecios, setListaPrecios] = useState("General");
    const [saved, setSaved] = useState(false);
    const [fromQuote, setFromQuote] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('Mi Empresa SRL');
    const [companyRnc, setCompanyRnc] = useState('130-12345-6');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [invoiceMode, setInvoiceMode] = useState<'tradicional' | 'electronico'>('electronico');
    const [moneda, setMoneda] = useState("DOP");
    const [exchangeRate, setExchangeRate] = useState(1);

    // When currency changes, preset default rate
    useEffect(() => {
        setExchangeRate(DEFAULT_RATES[moneda] ?? 1);
    }, [moneda]);

    // Load company info from localStorage (set in Settings page)
    useEffect(() => {
        const logo = companyStorage.get('lollipop_company_logo') || companyStorage.get('sysfac_company_logo');
        if (logo) setCompanyLogo(logo);
        const raw = companyStorage.get('lollipop_company_settings');
        if (raw) {
            try {
                const co = JSON.parse(raw);
                if (co.name) setCompanyName(co.name);
                if (co.rnc) setCompanyRnc(co.rnc);
                if (co.address) setCompanyAddress(co.address);
                if (co.phone) setCompanyPhone(co.phone);
                if (co.email) setCompanyEmail(co.email);
            } catch { }
        }
        // Restore selected template from sessionStorage (survives preview navigation)
        const savedTpl = sessionStorage.getItem('invoice_selected_template');
        if (savedTpl) setPlantilla(savedTpl);

        const savedMode = companyStorage.get('sysfac_invoice_mode');
        if (savedMode === 'tradicional' || savedMode === 'electronico') {
            setInvoiceMode(savedMode);
        }
    }, []);

    // Auto-generate NCF when type changes or mode changes
    useEffect(() => {
        try {
            const emitted = JSON.parse(companyStorage.get('invoice_emitted') || '[]');
            setNcf(generateNextNCF(tipo, emitted, invoiceMode));
        } catch {
            setNcf(generateNextNCF(tipo, [], invoiceMode));
        }
    }, [tipo, invoiceMode]);

    // Pre-fill from quote conversion
    useEffect(() => {
        const from = searchParams.get('from');
        if (from === 'quote') {
            const raw = sessionStorage.getItem('invoice_from_quote');
            if (raw) {
                try {
                    const data = JSON.parse(raw);
                    if (data.client) {
                        // Try to match an existing client by name
                        const matched = DEFAULT_CLIENTS.find(c =>
                            c.name === data.client.name || c.rnc === data.client.rnc
                        );
                        if (matched) {
                            setClient(matched);
                        } else if (data.client.name) {
                            // Set as a virtual client
                            setClient({
                                id: 'quote-client', rnc: data.client.rnc || '', name: data.client.name,
                                trade: '', type: 'RNC', status: 'Activo',
                                email: data.client.email || '', phone: data.client.phone || '',
                                address: data.client.address || ''
                            });
                        }
                    }
                    if (data.items && data.items.length > 0) {
                        setItems(data.items.map((i: any, idx: number) => ({
                            id: idx + 1,
                            name: i.description || i.name || '',
                            ref: i.ref || '',
                            qty: i.qty || 1,
                            price: i.price || 0,
                            disc: i.disc || 0,
                            itbis: i.itbis !== undefined ? i.itbis : 18,
                            desc: i.desc || '',
                        })));
                    }
                    if (data.notes) setNotes(data.notes);
                    if (data.paymentTerms) setPaymentTerms(data.paymentTerms);
                    setFromQuote(true);
                } catch (_) { }
            }
        }
    }, [searchParams]);

    const tipoInfo = TIPOS.find(t => t.code === tipo)!;

    const subtotal = items.reduce((a, i) => a + i.price * i.qty * (1 - i.disc / 100), 0);
    const discountTotal = items.reduce((a, i) => a + i.price * i.qty * (i.disc / 100), 0);
    const taxTotal = items.reduce((a, i) => a + i.price * i.qty * (1 - i.disc / 100) * (i.itbis / 100), 0);
    const total = subtotal + taxTotal;

    const addItem = () => setItems(p => [...p, { id: Date.now(), name: "", ref: "", qty: 1, price: 0, disc: 0, itbis: 18, desc: "" }]);
    const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id));
    const updateItem = (id: number, field: keyof Item, value: any) =>
        setItems(p => p.map(i => i.id !== id ? i : { ...i, [field]: value }));

    const handleSave = (autoPay = false) => {
        const emittedForId = JSON.parse(companyStorage.get('invoice_emitted') || '[]');
        const existingIds = emittedForId.map((i: any) => {
            const num = parseInt(i.id);
            return isNaN(num) ? 0 : num;
        });
        const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        const invoiceId = String(nextId).padStart(4, '0');
        const invoice = {
            id: invoiceId,
            ecf: ncf,
            tipo,
            tipoName: tipo === 'B01' ? 'Crédito Fiscal' : tipo === 'B02' ? 'Consumo' : tipo === 'B14' ? 'Régimen Especial' : tipo === 'B15' ? 'Gubernamental' : tipo,
            cliente: client?.name || 'Consumidor final',
            rnc: client?.rnc || '',
            date: date || new Date().toLocaleDateString('es-DO'),
            vencimiento: dueDate || '—',
            total: total,
            status: 'pending', // pending DGII acceptance
            paymentStatus: 'pendiente',
            savedAt: new Date().toISOString(),
            paymentTerms,
            notes,
            vendedor,
            items: items.filter(i => i.name),
            totals: { subtotal, discount: discountTotal, tax: taxTotal, total },
            terms, footer, almacen, listaPrecios, moneda, mode: invoiceMode, plantilla
        };
        const existing = JSON.parse(companyStorage.get('invoice_emitted') || '[]');
        existing.unshift(invoice);
        companyStorage.set('invoice_emitted', JSON.stringify(existing));
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            if (autoPay) {
                router.push(`/dashboard/invoices/${invoiceId}?pay=true`);
            } else {
                router.push('/dashboard/invoices');
            }
        }, 1500);
    };

    const handlePreview = () => {
        // Save state to sessionStorage and navigate to preview page
        const previewData = {
            company: { name: companyName, rnc: companyRnc, logo: companyLogo, address: companyAddress, phone: companyPhone, email: companyEmail },
            client: { name: client?.name || "Consumidor final", rnc: client?.rnc || "", address: client?.address || "", phone: client?.phone || "", email: client?.email || "" },
            document: { type: tipo === 'B01' ? 'Crédito Fiscal' : tipo === 'B02' ? 'Consumo' : tipo === 'B14' ? 'Régimen Especial' : tipo === 'B15' ? 'Gubernamental' : tipo, number: ncf, date: date || new Date().toLocaleDateString('es-DO'), dueDate: dueDate || '—', terms: paymentTerms, seller: vendedor, notes, footer, currency: moneda, mode: invoiceMode },
            items: items.filter(i => i.name).map(i => ({
                id: i.id,
                name: i.name,
                description: i.desc || "",
                code: i.ref || "",
                qty: i.qty, price: i.price, itbis: i.itbis,
                discount: i.price * i.qty * (i.disc / 100),
                tax: i.price * i.qty * (1 - i.disc / 100) * (i.itbis / 100),
                total: i.price * i.qty * (1 - i.disc / 100),
            })),
            totals: { subtotal, discount: discountTotal, tax: taxTotal, total },
            template: plantilla,
        };
        sessionStorage.setItem('invoice_selected_template', plantilla);
        sessionStorage.setItem('invoice_preview_data', JSON.stringify(previewData));
        router.push('/dashboard/invoices/preview');
    };

    const handleSaveDraft = () => {
        const draft = {
            id: `DRAFT-${Date.now()}`,
            savedAt: new Date().toISOString(),
            tipo, ncf, date, dueDate, paymentTerms, notes, footer, vendedor, plantilla,
            client: client ? { name: client.name, rnc: client.rnc, address: client.address } : null,
            items: items.filter(i => i.name),
        };
        // Save to array for multi-draft support
        const existing = JSON.parse(companyStorage.get('invoice_drafts') || '[]');
        existing.unshift(draft);
        companyStorage.set('invoice_drafts', JSON.stringify(existing));
        // Also keep the legacy single-draft key for compatibility
        companyStorage.set('invoice_draft', JSON.stringify(draft));
        router.push('/dashboard/invoices');
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
                            <p className="font-bold text-sm">Factura emitida exitosamente</p>
                            <p className="text-xs text-emerald-200">Redirigiendo...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ÔöÇÔöÇ Exit Confirmation Modal ÔöÇÔöÇ */}
            {showExitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowExitModal(false)}>
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-4">
                            <h2 className="font-bold text-lg text-foreground">¿Salir de la factura?</h2>
                            <p className="text-sm text-muted-foreground mt-1">Tienes cambios sin guardar. ¿Qué deseas hacer?</p>
                        </div>
                        <div className="px-6 pb-6 flex flex-col gap-3">
                            <Button
                                onClick={handleSaveDraft}
                                className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
                            >
                                <Save className="w-4 h-4" /> Guardar como borrador
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard/invoices')}
                                className="w-full gap-2 text-destructive border-destructive/40 hover:bg-destructive/5"
                            >
                                <X className="w-4 h-4" /> Salir sin guardar
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowExitModal(false)}
                                className="w-full text-muted-foreground"
                            >
                                Seguir editando
                            </Button>
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

            <div className="min-h-screen bg-muted/20">
                {/* ÔöÇÔöÇ Page header ÔöÇÔöÇ */}
                <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4.5 h-4.5" />
                        </button>
                        <h1 className="text-base font-bold text-foreground">Nueva factura</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors">
                            <Settings2 className="w-3.5 h-3.5" /> Personalizar opciones
                        </button>
                    </div>
                </div>

                {/* ÔöÇÔöÇ Top config bar ÔöÇÔöÇ */}
                <div className="bg-background/80 backdrop-blur-sm border-b px-6 py-2">
                    <div className="max-w-5xl mx-auto flex items-center gap-6">
                        {[
                            { label: "Almacén", value: almacen, onChange: setAlmacen, options: ["Principal", "Secundario"] },
                        ].map(f => (
                            <div key={f.label} className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap">{f.label}</Label>
                                <Select value={f.value} onValueChange={f.onChange}>
                                    <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>{f.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        ))}
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Lista de precios</Label>
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                            <Select value={listaPrecios} onValueChange={setListaPrecios}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto">
                                    <SelectValue /><ChevronDown className="w-3 h-3 opacity-60" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["General", "Mayoreo", "VIP"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Vendedor</Label>
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                            <Select value={vendedor} onValueChange={setVendedor}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto min-w-[80px]">
                                    <SelectValue placeholder="Busca..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["María López", "Carlos Pérez", "Admin"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Moneda</Label>
                            <Select value={moneda} onValueChange={setMoneda}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto min-w-[50px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["DOP", "USD", "EUR"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {moneda !== "DOP" && (
                            <div className="flex items-center gap-1.5">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap">Tasa</Label>
                                <span className="text-xs text-muted-foreground/60 font-mono">1 {moneda} =</span>
                                <input
                                    type="number"
                                    value={exchangeRate}
                                    onChange={e => setExchangeRate(parseFloat(e.target.value) || 1)}
                                    min={0.01}
                                    step={0.01}
                                    className="w-20 h-7 text-xs font-mono font-bold text-center border border-border/60 rounded-md bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary/40 px-2"
                                />
                                <span className="text-xs text-muted-foreground/60 font-mono">DOP</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Modalidad</Label>
                            <Select value={invoiceMode} onValueChange={(v: 'tradicional' | 'electronico') => setInvoiceMode(v)}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto min-w-[90px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electronico">e-CF</SelectItem>
                                    <SelectItem value="tradicional">Tradicional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground font-semibold">Plantilla *</Label>
                            <Select value={plantilla} onValueChange={v => { setPlantilla(v); sessionStorage.setItem('invoice_selected_template', v); }}>
                                <SelectTrigger className="h-7 text-xs border-0 shadow-none bg-transparent p-0 gap-1 font-semibold text-foreground focus:ring-0 w-auto min-w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="w-44">
                                    <SelectItem value="standard">Estándar</SelectItem>
                                    <SelectItem value="modern">Moderno</SelectItem>
                                    <SelectItem value="corporate">Corporativo</SelectItem>
                                    <SelectItem value="elegant">Elegante</SelectItem>
                                    <SelectItem value="minimal">Minimalista</SelectItem>
                                    <SelectItem value="ticket80">Ticket 80mm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* ÔöÇÔöÇ Main content ÔöÇÔöÇ */}
                <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-4">

                    {/* ÔöÇÔöÇ Document card ÔöÇÔöÇ */}
                    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">

                        {/* Header: logo + NCF */}
                        <div className="grid grid-cols-2 border-b divide-x">
                            <div className="p-5 flex items-center gap-4">
                                {companyLogo ? (
                                    <img src={companyLogo} alt={companyName} className="h-14 w-20 object-contain rounded-xl border border-border/40 bg-muted/20 p-1" />
                                ) : (
                                    <div className="w-20 h-14 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-muted-foreground/50 shrink-0">
                                        <span className="font-black text-2xl text-gradient">Logo</span>
                                        <span className="text-[9px]">Sin logo</span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-base text-foreground">{companyName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">RNC: {companyRnc}</p>
                                    {companyAddress && <p className="text-xs text-muted-foreground">{companyAddress}</p>}
                                    {(companyPhone || companyEmail) && (
                                        <p className="text-xs text-muted-foreground">{[companyPhone, companyEmail].filter(Boolean).join(' · ')}</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-end gap-3">
                                <Select value={tipo} onValueChange={v => setTipo(v)}>
                                    <SelectTrigger className="h-9 text-xs border rounded-lg min-w-[180px] bg-secondary/30">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPOS.map(t => <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground">
                                        {invoiceMode === 'electronico' ? 'e-CF' : 'NCF'}
                                    </span>
                                    <Input
                                        value={ncf}
                                        onChange={e => setNcf(e.target.value)}
                                        className="text-lg font-bold font-mono w-44 text-right border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-foreground bg-transparent"
                                    />
                                    <button onClick={() => setNcfModalOpen(true)} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
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
                                    <div className="relative">
                                        <Input
                                            value={client ? client.name : clientSearch}
                                            onChange={e => { setClientSearch(e.target.value); setClient(null); setClientOpen(true); }}
                                            onFocus={() => setClientOpen(true)}
                                            onBlur={() => setTimeout(() => setClientOpen(false), 180)}
                                            placeholder="Buscar cliente o RNC..."
                                            className="pr-32 h-9 focus-visible:ring-primary/30"
                                        />
                                        {!client && (
                                            <button onMouseDown={e => { e.preventDefault(); setNewContactOpen(true); setClientOpen(false); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 whitespace-nowrap">
                                                <Plus className="w-3 h-3" /> Nuevo contacto
                                            </button>
                                        )}
                                        {client && (
                                            <button onMouseDown={e => { e.preventDefault(); setClient(null); setClientSearch(""); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        {clientOpen && !client && (
                                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-border rounded-xl shadow-xl z-50 max-h-52 overflow-auto">
                                                {filteredClients.length === 0 ? (
                                                    <p className="px-4 py-3 text-sm text-muted-foreground text-center">No se encontraron clientes</p>
                                                ) : (
                                                    filteredClients.map(c => (
                                                        <button key={c.id}
                                                            onMouseDown={e => { e.preventDefault(); setClient(c); setClientOpen(false); setClientSearch(""); }}
                                                            className="w-full text-left px-4 py-2.5 hover:bg-muted/40 border-b border-border/30 last:border-0 flex flex-col gap-0.5 transition-colors">
                                                            <span className="font-medium text-sm">{c.trade || c.name}</span>
                                                            <span className="text-xs text-muted-foreground font-mono">{c.name} · RNC {c.rnc}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                        <Label className="text-xs text-muted-foreground font-medium">Plazo de pago</Label>
                                        <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>{PAYMENT_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-5" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs text-muted-foreground font-medium">Vencimiento *</Label>
                                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-9 text-sm" />
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
                                        <th className="py-2.5 px-2 text-left">Producto</th>
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
                                            currency={moneda}
                                            exchangeRate={exchangeRate}
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

                        {/* Totals + Signature */}
                        <div className="grid grid-cols-2 gap-6 p-5 border-b">
                            <div>
                                <div className="border-2 border-dashed border-border/60 rounded-xl h-20 flex flex-col items-center justify-center text-muted-foreground/50 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                    <Pencil className="w-5 h-5 mb-1 group-hover:text-primary/50 transition-colors" />
                                    <span className="text-xs font-medium">Utilizar mi firma</span>
                                    <span className="text-[10px] mt-0.5">175 x 51 pixeles</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <button className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium">
                                        <Plus className="w-3.5 h-3.5" /> Agregar Retención
                                    </button>
                                    <button className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium">
                                        <Plus className="w-3.5 h-3.5" /> Agregar Conduce
                                    </button>
                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{fmtCurrency(subtotal, moneda, exchangeRate)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Descuento</span>
                                    <span className="font-mono text-destructive">-{fmtCurrency(discountTotal, moneda, exchangeRate)}</span>
                                </div>
                                <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-base text-foreground">
                                    <span>Total</span>
                                    <span className="font-mono text-gradient">{fmtCurrency(total, moneda, exchangeRate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer fields */}
                        <div className="p-5 grid grid-cols-2 gap-4 border-b">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    Términos y condiciones <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                </Label>
                                <textarea value={terms} onChange={e => setTerms(e.target.value)}
                                    placeholder="Visible en la impresión del documento"
                                    className="w-full text-sm min-h-[80px] resize-none bg-muted/10 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    Notas <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                </Label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                    className="w-full text-sm min-h-[80px] resize-none bg-muted/10 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                            </div>
                        </div>
                        <div className="px-5 py-4 border-b">
                            <Label className="text-xs text-muted-foreground font-medium block mb-1.5">Pie de factura</Label>
                            <textarea value={footer} onChange={e => setFooter(e.target.value)}
                                placeholder="Visible en la impresión del documento"
                                className="w-full text-sm min-h-[56px] resize-none bg-muted/10 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div className="px-5 py-2 text-xs text-muted-foreground/60">
                            Los campos marcados con * son obligatorios
                        </div>
                    </div>

                    {/* Pago recibido */}
                    <div className="bg-card border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm text-foreground">Pago recibido</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Si te hicieron un pago asociado a esta venta puedes hacer aquí su{" "}
                                    <button className="text-primary underline hover:no-underline">registro</button>.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 border-emerald-600/20 hover:bg-emerald-500/10" onClick={() => handleSave(true)}>
                                <DollarSign className="w-4 h-4" /> Registrar Pago
                            </Button>
                        </div>
                    </div>

                    {/* Comments placeholder */}
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

                {/* ÔöÇÔöÇ Fixed bottom action bar ÔöÇÔöÇ */}
                <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-lg px-6 py-3 flex items-center justify-between z-20">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50"
                    >
                        Cancelar
                    </button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2 hover:bg-secondary/50 hover:text-primary hover:border-primary/30" onClick={handlePreview}>
                            <Eye className="w-4 h-4" /> Vista previa
                        </Button>
                        {/* Split save button with dropdown */}
                        <div className="flex">
                            <Button
                                className="rounded-r-none bg-gradient-brand border-0 text-white gap-2 shadow-sm px-5"
                                onClick={() => handleSave(false)}
                            >
                                <Send className="w-4 h-4" /> Emitir factura
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="rounded-l-none bg-gradient-brand border-0 border-l border-white/20 text-white px-2.5 shadow-sm">
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mb-1">
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" onClick={() => handleSave(false)}>
                                        <Send className="w-4 h-4 text-primary" />
                                        <div>
                                            <p className="font-semibold text-sm">Emitir factura</p>
                                            <p className="text-xs text-muted-foreground">Guardar como emitida</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" onClick={() => handleSave(true)}>
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                        <div>
                                            <p className="font-semibold text-sm">Emitir y Pagar</p>
                                            <p className="text-xs text-muted-foreground">Guardar y registrar pago</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" onClick={handleSaveDraft}>

                                        <FileText className="w-4 h-4 text-amber-500" />
                                        <div>
                                            <p className="font-semibold text-sm">Guardar borrador</p>
                                            <p className="text-xs text-muted-foreground">Continuar más tarde</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" onClick={() => { handleSave(); }}>
                                        <FilePlus className="w-4 h-4 text-emerald-600" />
                                        <div>
                                            <p className="font-semibold text-sm">Guardar y crear nueva</p>
                                            <p className="text-xs text-muted-foreground">Guardar y abrir formulario limpio</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" onClick={handlePreview}>
                                        <Printer className="w-4 h-4 text-slate-500" />
                                        <div>
                                            <p className="font-semibold text-sm">Vista previa / Imprimir</p>
                                            <p className="text-xs text-muted-foreground">Abrir vista previa PDF</p>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5" disabled>
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <div>
                                            <p className="font-semibold text-sm">Enviar por correo</p>
                                            <p className="text-xs text-muted-foreground">Próximamente</p>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* ÔöÇÔöÇ NCF Editar Numeración Modal ÔöÇÔöÇ */}
            {ncfModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setNcfModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between">
                            <h2 className="font-bold text-base text-slate-800">Editar numeración</h2>
                            <button onClick={() => setNcfModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Nombre:</span>
                                <span className="font-semibold text-sm">{TIPOS.find(t => t.code === tipo)?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Numeración automática:</span>
                                <input type="checkbox" checked={ncfForm.autoNum} onChange={e => setNcfForm(p => ({ ...p, autoNum: e.target.checked }))} className="w-4 h-4 accent-primary" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500">Tipo de NCF</Label>
                                <Input value={ncfForm.tipoNcf} onChange={e => setNcfForm(p => ({ ...p, tipoNcf: e.target.value }))} className="h-10 bg-slate-50" placeholder="PS" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500">Siguiente número: *</Label>
                                <Input type="number" value={ncfForm.siguienteNum} onChange={e => setNcfForm(p => ({ ...p, siguienteNum: e.target.value }))} className="h-10" min={1} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500">Fecha de vencimiento:</Label>
                                <Input type="date" value={ncfForm.fechaVenc} onChange={e => setNcfForm(p => ({ ...p, fechaVenc: e.target.value }))} className="h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500">Pie de factura</Label>
                                <textarea
                                    className="w-full h-20 border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50"
                                    placeholder="Ejemplo: Pagar en cuenta corriente 100000001"
                                    value={ncfForm.pieFactura}
                                    onChange={e => setNcfForm(p => ({ ...p, pieFactura: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-5 flex gap-3 border-t pt-4">
                            <button onClick={() => setNcfModalOpen(false)} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                            <Button onClick={() => {
                                setNcf(`${ncfForm.tipoNcf}${String(parseInt(ncfForm.siguienteNum)).padStart(8, '0')}`);
                                setFooter(ncfForm.pieFactura);
                                setNcfModalOpen(false);
                            }} className="flex-1 h-10 bg-primary text-white font-bold rounded-xl">
                                Guardar
                            </Button>
                        </div>
                        <div className="px-6 pb-4">
                            <button className="text-xs text-primary underline hover:no-underline">Administrar mis numeraciones</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  PAGE EXPORT (Wrapped in Suspense)
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
export default function NewInvoicePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[50vh]"><div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />Cargando constructor...</div>}>
            <InvoiceBuilderContent />
        </Suspense>
    );
}