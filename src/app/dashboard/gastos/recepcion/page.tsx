"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "RC-001", fecha: "20 Oct 2024", proveedor: "EDEESTE", ncf: "B0100002341", tipo: "B01", monto: 14750, itbis: 2655, recibido: true },
    { id: "RC-002", fecha: "18 Oct 2024", proveedor: "Claro Empresas", ncf: "B0200001122", tipo: "B02", monto: 6136, itbis: 1104.48, recibido: true },
    { id: "RC-003", fecha: "15 Oct 2024", proveedor: "Dell Technologies", ncf: "B0100003400", tipo: "B01", monto: 100300, itbis: 15300, recibido: false },
];

export default function RecepcionComprobantesPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Recepción de Comprobantes</h2><p className="text-muted-foreground mt-1 text-sm">Registra los NCF de tus proveedores para el Formato 606 de la DGII.</p></div>
                <div className="flex gap-2"><Button variant="outline"><Upload className="w-4 h-4 mr-2" />Importar CSV</Button><Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Agregar NCF</Button></div>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>NCF</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Monto</TableHead><TableHead className="text-right">ITBIS</TableHead><TableHead>Recibido</TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                    <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                    <TableCell className="font-mono text-xs">{d.ncf}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-mono text-xs">{d.tipo}</Badge></TableCell>
                                    <TableCell className="text-right tabular-nums font-semibold">RD$ {d.monto.toLocaleString()}</TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">RD$ {d.itbis.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs", d.recibido ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30')}>{d.recibido ? '✓ Recibido' : 'Pendiente'}</Badge></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
