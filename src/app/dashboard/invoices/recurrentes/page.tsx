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
import { Switch } from "@/components/ui/switch";
import {
    PlusIcon, ArrowPathIcon, CalendarDaysIcon, CheckCircleIcon,
    TrashIcon, PauseCircleIcon, PlayCircleIcon, DocumentTextIcon, ClockIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_facturas_recurrentes";

type Recurrente = {
    id: string; nombre: string; cliente: string; monto: number;
    frecuencia: "mensual" | "quincenal" | "semanal" | "anual";
    proximaFecha: string; activa: boolean; creadas: number;
};

const SAMPLE: Recurrente[] = [
    { id: "1", nombre: "Servicio Mensual CRM", cliente: "CLARO", monto: 85000, frecuencia: "mensual", proximaFecha: "2025-04-01", activa: true, creadas: 6 },
    { id: "2", nombre: "Soporte IT Altice", cliente: "ALTICE", monto: 45000, frecuencia: "mensual", proximaFecha: "2025-04-05", activa: true, creadas: 3 },
    { id: "3", nombre: "Newsletter Quincenal", cliente: "Grupo Ramos", monto: 12500, frecuencia: "quincenal", proximaFecha: "2025-03-15", activa: false, creadas: 8 },
];

const FRECUENCIAS = ["mensual", "quincenal", "semanal", "anual"];
const EMPTY = { nombre: "", cliente: "", monto: "", frecuencia: "mensual" as const, proximaFecha: "" };

const nextDate = (freq: string): string => {
    const d = new Date();
    if (freq === "mensual") d.setMonth(d.getMonth() + 1);
    else if (freq === "quincenal") d.setDate(d.getDate() + 15);
    else if (freq === "semanal") d.setDate(d.getDate() + 7);
    else if (freq === "anual") d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
};

export default function FacturasRecurrentesPage() {
    const [list, setList] = useState<Recurrente[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try { const r = companyStorage.get(LS_KEY); setList(r ? JSON.parse(r) : SAMPLE); } catch { setList(SAMPLE); }
    }, []);

    const persist = (data: Recurrente[]) => { setList(data); try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { } };
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.nombre || !form.cliente || !form.monto) return;
        const item: Recurrente = {
            id: Date.now().toString(), nombre: form.nombre, cliente: form.cliente,
            monto: parseFloat(form.monto), frecuencia: form.frecuencia,
            proximaFecha: form.proximaFecha || nextDate(form.frecuencia), activa: true, creadas: 0
        };
        persist([item, ...list]);
        setForm(EMPTY); setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const toggle = (id: string) => persist(list.map(r => r.id === id ? { ...r, activa: !r.activa } : r));
    const remove = (id: string) => persist(list.filter(r => r.id !== id));

    const FREQ_COLOR: Record<string, string> = { mensual: "text-blue-600 bg-blue-500/10", quincenal: "text-violet-600 bg-violet-500/10", semanal: "text-emerald-600 bg-emerald-500/10", anual: "text-amber-600 bg-amber-500/10" };

    const totalActivo = list.filter(r => r.activa).reduce((a, r) => a + r.monto, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Facturas Recurrentes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Automatiza facturas que se generan en intervalos regulares.</p>
                </div>
                <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" /> Nueva Recurrente
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { l: "Activas", v: list.filter(r => r.activa).length, c: "text-emerald-600 bg-emerald-500/10", i: PlayCircleIcon },
                    { l: "Pausadas", v: list.filter(r => !r.activa).length, c: "text-amber-600 bg-amber-500/10", i: PauseCircleIcon },
                    { l: "Ingresos Mensuales", v: `RD$ ${totalActivo.toLocaleString()}`, c: "text-blue-600 bg-blue-500/10", i: ArrowPathIcon },
                ].map((k, i) => {
                    const Ic = k.i; return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-base font-bold leading-snug">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-3">
                {list.map(r => (
                    <Card key={r.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-opacity", !r.activa && "opacity-60")}>
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", FREQ_COLOR[r.frecuencia])}>
                                    <ArrowPathIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold">{r.nombre}</p>
                                        <Badge variant="outline" className={cn("text-[10px]", FREQ_COLOR[r.frecuencia])}>{r.frecuencia}</Badge>
                                        {!r.activa && <Badge variant="outline" className="text-[10px] text-muted-foreground">Pausada</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{r.cliente} · {r.creadas} facturas generadas</p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Próxima</p>
                                    <p className="text-xs font-bold tabular-nums mt-0.5 flex items-center gap-1"><CalendarDaysIcon className="w-3 h-3" />{r.proximaFecha}</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Monto</p>
                                    <p className="text-sm font-black text-primary tabular-nums mt-0.5">RD$ {r.monto.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={r.activa} onCheckedChange={() => toggle(r.id)} />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => remove(r.id)}>
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {list.length === 0 && (
                    <Card className="bg-card/50 border-border/60 shadow-sm">
                        <CardContent className="py-12 text-center text-muted-foreground">No hay facturas recurrentes configuradas.</CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader><DialogTitle>Nueva Factura Recurrente</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Nombre / Concepto *</Label><Input placeholder="Servicio mensual de soporte" value={form.nombre} onChange={e => set("nombre")(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Cliente *</Label><Input placeholder="Nombre del cliente" value={form.cliente} onChange={e => set("cliente")(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Monto (RD$) *</Label><Input type="number" placeholder="0.00" value={form.monto} onChange={e => set("monto")(e.target.value)} /></div>
                            <div className="space-y-2">
                                <Label>Frecuencia</Label>
                                <Select value={form.frecuencia} onValueChange={v => { set("frecuencia")(v); set("proximaFecha")(nextDate(v)); }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{FRECUENCIAS.map(f => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Primera factura</Label><Input type="date" value={form.proximaFecha || nextDate(form.frecuencia)} onChange={e => set("proximaFecha")(e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.nombre || !form.cliente || !form.monto}>
                            {saved ? <><CheckCircleIcon className="w-4 h-4 mr-2" />Guardado!</> : <><PlusIcon className="w-4 h-4 mr-2" />Crear</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
