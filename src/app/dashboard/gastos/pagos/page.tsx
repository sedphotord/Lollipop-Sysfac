"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, DollarSign, Download, Plus, Search, Building2, Calendar, FileText, CreditCard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer, Edit } from "lucide-react";

// Initial mock data simulating payments to suppliers
const INITIAL_DATA = [
    { id: "PGE-001", fecha: "22 Oct 2024", proveedor: "DISTRIBUIDORA CORRIPIO", factura: "B0100000045", metodo: "Transferencia", monto: 125000, status: "confirmado" },
    { id: "PGE-002", fecha: "18 Oct 2024", proveedor: "CEPM", factura: "B0100000089", metodo: "Transferencia", monto: 45000, status: "pendiente" },
    { id: "PGE-003", fecha: "05 Oct 2024", proveedor: "ARL SALUD", factura: "B0100000102", metodo: "Cheque", monto: 18500, status: "confirmado" },
    { id: "PGE-004", fecha: "01 Oct 2024", proveedor: "OFICINA VIRTUAL DGII", factura: "IR-17", metodo: "Transferencia", monto: 9550, status: "confirmado" },
];

export default function PagosProvedoresPage() {
    const [search, setSearch] = useState("");
    const [pagos, setPagos] = useState<any[]>(INITIAL_DATA);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        // Load saved payments for suppliers
        try {
            const savedPagos = JSON.parse(companyStorage.get('pagos_proveedores') || '[]');
            if (savedPagos.length > 0) {
                setPagos([...savedPagos, ...INITIAL_DATA]);
            }
        } catch { }
    }, []);

    const handleUpdatePayment = () => {
        const updatedPagos = pagos.map(p => p.id === selectedPayment.id ? { ...p, ...editForm, monto: parseFloat(editForm.monto) || 0 } : p);
        const existingRaw = companyStorage.get('pagos_proveedores');
        let existing = [];
        try { existing = JSON.parse(existingRaw || '[]'); } catch { }
        const newStorage = existing.map((p: any) => p.id === selectedPayment.id ? { ...p, ...editForm, monto: parseFloat(editForm.monto) || 0 } : p);

        companyStorage.set('pagos_proveedores', JSON.stringify(newStorage));
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
                    <h2 className="text-3xl font-bold tracking-tight">Pagos a Proveedores</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Registro de desembolsos y abonos a facturas de suplidores.</p>
                </div>
                <Link href="/dashboard/gastos/pagos/new">
                    <Button className="bg-primary shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Registrar Pago
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Pagado", value: `RD$ ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
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
                                    <TableHead>Proveedor</TableHead>
                                    <TableHead>Factura Ref.</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagos.filter(d => d.proveedor.toLowerCase().includes(search.toLowerCase()) || d.factura.toLowerCase().includes(search.toLowerCase())).map((d, i) => (
                                    <TableRow key={i} className="hover:bg-muted/20 cursor-pointer" onClick={() => { setSelectedPayment(d); setIsEditingPayment(false); }}>
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.proveedor}</TableCell>
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

            {/* Receipt Detail Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedPayment(null)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative print:shadow-none print:w-full print:max-w-none print:h-full" onClick={e => e.stopPropagation()}>
                        {/* Header Actions (hidden on print) */}
                        <div className="px-6 py-4 flex items-center justify-between border-b bg-muted/20 print:hidden">
                            <h2 className="font-bold text-lg text-foreground">Comprobante de Egreso</h2>
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
                                <p className="text-sm font-medium text-muted-foreground">Pago realizado exitosamente</p>
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
                                        <span className="text-sm text-muted-foreground">ID Egreso</span>
                                        <span className="text-sm font-mono font-medium">{selectedPayment.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Fecha Pago</span>
                                        <span className="text-sm font-medium">{selectedPayment.fecha}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                                        <span className="text-sm text-muted-foreground">Proveedor</span>
                                        <span className="text-sm font-bold text-foreground text-right max-w-[200px] truncate" title={selectedPayment.proveedor}>{selectedPayment.proveedor}</span>
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
                                    Este recibo es un comprobante de egreso. No tiene validez fiscal por sí solo.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
