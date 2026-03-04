"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { BookOpen, ChevronRight, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const CUENTAS = [
    { codigo: "1", nombre: "ACTIVOS", tipo: "grupo", nivel: 0, saldo: null },
    { codigo: "1.1", nombre: "Activos Corrientes", tipo: "grupo", nivel: 1, saldo: null },
    { codigo: "1.1.01", nombre: "Caja y Bancos", tipo: "cuenta", nivel: 2, saldo: 1570500 },
    { codigo: "1.1.02", nombre: "Cuentas por Cobrar", tipo: "cuenta", nivel: 2, saldo: 850300 },
    { codigo: "1.1.03", nombre: "Inventario de Mercancía", tipo: "cuenta", nivel: 2, saldo: 425000 },
    { codigo: "1.2", nombre: "Activos No Corrientes", tipo: "grupo", nivel: 1, saldo: null },
    { codigo: "1.2.01", nombre: "Equipos de Cómputo", tipo: "cuenta", nivel: 2, saldo: 320000 },
    { codigo: "2", nombre: "PASIVOS", tipo: "grupo", nivel: 0, saldo: null },
    { codigo: "2.1", nombre: "Pasivos Corrientes", tipo: "grupo", nivel: 1, saldo: null },
    { codigo: "2.1.01", nombre: "Cuentas por Pagar", tipo: "cuenta", nivel: 2, saldo: 95000 },
    { codigo: "2.1.02", nombre: "ITBIS por Pagar", tipo: "cuenta", nivel: 2, saldo: 28500 },
    { codigo: "3", nombre: "PATRIMONIO", tipo: "grupo", nivel: 0, saldo: null },
    { codigo: "3.1.01", nombre: "Capital Social", tipo: "cuenta", nivel: 2, saldo: 2500000 },
    { codigo: "4", nombre: "INGRESOS", tipo: "grupo", nivel: 0, saldo: null },
    { codigo: "4.1.01", nombre: "Ingresos por Ventas", tipo: "cuenta", nivel: 2, saldo: 3850000 },
    { codigo: "5", nombre: "GASTOS", tipo: "grupo", nivel: 0, saldo: null },
    { codigo: "5.1.01", nombre: "Gastos de Nómina", tipo: "cuenta", nivel: 2, saldo: 302000 },
    { codigo: "5.1.02", nombre: "Gastos de Alquiler", tipo: "cuenta", nivel: 2, saldo: 90000 },
    { codigo: "5.1.03", nombre: "Gastos de Servicios Básicos", tipo: "cuenta", nivel: 2, saldo: 34200 },
];

const NIVEL_CLASSES = [
    "font-black text-sm uppercase tracking-wider bg-primary/10 text-primary",
    "font-bold text-sm pl-4 bg-muted/50 text-foreground",
    "font-medium text-sm pl-8 text-muted-foreground",
];

export default function CatalogoCuentasPage() {
    const [search, setSearch] = useState("");
    const filtered = CUENTAS.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.codigo.includes(search));
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Catálogo de Cuentas</h2><p className="text-muted-foreground mt-1 text-sm">Plan de cuentas contables basado en el estándar DGII/NIIF.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Cuenta</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar por código o nombre..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div></div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/60 border-b"><TableRow><TableHead className="w-32">Código</TableHead><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Saldo</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filtered.map((c, i) => (
                                    <TableRow key={i} className={cn("hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0", c.tipo === 'grupo' && 'bg-muted/5')}>
                                        <TableCell className={cn("font-mono text-xs", c.nivel === 0 ? 'font-black text-primary' : c.nivel === 1 ? 'font-bold text-foreground' : 'text-muted-foreground')}>{c.codigo}</TableCell>
                                        <TableCell className={cn("", c.nivel === 0 ? 'font-black text-sm uppercase tracking-wide text-primary' : c.nivel === 1 ? 'font-bold pl-3' : ' pl-6 text-muted-foreground')}>{c.nombre}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-[10px]", c.tipo === 'grupo' ? 'bg-muted' : 'bg-blue-500/10 text-blue-600 border-blue-500/20')}>{c.tipo}</Badge></TableCell>
                                        <TableCell className="text-right tabular-nums font-mono text-sm font-semibold">
                                            {c.saldo !== null ? `RD$ ${c.saldo.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                                        </TableCell>
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
