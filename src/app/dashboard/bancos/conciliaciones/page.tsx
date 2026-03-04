"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CheckCircle2, Download, Plus, RefreshCw, Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MOVS = [
    { fecha: "21 Oct", desc: "Cobro Factura CLARO INV-0042", banco: "605,800.00", estado: "conciliado", tipo: "c" },
    { fecha: "20 Oct", desc: "Pago Nómina Octubre", banco: "-95,000.00", estado: "conciliado", tipo: "d" },
    { fecha: "18 Oct", desc: "Alquiler Oficina Churchill", banco: "-45,000.00", estado: "conciliado", tipo: "d" },
    { fecha: "15 Oct", desc: "Cobro Factura ALTICE INV-0040", banco: "147,500.00", estado: "pendiente", tipo: "c" },
    { fecha: "12 Oct", desc: "Servicio Internet CLARO", banco: "-5,200.00", estado: "pendiente", tipo: "d" },
];

export default function ConciliacionesPage() {
    const [search, setSearch] = useState("");
    const pendientes = MOVS.filter(m => m.estado === 'pendiente').length;
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Conciliaciones Bancarias</h2><p className="text-muted-foreground mt-1 text-sm">Compara tus registros contables contra el estado de cuenta bancario.</p></div>
                <div className="flex gap-2"><Button variant="outline"><Download className="w-4 h-4 mr-2" />Importar OFX</Button><Button className="bg-primary shadow-lg shadow-primary/20"><RefreshCw className="w-4 h-4 mr-2" />Conciliar</Button></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { l: "Movimientos", v: MOVS.length, c: "text-blue-600 bg-blue-500/10", i: RefreshCw },
                    { l: "Conciliados", v: MOVS.filter(m => m.estado === 'conciliado').length, c: "text-emerald-600 bg-emerald-500/10", i: CheckCircle2 },
                    { l: "Pendientes", v: pendientes, c: pendientes > 0 ? "text-amber-600 bg-amber-500/10" : "text-muted-foreground bg-muted", i: XCircle },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>Fecha</TableHead><TableHead>Descripción</TableHead><TableHead className="text-right">Monto Banco</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>{MOVS.map((m, i) => (
                                <TableRow key={i} className="hover:bg-muted/20">
                                    <TableCell className="text-sm text-muted-foreground">{m.fecha}</TableCell>
                                    <TableCell className="font-medium">{m.desc}</TableCell>
                                    <TableCell className={cn("text-right font-bold tabular-nums font-mono", m.tipo === 'c' ? 'text-emerald-600' : 'text-red-500')}>RD$ {m.banco}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs", m.estado === 'conciliado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30')}>{m.estado === 'conciliado' ? <><CheckCircle2 className="w-3 h-3 inline mr-1" />Conciliado</> : <>Pendiente</>}</Badge></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
