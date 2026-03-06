"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, Check, Save, Search, Receipt, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { companyStorage } from "@/lib/company-storage";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function fmt(n: number) {
    return n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function NuevoPagoInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const invoiceId = searchParams?.get("invoiceId");
    const todayISO = new Date().toISOString().split("T")[0];

    const [clients, setClients] = useState<any[]>([]);
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

    const [documentId, setDocumentId] = useState(`RC-${Date.now().toString().slice(-4)}`);
    const [date, setDate] = useState(todayISO);
    const [clientSearch, setClientSearch] = useState("");
    const [clientOpen, setClientOpen] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("Transferencia");
    const [bankAccount, setBankAccount] = useState("");
    const [reference, setReference] = useState("");
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(false);
    const [amountsToPay, setAmountsToPay] = useState<Record<string, number>>({});
    const [withholdings, setWithholdings] = useState<Record<string, number>>({});

    // Load data from localStorage
    useEffect(() => {
        try {
            const raw = companyStorage.get("clientes");
            setClients(raw ? JSON.parse(raw) : []);
        } catch { }
        try {
            const raw = companyStorage.get("bancos");
            setBankAccounts(raw ? JSON.parse(raw) : []);
        } catch { }
    }, []);

    // Load pending invoices for client, or a specific invoice
    useEffect(() => {
        try {
            const raw = companyStorage.get("invoice_emitted");
            const allInvoices: any[] = raw ? JSON.parse(raw) : [];
            const today = new Date().toISOString().split("T")[0];

            if (invoiceId) {
                // Came from a specific invoice → pre-load that invoice and its client
                const inv = allInvoices.find((i: any) => i.id === invoiceId);
                if (inv) {
                    const fakeClient = { id: inv.clientId || inv.id, name: inv.cliente, rnc: inv.rnc || "" };
                    setClient(fakeClient);
                    setClientSearch(inv.cliente);
                    const balance = inv.total || 0;
                    setPendingInvoices([{
                        id: inv.id,
                        ecf: inv.ecf || inv.id,
                        date: inv.date,
                        total: balance,
                        paid: 0,
                        balance,
                        isOverdue: inv.vencimiento && inv.vencimiento < today,
                    }]);
                }
            }
        } catch { }
    }, [invoiceId]);

    // When a client is selected, load their pending invoices
    useEffect(() => {
        if (!client || invoiceId) return;
        try {
            const raw = companyStorage.get("invoice_emitted");
            const allInvoices: any[] = raw ? JSON.parse(raw) : [];
            const today = new Date().toISOString().split("T")[0];
            const pending = allInvoices.filter((inv: any) => {
                if (inv.isDraft || inv.paymentStatus === "pagada") return false;
                return (
                    inv.clientId === client.id ||
                    inv.rnc === client.rnc ||
                    (inv.cliente || "").toLowerCase() === (client.name || "").toLowerCase()
                );
            }).map((inv: any) => ({
                id: inv.id,
                ecf: inv.ecf || inv.id,
                date: inv.date,
                total: inv.total || 0,
                paid: 0,
                balance: inv.total || 0,
                isOverdue: inv.vencimiento && inv.vencimiento < today,
            }));
            setPendingInvoices(pending);
        } catch { }
    }, [client, invoiceId]);

    const filteredClients = clients.filter(c =>
        (c.nombre || c.name || "").toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.comercialName || "").toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.rnc || "").includes(clientSearch)
    );

    const handleAmountChange = (invId: string, val: number, maxAmount: number) =>
        setAmountsToPay(prev => ({ ...prev, [invId]: Math.min(Math.max(0, val), maxAmount) }));

    const handleWithholdingChange = (invId: string, val: number, maxAmount: number) =>
        setWithholdings(prev => ({ ...prev, [invId]: Math.min(Math.max(0, val), maxAmount) }));

    const toggleFullPayment = (inv: any) => {
        const current = amountsToPay[inv.id] || 0;
        if (current === inv.balance) {
            handleAmountChange(inv.id, 0, inv.balance);
        } else {
            handleAmountChange(inv.id, inv.balance - (withholdings[inv.id] || 0), inv.balance);
        }
    };

    const totalPaid = Object.values(amountsToPay).reduce((a, b) => a + (b || 0), 0);
    const totalWithheld = Object.values(withholdings).reduce((a, b) => a + (b || 0), 0);
    const totalApplied = totalPaid + totalWithheld;

    const handleSave = () => {
        if (totalApplied === 0 || !client) return;

        try {
            // 1) Save payment record
            const pagosRaw = companyStorage.get("pagos_recibidos");
            const pagos: any[] = pagosRaw ? JSON.parse(pagosRaw) : [];
            const newPago = {
                id: documentId,
                fecha: date,
                cliente: client.name || client.nombre,
                rnc: client.rnc || "",
                metodo: paymentMethod,
                cuenta: bankAccount,
                referencia: reference,
                notas: notes,
                monto: totalPaid,
                retencion: totalWithheld,
                total: totalApplied,
                facturas: Object.entries(amountsToPay)
                    .filter(([, amt]) => amt > 0)
                    .map(([invId, amt]) => ({ factura: invId, monto: amt, retencion: withholdings[invId] || 0 })),
            };
            pagos.unshift(newPago);
            companyStorage.set("pagos_recibidos", JSON.stringify(pagos));

            // 2) Mark invoices as "pagada" if fully covered
            const invRaw = companyStorage.get("invoice_emitted");
            const invoices: any[] = invRaw ? JSON.parse(invRaw) : [];
            const updated = invoices.map((inv: any) => {
                const paying = amountsToPay[inv.id] || 0;
                const holding = withholdings[inv.id] || 0;
                if (paying + holding === 0) return inv;
                const total = paying + holding;
                const newPaymentStatus = total >= inv.total ? "pagada" : "parcial";
                return { ...inv, paymentStatus: newPaymentStatus };
            });
            companyStorage.set("invoice_emitted", JSON.stringify(updated));

            toast.success("Recibo registrado exitosamente", {
                description: `RD$ ${fmt(totalPaid)} aplicado · ${Object.keys(amountsToPay).filter(k => amountsToPay[k] > 0).length} factura(s)`,
            });
            setSaved(true);
            setTimeout(() => router.push("/dashboard/ingresos/pagos"), 1500);
        } catch (e) {
            console.error(e);
            toast.error("Error al guardar el recibo");
        }
    };

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500 bg-muted/20 text-sm">
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-5 py-3.5 shadow-2xl">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div><p className="font-bold text-sm">Recibo de Ingreso Registrado</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/ingresos/pagos">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <h1 className="text-base font-bold">Registrar Recibo de Ingreso (Cobro)</h1>
                    </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">{documentId}</Badge>
            </div>

            {/* Main Form */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {/* Top Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b divide-x">
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold border-b pb-2">Información del Cliente y Recibo</h3>
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Cliente *</Label>
                                <Popover open={clientOpen} onOpenChange={setClientOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input
                                                value={client ? (client.comercialName || client.nombre || client.name) : clientSearch}
                                                onChange={e => { setClientSearch(e.target.value); setClient(null); setPendingInvoices([]); }}
                                                onFocus={() => setClientOpen(true)}
                                                placeholder="Buscar cliente por nombre o RNC..."
                                                className="h-10 pr-10"
                                                readOnly={!!invoiceId && !!client}
                                            />
                                            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                    {!invoiceId && (
                                        <PopoverContent align="start" className="w-[360px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar cliente..." value={clientSearch} onValueChange={setClientSearch} />
                                                <CommandList>
                                                    <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredClients.slice(0, 10).map(c => (
                                                            <CommandItem key={c.id} onSelect={() => { setClient(c); setClientOpen(false); }} className="flex flex-col items-start cursor-pointer py-2">
                                                                <span className="font-medium">{c.comercialName || c.nombre || c.name}</span>
                                                                <span className="text-xs text-muted-foreground">RNC/Cédula: {c.rnc}</span>
                                                            </CommandItem>
                                                        ))}
                                                        {filteredClients.length === 0 && clients.length === 0 && (
                                                            <CommandItem>No hay clientes registrados. Crea uno desde Clientes.</CommandItem>
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    )}
                                </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha del Pago *</Label>
                                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">N° de Recibo</Label>
                                    <Input value={documentId} onChange={e => setDocumentId(e.target.value)} className="h-10 font-mono font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 bg-muted/5">
                            <h3 className="font-bold border-b pb-2">Detalles Monetarios</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Método de Pago *</Label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                                            <SelectItem value="Tarjeta">Tarjeta de Crédito</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Cuenta Destino</Label>
                                    <Select value={bankAccount} onValueChange={setBankAccount}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccione cuenta..." /></SelectTrigger>
                                        <SelectContent>
                                            {bankAccounts.length > 0
                                                ? bankAccounts.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.banco} — {b.tipo}</SelectItem>)
                                                : <SelectItem value="caja">Caja General (Efectivo)</SelectItem>
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Referencia (Cheque / Transf.)</Label>
                                <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="Ej. Depósito #123456" className="h-10" />
                            </div>
                            <div className="flex bg-emerald-50 border border-emerald-200 p-3 rounded-lg items-center justify-between">
                                <span className="font-semibold text-emerald-800">Total Recibido</span>
                                <span className="text-xl font-mono font-bold text-emerald-700">RD$ {fmt(totalPaid)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Invoices Grid */}
                    <div className="p-0">
                        {client ? (
                            pendingInvoices.length === 0 ? (
                                <div className="py-16 text-center text-muted-foreground border-y border-dashed border-border/60 mx-6 my-6 bg-muted/10 rounded-xl">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-emerald-500 opacity-40" />
                                    <p className="font-semibold">Este cliente no tiene facturas pendientes.</p>
                                    <p className="text-xs mt-1 text-muted-foreground">Todas las facturas están pagadas.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-secondary/30 border-b border-t text-xs text-muted-foreground font-semibold text-left uppercase tracking-wide">
                                            <th className="py-3 px-4 w-12 text-center"></th>
                                            <th className="py-3 px-3">e-CF / Factura</th>
                                            <th className="py-3 px-3">Fecha</th>
                                            <th className="py-3 px-3 text-right">Total Factura</th>
                                            <th className="py-3 px-3 text-right">Balance</th>
                                            <th className="py-3 px-3 text-right text-amber-600 bg-amber-500/5">Retención (ISR/ITBIS)</th>
                                            <th className="py-3 px-3 text-right text-emerald-700 bg-emerald-500/10">Monto A Pagar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingInvoices.map((inv) => {
                                            const currentPay = amountsToPay[inv.id] || 0;
                                            const currentWithholding = withholdings[inv.id] || 0;
                                            const totalApplying = currentPay + currentWithholding;
                                            const isFullyPaid = totalApplying >= inv.balance && inv.balance > 0;
                                            return (
                                                <tr key={inv.id} className={cn("border-b border-border/60 hover:bg-muted/30 transition-colors", currentPay > 0 && "bg-primary/[0.02]")}>
                                                    <td className="py-3 px-4 text-center">
                                                        <button onClick={() => toggleFullPayment(inv)} className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", isFullyPaid ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40")}>
                                                            {isFullyPaid && <Check className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <p className="font-mono font-bold text-primary">{inv.ecf}</p>
                                                        {inv.isOverdue && <Badge variant="outline" className="text-[9px] text-rose-600 border-rose-500/30 bg-rose-50 mt-0.5">VENCIDA</Badge>}
                                                    </td>
                                                    <td className="py-3 px-3 text-muted-foreground">{inv.date}</td>
                                                    <td className="py-3 px-3 text-right tabular-nums">RD$ {fmt(inv.total)}</td>
                                                    <td className="py-3 px-3 text-right tabular-nums font-semibold">RD$ {fmt(inv.balance)}</td>
                                                    <td className="py-3 px-3 bg-amber-500/5 w-32">
                                                        <Input type="number" value={currentWithholding || ""} onChange={e => handleWithholdingChange(inv.id, parseFloat(e.target.value) || 0, inv.balance)} className="h-8 text-right font-mono text-amber-600 border-amber-500/30 w-full" placeholder="0.00" />
                                                    </td>
                                                    <td className="py-3 px-3 bg-emerald-500/5 w-40">
                                                        <Input type="number" value={currentPay || ""} onChange={e => handleAmountChange(inv.id, parseFloat(e.target.value) || 0, inv.balance - currentWithholding)} className="h-8 text-right font-mono font-bold text-emerald-700 border-emerald-200 bg-white shadow-sm w-full" placeholder="0.00" />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )
                        ) : (
                            <div className="py-16 text-center text-muted-foreground border-y border-dashed border-border/60 mx-6 my-6 bg-muted/10 rounded-xl">
                                <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                <p>Selecciona un cliente para visualizar las facturas pendientes de cobro.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider block">Observaciones del Recibo</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Información adicional, detalles de retención..." className="min-h-[80px] bg-muted/10 text-sm" />
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-4 flex items-center justify-between z-20">
                <Link href="/dashboard/ingresos/pagos"><Button variant="ghost">Cancelar</Button></Link>
                <div className="flex gap-3">
                    <Button
                        className={cn("text-white gap-2 shadow-lg transition-all", totalApplied > 0 && client ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30" : "bg-muted-foreground")}
                        disabled={totalApplied === 0 || !client}
                        onClick={handleSave}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Finalizar Recibo de Ingreso
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function NuevoPagoRecibidoPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando formulario...</div>}>
            <NuevoPagoInner />
        </Suspense>
    );
}
