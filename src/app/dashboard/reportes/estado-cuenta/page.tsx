"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MagnifyingGlassIcon, DocumentTextIcon, ArrowDownTrayIcon,
    ExclamationCircleIcon, CheckCircleIcon, ClockIcon, UserCircleIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type Movimiento = { id: string; fecha: string; tipo: string; referencia: string; descripcion: string; cargo: number; abono: number; saldo: number };
type ClienteEstado = { id: string; nombre: string; rnc: string; email: string; saldo: number; movimientos: Movimiento[] };

const CLIENTES_DATA: ClienteEstado[] = [
    {
        id: "C001", nombre: "CLARO", rnc: "101010101", email: "facturacion@claro.com.do", saldo: 885000,
        movimientos: [
            { id: "M1", fecha: "2025-01-15", tipo: "Factura", referencia: "E310000000041", descripcion: "Servicio de Consultoría IT", cargo: 590000, abono: 0, saldo: 590000 },
            { id: "M2", fecha: "2025-02-01", tipo: "Pago", referencia: "TRF-A91", descripcion: "Transferencia bancaria", cargo: 0, abono: 590000, saldo: 0 },
            { id: "M3", fecha: "2025-02-28", tipo: "Factura", referencia: "E310000000045", descripcion: "Licencia Plataforma - FEB", cargo: 325000, abono: 0, saldo: 325000 },
            { id: "M4", fecha: "2025-03-01", tipo: "Factura", referencia: "E310000000047", descripcion: "Soporte Mensual - MAR", cargo: 885000, abono: 0, saldo: 885000 },
            { id: "M5", fecha: "2025-03-05", tipo: "Nota Crédito", referencia: "NC-001", descripcion: "Descuento negociado cliente frecuente", cargo: 0, abono: 50000, saldo: 835000 },
        ]
    },
    {
        id: "C002", nombre: "ALTICE", rnc: "130819985", email: "cxp@altice.com.do", saldo: 0,
        movimientos: [
            { id: "M6", fecha: "2025-02-15", tipo: "Factura", referencia: "E310000000043", descripcion: "Mantenimiento Servidor", cargo: 448400, abono: 0, saldo: 448400 },
            { id: "M7", fecha: "2025-03-03", tipo: "Pago", referencia: "CHQ-10234", descripcion: "Cheque #10234", cargo: 0, abono: 448400, saldo: 0 },
        ]
    },
    {
        id: "C003", nombre: "GRUPO RAMOS", rnc: "130000999", email: "", saldo: 1620000,
        movimientos: [
            { id: "M8", fecha: "2025-01-10", tipo: "Factura", referencia: "E310000000038", descripcion: "Impl. ERP - Fase 1", cargo: 800000, abono: 0, saldo: 800000 },
            { id: "M9", fecha: "2025-01-10", tipo: "Factura", referencia: "E310000000039", descripcion: "Impl. ERP - Fase 2", cargo: 820000, abono: 0, saldo: 1620000 },
        ]
    },
];

const MOVIMIENTO_TIPO_STYLES: Record<string, string> = {
    Factura: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    Pago: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    "Nota Crédito": "text-violet-600 bg-violet-500/10 border-violet-500/20",
    Ajuste: "text-amber-600 bg-amber-500/10 border-amber-500/20",
};

