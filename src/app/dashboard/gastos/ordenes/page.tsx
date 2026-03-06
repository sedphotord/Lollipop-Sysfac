"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckSquare, ClipboardList, Edit2, MoreVertical, Package, Plus, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "ordenes_compra";
const STATUS_LABEL: any = { recibida: "Recibida", en_proceso: "En Proceso", pendiente: "Pendiente" };
const STATUS_COLOR: any = {
    recibida: "text-emerald-600 border-emerald-500/30 bg-emerald-500/10",
    en_proceso: "text-blue-600 border-blue-500/30 bg-blue-500/10",
    pendiente: "text-amber-600 border-amber-500/30 bg-amber-500/10"
};

const EMPTY_FORM = {
    id: "", fecha: new Date().toISOString().split("T")[0],
    proveedor: "", items: 1, total: 0, status: "pendiente", notas: ""
};

export default function OrdenesCompraPage() {
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try { setData(JSON.parse(companyStorage.get(LS_KEY) || "[]")); } catch { }
    }, []);

    function save(list: any[]) { setData(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }

    const totalPendiente = data.filter(d => d.status !== "recibida").reduce((a, d) => a + (d.total || 0), 0);
    const filtered = data.filter(d =>
        (d.proveedor || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.id || "").toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() { setFormData({ ...EMPTY_FORM, id: `OC-${String(data.length + 1).padStart(3, "0")}` }); setIsEditing(false); setFormOpen(true); }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function handleSave() {
        const r = { ...formData, items: parseInt(String(formData.items)) || 1, total: parseFloat(String(formData.total)) || 0 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Orden actualizada" : "Orden de compra creada", { description: r.proveedor });
    }

    function handleReceive(id: string) {
        save(data.map(d => d.id === id ? { ...d, status: "recibida" } : d));
        toast.success("Orden marcada como recibida");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Orden eliminada");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h2><p className="text-muted-foreground mt-1 text-sm">Gestiona tus solicitudes de compra a proveedores.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nueva OC</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { l: "Órdenes Pendientes", v: data.filter(d => d.status === "pendiente").length, c: "text-amber-600 bg-amber-500/10" },
                    { l: "En Proceso", v: data.filter(d => d.status === "en_proceso").length, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Total Expuesto", v: `RD$ ${totalPendiente.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, c: "text-rose-600 bg-rose-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Package className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="relative mb-4 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar proveedor o ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead className="text-right">Artículos</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead><TableHead className="w-16"></TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay órdenes de compra aún. Crea la primera." : "Sin resultados."}</TableCell></TableRow>}
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs font-semibold">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                        <TableCell className="text-right"><Badge variant="outline">{d.items}</Badge></TableCell>
                                        <TableCell className="text-right font-bold tabular-nums">RD$ {(d.total || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", STATUS_COLOR[d.status])}>{STATUS_LABEL[d.status]}</Badge></TableCell>
                                        <TableCell className="flex gap-1">
                                            {d.status !== "recibida" && (
                                                <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 text-emerald-600" onClick={() => handleReceive(d.id)}>
                                                    <CheckSquare className="w-3.5 h-3.5 mr-1" />Recibir
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(d)}><Edit2 className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDelete(d)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
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

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar OC" : "Nueva Orden de Compra"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>ID</Label><Input className="font-mono" value={formData.id} onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={formData.fecha} onChange={e => setFormData(p => ({ ...p, fecha: e.target.value }))} /></div>
                        </div>
                        <div className="space-y-2"><Label>Proveedor *</Label><Input placeholder="Nombre del proveedor" value={formData.proveedor} onChange={e => setFormData(p => ({ ...p, proveedor: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label># Artículos</Label><Input type="number" min="1" value={formData.items} onChange={e => setFormData(p => ({ ...p, items: parseInt(e.target.value) || 1 }))} /></div>
                            <div className="space-y-2"><Label>Total (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.total || ""} onChange={e => setFormData(p => ({ ...p, total: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="pendiente">Pendiente</SelectItem><SelectItem value="en_proceso">En Proceso</SelectItem><SelectItem value="recibida">Recibida</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Instrucciones o referencias" value={formData.notas} onChange={e => setFormData(p => ({ ...p, notas: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.proveedor || !formData.total}>{isEditing ? "Guardar cambios" : "Crear OC"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar orden?</AlertDialogTitle><AlertDialogDescription>Se eliminará la OC de <strong>{toDelete?.proveedor}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
