"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Calendar, CheckCircle2, Clock, DollarSign, Download, Plus, RefreshCw, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "FCR-001", cliente: "CLARO", concepto: "Soporte IT Mensual", frecuencia: "Mensual", proximo: "01 Nov 2024", monto: 45000, status: "activa" },
    { id: "FCR-002", cliente: "BANRESERVAS", concepto: "Consultoría Contable", frecuencia: "Mensual", proximo: "01 Nov 2024", monto: 30000, status: "activa" },
    { id: "FCR-003", cliente: "ALTICE", concepto: "Mantenimiento Servidor", frecuencia: "Trimestral", proximo: "15 Dic 2024", monto: 95000, status: "pausada" },
];

export default function FacturasRecurrentesPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Facturas Recurrentes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Automatiza la emisión de facturas periódicas a tus clientes.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Recurrencia</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Activas", value: DATA.filter(d => d.status === 'activa').length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Pausadas", value: DATA.filter(d => d.status === 'pausada').length, icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Ingreso Mensual Est.", value: `RD$ ${DATA.filter(d => d.status === 'activa').reduce((a, d) => a + d.monto, 0).toLocaleString()}`, icon: DollarSign, color: "text-blue-600 bg-blue-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow><TableHead>ID</TableHead><TableHead>Cliente</TableHead><TableHead>Concepto</TableHead><TableHead>Frecuencia</TableHead><TableHead>Próxima Emisión</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Estado</TableHead><TableHead></TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {DATA.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono text-sm">{d.id}</TableCell>
                                        <TableCell className="font-semibold">{d.cliente}</TableCell>
                                        <TableCell className="text-muted-foreground">{d.concepto}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{d.frecuencia}</Badge></TableCell>
                                        <TableCell className="text-sm"><Calendar className="inline w-3.5 h-3.5 mr-1.5 text-muted-foreground" />{d.proximo}</TableCell>
                                        <TableCell className="text-right font-bold">RD$ {d.monto.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", d.status === 'activa' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>{d.status}</Badge></TableCell>
                                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="w-4 h-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
