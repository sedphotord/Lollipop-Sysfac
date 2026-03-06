"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    CheckCircle2, DollarSign, Download, Edit2, Filter, MoreHorizontal,
    Plus, Search, Trash2, TrendingUp, Users2, XCircle, Eye,
    Phone, Mail, User, Hash, Building2, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Client = {
    id: string;
    name: string;
    comercialName: string;
    rnc: string;
    type: string;
    status: string;
    facturas: number;
    totalFacturado: number;
    saldoPendiente: number;
    phone?: string;
    email?: string;
    contactPerson?: string;
};

const INITIAL_CLIENTS: Client[] = [
    { id: "1", name: "COMPAÑIA DOMINICANA DE TELEFONOS, S.A.", comercialName: "CLARO", rnc: "101010101", type: "SRL", status: "Activo", facturas: 5, totalFacturado: 1120800, saldoPendiente: 605800, phone: "809-220-1111", email: "cuentas@claro.com.do", contactPerson: "Ramona Díaz" },
    { id: "2", name: "ALTICE DOMINICANA, S.A.", comercialName: "ALTICE", rnc: "130819985", type: "SRL", status: "Activo", facturas: 3, totalFacturado: 350000, saldoPendiente: 125000, phone: "809-544-1234", email: "pagos@altice.com.do", contactPerson: "Luis Marte" },
    { id: "3", name: "GRUPO RAMOS, S.A.", comercialName: "SIRENA / APREZIO", rnc: "101001010", type: "SRL", status: "Activo", facturas: 8, totalFacturado: 890000, saldoPendiente: 0, phone: "809-682-0000", email: "compras@gruporamos.com.do", contactPerson: "Patricia Núñez" },
    { id: "4", name: "BANCO DE RESERVAS DE LA R.D.", comercialName: "BANRESERVAS", rnc: "101288345", type: "Estado", status: "Activo", facturas: 2, totalFacturado: 500000, saldoPendiente: 250000, phone: "809-960-2121", email: "contratos@banreservas.gob.do", contactPerson: "Carlos Gómez" },
    { id: "5", name: "JUAN ANTONIO PEREZ ROSARIO", comercialName: "", rnc: "00114356789", type: "Persona Física", status: "Activo", facturas: 1, totalFacturado: 3500, saldoPendiente: 0, phone: "829-555-0001", email: "japerez@mail.com", contactPerson: "" },
    { id: "6", name: "EMPRESA SUSPENDIDA SRL", comercialName: "", rnc: "101112223", type: "SRL", status: "Suspendido", facturas: 0, totalFacturado: 0, saldoPendiente: 0, phone: "", email: "", contactPerson: "" },
];

