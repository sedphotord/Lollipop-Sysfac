"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, DollarSign, Download, Plus, Search, Building2, Calendar, FileText, CreditCard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer, Edit } from "lucide-react";

const INITIAL_DATA = [
    { id: "PAG-001", fecha: "20 Oct 2024", cliente: "CLARO", factura: "INV-0042", metodo: "Transferencia", monto: 605800, status: "confirmado" },
    { id: "PAG-002", fecha: "15 Oct 2024", cliente: "ALTICE", factura: "INV-0040", metodo: "Cheque", monto: 147500, status: "pendiente" },
    { id: "PAG-003", fecha: "01 Oct 2024", cliente: "BANRESERVAS", factura: "INV-0037", metodo: "Transferencia", monto: 297500, status: "confirmado" },
    { id: "PAG-004", fecha: "28 Sep 2024", cliente: "Pedro Almonte", factura: "INV-0036", metodo: "Efectivo", monto: 14514, status: "confirmado" },
];

export default function PagosRecibidosPage() {
    const [search, setSearch] = useState("");
    const [pagos, setPagos] = useState<any[]>(INITIAL_DATA);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    // Form state for new payment
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
    const [formInvoiceId, setFormInvoiceId] = useState("");
    const [formMethod, setFormMethod] = useState("Transferencia");
    const [formAmount, setFormAmount] = useState("");
    const [formRef, setFormRef] = useState("");

    useEffect(() => {
        // Load emitted invoices to populate the dropdown
        try {
            const emitted = JSON.parse(localStorage.getItem('invoice_emitted') || '[]');
            setInvoices(emitted);
        } catch { }

        // Load saved payments
        try {
            const savedPagos = JSON.parse(localStorage.getItem('pagos_recibidos') || '[]');
            if (savedPagos.length > 0) {
                setPagos([...savedPagos, ...INITIAL_DATA]);
            }
        } catch { }
    }, []);

    // Auto-fill amount when invoice is selected
    useEffect(() => {
        if (formInvoiceId) {
            const inv = invoices.find(i => i.id === formInvoiceId);
            if (inv && inv.total) {
                setFormAmount(inv.total.toString());
            }
        }
    }, [formInvoiceId, invoices]);

    const handleSavePayment = () => {
        if (!formInvoiceId || !formAmount) return;

        const inv = invoices.find(i => i.id === formInvoiceId);
        const newPayment = {
            id: `PAG-${Date.now().toString().slice(-4)}`,
            fecha: new Date(formDate).toLocaleDateString('es-DO'),
            cliente: inv ? inv.cliente : 'Desconocido',
            factura: formInvoiceId,
            metodo: formMethod,
            referencia: formRef,
            monto: parseFloat(formAmount),
            status: "confirmado",
        };

        const existing = JSON.parse(localStorage.getItem('pagos_recibidos') || '[]');
        existing.unshift(newPayment);
        localStorage.setItem('pagos_recibidos', JSON.stringify(existing));

        setPagos([newPayment, ...pagos]);
        setIsMenuOpen(false);

        // Reset form
        setFormInvoiceId("");
        setFormAmount("");
        setFormRef("");
    };

    const handleUpdatePayment = () => {
        const updatedPagos = pagos.map(p => p.id === selectedPayment.id ? { ...p, ...editForm, monto: parseFloat(editForm.monto) || 0 } : p);
        const existingRaw = localStorage.getItem('pagos_recibidos');
        let existing = [];
        try { existing = JSON.parse(existingRaw || '[]'); } catch { }
        const newStorage = existing.map((p: any) => p.id === selectedPayment.id ? { ...p, ...editForm, monto: parseFloat(editForm.monto) || 0 } : p);

        localStorage.setItem('pagos_recibidos', JSON.stringify(newStorage));
        setPagos(updatedPagos);
        setSelectedPayment({ ...selectedPayment, ...editForm, monto: parseFloat(editForm.monto) || 0 });
        setIsEditingPayment(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const total = pagos.filter(d => d.status === 'confirmado').reduce((a, d) => a + d.monto, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pagos Recibidos</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Registro de cobros y conciliación con facturas emitidas.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20" onClick={() => setIsMenuOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Registrar Pago
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Cobrado", value: `RD$ ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Confirmados", value: pagos.filter(d => d.status === 'confirmado').length, icon: CheckCircle2, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Pendientes", value: pagos.filter(d => d.status === 'pendiente').length, icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}>
                                <k.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                                <p className="text-lg font-bold">{k.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar pagos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Factura Ref.</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagos.filter(d => d.cliente.toLowerCase().includes(search.toLowerCase()) || d.factura.toLowerCase().includes(search.toLowerCase())).map((d, i) => (
                                    <TableRow key={i} className="hover:bg-muted/20 cursor-pointer" onClick={() => { setSelectedPayment(d); setIsEditingPayment(false); }}>
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.cliente}</TableCell>
                                        <TableCell className="font-mono text-xs text-primary">{d.factura}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{d.metodo}</Badge></TableCell>
                                        <TableCell className="text-right font-bold tabular-nums text-emerald-600">
                                            RD$ {d.monto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs", d.status === 'confirmado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>
                                                {d.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Registrar Pago Modal */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 slide-in-from-bottom-2 animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-600" /> Registrar Pago
                            </h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:bg-muted p-1.5 rounded-md transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de pago</Label>
                                    <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="h-10" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Método</Label>
                                    <Select value={formMethod} onValueChange={setFormMethod}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Transferencia">Transferencia</SelectItem>
                                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                                            <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Factura a pagar</Label>
                                <Select value={formInvoiceId} onValueChange={setFormInvoiceId}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Seleccionar factura emitida..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {invoices.length > 0 ? invoices.map(inv => (
                                            <SelectItem key={inv.id} value={inv.id}>
                                                {inv.ecf !== '—' ? inv.ecf : inv.id} - {inv.cliente} (RD$ {inv.total?.toLocaleString()})
                                            </SelectItem>
                                        )) : (
                                            <SelectItem value="none" disabled>No hay facturas emitidas</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Monto (RD$)</Label>
                                    <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} className="h-10 font-bold text-emerald-600" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Referencia (opcional)</Label>
                                    <Input placeholder="# de transacción o cheque" value={formRef} onChange={e => setFormRef(e.target.value)} className="h-10" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-muted/20 flex justify-end gap-3 z-10 relative">
                            <Button variant="outline" onClick={() => setIsMenuOpen(false)}>Cancelar</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20" onClick={handleSavePayment} disabled={!formAmount || !formInvoiceId}>
                                Guardar Pago
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Detail Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedPayment(null)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative print:shadow-none print:w-full print:max-w-none print:h-full" onClick={e => e.stopPropagation()}>
                        {/* Header Actions (hidden on print) */}
                        <div className="px-6 py-4 flex items-center justify-between border-b bg-muted/20 print:hidden">
                            <h2 className="font-bold text-lg text-foreground">Recibo de Ingreso</h2>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => { setEditForm({ fecha: selectedPayment.fecha, metodo: selectedPayment.metodo, referencia: selectedPayment.referencia || '', monto: selectedPayment.monto, status: selectedPayment.status }), setIsEditingPayment(!isEditingPayment) }} className="w-8 h-8">
                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={handlePrint} className="w-8 h-8">
                                    <Printer className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(null)} className="w-8 h-8 hover:bg-muted text-muted-foreground text-xl leading-none">
                                    ×
                                </Button>
                            </div>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-8 print:p-0 space-y-6">
                            <div className="text-center space-y-2 mb-6 border-b border-dashed pb-6">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 print:hidden">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 print:text-black">
                                    RD$ {parseFloat(selectedPayment.monto).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground">Cobro realizado exitosamente</p>
                            </div>

                            {isEditingPayment ? (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Fecha</Label>
                                        <Input value={editForm.fecha} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} className="h-9" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Monto (RD$)</Label>
                                            <Input type="number" value={editForm.monto} onChange={e => setEditForm({ ...editForm, monto: e.target.value })} className="h-9 font-bold text-emerald-600" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Método</Label>
                                            <Select value={editForm.metodo} onValueChange={v => setEditForm({ ...editForm, metodo: v })}>
                                                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Referencia</Label>
                                        <Input value={editForm.referencia} onChange={e => setEditForm({ ...editForm, referencia: e.target.value })} className="h-9" />
                                    </div>
                                    <Button onClick={handleUpdatePayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4">Guardar Cambios</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">ID Recibo</span>
                                        <span className="text-sm font-mono font-medium">{selectedPayment.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Fecha Pago</span>
                                        <span className="text-sm font-medium">{selectedPayment.fecha}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Cliente</span>
                                        <span className="text-sm font-bold text-foreground text-right max-w-[200px] truncate" title={selectedPayment.cliente}>{selectedPayment.cliente}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Factura Pagada</span>
                                        <span className="text-sm font-mono text-primary font-medium">{selectedPayment.factura}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40 items-start">
                                        <span className="text-sm text-muted-foreground mt-0.5">Método</span>
                                        <div className="text-right">
                                            <span className="text-sm font-medium block">{selectedPayment.metodo}</span>
                                            {selectedPayment.referencia && <span className="text-xs text-muted-foreground font-mono block mt-1">Ref: {selectedPayment.referencia}</span>}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Estado</span>
                                        <Badge variant="outline" className={cn("text-xs uppercase tracking-wider", selectedPayment.status === 'confirmado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>{selectedPayment.status}</Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isEditingPayment && (
                            <div className="bg-muted/30 p-6 text-center print:hidden border-t">
                                <p className="text-xs text-muted-foreground">
                                    Este recibo es un comprobante interno del sistema. No tiene validez fiscal por sí solo.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
