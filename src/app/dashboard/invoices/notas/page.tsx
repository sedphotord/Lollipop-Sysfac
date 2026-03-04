"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, FileText, Download, Plus, Search, Calendar, FileBox } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NOTAS = [
    { id: "NC-2024-0012", ecf: "E3300000012", cliente: "GRUPO SALCEDO SRL", rnc: "123456789", origen: "E3100000101", fecha: "29 Oct 2024", monto: 5000, tipo: "B04", estado: "aceptado" },
    { id: "NC-2024-0011", ecf: "E3300000011", cliente: "Juan Pérez", rnc: "00114356789", origen: "E3200000050", fecha: "20 Oct 2024", monto: 1250, tipo: "B04", estado: "aceptado" },
    { id: "NC-2024-0010", ecf: "E3300000010", cliente: "Ferretería Popular", rnc: "101010101", origen: "E3100000088", fecha: "15 Oct 2024", monto: 15600, tipo: "B04", estado: "rechazado" },
];

const ESTADO_MAP: Record<string, { label: string; color: string }> = {
    aceptado: { label: "Aceptado", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" },
    rechazado: { label: "Rechazado DGII", color: "text-red-500 bg-red-500/10 border-red-500/30" },
    borrador: { label: "Borrador", color: "text-muted-foreground bg-muted border-border" }
};

export default function NotasCreditoPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notas de Crédito y Débito</h2>
                    <p className="text-muted-foreground text-sm">Aplica devoluciones y ajustes a facturas ya emitidas (e-CF B04, B03).</p>
                </div>
                <Button className="bg-gradient-brand text-white border-0 shadow-lg shadow-purple-500/20">
                    <Plus className="w-4 h-4 mr-2" /> Emitir Nota de Crédito
                </Button>
            </div>

            {/* Quick Actions / Creador */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row gap-6 items-center">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 hidden md:flex">
                        <ArrowDownLeft className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <h3 className="font-bold text-lg">¿Necesitas anular o modificar una factura?</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Busca la Factura (NCF/e-CF) original..." className="pl-9 h-10 w-full" />
                            </div>
                            <Button variant="secondary" className="h-10">Buscar Factura</Button>
                        </div>
                    </div>
                    <div className="flex-1 md:border-l md:pl-6 space-y-2 w-full">
                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Tipos de NCF Admitidos</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Badge variant="outline" className="w-full justify-center bg-muted/50">B04 - Nota de Crédito</Badge>
                            <Badge variant="outline" className="w-full justify-center bg-muted/50">B03 - Nota de Débito</Badge>
                            <Badge variant="outline" className="w-full justify-center bg-muted/50">E34 - e-CF Crédito</Badge>
                            <Badge variant="outline" className="w-full justify-center bg-muted/50">E33 - e-CF Débito</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar nota por e-CF o Cliente..." className="pl-9 bg-muted/50" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select defaultValue="todas">
                    <SelectTrigger className="w-[180px] bg-muted/50">
                        <SelectValue placeholder="Filtrar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="B04">Notas de Crédito</SelectItem>
                        <SelectItem value="B03">Notas de Débito</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Documento</TableHead>
                            <TableHead className="font-bold">Factura Origen</TableHead>
                            <TableHead className="font-bold">Cliente</TableHead>
                            <TableHead className="font-bold">Fecha</TableHead>
                            <TableHead className="text-right font-bold">Monto</TableHead>
                            <TableHead className="font-bold text-center">Estado</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {NOTAS.filter(n => n.ecf.toLowerCase().includes(search.toLowerCase()) || n.cliente.toLowerCase().includes(search.toLowerCase())).map(nota => {
                            const est = ESTADO_MAP[nota.estado];
                            return (
                                <TableRow key={nota.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <p className="font-bold text-primary text-sm">{nota.ecf}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{nota.id}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-xs font-mono font-medium">
                                            <FileBox className="w-3 h-3 text-muted-foreground" /> {nota.origen}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-sm truncate max-w-[150px]">{nota.cliente}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono">{nota.rnc}</p>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        <Calendar className="inline w-3.5 h-3.5 mr-1" />{nota.fecha}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-red-500 tabular-nums">
                                        -RD$ {nota.monto.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${est.color}`}>
                                            {est.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
