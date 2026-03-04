"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    ArrowLeft, Download, FileDown, FileSpreadsheet, Printer, Search, X, ChevronRight, Clock, ShoppingBag, DollarSign
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ShiftRecord = {
    id: string;
    openTime: string;
    closeTime: string;
    closeDate: string;
    openingFloat: number;
    totalSales: number;
    cashCountTotal: number;
    salesCount: number;
    sales: { id: string; method: string; time: string; total: number }[];
    denomCounts: Record<string, string>;
};

export default function TurnosPage() {
    const [history, setHistory] = useState<ShiftRecord[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<ShiftRecord | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem('pos_shift_history');
        if (raw) {
            try { setHistory(JSON.parse(raw)); } catch { }
        }
    }, []);

    const filtered = history.filter(r =>
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.closeDate.includes(search)
    );

    const totalAllTime = history.reduce((a, r) => a + r.totalSales, 0);
    const totalShifts = history.length;
    const avgSales = totalShifts ? totalAllTime / totalShifts : 0;

    const exportCSV = (rec: ShiftRecord) => {
        const rows = [
            ['Cierre de Turno'],
            ['ID Turno', rec.id],
            ['Fecha', rec.closeDate],
            ['Apertura', rec.openTime],
            ['Cierre', rec.closeTime],
            ['Monto apertura', rec.openingFloat],
            ['Total vendido', rec.totalSales],
            ['Total efectivo contado', rec.cashCountTotal],
            ['Núm. ventas', rec.salesCount],
            [],
            ['ID Venta', 'Método', 'Hora', 'Total'],
            ...rec.sales.map(s => [s.id, s.method, s.time, s.total]),
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `cierre-${rec.id}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const exportExcel = async (rec: ShiftRecord) => {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        const summary = [
            ['Cierre de Turno', rec.id],
            ['Fecha', rec.closeDate],
            ['Apertura', rec.openTime],
            ['Cierre', rec.closeTime],
            ['Monto apertura', rec.openingFloat],
            ['Total vendido', rec.totalSales],
            ['Efectivo contado', rec.cashCountTotal],
            ['Núm. ventas', rec.salesCount],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), 'Resumen');
        const sales = [['ID', 'Método', 'Hora', 'Total'], ...rec.sales.map(s => [s.id, s.method, s.time, s.total])];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sales), 'Ventas');
        XLSX.writeFile(wb, `cierre-${rec.id}.xlsx`);
    };

    const exportPDF = (rec: ShiftRecord) => {
        const w = window.open('', '_blank')!;
        w.document.write(`
            <html><head><title>Cierre ${rec.id}</title>
            <style>body{font-family:Arial,sans-serif;padding:24px;font-size:13px}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f5f5f5}tfoot td{font-weight:bold}</style>
            </head><body>
            <h1>Cierre de Turno — ${rec.id}</h1>
            <p>Fecha: ${rec.closeDate} | Apertura: ${rec.openTime} | Cierre: ${rec.closeTime}</p>
            <table><tr><th>Concepto</th><th>Valor</th></tr>
            <tr><td>Monto apertura</td><td>RD$ ${rec.openingFloat.toFixed(2)}</td></tr>
            <tr><td>Total vendido</td><td>RD$ ${rec.totalSales.toFixed(2)}</td></tr>
            <tr><td>Efectivo contado</td><td>RD$ ${rec.cashCountTotal.toFixed(2)}</td></tr>
            <tr><td>Diferencia</td><td>RD$ ${(rec.cashCountTotal - rec.openingFloat - rec.totalSales).toFixed(2)}</td></tr>
            </table>
            <h3 style="margin-top:20px">Ventas del turno (${rec.salesCount})</h3>
            <table><thead><tr><th>ID</th><th>Método</th><th>Hora</th><th>Total</th></tr></thead>
            <tbody>${rec.sales.map(s => `<tr><td>${s.id}</td><td>${s.method}</td><td>${s.time}</td><td>RD$ ${s.total.toFixed(2)}</td></tr>`).join('')}</tbody>
            <tfoot><tr><td colspan="3">Total</td><td>RD$ ${rec.totalSales.toFixed(2)}</td></tr></tfoot></table>
            </body></html>`);
        w.document.close();
        w.print();
    };

    const clearHistory = () => {
        localStorage.removeItem('pos_shift_history');
        setHistory([]);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/pos">
                        <button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Historial de Turnos</h2>
                        <p className="text-sm text-muted-foreground">Apertura, cierre y cuadre de caja del POS</p>
                    </div>
                </div>
                <Button variant="outline" onClick={clearHistory} className="gap-2 text-destructive border-destructive/40 hover:bg-destructive/5">
                    <X className="w-4 h-4" /> Limpiar historial
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total de turnos', value: totalShifts, icon: Clock, color: 'bg-blue-500/10 text-blue-600' },
                    { label: 'Total facturado', value: `RD$ ${totalAllTime.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600' },
                    { label: 'Promedio por turno', value: `RD$ ${avgSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`, icon: ShoppingBag, color: 'bg-amber-500/10 text-amber-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                                <p className="text-lg font-bold tracking-tight">{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por ID o fecha..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 bg-background"
                />
            </div>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>ID Turno</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Apertura</TableHead>
                                <TableHead>Cierre</TableHead>
                                <TableHead className="text-right">Ventas</TableHead>
                                <TableHead className="text-right">Total vendido</TableHead>
                                <TableHead className="text-right">Efectivo contado</TableHead>
                                <TableHead className="w-32"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                                        {history.length === 0
                                            ? 'No hay turnos cerrados aún. Abre y cierra un turno desde el POS.'
                                            : 'No se encontraron turnos con esa búsqueda.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {filtered.map(rec => (
                                <TableRow key={rec.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => setSelected(rec)}>
                                    <TableCell><span className="font-mono font-bold text-primary text-sm">{rec.id}</span></TableCell>
                                    <TableCell className="text-sm">{rec.closeDate}</TableCell>
                                    <TableCell className="text-sm font-mono">{rec.openTime}</TableCell>
                                    <TableCell className="text-sm font-mono">{rec.closeTime}</TableCell>
                                    <TableCell className="text-right"><Badge variant="outline">{rec.salesCount}</Badge></TableCell>
                                    <TableCell className="text-right font-semibold tabular-nums">RD$ {rec.totalSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-semibold tabular-nums text-emerald-600">RD$ {rec.cashCountTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={e => { e.stopPropagation(); exportPDF(rec); }} title="PDF" className="p-1.5 rounded-lg hover:bg-muted text-red-500 hover:text-red-600"><FileDown className="w-4 h-4" /></button>
                                            <button onClick={e => { e.stopPropagation(); exportCSV(rec); }} title="CSV" className="p-1.5 rounded-lg hover:bg-muted text-blue-500 hover:text-blue-600"><FileDown className="w-4 h-4" /></button>
                                            <button onClick={e => { e.stopPropagation(); exportExcel(rec); }} title="Excel" className="p-1.5 rounded-lg hover:bg-muted text-emerald-600 hover:text-emerald-700"><FileSpreadsheet className="w-4 h-4" /></button>
                                            <button onClick={e => { e.stopPropagation(); setSelected(rec); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Detail panel */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
                    <div className="bg-background border-l border-border w-full sm:w-[480px] h-full overflow-auto p-6 space-y-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{selected.id}</h3>
                                <p className="text-sm text-muted-foreground">{selected.closeDate} · {selected.openTime} → {selected.closeTime}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Summary cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Monto apertura', value: `RD$ ${selected.openingFloat.toFixed(2)}` },
                                { label: 'Total vendido', value: `RD$ ${selected.totalSales.toFixed(2)}` },
                                { label: 'Efectivo contado', value: `RD$ ${selected.cashCountTotal.toFixed(2)}` },
                                { label: 'Diferencia', value: `RD$ ${(selected.cashCountTotal - selected.openingFloat - selected.totalSales).toFixed(2)}`, highlight: true },
                            ].map(({ label, value, highlight }) => (
                                <div key={label} className={cn("rounded-xl p-3", highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/40")}>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
                                    <p className={cn("font-bold text-sm mt-0.5", highlight && "text-primary")}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Sales list */}
                        {selected.sales.length > 0 && (
                            <div>
                                <p className="font-bold text-sm mb-2">Ventas ({selected.salesCount})</p>
                                <div className="divide-y border rounded-xl overflow-hidden">
                                    {selected.sales.map(s => (
                                        <div key={s.id} className="flex items-center justify-between px-4 py-2 text-sm">
                                            <div>
                                                <span className="font-mono font-bold text-xs">{s.id}</span>
                                                <span className="text-muted-foreground ml-2 text-xs">{s.method} · {s.time}</span>
                                            </div>
                                            <span className="font-semibold">RD$ {s.total.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Export buttons */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Exportar</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportPDF(selected)}>
                                    <FileDown className="w-4 h-4 text-red-500" /> PDF
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportCSV(selected)}>
                                    <FileDown className="w-4 h-4 text-blue-500" /> CSV
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportExcel(selected)}>
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => { window.print(); }}>
                                    <Printer className="w-4 h-4" /> Imprimir
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
