"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "AJ-001", fecha: "20 Oct 2024", producto: "Laptop Dell XPS 15", tipo: "entrada", cant: 5, motivo: "Compra proveedor Dell", user: "Roberto M." },
    { id: "AJ-002", fecha: "18 Oct 2024", producto: "Teclado Mecánico Logitech", tipo: "salida", cant: 3, motivo: "Venta cliente", user: "Ana G." },
    { id: "AJ-003", fecha: "15 Oct 2024", producto: "Monitor Samsung 27\"", tipo: "salida", cant: 1, motivo: "Uso interno oficina", user: "Carmen R." },
    { id: "AJ-004", fecha: "10 Oct 2024", producto: "UPS APC 1500VA", tipo: "entrada", cant: 2, motivo: "Devolución cliente", user: "Luis F." },
];

export default function AjustesInventarioPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Ajustes de Inventario</h2><p className="text-muted-foreground mt-1 text-sm">Movimientos manuales de entrada y salida de inventario.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Ajuste</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Producto</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Cantidad</TableHead><TableHead>Motivo</TableHead><TableHead>Usuario</TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                    <TableCell className="font-semibold">{d.producto}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs gap-1.5", d.tipo === 'entrada' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-red-500 border-red-500/30 bg-red-500/10')}>
                                        {d.tipo === 'entrada' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}{d.tipo}
                                    </Badge></TableCell>
                                    <TableCell className={cn("text-right font-bold tabular-nums", d.tipo === 'entrada' ? 'text-emerald-600' : '')}>{d.tipo === 'entrada' ? '+' : '-'}{d.cant}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.motivo}</TableCell>
                                    <TableCell className="text-sm">{d.user}</TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
