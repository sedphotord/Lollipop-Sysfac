"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Download, FileText, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DATA = [
    { id: "FP-001", fecha: "18 Oct 2024", proveedor: "Dell Technologies", ncf: "B0100002341", subtotal: 85000, itbis: 15300, total: 100300, status: "pagada" },
    { id: "FP-002", fecha: "15 Oct 2024", proveedor: "Office Depot RD", ncf: "B0200001122", subtotal: 7500, itbis: 1350, total: 8850, status: "pendiente" },
    { id: "FP-003", fecha: "10 Oct 2024", proveedor: "APC Distribuidores", ncf: "B0100004500", subtotal: 18000, itbis: 3240, total: 21240, status: "pagada" },
    { id: "FP-004", fecha: "08 Oct 2024", proveedor: "Amazon USA (Importación)", ncf: null, subtotal: 45000, itbis: 8100, total: 53100, status: "pendiente" },
];

export default function ProveedoresPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Facturas de Proveedores</h2><p className="text-muted-foreground mt-1 text-sm">Gestión de Cuentas por Pagar y documentos de compra.</p></div>
                <Link href="/dashboard/gastos/proveedores/new">
                    <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Registrar Factura</Button>
                </Link>
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar proveedor o NCF..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" />606 DGII</Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Proveedor</TableHead><TableHead>NCF</TableHead><TableHead className="text-right">Subtotal</TableHead><TableHead className="text-right">ITBIS</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {DATA.filter(d => d.proveedor.toLowerCase().includes(search.toLowerCase())).map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.proveedor}</TableCell>
                                        <TableCell className="font-mono text-xs">{d.ncf ?? <span className="text-amber-500">Sin NCF</span>}</TableCell>
                                        <TableCell className="text-right tabular-nums">RD$ {d.subtotal.toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums text-muted-foreground">RD$ {d.itbis.toLocaleString()}</TableCell>
                                        <TableCell className="text-right tabular-nums font-bold">RD$ {d.total.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", d.status === 'pagada' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>{d.status}</Badge></TableCell>
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
