"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2, DollarSign, Download, Edit2, Filter, MoreHorizontal, Plus, Search, Trash2, TrendingUp, Users2, XCircle, Eye, Phone, Mail, User, Hash, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_KEY = "clientes";

type Client = {
    id: string;
    name: string;
    nombre?: string;
    comercialName: string;
    rnc: string;
    type?: string;
    tipo?: string;
    status: string;
    phone?: string;
    email?: string;
    contactPerson?: string;
    contacto?: string;
    direccion?: string;
};

const EMPTY_CLIENT: Client = {
    id: "", name: "", comercialName: "", rnc: "",
    type: "SRL", status: "Activo",
    phone: "", email: "", contactPerson: "",
};

function clientDisplayName(c: Client) {
    return c.comercialName || c.nombre || c.name;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoiceSummary, setInvoiceSummary] = useState<Record<string, { total: number; pending: number; count: number }>>({});
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState<Client>(EMPTY_CLIENT);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Client | null>(null);

    // Load from localStorage
    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setClients(raw ? JSON.parse(raw) : []);
        } catch { setClients([]); }

        // Build invoice summary
        try {
            const invRaw = companyStorage.get("invoice_emitted");
            const invoices: any[] = invRaw ? JSON.parse(invRaw) : [];
            const summary: Record<string, { total: number; pending: number; count: number }> = {};
            invoices.filter(i => !i.isDraft).forEach((inv: any) => {
                const key = inv.rnc || inv.clientId || (inv.cliente || "").toLowerCase();
                if (!summary[key]) summary[key] = { total: 0, pending: 0, count: 0 };
                summary[key].total += inv.total || 0;
                summary[key].count++;
                if (inv.paymentStatus !== "pagada") summary[key].pending += inv.total || 0;
            });
            setInvoiceSummary(summary);
        } catch { }
    }, []);

    function save(list: Client[]) {
        setClients(list);
        companyStorage.set(LS_KEY, JSON.stringify(list));
    }

    const getInvoiceSummary = (c: Client) => {
        const key = c.rnc || c.id || (clientDisplayName(c)).toLowerCase();
        return invoiceSummary[key] || invoiceSummary[(clientDisplayName(c)).toLowerCase()] || { total: 0, pending: 0, count: 0 };
    };

    const filtered = clients.filter(c => {
        const q = search.toLowerCase();
        const match = clientDisplayName(c).toLowerCase().includes(q) || (c.rnc || "").includes(q);
        const st = statusFilter === "all" || c.status === statusFilter;
        return match && st;
    });

    const totalClientes = clients.filter(c => c.status === "Activo").length;
    const totalFacturado = Object.values(invoiceSummary).reduce((a, s) => a + s.total, 0);
    const totalPendiente = Object.values(invoiceSummary).reduce((a, s) => a + s.pending, 0);

    function openCreate() { setFormData({ ...EMPTY_CLIENT, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(c: Client) { setFormData({ ...c }); setIsEditing(true); setFormOpen(true); }
    function openDetail(c: Client) { setSelectedClient(c); setDetailOpen(true); }
    function openDelete(c: Client) { setToDelete(c); setDeleteOpen(true); }

    function handleSave() {
        let list: Client[];
        if (isEditing) {
            list = clients.map(c => c.id === formData.id ? formData : c);
        } else {
            list = [...clients, formData];
        }
        save(list);
        if (selectedClient?.id === formData.id) setSelectedClient(formData);
        setFormOpen(false);
        toast.success(isEditing ? "Cliente actualizado" : "Cliente creado", { description: clientDisplayName(formData) });
    }

    function handleDelete() {
        if (!toDelete) return;
        const list = clients.filter(c => c.id !== toDelete.id);
        save(list);
        if (selectedClient?.id === toDelete.id) setDetailOpen(false);
        setDeleteOpen(false);
        setToDelete(null);
        toast.success("Cliente eliminado");
    }

    function exportCSV() {
        const headers = ["ID", "Nombre", "Nombre Comercial", "RNC", "Tipo", "Estado", "Teléfono", "Email"];
        const rows = clients.map(c => [c.id, c.nombre || c.name, c.comercialName, c.rnc, c.type || c.tipo || "—", c.status, c.phone || "—", c.email || "—"]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "clientes.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Directorio CRM con historial de facturas real.</p>
                </div>
                <Button onClick={openCreate} className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Clientes Activos", value: totalClientes.toString(), icon: Users2, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Total Facturado", value: `RD$ ${totalFacturado.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Cuentas por Cobrar", value: `RD$ ${totalPendiente.toLocaleString()}`, icon: DollarSign, color: "text-amber-600 bg-amber-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold tracking-tight">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar por nombre, RNC o cédula..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-background" /></div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Estado" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Activo">Activos</SelectItem><SelectItem value="Suspendido">Suspendidos</SelectItem></SelectContent>
                        </Select>
                        <Button variant="outline" className="shrink-0" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> CSV</Button>
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
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <div>
                                            <Users2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-muted-foreground text-sm">{clients.length === 0 ? "Aún no tienes clientes. Agrega el primero." : "No se encontraron clientes con esos criterios."}</p>
                                            {clients.length === 0 && <Button onClick={openCreate} variant="outline" size="sm" className="mt-3 gap-2"><Plus className="w-4 h-4" /> Agregar cliente</Button>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {filtered.map((client) => {
                                const smry = getInvoiceSummary(client);
                                return (
                                    <TableRow key={client.id} className="hover:bg-muted/20 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                    {clientDisplayName(client).substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <button onClick={() => openDetail(client)} className="font-semibold text-sm hover:text-primary hover:underline transition-colors text-left">
                                                        {clientDisplayName(client)}
                                                    </button>
                                                    {client.comercialName && (client.nombre || client.name) && client.comercialName !== (client.nombre || client.name) && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{client.nombre || client.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{client.rnc}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs bg-muted/50">{client.type || client.tipo || "—"}</Badge></TableCell>
                                        <TableCell className="text-right tabular-nums font-medium text-sm">RD$ {smry.total.toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums font-medium text-sm">
                                            {smry.pending > 0
                                                ? <span className="text-amber-600">RD$ {smry.pending.toLocaleString()}</span>
                                                : <span className="text-emerald-600">RD$ 0.00</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs gap-1", client.status === "Activo" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" : "text-red-500 bg-red-500/10 border-red-500/30")}>
                                                {client.status === "Activo" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {client.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuItem onClick={() => openDetail(client)}><Eye className="w-4 h-4 mr-2" /> Ver detalle</DropdownMenuItem>
                                                    <DropdownMenuItem asChild><Link href={`/dashboard/clients/${client.id}`} className="flex items-center"><ArrowUpRight className="w-4 h-4 mr-2" /> Abrir perfil</Link></DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(client)}><Edit2 className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDelete(client)} className="text-red-500 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="w-4 h-4 mr-2" /> Eliminar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Detail Modal */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-md">
                    {selectedClient && (() => {
                        const smry = getInvoiceSummary(selectedClient);
                        return (
                            <>
                                <DialogHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                                            {clientDisplayName(selectedClient).substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-lg">{clientDisplayName(selectedClient)}</DialogTitle>
                                            {selectedClient.nombre && selectedClient.comercialName && selectedClient.nombre !== selectedClient.comercialName && (
                                                <DialogDescription className="text-xs">{selectedClient.nombre}</DialogDescription>
                                            )}
                                        </div>
                                    </div>
                                </DialogHeader>
                                <Separator className="my-3" />
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <InfoRow icon={<Hash className="w-4 h-4" />} label="RNC / Cédula" value={selectedClient.rnc} />
                                        {(selectedClient.contactPerson || selectedClient.contacto) && <InfoRow icon={<User className="w-4 h-4" />} label="Contacto" value={selectedClient.contactPerson || selectedClient.contacto || ""} />}
                                        {selectedClient.phone && <InfoRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={selectedClient.phone} />}
                                        {selectedClient.email && <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={selectedClient.email} />}
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                                            <p className="text-[10px] text-muted-foreground font-medium mb-1">Total Facturado</p>
                                            <p className="text-base font-black text-emerald-600">RD$ {smry.total.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{smry.count} facturas</p>
                                        </div>
                                        <div className={cn("border rounded-xl p-3", smry.pending > 0 ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/30 border-border/40")}>
                                            <p className="text-[10px] text-muted-foreground font-medium mb-1">Saldo Pendiente</p>
                                            <p className={cn("text-base font-black", smry.pending > 0 ? "text-amber-600" : "text-emerald-600")}>RD$ {smry.pending.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button className="flex-1" onClick={() => { setDetailOpen(false); openEdit(selectedClient); }}><Edit2 className="w-4 h-4 mr-2" /> Editar</Button>
                                        <Link href={`/dashboard/clients/${selectedClient.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full"><ArrowUpRight className="w-4 h-4 mr-2" /> Perfil</Button>
                                        </Link>
                                        <Button variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={() => { setDetailOpen(false); openDelete(selectedClient); }}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* Create / Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <div className="sm:col-span-2 space-y-1.5"><Label>Nombre Legal / Razón Social</Label><Input value={formData.name || formData.nombre || ""} onChange={e => setFormData(p => ({ ...p, name: e.target.value, nombre: e.target.value }))} placeholder="Nombre completo" /></div>
                        <div className="space-y-1.5"><Label>Nombre Comercial</Label><Input value={formData.comercialName} onChange={e => setFormData(p => ({ ...p, comercialName: e.target.value }))} placeholder="Nombre corto / marca" /></div>
                        <div className="space-y-1.5"><Label>RNC / Cédula</Label><Input value={formData.rnc} onChange={e => setFormData(p => ({ ...p, rnc: e.target.value }))} placeholder="000-0000000-0" /></div>
                        <div className="space-y-1.5"><Label>Persona de Contacto</Label><Input value={formData.contactPerson ?? ""} onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))} placeholder="Nombre del contacto" /></div>
                        <div className="space-y-1.5"><Label>Teléfono</Label><Input value={formData.phone ?? ""} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="809-000-0000" /></div>
                        <div className="sm:col-span-2 space-y-1.5"><Label>Email</Label><Input value={formData.email ?? ""} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="correo@empresa.com" type="email" /></div>
                        <div className="space-y-1.5">
                            <Label>Tipo</Label>
                            <Select value={formData.type || "SRL"} onValueChange={v => setFormData(p => ({ ...p, type: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="SRL">SRL</SelectItem><SelectItem value="SA">SA</SelectItem><SelectItem value="Persona Física">Persona Física</SelectItem><SelectItem value="Estado">Estado</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="Suspendido">Suspendido</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!(formData.name || formData.nombre) || !formData.rnc}>{isEditing ? "Guardar cambios" : "Crear Cliente"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción eliminará permanentemente a <strong>{toDelete ? clientDisplayName(toDelete) : ""}</strong>. Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">{icon}</div>
            <div><p className="text-xs text-muted-foreground font-medium">{label}</p><p className="text-sm font-semibold">{value || "—"}</p></div>
        </div>
    );
}
