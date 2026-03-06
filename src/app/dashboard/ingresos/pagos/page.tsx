"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    PlusIcon, MagnifyingGlassIcon, BanknotesIcon, CheckCircleIcon,
    EllipsisHorizontalIcon, TrashIcon, EyeIcon, CreditCardIcon, WalletIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_pagos_recibidos";

type Pago = {
    id: string; fecha: string; cliente: string; facturaRef: string;
    metodo: string; monto: number; moneda: string; notas: string;
};

const SAMPLE: Pago[] = [
    { id: "1", fecha: "2025-03-05", cliente: "CLARO", facturaRef: "E310000000047", metodo: "Transferencia", monto: 885000, moneda: "DOP", notas: "" },
    { id: "2", fecha: "2025-03-03", cliente: "ALTICE", facturaRef: "E310000000046", metodo: "Cheque", monto: 448400, moneda: "DOP", notas: "Cheque #10234" },
    { id: "3", fecha: "2025-03-01", cliente: "Joey Mantia", facturaRef: "E310000000044", metodo: "Efectivo", monto: 12500, moneda: "DOP", notas: "" },
];

const METODOS = ["Efectivo", "Transferencia Bancaria", "Cheque", "Tarjeta de Crédito/Débito", "Depósito Bancario", "PayPal", "Otro"];
const EMPTY_FORM = { fecha: new Date().toISOString().split("T")[0], cliente: "", facturaRef: "", metodo: "Transferencia Bancaria", monto: "", moneda: "DOP", notas: "" };

export default function PagosRecibidosPage() {
    const [list, setList] = useState<Pago[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saved, setSaved] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_KEY);
            setList(raw ? JSON.parse(raw) : SAMPLE);
            const inv = JSON.parse(companyStorage.get("invoice_emitted") || "[]");
            setInvoices(inv.filter((i: any) => i.paymentStatus !== "pagado"));
        } catch { setList(SAMPLE); }
    }, []);

    const save = (data: Pago[]) => { setList(data); try { companyStorage.set(LS_KEY, JSON.stringify(data)); } catch { } };
    const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleAdd = () => {
        if (!form.cliente || !form.monto) return;
        const newPago: Pago = { id: Date.now().toString(), fecha: form.fecha, cliente: form.cliente, facturaRef: form.facturaRef, metodo: form.metodo, monto: parseFloat(form.monto), moneda: form.moneda, notas: form.notas };

        // Mark invoice as paid if referenced
        if (form.facturaRef) {
            try {
                const inv = JSON.parse(companyStorage.get("invoice_emitted") || "[]");
                const updated = inv.map((i: any) => i.ncf === form.facturaRef ? { ...i, paymentStatus: "pagado" } : i);
                companyStorage.set("invoice_emitted", JSON.stringify(updated));
            } catch { }
        }
        save([newPago, ...list]);
        setForm(EMPTY_FORM); setSaved(true);
        setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
    };

    const filtered = list.filter(c =>
        c.cliente.toLowerCase().includes(search.toLowerCase()) ||
        c.facturaRef.toLowerCase().includes(search.toLowerCase())
    );

    const totalMes = list.reduce((a, c) => a + c.monto, 0);
    const metodoColors: Record<string, string> = { "Efectivo": "bg-emerald-500/10 text-emerald-600", "Transferencia Bancaria": "bg-blue-500/10 text-blue-600", "Cheque": "bg-violet-500/10 text-violet-600", "Tarjeta de Crédito/Débito": "bg-amber-500/10 text-amber-600" };
    const metodoIcon = (m: string) => m === "Efectivo" ? WalletIcon : m.includes("Tarjeta") ? CreditCardIcon : BanknotesIcon;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pagos Recibidos</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Registra cobros vinculados a facturas emitidas.</p>
                </div>
                <Button className="bg-gradient-brand border-0 text-white gap-2" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" /> Registrar Pago
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { l: "Total Cobrado", v: `RD$ ${totalMes.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`, c: "text-emerald-600 bg-emerald-500/10", i: BanknotesIcon },
                    { l: "Pagos Registrados", v: list.length.toString(), c: "text-blue-600 bg-blue-500/10", i: CheckCircleIcon },
                    { l: "Promedio por Pago", v: list.length ? `RD$ ${(totalMes / list.length).toLocaleString("es-DO", { maximumFractionDigits: 0 })}` : "—", c: "text-violet-600 bg-violet-500/10", i: CreditCardIcon },
                ].map((k, i) => {
                    const Ic = k.i;
                    return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-base font-bold leading-snug">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar cliente o factura..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Factura / Ref.</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead>Notas</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(p => {
                                    const Ic = metodoIcon(p.metodo);
                                    return (
                                        <TableRow key={p.id} className="hover:bg-muted/20 group">
                                            <TableCell className="text-sm text-muted-foreground">{p.fecha}</TableCell>
                                            <TableCell className="font-semibold">{p.cliente}</TableCell>
                                            <TableCell className="font-mono text-xs text-primary">{p.facturaRef || "—"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("text-xs gap-1", metodoColors[p.metodo] || "bg-muted")}>
                                                    <Ic className="w-3 h-3" /> {p.metodo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums font-bold text-emerald-600">
                                                {p.moneda === "USD" ? "US$" : "RD$"} {p.monto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{p.notas || "—"}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                                            <EllipsisHorizontalIcon className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="gap-2 cursor-pointer"><EyeIcon className="w-4 h-4" /> Ver detalle</DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => save(list.filter(x => x.id !== p.id))}>
                                                            <TrashIcon className="w-4 h-4" /> Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No hay pagos registrados.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Registrar Pago Recibido</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={e => set("fecha")(e.target.value)} /></div>
                            <div className="space-y-2">
                                <Label>Moneda</Label>
                                <Select value={form.moneda} onValueChange={set("moneda")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="DOP">DOP – Peso</SelectItem><SelectItem value="USD">USD – Dólar</SelectItem><SelectItem value="EUR">EUR – Euro</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Cliente *</Label><Input placeholder="Nombre del cliente" value={form.cliente} onChange={e => set("cliente")(e.target.value)} /></div>
                        <div className="space-y-2">
                            <Label>Factura Referenciada</Label>
                            {invoices.length > 0 ? (
                                <Select value={form.facturaRef} onValueChange={v => { set("facturaRef")(v); const inv = invoices.find((i: any) => i.ncf === v); if (inv) set("cliente")(inv.clientName || inv.client?.name || form.cliente); }}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar factura pendiente" /></SelectTrigger>
                                    <SelectContent>{invoices.map((i: any) => <SelectItem key={i.id} value={i.ncf}>{i.ncf} — {i.clientName || i.client?.name}</SelectItem>)}</SelectContent>
                                </Select>
                            ) : (
                                <Input placeholder="NCF de la factura" className="font-mono" value={form.facturaRef} onChange={e => set("facturaRef")(e.target.value)} />
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Método de Pago</Label>
                                <Select value={form.metodo} onValueChange={set("metodo")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{METODOS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Monto *</Label><Input type="number" placeholder="0.00" value={form.monto} onChange={e => set("monto")(e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Notas</Label><Input placeholder="Número de cheque, referencia, etc." value={form.notas} onChange={e => set("notas")(e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAdd} className="bg-gradient-brand border-0 text-white" disabled={!form.cliente || !form.monto}>
                            {saved ? <><CheckCircleIcon className="w-4 h-4 mr-2" /> Guardado!</> : <><PlusIcon className="w-4 h-4 mr-2" /> Registrar Pago</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
