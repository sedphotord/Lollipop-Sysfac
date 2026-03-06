"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeftRight, Calendar, Edit2, FileText, MoreVertical, Package, Plus, Search, Trash2 } from "lucide-react";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "transferencias_inventario";

const ESTADO_MAP: Record<string, { label: string; color: string }> = {
    completado: { label: "Completado", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" },
    en_transito: { label: "En Tránsito", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
    borrador: { label: "Borrador", color: "text-muted-foreground bg-muted border-border" }
};

const EMPTY_FORM = {
    id: "", fecha: new Date().toISOString().split("T")[0],
    origen: "", destino: "", items: 1, estado: "borrador", notas: ""
};

export default function TransferenciasPage() {
    const [data, setData] = useState<any[]>([]);
    const [almacenes, setAlmacenes] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try { setData(JSON.parse(companyStorage.get(LS_KEY) || "[]")); } catch { }
        try {
            const alm: any[] = JSON.parse(companyStorage.get("almacenes") || "[]");
            setAlmacenes(alm.length > 0 ? alm.map((a: any) => a.nombre || a.name || a) : ["Almacén Principal", "Sucursal Santiago", "Depósito La Romana"]);
        } catch { setAlmacenes(["Almacén Principal", "Sucursal Santiago", "Depósito La Romana"]); }
    }, []);

    function save(list: any[]) { setData(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }
    function openCreate() { setFormData({ ...EMPTY_FORM, id: `TRF-${String(data.length + 1).padStart(4, "0")}` }); setIsEditing(false); setFormOpen(true); }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function handleSave() {
        if (!formData.origen || !formData.destino) { toast.error("Selecciona origen y destino"); return; }
        if (formData.origen === formData.destino) { toast.error("El origen y destino no pueden ser iguales"); return; }
        const r = { ...formData, items: parseInt(String(formData.items)) || 1 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Transferencia actualizada" : "Transferencia creada", { description: `${formData.origen} → ${formData.destino}` });
    }

    function handleConfirm(id: string) {
        save(data.map(d => d.id === id ? { ...d, estado: "completado" } : d));
        toast.success("Transferencia completada");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Transferencia eliminada");
    }

    const filtered = data.filter(t =>
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        (t.origen || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.destino || "").toLowerCase().includes(search.toLowerCase())
    );

    const enTransito = data.filter(d => d.estado === "en_transito").length;
    const totalMes = data.filter(d => {
        const now = new Date();
        const d2 = new Date(d.fecha);
        return d2.getMonth() === now.getMonth() && d2.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Transferencias</h2><p className="text-muted-foreground text-sm">Mueve inventario entre tus almacenes y sucursales.</p></div>
                <Button className="bg-gradient-brand text-white border-0 shadow-lg shadow-blue-500/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nueva Transferencia</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><Package className="w-5 h-5" /></div>
                        <div><p className="text-xs font-medium text-muted-foreground">En Tránsito</p><p className="text-lg font-bold">{enTransito}</p></div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                        <div><p className="text-xs font-medium text-muted-foreground">Completadas (Este Mes)</p><p className="text-lg font-bold">{totalMes}</p></div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><ArrowLeftRight className="w-5 h-5" /></div>
                        <div><p className="text-xs font-medium text-muted-foreground">Total Registradas</p><p className="text-lg font-bold">{data.length}</p></div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar guía de traslado..." className="pl-9 bg-muted/50" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Documento</TableHead>
                            <TableHead className="font-bold">Fecha</TableHead>
                            <TableHead className="font-bold">Origen</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="font-bold">Destino</TableHead>
                            <TableHead className="text-center font-bold">Ítems</TableHead>
                            <TableHead className="font-bold">Estado</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay transferencias. Crea la primera." : "Sin resultados."}</TableCell></TableRow>}
                        {filtered.map(tr => {
                            const est = ESTADO_MAP[tr.estado] || ESTADO_MAP.borrador;
                            return (
                                <TableRow key={tr.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell className="font-mono text-sm font-semibold">{tr.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground"><Calendar className="inline w-3.5 h-3.5 mr-1" />{tr.fecha}</TableCell>
                                    <TableCell className="font-medium text-sm">{tr.origen}</TableCell>
                                    <TableCell className="text-center text-muted-foreground"><ArrowLeftRight className="w-3.5 h-3.5 mx-auto" /></TableCell>
                                    <TableCell className="font-medium text-sm">{tr.destino}</TableCell>
                                    <TableCell className="text-center font-mono">{tr.items}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${est.color}`}>{est.label}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {tr.estado !== "completado" && <DropdownMenuItem onClick={() => handleConfirm(tr.id)} className="text-emerald-600 focus:text-emerald-600"><ArrowLeftRight className="w-4 h-4 mr-2" />Completar</DropdownMenuItem>}
                                                <DropdownMenuItem onClick={() => openEdit(tr)}><Edit2 className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => openDelete(tr)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Transferencia" : "Nueva Transferencia"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>ID</Label><Input className="font-mono" value={formData.id} onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={formData.fecha} onChange={e => setFormData(p => ({ ...p, fecha: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                            <div className="space-y-2">
                                <Label>Origen *</Label>
                                <Select value={formData.origen} onValueChange={v => setFormData(p => ({ ...p, origen: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Origen..." /></SelectTrigger>
                                    <SelectContent>{almacenes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <ArrowLeftRight className="w-4 h-4 text-muted-foreground mb-2" />
                            <div className="space-y-2">
                                <Label>Destino *</Label>
                                <Select value={formData.destino} onValueChange={v => setFormData(p => ({ ...p, destino: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Destino..." /></SelectTrigger>
                                    <SelectContent>{almacenes.filter(a => a !== formData.origen).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label># Artículos</Label><Input type="number" min="1" value={formData.items} onChange={e => setFormData(p => ({ ...p, items: parseInt(e.target.value) || 1 }))} /></div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={formData.estado} onValueChange={v => setFormData(p => ({ ...p, estado: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="borrador">Borrador</SelectItem><SelectItem value="en_transito">En Tránsito</SelectItem><SelectItem value="completado">Completado</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Instrucciones o referencias" value={formData.notas} onChange={e => setFormData(p => ({ ...p, notas: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.origen || !formData.destino}>{isEditing ? "Guardar" : "Crear"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar transferencia?</AlertDialogTitle><AlertDialogDescription>Se eliminará la transferencia <strong>{toDelete?.id}</strong> de {toDelete?.origen} a {toDelete?.destino}.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
