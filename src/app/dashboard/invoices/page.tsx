"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowUpRight, CheckCircle2, Clock, Download, ExternalLink, FileText,
    Filter, MoreVertical, Plus, Search, Send, TrendingUp, XCircle, Trash2
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

const INVOICES = [
    { id: "0042", ecf: "E3100000006", tipo: "B01", tipoName: "Crédito Fiscal", cliente: "CLARO (CODETEL)", rnc: "101010101", date: "20 Oct 2024", vencimiento: "19 Nov 2024", total: 605800, status: "accepted" },
    { id: "0041", ecf: "E3200000010", tipo: "B02", tipoName: "Consumo", cliente: "Juan Pérez", rnc: "00114356789", date: "18 Oct 2024", vencimiento: "18 Oct 2024", total: 3500, status: "accepted" },
    { id: "0040", ecf: "E3100000005", tipo: "B01", tipoName: "Crédito Fiscal", cliente: "ALTICE DOMINICANA", rnc: "130819985", date: "15 Oct 2024", vencimiento: "14 Nov 2024", total: 125000, status: "pending" },
    { id: "0039", ecf: "E3100000004", tipo: "B01", tipoName: "Crédito Fiscal", cliente: "GRUPO RAMOS", rnc: "101001010", date: "10 Oct 2024", vencimiento: "09 Nov 2024", total: 95000, status: "accepted" },
    { id: "0038", ecf: "E3200000009", tipo: "B02", tipoName: "Consumo", cliente: "María Santos", rnc: "40212345678", date: "08 Oct 2024", vencimiento: "08 Oct 2024", total: 8750, status: "rejected" },
    { id: "0037", ecf: "E3100000003", tipo: "B01", tipoName: "Crédito Fiscal", cliente: "BANRESERVAS", rnc: "101288345", date: "01 Oct 2024", vencimiento: "31 Oct 2024", total: 250000, status: "accepted" },
    { id: "0036", ecf: "E3200000008", tipo: "B02", tipoName: "Consumo", cliente: "Pedro Almonte", rnc: "001555999", date: "28 Sep 2024", vencimiento: "28 Sep 2024", total: 12300, status: "accepted" },
];

