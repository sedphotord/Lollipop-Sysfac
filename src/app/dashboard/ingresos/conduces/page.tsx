"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, MapPin, Package, Plus, Search, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DATA = [
    { id: "CON-001", fecha: "20 Oct 2024", cliente: "CLARO", destino: "Av. 27 de Febrero #120, SD", items: 3, peso: "45 kg", status: "entregado" },
    { id: "CON-002", fecha: "18 Oct 2024", cliente: "ALTICE", destino: "Calle El Sol #8, Santiago", items: 1, peso: "12 kg", status: "en_transito" },
    { id: "CON-003", fecha: "22 Oct 2024", cliente: "GRUPO RAMOS", destino: "Plaza Central, La Romana", items: 5, peso: "98 kg", status: "pendiente" },
];

const STATUS = { entregado: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", en_transito: "text-blue-600 bg-blue-500/10 border-blue-500/30", pendiente: "text-amber-600 bg-amber-500/10 border-amber-500/30" };
const STATUS_LABEL: any = { entregado: "Entregado", en_transito: "En Tránsito", pendiente: "Pendiente" };

export default function ConducesPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Conduces</h2><p className="text-muted-foreground mt-1 text-sm">Documentos de entrega y remisión de mercancía a clientes.</p></div>
                <Link href="/dashboard/ingresos/conduces/new">
                    <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Conduce</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ l: "Total Conduces", v: DATA.length, i: Truck, c: "text-blue-600 bg-blue-500/10" }, { l: "En Tránsito", v: DATA.filter(d => d.status === 'en_transito').length, i: MapPin, c: "text-amber-600 bg-amber-500/10" }, { l: "Entregados", v: DATA.filter(d => d.status === 'entregado').length, i: Package, c: "text-emerald-600 bg-emerald-500/10" }].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar conduces..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div></div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>ID</TableHead><TableHead>Fecha</TableHead><TableHead>Cliente</TableHead><TableHead>Destino</TableHead><TableHead>Artículos</TableHead><TableHead>Peso</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {DATA.map(d => (
                                    <TableRow key={d.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono text-xs font-semibold">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell className="font-semibold">{d.cliente}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.destino}</TableCell>
                                        <TableCell>{d.items}</TableCell>
                                        <TableCell className="text-sm">{d.peso}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", STATUS[d.status as keyof typeof STATUS])}>{STATUS_LABEL[d.status]}</Badge></TableCell>
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
