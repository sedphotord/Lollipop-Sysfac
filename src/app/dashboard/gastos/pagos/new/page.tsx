"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, ChevronDown, DollarSign, Save, Building2, Calendar, FileText, CreditCard, X, Calculator } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock Active Supplier Invoices (Cuentas por Pagar)
const MOCK_INVOICES = [
    { id: "B0100000045", proveedor: "DISTRIBUIDORA CORRIPIO", rnc: "101000001", fecha: "2024-10-15", vencimiento: "2024-11-15", total: 125000, pendiente: 125000 },
    { id: "B0100000089", proveedor: "CEPM", rnc: "102000002", fecha: "2024-10-10", vencimiento: "2024-10-25", total: 45000, pendiente: 45000 },
    { id: "B0100000102", proveedor: "ARL SALUD", rnc: "103000003", fecha: "2024-09-28", vencimiento: "2024-10-28", total: 18500, pendiente: 18500 },
    { id: "IR-17", proveedor: "OFICINA VIRTUAL DGII", rnc: "401000004", fecha: "2024-09-30", vencimiento: "2024-10-15", total: 9550, pendiente: 9550 },
];

const METODOS = ["Transferencia", "Efectivo", "Cheque", "Tarjeta de Crédito", "Nota de Crédito"];
const BANCOS = ["Banco Popular", "Banreservas", "BHD", "Scotiabank", "Caja Chica"];

function EgresoBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const todayISO = new Date().toISOString().split("T")[0];

    const [invoices, setInvoices] = useState<{ id: string, pendiente: number, aplicar: number }[]>([]);
    const [proveedorId, setProveedorId] = useState("");
    const [fecha, setFecha] = useState(todayISO);
    const [banco, setBanco] = useState("");
    const [metodo, setMetodo] = useState("");
    const [referencia, setReferencia] = useState("");
    const [notas, setNotas] = useState("");

    // Automatically load invoices when a supplier is selected
    useEffect(() => {
        if (proveedorId) {
            const supplierInvoices = MOCK_INVOICES.filter(i => i.rnc === proveedorId);
            setInvoices(supplierInvoices.map(i => ({ id: i.id, pendiente: i.pendiente, aplicar: 0 })));
        } else {
            setInvoices([]);
        }
    }, [proveedorId]);

    const totalAbonado = invoices.reduce((acc, inv) => acc + (Number(inv.aplicar) || 0), 0);

    const handleApplyChange = (id: string, value: string) => {
        const numVal = parseFloat(value) || 0;
        setInvoices(prev => prev.map(inv => {
            if (inv.id === id) {
                // Ensure applied amount does not exceed pending amount
                const safeVal = Math.min(numVal, inv.pendiente);
                return { ...inv, aplicar: safeVal };
            }
            return inv;
        }));
    };

    const handleApplyAll = (id: string) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === id) {
                return { ...inv, aplicar: inv.pendiente };
            }
            return inv;
        }));
    };

    const handleSave = () => {
        const validInvoices = invoices.filter(i => i.aplicar > 0);
        if (validInvoices.length === 0) {
            alert("Debe aplicar al menos un monto a una factura.");
            return;
        }

        const proveedorName = MOCK_INVOICES.find(i => i.rnc === proveedorId)?.proveedor || "Desconocido";

        // In a real app, this creates one payment receipt (Egreso) linked to multiple invoices.
        // For the mock, we just generate one entry representing this global payment.
        const egresoReceipt = {
            id: `PGE-${Date.now()}`,
            fecha,
            proveedor: proveedorName,
            factura: validInvoices.map(i => i.id).join(", "),
            metodo,
            referencia,
            banco,
            monto: totalAbonado,
            notas,
            status: "confirmado"
        };

        const existingRaw = localStorage.getItem('pagos_proveedores') || '[]';
        let existing = [];
        try { existing = JSON.parse(existingRaw); } catch { }
        existing.unshift(egresoReceipt);
        localStorage.setItem('pagos_proveedores', JSON.stringify(existing));

        router.push('/dashboard/gastos/pagos');
    };

    // Filter unique suppliers for the dropdown
    const uniqueSuppliers = Array.from(new Map(MOCK_INVOICES.map(item => [item.rnc, item])).values());


    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* Header */}
            <div className="bg-background border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/gastos/pagos')}
                        className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            Registrar Pago a Proveedor
                        </h1>
                        <p className="text-sm text-muted-foreground">Emite un comprobante de egreso para abonar o saldar facturas.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => router.push('/dashboard/gastos/pagos')}>
                        <X className="w-4 h-4" /> Cancelar
                    </Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                        onClick={handleSave}
                        disabled={totalAbonado <= 0 || !proveedorId || !banco || !metodo}
                    >
                        <Save className="w-4 h-4" /> Guardar Pago
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-3 gap-8">
                {/* Left Column: Form Details */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
                        <h3 className="font-semibold text-base border-b pb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                            Detalles del Egreso
                        </h3>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Proveedor *</Label>
                            <Select value={proveedorId} onValueChange={setProveedorId}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Selecciona un proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueSuppliers.map(s => (
                                        <SelectItem key={s.rnc} value={s.rnc}>{s.proveedor}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha del Pago *</Label>
                            <Input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="h-10" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Cuenta Bancaria *</Label>
                            <Select value={banco} onValueChange={setBanco}>
                                <SelectTrigger className="h-10"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                                <SelectContent>
                                    {BANCOS.map(b => (
                                        <SelectItem key={b} value={b}>{b}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Método de Pago *</Label>
                            <Select value={metodo} onValueChange={setMetodo}>
                                <SelectTrigger className="h-10"><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                                <SelectContent>
                                    {METODOS.map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Referencia / Cheque</Label>
                            <Input placeholder="# Transferencia o cheque" value={referencia} onChange={e => setReferencia(e.target.value)} className="h-10" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Notas Adicionales</Label>
                            <textarea
                                className="w-full text-sm min-h-[80px] resize-none bg-muted/10 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                placeholder="Observaciones internas..."
                                value={notas}
                                onChange={e => setNotas(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Invoices to Pay */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-emerald-600" />
                                Facturas Pendientes (CXP)
                            </h3>
                            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full font-bold text-lg border border-emerald-200 shadow-sm">
                                Total: RD$ {totalAbonado.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                        {!proveedorId ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <h4 className="font-semibold text-muted-foreground">Ningún proveedor seleccionado</h4>
                                <p className="text-sm text-muted-foreground mt-1 max-w-sm">Selecciona un proveedor en el panel izquierdo para ver sus facturas por pagar (CXP).</p>
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-3" />
                                <h4 className="font-semibold text-muted-foreground">Sin deudas</h4>
                                <p className="text-sm text-muted-foreground mt-1">Este proveedor no tiene facturas pendientes de pago.</p>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <div className="border rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                                            <tr>
                                                <th className="px-4 py-3">Factura</th>
                                                <th className="px-4 py-3 text-right">Monto Original</th>
                                                <th className="px-4 py-3 text-right">Pendiente</th>
                                                <th className="px-4 py-3 w-[180px]">Monto a Pagar</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {invoices.map((inv) => {
                                                const originalInvoice = MOCK_INVOICES.find(i => i.id === inv.id);
                                                return (
                                                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="font-mono font-medium text-primary">{inv.id}</div>
                                                            <div className="text-[10px] text-muted-foreground mt-0.5">Vence: {originalInvoice?.vencimiento}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                                                            {originalInvoice?.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold tabular-nums">
                                                            {inv.pendiente.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="relative flex-1">
                                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RD$</span>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-9 pl-9 text-right font-bold text-emerald-700 bg-white"
                                                                        value={inv.aplicar || ''}
                                                                        onChange={e => handleApplyChange(inv.id, e.target.value)}
                                                                        placeholder="0.00"
                                                                        min="0"
                                                                        max={inv.pendiente}
                                                                    />
                                                                </div>
                                                                <button
                                                                    title="Pagar monto completo"
                                                                    onClick={() => handleApplyAll(inv.id)}
                                                                    className="p-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100 hover:bg-emerald-200 rounded shrink-0 transition-colors"
                                                                >
                                                                    MAX
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense layer
export default function NewPagosProveedorPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[50vh]"><div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />Cargando...</div>}>
            <EgresoBuilderContent />
        </Suspense>
    );
}
