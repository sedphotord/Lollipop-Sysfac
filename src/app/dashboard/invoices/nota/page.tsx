"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight, FileText, Plus, Search, Eye, MoreVertical,
    TrendingDown, TrendingUp, FileSignature, Calendar
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NOTAS = [
    { id: "NC-2024-001", tipo: "B04", label: "Nota de Crédito", facturaRef: "INV-2024-0038", cliente: "María Santos", fecha: "10 Oct 2024", monto: 10325, motivo: "Devolución de mercancía", estado: "Emitida" },
    { id: "NC-2024-002", tipo: "B04", label: "Nota de Crédito", facturaRef: "INV-2024-0025", cliente: "Distribuidora El Monte", fecha: "22 Sep 2024", monto: 4375, motivo: "Descuento no aplicado", estado: "Emitida" },
    { id: "ND-2024-001", tipo: "B03", label: "Nota de Débito", facturaRef: "INV-2024-0019", cliente: "ABC Corporación SRL", fecha: "15 Sep 2024", monto: 8150, motivo: "Gasto adicional no facturado", estado: "Emitida" },
    { id: "NC-2024-003", tipo: "B04", label: "Nota de Crédito", facturaRef: "INV-2024-0012", cliente: "Empresa XYZ", fecha: "02 Sep 2024", monto: 2500, motivo: "Error en precio", estado: "Borrador" },
];

const TIPO_STYLES: Record<string, { color: string; badge: string; icon: React.ElementType }> = {
    "B04": { color: "text-rose-600", badge: "bg-rose-50 text-rose-600 border-rose-200", icon: TrendingDown },
    "B03": { color: "text-amber-600", badge: "bg-amber-50 text-amber-600 border-amber-200", icon: TrendingUp },
};

const ESTADO_STYLES: Record<string, string> = {
    "Emitida": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Borrador": "bg-muted text-muted-foreground border-border",
};

export default function NotaListPage() {
    const [search, setSearch] = useState("");

    const filtered = NOTAS.filter(n =>
        n.id.toLowerCase().includes(search.toLowerCase()) ||
        n.cliente.toLowerCase().includes(search.toLowerCase()) ||
        n.facturaRef.toLowerCase().includes(search.toLowerCase())
    );

    const totalNC = NOTAS.filter(n => n.tipo === "B04").reduce((a, n) => a + n.monto, 0);
    const totalND = NOTAS.filter(n => n.tipo === "B03").reduce((a, n) => a + n.monto, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notas de Crédito y Débito</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Ajustes aplicados a facturas emitidas · e-CF tipo 33 y 34
                    </p>
                </div>
                <Link href="/dashboard/invoices/nota/new">
                    <Button className="gap-2 bg-gradient-brand border-0 text-white shadow-sm">
                        <Plus className="w-4 h-4" /> Nueva Nota
                    </Button>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Notas de Crédito</p>
                    <p className="text-2xl font-black text-rose-500">
                        RD${totalNC.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{NOTAS.filter(n => n.tipo === "B04").length} documentos emitidos</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Notas de Débito</p>
                    <p className="text-2xl font-black text-amber-500">
                        RD${totalND.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{NOTAS.filter(n => n.tipo === "B03").length} documentos emitidos</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Balance Neto</p>
                    <p className={cn("text-2xl font-black", totalNC - totalND >= 0 ? "text-rose-500" : "text-emerald-600")}>
                        RD${Math.abs(totalNC - totalND).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Acreditado vs debitado</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
                {/* toolbar */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
                    <div className="relative w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar nota o factura..." value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-background text-sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">{filtered.length} documentos</p>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border/60 bg-muted/20">
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-primary">N° Nota</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Tipo</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Factura Ref.</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Cliente</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Motivo</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Fecha</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Estado</th>
                            <th className="text-right px-4 py-2.5 font-semibold text-xs text-muted-foreground">Monto</th>
                            <th className="w-16" />
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(n => {
                            const s = TIPO_STYLES[n.tipo];
                            const Icon = s.icon;
                            return (
                                <tr key={n.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group">
                                    <td className="px-4 py-3 font-mono font-semibold text-primary">{n.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Icon className={cn("w-3.5 h-3.5", s.color)} />
                                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", s.badge)}>{n.tipo}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/dashboard/invoices/${n.facturaRef}`} className="text-primary hover:underline font-mono text-xs">{n.facturaRef}</Link>
                                    </td>
                                    <td className="px-4 py-3 text-foreground">{n.cliente}</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px] truncate">{n.motivo}</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {n.fecha}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", ESTADO_STYLES[n.estado])}>{n.estado}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={cn("font-bold tabular-nums", n.tipo === "B04" ? "text-rose-500" : "text-amber-600")}>
                                            RD${n.monto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3">
                                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/dashboard/invoices/nota/new`}>
                                                <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground text-sm">
                                    <div className="flex flex-col items-center gap-3">
                                        <FileSignature className="w-10 h-10 text-muted-foreground/30" />
                                        <p>No hay notas de crédito o débito registradas.</p>
                                        <Link href="/dashboard/invoices/nota/new">
                                            <Button size="sm" className="bg-gradient-brand border-0 text-white gap-2">
                                                <Plus className="w-4 h-4" /> Crear primera nota
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
