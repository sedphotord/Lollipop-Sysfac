"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
    AlertTriangle, DollarSign, Download, Edit2, Filter, MoreHorizontal,
    Plus, Receipt, Search, TrendingDown, Trash2, MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "gastos";
const CATEGORIAS = ["Servicios", "Alquileres", "Suministros", "Nómina", "Impuestos", "Marketing", "Transporte", "Equipos", "Otro"];
const METODOS = ["Transferencia", "Cheque", "Efectivo", "Tarjeta", "Débito Automático"];

const CATEGORY_COLORS: Record<string, string> = {
    "Servicios": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Alquileres": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Suministros": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Nómina": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Impuestos": "bg-red-500/10 text-red-600 border-red-500/20",
    "Marketing": "bg-pink-500/10 text-pink-600 border-pink-500/20",
    "Transporte": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    "Equipos": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "Otro": "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const EMPTY_GASTO = {
    id: "", proveedor: "", categoria: "Servicios", monto: 0,
    date: new Date().toISOString().split("T")[0],
    ncf: "", metodo: "Transferencia", status: "pagado", notas: "",
};

export default function GastosPage() {
    const [gastos, setGastos] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_GASTO });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<any>(null);

    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setGastos(raw ? JSON.parse(raw) : []);
        } catch { setGastos([]); }
    }, []);

    function save(list: any[]) {
        setGastos(list);
        companyStorage.set(LS_KEY, JSON.stringify(list));
    }

    const categoriasList = Array.from(new Set([...CATEGORIAS, ...gastos.map(g => g.categoria)]));
    const filtered = gastos.filter(g => {
        const s = (g.proveedor || "").toLowerCase().includes(search.toLowerCase());
        const c = catFilter === "all" || g.categoria === catFilter;
        return s && c;
    });

    const totalGastos = gastos.reduce((a, g) => a + (g.monto || 0), 0);
    const totalPagado = gastos.filter(g => g.status === "pagado").reduce((a, g) => a + (g.monto || 0), 0);
    const porCategoria = categoriasList
        .map(cat => ({ cat, total: gastos.filter(g => g.categoria === cat).reduce((a, g) => a + (g.monto || 0), 0) }))
        .filter(x => x.total > 0)
        .sort((a, b) => b.total - a.total);

    function openCreate() { setFormData({ ...EMPTY_GASTO, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(g: any) { setFormData({ ...g }); setIsEditing(true); setFormOpen(true); }
    function openDelete(g: any) { setToDelete(g); setDeleteOpen(true); }

    function handleSave() {
        const g = { ...formData, monto: parseFloat(String(formData.monto)) || 0 };
        const list = isEditing ? gastos.map(x => x.id === g.id ? g : x) : [...gastos, g];
        save(list);
        setFormOpen(false);
        toast.success(isEditing ? "Gasto actualizado" : "Gasto registrado", { description: g.proveedor });
    }

    function handleDelete() {
        if (!toDelete) return;
        save(gastos.filter(g => g.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Gasto eliminado");
    }

    function exportCSV() {
        const headers = ["ID", "Proveedor", "Categoría", "Fecha", "NCF", "Método", "Monto", "Estado"];
        const rows = filtered.map(g => [g.id, g.proveedor, g.categoria, g.date, g.ncf || "—", g.metodo, (g.monto || 0).toFixed(2), g.status === "pagado" ? "Pagado" : "Pendiente"]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "gastos.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gastos y CxP</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Control de egresos, cuentas por pagar y deducibles.</p>
                </div>
                <Button onClick={openCreate} className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Gasto</Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Egresos", value: `RD$ ${totalGastos.toLocaleString()}`, icon: TrendingDown, color: "text-red-500 bg-red-500/10" },
                    { label: "Pagado", value: `RD$ ${totalPagado.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Pendiente", value: `RD$ ${(totalGastos - totalPagado).toLocaleString()}`, icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Con NCF", value: `${gastos.filter(g => g.ncf).length}/${gastos.length}`, icon: Receipt, color: "text-blue-600 bg-blue-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Category breakdown */}
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Por Categoría</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {porCategoria.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Sin gastos aún</p>}
                        {porCategoria.map(({ cat, total }) => (
                            <div key={cat}>
                                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{cat}</span><span className="text-muted-foreground tabular-nums">RD$ {total.toLocaleString()}</span></div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${totalGastos > 0 ? (total / totalGastos * 100).toFixed(0) : 0}%` }} /></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Table */}
                <div className="lg:col-span-3">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex gap-3 mb-4">
                                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                                <Select value={catFilter} onValueChange={setCatFilter}>
                                    <SelectTrigger className="w-44 bg-background"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">Todas</SelectItem>{categoriasList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />CSV</Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Proveedor</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>NCF</TableHead>
                                            <TableHead className="text-right">Monto</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="w-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.length === 0 && (
                                            <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">{gastos.length === 0 ? "Aún no hay gastos registrados." : "Sin resultados."}</TableCell></TableRow>
                                        )}
                                        {filtered.map(g => (
                                            <TableRow key={g.id} className="hover:bg-muted/20 transition-colors group">
                                                <TableCell className="font-medium text-sm">{g.proveedor}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("text-xs", CATEGORY_COLORS[g.categoria] || CATEGORY_COLORS["Otro"])}>{g.categoria}</Badge></TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{g.date}</TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{g.ncf || <span className="text-amber-500">Sin NCF</span>}</TableCell>
                                                <TableCell className="text-right font-bold tabular-nums text-red-500">-RD$ {(g.monto || 0).toLocaleString()}</TableCell>
                                                <TableCell><Badge variant="outline" className={g.status === "pagado" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs" : "text-amber-600 border-amber-500/30 bg-amber-500/10 text-xs"}>{g.status === "pagado" ? "Pagado" : "Pendiente"}</Badge></TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(g)}><Edit2 className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => openDelete(g)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
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
                </div>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Gasto" : "Registrar Gasto / CxP"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="sm:col-span-2 space-y-2"><Label>Proveedor</Label><Input placeholder="Nombre del proveedor" value={formData.proveedor} onChange={e => setFormData(p => ({ ...p, proveedor: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Monto (RD$)</Label><Input type="number" placeholder="0.00" value={formData.monto || ""} onChange={e => setFormData(p => ({ ...p, monto: parseFloat(e.target.value) || 0 }))} /></div>
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Categoría</Label>
                                <Select value={formData.categoria} onValueChange={v => setFormData(p => ({ ...p, categoria: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Método de Pago</Label>
                                <Select value={formData.metodo} onValueChange={v => setFormData(p => ({ ...p, metodo: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{METODOS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>NCF del Proveedor</Label><Input placeholder="B01..." className="font-mono" value={formData.ncf} onChange={e => setFormData(p => ({ ...p, ncf: e.target.value }))} /></div>
                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="pagado">Pagado</SelectItem><SelectItem value="pendiente">Pendiente</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Descripción adicional..." value={formData.notas} onChange={e => setFormData(p => ({ ...p, notas: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.proveedor || !formData.monto}>{isEditing ? "Guardar cambios" : "Guardar Gasto"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle><AlertDialogDescription>Se eliminará el gasto de <strong>{toDelete?.proveedor}</strong> por RD$ {(toDelete?.monto || 0).toLocaleString()}.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
