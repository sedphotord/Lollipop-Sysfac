"use client";

import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MOCK_INVOICES } from "@/lib/mock-invoices";


const STATUS_MAP: Record<string, { label: string; cls: string; icon: any }> = {
    accepted: { label: "Aceptado", cls: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
    pending: { label: "Pendiente", cls: "text-amber-600 bg-amber-500/10 border-amber-500/30", icon: Clock },
    rejected: { label: "Rechazado", cls: "text-red-500 bg-red-500/10 border-red-500/30", icon: XCircle },
    draft: { label: "Borrador", cls: "text-muted-foreground bg-muted", icon: FileText },
};

function InvoicesPageInner() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams?.get("search") ?? "");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [invoices, setInvoices] = useState<any[]>(MOCK_INVOICES);
    const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);

    useEffect(() => {
        const result: any[] = [];

        // Load emitted invoices from localStorage
        try {
            const emitted = JSON.parse(companyStorage.get('invoice_emitted') || '[]');

            // Allow manual clearing of data persistence in case it was seeded earlier
            if (companyStorage.get('mock_invoices_seeded')) {
                companyStorage.remove('mock_invoices_seeded');
            }

            result.push(...emitted);
        } catch { }

        // Load saved drafts from localStorage
        const draftsRaw = companyStorage.get('invoice_drafts');
        const legacyDraft = companyStorage.get('invoice_draft');
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

        const historyRaw = companyStorage.get('pagos_recibidos');
        let history: any[] = [];
        if (historyRaw) {
            try { history = JSON.parse(historyRaw); } catch { }
        }

        const invoicePayments = history.reduce((acc: any, curr: any) => {
            if (!acc[curr.factura]) acc[curr.factura] = 0;
            acc[curr.factura] += curr.monto;
            return acc;
        }, {});

        // Merge: draftRows + localStorage emitted (result) + MOCK defaults, deduplicated by ID
        // Entries earlier in the array take precedence (real data > mock defaults)
        const seen = new Set<string>();
        const deduplicated = [...draftRows, ...result, ...MOCK_INVOICES].filter(i => {
            if (seen.has(i.id)) return false;
            seen.add(i.id);
            return true;
        });

        const combined = deduplicated.map(i => {
            if (i.status === 'draft') return { ...i, paymentStatus: 'n/a' };
            const paid = invoicePayments[i.id] || 0;
            if (paid >= i.total) return { ...i, paymentStatus: 'pagada' };
            if (paid > 0) return { ...i, paymentStatus: 'parcial' };
            return { ...i, paymentStatus: 'no pagada' };
        });

        setInvoices(combined);
    }, []);

    const handleDeleteInvoice = () => {
        if (!invoiceToDelete) return;

        const isDraft = invoiceToDelete.isDraft;
        const storageKey = isDraft ? 'invoice_drafts' : 'invoice_emitted';

        try {
            const current = JSON.parse(companyStorage.get(storageKey) || '[]');
            const updated = current.filter((i: any) => i.id !== invoiceToDelete.id);
            companyStorage.set(storageKey, JSON.stringify(updated));
        } catch { }

        // Also clean up legacy draft if that was it
        if (isDraft && companyStorage.get('invoice_draft')) {
            try {
                const legacy = JSON.parse(companyStorage.get('invoice_draft') || '{}');
                if (legacy.id === invoiceToDelete.id) {
                    companyStorage.remove('invoice_draft');
                }
            } catch { }
        }

        // Always remove from UI state
        setInvoices(invoices.filter(i => i.id !== invoiceToDelete.id));
        setInvoiceToDelete(null);
    };

    const totalFacturado = invoices.filter(i => i.status !== 'draft').reduce((a, i) => a + i.total, 0);
    const totalAceptadas = invoices.filter(i => i.status === 'accepted').length;
    const totalPendiente = invoices.filter(i => i.status === 'pending').reduce((a, i) => a + i.total, 0);

    const filtered = invoices.filter(inv => {
        const s = search.toLowerCase();
        const matchSearch = !search ||
            (inv.cliente || inv.client || '').toLowerCase().includes(s) ||
            (inv.id || '').toLowerCase().includes(s) ||
            (inv.ecf || inv.ncf || '').toLowerCase().includes(s);
        const matchStatus = statusFilter === "all" || inv.status === statusFilter;
        const matchFrom = !dateFrom || inv.date >= dateFrom;
        const matchTo = !dateTo || inv.date <= dateTo;
        return matchSearch && matchStatus && matchFrom && matchTo;
    });

    const exportCSV = () => {
        const headers = ["ID", "e-CF/NCF", "Tipo", "Cliente", "RNC", "Fecha", "Vencimiento", "Total", "Estado DGII", "Cobro"];
        const rows = filtered.map(inv => [
            inv.id, inv.ecf || "—", inv.tipoName || inv.tipo || "—",
            inv.cliente || "—", inv.rnc || "—",
            inv.date || "—", inv.vencimiento || "—",
            (inv.total || 0).toFixed(2),
            inv.isDraft ? "Borrador" : (inv.status === "accepted" ? "Aceptado" : inv.status === "pending" ? "Pendiente" : "Rechazado"),
            inv.paymentStatus || "—",
        ]);
        const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `facturas_${new Date().toISOString().split("T")[0]}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

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
                            <p className="text-lg font-bold tracking-tight">{totalAceptadas} <span className="text-sm font-normal text-muted-foreground">de {MOCK_INVOICES.length}</span></p>
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
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="w-full sm:w-36 bg-background text-xs"
                            title="Desde"
                        />
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="w-full sm:w-36 bg-background text-xs"
                            title="Hasta"
                        />
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
                        <Button variant="outline" className="shrink-0" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> CSV ({filtered.length})</Button>
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
                                <TableHead>Vendedor</TableHead>
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
                                            {(inv as any).isDraft ? (
                                                <p className="text-[10px] text-muted-foreground">Borrador — clic para continuar</p>
                                            ) : (
                                                <p className="text-[10px] text-muted-foreground">
                                                    {(!String(inv.id).startsWith('INV-') && !String(inv.id).startsWith('POS-') && inv.source !== 'pos') ? inv.id : ''}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-xs font-semibold">{inv.tipoName}</span>
                                                <p className="text-xs text-muted-foreground font-mono">{inv.tipo}</p>
                                                {(inv.source === 'pos' || String(inv.id).startsWith('POS-')) ? (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 mt-1">
                                                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18l-2 13H5L3 6zm6 5a1 1 0 10-2 0v3a1 1 0 102 0v-3zm6 0a1 1 0 10-2 0v3a1 1 0 102 0v-3z" /></svg>
                                                        POS
                                                    </span>
                                                ) : (inv as any).isDraft ? null : (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 mt-1">
                                                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                                                        Normal
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-sm">{inv.cliente}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{inv.rnc}</p>
                                        </TableCell>
                                        <TableCell>
                                            {inv.vendedor ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] font-bold shrink-0">
                                                        {(inv.vendedor as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <span className="text-xs font-medium truncate max-w-[90px]">{inv.vendedor}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/invoices/${inv.id}`} className="cursor-pointer font-medium"><ArrowUpRight className="w-4 h-4 mr-2 text-primary" /> Ver Factura</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/invoices/${inv.id}/edit`} className="cursor-pointer"><FileText className="w-4 h-4 mr-2" /> Editar</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/invoices/preview?id=${inv.id}`} className="cursor-pointer"><Send className="w-4 h-4 mr-2 text-blue-500" /> Enviar por Correo</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setInvoiceToDelete(inv)} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
                                                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                        <AlertDialogTitle>┬┐Eliminar factura?</AlertDialogTitle>
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

export default function InvoicesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando facturas...</div>}>
            <InvoicesPageInner />
        </Suspense>
    );
}