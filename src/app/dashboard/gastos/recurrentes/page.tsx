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
import { Edit2, MoreVertical, Pause, Play, Plus, Repeat, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "gastos_recurrentes";

const EMPTY_FORM = {
    id: "", proveedor: "", monto: 0,
    frecuencia: "Mensual", proximo: new Date().toISOString().split("T")[0],
    status: "activo", concepto: ""
};

const STATUS_CLASSES: any = {
    activo: "text-emerald-600 border-emerald-500/30 bg-emerald-500/10",
    pausado: "text-amber-600 border-amber-500/30 bg-amber-500/10"
};

export default function GastosRecurrentesPage() {
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

    const totalActivos = data.filter(d => d.status === "activo").reduce((a, d) => a + (d.monto || 0), 0);
    const filtered = data.filter(d =>
        (d.proveedor || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.concepto || "").toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() {
        setFormData({ ...EMPTY_FORM, id: `GR-${String(data.length + 1).padStart(3, "0")}` });
        setIsEditing(false); setFormOpen(true);
    }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function handleSave() {
        const r = { ...formData, monto: parseFloat(String(formData.monto)) || 0 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Recurrencia actualizada" : "Recurrencia creada", { description: r.proveedor });
    }

    function toggleStatus(id: string) {
        const updated = data.map(d => d.id === id ? { ...d, status: d.status === "activo" ? "pausado" : "activo" } : d);
        save(updated);
        const item = updated.find(d => d.id === id);
        toast.success(item?.status === "activo" ? "Recurrencia activada" : "Recurrencia pausada");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Recurrencia eliminada");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Pagos Recurrentes</h2><p className="text-muted-foreground mt-1 text-sm">Gastos periódicos automatizados a proveedores.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /><Repeat className="w-3.5 h-3.5 mr-1" /> Nueva Recurrencia</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { l: "Activos", v: data.filter(d => d.status === "activo").length, c: "text-emerald-600 bg-emerald-500/10" },
                    { l: "Pausados", v: data.filter(d => d.status === "pausado").length, c: "text-amber-600 bg-amber-500/10" },
                    { l: "Compromiso Mensual", v: `RD$ ${totalActivos.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, c: "text-rose-600 bg-rose-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Repeat className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="relative mb-4 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar proveedor o concepto..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow><TableHead>ID</TableHead><TableHead>Proveedor / Concepto</TableHead><TableHead>Frecuencia</TableHead><TableHead>Próximo Pago</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Estado</TableHead><TableHead className="w-10" /></TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay pagos recurrentes configurados todavía." : "Sin resultados."}</TableCell></TableRow>}
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell>
                                            <p className="font-semibold">{d.proveedor}</p>
                                            {d.concepto && <p className="text-xs text-muted-foreground">{d.concepto}</p>}
                                        </TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{d.frecuencia}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.proximo}</TableCell>
                                        <TableCell className="text-right font-bold tabular-nums text-red-500">RD$ {(d.monto || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn("text-xs cursor-pointer hover:opacity-80", STATUS_CLASSES[d.status])}
                                                onClick={() => toggleStatus(d.id)}
                                            >
                                                {d.status === "activo" ? <><Play className="w-3 h-3 mr-1 inline-block" />Activo</> : <><Pause className="w-3 h-3 mr-1 inline-block" />Pausado</>}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
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
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Recurrencia" : "Nueva Recurrencia"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Proveedor / Acreedor *</Label><Input placeholder="EDEESTE, Claro, Landlord..." value={formData.proveedor} onChange={e => setFormData(p => ({ ...p, proveedor: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Concepto</Label><Input placeholder="Descripción del gasto recurrente" value={formData.concepto} onChange={e => setFormData(p => ({ ...p, concepto: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Frecuencia</Label>
                                <Select value={formData.frecuencia} onValueChange={v => setFormData(p => ({ ...p, frecuencia: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Semanal">Semanal</SelectItem>
                                        <SelectItem value="Mensual">Mensual</SelectItem>
                                        <SelectItem value="Bimestral">Bimestral</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Monto (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.monto || ""} onChange={e => setFormData(p => ({ ...p, monto: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Próximo Pago</Label><Input type="date" value={formData.proximo} onChange={e => setFormData(p => ({ ...p, proximo: e.target.value }))} /></div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="activo">Activo</SelectItem><SelectItem value="pausado">Pausado</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.proveedor || !formData.monto}>{isEditing ? "Guardar cambios" : "Crear recurrencia"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar recurrencia?</AlertDialogTitle><AlertDialogDescription>Se eliminará el pago recurrente a <strong>{toDelete?.proveedor}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
