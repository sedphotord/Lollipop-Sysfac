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
import {
    ArrowUpRight, Calendar, CheckCircle2, Clock, DollarSign,
    Edit2, MoreVertical, Plus, RefreshCw, Search, Trash2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "facturas_recurrentes";

const FRECUENCIAS = ["Mensual", "Bimestral", "Trimestral", "Semestral", "Anual"];

const STATUS_STYLES: Record<string, string> = {
    activa: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    pausada: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    cancelada: "text-rose-600 bg-rose-500/10 border-rose-500/30",
};

const EMPTY_REC = {
    id: "", cliente: "", concepto: "", frecuencia: "Mensual",
    proximo: new Date().toISOString().split("T")[0],
    monto: 0, status: "activa",
};

export default function FacturasRecurrentesPage() {
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_REC });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try { setData(JSON.parse(companyStorage.get(LS_KEY) || "[]")); } catch { }
    }, []);

    function save(list: any[]) {
        setData(list);
        companyStorage.set(LS_KEY, JSON.stringify(list));
    }

    const filtered = data.filter(d =>
        (d.cliente || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.concepto || "").toLowerCase().includes(search.toLowerCase())
    );

    const activas = data.filter(d => d.status === "activa");
    const pausadas = data.filter(d => d.status === "pausada");
    const ingresoMensual = activas.reduce((a, d) => a + (d.monto || 0), 0);

    function openCreate() { setFormData({ ...EMPTY_REC, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(d: any) { setFormData({ ...d }); setIsEditing(true); setFormOpen(true); }
    function openDelete(d: any) { setToDelete(d); setDeleteOpen(true); }

    function toggleStatus(item: any) {
        const newStatus = item.status === "activa" ? "pausada" : "activa";
        save(data.map(d => d.id === item.id ? { ...d, status: newStatus } : d));
        toast.success(`Recurrencia ${newStatus === "activa" ? "activada" : "pausada"}`);
    }

    function handleSave() {
        const r = { ...formData, monto: parseFloat(String(formData.monto)) || 0 };
        const list = isEditing ? data.map(d => d.id === r.id ? r : d) : [...data, r];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Recurrencia actualizada" : "Recurrencia creada");
    }

    function handleDelete() {
        if (!toDelete) return;
        save(data.filter(d => d.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Recurrencia eliminada");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Facturas Recurrentes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Automatiza la emisión de facturas periódicas a tus clientes.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nueva Recurrencia</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Activas", value: activas.length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Pausadas", value: pausadas.length, icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Ingreso Mensual Est.", value: `RD$ ${ingresoMensual.toLocaleString()}`, icon: DollarSign, color: "text-blue-600 bg-blue-500/10" },
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
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar cliente o concepto..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Frecuencia</TableHead>
                                    <TableHead>Próxima Emisión</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{data.length === 0 ? "No hay recurrencias configuradas. Crea la primera." : "Sin resultados."}</TableCell></TableRow>
                                )}
                                {filtered.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20 group">
                                        <TableCell className="font-semibold">{d.cliente}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{d.concepto}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{d.frecuencia}</Badge></TableCell>
                                        <TableCell className="text-sm"><Calendar className="inline w-3.5 h-3.5 mr-1.5 text-muted-foreground" />{d.proximo}</TableCell>
                                        <TableCell className="text-right font-bold tabular-nums">RD$ {(d.monto || 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs cursor-pointer", STATUS_STYLES[d.status] || "bg-muted")} onClick={() => toggleStatus(d)}>
                                                {d.status === "activa" ? <CheckCircle2 className="w-3 h-3 mr-1 inline" /> : <XCircle className="w-3 h-3 mr-1 inline" />}
                                                {d.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(d)}><Edit2 className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleStatus(d)}><RefreshCw className="w-4 h-4 mr-2" />{d.status === "activa" ? "Pausar" : "Activar"}</DropdownMenuItem>
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
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Recurrencia" : "Nueva Recurrencia"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="space-y-2"><Label>Cliente *</Label><Input placeholder="Nombre del cliente" value={formData.cliente} onChange={e => setFormData(p => ({ ...p, cliente: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Concepto *</Label><Input placeholder="Descripción del servicio recurrente" value={formData.concepto} onChange={e => setFormData(p => ({ ...p, concepto: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Frecuencia</Label>
                                <Select value={formData.frecuencia} onValueChange={v => setFormData(p => ({ ...p, frecuencia: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{FRECUENCIAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Monto (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.monto || ""} onChange={e => setFormData(p => ({ ...p, monto: parseFloat(e.target.value) || 0 }))} /></div>
                        </div>
                        <div className="space-y-2"><Label>Próxima Emisión</Label><Input type="date" value={formData.proximo} onChange={e => setFormData(p => ({ ...p, proximo: e.target.value }))} /></div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="activa">Activa</SelectItem><SelectItem value="pausada">Pausada</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.cliente || !formData.monto}>{isEditing ? "Guardar cambios" : "Crear Recurrencia"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar recurrencia?</AlertDialogTitle><AlertDialogDescription>Se eliminará la recurrencia de <strong>{toDelete?.cliente}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
