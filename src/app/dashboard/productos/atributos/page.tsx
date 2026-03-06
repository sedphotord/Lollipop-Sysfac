"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit2, Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "product_atributos";

const DEFAULT_ATTRS = [
    { id: "1", nombre: "Color", valores: ["Negro", "Blanco", "Gris", "Plata"] },
    { id: "2", nombre: "Tamaño", valores: ['13"', '15"', '17"', '24"', '27"'] },
    { id: "3", nombre: "Garantía", valores: ["6 meses", "1 año", "2 años", "3 años"] },
    { id: "4", nombre: "Voltaje", valores: ["110V", "220V", "Dual"] },
];

export default function AtributosPage() {
    const [attrs, setAttrs] = useState<any[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", nombre: "", valores: [] as string[] });
    const [newValor, setNewValor] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try { const raw = companyStorage.get(LS_KEY); setAttrs(raw ? JSON.parse(raw) : DEFAULT_ATTRS); }
        catch { setAttrs(DEFAULT_ATTRS); }
    }, []);

    function save(list: any[]) { setAttrs(list); companyStorage.set(LS_KEY, JSON.stringify(list)); }
    function openCreate() { setFormData({ id: Date.now().toString(), nombre: "", valores: [] }); setNewValor(""); setIsEditing(false); setFormOpen(true); }
    function openEdit(a: any) { setFormData({ ...a, valores: [...a.valores] }); setNewValor(""); setIsEditing(true); setFormOpen(true); }
    function openDelete(a: any) { setToDelete(a); setDeleteOpen(true); }

    function addValor() {
        if (!newValor.trim()) return;
        setFormData(p => ({ ...p, valores: [...p.valores, newValor.trim()] }));
        setNewValor("");
    }
    function removeValor(v: string) { setFormData(p => ({ ...p, valores: p.valores.filter(x => x !== v) })); }

    function handleSave() {
        if (!formData.nombre) return;
        const list = isEditing ? attrs.map(a => a.id === formData.id ? formData : a) : [...attrs, formData];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Atributo actualizado" : "Atributo creado");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(attrs.filter(a => a.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Atributo eliminado");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Atributos</h2><p className="text-muted-foreground mt-1 text-sm">Define variantes de productos (color, tamaño, garantía, etc.).</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nuevo Atributo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {attrs.map(attr => (
                    <Card key={attr.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600"><SlidersHorizontal className="w-4 h-4" /></div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(attr)}><Edit2 className="w-3 h-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => openDelete(attr)}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                            <p className="font-bold mb-3">{attr.nombre}</p>
                            <div className="flex flex-wrap gap-1.5">{attr.valores.map((v: string) => <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>)}</div>
                        </CardContent>
                    </Card>
                ))}
                {attrs.length === 0 && <div className="col-span-4 py-12 text-center text-muted-foreground">No hay atributos. Crea el primero.</div>}
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Atributo" : "Nuevo Atributo"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Nombre del Atributo *</Label><Input placeholder="Ej: Color, Tamaño, Garantía..." value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))} /></div>
                        <div className="space-y-2">
                            <Label>Valores</Label>
                            <div className="flex gap-2">
                                <Input placeholder="Agregar valor..." value={newValor} onChange={e => setNewValor(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addValor(); } }} />
                                <Button type="button" variant="outline" size="sm" onClick={addValor}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                                {formData.valores.map(v => (
                                    <Badge key={v} variant="secondary" className="text-xs gap-1">
                                        {v}
                                        <button onClick={() => removeValor(v)}><X className="w-2.5 h-2.5" /></button>
                                    </Badge>
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
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar atributo?</AlertDialogTitle><AlertDialogDescription>Se eliminará el atributo <strong>{toDelete?.nombre}</strong> y todos sus valores.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
