"use client";
// Shared skeleton for remaining Gastos sub-pages
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Download, Plus, Repeat, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA = [
    { id: "GR-001", proveedor: "EDEESTE Electricidad", monto: 12500, frecuencia: "Mensual", proximo: "01 Nov 2024", status: "activo" },
    { id: "GR-002", proveedor: "Claro Internet Empresarial", monto: 5200, frecuencia: "Mensual", proximo: "05 Nov 2024", status: "activo" },
    { id: "GR-003", proveedor: "Alquiler Oficina", monto: 45000, frecuencia: "Mensual", proximo: "01 Nov 2024", status: "activo" },
    { id: "GR-004", proveedor: "Seguro BHD León", monto: 8500, frecuencia: "Trimestral", proximo: "01 Ene 2025", status: "pausado" },
];

export default function GastosRecurrentesPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Pagos Recurrentes</h2><p className="text-muted-foreground mt-1 text-sm">Gastos periódicos automatizados a proveedores.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /><Repeat className="w-3.5 h-3.5 mr-1" /> Nueva Recurrencia</Button>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 bg-background" /></div></div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Proveedor</TableHead><TableHead>Frecuencia</TableHead><TableHead>Próximo Pago</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>{DATA.map(d => (
                                <TableRow key={d.id} className="hover:bg-muted/20">
                                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                    <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs">{d.frecuencia}</Badge></TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{d.proximo}</TableCell>
                                    <TableCell className="text-right font-bold tabular-nums text-red-500">RD$ {d.monto.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("text-xs", d.status === 'activo' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30')}>{d.status}</Badge></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
