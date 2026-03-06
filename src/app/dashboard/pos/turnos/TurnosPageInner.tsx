"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    ArrowLeft, Download, FileDown, FileSpreadsheet, Printer, Search, X,
    ChevronRight, Clock, ShoppingBag, DollarSign, ExternalLink, User,
    TrendingUp, BarChart3, Receipt, CreditCard, Banknote, CheckSquare
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Sale = { id: string; method: string; time: string; total: number };
type ShiftRecord = {
    id: string;
    openTime: string;
    closeTime: string;
    closeDate: string;
    openingFloat: number;
    totalSales: number;
    cashCountTotal: number;
    salesCount: number;
    sales: Sale[];
    denomCounts: Record<string, string>;
    openVendedor?: string;
    closeVendedor?: string;
};

const fmt = (n: number) => `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

function methodColor(method: string) {
    const m = method.toLowerCase();
    if (m.includes("efectivo") || m.includes("cash")) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
    if (m.includes("tarjeta") || m.includes("card")) return "bg-blue-500/10 text-blue-700 border-blue-500/30";
    if (m.includes("transf")) return "bg-violet-500/10 text-violet-700 border-violet-500/30";
    return "bg-muted text-muted-foreground";
}

function MethodIcon({ method }: { method: string }) {
    const m = method.toLowerCase();
    if (m.includes("efectivo") || m.includes("cash")) return <Banknote className="w-3.5 h-3.5" />;
    if (m.includes("tarjeta") || m.includes("card")) return <CreditCard className="w-3.5 h-3.5" />;
    return <Receipt className="w-3.5 h-3.5" />;
}

export default function TurnosPage() {
    const [history, setHistory] = useState<ShiftRecord[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ShiftRecord | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("pos_shift_history");
        if (raw) { try { setHistory(JSON.parse(raw)); } catch { } }
    }, []);

    const filtered = history.filter(r =>
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.closeDate.includes(search) ||
        (r.openVendedor || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.closeVendedor || "").toLowerCase().includes(search.toLowerCase())
    );

    // ── Computed report metrics ────────────────────────────────────────────────
    const allSales = useMemo(() => history.flatMap(r => r.sales.map(s => ({ ...s, shiftId: r.id, shiftDate: r.closeDate }))), [history]);

    const byMethod = useMemo(() => {
        const map: Record<string, { count: number; total: number }> = {};
        allSales.forEach(s => {
            if (!map[s.method]) map[s.method] = { count: 0, total: 0 };
            map[s.method].count++;
            map[s.method].total += s.total;
        });
        return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
    }, [allSales]);

    const byDate = useMemo(() => {
        const map: Record<string, { count: number; total: number }> = {};
        history.forEach(r => {
            if (!map[r.closeDate]) map[r.closeDate] = { count: 0, total: 0 };
            map[r.closeDate].count += r.salesCount;
            map[r.closeDate].total += r.totalSales;
        });
        return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
    }, [history]);

    const byVendedor = useMemo(() => {
        const map: Record<string, { shifts: number; total: number }> = {};
        history.forEach(r => {
            const v = r.openVendedor || "Sin asignar";
            if (!map[v]) map[v] = { shifts: 0, total: 0 };
            map[v].shifts++;
            map[v].total += r.totalSales;
        });
        return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
    }, [history]);

    const totalAllTime = history.reduce((a, r) => a + r.totalSales, 0);
    const totalShifts = history.length;
    const avgSales = totalShifts ? totalAllTime / totalShifts : 0;
    const totalTransactions = history.reduce((a, r) => a + r.salesCount, 0);

    // ── Exports ───────────────────────────────────────────────────────────────
    const exportCSV = (rec: ShiftRecord) => {
        const rows = [
            ["Cierre de Turno"], ["ID", rec.id], ["Fecha", rec.closeDate],
            ["Apertura", rec.openTime], ["Cierre", rec.closeTime],
            ["Vendedor apertura", rec.openVendedor || "—"], ["Vendedor cierre", rec.closeVendedor || "—"],
            ["Monto apertura", rec.openingFloat], ["Total vendido", rec.totalSales],
            ["Efectivo contado", rec.cashCountTotal], ["Num ventas", rec.salesCount],
            [], ["ID Venta", "Método", "Hora", "Total"],
            ...rec.sales.map(s => [s.id, s.method, s.time, s.total]),
        ];
        const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `cierre-${rec.id}.csv`; a.click();
    };

    const exportExcel = async (rec: ShiftRecord) => {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const summary = [["ID", rec.id], ["Fecha", rec.closeDate], ["Apertura", rec.openTime], ["Cierre", rec.closeTime],
        ["Vendedor apertura", rec.openVendedor || "—"], ["Vendedor cierre", rec.closeVendedor || "—"],
        ["Monto apertura", rec.openingFloat], ["Total vendido", rec.totalSales], ["Efectivo contado", rec.cashCountTotal]];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Resumen");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["ID", "Método", "Hora", "Total"], ...rec.sales.map(s => [s.id, s.method, s.time, s.total])]), "Ventas");
        XLSX.writeFile(wb, `cierre-${rec.id}.xlsx`);
    };

    const exportPDF = (rec: ShiftRecord) => {
        const w = window.open("", "_blank")!;
        w.document.write(`<html><head><title>Cierre ${rec.id}</title>
        <style>body{font-family:Arial,sans-serif;padding:24px;font-size:13px}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:6px 10px}th{background:#f5f5f5}tfoot td{font-weight:bold}</style>
        </head><body>
        <h1>Cierre de Turno — ${rec.id}</h1>
        <p>Fecha: ${rec.closeDate} | Apertura: ${rec.openTime} | Cierre: ${rec.closeTime}</p>
        <p>Vendedor apertura: <b>${rec.openVendedor || "—"}</b> | Cierre: <b>${rec.closeVendedor || "—"}</b></p>
        <table><tr><th>Concepto</th><th>Valor</th></tr>
        <tr><td>Monto apertura</td><td>${fmt(rec.openingFloat)}</td></tr>
        <tr><td>Total vendido</td><td>${fmt(rec.totalSales)}</td></tr>
        <tr><td>Efectivo contado</td><td>${fmt(rec.cashCountTotal)}</td></tr>
        <tr><td>Diferencia</td><td>${fmt(rec.cashCountTotal - rec.openingFloat - rec.totalSales)}</td></tr></table>
        <h3 style="margin-top:20px">Ventas (${rec.salesCount})</h3>
        <table><thead><tr><th>ID</th><th>Método</th><th>Hora</th><th>Total</th></tr></thead>
        <tbody>${rec.sales.map(s => `<tr><td>${s.id}</td><td>${s.method}</td><td>${s.time}</td><td>${fmt(s.total)}</td></tr>`).join("")}</tbody>
        <tfoot><tr><td colspan="3">TOTAL</td><td>${fmt(rec.totalSales)}</td></tr></tfoot></table>
        </body></html>`);
        w.document.close(); w.print();
    };

    const exportAllCSV = () => {
        const rows = [["ID", "Fecha", "Apertura", "Cierre", "V. Apertura", "V. Cierre", "Float", "Vendido", "Contado", "Ventas"],
        ...history.map(r => [r.id, r.closeDate, r.openTime, r.closeTime, r.openVendedor || "—", r.closeVendedor || "—", r.openingFloat, r.totalSales, r.cashCountTotal, r.salesCount])];
        const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "historial-turnos.csv"; a.click();
    };

    const exportAllExcel = async () => {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
            ["ID", "Fecha", "Apertura", "Cierre", "V. Apertura", "V. Cierre", "Float", "Vendido", "Contado", "Ventas"],
            ...history.map(r => [r.id, r.closeDate, r.openTime, r.closeTime, r.openVendedor || "—", r.closeVendedor || "—", r.openingFloat, r.totalSales, r.cashCountTotal, r.salesCount])
        ]), "Turnos");
        const allSalesRows: any[][] = [["Turno", "Fecha", "ID Venta", "Método", "Hora", "Total"]];
        history.forEach(r => r.sales.forEach(s => allSalesRows.push([r.id, r.closeDate, s.id, s.method, s.time, s.total])));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(allSalesRows), "Todas las Ventas");
        XLSX.writeFile(wb, "historial-turnos.xlsx");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/pos"><button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground"><ArrowLeft className="w-5 h-5" /></button></Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Historial de Turnos</h2>
                        <p className="text-sm text-muted-foreground">Histórico permanente de cierres, ventas y reportes del POS</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={exportAllCSV} className="gap-2 text-sm"><Download className="w-4 h-4 text-blue-500" /> CSV</Button>
                    <Button variant="outline" onClick={exportAllExcel} className="gap-2 text-sm"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel</Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Turnos totales", value: totalShifts, icon: Clock, color: "bg-blue-500/10 text-blue-600" },
                    { label: "Total facturado", value: fmt(totalAllTime), icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600" },
                    { label: "Promedio / turno", value: fmt(avgSales), icon: TrendingUp, color: "bg-amber-500/10 text-amber-600" },
                    { label: "Transacciones", value: totalTransactions, icon: CheckSquare, color: "bg-violet-500/10 text-violet-600" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="bg-card/50 border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}><Icon className="w-5 h-5" /></div>
                            <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="text-base font-bold truncate">{value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs: Historial / Ventas / Reportes */}
            <Tabs defaultValue="historial">
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger value="historial">Historial de Turnos</TabsTrigger>
                    <TabsTrigger value="ventas">Ventas por Turno</TabsTrigger>
                    <TabsTrigger value="reportes">Reportes</TabsTrigger>
                </TabsList>

                {/* ── TAB 1: Historial de turnos ─────────────────────────────────── */}
                <TabsContent value="historial" className="space-y-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar por ID, fecha o vendedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                    </div>
                    <Card className="bg-card/50 border-border/60 shadow-sm overflow-hidden">
                        <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>ID Turno</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Apertura</TableHead>
                                        <TableHead>Cierre</TableHead>
                                        <TableHead>Vendedores</TableHead>
                                        <TableHead className="text-right">Ventas</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Contado</TableHead>
                                        <TableHead className="w-36"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                                            {history.length === 0 ? "No hay turnos cerrados aún." : "Sin resultados."}
                                        </TableCell></TableRow>
                                    )}
                                    {filtered.map(rec => (
                                        <TableRow key={rec.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => setSelected(rec)}>
                                            <TableCell><span className="font-mono font-bold text-primary text-xs">{rec.id}</span></TableCell>
                                            <TableCell className="text-sm">{rec.closeDate}</TableCell>
                                            <TableCell className="font-mono text-xs">{rec.openTime}</TableCell>
                                            <TableCell className="font-mono text-xs">{rec.closeTime}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {rec.openVendedor && <div className="flex items-center gap-1"><User className="w-3 h-3 text-emerald-600" />{rec.openVendedor}</div>}
                                                {rec.closeVendedor && rec.closeVendedor !== rec.openVendedor && <div className="flex items-center gap-1 opacity-60"><User className="w-3 h-3 text-red-400" />{rec.closeVendedor}</div>}
                                            </TableCell>
                                            <TableCell className="text-right"><Badge variant="outline">{rec.salesCount}</Badge></TableCell>
                                            <TableCell className="text-right font-semibold tabular-nums text-sm">{fmt(rec.totalSales)}</TableCell>
                                            <TableCell className="text-right font-semibold tabular-nums text-sm text-emerald-600">{fmt(rec.cashCountTotal)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button onClick={e => { e.stopPropagation(); exportPDF(rec); }} title="PDF" className="p-1.5 rounded-lg hover:bg-muted text-red-500"><FileDown className="w-4 h-4" /></button>
                                                    <button onClick={e => { e.stopPropagation(); exportCSV(rec); }} title="CSV" className="p-1.5 rounded-lg hover:bg-muted text-blue-500"><Download className="w-4 h-4" /></button>
                                                    <button onClick={e => { e.stopPropagation(); exportExcel(rec); }} title="Excel" className="p-1.5 rounded-lg hover:bg-muted text-emerald-600"><FileSpreadsheet className="w-4 h-4" /></button>
                                                    <button onClick={e => { e.stopPropagation(); setSelected(rec); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* ── TAB 2: Ventas por turno ────────────────────────────────────── */}
                <TabsContent value="ventas" className="space-y-4 mt-4">
                    {history.length === 0 ? (
                        <Card className="p-12 text-center text-muted-foreground bg-card/50 border-border/60">No hay turnos aún.</Card>
                    ) : history.map(rec => (
                        <Card key={rec.id} className="bg-card/50 border-border/60 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 bg-muted/30 border-b flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-primary text-sm">{rec.id}</span>
                                    <span className="text-xs text-muted-foreground">{rec.closeDate} · {rec.openTime}→{rec.closeTime}</span>
                                    {rec.openVendedor && <Badge variant="outline" className="text-xs gap-1"><User className="w-3 h-3" />{rec.openVendedor}</Badge>}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-muted-foreground">{rec.salesCount} ventas</span>
                                    <span className="font-bold text-primary">{fmt(rec.totalSales)}</span>
                                </div>
                            </div>
                            {rec.sales.length === 0 ? (
                                <div className="px-5 py-8 text-center text-xs text-muted-foreground">Turno sin ventas registradas</div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/20">
                                        <TableRow>
                                            <TableHead>ID Factura</TableHead>
                                            <TableHead>Método de pago</TableHead>
                                            <TableHead>Hora</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rec.sales.map(s => (
                                            <TableRow key={s.id} className="hover:bg-muted/10 transition-colors group">
                                                <TableCell><span className="font-mono font-bold text-xs text-primary">{s.id}</span></TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-[10px] font-bold px-2 border gap-1 flex items-center w-fit", methodColor(s.method))}>
                                                        <MethodIcon method={s.method} />{s.method}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{s.time}</TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">{fmt(s.total)}</TableCell>
                                                <TableCell>
                                                    <Link href={`/dashboard/invoices?search=${s.id}`} title="Ver factura" className="opacity-0 group-hover:opacity-100 transition-opacity block">
                                                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Card>
                    ))}
                </TabsContent>

                {/* ── TAB 3: Reportes ───────────────────────────────────────────── */}
                <TabsContent value="reportes" className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Reporte por método de pago */}
                        <Card className="bg-card/50 border-border/60 shadow-sm">
                            <div className="px-5 py-4 border-b flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-sm">Ventas por Método de Pago</h3>
                            </div>
                            <div className="p-5 space-y-3">
                                {byMethod.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">Sin datos aún.</p>
                                    : byMethod.map(([method, { count, total }]) => {
                                        const pct = totalAllTime ? Math.round((total / totalAllTime) * 100) : 0;
                                        return (
                                            <div key={method}>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn("text-[10px] px-2 border gap-1 flex items-center", methodColor(method))}>
                                                            <MethodIcon method={method} />{method}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">{count} transacciones</span>
                                                    </div>
                                                    <span className="font-bold">{fmt(total)}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </Card>

                        {/* Reporte por vendedor */}
                        <Card className="bg-card/50 border-border/60 shadow-sm">
                            <div className="px-5 py-4 border-b flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-sm">Rendimiento por Vendedor</h3>
                            </div>
                            <div className="p-5 space-y-3">
                                {byVendedor.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">Sin datos aún.</p>
                                    : byVendedor.map(([vendedor, { shifts, total }]) => {
                                        const pct = totalAllTime ? Math.round((total / totalAllTime) * 100) : 0;
                                        return (
                                            <div key={vendedor}>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{vendedor}</span>
                                                        <span className="text-xs text-muted-foreground">{shifts} turno{shifts !== 1 ? "s" : ""}</span>
                                                    </div>
                                                    <span className="font-bold">{fmt(total)}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </Card>

                        {/* Reporte por fecha */}
                        <Card className="bg-card/50 border-border/60 shadow-sm lg:col-span-2">
                            <div className="px-5 py-4 border-b flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <h3 className="font-bold text-sm">Ventas por Día</h3>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={exportAllCSV}>
                                    <Download className="w-3.5 h-3.5" /> Exportar
                                </Button>
                            </div>
                            <div className="p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Fecha</TableHead>
                                            <TableHead className="text-right">Turnos</TableHead>
                                            <TableHead className="text-right">Transacciones</TableHead>
                                            <TableHead className="text-right">Total vendido</TableHead>
                                            <TableHead className="text-right">Promedio por venta</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {byDate.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin datos aún.</TableCell></TableRow>}
                                        {byDate.map(([date, { count, total }]) => {
                                            const turnosOnDay = history.filter(r => r.closeDate === date).length;
                                            return (
                                                <TableRow key={date} className="hover:bg-muted/10">
                                                    <TableCell className="font-semibold">{date}</TableCell>
                                                    <TableCell className="text-right">{turnosOnDay}</TableCell>
                                                    <TableCell className="text-right">{count}</TableCell>
                                                    <TableCell className="text-right font-bold text-primary">{fmt(total)}</TableCell>
                                                    <TableCell className="text-right text-muted-foreground">{fmt(count ? total / count : 0)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* ── Detail slide panel ─────────────────────────────────────────── */}
            {selected && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <div className="bg-background border-l border-border w-full sm:w-[500px] h-full overflow-auto p-6 space-y-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{selected.id}</h3>
                                <p className="text-sm text-muted-foreground">{selected.closeDate} · {selected.openTime} → {selected.closeTime}</p>
                                {(selected.openVendedor || selected.closeVendedor) && (
                                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                        {selected.openVendedor && <span className="flex items-center gap-1"><User className="w-3 h-3 text-emerald-600" /> Abre: <b>{selected.openVendedor}</b></span>}
                                        {selected.closeVendedor && <span className="flex items-center gap-1"><User className="w-3 h-3 text-red-500" /> Cierra: <b>{selected.closeVendedor}</b></span>}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Monto apertura", value: fmt(selected.openingFloat) },
                                { label: "Total vendido", value: fmt(selected.totalSales) },
                                { label: "Efectivo contado", value: fmt(selected.cashCountTotal) },
                                { label: "Diferencia", value: fmt(selected.cashCountTotal - selected.openingFloat - selected.totalSales), hl: true },
                            ].map(({ label, value, hl }) => (
                                <div key={label} className={cn("rounded-xl p-3", hl ? "bg-primary/5 border border-primary/20" : "bg-muted/40")}>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
                                    <p className={cn("font-bold text-sm mt-0.5", hl && "text-primary")}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {selected.sales.length > 0 && (
                            <div>
                                <p className="font-bold text-sm mb-2">Facturas del turno ({selected.salesCount})</p>
                                <div className="divide-y border rounded-xl overflow-hidden">
                                    {selected.sales.map(s => (
                                        <div key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm group">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-xs text-primary">{s.id}</span>
                                                <Badge className={cn("text-[10px] px-2 border gap-1 flex items-center", methodColor(s.method))}>
                                                    <MethodIcon method={s.method} />{s.method}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{s.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{fmt(s.total)}</span>
                                                <Link href={`/dashboard/invoices?search=${s.id}`} title="Ver en facturas" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Exportar este turno</p>
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" className="gap-2 text-xs" onClick={() => exportPDF(selected)}><FileDown className="w-4 h-4 text-red-500" /> PDF</Button>
                                <Button variant="outline" className="gap-2 text-xs" onClick={() => exportCSV(selected)}><Download className="w-4 h-4 text-blue-500" /> CSV</Button>
                                <Button variant="outline" className="gap-2 text-xs" onClick={() => exportExcel(selected)}><FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
