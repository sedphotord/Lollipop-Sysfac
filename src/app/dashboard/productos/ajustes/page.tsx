"use client";
import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, PackageMinus, PackagePlus, Download, Plus, Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Initial mock data simulating inventory adjustments
const INITIAL_DATA = [
    { id: "AJ-001", fecha: "24 Oct 2024", almacen: "Principal", motivo: "Mercancía Dañada", tipo: "disminucion", itemsCount: 4, monto_impacto: 12500, status: "aplicado" },
    { id: "AJ-002", fecha: "15 Oct 2024", almacen: "Secundario", motivo: "Conteo Físico (Sobrante)", tipo: "incremento", itemsCount: 2, monto_impacto: 4500, status: "aplicado" },
    { id: "AJ-003", fecha: "05 Oct 2024", almacen: "Principal", motivo: "Uso Interno", tipo: "disminucion", itemsCount: 1, monto_impacto: 850, status: "aplicado" },
    { id: "AJ-004", fecha: "30 Sep 2024", almacen: "Principal", motivo: "Mercancía Vencida", tipo: "disminucion", itemsCount: 12, monto_impacto: 45000, status: "aplicado" },
    { id: "AJ-005", fecha: "01 Nov 2024", almacen: "Principal", motivo: "Ajuste Inicial", tipo: "incremento", itemsCount: 150, monto_impacto: 1540000, status: "borrador" },
];

export default function AjustesInventarioPage() {
    const [search, setSearch] = useState("");
    const [ajustes, setAjustes] = useState<any[]>(INITIAL_DATA);
    const [selectedAjuste, setSelectedAjuste] = useState<any>(null);

    useEffect(() => {
        // Load saved adjustments
        try {
            const savedAjustes = JSON.parse(companyStorage.get('ajustes_inventario') || '[]');
            if (savedAjustes.length > 0) {
                setAjustes([...savedAjustes, ...INITIAL_DATA]);
            }
        } catch { }
    }, []);

    const impactedValue = ajustes.filter(d => d.status === 'aplicado' && d.tipo === 'disminucion').reduce((a, d) => a + d.monto_impacto, 0);
    const increasedValue = ajustes.filter(d => d.status === 'aplicado' && d.tipo === 'incremento').reduce((a, d) => a + d.monto_impacto, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ajustes de Inventario</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Registra cambios de stock que no provengan de ventas o compras (mermas, daño, uso interno).</p>
                </div>
                <Link href="/dashboard/productos/ajustes/new">
                    <Button className="bg-primary shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Ajuste
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Ajustes Realizados", value: ajustes.filter(d => d.status === 'aplicado').length, icon: CheckCircle2, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Incremento Total (RD$)", value: `+${increasedValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}`, icon: PackagePlus, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Pérdida/Mermas (RD$)", value: `-${impactedValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}`, icon: PackageMinus, color: "text-rose-600 bg-rose-500/10" },
                    { label: "Borradores", value: ajustes.filter(d => d.status === 'borrador').length, icon: FileText, color: "text-amber-600 bg-amber-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}>
                                <k.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                                <p className="text-lg font-bold">{k.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar por ID o motivo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Select defaultValue="todos">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo de Ajuste" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los ajustes</SelectItem>
                                <SelectItem value="incremento">Sobrantes (Incremento)</SelectItem>
                                <SelectItem value="disminucion">Mermas (Disminución)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>No. Ajuste</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Almacén</TableHead>
                                    <TableHead className="text-center">Items</TableHead>
                                    <TableHead className="text-right">Impacto (RD$)</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ajustes.filter(d => d.motivo.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())).map((d, i) => (
                                    <TableRow key={i} className="hover:bg-muted/20 cursor-pointer" onClick={() => setSelectedAjuste(d)}>
                                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.fecha}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {d.tipo === 'incremento' ? <PackagePlus className="w-4 h-4 text-emerald-600" /> : <PackageMinus className="w-4 h-4 text-rose-500" />}
                                                <span className="font-medium text-sm">{d.motivo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{d.almacen}</TableCell>
                                        <TableCell className="text-center tabular-nums text-sm font-medium">{d.itemsCount}</TableCell>
                                        <TableCell className={cn("text-right font-bold tabular-nums", d.tipo === 'incremento' ? "text-emerald-600" : "text-rose-600")}>
                                            {d.tipo === 'incremento' ? '+' : '-'} {d.monto_impacto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-xs uppercase tracking-wider", d.status === 'aplicado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>
                                                {d.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Ajuste Detail Modal */}
            {selectedAjuste && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedAjuste(null)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 flex items-center justify-between border-b bg-muted/20">
                            <h2 className="font-bold text-lg text-foreground">Detalle de Ajuste</h2>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedAjuste(null)} className="w-8 h-8 hover:bg-muted text-muted-foreground text-xl leading-none">
                                ├ù
                            </Button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-center space-y-2 mb-6 border-b border-dashed pb-6">
                                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", selectedAjuste.tipo === 'incremento' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                                    {selectedAjuste.tipo === 'incremento' ? <PackagePlus className="w-8 h-8" /> : <PackageMinus className="w-8 h-8" />}
                                </div>
                                <h3 className={cn("text-2xl font-bold tabular-nums", selectedAjuste.tipo === 'incremento' ? "text-emerald-600" : "text-rose-600")}>
                                    {selectedAjuste.tipo === 'incremento' ? '+' : '-'} RD$ {selectedAjuste.monto_impacto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground">{selectedAjuste.motivo}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-sm text-muted-foreground">ID Ajuste</span>
                                    <span className="text-sm font-mono font-medium">{selectedAjuste.id}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-sm text-muted-foreground">Fecha</span>
                                    <span className="text-sm font-medium">{selectedAjuste.fecha}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-sm text-muted-foreground">Almacén</span>
                                    <span className="text-sm font-medium text-foreground">{selectedAjuste.almacen}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-sm text-muted-foreground">Productos Afectados</span>
                                    <span className="text-sm font-bold text-primary">{selectedAjuste.itemsCount} ítems</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/40">
                                    <span className="text-sm text-muted-foreground">Estado</span>
                                    <Badge variant="outline" className={cn("text-xs uppercase tracking-wider", selectedAjuste.status === 'aplicado' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 border-amber-500/30 bg-amber-500/10')}>{selectedAjuste.status}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}