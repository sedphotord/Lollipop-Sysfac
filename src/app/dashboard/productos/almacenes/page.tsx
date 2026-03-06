"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MapPinIcon, CircleStackIcon, PlusIcon, BuildingStorefrontIcon,
    MagnifyingGlassIcon, EllipsisHorizontalIcon, PencilSquareIcon,
    TrashIcon, CheckCircleIcon, XCircleIcon, UserIcon, Squares2X2Icon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_almacenes";

type Almacen = {
    id: string;
    nombre: string;
    ubicacion: string;
    responsable: string;
    descripcion: string;
    capacidadMax: number;   // unidades m├íximas
    productos: number;       // productos registrados
    status: "activo" | "inactivo";
    creadoEn: string;
};

const SEED: Almacen[] = [
    { id: "ALM-001", nombre: "Almacén Principal", ubicacion: "Av. 27 de Febrero #251, Santo Domingo", responsable: "Luis Fern├índez", descripcion: "Almacén central de operaciones.", capacidadMax: 1000, productos: 124, status: "activo", creadoEn: "2024-01-10" },
    { id: "ALM-002", nombre: "Sucursal Santiago", ubicacion: "Calle del Sol #80, Santiago", responsable: "Pedro Torres", descripcion: "Bodega de la sucursal norte.", capacidadMax: 500, productos: 68, status: "activo", creadoEn: "2024-03-15" },
    { id: "ALM-003", nombre: "Depósito La Romana", ubicacion: "Parque Industrial, La Romana", responsable: "María Santos", descripcion: "Almacén secundario de la región este.", capacidadMax: 300, productos: 31, status: "inactivo", creadoEn: "2023-11-01" },
];

const EMPTY = { nombre: "", ubicacion: "", responsable: "", descripcion: "", capacidadMax: "" };

function almacenColor(alm: Almacen) {
    const pct = alm.capacidadMax > 0 ? Math.round((alm.productos / alm.capacidadMax) * 100) : 0;
    if (pct >= 85) return "bg-red-500";
    if (pct >= 60) return "bg-amber-500";
    return "bg-emerald-500";
}

function usoPct(alm: Almacen) {
    return alm.capacidadMax > 0 ? Math.min(Math.round((alm.productos / alm.capacidadMax) * 100), 100) : 0;
}

