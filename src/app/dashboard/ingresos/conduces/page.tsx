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
    PlusIcon, MagnifyingGlassIcon, TruckIcon, CheckCircleIcon,
    EllipsisHorizontalIcon, TrashIcon, EyeIcon, ClockIcon, DocumentTextIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LS_KEY = "lollipop_conduces";

type Conduce = {
    id: string; numero: string; fecha: string; cliente: string;
    direccion: string; items: number; estado: "pendiente" | "entregado" | "parcial" | "anulado";
    facturaRef: string; notas: string;
};

const SAMPLE: Conduce[] = [
    { id: "1", numero: "CON-001", fecha: "2025-03-05", cliente: "CLARO", direccion: "Av. John F. Kennedy 27, SDQ", items: 3, estado: "entregado", facturaRef: "E310000000047", notas: "" },
    { id: "2", numero: "CON-002", fecha: "2025-03-06", cliente: "ALTICE", direccion: "Av. 27 de Febrero 450, SDQ", items: 5, estado: "pendiente", facturaRef: "", notas: "Entregar antes de las 2PM" },
];

const EMPTY_FORM = { fecha: new Date().toISOString().split("T")[0], cliente: "", direccion: "", facturaRef: "", notas: "" };

const STATUS_STYLES: Record<string, string> = {
    pendiente: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    entregado: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    parcial: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    anulado: "text-rose-600 bg-rose-500/10 border-rose-500/20",
};

const nextNum = (list: Conduce[]) => `CON-${String(list.length + 1).padStart(3, "0")}`;

export default function ConducesPage() {
    const [list, setList] = useState<Conduce[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saved, setSaved] = useState(false);
    const [filter, setFilter] = useState("todos");

    useEffect(() => {
        try { const raw = companyStorage.get(LS_KEY); setList(raw ? JSON.parse(raw) : SAMPLE); } catch { setList(SAMPLE); }
    }, []);

    const save = (data: Conduce[]) => { setList(data); try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { } };
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.cliente) return;
        const newC: Conduce = { id: Date.now().toString(), numero: nextNum(list), fecha: form.fecha, cliente: form.cliente, direccion: form.direccion, items: 0, estado: "pendiente", facturaRef: form.facturaRef, notas: form.notas };
        save([newC, ...list]);
        setForm(EMPTY_FORM); setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const updateStatus = (id: string, estado: Conduce["estado"]) => save(list.map(c => c.id === id ? { ...c, estado } : c));

    const filtered = list.filter(c =>
        (filter === "todos" || c.estado === filter) &&
        (c.cliente.toLowerCase().includes(search.toLowerCase()) || c.numero.includes(search))
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Conduces de Entrega</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Notas de entrega y remisiones para controlar el despacho de mercancías.</p>
                </div>
                <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" /> Nuevo Conduce
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Total", v: list.length, c: "text-blue-600 bg-blue-500/10", i: DocumentTextIcon },
                    { l: "Pendientes", v: list.filter(c => c.estado === "pendiente").length, c: "text-amber-600 bg-amber-500/10", i: ClockIcon },
                    { l: "Entregados", v: list.filter(c => c.estado === "entregado").length, c: "text-emerald-600 bg-emerald-500/10", i: CheckCircleIcon },
                    { l: "Parciales", v: list.filter(c => c.estado === "parcial").length, c: "text-blue-600 bg-blue-500/10", i: TruckIcon },
                ].map((k, i) => {
                    const Ic = k.i; return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="pendiente">Pendientes</SelectItem>
                                <SelectItem value="entregado">Entregados</SelectItem>
                                <SelectItem value="parcial">Parciales</SelectItem>
                                <SelectItem value="anulado">Anulados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Número</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Dirección</TableHead>
                                    <TableHead>Factura Ref.</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(c => (
                                    <TableRow key={c.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs font-semibold text-primary">{c.numero}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{c.fecha}</TableCell>
                                        <TableCell className="font-semibold">{c.cliente}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">{c.direccion || "ÔÇö"}</TableCell>
                                        <TableCell className="font-mono text-xs text-primary">{c.facturaRef || "ÔÇö"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs capitalize", STATUS_STYLES[c.estado])}>{c.estado}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                                        <EllipsisHorizontalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2" onClick={() => updateStatus(c.id, "entregado")}>
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Marcar Entregado
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => updateStatus(c.id, "parcial")}>
                                                        <TruckIcon className="w-4 h-4" /> Marcar Parcial
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => save(list.filter(x => x.id !== c.id))}>
                                                        <TrashIcon className="w-4 h-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No hay conduces registrados.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader><DialogTitle>Nuevo Conduce de Entrega</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Número</Label><Input value={nextNum(list)} readOnly className="bg-muted font-mono" /></div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => set("fecha")(e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Cliente *</Label><Input placeholder="Nombre del cliente" value={form.cliente} onChange={e => set("cliente")(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Dirección de Entrega</Label><Input placeholder="Av. Ejemplo 123, Ciudad" value={form.direccion} onChange={e => set("direccion")(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Factura Referenciada</Label><Input placeholder="NCF de factura" className="font-mono" value={form.facturaRef} onChange={e => set("facturaRef")(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Instrucciones especiales..." value={form.notas} onChange={e => set("notas")(e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.cliente}>
                            {saved ? <><CheckCircleIcon className="w-4 h-4 mr-2" />Creado!</> : <><PlusIcon className="w-4 h-4 mr-2" />Crear Conduce</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}