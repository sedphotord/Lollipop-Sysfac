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
    ExternalLink, Filter, Plus, Search, TrendingUp, Users2, XCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CLIENTS = [
    { id: "1", name: "COMPAÑIA DOMINICANA DE TELEFONOS, S.A.", comercialName: "CLARO", rnc: "101010101", type: "SRL", status: "Activo", facturas: 5, totalFacturado: 1120800, saldoPendiente: 605800 },
    { id: "2", name: "ALTICE DOMINICANA, S.A.", comercialName: "ALTICE", rnc: "130819985", type: "SRL", status: "Activo", facturas: 3, totalFacturado: 350000, saldoPendiente: 125000 },
    { id: "3", name: "GRUPO RAMOS, S.A.", comercialName: "SIRENA / APREZIO", rnc: "101001010", type: "SRL", status: "Activo", facturas: 8, totalFacturado: 890000, saldoPendiente: 0 },
    { id: "4", name: "BANCO DE RESERVAS DE LA R.D.", comercialName: "BANRESERVAS", rnc: "101288345", type: "Estado", status: "Activo", facturas: 2, totalFacturado: 500000, saldoPendiente: 250000 },
    { id: "5", name: "JUAN ANTONIO PEREZ ROSARIO", comercialName: "", rnc: "00114356789", type: "Persona Física", status: "Activo", facturas: 1, totalFacturado: 3500, saldoPendiente: 0 },
    { id: "6", name: "EMPRESA SUSPENDIDA SRL", comercialName: "", rnc: "101112223", type: "SRL", status: "Suspendido", facturas: 0, totalFacturado: 0, saldoPendiente: 0 },
];

export default function ClientsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = CLIENTS.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.rnc.includes(search) ||
            (c.comercialName && c.comercialName.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalClientes = CLIENTS.filter(c => c.status === 'Activo').length;
    const totalFacturado = CLIENTS.reduce((a, c) => a + c.totalFacturado, 0);
    const totalPendiente = CLIENTS.reduce((a, c) => a + c.saldoPendiente, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Directorio CRM con verificación DGII integrada.</p>
                </div>
                <Button className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center"><Users2 className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Clientes Activos</p>
                            <p className="text-lg font-bold tracking-tight">{totalClientes}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Facturado</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalFacturado.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Cuentas por Cobrar</p>
                            <p className="text-lg font-bold tracking-tight">RD$ {totalPendiente.toLocaleString()}</p>
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
                                placeholder="Buscar por nombre, RNC o cédula..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
                <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>RNC / Cédula</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Facturado</TableHead>
                                <TableHead className="text-right">Saldo Pendiente</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((client) => (
                                <TableRow key={client.id} className="hover:bg-muted/20 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                {client.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <Link href={`/dashboard/clients/${client.id}`} className="font-semibold text-sm hover:text-primary hover:underline transition-colors">
                                                    {client.comercialName || client.name}
                                                </Link>
                                                {client.comercialName && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{client.name}</p>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{client.rnc}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs bg-muted/50">{client.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium text-sm">
                                        RD$ {client.totalFacturado.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium text-sm">
                                        {client.saldoPendiente > 0 ? (
                                            <span className="text-amber-600">RD$ {client.saldoPendiente.toLocaleString()}</span>
                                        ) : (
                                            <span className="text-emerald-600">RD$ 0.00</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-xs gap-1",
                                            client.status === 'Activo' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' : 'text-red-500 bg-red-500/10 border-red-500/30'
                                        )}>
                                            {client.status === 'Activo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/dashboard/clients/${client.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
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
