"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowUpRight, CheckCircle2, Clock, DollarSign, Download,
    FileText, MoreHorizontal, Plus, Search, Send, Eye, Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
//  MOCK DATA
// ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
const INITIAL_DATA = [
    {
        id: "COT-001", fecha: "18 Oct 2024", cliente: "CLARO", concepto: "Consultoría IT + Equipos", monto: 750000, validez: "02 Nov 2024", status: "enviada",
        clientData: { name: "COMPA├æIA DOMINICANA DE TELEFONOS S.A.", rnc: "101010101", address: "Av. John F. Kennedy 27, Santo Domingo", phone: "809-220-0000", email: "facturacion@claro.com.do" },
        items: [{ id: 1, description: "Consultoría IT", qty: 150, price: 5000, discount: 0, tax: 135000, total: 750000 }],
        totals: { subtotal: 750000, discount: 0, tax: 135000, total: 885000 }
    },
    {
        id: "COT-002", fecha: "15 Oct 2024", cliente: "ALTICE", concepto: "Servicio de Mantenimiento Anual", monto: 380000, validez: "30 Oct 2024", status: "aceptada",
        clientData: { name: "ALTICE DOMINICANA S.A.", rnc: "130819985", address: "Av. 27 de Febrero 450, Santo Domingo", phone: "809-200-1111", email: "cxp@altice.com.do" },
        items: [{ id: 1, description: "Mantenimiento Anual", qty: 1, price: 380000, discount: 0, tax: 68400, total: 380000 }],
        totals: { subtotal: 380000, discount: 0, tax: 68400, total: 448400 }
    },
    {
        id: "COT-003", fecha: "10 Oct 2024", cliente: "GRUPO RAMOS", concepto: "Implementación ERP", monto: 1200000, validez: "25 Oct 2024", status: "vencida",
        clientData: { name: "GRUPO RAMOS", rnc: "130000999", address: "Av. Duarte 100, Santiago", phone: "809-582-0000", email: "" },
        items: [{ id: 1, description: "Implementación ERP", qty: 1, price: 1200000, discount: 0, tax: 216000, total: 1200000 }],
        totals: { subtotal: 1200000, discount: 0, tax: 216000, total: 1416000 }
    },
    {
        id: "COT-004", fecha: "22 Oct 2024", cliente: "Pedro Almonte", concepto: "Diseño y Desarrollo Web", monto: 85000, validez: "06 Nov 2024", status: "borrador",
        clientData: { name: "Pedro Almonte", rnc: "", address: "", phone: "", email: "" },
        items: [{ id: 1, description: "Diseño Web", qty: 1, price: 85000, discount: 0, tax: 15300, total: 85000 }],
        totals: { subtotal: 85000, discount: 0, tax: 15300, total: 100300 }
    },
];

const STATUS_STYLES = {
    enviada: "text-blue-600 bg-blue-500/10 border-blue-500/30",
    aceptada: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    vencida: "text-red-500 bg-red-500/10 border-red-500/30",
    borrador: "text-muted-foreground bg-muted"
};

const STATUS_LABELS: Record<string, string> = {
    enviada: "Enviada",
    aceptada: "Aceptada",
    vencida: "Vencida",
    borrador: "Borrador"
};

