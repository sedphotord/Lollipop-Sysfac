"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    CheckCircle2, Download, Edit2, Filter, MoreHorizontal,
    Plus, Search, Trash2, TrendingUp, Truck, XCircle, Eye,
    Phone, Mail, User, Hash, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "proveedores";


type Supplier = {
    id: string;
    name: string;
    comercialName: string;
    rnc: string;
    contactPerson: string;
    phone: string;
    email: string;
    type: string;
    status: string;
    totalComprado: number;
};

const INITIAL_SUPPLIERS: Supplier[] = [
    { id: "1", name: "DISTRIBUIDORA CORRIPIO, SAS", comercialName: "CORRIPIO", rnc: "101000181", contactPerson: "José Pérez", phone: "809-555-0101", email: "ventas@corripio.com.do", type: "SRL", status: "Activo", totalComprado: 2500000 },
    { id: "2", name: "OMEGA TECH, S.A.", comercialName: "OMEGA TECH", rnc: "130123456", contactPerson: "Ana Sánchez", phone: "809-555-0202", email: "mayoristas@omegatech.do", type: "SRL", status: "Activo", totalComprado: 1200000 },
    { id: "3", name: "PAPELERIA JUMBO, SRL", comercialName: "JUMBO", rnc: "101987654", contactPerson: "Carlos Rodríguez", phone: "809-555-0303", email: "ventas@jumbo.com.do", type: "SRL", status: "Activo", totalComprado: 450000 },
    { id: "4", name: "SERVICIOS TECNOLOGICOS GLOBALES", comercialName: "GLOBAL TECH", rnc: "101456789", contactPerson: "María Fernández", phone: "809-555-0404", email: "info@globaltech.do", type: "SRL", status: "Activo", totalComprado: 850000 },
    { id: "5", name: "PROVEEDOR SUSPENDIDO SRL", comercialName: "", rnc: "101112223", contactPerson: "Desconocido", phone: "809-000-0000", email: "suspendido@test.com", type: "SRL", status: "Suspendido", totalComprado: 0 },
];

