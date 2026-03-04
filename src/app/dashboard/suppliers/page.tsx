"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowUpRight, Building2, CheckCircle2, DollarSign, Download,
    ExternalLink, Filter, Plus, Search, TrendingUp, Users2, XCircle, Truck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUPPLIERS = [
    { id: "1", name: "DISTRIBUIDORA CORRIPIO, SAS", comercialName: "CORRIPIO", rnc: "101000181", contactPerson: "José Pérez", phone: "809-555-0101", email: "ventas@corripio.com.do", type: "SRL", status: "Activo", totalComprado: 2500000 },
    { id: "2", name: "OMEGA TECH, S.A.", comercialName: "OMEGA TECH", rnc: "130123456", contactPerson: "Ana Sánchez", phone: "809-555-0202", email: "mayoristas@omegatech.do", type: "SRL", status: "Activo", totalComprado: 1200000 },
    { id: "3", name: "PAPELERIA JUMBO, SRL", comercialName: "JUMBO", rnc: "101987654", contactPerson: "Carlos Rodríguez", phone: "809-555-0303", email: "ventas@jumbo.com.do", type: "SRL", status: "Activo", totalComprado: 450000 },
    { id: "4", name: "SERVICIOS TECNOLOGICOS GLOBALES", comercialName: "GLOBAL TECH", rnc: "101456789", contactPerson: "María Fernández", phone: "809-555-0404", email: "info@globaltech.do", type: "SRL", status: "Activo", totalComprado: 850000 },
    { id: "5", name: "PROVEEDOR SUSPENDIDO SRL", comercialName: "", rnc: "101112223", contactPerson: "Desconocido", phone: "809-000-0000", email: "suspendido@test.com", type: "SRL", status: "Suspendido", totalComprado: 0 },
];

export default function SuppliersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = SUPPLIERS.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.rnc.includes(search) ||
            (s.comercialName && s.comercialName.toLowerCase().includes(search.toLowerCase())) ||
            s.contactPerson.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalProveedores = SUPPLIERS.filter(s => s.status === 'Activo').length;
    const totalComprado = SUPPLIERS.reduce((a, s) => a + s.totalComprado, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestión del directorio de suplidores y abastecimiento.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Proveedor
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><Truck className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Proveedores Activos</p>
                            <p className="text-lg font-bold tracking-tight">{totalProveedores}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Volumen de Compras</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalComprado.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, RNC, contacto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background border-border/60 focus-visible:ring-primary"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/60">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Activo">Activos</SelectItem>
                                <SelectItem value="Suspendido">Suspendidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="shrink-0"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="border border-border/40 rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Proveedor</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">RNC</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Contacto</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground text-right">Volumen Compras</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">Estado</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((supplier) => (
                                <TableRow key={supplier.id} className="hover:bg-muted/20 transition-colors group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{supplier.comercialName || supplier.name}</span>
                                            {supplier.comercialName && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{supplier.name}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{supplier.rnc}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{supplier.contactPerson}</span>
                                            <span className="text-[10px] text-muted-foreground">{supplier.phone} | {supplier.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-black text-sm">
                                        RD$ {supplier.totalComprado.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-xs gap-1 font-bold",
                                            supplier.status === 'Activo' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' : 'text-red-500 bg-red-500/10 border-red-500/30'
                                        )}>
                                            {supplier.status === 'Activo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {supplier.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
