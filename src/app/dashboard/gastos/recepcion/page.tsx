"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon,
    ExclamationCircleIcon, EllipsisHorizontalIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_recepcion_606";

const TIPOS_606: Record<string, string> = {
    "01": "Gastos de Personal", "02": "Gastos por Trabajo, Suministros y Servicios",
    "03": "Arrendamientos", "04": "Gastos de Activos Fijos", "05": "Gastos de Representacion",
    "06": "Otras Deducciones Admitidas", "07": "Gastos Financieros", "08": "Extraordinarios",
    "09": "Compras y Gastos que formaran parte del Costo de Venta", "10": "Adquisiciones de Activos",
    "11": "Gastos de Seguro",
};

type Comprobante = {
    id: string; ncf: string; rnc: string; proveedor: string; tipo: string;
    fecha: string; montoSinItbis: number; itbis: number; total: number;
    status: "registrado" | "pendiente" | "anulado";
};

const SAMPLE: Comprobante[] = [
    { id: "1", ncf: "B0100000001", rnc: "101010101", proveedor: "Claro Dominicana", tipo: "02", fecha: "2025-03-01", montoSinItbis: 12500, itbis: 2250, total: 14750, status: "registrado" },
    { id: "2", ncf: "B0100004512", rnc: "130819985", proveedor: "Altice Dominicana", tipo: "02", fecha: "2025-03-05", montoSinItbis: 3800, itbis: 684, total: 4484, status: "registrado" },
    { id: "3", ncf: "B0100000890", rnc: "130000111", proveedor: "Propietario Plaza", tipo: "03", fecha: "2025-03-01", montoSinItbis: 45000, itbis: 0, total: 45000, status: "pendiente" },
];

const EMPTY_FORM = { ncf: "", rnc: "", proveedor: "", tipo: "02", fecha: new Date().toISOString().split("T")[0], montoSinItbis: "", itbis: "", };

