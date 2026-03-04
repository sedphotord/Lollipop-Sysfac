"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, ChevronDown, Check, Save, Search, Receipt, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const MOCK_CLIENTS = [
    { id: "CL-01", name: "CLARO DOMINICANA", rnc: "101001577" },
    { id: "CL-02", name: "BANRESERVAS", rnc: "401010062" },
    { id: "CL-03", name: "Pedro Almonte", rnc: "001-XXXX-X" },
];

const MOCK_ACCOUNTS = [
    { id: "1", name: "Banco Popular - Cta. Corriente (078512)" },
    { id: "2", name: "Banco BHD - Cta. Corriente (10293)" },
    { id: "3", name: "Caja General (Efectivo)" },
];

const MOCK_PENDING_INVOICES = [
    { id: "INV-0042", date: "10 Oct 2024", total: 605800, paid: 105800, balance: 500000 },
    { id: "INV-0045", date: "15 Oct 2024", total: 25000, paid: 0, balance: 25000 },
    { id: "INV-0048", date: "22 Oct 2024", total: 120000, paid: 0, balance: 120000 },
];

export default function NuevoPagoRecibidoPage() {
    const todayISO = new Date().toISOString().split("T")[0];

    const [documentId, setDocumentId] = useState("RC-0050");
    const [date, setDate] = useState(todayISO);
    const [clientSearch, setClientSearch] = useState("");
    const [clientOpen, setClientOpen] = useState(false);
    const [client, setClient] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("Transferencia");
    const [bankAccount, setBankAccount] = useState("");
    const [reference, setReference] = useState("");
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(false);

    // State for distributing the payment across invoices
    const [amountsToPay, setAmountsToPay] = useState<Record<string, number>>({});
    const [withholdings, setWithholdings] = useState<Record<string, number>>({});

    const handleAmountChange = (invId: string, val: number, maxAmount: number) => {
        setAmountsToPay(prev => ({ ...prev, [invId]: Math.min(Math.max(0, val), maxAmount) }));
    };

    const handleWithholdingChange = (invId: string, val: number, maxAmount: number) => {
        setWithholdings(prev => ({ ...prev, [invId]: Math.min(Math.max(0, val), maxAmount) }));
    };

    const toggleFullPayment = (inv: typeof MOCK_PENDING_INVOICES[0]) => {
        const current = amountsToPay[inv.id] || 0;
        if (current === inv.balance) {
            handleAmountChange(inv.id, 0, inv.balance);
        } else {
            handleAmountChange(inv.id, inv.balance - (withholdings[inv.id] || 0), inv.balance);
        }
    };

    const filteredClients = MOCK_CLIENTS.filter(s =>
        s.name.toLowerCase().includes(clientSearch.toLowerCase()) || s.rnc.includes(clientSearch)
    );

    const totalPaid = Object.values(amountsToPay).reduce((a, b) => a + (b || 0), 0);
    const totalWithheld = Object.values(withholdings).reduce((a, b) => a + (b || 0), 0);
    const totalApplied = totalPaid + totalWithheld;

    const handleSave = () => {
        if (totalApplied === 0 || !client) return;
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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
                                            <Input value={client ? client.name : clientSearch} onChange={e => { setClientSearch(e.target.value); setClient(null); }} onFocus={() => setClientOpen(true)} placeholder="Buscar cliente por nombre o RNC..." className="h-10 pr-10" />
                                            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-[360px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar cliente..." value={clientSearch} onValueChange={setClientSearch} />
                                            <CommandList>
                                                <CommandGroup>
                                                    {filteredClients.map(c => (
                                                        <CommandItem key={c.id} onSelect={() => { setClient(c); setClientOpen(false); }} className="flex flex-col items-start cursor-pointer py-2">
                                                            <span className="font-medium">{c.name}</span>
                                                            <span className="text-xs text-muted-foreground">RNC/Cédula: {c.rnc}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha del Pago *</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10" /></div>
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
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Cuenta Destino *</Label>
                                    <Select value={bankAccount} onValueChange={setBankAccount}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Seleccione cuenta..." /></SelectTrigger>
                                        <SelectContent>
                                            {MOCK_ACCOUNTS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Referencia (Cheque / Tranf.)</Label>
                                <Input value={reference} onChange={e => setReference(e.target.value)} placeholder="Ej. Depósito #123456" className="h-10" />
                            </div>
                            <div className="flex bg-emerald-50 border border-emerald-200 p-3 rounded-lg items-center justify-between">
                                <span className="font-semibold text-emerald-800">Total Recibido</span>
                                <span className="text-xl font-mono font-bold text-emerald-700">RD$ {totalPaid.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Invoices Grid */}
                    <div className="p-0">
                        {client ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-secondary/30 border-b border-t text-xs text-muted-foreground font-semibold text-left uppercase tracking-wide">
                                        <th className="py-3 px-4 w-12 text-center"></th>
                                        <th className="py-3 px-3">Factura</th>
                                        <th className="py-3 px-3">Fecha</th>
                                        <th className="py-3 px-3 text-right">Total Factura</th>
                                        <th className="py-3 px-3 text-right">Monto Pendiente</th>
                                        <th className="py-3 px-3 text-right text-amber-600 bg-amber-500/5">Retención (ISR/ITBIS)</th>
                                        <th className="py-3 px-3 text-right text-emerald-700 bg-emerald-500/10">Monto A Pagar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_PENDING_INVOICES.map((inv) => {
                                        const currentPay = amountsToPay[inv.id] || 0;
                                        const currentWithholding = withholdings[inv.id] || 0;
                                        const totalApplying = currentPay + currentWithholding;
                                        const isFullyPaid = totalApplying === inv.balance;

                                        return (
                                            <tr key={inv.id} className={cn("border-b border-border/60 hover:bg-muted/30 transition-colors", currentPay > 0 && "bg-primary/[0.02]")}>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => toggleFullPayment(inv)} className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", isFullyPaid ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40")}>
                                                        {isFullyPaid && <Check className="w-3.5 h-3.5" />}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-3 font-mono font-bold text-primary">{inv.id}</td>
                                                <td className="py-3 px-3 text-muted-foreground">{inv.date}</td>
                                                <td className="py-3 px-3 text-right tabular-nums">RD$ {inv.total.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right tabular-nums font-semibold">RD$ {inv.balance.toLocaleString()}</td>
                                                <td className="py-3 px-3 bg-amber-500/5 w-32">
                                                    <Input
                                                        type="number"
                                                        value={currentWithholding || ""}
                                                        onChange={e => handleWithholdingChange(inv.id, parseFloat(e.target.value) || 0, inv.balance)}
                                                        className="h-8 text-right font-mono text-amber-600 border-amber-500/30 w-full"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="py-3 px-3 bg-emerald-500/5 w-40">
                                                    <Input
                                                        type="number"
                                                        value={currentPay || ""}
                                                        onChange={e => handleAmountChange(inv.id, parseFloat(e.target.value) || 0, inv.balance - currentWithholding)}
                                                        className="h-8 text-right font-mono font-bold text-emerald-700 border-emerald-200 bg-white shadow-sm w-full"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-16 text-center text-muted-foreground border-y border-dashed border-border/60 mx-6 my-6 bg-muted/10 rounded-xl">
                                <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                <p>Selecciona un cliente para visualizar las facturas pendientes de cobro.</p>
                            </div>
                        )}
                    </div>

                    {/* Totals & Footer */}
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
