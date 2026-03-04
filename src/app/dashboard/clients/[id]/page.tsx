"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Building2, Calendar, Check, CheckCircle2, Clock,
    CreditCard, DollarSign, Edit, ExternalLink, FileText, Mail,
    MapPin, MoreVertical, Phone, Plus, Receipt, RefreshCw,
    Send, ShieldCheck, TrendingDown, TrendingUp, User2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CLIENT = {
    id: "1",
    name: "COMPAÑIA DOMINICANA DE TELEFONOS, S.A.",
    comercialName: "CLARO",
    rnc: "101010101",
    type: "SRL",
    regime: "Ordinario",
    status: "Activo",
    actividadEconomica: "Telecomunicaciones",
    direccion: "Av. Abraham Lincoln #1010, Piantini, Santo Domingo, D.N.",
    telefono: "809-220-1111",
    email: "cuentaspagar@claro.com.do",
    contacto: "María García — Depto. Cuentas por Pagar",
    fechaRegistro: "15 Ene 2023",
    condicionPago: "Crédito 30 días",
    limiteCredito: 500000,
};

const INVOICES_HISTORY = [
    { id: "INV-2024-0042", ecf: "E3100000006", date: "20 Oct 2024", total: 605800, status: "accepted", condicion: "30 días" },
    { id: "INV-2024-0038", ecf: "E3100000005", date: "15 Sep 2024", total: 125000, status: "accepted", condicion: "30 días" },
    { id: "INV-2024-0030", ecf: "E3100000004", date: "10 Ago 2024", total: 95000, status: "accepted", condicion: "30 días" },
    { id: "INV-2024-0022", ecf: "E3100000003", date: "01 Jul 2024", total: 250000, status: "accepted", condicion: "Contado" },
    { id: "INV-2024-0015", ecf: "E3100000002", date: "20 May 2024", total: 45000, status: "accepted", condicion: "30 días" },
];

const STATUS_COLORS: Record<string, string> = {
    accepted: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    pending: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    rejected: "text-red-500 bg-red-500/10 border-red-500/30",
};

export default function ClientProfilePage() {
    const c = CLIENT;
    const totalFacturado = INVOICES_HISTORY.reduce((a, i) => a + i.total, 0);
    const facturasCount = INVOICES_HISTORY.length;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/clients">
                        <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-blue-600/5 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                            {c.name.substring(0, 2)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {c.comercialName || c.name}
                                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs py-0 gap-1"><CheckCircle2 className="w-3 h-3" /> {c.status}</Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground">{c.name} · <span className="font-mono">{c.rnc}</span></p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
                    <Link href="/dashboard/invoices/new">
                        <Button size="sm" className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Factura</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Facturado", value: `RD$ ${totalFacturado.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Facturas Emitidas", value: facturasCount.toString(), icon: Receipt, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Saldo Pendiente", value: "RD$ 605,800.00", icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Prom. Días Cobro", value: "28 días", icon: Calendar, color: "text-violet-600 bg-violet-500/10" },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", kpi.color)}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                                <p className="text-lg font-bold tracking-tight">{kpi.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Client Info */}
                <div className="space-y-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { icon: Building2, label: "Tipo", value: c.type },
                                { icon: ShieldCheck, label: "RNC", value: c.rnc },
                                { icon: Receipt, label: "Régimen", value: c.regime },
                                { icon: FileText, label: "Actividad", value: c.actividadEconomica },
                                { icon: CreditCard, label: "Condición Pago", value: c.condicionPago },
                                { icon: DollarSign, label: "Límite Crédito", value: `RD$ ${c.limiteCredito.toLocaleString()}` },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground min-w-[110px]">{item.label}</span>
                                    <span className="font-medium">{item.value}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{c.direccion}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">{c.telefono}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">{c.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <User2 className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">{c.contacto}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DGII Verification */}
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-emerald-500/10 flex items-center gap-2 text-emerald-600">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-bold text-sm">Verificado en DGII</span>
                        </div>
                        <CardContent className="p-5 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Estado DGII</span><Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs">Activo</Badge></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Última consulta</span><span className="text-xs text-muted-foreground">Hoy, 10:00 AM</span></div>
                            <Separator />
                            <Button variant="ghost" size="sm" className="w-full text-xs"><RefreshCw className="w-3.5 h-3.5 mr-2" /> Verificar nuevamente</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Invoices History */}
                <div className="lg:col-span-2">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Historial de Facturas</CardTitle>
                            <Link href="/dashboard/invoices/new">
                                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Nueva Factura</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>No. Factura</TableHead>
                                            <TableHead>e-CF</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Condición</TableHead>
                                            <TableHead className="w-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {INVOICES_HISTORY.map((inv) => (
                                            <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                                                <TableCell className="font-semibold">{inv.id}</TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{inv.ecf}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">RD$ {inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-xs", STATUS_COLORS[inv.status])}>
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Aceptado
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{inv.condicion}</TableCell>
                                                <TableCell>
                                                    <Link href={`/dashboard/invoices/${inv.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="w-4 h-4" /></Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Summary Footer */}
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 rounded-lg p-4">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando <span className="font-semibold text-foreground">{facturasCount}</span> facturas
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Total Facturado: </span>
                                        <span className="font-bold text-foreground">RD$ {totalFacturado.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-semibold">+32% vs año anterior</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
