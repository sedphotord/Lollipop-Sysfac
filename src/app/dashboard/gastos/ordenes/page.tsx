"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CheckSquare, ClipboardList, Package, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "OC-001", fecha: "19 Oct 2024", proveedor: "Dell Technologies", items: 2, total: 100300, status: "recibida" },
    { id: "OC-002", fecha: "17 Oct 2024", proveedor: "Office Depot RD", items: 5, total: 12750, status: "en_proceso" },
    { id: "OC-003", fecha: "22 Oct 2024", proveedor: "APC Distribuidores", items: 1, total: 21240, status: "pendiente" },
];

const STATUS_LABEL: any = { recibida: "Recibida", en_proceso: "En Proceso", pendiente: "Pendiente" };
const STATUS_COLOR: any = { recibida: "text-emerald-600 border-emerald-500/30 bg-emerald-500/10", en_proceso: "text-blue-600 border-blue-500/30 bg-blue-500/10", pendiente: "text-amber-600 border-amber-500/30 bg-amber-500/10" };

export default function OrdenesCompraPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Órdenes de Compra</h2><p className="text-muted-foreground mt-1 text-sm">Gestiona tus solicitudes de compra a proveedores.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva OC</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead className="text-right">Artículos</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead><TableHead className="w-10"></TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20 group">
                                    <TableCell className="font-mono text-xs font-semibold">{d.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                    <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                    <TableCell className="text-right"><Badge variant="outline">{d.items}</Badge></TableCell>
                                    <TableCell className="text-right font-bold tabular-nums">RD$ {d.total.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs", STATUS_COLOR[d.status])}>{STATUS_LABEL[d.status]}</Badge></TableCell>
                                    <TableCell>{d.status !== 'recibida' && <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100"><CheckSquare className="w-3.5 h-3.5 mr-1" />Recibir</Button>}</TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
