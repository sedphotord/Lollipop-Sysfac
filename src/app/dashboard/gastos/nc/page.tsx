"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, MoreVertical, Plus, Search, Trash2, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "nc_compras";

const EMPTY_FORM = {
    id: "", fecha: new Date().toISOString().split("T")[0],
    proveedor: "", facturaRef: "", motivo: "", monto: 0
};

export default function NcComprasPage() {
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

    const totalAcreditado = data.reduce((a, d) => a + (d.monto || 0), 0);
    const filtered = data.filter(d =>
        (d.proveedor || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.motivo || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.id || "").toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() {
        setFormData({ ...EMPTY_FORM, id: `NC-C-${String(data.length + 1).padStart(3, "0")}` });
        setIsEditing(false); setFormOpen(true);
    }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function handleSave() {
        const r = { ...formData, monto: parseFloat(String(formData.monto)) || 0 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "NC actualizada" : "NC registrada", { description: r.proveedor });
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Nota de crédito eliminada");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Notas de Crédito en Compras</h2><p className="text-muted-foreground mt-1 text-sm">NC emitidas por tus proveedores que reducen tus CxP.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Registrar NC</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { l: "NC Registradas", v: data.length, c: "text-blue-600 bg-blue-500/10" },
                    { l: "Total Acreditado", v: `RD$ ${totalAcreditado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, c: "text-emerald-600 bg-emerald-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><TrendingDown className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="relative mb-4 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar por proveedor o motivo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>Factura Original</TableHead><TableHead>Motivo</TableHead><TableHead className="text-right">Monto Acreditado</TableHead><TableHead className="w-10" /></TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay notas de crédito registradas." : "Sin resultados."}</TableCell></TableRow>}
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                        <TableCell className="font-mono text-xs text-primary">{d.facturaRef || "—"}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{d.motivo}</TableCell>
                                        <TableCell className="text-right font-bold tabular-nums text-emerald-600">RD$ {(d.monto || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</TableCell>
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
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Nota de Crédito" : "Registrar Nota de Crédito"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>ID</Label><Input className="font-mono" value={formData.id} onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={formData.fecha} onChange={e => setFormData(p => ({ ...p, fecha: e.target.value }))} /></div>
                        </div>
                        <div className="space-y-2"><Label>Proveedor *</Label><Input placeholder="Nombre del proveedor" value={formData.proveedor} onChange={e => setFormData(p => ({ ...p, proveedor: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Factura Referida</Label><Input className="font-mono" placeholder="FP-001" value={formData.facturaRef} onChange={e => setFormData(p => ({ ...p, facturaRef: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Monto (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.monto || ""} onChange={e => setFormData(p => ({ ...p, monto: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2"><Label>Motivo</Label><Input placeholder="Devolución, error en precio, etc." value={formData.motivo} onChange={e => setFormData(p => ({ ...p, motivo: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.proveedor || !formData.monto}>{isEditing ? "Guardar cambios" : "Registrar NC"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar nota de crédito?</AlertDialogTitle><AlertDialogDescription>Se eliminará la NC <strong>{toDelete?.id}</strong> de {toDelete?.proveedor}.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
