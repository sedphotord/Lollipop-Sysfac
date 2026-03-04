"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ASIENTOS = [
    { id: "AJ-2024-001", fecha: "31 Oct 2024", desc: "Cierre mensual ventas octubre", debito: 3850000, credito: 3850000, tipo: "cierre", status: "publicado" },
    { id: "AJ-2024-002", fecha: "31 Oct 2024", desc: "Depreciación equipos octubre", debito: 8500, credito: 8500, tipo: "ajuste", status: "publicado" },
    { id: "AJ-2024-003", fecha: "20 Oct 2024", desc: "Registro factura FP-001 Dell", debito: 100300, credito: 100300, tipo: "compra", status: "publicado" },
    { id: "AJ-2024-004", fecha: "22 Oct 2024", desc: "Cobro INV-0042 CLARO", debito: 605800, credito: 605800, tipo: "cobro", status: "borrador" },
];

const TIPO_COLOR: any = { cierre: "text-violet-600 bg-violet-500/10 border-violet-500/20", ajuste: "text-amber-600 bg-amber-500/10 border-amber-500/20", compra: "text-blue-600 bg-blue-500/10 border-blue-500/20", cobro: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" };

export default function EntradaDiarioPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Entradas de Diario</h2><p className="text-muted-foreground mt-1 text-sm">Asientos contables manuales y automáticos del período.</p></div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar</Button>
                    <Link href="/dashboard/contabilidad/diario/new">
                        <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Asiento</Button>
                    </Link>
                </div>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>N° Asiento</TableHead><TableHead>Fecha</TableHead><TableHead>Descripción</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Débito</TableHead><TableHead className="text-right">Crédito</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {ASIENTOS.map(a => (
                                    <TableRow key={a.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono text-xs font-semibold">{a.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.fecha}</TableCell>
                                        <TableCell className="font-medium">{a.desc}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", TIPO_COLOR[a.tipo])}>{a.tipo}</Badge></TableCell>
                                        <TableCell className="text-right tabular-nums font-mono">RD$ {a.debito.toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums font-mono">RD$ {a.credito.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", a.status === 'publicado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-muted-foreground bg-muted')}>{a.status}</Badge></TableCell>
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
