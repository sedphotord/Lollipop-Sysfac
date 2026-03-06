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
    PlusIcon, MagnifyingGlassIcon, UserGroupIcon, BanknotesIcon,
    StarIcon, TrashIcon, EllipsisHorizontalIcon, CheckCircleIcon, PencilSquareIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LS_KEY = "pos_vendedores";

type Vendedor = {
    id: string; nombre: string; codigo?: string;
    email?: string; telefono?: string;
    meta?: number; ventas?: number; totalVentas?: number; totalFacturas?: number;
    activo: boolean; pin?: string;
    creadoEn?: string; auditLog?: any[];
};

const EMPTY = { nombre: "", email: "", telefono: "", meta: "", pin: "" };

export default function VendedoresPOSPage() {
    const [list, setList] = useState<Vendedor[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        try { const r = companyStorage.get(LS_KEY); setList(r ? JSON.parse(r) : []); } catch { setList([]); }
    }, []);

    const persist = (data: Vendedor[]) => { setList(data); try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { } };
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.nombre) return;
        persist([{ id: Date.now().toString(), nombre: form.nombre, email: form.email, telefono: form.telefono, meta: parseFloat(form.meta) || 0, ventas: 0, activo: true, pin: form.pin || "0000" }, ...list]);
        setForm(EMPTY); setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const toggle = (id: string) => persist(list.map(v => v.id === id ? { ...v, activo: !v.activo } : v));
    const remove = (id: string) => persist(list.filter(v => v.id !== id));

    const filtered = list.filter(v => v.nombre.toLowerCase().includes(search.toLowerCase()) || (v.email ?? '').toLowerCase().includes(search.toLowerCase()));

    const totalVentasSum = list.reduce((a, v) => a + (v.totalVentas ?? v.ventas ?? 0), 0);
    const topVendedor = [...list].sort((a, b) => (b.totalVentas ?? b.ventas ?? 0) - (a.totalVentas ?? a.ventas ?? 0))[0];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vendedores POS</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestiona el equipo de ventas, metas y acceso al POS.</p>
                </div>
                <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" /> Nuevo Vendedor
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { l: "Total Vendedores", v: list.length.toString(), c: "text-blue-600 bg-blue-500/10", i: UserGroupIcon },
                    { l: "Ventas del Equipo", v: `RD$ ${totalVentasSum.toLocaleString()}`, c: "text-emerald-600 bg-emerald-500/10", i: BanknotesIcon },
                    { l: "Top Vendedor", v: topVendedor?.nombre?.split(" ")[0] || "—", c: "text-amber-600 bg-amber-500/10", i: StarIcon },
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
                    <div className="relative mb-4">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar vendedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background max-w-sm" />
                    </div>
                    <div className="grid gap-3">
                        {filtered.map(v => {
                            const vVentas = v.totalVentas ?? v.ventas ?? 0;
                            const vMeta = v.meta ?? 0;
                            const pct = vMeta > 0 ? Math.min(Math.round((vVentas / vMeta) * 100), 100) : 0;
                            const overTarget = vVentas >= vMeta;
                            return (
                                <div key={v.id} className={cn("rounded-xl border border-border/60 bg-card p-4 flex items-center gap-4 group transition-opacity", !v.activo && "opacity-60")}>
                                    <Avatar className="w-11 h-11 border-2 border-blue-200/50">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 text-blue-700 font-bold text-sm">
                                            {v.nombre.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm">{v.nombre}</p>
                                            {overTarget && <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                                            <Badge variant="outline" className={cn("text-[10px]", v.activo ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-muted-foreground")}>
                                                {v.activo ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{v.email} {v.pin && `· PIN: ${v.pin}`}</p>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                <span>{pct}% de meta</span>
                                                <span>RD$ {vVentas.toLocaleString()} / {vMeta.toLocaleString()}</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className={cn("h-full rounded-full transition-all", overTarget ? "bg-amber-400" : "bg-blue-500")} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <EllipsisHorizontalIcon className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggle(v.id)}>
                                                {v.activo ? <><PencilSquareIcon className="w-4 h-4" /> Desactivar</> : <><CheckCircleIcon className="w-4 h-4" /> Activar</>}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => remove(v.id)}>
                                                <TrashIcon className="w-4 h-4" /> Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && <div className="py-12 text-center text-muted-foreground text-sm">No hay vendedores registrados.</div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader><DialogTitle>Nuevo Vendedor POS</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Nombre completo *</Label><Input placeholder="Juan Pérez" value={form.nombre} onChange={e => set("nombre")(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="juan@empresa.com" value={form.email} onChange={e => set("email")(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Teléfono</Label><Input placeholder="809-555-0100" value={form.telefono} onChange={e => set("telefono")(e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Meta Mensual (RD$)</Label><Input type="number" placeholder="150000" value={form.meta} onChange={e => set("meta")(e.target.value)} /></div>
                            <div className="space-y-2"><Label>PIN de Acceso POS</Label><Input placeholder="4 dígitos" maxLength={4} value={form.pin} onChange={e => set("pin")(e.target.value)} /></div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.nombre}>
                            {saved ? <><CheckCircleIcon className="w-4 h-4 mr-2" />Guardado!</> : <><PlusIcon className="w-4 h-4 mr-2" />Crear Vendedor</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}