"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArchiveBoxIcon, CurrencyDollarIcon, PlusIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "activos_fijos";

const TIPOS = ["Equipos Cómputo", "Equipos Oficina", "Mobiliario", "Vehículos", "Terrenos", "Edificios", "Maquinaria", "Obras en Proceso", "Otros"];
const DEPRECIACIONES: Record<string, number> = {
    "Equipos Cómputo": 25, "Equipos Oficina": 20, "Mobiliario": 10,
    "Vehículos": 20, "Terrenos": 0, "Edificios": 5, "Maquinaria": 15, "Obras en Proceso": 0, "Otros": 10,
};

const DEFAULT_ACTIVOS: Activo[] = [
    { id: "ACT-001", nombre: "Laptop Dell XPS 15 (Admin)", tipo: "Equipos Cómputo", adquisicion: "2023-01-01", costo: 95000, tasaDepreciacion: 25, valorActual: 47500, status: "activo", notas: "" },
    { id: "ACT-002", nombre: "Servidor NAS Synology", tipo: "Equipos Cómputo", adquisicion: "2022-06-15", costo: 120000, tasaDepreciacion: 25, valorActual: 45000, status: "activo", notas: "" },
    { id: "ACT-003", nombre: "Mueblería Oficina Principal", tipo: "Mobiliario", adquisicion: "2021-03-01", costo: 75000, tasaDepreciacion: 10, valorActual: 52500, status: "activo", notas: "" },
    { id: "ACT-004", nombre: "Impresora Multifuncional", tipo: "Equipos Oficina", adquisicion: "2020-10-01", costo: 25000, tasaDepreciacion: 20, valorActual: 5000, status: "depreciado", notas: "" },
];

type Activo = {
    id: string; nombre: string; tipo: string; adquisicion: string;
    costo: number; tasaDepreciacion: number; valorActual: number;
    status: "activo" | "depreciado" | "baja"; notas: string;
};

type ActivoForm = { id: string; nombre: string; tipo: string; adquisicion: string; costo: string; tasaDepreciacion: number; valorActual: string; status: Activo["status"]; notas: string; };
const EMPTY_FORM: ActivoForm = {
    id: "", nombre: "", tipo: "Equipos Cómputo", adquisicion: new Date().toISOString().split("T")[0],
    costo: "", tasaDepreciacion: 25, valorActual: "", status: "activo", notas: "",
};