const EMPTY_SUPPLIER: Supplier = {
    id: "", name: "", comercialName: "", rnc: "",
    contactPerson: "", phone: "", email: "",
    type: "SRL", status: "Activo", totalComprado: 0
};

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [gasto_summary, setGastoSummary] = useState<Record<string, number>>({});

    // Load from localStorage (fall back to demo data on first load)
    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setSuppliers(raw ? JSON.parse(raw) : INITIAL_SUPPLIERS);
        } catch { setSuppliers(INITIAL_SUPPLIERS); }
        // Build total comprado from gastos
        try {
            const raw = companyStorage.get("gastos");
            const gs: any[] = raw ? JSON.parse(raw) : [];
            const summary: Record<string, number> = {};
            gs.forEach(g => {
                const k = (g.proveedor || "").toLowerCase();
                if (!summary[k]) summary[k] = 0;
                summary[k] += g.monto || 0;
            });
            setGastoSummary(summary);
        } catch { }
    }, []);

    function save(list: Supplier[]) {
        setSuppliers(list);
        companyStorage.set(LS_KEY, JSON.stringify(list));
    }

    // Detail modal
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    // Edit / Create dialog
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState<Supplier>(EMPTY_SUPPLIER);
    const [isEditing, setIsEditing] = useState(false);

    // Delete confirm
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Supplier | null>(null);

    const filtered = suppliers.filter(s => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.rnc.includes(search) ||
            (s.comercialName && s.comercialName.toLowerCase().includes(search.toLowerCase())) ||
            s.contactPerson.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalActivos = suppliers.filter(s => s.status === "Activo").length;
    const totalComprado = suppliers.reduce((a, s) => a + (gasto_summary[(s.comercialName || s.name).toLowerCase()] || gasto_summary[(s.name).toLowerCase()] || s.totalComprado || 0), 0);

    function openDetail(s: Supplier) { setSelectedSupplier(s); setDetailOpen(true); }
    function openCreate() { setFormData({ ...EMPTY_SUPPLIER, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(s: Supplier) { setFormData({ ...s }); setIsEditing(true); setFormOpen(true); }
    function openDelete(s: Supplier) { setToDelete(s); setDeleteOpen(true); }

    function handleSave() {
        const list: Supplier[] = isEditing ? suppliers.map(s => s.id === formData.id ? formData : s) : [...suppliers, formData];
        save(list);
        if (selectedSupplier?.id === formData.id) setSelectedSupplier(formData);
        setFormOpen(false);
        toast.success(isEditing ? "Proveedor actualizado" : "Proveedor creado", { description: formData.comercialName || formData.name });
    }

    function handleDelete() {
        if (!toDelete) return;
        save(suppliers.filter(s => s.id !== toDelete.id));
        if (selectedSupplier?.id === toDelete.id) setDetailOpen(false);
        setDeleteOpen(false); setToDelete(null);
        toast.success("Proveedor eliminado");
    }

    function exportCSV() {
        const headers = ["ID", "Nombre", "Nombre Comercial", "RNC", "Tipo", "Estado", "Contacto", "Teléfono", "Email"];
        const rows = suppliers.map(s => [s.id, s.name, s.comercialName, s.rnc, s.type, s.status, s.contactPerson, s.phone, s.email]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "proveedores.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestión del directorio de suplidores y abastecimiento.</p>
                </div>
                <Button onClick={openCreate} className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Proveedor
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Proveedores Activos</p>
                            <p className="text-lg font-bold tracking-tight">{totalActivos}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Volumen de Compras</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalComprado.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, RNC, contacto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background border-border/60 focus-visible:ring-primary"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/60">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Activo">Activos</SelectItem>
                                <SelectItem value="Suspendido">Suspendidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="shrink-0" onClick={exportCSV}>
                            <Download className="w-4 h-4 mr-2" /> CSV
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="border border-border/40 rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Proveedor</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">RNC</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Contacto</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground text-right">Volumen Compras</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Estado</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((supplier) => (
                                <TableRow key={supplier.id} className="hover:bg-muted/20 transition-colors group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => openDetail(supplier)}
                                                className="font-bold text-sm text-foreground hover:text-primary hover:underline text-left transition-colors"
                                            >
                                                {supplier.comercialName || supplier.name}
                                            </button>
                                            {supplier.comercialName && (
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{supplier.name}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{supplier.rnc}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{supplier.contactPerson}</span>
                                            <span className="text-[10px] text-muted-foreground">{supplier.phone} | {supplier.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-black text-sm">
                                        RD$ {supplier.totalComprado.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-xs gap-1 font-bold",
                                            supplier.status === "Activo"
                                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                                                : "text-red-500 bg-red-500/10 border-red-500/30"
                                        )}>
                                            {supplier.status === "Activo"
                                                ? <CheckCircle2 className="w-3 h-3" />
                                                : <XCircle className="w-3 h-3" />}
                                            {supplier.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem onClick={() => openDetail(supplier)}>
                                                    <Eye className="w-4 h-4 mr-2" /> Ver detalle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(supplier)}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDelete(supplier)}
                                                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                                        No se encontraron proveedores con esos criterios.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* ── Detail Modal ── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-md">
                    {selectedSupplier && (
                        <>
                            <DialogHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                                        {(selectedSupplier.comercialName || selectedSupplier.name).substring(0, 2)}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg">
                                            {selectedSupplier.comercialName || selectedSupplier.name}
                                        </DialogTitle>
                                        {selectedSupplier.comercialName && (
                                            <DialogDescription className="text-xs">{selectedSupplier.name}</DialogDescription>
                                        )}
                                    </div>
                                </div>
                            </DialogHeader>
                            <Separator className="my-3" />

                            <div className="space-y-4">
                                <Badge variant="outline" className={cn(
                                    "text-xs gap-1 font-bold",
                                    selectedSupplier.status === "Activo"
                                        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                                        : "text-red-500 bg-red-500/10 border-red-500/30"
                                )}>
                                    {selectedSupplier.status === "Activo"
                                        ? <CheckCircle2 className="w-3 h-3" />
                                        : <XCircle className="w-3 h-3" />}
                                    {selectedSupplier.status}
                                </Badge>

                                <div className="grid grid-cols-1 gap-3">
                                    <InfoRow icon={<Hash className="w-4 h-4" />} label="RNC" value={selectedSupplier.rnc} />
                                    <InfoRow icon={<Building2 className="w-4 h-4" />} label="Tipo" value={selectedSupplier.type} />
                                    <InfoRow icon={<User className="w-4 h-4" />} label="Contacto" value={selectedSupplier.contactPerson} />
                                    <InfoRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={selectedSupplier.phone} />
                                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={selectedSupplier.email} />
                                </div>

                                <Separator />

                                <Card className="bg-emerald-500/5 border-emerald-500/20">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground font-medium mb-1">Volumen de Compras</p>
                                        <p className="text-2xl font-black tracking-tight text-emerald-600">
                                            RD$ {selectedSupplier.totalComprado.toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1" onClick={() => { setDetailOpen(false); openEdit(selectedSupplier); }}>
                                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => { setDetailOpen(false); openDelete(selectedSupplier); }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Create / Edit Dialog ── */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label>Nombre Legal</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                placeholder="Razón social completa"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nombre Comercial</Label>
                            <Input
                                value={formData.comercialName}
                                onChange={e => setFormData(p => ({ ...p, comercialName: e.target.value }))}
                                placeholder="Nombre corto / marca"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>RNC</Label>
                            <Input
                                value={formData.rnc}
                                onChange={e => setFormData(p => ({ ...p, rnc: e.target.value }))}
                                placeholder="000-00000-0"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Persona de Contacto</Label>
                            <Input
                                value={formData.contactPerson}
                                onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))}
                                placeholder="Nombre del contacto"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Teléfono</Label>
                            <Input
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                placeholder="809-000-0000"
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                placeholder="correo@empresa.com"
                                type="email"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Tipo</Label>
                            <Select value={formData.type} onValueChange={v => setFormData(p => ({ ...p, type: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SRL">SRL</SelectItem>
                                    <SelectItem value="SA">SA</SelectItem>
                                    <SelectItem value="Persona Física">Persona Física</SelectItem>
                                    <SelectItem value="Estado">Estado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.name || !formData.rnc}>
                            {isEditing ? "Guardar cambios" : "Crear Proveedor"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirm ── */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente a <strong>{toDelete?.comercialName || toDelete?.name}</strong> del directorio. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-sm font-semibold">{value || "—"}</p>
            </div>
        </div>
    );
}
