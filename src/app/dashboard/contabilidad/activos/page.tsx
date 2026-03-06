"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArchiveBoxIcon, CurrencyDollarIcon, PlusIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const ACTIVOS = [
    { id: "ACT-001", nombre: "Laptop Dell XPS 15 (Admin)", tipo: "Equipos Cómputo", adquisicion: "01 Ene 2023", costo: 95000, depreciacion: "25% anual", valorActual: 47500, status: "activo" },
    { id: "ACT-002", nombre: "Servidor NAS Synology", tipo: "Equipos Cómputo", adquisicion: "15 Jun 2022", costo: 120000, depreciacion: "25% anual", valorActual: 45000, status: "activo" },
    { id: "ACT-003", nombre: "Mueblería Oficina Principal", tipo: "Mobiliario", adquisicion: "01 Mar 2021", costo: 75000, depreciacion: "10% anual", valorActual: 52500, status: "activo" },
    { id: "ACT-004", nombre: "Impresora Multifuncional", tipo: "Equipos Oficina", adquisicion: "01 Oct 2020", costo: 25000, depreciacion: "20% anual", valorActual: 5000, status: "depreciado" },
];

export default function ActivosPage() {
    const totalCosto = ACTIVOS.reduce((a, i) => a + i.costo, 0);
    const totalActual = ACTIVOS.reduce((a, i) => a + i.valorActual, 0);
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Activos Fijos</h2><p className="text-muted-foreground mt-1 text-sm">Control de activos de la empresa y su depreciación fiscal.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><PlusIcon className="w-4 h-4 mr-2" /> Nuevo Activo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ l: "Total Activos", v: `RD$ ${totalCosto.toLocaleString()}`, i: ArchiveBoxIcon, c: "text-blue-600 bg-blue-500/10" }, { l: "Valor Neto", v: `RD$ ${totalActual.toLocaleString()}`, i: CurrencyDollarIcon, c: "text-emerald-600 bg-emerald-500/10" }, { l: "Depreciación Acum.", v: `RD$ ${(totalCosto - totalActual).toLocaleString()}`, i: ArrowTrendingDownIcon, c: "text-amber-600 bg-amber-500/10" }].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50"><TableRow><TableHead>Código</TableHead><TableHead>Descripción</TableHead><TableHead>Tipo</TableHead><TableHead>Adquisición</TableHead><TableHead className="text-right">Costo Hist.</TableHead><TableHead>Depreciación</TableHead><TableHead className="text-right">Valor Neto</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {ACTIVOS.map(a => (
                                    <TableRow key={a.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono text-xs">{a.id}</TableCell>
                                        <TableCell className="font-semibold">{a.nombre}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{a.tipo}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.adquisicion}</TableCell>
                                        <TableCell className="text-right tabular-nums">RD$ {a.costo.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.depreciacion}</TableCell>
                                        <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {a.valorActual.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", a.status === 'activo' ? 'text-blue-600 border-blue-500/30 bg-blue-500/10' : 'text-muted-foreground bg-muted')}>{a.status}</Badge></TableCell>
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