const EMPTY_CLIENT: Client = {
    id: "", name: "", comercialName: "", rnc: "",
    type: "SRL", status: "Activo",
    facturas: 0, totalFacturado: 0, saldoPendiente: 0,
    phone: "", email: "", contactPerson: ""
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Detail modal
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Edit / Create dialog
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState<Client>(EMPTY_CLIENT);
    const [isEditing, setIsEditing] = useState(false);

    // Delete confirm
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Client | null>(null);

    const filtered = clients.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.rnc.includes(search) ||
            (c.comercialName && c.comercialName.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalClientes = clients.filter(c => c.status === "Activo").length;
    const totalFacturado = clients.reduce((a, c) => a + c.totalFacturado, 0);
    const totalPendiente = clients.reduce((a, c) => a + c.saldoPendiente, 0);

    function openDetail(c: Client) {
        setSelectedClient(c);
        setDetailOpen(true);
    }

    function openCreate() {
        setFormData({ ...EMPTY_CLIENT, id: Date.now().toString() });
        setIsEditing(false);
        setFormOpen(true);
    }

    function openEdit(c: Client) {
        setFormData({ ...c });
        setIsEditing(true);
        setFormOpen(true);
    }

    function openDelete(c: Client) {
        setToDelete(c);
        setDeleteOpen(true);
    }

    function handleSave() {
        if (isEditing) {
            setClients(prev => prev.map(c => c.id === formData.id ? formData : c));
            if (selectedClient?.id === formData.id) setSelectedClient(formData);
        } else {
            setClients(prev => [...prev, formData]);
        }
        setFormOpen(false);
    }

    function handleDelete() {
        if (!toDelete) return;
        setClients(prev => prev.filter(c => c.id !== toDelete.id));
        if (selectedClient?.id === toDelete.id) setDetailOpen(false);
        setDeleteOpen(false);
        setToDelete(null);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Directorio CRM con verificación DGII integrada.</p>
                </div>
                <Button onClick={openCreate} className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Users2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Clientes Activos</p>
                            <p className="text-lg font-bold tracking-tight">{totalClientes}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Facturado</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalFacturado.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Cuentas por Cobrar</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalPendiente.toLocaleString()}</p>
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
                                placeholder="Buscar por nombre, RNC o cédula..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Activo">Activos</SelectItem>
                                <SelectItem value="Suspendido">Suspendidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="shrink-0">
                            <Download className="w-4 h-4 mr-2" /> Exportar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>RNC / Cédula</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Facturado</TableHead>
                                <TableHead className="text-right">Saldo Pendiente</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((client) => (
                                <TableRow key={client.id} className="hover:bg-muted/20 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                {client.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => openDetail(client)}
                                                    className="font-semibold text-sm hover:text-primary hover:underline transition-colors text-left"
                                                >
                                                    {client.comercialName || client.name}
                                                </button>
                                                {client.comercialName && (
                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{client.name}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{client.rnc}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs bg-muted/50">{client.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium text-sm">
                                        RD$ {client.totalFacturado.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium text-sm">
                                        {client.saldoPendiente > 0 ? (
                                            <span className="text-amber-600">RD$ {client.saldoPendiente.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-emerald-600">RD$ 0.00</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-xs gap-1",
                                            client.status === "Activo"
                                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                                                : "text-red-500 bg-red-500/10 border-red-500/30"
                                        )}>
                                            {client.status === "Activo"
                                                ? <CheckCircle2 className="w-3 h-3" />
                                                : <XCircle className="w-3 h-3" />}
                                            {client.status}
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
                                                <DropdownMenuItem onClick={() => openDetail(client)}>
                                                    <Eye className="w-4 h-4 mr-2" /> Ver detalle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/clients/${client.id}`} className="flex items-center">
                                                        <ArrowUpRight className="w-4 h-4 mr-2" /> Abrir perfil
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(client)}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => openDelete(client)}
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
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10 text-sm">
                                        No se encontraron clientes con esos criterios.
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
                    {selectedClient && (
                        <>
                            <DialogHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                                        {selectedClient.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg">
                                            {selectedClient.comercialName || selectedClient.name}
                                        </DialogTitle>
                                        {selectedClient.comercialName && (
                                            <DialogDescription className="text-xs">{selectedClient.name}</DialogDescription>
                                        )}
                                    </div>
                                </div>
                            </DialogHeader>
                            <Separator className="my-3" />

                            <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline" className={cn(
                                        "text-xs gap-1 font-bold",
                                        selectedClient.status === "Activo"
                                            ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                                            : "text-red-500 bg-red-500/10 border-red-500/30"
                                    )}>
                                        {selectedClient.status === "Activo"
                                            ? <CheckCircle2 className="w-3 h-3" />
                                            : <XCircle className="w-3 h-3" />}
                                        {selectedClient.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-muted/50">
                                        {selectedClient.type}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <InfoRow icon={<Hash className="w-4 h-4" />} label="RNC / Cédula" value={selectedClient.rnc} />
                                    {selectedClient.contactPerson && (
                                        <InfoRow icon={<User className="w-4 h-4" />} label="Contacto" value={selectedClient.contactPerson} />
                                    )}
                                    {selectedClient.phone && (
                                        <InfoRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={selectedClient.phone} />
                                    )}
                                    {selectedClient.email && (
                                        <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={selectedClient.email} />
                                    )}
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                                        <p className="text-[10px] text-muted-foreground font-medium mb-1">Total Facturado</p>
                                        <p className="text-base font-black text-emerald-600">RD$ {selectedClient.totalFacturado.toLocaleString()}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{selectedClient.facturas} facturas</p>
                                    </div>
                                    <div className={cn(
                                        "border rounded-xl p-3",
                                        selectedClient.saldoPendiente > 0
                                            ? "bg-amber-500/5 border-amber-500/20"
                                            : "bg-muted/30 border-border/40"
                                    )}>
                                        <p className="text-[10px] text-muted-foreground font-medium mb-1">Saldo Pendiente</p>
                                        <p className={cn(
                                            "text-base font-black",
                                            selectedClient.saldoPendiente > 0 ? "text-amber-600" : "text-emerald-600"
                                        )}>
                                            RD$ {selectedClient.saldoPendiente.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1" onClick={() => { setDetailOpen(false); openEdit(selectedClient); }}>
                                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                    <Link href={`/dashboard/clients/${selectedClient.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <ArrowUpRight className="w-4 h-4 mr-2" /> Perfil
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => { setDetailOpen(false); openDelete(selectedClient); }}
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
                        <DialogTitle>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label>Nombre Legal / Razón Social</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                placeholder="Nombre completo"
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
                            <Label>RNC / Cédula</Label>
                            <Input
                                value={formData.rnc}
                                onChange={e => setFormData(p => ({ ...p, rnc: e.target.value }))}
                                placeholder="000-0000000-0"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Persona de Contacto</Label>
                            <Input
                                value={formData.contactPerson ?? ""}
                                onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))}
                                placeholder="Nombre del contacto"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Teléfono</Label>
                            <Input
                                value={formData.phone ?? ""}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                placeholder="809-000-0000"
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                value={formData.email ?? ""}
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
                            {isEditing ? "Guardar cambios" : "Crear Cliente"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirm ── */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
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
