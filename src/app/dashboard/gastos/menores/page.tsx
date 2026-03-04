"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Coffee, DollarSign, Download, Plus, Receipt, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "GM-001", fecha: "21 Oct 2024", descripcion: "Café y snacks reunión", categoria: "Alimentación", quienPago: "Ana García", monto: 850, reembolsado: true },
    { id: "GM-002", fecha: "20 Oct 2024", descripcion: "Taxi cliente aeropuerto", categoria: "Transporte", quienPago: "Roberto Méndez", monto: 1200, reembolsado: false },
    { id: "GM-003", fecha: "18 Oct 2024", descripcion: "Materiales presentación", categoria: "Suministros", quienPago: "Carmen Reyes", monto: 650, reembolsado: true },
    { id: "GM-004", fecha: "15 Oct 2024", descripcion: "Parqueo cliente VIP", categoria: "Transporte", quienPago: "Luis Fernández", monto: 400, reembolsado: false },
];

export default function GastosMenoresPage() {
    const [search, setSearch] = useState("");
    const pendiente = DATA.filter(d => !d.reembolsado).reduce((a, d) => a + d.monto, 0);
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Gastos Menores / Caja Chica</h2><p className="text-muted-foreground mt-1 text-sm">Gastos pequeños y reembolsos de empleados.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Registrar Gasto</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ l: "Total Gastos", v: `RD$ ${DATA.reduce((a, d) => a + d.monto, 0).toLocaleString()}`, i: Receipt, c: "text-red-500 bg-red-500/10" }, { l: "Pendientes de Reembolso", v: `RD$ ${pendiente.toLocaleString()}`, i: DollarSign, c: "text-amber-600 bg-amber-500/10" }, { l: "Este Mes", v: DATA.length, i: Coffee, c: "text-blue-600 bg-blue-500/10" }].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Descripción</TableHead><TableHead>Categoría</TableHead><TableHead>Empleado</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Reembolsado</TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                    <TableCell className="font-medium">{d.descripcion}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs">{d.categoria}</Badge></TableCell>
                                    <TableCell className="text-sm">{d.quienPago}</TableCell>
                                    <TableCell className="text-right font-bold tabular-nums text-red-500">RD$ {d.monto.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs", d.reembolsado ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>{d.reembolsado ? 'Sí' : 'Pendiente'}</Badge></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