const STATUS_MAP: Record<string, { label: string; cls: string; icon: any }> = {
    accepted: { label: "Aceptado", cls: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
    pending: { label: "Pendiente", cls: "text-amber-600 bg-amber-500/10 border-amber-500/30", icon: Clock },
    rejected: { label: "Rechazado", cls: "text-red-500 bg-red-500/10 border-red-500/30", icon: XCircle },
    draft: { label: "Borrador", cls: "text-muted-foreground bg-muted", icon: FileText },
};

export default function InvoicesPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [invoices, setInvoices] = useState<any[]>(INVOICES);
    const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);

    useEffect(() => {
        const result: any[] = [];

        // Load emitted invoices from localStorage
        try {
            const emitted = JSON.parse(localStorage.getItem('invoice_emitted') || '[]');
            result.push(...emitted);
        } catch { }

        // Load saved drafts from localStorage
        const draftsRaw = localStorage.getItem('invoice_drafts');
        const legacyDraft = localStorage.getItem('invoice_draft');
        const draftsList: any[] = [];

        if (draftsRaw) {
            try { JSON.parse(draftsRaw).forEach((d: any) => draftsList.push(d)); } catch { }
        } else if (legacyDraft) {
            try { draftsList.push(JSON.parse(legacyDraft)); } catch { }
        }

        const draftRows = draftsList.map((d: any, i: number) => ({
            id: d.id || `DRAFT-${i + 1}`,
            ecf: d.ecf || d.ncf || '—',
            tipo: d.tipo || '—',
            tipoName: d.tipo === 'B01' ? 'Crédito Fiscal' : d.tipo === 'B02' ? 'Consumo' : d.tipo || '—',
            cliente: d.cliente || d.client?.name || 'Sin cliente',
            rnc: d.rnc || d.client?.rnc || '',
            date: d.date || new Date().toLocaleDateString('es-DO'),
            vencimiento: d.vencimiento || '—',
            total: d.total || d.items?.reduce((a: number, it: any) => a + (it.price * it.qty || 0), 0) || 0,
            status: 'draft',
            isDraft: true,
        }));

        const historyRaw = localStorage.getItem('pagos_recibidos');
        let history: any[] = [];
        if (historyRaw) {
            try { history = JSON.parse(historyRaw); } catch { }
        }

        const invoicePayments = history.reduce((acc: any, curr: any) => {
            if (!acc[curr.factura]) acc[curr.factura] = 0;
            acc[curr.factura] += curr.monto;
            return acc;
        }, {});

        const combined = [...draftRows, ...result, ...INVOICES].map(i => {
            if (i.status === 'draft') return { ...i, paymentStatus: 'n/a' };
            const paid = invoicePayments[i.id] || 0;
            if (paid >= i.total) return { ...i, paymentStatus: 'pagada' };
            if (paid > 0) return { ...i, paymentStatus: 'parcial' };
            return { ...i, paymentStatus: 'no pagada' };
        });

        if (combined.length > 0) {
            setInvoices(combined);
        }
    }, []);

    const handleDeleteInvoice = () => {
        if (!invoiceToDelete) return;

        const isDraft = invoiceToDelete.isDraft;
        const storageKey = isDraft ? 'invoice_drafts' : 'invoice_emitted';

        try {
            const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const updated = current.filter((i: any) => i.id !== invoiceToDelete.id);
            localStorage.setItem(storageKey, JSON.stringify(updated));
            setInvoices(invoices.filter(i => i.id !== invoiceToDelete.id));
        } catch { }

        // Also clean up legacy draft if that was it
        if (isDraft && localStorage.getItem('invoice_draft')) {
            try {
                const legacy = JSON.parse(localStorage.getItem('invoice_draft') || '{}');
                if (legacy.id === invoiceToDelete.id) {
                    localStorage.removeItem('invoice_draft');
                }
            } catch { }
        }

        setInvoiceToDelete(null);
    };

    const totalFacturado = invoices.filter(i => i.status !== 'draft').reduce((a, i) => a + i.total, 0);
    const totalAceptadas = invoices.filter(i => i.status === 'accepted').length;
    const totalPendiente = invoices.filter(i => i.status === 'pending').reduce((a, i) => a + i.total, 0);

    const filtered = invoices.filter(inv => {
        const matchSearch = inv.cliente.toLowerCase().includes(search.toLowerCase()) ||
            inv.id.toLowerCase().includes(search.toLowerCase()) ||
            inv.ecf.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || inv.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Facturación</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestión de comprobantes fiscales electrónicos (e-CF).</p>
                </div>
                <Link href="/dashboard/invoices/new">
                    <Button className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" /> Nueva Factura
                    </Button>
                </Link>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Facturado (Oct)</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalFacturado.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Aceptadas DGII</p>
                            <p className="text-lg font-bold tracking-tight">{totalAceptadas} <span className="text-sm font-normal text-muted-foreground">de {INVOICES.length}</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Pendiente Cobro</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalPendiente.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por cliente, # factura, e-CF..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="accepted">Aceptado DGII</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="rejected">Rechazado</SelectItem>
                                <SelectItem value="draft">Borrador</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="shrink-0"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>NCF</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Cobro</TableHead>
                                <TableHead>Estado DGII</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((inv) => {
                                const st = STATUS_MAP[inv.status];
                                const StIcon = st.icon;
                                return (
                                    <TableRow key={inv.id} className={cn("hover:bg-muted/20 transition-colors group", (inv as any).isDraft && "bg-amber-50/30 dark:bg-amber-900/5")}>
                                        <TableCell>
                                            {(inv as any).isDraft ? (
                                                <Link href={`/dashboard/invoices/${inv.id}/edit`} className="font-mono font-bold text-amber-600 hover:underline text-sm">
                                                    {inv.ecf !== '—' ? inv.ecf : 'Sin NCF'}
                                                </Link>
                                            ) : (
                                                <Link href={`/dashboard/invoices/${inv.id}`} className="font-mono font-bold text-primary hover:underline text-sm">
                                                    {inv.ecf}
                                                </Link>
                                            )}
                                            <p className="text-[10px] text-muted-foreground">{(inv as any).isDraft ? 'Borrador — clic para continuar' : inv.id}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-xs font-semibold">{inv.tipoName}</span>
                                                <p className="text-xs text-muted-foreground font-mono">{inv.tipo}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-sm">{inv.cliente}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{inv.rnc}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{inv.date}</p>
                                            <p className="text-xs text-muted-foreground">Vence: {inv.vencimiento}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold tabular-nums">
                                            RD$ {inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            {(inv as any).isDraft ? (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            ) : (inv as any).paymentStatus === 'pagada' ? (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Pagada</Badge>
                                            ) : (inv as any).paymentStatus === 'parcial' ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Parcial</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-stone-100 text-stone-600 border-stone-200">No pagada</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs gap-1", st.cls)}>
                                                <StIcon className="w-3 h-3" /> {st.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/dashboard/invoices/${inv.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => setInvoiceToDelete(inv)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                        No se encontraron facturas con los filtros actuales.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la factura <strong>{invoiceToDelete?.ecf !== '—' ? invoiceToDelete?.ecf : invoiceToDelete?.id}</strong> de <strong>{invoiceToDelete?.cliente}</strong> de forma permanente del sistema local.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Mantener</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