export default function AlmacenesPage() {
    const [list, setList] = useState<Almacen[]>([]);
    const [search, setSearch] = useState("");
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
    const [editTarget, setEditTarget] = useState<Almacen | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setList(raw ? JSON.parse(raw) : SEED);
        } catch {
            setList(SEED);
        }
    }, []);

    const persist = (data: Almacen[]) => {
        setList(data);
        try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { }
    };

    const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    const openCreate = () => {
        setForm(EMPTY);
        setEditTarget(null);
        setDialogMode("create");
    };

    const openEdit = (alm: Almacen) => {
        setForm({ nombre: alm.nombre, ubicacion: alm.ubicacion, responsable: alm.responsable, descripcion: alm.descripcion, capacidadMax: alm.capacidadMax.toString() });
        setEditTarget(alm);
        setDialogMode("edit");
    };

    const handleSave = () => {
        if (!form.nombre.trim()) return;
        const cap = parseInt(form.capacidadMax) || 0;

        if (dialogMode === "create") {
            const next: Almacen = {
                id: `ALM-${String(list.length + 1).padStart(3, "0")}`,
                nombre: form.nombre.trim(),
                ubicacion: form.ubicacion.trim(),
                responsable: form.responsable.trim(),
                descripcion: form.descripcion.trim(),
                capacidadMax: cap,
                productos: 0,
                status: "activo",
                creadoEn: new Date().toISOString().slice(0, 10),
            };
            persist([next, ...list]);
        } else if (dialogMode === "edit" && editTarget) {
            persist(list.map(a => a.id === editTarget.id
                ? { ...a, nombre: form.nombre.trim(), ubicacion: form.ubicacion.trim(), responsable: form.responsable.trim(), descripcion: form.descripcion.trim(), capacidadMax: cap }
                : a
            ));
        }

        setSaved(true);
        setTimeout(() => { setSaved(false); setDialogMode(null); }, 1000);
    };

    const toggleStatus = (id: string) =>
        persist(list.map(a => a.id === id ? { ...a, status: a.status === "activo" ? "inactivo" : "activo" } : a));

    const remove = (id: string) => persist(list.filter(a => a.id !== id));

    const filtered = list.filter(a =>
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.ubicacion.toLowerCase().includes(search.toLowerCase()) ||
        a.responsable.toLowerCase().includes(search.toLowerCase())
    );

    // KPIs
    const activos = list.filter(a => a.status === "activo").length;
    const totalProductos = list.reduce((s, a) => s + a.productos, 0);
    const capacidadTotal = list.reduce((s, a) => s + a.capacidadMax, 0);
    const usoGlobal = capacidadTotal > 0 ? Math.round((totalProductos / capacidadTotal) * 100) : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Almacenes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestiona ubicaciones de inventario y controla el stock por almacén.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20 gap-2" onClick={openCreate}>
                    <PlusIcon className="w-4 h-4" /> Nuevo Almacén
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Total Almacenes", v: list.length, i: BuildingStorefrontIcon, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Activos", v: activos, i: CheckCircleIcon, c: "text-emerald-600 bg-emerald-500/10" },
                    { l: "Total Productos", v: totalProductos.toLocaleString(), i: CircleStackIcon, c: "text-violet-600 bg-violet-500/10" },
                    { l: "Uso Global", v: `${usoGlobal}%`, i: Squares2X2Icon, c: usoGlobal > 80 ? "text-red-600 bg-red-500/10" : "text-amber-600 bg-amber-500/10" },
                ].map((k, i) => {
                    const Ic = k.i;
                    return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">{k.l}</p>
                                    <p className="text-lg font-bold">{k.v}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar almacén, ubicación o responsable..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                    <BuildingStorefrontIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No hay almacenes{search ? " que coincidan" : ""}.</p>
                    {!search && <Button variant="outline" className="mt-4" onClick={openCreate}>Crear primer almacén</Button>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(alm => {
                        const pct = usoPct(alm);
                        return (
                            <Card key={alm.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group", alm.status === "inactivo" && "opacity-60")}>
                                <CardContent className="p-5 space-y-4">
                                    {/* Top row */}
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                                            <BuildingStorefrontIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn("text-xs", alm.status === "activo" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10" : "text-muted-foreground")}>
                                                {alm.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <EllipsisHorizontalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEdit(alm)}>
                                                        <PencilSquareIcon className="w-4 h-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggleStatus(alm.id)}>
                                                        {alm.status === "activo"
                                                            ? <><XCircleIcon className="w-4 h-4" /> Desactivar</>
                                                            : <><CheckCircleIcon className="w-4 h-4" /> Activar</>}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => remove(alm.id)}>
                                                        <TrashIcon className="w-4 h-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <p className="text-[10px] font-mono text-muted-foreground">{alm.id}</p>
                                        <h3 className="font-bold text-base leading-tight">{alm.nombre}</h3>
                                        {alm.descripcion && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alm.descripcion}</p>}
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1.5">
                                            <MapPinIcon className="w-3.5 h-3.5 shrink-0" />{alm.ubicacion || "ÔÇö"}
                                        </p>
                                    </div>

                                    {/* Capacity bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Capacidad usada</span>
                                            <span className="font-semibold">{pct}% <span className="font-normal text-muted-foreground">({alm.productos}/{alm.capacidadMax})</span></span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div className={cn("h-full rounded-full transition-all", almacenColor(alm))} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                                        <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" />{alm.responsable || "Sin responsable"}</span>
                                        <span className="flex items-center gap-1"><CircleStackIcon className="w-3.5 h-3.5" />{alm.productos} productos</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogMode !== null} onOpenChange={o => { if (!o) setDialogMode(null); }}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "create" ? "Nuevo Almacén" : "Editar Almacén"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Nombre del almacén *</Label>
                            <Input placeholder="Almacén Principal" value={form.nombre} onChange={f("nombre")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Descripción</Label>
                            <Input placeholder="Bodega central de operaciones" value={form.descripcion} onChange={f("descripcion")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Ubicación / Dirección</Label>
                            <Input placeholder="Av. 27 de Febrero #251, Santo Domingo" value={form.ubicacion} onChange={f("ubicacion")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Responsable</Label>
                                <Input placeholder="Juan Pérez" value={form.responsable} onChange={f("responsable")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Capacidad m├íxima (unidades)</Label>
                                <Input type="number" min="0" placeholder="500" value={form.capacidadMax} onChange={f("capacidadMax")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setDialogMode(null)}>Cancelar</Button>
                        <Button
                            className="bg-primary gap-2"
                            onClick={handleSave}
                            disabled={!form.nombre.trim()}
                        >
                            {saved
                                ? <><CheckCircleIcon className="w-4 h-4" />Guardado!</>
                                : <><PlusIcon className="w-4 h-4" />{dialogMode === "create" ? "Crear Almacén" : "Guardar Cambios"}</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}