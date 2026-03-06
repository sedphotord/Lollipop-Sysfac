"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit2, List, Plus, Tag, Trash2 } from "lucide-react";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "product_categorias";
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

const DEFAULT_CATS = [
    { id: "1", nombre: "Hardware", color: "#3b82f6", descripcion: "Equipos y periféricos de cómputo" },
    { id: "2", nombre: "Software", color: "#8b5cf6", descripcion: "Licencias y aplicaciones" },
    { id: "3", nombre: "Servicios", color: "#10b981", descripcion: "Consultoría y soporte técnico" },
    { id: "4", nombre: "Papelería", color: "#f59e0b", descripcion: "Materiales de oficina" },
    { id: "5", nombre: "Mobiliario", color: "#ef4444", descripcion: "Muebles y accesorios de oficina" },
];

const EMPTY = { id: "", nombre: "", color: COLORS[0], descripcion: "" };

export default function CategoriasPage() {
    const [cats, setCats] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setCats(raw ? JSON.parse(raw) : DEFAULT_CATS);
        } catch { setCats(DEFAULT_CATS); }
    }, []);

    function save(list: any[]) { setCats(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }

    // Count productos per categoria from products key
    function countProductos(catNombre: string) {
        try {
            const prods: any[] = JSON.parse(companyStorage.get("products") || "[]");
            return prods.filter(p => (p.category || p.categoria || "") === catNombre).length;
        } catch { return 0; }
    }

    function openCreate() { setFormData({ ...EMPTY, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(c: any) { setFormData({ ...c }); setIsEditing(true); setFormOpen(true); }
    function openDelete(c: any) { setToDelete(c); setDeleteOpen(true); }

    function handleSave() {
        if (!formData.nombre) return;
        const list = isEditing ? cats.map(c => c.id === formData.id ? formData : c) : [...cats, formData];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(cats.filter(c => c.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Categoría eliminada");
    }

    const filtered = cats.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Categorías</h2><p className="text-muted-foreground mt-1 text-sm">Organiza tu catálogo de productos y servicios en categorías.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nueva Categoría</Button>
            </div>
            <Input placeholder="Buscar categoría..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs bg-background" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(cat => {
                    const count = countProductos(cat.nombre);
                    return (
                        <Card key={cat.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <CardContent className="p-5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: cat.color + "20", border: `1px solid ${cat.color}30` }}>
                                    <Tag className="w-5 h-5" style={{ color: cat.color }} />
                                </div>
                                <p className="font-bold mb-1">{cat.nombre}</p>
                                <p className="text-xs text-muted-foreground mb-3 leading-snug">{cat.descripcion}</p>
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="text-xs"><List className="w-3 h-3 mr-1" />{count} productos</Badge>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}><Edit2 className="w-3.5 h-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => openDelete(cat)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {filtered.length === 0 && <div className="col-span-4 py-12 text-center text-muted-foreground">No hay categorías. Crea la primera.</div>}
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Nombre *</Label><Input placeholder="Ej: Hardware, Servicios..." value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Descripción</Label><Input placeholder="Descripción breve" value={formData.descripcion} onChange={e => setFormData(p => ({ ...p, descripcion: e.target.value }))} /></div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => (
                                    <button key={c} className={`w-7 h-7 rounded-full border-2 transition-all ${formData.color === c ? "border-foreground scale-110" : "border-transparent"}`} style={{ background: c }} onClick={() => setFormData(p => ({ ...p, color: c }))} />
                                ))}
                            </div>
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
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle><AlertDialogDescription>Se eliminará <strong>{toDelete?.nombre}</strong>. Los productos no se verán afectados.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
