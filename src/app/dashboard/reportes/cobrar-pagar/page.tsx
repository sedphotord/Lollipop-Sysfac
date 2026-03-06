"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Clock, DollarSign, Download, Filter, Search, Send, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data
const AGING_COBRAR = [
    { client: "Ferretería Ochoa", total: 45000, current: 0, days1_30: 45000, days31_60: 0, days61_90: 0, days90Plus: 0, lastInvoice: "2024-10-15" },
    { client: "Construrama Del Norte", total: 125500, current: 25000, days1_30: 0, days31_60: 100500, days61_90: 0, days90Plus: 0, lastInvoice: "2024-08-22" },
    { client: "Inversiones Torres SRL", total: 15400, current: 0, days1_30: 0, days31_60: 0, days61_90: 15400, days90Plus: 0, lastInvoice: "2024-07-10" },
    { client: "Grupo Ramos", total: 320000, current: 320000, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0, lastInvoice: "2024-10-28" },
    { client: "Constructora Bisonó", total: 89000.50, current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 89000.50, lastInvoice: "2024-03-05" },
];

const AGING_PAGAR = [
    { supplier: "Cementos Cibao", total: 550000, current: 550000, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0, lastInvoice: "2024-10-25" },
    { supplier: "Acero Estrella", total: 215000, current: 0, days1_30: 215000, days31_60: 0, days61_90: 0, days90Plus: 0, lastInvoice: "2024-10-01" },
    { supplier: "Gomas y Más O&A", total: 35000, current: 0, days1_30: 0, days31_60: 0, days61_90: 35000, days90Plus: 0, lastInvoice: "2024-08-15" },
];

export default function AgingReportsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const renderTable = (data: any[], type: "cobrar" | "pagar") => {
        const filteredData = data.filter(item =>
            (type === "cobrar" ? item.client : item.supplier).toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Calculate Totals
        const totals = filteredData.reduce((acc, curr) => ({
            total: acc.total + curr.total,
            current: acc.current + curr.current,
            days1_30: acc.days1_30 + curr.days1_30,
            days31_60: acc.days31_60 + curr.days31_60,
            days61_90: acc.days61_90 + curr.days61_90,
            days90Plus: acc.days90Plus + curr.days90Plus,
        }), { total: 0, current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 });

        return (
            <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold">{type === "cobrar" ? "Cliente" : "Suplidor"}</TableHead>
                                <TableHead className="text-right whitespace-nowrap">Por Vencer (Corriente)</TableHead>
                                <TableHead className="text-right whitespace-nowrap text-amber-600 dark:text-amber-500">1 - 30 días</TableHead>
                                <TableHead className="text-right whitespace-nowrap text-orange-600 dark:text-orange-500">31 - 60 días</TableHead>
                                <TableHead className="text-right whitespace-nowrap text-rose-600 dark:text-rose-500">61 - 90 días</TableHead>
                                <TableHead className="text-right whitespace-nowrap font-bold text-red-600 dark:text-red-500">+90 días</TableHead>
                                <TableHead className="text-right font-bold w-[120px]">Total Adeudado</TableHead>
                                {type === "cobrar" && <TableHead className="w-[80px] text-center">Acciones</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No se encontraron resultados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((row, i) => (
                                    <TableRow key={i} className="hover:bg-muted/30">
                                        <TableCell className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{type === "cobrar" ? row.client : row.supplier}</p>
                                                    <p className="text-[10px] text-muted-foreground">Última fra: {row.lastInvoice}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{row.current > 0 ? formatMoney(row.current) : "-"}</TableCell>
                                        <TableCell className="text-right text-amber-600/80 dark:text-amber-500/80">{row.days1_30 > 0 ? formatMoney(row.days1_30) : "-"}</TableCell>
                                        <TableCell className="text-right text-orange-600/80 dark:text-orange-500/80">{row.days31_60 > 0 ? formatMoney(row.days31_60) : "-"}</TableCell>
                                        <TableCell className="text-right text-rose-600/80 dark:text-rose-500/80">{row.days61_90 > 0 ? formatMoney(row.days61_90) : "-"}</TableCell>
                                        <TableCell className="text-right font-bold text-red-600/80 dark:text-red-500/80">{row.days90Plus > 0 ? formatMoney(row.days90Plus) : "-"}</TableCell>
                                        <TableCell className="text-right font-bold bg-muted/20 text-blue-600 dark:text-blue-400">{formatMoney(row.total)}</TableCell>
                                        {type === "cobrar" && (
                                            <TableCell className="text-center">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" title="Enviar recordatorio">
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <TableHeader className="bg-muted border-t-2 border-border">
                            <TableRow>
                                <TableHead className="font-bold text-right text-primary">TOTALES GENERALES:</TableHead>
                                <TableHead className="text-right font-bold">{formatMoney(totals.current)}</TableHead>
                                <TableHead className="text-right font-bold text-amber-600 dark:text-amber-500">{formatMoney(totals.days1_30)}</TableHead>
                                <TableHead className="text-right font-bold text-orange-600 dark:text-orange-500">{formatMoney(totals.days31_60)}</TableHead>
                                <TableHead className="text-right font-bold text-rose-600 dark:text-rose-500">{formatMoney(totals.days61_90)}</TableHead>
                                <TableHead className="text-right font-bold text-red-600 dark:text-red-500">{formatMoney(totals.days90Plus)}</TableHead>
                                <TableHead className="text-right font-black text-blue-600 dark:text-blue-400 text-base">{formatMoney(totals.total)}</TableHead>
                                {type === "cobrar" && <TableHead></TableHead>}
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/dashboard/reportes" className="hover:text-foreground transition-colors">Volver a Reportes</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Antigüedad de Saldos <span className="text-muted-foreground font-normal"> (Aging)</span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm max-w-xl">
                        Conoce quién te debe (Cuentas por Cobrar) y a quién le debes (Cuentas por Pagar) clasificado por tiempo de atraso.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 bg-background w-full sm:w-auto">
                        <Download className="w-4 h-4" /> Exportar Excel
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="cobrar" className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-2 rounded-xl border border-border/50">
                    <TabsList className="grid w-full sm:w-[400px] grid-cols-2 h-10 p-1">
                        <TabsTrigger value="cobrar" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            Cuentas por Cobrar
                        </TabsTrigger>
                        <TabsTrigger value="pagar" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                            Cuentas por Pagar
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-[250px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar contacto..."
                                className="pl-9 h-9 bg-background focus-visible:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="cobrar" className="space-y-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-br from-blue-50/50 to-sky-50/50 dark:from-blue-950/20 dark:to-sky-950/20 border-b border-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Antigüedad - Cuentas por Cobrar (Clientes)</CardTitle>
                                    <CardDescription>Dinero pendiente de cobro en la calle.</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">CXC</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-4">
                            {renderTable(AGING_COBRAR, "cobrar")}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pagar" className="space-y-4 focus-visible:outline-none focus-visible:ring-0 mt-0">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20 border-b border-border/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-rose-900 dark:text-rose-100">Antigüedad - Cuentas por Pagar (Suplidores)</CardTitle>
                                    <CardDescription>Facturas pendientes de pago a proveedores.</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">CXP</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-4">
                            {renderTable(AGING_PAGAR, "pagar")}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
