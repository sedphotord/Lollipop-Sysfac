"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    PlusIcon, BanknotesIcon, ReceiptPercentIcon, CheckCircleIcon,
    EllipsisHorizontalIcon, TrashIcon, MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_gastos_menores";

type GastoMenor = {
    id: string; fecha: string; descripcion: string; categoria: string;
    monto: number; pagadoPor: string; reembolsado: boolean;
};

const CATEGORIAS = ["Alimentación", "Transporte", "Papelería", "Limpieza", "Mensajería", "Emergencias", "Telefonía", "Otro"];

const SAMPLE: GastoMenor[] = [
    { id: "1", fecha: "2025-03-05", descripcion: "Almuerzo reunión cliente", categoria: "Alimentación", monto: 2500, pagadoPor: "Juan Pérez", reembolsado: true },
    { id: "2", fecha: "2025-03-06", descripcion: "Taxi aeropuerto", categoria: "Transporte", monto: 1800, pagadoPor: "Ana García", reembolsado: false },
    { id: "3", fecha: "2025-03-07", descripcion: "Papel carta y tóner", categoria: "Papelería", monto: 3200, pagadoPor: "Roberto Méndez", reembolsado: false },
];

const EMPTY = { fecha: new Date().toISOString().split("T")[0], descripcion: "", categoria: "Alimentación", monto: "", pagadoPor: "" };

export default function GastosMenoresPage() {
    const [list, setList] = useState<GastoMenor[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(false);
    const [filterCat, setFilterCat] = useState("todos");

    useEffect(() => {
        try { const r = localStorage.getItem(LS_KEY); setList(r ? JSON.parse(r) : SAMPLE); } catch { setList(SAMPLE); }
    }, []);

    const persist = (data: GastoMenor[]) => { setList(data); try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { } };
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.descripcion || !form.monto) return;
        persist([{ id: Date.now().toString(), fecha: form.fecha, descripcion: form.descripcion, categoria: form.categoria, monto: parseFloat(form.monto), pagadoPor: form.pagadoPor, reembolsado: false }, ...list]);
        setForm(EMPTY); setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const toggleReembolso = (id: string) => persist(list.map(g => g.id === id ? { ...g, reembolsado: !g.reembolsado } : g));
    const remove = (id: string) => persist(list.filter(g => g.id !== id));

    const filtered = list.filter(g =>
        (filterCat === "todos" || g.categoria === filterCat) &&
        (g.descripcion.toLowerCase().includes(search.toLowerCase()) || g.pagadoPor.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPendiente = list.filter(g => !g.reembolsado).reduce((a, g) => a + g.monto, 0);
    const totalMes = list.reduce((a, g) => a + g.monto, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gastos Menores</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Control de caja chica y gastos menores a reembolsar.</p>
                </div>
                <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" /> Registrar Gasto
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { l: "Total del Mes", v: `RD$ ${totalMes.toLocaleString()}`, c: "text-blue-600 bg-blue-500/10", i: BanknotesIcon },
                    { l: "Pendiente Reembolso", v: `RD$ ${totalPendiente.toLocaleString()}`, c: "text-amber-600 bg-amber-500/10", i: ReceiptPercentIcon },
                    { l: "Reembolsados", v: `RD$ ${(totalMes - totalPendiente).toLocaleString()}`, c: "text-emerald-600 bg-emerald-500/10", i: CheckCircleIcon },
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

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[180px]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Select value={filterCat} onValueChange={setFilterCat}>
                            <SelectTrigger className="w-44"><SelectValue placeholder="Categoría" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas las categorías</SelectItem>
                                {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Pagado por</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(g => (
                                    <TableRow key={g.id} className="hover:bg-muted/20 group">
                                        <TableCell className="text-sm text-muted-foreground">{g.fecha}</TableCell>
                                        <TableCell className="font-semibold">{g.descripcion}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{g.categoria}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{g.pagadoPor}</TableCell>
                                        <TableCell className="text-right tabular-nums font-bold text-rose-500">RD$ {g.monto.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs cursor-pointer hover:opacity-80", g.reembolsado ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-amber-600 bg-amber-500/10")} onClick={() => toggleReembolso(g.id)}>
                                                {g.reembolsado ? "Reembolsado" : "Pendiente"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500" onClick={() => remove(g.id)}>
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No hay gastos menores registrados.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader><DialogTitle>Registrar Gasto Menor</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => set("fecha")(e.target.value)} /></div>
                            <div className="space-y-2">
                                <Label>Categoría</Label>
                                <Select value={form.categoria} onValueChange={set("categoria")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Descripción *</Label><Input placeholder="Almuerzo reunión, taxi, etc." value={form.descripcion} onChange={e => set("descripcion")(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Monto (RD$) *</Label><Input type="number" placeholder="0.00" value={form.monto} onChange={e => set("monto")(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Pagado por</Label><Input placeholder="Nombre del empleado" value={form.pagadoPor} onChange={e => set("pagadoPor")(e.target.value)} /></div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.descripcion || !form.monto}>
                            {saved ? <><CheckCircleIcon className="w-4 h-4 mr-2" />Registrado!</> : <><PlusIcon className="w-4 h-4 mr-2" />Registrar</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
