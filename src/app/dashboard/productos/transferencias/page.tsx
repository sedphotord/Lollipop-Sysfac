"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Calendar, Download, FileText, Package, Plus, Search } from "lucide-react";

export default function TransferenciasPage() {
    const [search, setSearch] = useState("");

    const TRANSFERENCIAS = [
        { id: "TRF-0012", fecha: "25 Oct 2024", origen: "Almacén Principal", destino: "Sucursal Santiago", items: 3, estado: "completado" },
        { id: "TRF-0013", fecha: "26 Oct 2024", origen: "Depósito La Romana", destino: "Almacén Principal", items: 1, estado: "en_transito" },
        { id: "TRF-0014", fecha: "28 Oct 2024", origen: "Almacén Principal", destino: "Sucursal Santiago", items: 5, estado: "borrador" },
    ];

    const ESTADO_MAP: Record<string, { label: string; color: string }> = {
        completado: { label: "Completado", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" },
        en_transito: { label: "En Tránsito", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
        borrador: { label: "Borrador", color: "text-muted-foreground bg-muted border-border" }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transferencias</h2>
                    <p className="text-muted-foreground text-sm">Mueve inventario entre tus almacenes y sucursales.</p>
                </div>
                <Button className="bg-gradient-brand text-white border-0 shadow-lg shadow-purple-500/20">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Transferencia
                </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm border-l-4 border-l-primary/60 col-span-1 md:col-span-2">
                    <CardContent className="p-4 flex flex-col justify-center h-full space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary"><ArrowLeftRight className="w-5 h-5" /></div>
                            <h3 className="font-bold">Mover Mercancía Rápidamente</h3>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                            <Select>
                                <SelectTrigger className="h-9"><SelectValue placeholder="Origen..." /></SelectTrigger>
                                <SelectContent><SelectItem value="A1">Almacén Principal</SelectItem></SelectContent>
                            </Select>
                            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                            <Select>
                                <SelectTrigger className="h-9"><SelectValue placeholder="Destino..." /></SelectTrigger>
                                <SelectContent><SelectItem value="A2">Sucursal Santiago</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full h-9" variant="secondary">Seleccionar Productos</Button>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center space-y-2">
                        <div className="p-3 bg-amber-500/10 rounded-full text-amber-600"><Package className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold text-lg">1</p>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">En Tránsito</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center space-y-2">
                        <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600"><FileText className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold text-lg">42</p>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Historial (Mes)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toolbar and Table */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar guía de traslado..." className="pl-9 bg-muted/50" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold w-[120px]">Documento</TableHead>
                            <TableHead className="font-bold w-[120px]">Fecha</TableHead>
                            <TableHead className="font-bold">Origen</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="font-bold">Destino</TableHead>
                            <TableHead className="text-center font-bold">Cant. Ítems</TableHead>
                            <TableHead className="font-bold">Estado</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {TRANSFERENCIAS.filter(t => t.id.toLowerCase().includes(search.toLowerCase())).map(tr => {
                            const est = ESTADO_MAP[tr.estado];
                            return (
                                <TableRow key={tr.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-sm font-semibold">{tr.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground"><Calendar className="inline w-3.5 h-3.5 mr-1" />{tr.fecha}</TableCell>
                                    <TableCell className="font-medium text-sm">{tr.origen}</TableCell>
                                    <TableCell className="text-center text-muted-foreground"><ArrowLeftRight className="w-3.5 h-3.5 mx-auto" /></TableCell>
                                    <TableCell className="font-medium text-sm">{tr.destino}</TableCell>
                                    <TableCell className="text-center font-mono">{tr.items}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${est.color}`}>
                                            {est.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Download className="w-4 h-4" /></Button>
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
