"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "NC-C-001", fecha: "20 Oct 2024", proveedor: "Dell Technologies", facturaRef: "FP-001", motivo: "Devolución parcial equipo", monto: 15000 },
    { id: "NC-C-002", fecha: "10 Oct 2024", proveedor: "Office Depot RD", facturaRef: "FP-002", motivo: "Error en precio pactado", monto: 1200 },
];

export default function NcComprasPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Notas de Crédito en Compras</h2><p className="text-muted-foreground mt-1 text-sm">NC emitidas por tus proveedores que reducen tus CxP.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Registrar NC</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 bg-background" /></div></div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>Factura Original</TableHead><TableHead>Motivo</TableHead><TableHead className="text-right">Monto Acreditado</TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                    <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                    <TableCell className="font-mono text-xs text-primary">{d.facturaRef}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.motivo}</TableCell>
                                    <TableCell className="text-right font-bold tabular-nums text-emerald-600">RD$ {d.monto.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