export default function CotizacionesPage() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(INITIAL_DATA);
    const router = useRouter();

    useEffect(() => {
        // Read quote drafts from localStorage
        const raw = companyStorage.get('quote_draft');
        const rawArr = companyStorage.get('quote_drafts');
        const draftsList: any[] = [];

        if (rawArr) {
            try { JSON.parse(rawArr).forEach((d: any) => draftsList.push(d)); } catch { }
        } else if (raw) {
            try { draftsList.push(JSON.parse(raw)); } catch { }
        }

        if (draftsList.length > 0) {
            const draftRows = draftsList.map((d: any, i: number) => ({
                id: `COT-BORR-${i + 1}`,
                fecha: new Date().toLocaleDateString('es-DO'),
                cliente: d.client?.name || 'Sin cliente',
                concepto: d.items?.[0]?.name || 'Borrador de cotización',
                monto: d.items?.reduce((a: number, it: any) => a + (it.price * it.qty || 0), 0) || 0,
                validez: 'ÔÇö',
                status: 'borrador',
                clientData: d.client || {},
                items: d.items || [],
                totals: d.totals || { subtotal: 0, discount: 0, tax: 0, total: 0 },
                isDraft: true,
            }));
            setData([...draftRows, ...INITIAL_DATA] as any);
        }
    }, []);

    const handleConvertToInvoice = (quote: typeof INITIAL_DATA[0]) => {
        // Store quote data in sessionStorage so the invoice form can pick it up
        const invoiceFormData = {
            client: quote.clientData,
            items: quote.items,
            notes: `Convertido desde cotización ${quote.id}`,
            paymentTerms: "Neto 30 días",
            totals: quote.totals,
        };
        sessionStorage.setItem('invoice_from_quote', JSON.stringify(invoiceFormData));
        // Store preview data too
        const previewData = {
            tipo: "B02", ncf: "PS000000001",
            date: new Date().toISOString().split("T")[0],
            dueDate: `${new Date().getFullYear()}-12-31`,
            paymentTerms: "Neto 30 días",
            notes: `Convertido desde cotización ${quote.id}`,
            client: quote.clientData,
            items: quote.items,
            totals: quote.totals,
        };
        sessionStorage.setItem('invoice_preview_data', JSON.stringify(previewData));
        router.push('/dashboard/invoices/new?from=quote');
    };

    const filtered = data.filter(d =>
        d.cliente.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.concepto.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cotizaciones</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Crea proformas y conviértelas f├ícilmente en facturas e-CF.</p>
                </div>
                <Link href="/dashboard/ingresos/cotizaciones/new">
                    <Button className="bg-gradient-brand border-0 text-white shadow-lg gap-2">
                        <Plus className="w-4 h-4" /> Nueva Cotización
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Total", v: data.length, c: "text-blue-600 bg-blue-500/10", i: DollarSign },
                    { l: "Enviadas", v: data.filter(d => d.status === 'enviada').length, c: "text-blue-600 bg-blue-500/10", i: Send },
                    { l: "Aceptadas", v: data.filter(d => d.status === 'aceptada').length, c: "text-emerald-600 bg-emerald-500/10", i: CheckCircle2 },
                    { l: "Vencidas", v: data.filter(d => d.status === 'vencida').length, c: "text-red-500 bg-red-500/10", i: Clock },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}>
                                <k.i className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{k.l}</p>
                                <p className="text-lg font-bold">{k.v}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar cotizaciones..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" /> Exportar
                        </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>V├ílida hasta</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs font-semibold text-primary">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.cliente}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{d.concepto}</TableCell>
                                        <TableCell className="text-sm">{d.validez}</TableCell>
                                        <TableCell className="text-right font-bold tabular-nums">
                                            RD$ {d.monto.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs capitalize", STATUS_STYLES[d.status as keyof typeof STATUS_STYLES])}>
                                                {STATUS_LABELS[d.status] || d.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                                                        <Link href={`/dashboard/ingresos/cotizaciones/new`}>
                                                            <Eye className="w-4 h-4" /> Ver / Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => {
                                                        const previewData = {
                                                            type: "quote",
                                                            quoteNumber: d.id, date: d.fecha, validUntil: d.validez,
                                                            client: d.clientData, items: d.items, totals: d.totals,
                                                        };
                                                        sessionStorage.setItem('invoice_preview_data', JSON.stringify(previewData));
                                                        router.push('/dashboard/invoices/preview?type=quote');
                                                    }}>
                                                        <FileText className="w-4 h-4" /> Vista previa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="gap-2 cursor-pointer text-amber-700 focus:text-amber-700 focus:bg-amber-50"
                                                        onClick={() => handleConvertToInvoice(d)}
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" /> Convertir a Factura
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}