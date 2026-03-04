"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AlertTriangle, Calendar, DollarSign, Download, Filter, Package,
    Plus, Receipt, Search, ShoppingCart, Tag, TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const GASTOS = [
    { id: "G001", date: "20 Oct 2024", proveedor: "EDEESTE (Electricidad)", categoria: "Servicios", monto: 12500, ncf: "B0100000123", metodo: "Transferencia", status: "pagado" },
    { id: "G002", date: "18 Oct 2024", proveedor: "Alquiler Oficina Churchill", categoria: "Alquileres", monto: 45000, ncf: "B0300000010", metodo: "Cheque", status: "pagado" },
    { id: "G003", date: "15 Oct 2024", proveedor: "Claro Empresas (Internet)", categoria: "Servicios", monto: 5200, ncf: "B0200000456", metodo: "Débito Automático", status: "pagado" },
    { id: "G004", date: "12 Oct 2024", proveedor: "Office Depot (Suministros)", categoria: "Suministros", monto: 8750, ncf: null, metodo: "Efectivo", status: "pagado" },
    { id: "G005", date: "10 Oct 2024", proveedor: "Staff Solutions SRL (Nómina)", categoria: "Nómina", monto: 95000, ncf: "B0100001500", metodo: "Transferencia", status: "pagado" },
    { id: "G006", date: "30 Oct 2024", proveedor: "INDOTEL (Tasa Regulatoria)", categoria: "Impuestos", monto: 3200, ncf: null, metodo: "Transferencia", status: "pendiente" },
];

const CATEGORY_COLORS: Record<string, string> = {
    "Servicios": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Alquileres": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Suministros": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Nómina": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Impuestos": "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function GastosPage() {
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [open, setOpen] = useState(false);

    const categorias = Array.from(new Set(GASTOS.map(g => g.categoria)));
    const filtered = GASTOS.filter(g => {
        const s = g.proveedor.toLowerCase().includes(search.toLowerCase());
        const c = catFilter === 'all' || g.categoria === catFilter;
        return s && c;
    });

    const totalGastos = GASTOS.reduce((a, g) => a + g.monto, 0);
    const totalPagado = GASTOS.filter(g => g.status === 'pagado').reduce((a, g) => a + g.monto, 0);
    const porCategoria = categorias.map(cat => ({
        cat,
        total: GASTOS.filter(g => g.categoria === cat).reduce((a, g) => a + g.monto, 0),
    })).sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gastos y CxP</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Control de egresos, cuentas por pagar y deducibles.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Gasto</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader><DialogTitle>Registrar Gasto / CxP</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Proveedor</Label><Input placeholder="Nombre del proveedor" /></div>
                                <div className="space-y-2"><Label>Monto (RD$)</Label><Input type="number" placeholder="0.00" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Categoría</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                        <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Fecha</Label><Input type="date" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>NCF del Proveedor</Label><Input placeholder="B01..." className="font-mono" /></div>
                                <div className="space-y-2"><Label>Método de Pago</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="t">Transferencia</SelectItem>
                                            <SelectItem value="c">Cheque</SelectItem>
                                            <SelectItem value="e">Efectivo</SelectItem>
                                            <SelectItem value="d">Débito Automático</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2"><Label>Notas</Label><Input placeholder="Descripción adicional..." /></div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button onClick={() => setOpen(false)}>Guardar Gasto</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Egresos (Oct)", value: `RD$ ${totalGastos.toLocaleString()}`, icon: TrendingDown, color: "text-red-500 bg-red-500/10" },
                    { label: "Pagado", value: `RD$ ${totalPagado.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Pendiente", value: `RD$ ${(totalGastos - totalPagado).toLocaleString()}`, icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Con NCF", value: `${GASTOS.filter(g => g.ncf).length}/${GASTOS.length}`, icon: Receipt, color: "text-blue-600 bg-blue-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Category breakdown */}
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Por Categoría</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {porCategoria.map(({ cat, total }) => (
                            <div key={cat}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{cat}</span>
                                    <span className="text-muted-foreground tabular-nums">RD$ {total.toLocaleString()}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(total / totalGastos * 100).toFixed(0)}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Table */}
                <div className="lg:col-span-3">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex gap-3 mb-4">
                                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                                <Select value={catFilter} onValueChange={setCatFilter}>
                                    <SelectTrigger className="w-44 bg-background"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="all">Todas</SelectItem>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />607</Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Proveedor</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>NCF</TableHead>
                                            <TableHead className="text-right">Monto</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map(g => (
                                            <TableRow key={g.id} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-medium text-sm">{g.proveedor}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("text-xs", CATEGORY_COLORS[g.categoria])}>{g.categoria}</Badge></TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{g.date}</TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{g.ncf || <span className="text-amber-500">Sin NCF</span>}</TableCell>
                                                <TableCell className="text-right font-bold tabular-nums text-red-500">-RD$ {g.monto.toLocaleString()}</TableCell>
                                                <TableCell><Badge variant="outline" className={g.status === 'pagado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs' : 'text-amber-600 border-amber-500/30 bg-amber-500/10 text-xs'}>{g.status === 'pagado' ? 'Pagado' : 'Pendiente'}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
