"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Download, Printer, Filter, Calendar as CalendarIcon,
    TrendingUp, TrendingDown, DollarSign, PieChart,
    ChevronDown, ChevronRight, Calculator, FileText, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Profit & Loss (Estado de Resultados)
const MOCK_PNL = {
    ingresos: [
        {
            id: "41", name: "Ingresos Operacionales", amount: 1540000,
            subAccounts: [
                { id: "4101", name: "Ventas de Mercancía", amount: 1200000 },
                { id: "4102", name: "Servicios Prestados", amount: 340000 }
            ]
        },
        {
            id: "42", name: "Otros Ingresos", amount: 15000,
            subAccounts: [
                { id: "4201", name: "Intereses Ganados", amount: 15000 }
            ]
        }
    ],
    costos: [
        {
            id: "51", name: "Costos de Ventas", amount: 480000,
            subAccounts: [
                { id: "5101", name: "Costo de Mercancía Vendida", amount: 450000 },
                { id: "5102", name: "Descuentos en Compras", amount: -30000 }
            ]
        }
    ],
    gastos: [
        {
            id: "61", name: "Gastos Administrativos", amount: 280000,
            subAccounts: [
                { id: "6101", name: "Sueldos y Salarios", amount: 150000 },
                { id: "6102", name: "Alquiler", amount: 80000 },
                { id: "6103", name: "Servicios Públicos", amount: 50000 }
            ]
        },
        {
            id: "62", name: "Gastos de Ventas", amount: 125000,
            subAccounts: [
                { id: "6201", name: "Publicidad y Mercadeo", amount: 85000 },
                { id: "6202", name: "Comisiones por Ventas", amount: 40000 }
            ]
        }
    ]
};

// Mock Data for Balance Sheet (Balance General)
const MOCK_BALANCE = {
    activos: [
        {
            id: "11", name: "Activos Corrientes", amount: 2500000,
            subAccounts: [
                { id: "1101", name: "Efectivo y Caja", amount: 450000 },
                { id: "1102", name: "Bancos", amount: 1250000 },
                { id: "1103", name: "Cuentas por Cobrar Clientes", amount: 550000 },
                { id: "1104", name: "Inventario", amount: 250000 }
            ]
        },
        {
            id: "12", name: "Activos Fijos", amount: 1800000,
            subAccounts: [
                { id: "1201", name: "Maquinaria y Equipo", amount: 1200000 },
                { id: "1202", name: "Equipos de Oficina", amount: 400000 },
                { id: "1203", name: "Depreciación Acumulada", amount: -200000 }
            ]
        }
    ],
    pasivos: [
        {
            id: "21", name: "Pasivos Corrientes", amount: 850000,
            subAccounts: [
                { id: "2101", name: "Cuentas por Pagar Proveedores", amount: 450000 },
                { id: "2102", name: "Impuestos por Pagar (ITBIS)", amount: 125000 },
                { id: "2103", name: "Nómina por Pagar", amount: 275000 }
            ]
        },
        {
            id: "22", name: "Pasivos a Largo Plazo", amount: 1200000,
            subAccounts: [
                { id: "2201", name: "Préstamos Bancarios", amount: 1200000 }
            ]
        }
    ],
    patrimonio: [
        {
            id: "31", name: "Capital Social", amount: 1500000,
            subAccounts: [
                { id: "3101", name: "Aportes Sociales", amount: 1500000 }
            ]
        },
        {
            id: "32", name: "Resultados", amount: 750000, // Calculated dynamically in reality
            subAccounts: [
                { id: "3201", name: "Resultados Acumulados", amount: 80000 },
                { id: "3202", name: "Utilidad del Ejercicio", amount: 670000 }
            ]
        }
    ]
};