export default function EstadoCuentaPage() {
    const [clientes] = useState(CLIENTES_DATA);
    const [selected, setSelected] = useState<ClienteEstado | null>(null);
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState("todos");

    const clientesFiltrados = clientes.filter(c =>
        (filtro === "todos" || (filtro === "deudores" && c.saldo > 0) || (filtro === "saldados" && c.saldo === 0)) &&
        (c.nombre.toLowerCase().includes(search.toLowerCase()) || c.rnc.includes(search))
    );

    const totalPendiente = clientes.filter(c => c.saldo > 0).reduce((a, c) => a + c.saldo, 0);
    const totalDeudores = clientes.filter(c => c.saldo > 0).length;

    const exportCSV = (c: ClienteEstado) => {
        const rows = [
            [`Estado de Cuenta — ${c.nombre} (RNC: ${c.rnc})`],
            ["Fecha", "Tipo", "Referencia", "Descripción", "Cargo (RD$)", "Abono (RD$)", "Saldo (RD$)"],
            ...c.movimientos.map(m => [m.fecha, m.tipo, m.referencia, m.descripcion, m.cargo || "", m.abono || "", m.saldo]),
            [], ["Saldo Actual", "", "", "", "", "", c.saldo],
        ];
        const csv = rows.map(r => r.join(",")).join("\n");
        const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = `estado-cuenta-${c.nombre}.csv`; a.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Estado de Cuenta por Cliente</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Historial completo de cargos y abonos por cliente con saldo actual.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { l: "Total por Cobrar", v: `RD$ ${totalPendiente.toLocaleString()}`, c: "text-rose-600 bg-rose-500/10", i: ExclamationCircleIcon },
                    { l: "Clientes con Deuda", v: totalDeudores.toString(), c: "text-amber-600 bg-amber-500/10", i: ClockIcon },
                    { l: "Clientes Saldados", v: clientes.filter(c => c.saldo === 0).length.toString(), c: "text-emerald-600 bg-emerald-500/10", i: CheckCircleIcon },
                ].map((k, i) => {
                    const Ic = k.i; return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-base font-bold">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clientes panel */}
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background text-sm" />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[{ v: "todos", l: "Todos" }, { v: "deudores", l: "Con deuda" }, { v: "saldados", l: "Saldados" }].map(f => (
                                <button key={f.v} onClick={() => setFiltro(f.v)}
                                    className={cn("flex-1 text-xs py-1.5 rounded-lg transition-all font-medium", filtro === f.v ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                                    {f.l}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {clientesFiltrados.map(c => (
                                <button key={c.id} onClick={() => setSelected(c)}
                                    className={cn("w-full text-left rounded-xl p-3 border transition-all", selected?.id === c.id ? "border-primary/40 bg-primary/5" : "border-border/40 hover:bg-muted/30")}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-sm">{c.nombre}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{c.rnc || "—"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("font-black text-sm tabular-nums", c.saldo > 0 ? "text-rose-600" : "text-emerald-600")}>
                                                {c.saldo > 0 ? `RD$ ${c.saldo.toLocaleString()}` : "Saldado"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {clientesFiltrados.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Sin resultados.</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Movimientos panel */}
                <div className="lg:col-span-2">
                    {!selected ? (
                        <Card className="bg-card/50 border-border/60 shadow-sm h-full min-h-[300px] flex items-center justify-center">
                            <CardContent className="text-center py-16">
                                <UserCircleIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-muted-foreground">Selecciona un cliente para ver su estado de cuenta</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold">{selected.nombre}</h3>
                                        <p className="text-xs text-muted-foreground">{selected.rnc} {selected.email && `· ${selected.email}`}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Saldo actual</p>
                                            <p className={cn("font-black text-lg tabular-nums", selected.saldo > 0 ? "text-rose-600" : "text-emerald-600")}>
                                                {selected.saldo > 0 ? `RD$ ${selected.saldo.toLocaleString()}` : "Saldado"}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => exportCSV(selected)} className="gap-2 text-xs">
                                            <ArrowDownTrayIcon className="w-4 h-4" /> Exportar
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Referencia</TableHead>
                                                <TableHead>Descripción</TableHead>
                                                <TableHead className="text-right">Cargo</TableHead>
                                                <TableHead className="text-right">Abono</TableHead>
                                                <TableHead className="text-right">Saldo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selected.movimientos.map(m => (
                                                <TableRow key={m.id} className="hover:bg-muted/20">
                                                    <TableCell className="text-xs text-muted-foreground">{m.fecha}</TableCell>
                                                    <TableCell><Badge variant="outline" className={cn("text-xs", MOVIMIENTO_TIPO_STYLES[m.tipo] || "bg-muted")}>{m.tipo}</Badge></TableCell>
                                                    <TableCell className="font-mono text-xs text-primary">{m.referencia}</TableCell>
                                                    <TableCell className="text-sm max-w-[160px] truncate">{m.descripcion}</TableCell>
                                                    <TableCell className="text-right tabular-nums text-rose-500 font-medium">{m.cargo > 0 ? `RD$ ${m.cargo.toLocaleString()}` : "—"}</TableCell>
                                                    <TableCell className="text-right tabular-nums text-emerald-600 font-medium">{m.abono > 0 ? `RD$ ${m.abono.toLocaleString()}` : "—"}</TableCell>
                                                    <TableCell className="text-right tabular-nums font-bold">{m.saldo > 0 ? `RD$ ${m.saldo.toLocaleString()}` : "—"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex justify-end gap-6 px-2 text-sm">
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Total Cargos</p>
                                        <p className="font-bold text-rose-500 tabular-nums">RD$ {selected.movimientos.reduce((a, m) => a + m.cargo, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Total Abonos</p>
                                        <p className="font-bold text-emerald-600 tabular-nums">RD$ {selected.movimientos.reduce((a, m) => a + m.abono, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-center border-l border-border/40 pl-6">
                                        <p className="text-xs text-muted-foreground">Saldo Final</p>
                                        <p className={cn("font-black text-base tabular-nums", selected.saldo > 0 ? "text-rose-600" : "text-emerald-600")}>
                                            RD$ {selected.saldo.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