function calcDepreciado(costo: number, tasa: number, adquisicion: string): number {
    if (tasa === 0) return costo;
    const years = (Date.now() - new Date(adquisicion).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depr = costo * (tasa / 100) * years;
    return Math.max(0, Math.round(costo - depr));
}

export default function ActivosPage() {
    const [activos, setActivos] = useState<Activo[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Activo | null>(null);
    const [autoCalc, setAutoCalc] = useState(true);

    useEffect(() => {
        try { const raw = companyStorage.get(LS_KEY); setActivos(raw ? JSON.parse(raw) : DEFAULT_ACTIVOS); }
        catch { setActivos(DEFAULT_ACTIVOS); }
    }, []);

    function save(list: Activo[]) { setActivos(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }

    function openCreate() {
        setFormData({ ...EMPTY_FORM, id: `ACT-${String(activos.length + 1).padStart(3, "0")}` });
        setAutoCalc(true); setIsEditing(false); setFormOpen(true);
    }

    function openEdit(a: Activo) {
        setFormData({ ...a, costo: String(a.costo), valorActual: String(a.valorActual), tasaDepreciacion: a.tasaDepreciacion });
        setAutoCalc(false); setIsEditing(true); setFormOpen(true);
    }

    function openDelete(a: Activo) { setToDelete(a); setDeleteOpen(true); }

    function handleSave() {
        if (!formData.nombre || !formData.costo) { toast.error("Nombre y costo son requeridos"); return; }
        const costo = parseFloat(String(formData.costo)) || 0;
        const tasa = formData.tasaDepreciacion || 0;
        const valorActual = autoCalc ? calcDepreciado(costo, tasa, formData.adquisicion) : (parseFloat(String(formData.valorActual)) || costo);
        const activo: Activo = {
            id: formData.id, nombre: formData.nombre, tipo: formData.tipo,
            adquisicion: formData.adquisicion, costo, tasaDepreciacion: tasa,
            valorActual, status: formData.status, notas: formData.notas,
        };
        const list = isEditing ? activos.map(a => a.id === activo.id ? activo : a) : [...activos, activo];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Activo actualizado" : "Activo registrado");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(activos.filter(a => a.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Activo eliminado");
    }

    const totalCosto = activos.reduce((acc, a) => acc + a.costo, 0);
    const totalActual = activos.reduce((acc, a) => acc + a.valorActual, 0);
    const totalDepr = totalCosto - totalActual;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activos Fijos</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Control de activos de la empresa y su depreciación fiscal.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}>
                    <PlusIcon className="w-4 h-4 mr-2" /> Nuevo Activo
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { l: "Costo Histórico", v: `RD$ ${totalCosto.toLocaleString("es-DO")}`, i: ArchiveBoxIcon, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Valor Neto Actual", v: `RD$ ${totalActual.toLocaleString("es-DO")}`, i: CurrencyDollarIcon, c: "text-emerald-600 bg-emerald-500/10" },
                    { l: "Depreciación Acumulada", v: `RD$ ${totalDepr.toLocaleString("es-DO")}`, i: ArrowTrendingDownIcon, c: "text-amber-600 bg-amber-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}>
                                <k.i className="w-5 h-5" />
                            </div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Adquisición</TableHead>
                                    <TableHead className="text-right">Costo Hist.</TableHead>
                                    <TableHead>Depreciación</TableHead>
                                    <TableHead className="text-right">Valor Neto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activos.length === 0 && <TableRow><TableCell colSpan={9} className="py-12 text-center text-muted-foreground">No hay activos registrados. Crea el primero.</TableCell></TableRow>}
                                {activos.map(a => (
                                    <TableRow key={a.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs font-semibold text-primary">{a.id}</TableCell>
                                        <TableCell className="font-semibold">{a.nombre}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{a.tipo}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.adquisicion}</TableCell>
                                        <TableCell className="text-right tabular-nums">RD$ {a.costo.toLocaleString("es-DO")}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.tasaDepreciacion}% anual</TableCell>
                                        <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {a.valorActual.toLocaleString("es-DO")}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs",
                                                a.status === "activo" ? "text-blue-600 border-blue-500/30 bg-blue-500/10" :
                                                    a.status === "depreciado" ? "text-amber-600 border-amber-500/30 bg-amber-500/10" :
                                                        "text-muted-foreground bg-muted"
                                            )}>{a.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(a)} className="gap-2 cursor-pointer">
                                                        <Edit2 className="w-4 h-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDelete(a)} className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Activo Fijo" : "Registrar Nuevo Activo Fijo"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Código</Label><Input className="font-mono" value={formData.id} onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} /></div>
                            <div className="space-y-2">
                                <Label>Tipo de Activo *</Label>
                                <Select value={formData.tipo} onValueChange={v => {
                                    const tasa = DEPRECIACIONES[v] ?? 10;
                                    setFormData(p => ({ ...p, tipo: v, tasaDepreciacion: tasa }));
                                }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Descripción del Activo *</Label><Input placeholder="Ej: Laptop Dell XPS 15 Admin" value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Fecha de Adquisición</Label><Input type="date" value={formData.adquisicion} onChange={e => setFormData(p => ({ ...p, adquisicion: e.target.value }))} /></div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={formData.status} onValueChange={(v: any) => setFormData(p => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="activo">Activo</SelectItem><SelectItem value="depreciado">Depreciado</SelectItem><SelectItem value="baja">Baja</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Costo Histórico (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.costo} onChange={e => setFormData(p => ({ ...p, costo: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Tasa Depreciación (%)</Label><Input type="number" min="0" max="100" value={formData.tasaDepreciacion} onChange={e => setFormData(p => ({ ...p, tasaDepreciacion: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Valor Neto Actual (RD$)</Label>
                                <button className="text-xs text-primary underline" onClick={() => setAutoCalc(p => !p)}>
                                    {autoCalc ? "Ingresar manual" : "Calcular auto"}
                                </button>
                            </div>
                            {autoCalc
                                ? <div className="h-10 flex items-center px-3 bg-muted/40 rounded-md text-sm font-medium">
                                    RD$ {(formData.costo && formData.adquisicion ? calcDepreciado(parseFloat(String(formData.costo)) || 0, formData.tasaDepreciacion, formData.adquisicion) : 0).toLocaleString("es-DO")}
                                    <span className="ml-2 text-xs text-muted-foreground">(calculado automáticamente)</span>
                                </div>
                                : <Input type="number" placeholder="0.00" value={formData.valorActual} onChange={e => setFormData(p => ({ ...p, valorActual: e.target.value }))} />
                            }
                        </div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Notas adicionales..." value={formData.notas} onChange={e => setFormData(p => ({ ...p, notas: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.nombre || !formData.costo}>
                            {isEditing ? "Guardar Cambios" : "Registrar Activo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar activo?</AlertDialogTitle>
                        <AlertDialogDescription>Se eliminará <strong>{toDelete?.nombre}</strong> ({toDelete?.id}) del registro de activos fijos.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