export default function ReportesFinancierosPage() {
    const [dateRange, setDateRange] = useState("this_year");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatMoney = (amount: number) => {
        return `RD$ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // P&L Calculations
    const totalIngresos = MOCK_PNL.ingresos.reduce((a, b) => a + b.amount, 0);
    const totalCostos = MOCK_PNL.costos.reduce((a, b) => a + b.amount, 0);
    const utilidadBruta = totalIngresos - totalCostos;
    const totalGastos = MOCK_PNL.gastos.reduce((a, b) => a + b.amount, 0);
    const utilidadNeta = utilidadBruta - totalGastos;
    const margenNeto = (utilidadNeta / totalIngresos) * 100;

    // Balance Sheet Calculations
    const totalActivos = MOCK_BALANCE.activos.reduce((a, b) => a + b.amount, 0);
    const totalPasivos = MOCK_BALANCE.pasivos.reduce((a, b) => a + b.amount, 0);
    const totalPatrimonio = MOCK_BALANCE.patrimonio.reduce((a, b) => a + b.amount, 0);

    const AccountRow = ({ account, level = 0, isTotal = false, isNet = false }: { account: any, level?: number, isTotal?: boolean, isNet?: boolean }) => {
        const hasChildren = account.subAccounts && account.subAccounts.length > 0;
        const isExpanded = expandedRows[account.id];

        return (
            <>
                <div
                    className={cn(
                        "flex justify-between py-3 border-b border-border/40 transition-colors",
                        level === 0 && !isTotal && !isNet ? "font-semibold bg-muted/20" : "",
                        isTotal ? "font-bold bg-muted/50 border-t-2 border-border" : "",
                        isNet ? "font-black text-lg bg-primary/10 text-primary border-t-2 border-primary/20 py-4 rounded-b-lg" : "hover:bg-muted/40",
                        hasChildren ? "cursor-pointer" : ""
                    )}
                    style={{ paddingLeft: `${(level * 1.5) + 1}rem`, paddingRight: "1rem" }}
                    onClick={() => hasChildren && toggleRow(account.id)}
                >
                    <div className="flex items-center gap-2">
                        {hasChildren && (
                            isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        {!hasChildren && level > 0 && <div className="w-4" />}
                        {account.id && <span className="text-xs font-mono text-muted-foreground tabular-nums w-10 shrink-0">{account.id}</span>}
                        <span className={cn(isTotal || isNet ? "uppercase tracking-wide" : "")}>{account.name}</span>
                    </div>
                    <div className={cn("tabular-nums text-right", account.amount < 0 ? "text-rose-600" : "")}>
                        {formatMoney(account.amount)}
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        {account.subAccounts.map((sub: any) => (
                            <AccountRow key={sub.id} account={sub} level={level + 1} />
                        ))}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reportes Financieros</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Estados contables basados en el registro de tus transacciones y movimientos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] h-10 bg-background">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this_month">Este Mes</SelectItem>
                            <SelectItem value="last_month">Mes Anterior</SelectItem>
                            <SelectItem value="this_year">Este Año (YTD)</SelectItem>
                            <SelectItem value="last_year">Año Anterior</SelectItem>
                            <SelectItem value="custom">Rango Personalizado...</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filtros
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" /> Imprimir
                    </Button>
                    <Button className="bg-primary shadow-lg shadow-primary/20 gap-2">
                        <Download className="w-4 h-4" /> Exportar PDF
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="pnl" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 w-full max-w-md grid grid-cols-2">
                    <TabsTrigger value="pnl" className="rounded-md font-medium">Estado de Resultados (P&L)</TabsTrigger>
                    <TabsTrigger value="balance" className="rounded-md font-medium">Balance General</TabsTrigger>
                </TabsList>

                <TabsContent value="pnl" className="space-y-6 animate-in fade-in duration-300">

                    {/* Key Metrics P&L */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-background to-emerald-500/5 border-border/60 shadow-sm relative overflow-hidden">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Ingresos Totales
                                </p>
                                <p className="text-2xl font-bold mt-2">{formatMoney(totalIngresos)}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-background to-rose-500/5 border-border/60 shadow-sm">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-rose-600" /> Costos y Gastos
                                </p>
                                <p className="text-2xl font-bold mt-2 text-rose-600">{formatMoney(totalCostos + totalGastos)}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-background to-blue-500/5 border-border/60 shadow-sm">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-blue-600" /> Utilidad Bruta
                                </p>
                                <p className="text-2xl font-bold mt-2 text-blue-700">{formatMoney(utilidadBruta)}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white border-0 shadow-lg shadow-primary/20">
                            <CardContent className="p-5">
                                <p className="text-sm font-medium text-white/80 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Utilidad Neta</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Mg {margenNeto.toFixed(1)}%</span>
                                </p>
                                <p className="text-2xl font-bold mt-2">{formatMoney(utilidadNeta)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* P&L Statement Structure */}
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        <CardHeader className="bg-muted/10 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Estado de Resultados Integrales</CardTitle>
                                    <CardDescription>Del 01 de Enero al 31 de Diciembre del 2024</CardDescription>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <PieChart className="w-5 h-5" />
                                </div>
                            </div>
                        </CardHeader>
                        <div className="flex flex-col text-sm">
                            {/* INGRESOS */}
                            <div className="bg-muted/30 py-2 px-4 shadow-inner">
                                <h4 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Ingresos Operacionales</h4>
                            </div>
                            {MOCK_PNL.ingresos.map(acc => <AccountRow key={acc.id} account={acc} />)}
                            <AccountRow account={{ name: "Total Ingresos", amount: totalIngresos }} isTotal={true} />

                            {/* COSTOS */}
                            <div className="bg-muted/30 py-2 px-4 shadow-inner mt-4">
                                <h4 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Costos</h4>
                            </div>
                            {MOCK_PNL.costos.map(acc => <AccountRow key={acc.id} account={acc} />)}
                            <AccountRow account={{ name: "Total Costos", amount: totalCostos }} isTotal={true} />

                            <AccountRow account={{ name: "Utilidad Bruta (Ingresos - Costos)", amount: utilidadBruta }} isTotal={true} />

                            {/* GASTOS */}
                            <div className="bg-muted/30 py-2 px-4 shadow-inner mt-4">
                                <h4 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Gastos Operacionales</h4>
                            </div>
                            {MOCK_PNL.gastos.map(acc => <AccountRow key={acc.id} account={acc} />)}
                            <AccountRow account={{ name: "Total Gastos", amount: totalGastos }} isTotal={true} />

                            {/* NET INCOME */}
                            <AccountRow account={{ name: "Utilidad Neta del Ejercicio", amount: utilidadNeta }} isNet={true} />
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="balance" className="space-y-6 animate-in fade-in duration-300">

                    {/* Key Metrics Balance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-card border-border/60 shadow-sm">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Activos</p>
                                    <p className="text-2xl font-bold mt-1 text-emerald-600">{formatMoney(totalActivos)}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/60 shadow-sm">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Pasivos</p>
                                    <p className="text-2xl font-bold mt-1 text-rose-600">{formatMoney(totalPasivos)}</p>
                                </div>
                                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600">
                                    <ArrowRightLeft className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border/60 shadow-sm">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Patrimonio</p>
                                    <p className="text-2xl font-bold mt-1 text-blue-600">{formatMoney(totalPatrimonio)}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
                                    <Scale className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Accounting Equation Check widget */}
                    <div className={cn("p-4 rounded-xl border flex items-center justify-between", totalActivos === (totalPasivos + totalPatrimonio) ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20")}>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className={cn("w-5 h-5", totalActivos === (totalPasivos + totalPatrimonio) ? "text-emerald-600" : "text-rose-600")} />
                            <span className="font-semibold text-sm">Ecuación Contable: {totalActivos === (totalPasivos + totalPatrimonio) ? "Cuadrada" : "Descuadrada"}</span>
                        </div>
                        <div className="text-sm font-mono flex items-center gap-2">
                            <span>Activo ({formatMoney(totalActivos)})</span>
                            <span className="font-bold">=</span>
                            <span>Pasivo + Patrimonio ({formatMoney(totalPasivos + totalPatrimonio)})</span>
                        </div>
                    </div>

                    {/* Balance Sheet Structure */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Activos Column */}
                        <Card className="overflow-hidden border-border/60 shadow-sm">
                            <CardHeader className="bg-emerald-500/5 border-b pb-4">
                                <CardTitle className="text-emerald-700">ACTIVOS</CardTitle>
                                <CardDescription>Bienes y derechos de la empresa</CardDescription>
                            </CardHeader>
                            <div className="flex flex-col text-sm h-full">
                                {MOCK_BALANCE.activos.map(acc => <AccountRow key={acc.id} account={acc} />)}
                                <div className="mt-auto">
                                    <AccountRow account={{ name: "Total de Activos", amount: totalActivos }} isNet={true} />
                                </div>
                            </div>
                        </Card>

                        {/* Pasivos & Patrimonio Column */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-border/60 shadow-sm">
                                <CardHeader className="bg-rose-500/5 border-b pb-4">
                                    <CardTitle className="text-rose-700">PASIVOS</CardTitle>
                                    <CardDescription>Deudas y obligaciones a terceros</CardDescription>
                                </CardHeader>
                                <div className="flex flex-col text-sm">
                                    {MOCK_BALANCE.pasivos.map(acc => <AccountRow key={acc.id} account={acc} />)}
                                    <AccountRow account={{ name: "Total de Pasivos", amount: totalPasivos }} isTotal={true} />
                                </div>
                            </Card>

                            <Card className="overflow-hidden border-border/60 shadow-sm">
                                <CardHeader className="bg-blue-500/5 border-b pb-4">
                                    <CardTitle className="text-blue-700">PATRIMONIO</CardTitle>
                                    <CardDescription>Obligaciones con los accionistas y resultados</CardDescription>
                                </CardHeader>
                                <div className="flex flex-col text-sm">
                                    {MOCK_BALANCE.patrimonio.map(acc => <AccountRow key={acc.id} account={acc} />)}
                                    <AccountRow account={{ name: "Total del Patrimonio", amount: totalPatrimonio }} isTotal={true} />
                                </div>
                            </Card>

                            <Card className="overflow-hidden border-transparent shadow-none bg-transparent">
                                <div className="flex flex-col text-sm">
                                    <AccountRow account={{ name: "Total Pasivo + Patrimonio", amount: totalPasivos + totalPatrimonio }} isNet={true} />
                                </div>
                            </Card>
                        </div>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    );
}

// Missing icons from lucide-react not imported at top
import { Building2, ArrowRightLeft, Scale, CheckCircle2 } from "lucide-react";
