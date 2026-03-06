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
import { ArrowDownTrayIcon, DocumentTextIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CheckCircle2, Clock, DollarSign, Edit2, MoreVertical, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "facturas_proveedores";

const EMPTY_FORM = {
    id: "", fecha: new Date().toISOString().split("T")[0],
    proveedor: "", ncf: "", subtotal: 0, itbis: 0, total: 0, status: "pendiente"
};

export default function ProveedoresPage() {
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

    function save(list: any[]) {
        setData(list);
        companyStorage.set(LS_KEY, JSON.stringify(list));
    }

    const totalPendiente = data.filter(d => d.status === "pendiente").reduce((a, d) => a + (d.total || 0), 0);
    const totalPagado = data.filter(d => d.status === "pagada").reduce((a, d) => a + (d.total || 0), 0);
    const filtered = data.filter(d =>
        (d.proveedor || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.ncf || "").toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() { setFormData({ ...EMPTY_FORM, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function recalcTotal() {
        const sub = parseFloat(String(formData.subtotal)) || 0;
        const itbis = parseFloat(String(formData.itbis)) || 0;
        setFormData(p => ({ ...p, total: sub + itbis }));
    }

    function handleSave() {
        const r = { ...formData, subtotal: parseFloat(String(formData.subtotal)) || 0, itbis: parseFloat(String(formData.itbis)) || 0, total: parseFloat(String(formData.total)) || 0 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Factura actualizada" : "Factura registrada", { description: r.proveedor });
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Factura eliminada");
    }

    function exportCSV() {
        const headers = ["ID", "Fecha", "Proveedor", "NCF", "Subtotal", "ITBIS", "Total", "Estado"];
        const rows = data.map(d => [d.id, d.fecha, d.proveedor, d.ncf, d.subtotal, d.itbis, d.total, d.status]);
        const csv = [headers, ...rows].map(r => r.map((v: any) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "facturas_proveedores.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Facturas de Proveedores</h2><p className="text-muted-foreground mt-1 text-sm">Gestión de Cuentas por Pagar y documentos de compra.</p></div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportCSV}><ArrowDownTrayIcon className="w-4 h-4 mr-2" />CSV</Button>
                    <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><PlusIcon className="w-4 h-4 mr-2" /> Registrar Factura</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Pendiente", value: `RD$ ${totalPendiente.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Total Pagado", value: `RD$ ${totalPagado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Facturas Registradas", value: data.length, icon: DollarSign, color: "text-blue-600 bg-blue-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[180px]"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar proveedor o NCF..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>NCF</TableHead><TableHead className="text-right">Subtotal</TableHead><TableHead className="text-right">ITBIS</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead><TableHead className="w-10" /></TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay facturas de proveedores. Registra la primera." : "Sin resultados."}</TableCell></TableRow>}
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                        <TableCell className="font-mono text-xs">{d.ncf || <span className="text-amber-500">Sin NCF</span>}</TableCell>
                                        <TableCell className="text-right tabular-nums">RD$ {(d.subtotal || 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums text-muted-foreground">RD$ {(d.itbis || 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums font-bold">RD$ {(d.total || 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs", d.status === "pagada" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10" : "text-amber-600 border-amber-500/30 bg-amber-500/10")}>{d.status}</Badge>
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

            {/* Create/Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Factura" : "Registrar Factura de Proveedor"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Proveedor *</Label><Input placeholder="Nombre del proveedor" value={formData.proveedor} onChange={e => setFormData(p => ({ ...p, proveedor: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={formData.fecha} onChange={e => setFormData(p => ({ ...p, fecha: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>NCF</Label><Input placeholder="B0100000000" className="font-mono" value={formData.ncf} onChange={e => setFormData(p => ({ ...p, ncf: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2"><Label>Subtotal *</Label><Input type="number" placeholder="0.00" value={formData.subtotal || ""} onChange={e => setFormData(p => ({ ...p, subtotal: parseFloat(e.target.value) || 0 }))} onBlur={recalcTotal} /></div>
                            <div className="space-y-2"><Label>ITBIS</Label><Input type="number" placeholder="0.00" value={formData.itbis || ""} onChange={e => setFormData(p => ({ ...p, itbis: parseFloat(e.target.value) || 0 }))} onBlur={recalcTotal} /></div>
                            <div className="space-y-2"><Label>Total</Label><Input type="number" placeholder="0.00" value={formData.total || ""} onChange={e => setFormData(p => ({ ...p, total: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="pendiente">Pendiente</SelectItem><SelectItem value="pagada">Pagada</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.proveedor || !formData.subtotal}>{isEditing ? "Guardar cambios" : "Registrar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle><AlertDialogDescription>Se eliminará la factura de <strong>{toDelete?.proveedor}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
