"use client";
// Gestión de productos — management view with bulk actions
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Edit, Plus, Search, Trash2, Upload, MoreVertical, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
    { id: "1", code: "SRV-001", name: "Consultoría IT (hora)", cat: "Servicio", price: 5000, itbis: 18, stock: null, status: "activo" },
    { id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", cat: "Hardware", price: 85000, itbis: 18, stock: 8, status: "activo" },
    { id: "3", code: "PRD-003", name: "Libro de Contabilidad", cat: "Papelería", price: 1500, itbis: 0, stock: 24, status: "activo" },
    { id: "4", code: "SFT-007", name: "Licencia MS Office 365", cat: "Software", price: 6500, itbis: 18, stock: null, status: "activo" },
    { id: "5", code: "PRD-005", name: "Monitor Samsung 27\"", cat: "Hardware", price: 32000, itbis: 18, stock: 2, status: "activo" },
    { id: "6", code: "PRD-006", name: "Teclado Mecánico", cat: "Hardware", price: 8500, itbis: 18, stock: 0, status: "inactivo" },
];

export default function GestionProductosPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const allSelected = selected.length === PRODUCTS.length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Gestión de Productos</h2><p className="text-muted-foreground mt-1 text-sm">Administración avanzada: edición masiva, importación y exportación.</p></div>
                <div className="flex gap-2">
                    <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Importar Excel</Button>
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar</Button>
                    <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Producto</Button>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-sm animate-in slide-in-from-top-2">
                    <span className="font-semibold text-primary">{selected.length} seleccionados</span>
                    <span className="text-muted-foreground">—</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600 hover:bg-amber-500/10">Desactivar</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600 hover:bg-emerald-500/10">Activar</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 mr-1" />Eliminar</Button>
                </div>
            )}

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="pl-9 bg-background" /></div></div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={c => setSelected(c ? PRODUCTS.map(p => p.id) : [])} /></TableHead>
                                    <TableHead>Código</TableHead><TableHead>Nombre</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Precio</TableHead><TableHead>ITBIS</TableHead><TableHead className="text-right">Stock</TableHead><TableHead>Estado</TableHead><TableHead className="w-16"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())).map(p => (
                                    <TableRow key={p.id} className={cn("hover:bg-muted/20 transition-colors", selected.includes(p.id) && 'bg-primary/5')}>
                                        <TableCell><Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} /></TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{p.code}</TableCell>
                                        <TableCell className="font-semibold">{p.name}</TableCell>
                                        <TableCell><Badge variant="outline" className="text-xs">{p.cat}</Badge></TableCell>
                                        <TableCell className="text-right font-bold tabular-nums">RD$ {p.price.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", p.itbis === 0 ? 'text-emerald-600 border-emerald-500/30' : 'text-muted-foreground')}>{p.itbis === 0 ? 'Exento' : `${p.itbis}%`}</Badge></TableCell>
                                        <TableCell className={cn("text-right tabular-nums font-medium", p.stock === 0 ? 'text-red-500' : p.stock !== null && p.stock <= 3 ? 'text-amber-500' : '')}>{p.stock === null ? 'N/A' : p.stock === 0 ? '⚠ 0' : p.stock}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("text-xs", p.status === 'activo' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-muted-foreground bg-muted')}>{p.status}</Badge></TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem><Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Editar</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/productos/kardex`}>
                                                            <History className="w-4 h-4 mr-2 text-blue-500" /> Ver Kardex
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
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
