"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

export default function CatalogoCuentasPage() {
    const [search, setSearch] = useState("");

    // By default, expand levels 0 (root) and 1
    const defaultExpanded = new Set(CUENTAS.filter(c => c.nivel <= 1).map(c => c.codigo));
    const [expanded, setExpanded] = useState<Set<string>>(defaultExpanded);

    const toggleExpand = (codigo: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(codigo)) next.delete(codigo);
            else next.add(codigo);
            return next;
        });
    };

    const isVisible = (c: typeof CUENTAS[0], isSearching: boolean) => {
        if (isSearching) return true; // Show all matches if searching
        if (c.nivel === 0) return true;
        let currentCode = c.codigo;
        while (currentCode.includes('.')) {
            currentCode = currentCode.substring(0, currentCode.lastIndexOf('.'));
            if (!expanded.has(currentCode)) return false;
        }
        return true;
    };

    const isSearching = search.trim().length > 0;
    const filteredAndVisible = CUENTAS
        .filter(c => isSearching ? (c.nombre.toLowerCase().includes(search.toLowerCase()) || c.codigo.includes(search)) : true)
        .filter(c => isVisible(c, isSearching));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Catálogo de Cuentas</h2><p className="text-muted-foreground mt-1 text-sm">Plan de cuentas contables detallado con vista jerárquica.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><PlusIcon className="w-4 h-4 mr-2" /> Nueva Cuenta</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar por código o nombre..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        {!isSearching && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setExpanded(new Set(CUENTAS.map(c => c.codigo)))}>Expandir Todo</Button>
                                <Button variant="outline" size="sm" onClick={() => setExpanded(new Set())}>Colapsar Todo</Button>
                            </div>
                        )}
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/60 border-b"><TableRow><TableHead className="w-40">Código</TableHead><TableHead>Nombre</TableHead><TableHead className="w-32">Tipo</TableHead><TableHead className="text-right">Saldo Actual</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredAndVisible.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No se encontraron cuentas.</TableCell></TableRow>
                                ) : (
                                    filteredAndVisible.map((c) => {
                                        const isExpanded = expanded.has(c.codigo);
                                        const paddingLeft = isSearching ? '8px' : `${(c.nivel * 24) + 8}px`; // dynamic indent

                                        return (
                                            <TableRow key={c.codigo} className={cn("hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0", c.tipo === 'grupo' && 'bg-muted/5')}>
                                                <TableCell className={cn("font-mono text-xs", c.nivel === 0 ? 'font-black text-primary' : c.nivel === 1 ? 'font-bold text-foreground' : 'text-muted-foreground')}>
                                                    <div className="flex items-center gap-1" style={{ paddingLeft }}>
                                                        {c.tipo === 'grupo' && !isSearching ? (
                                                            <button onClick={(e) => { e.stopPropagation(); toggleExpand(c.codigo); }} className="p-0.5 rounded-md hover:bg-muted/60">
                                                                {isExpanded ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />}
                                                            </button>
                                                        ) : (
                                                            <div className="w-4.5" /> // spacer
                                                        )}
                                                        {c.codigo}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={cn("", c.nivel === 0 ? 'font-black text-sm uppercase tracking-wide text-primary' : c.nivel === 1 ? 'font-bold text-sm text-foreground' : 'text-sm text-muted-foreground font-medium')}>
                                                    {c.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-[10px]", c.tipo === 'grupo' ? 'bg-muted' : 'bg-blue-500/10 text-blue-600 border-blue-500/20')}>
                                                        {c.tipo}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums font-mono text-sm font-semibold">
                                                    {c.saldo !== null ? `RD$ ${c.saldo.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
