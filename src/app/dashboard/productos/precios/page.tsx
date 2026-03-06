"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Plus, Tag, Trash2 } from "lucide-react";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "listas_precios";

const EMPTY = { id: "", nombre: "", descripcion: "", moneda: "DOP", descuento: 0, status: "activa" };
const DEFAULT_LISTAS = [
    { id: "1", nombre: "Precio Estándar", descripcion: "Lista de precios base para todos los clientes", moneda: "DOP", descuento: 0, status: "activa" },
    { id: "2", nombre: "Precio Mayorista", descripcion: "Descuento del 15% sobre el precio estándar", moneda: "DOP", descuento: 15, status: "activa" },
    { id: "3", nombre: "Precio Export USD", descripcion: "Precios en dólares para clientes internacionales", moneda: "USD", descuento: 0, status: "activa" },
];

export default function ListasPreciosPage() {
    const [listas, setListas] = useState<any[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try { const raw = companyStorage.get(LS_KEY); setListas(raw ? JSON.parse(raw) : DEFAULT_LISTAS); }
        catch { setListas(DEFAULT_LISTAS); }
    }, []);

    function save(list: any[]) { setListas(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }
    function openCreate() { setFormData({ ...EMPTY, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(l: any) { setFormData({ ...l }); setIsEditing(true); setFormOpen(true); }
    function openDelete(l: any) { setToDelete(l); setDeleteOpen(true); }

    function countProductos() {
        try { return JSON.parse(companyStorage.get("products") || "[]").length; } catch { return 0; }
    }

    function handleSave() {
        if (!formData.nombre) return;
        const r = { ...formData, descuento: parseFloat(String(formData.descuento)) || 0 };
        const list = isEditing ? listas.map(l => l.id === r.id ? r : l) : [...listas, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Lista actualizada" : "Lista creada");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(listas.filter(l => l.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Lista eliminada");
    }

    const totalProds = countProductos();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Listas de Precios</h2><p className="text-muted-foreground mt-1 text-sm">Crea listas de precios diferenciadas por segmento de cliente o moneda.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nueva Lista</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {listas.map(lista => (
                    <Card key={lista.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Tag className="w-5 h-5" /></div>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs">{lista.moneda}</Badge>
                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(lista)}><Edit2 className="w-3 h-3" /></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => openDelete(lista)}><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{lista.nombre}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{lista.descripcion}</p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{totalProds} productos</span>
                                <div className="flex items-center gap-2">
                                    {lista.descuento > 0 && <Badge variant="outline" className="text-xs text-violet-600">-{lista.descuento}%</Badge>}
                                    <Badge variant="outline" className={`text-xs ${lista.status === "activa" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10" : "text-muted-foreground"}`}>{lista.status}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Lista de Precios" : "Nueva Lista de Precios"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Nombre *</Label><Input placeholder="Ej: Precio Mayorista" value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Descripción</Label><Input placeholder="Descripción de la lista" value={formData.descripcion} onChange={e => setFormData(p => ({ ...p, descripcion: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Moneda</Label>
                                <Select value={formData.moneda} onValueChange={v => setFormData(p => ({ ...p, moneda: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="DOP">DOP (Pesos)</SelectItem><SelectItem value="USD">USD (Dólares)</SelectItem><SelectItem value="EUR">EUR (Euros)</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Descuento (%)</Label><Input type="number" min="0" max="100" placeholder="0" value={formData.descuento || ""} onChange={e => setFormData(p => ({ ...p, descuento: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="activa">Activa</SelectItem><SelectItem value="inactiva">Inactiva</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.nombre}>{isEditing ? "Guardar" : "Crear"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar lista de precios?</AlertDialogTitle><AlertDialogDescription>Se eliminará la lista <strong>{toDelete?.nombre}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