export default function RecepcionComprobantesPage() {
    const [list, setList] = useState<Comprobante[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try { const raw = companyStorage.get(LS_KEY); setList(raw ? JSON.parse(raw) : SAMPLE); } catch { setList(SAMPLE); }
    }, []);

    const save = (data: Comprobante[]) => { setList(data); try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { } };

    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.ncf || !form.proveedor) return;
        const monto = parseFloat(form.montoSinItbis) || 0;
        const itbis = parseFloat(form.itbis) || 0;
        const newItem: Comprobante = {
            id: Date.now().toString(), ncf: form.ncf, rnc: form.rnc, proveedor: form.proveedor,
            tipo: form.tipo, fecha: form.fecha, montoSinItbis: monto, itbis, total: monto + itbis,
            status: "registrado"
        };
        save([newItem, ...list]);
        setForm(EMPTY_FORM);
        setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const handleDelete = (id: string) => save(list.filter(c => c.id !== id));

    const filtered = list.filter(c =>
        c.proveedor.toLowerCase().includes(search.toLowerCase()) ||
        c.ncf.toLowerCase().includes(search.toLowerCase()) ||
        c.rnc.includes(search)
    );

    const totalMes = list.filter(c => c.status !== "anulado").reduce((a, c) => a + c.total, 0);
    const totalItbis = list.filter(c => c.status !== "anulado").reduce((a, c) => a + c.itbis, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Recepción de Comprobantes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Registro de facturas de proveedores para el Formato 606 DGII.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => {
                        const csv = ["NCF,RNC,Proveedor,Tipo,Fecha,Monto,ITBIS,Total",
                            ...list.map(c => `${c.ncf},${c.rnc},${c.proveedor},${c.tipo},${c.fecha},${c.montoSinItbis},${c.itbis},${c.total}`)
                        ].join("\n");
                        const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = "606.csv"; a.click();
                    }}>
                        <ArrowDownTrayIcon className="w-4 h-4" /> Exportar 606
                    </Button>
                    <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                        <PlusIcon className="w-4 h-4" /> Registrar Comprobante
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Total Registrados", v: list.length, c: "text-blue-600 bg-blue-500/10", i: DocumentTextIcon },
                    { l: "Registrados", v: list.filter(c => c.status === "registrado").length, c: "text-emerald-600 bg-emerald-500/10", i: CheckCircleIcon },
                    { l: "Pendientes", v: list.filter(c => c.status === "pendiente").length, c: "text-amber-600 bg-amber-500/10", i: ClockIcon },
                    { l: "Anulados", v: list.filter(c => c.status === "anulado").length, c: "text-rose-600 bg-rose-500/10", i: ExclamationCircleIcon },
                ].map((k, i) => {
                    const Ic = k.i;
                    return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Gastos (sin ITBIS)</span>
                        <span className="font-black text-lg">RD$ {(totalMes - totalItbis).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">ITBIS Acreditado</span>
                        <span className="font-black text-lg text-emerald-600">RD$ {totalItbis.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar por NCF, RNC o proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>NCF</TableHead>
                                    <TableHead>Proveedor</TableHead>
                                    <TableHead>RNC</TableHead>
                                    <TableHead>Tipo 606</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">ITBIS</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(c => (
                                    <TableRow key={c.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs font-semibold text-primary">{c.ncf}</TableCell>
                                        <TableCell className="font-semibold">{c.proveedor}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{c.rnc || "—"}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{c.tipo} - {TIPOS_606[c.tipo]?.substring(0, 18)}...</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{c.fecha}</TableCell>
                                        <TableCell className="text-right tabular-nums font-medium">RD$ {c.montoSinItbis.toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums text-emerald-600 font-medium">RD$ {c.itbis.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs", c.status === "registrado" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : c.status === "pendiente" ? "text-amber-600 bg-amber-500/10 border-amber-500/20" : "text-rose-600 bg-rose-500/10 border-rose-500/20")}>
                                                {c.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <EllipsisHorizontalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                                        <EyeIcon className="w-4 h-4" /> Ver detalle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => handleDelete(c.id)}>
                                                        <TrashIcon className="w-4 h-4" /> Anular
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={9} className="py-12 text-center text-muted-foreground">No hay comprobantes registrados.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader><DialogTitle>Registrar Comprobante Fiscal (606)</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>NCF del Comprobante *</Label><Input placeholder="B0100000001" className="font-mono" value={form.ncf} onChange={e => set("ncf")(e.target.value)} /></div>
                            <div className="space-y-2"><Label>RNC del Proveedor</Label><Input placeholder="101010101" className="font-mono" value={form.rnc} onChange={e => set("rnc")(e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Nombre del Proveedor *</Label><Input placeholder="Nombre del proveedor" value={form.proveedor} onChange={e => set("proveedor")(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Gasto (606)</Label>
                                <Select value={form.tipo} onValueChange={set("tipo")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{Object.entries(TIPOS_606).map(([k, v]) => <SelectItem key={k} value={k}>{k} — {v.substring(0, 28)}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => set("fecha")(e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Monto sin ITBIS (RD$)</Label><Input type="number" placeholder="0.00" value={form.montoSinItbis} onChange={e => set("montoSinItbis")(e.target.value)} /></div>
                            <div className="space-y-2"><Label>ITBIS (RD$)</Label><Input type="number" placeholder="0.00" value={form.itbis} onChange={e => set("itbis")(e.target.value)} /></div>
                        </div>
                        {form.montoSinItbis && (
                            <div className="bg-muted/40 rounded-lg px-4 py-2.5 flex justify-between">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="font-black">RD$ {((parseFloat(form.montoSinItbis) || 0) + (parseFloat(form.itbis) || 0)).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.ncf || !form.proveedor}>
                            {saved ? <CheckCircleIcon className="w-4 h-4 mr-2" /> : <PlusIcon className="w-4 h-4 mr-2" />}
                            {saved ? "Registrado!" : "Registrar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}