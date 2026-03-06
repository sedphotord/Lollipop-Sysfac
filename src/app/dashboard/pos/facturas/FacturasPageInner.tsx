"use client";

import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Search, Filter, ShoppingCart, Receipt, ArrowLeft, MoreVertical,
    Download, Eye, CheckCircle2, Clock, XCircle, FileText, TrendingUp, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; cls: string; icon: any }> = {
    accepted: { label: "Aceptado", cls: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
    pending: { label: "Pendiente", cls: "text-amber-600 bg-amber-500/10 border-amber-500/30", icon: Clock },
    rejected: { label: "Rechazado", cls: "text-red-500 bg-red-500/10 border-red-500/30", icon: XCircle },
    draft: { label: "Borrador", cls: "text-muted-foreground bg-muted", icon: FileText },
};

export default function POSFacturasPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [vendedorFilter, setVendedorFilter] = useState("all");

    useEffect(() => {
        const load = () => {
            try {
                const allInvoices: any[] = JSON.parse(companyStorage.get("invoice_emitted") || "[]");
                // Only POS invoices — those with source:'pos' OR id starting with 'POS-'
                const posOnly = allInvoices.filter((inv: any) =>
                    inv.source === "pos" || String(inv.id).startsWith("POS-")
                );
                setInvoices(posOnly);
            } catch { }
        };
        load();
        window.addEventListener("company-changed", load);
        return () => window.removeEventListener("company-changed", load);
    }, []);

    const vendedores = [...new Set(invoices.map(i => i.vendedor).filter(Boolean))];

    const filtered = invoices.filter(inv => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (inv.id ?? "").toLowerCase().includes(q) ||
            (inv.cliente ?? "").toLowerCase().includes(q) ||
            (inv.vendedor ?? "").toLowerCase().includes(q) ||
            (inv.ecf ?? "").toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || inv.status === statusFilter;
        const matchVendedor = vendedorFilter === "all" || inv.vendedor === vendedorFilter;
        return matchSearch && matchStatus && matchVendedor;
    });

    const totalVentas = filtered.reduce((a, i) => a + (i.total ?? 0), 0);
    const pagadas = filtered.filter(i => i.paymentStatus === "pagada").length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 flex-wrap justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/pos">
                        <button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <ShoppingCart className="w-7 h-7 text-primary" />
                            Facturas del POS
                        </h2>
                        <p className="text-sm text-muted-foreground">Solo facturas emitidas desde el Terminal POS</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Exportar
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total facturas POS</p>
                            <p className="text-2xl font-bold">{filtered.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total vendido</p>
                            <p className="text-2xl font-bold tabular-nums">RD$ {totalVentas.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Pagadas</p>
                            <p className="text-2xl font-bold">{pagadas} <span className="text-sm font-normal text-muted-foreground">/ {filtered.length}</span></p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por ID, cliente o vendedor..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] bg-background">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="accepted">Aceptado</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="rejected">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                        {vendedores.length > 0 && (
                            <Select value={vendedorFilter} onValueChange={setVendedorFilter}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Vendedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los vendedores</SelectItem>
                                    {vendedores.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 border-border/60 shadow-sm overflow-hidden">
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
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(inv => {
                                const st = STATUS_MAP[inv.status] ?? STATUS_MAP.draft;
                                const StIcon = st.icon;
                                return (
                                    <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors group">
                                        <TableCell>
                                            <Link href={`/dashboard/invoices/${inv.id}`} className="font-mono font-bold text-primary hover:underline text-sm">
                                                {inv.ecf ?? inv.id}
                                            </Link>
                                            <p className="text-[10px] text-muted-foreground font-mono">{inv.ecf ? inv.id : ''}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-xs font-semibold">{inv.tipoName ?? inv.tipo ?? 'Consumidor'}</span>
                                                <p className="text-xs text-muted-foreground font-mono">{inv.tipo ?? ''}</p>
                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 mt-1">
                                                    <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18l-2 13H5L3 6zm6 5a1 1 0 10-2 0v3a1 1 0 102 0v-3zm6 0a1 1 0 10-2 0v3a1 1 0 102 0v-3z" /></svg>
                                                    POS
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-sm">{inv.cliente ?? 'Consumidor Final'}</p>
                                            {inv.rnc && <p className="text-xs text-muted-foreground font-mono">{inv.rnc}</p>}
                                        </TableCell>
                                        <TableCell>
                                            {inv.vendedor ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] font-bold shrink-0">
                                                        {(inv.vendedor as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <span className="text-xs font-medium truncate max-w-[90px]">{inv.vendedor}</span>
                                                </div>
                                            ) : <span className="text-xs text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{inv.date}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold tabular-nums">
                                            RD$ {(inv.total ?? 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            {inv.paymentStatus === "pagada"
                                                ? <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">Pagada</Badge>
                                                : <Badge variant="outline" className="bg-stone-100 text-stone-600 border-stone-200 text-xs">No pagada</Badge>
                                            }
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
                                                            <Link href={`/dashboard/invoices/${inv.id}`} className="flex items-center gap-2">
                                                                <Eye className="w-4 h-4" /> Ver detalle
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/invoices/${inv.id}/edit`} className="flex items-center gap-2">
                                                                <FileText className="w-4 h-4" /> Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download className="w-4 h-4 mr-2" /> Descargar PDF
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
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p>No hay facturas del POS aún.</p>
                                        <p className="text-xs mt-1">Las ventas del terminal aparecerán aquí automáticamente.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}