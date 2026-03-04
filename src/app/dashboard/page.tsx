"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, ChevronDown, CheckCircle2 } from "lucide-react";
import { IngresosGastosBar } from "@/components/dashboard/IngresosGastosBar";
import { ResumenGastosDonut } from "@/components/dashboard/ResumenGastosDonut";
import { AntiguedadHorizontalBar } from "@/components/dashboard/AntiguedadHorizontalBar";

const cobrarData = [
    { name: "Corriente", value: 3345.50 },
    { name: "0-30", value: 2231.00 },
    { name: "31-60", value: 1857.30 },
    { name: "61-90", value: 1045.50 },
    { name: "90+", value: 850.00 },
];

const pagarData = [
    { name: "Corriente", value: 654.32 },
    { name: "0-30", value: 2231.00 },
    { name: "31-60", value: 850.43 },
    { name: "61-90", value: 500.00 },
    { name: "90+", value: 0 },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
                <Link href="/dashboard/invoices/new">
                    <Button className="bg-gradient-brand glow-sm-brand border-0 text-white shadow-none hover:opacity-90">
                        <Plus className="mr-2 w-4 h-4" /> Crear Factura
                    </Button>
                </Link>

            </div>

            {/* 3-Column Layout: Similar to Cashflow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: Banks & Activities */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold">Cuentas de Bancos</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between font-medium text-sm mb-4 cursor-pointer hover:text-primary">
                                    <span className="flex items-center"><ChevronDown className="w-4 h-4 mr-1" /> Efectivo & Cuentas</span>
                                    <span>$2,100,749.00</span>
                                </div>
                                <div className="pl-5 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs">BP</div>
                                            <div>
                                                <p className="font-semibold text-foreground">Corriente</p>
                                                <p className="text-[10px] text-muted-foreground">Banco Popular</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">$1,250,423.59</p>
                                            <p className="text-[10px] text-muted-foreground">Actualizado</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-blue-700/10 flex items-center justify-center text-blue-800 font-bold text-xs">BR</div>
                                            <div>
                                                <p className="font-semibold text-foreground">Corriente</p>
                                                <p className="text-[10px] text-muted-foreground">Banreservas</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">$850,325.41</p>
                                            <p className="text-[10px] text-muted-foreground">Actualizado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between font-medium text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                    <span className="flex items-center"><ChevronDown className="w-4 h-4 mr-1 -rotate-90" /> Tarjetas de Crédito</span>
                                    <span>-$80,095.37</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between font-medium text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                    <span className="flex items-center"><ChevronDown className="w-4 h-4 mr-1 -rotate-90" /> Prestamos</span>
                                    <span>-$750,225.30</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t-2 border-border flex items-center justify-between font-bold">
                                <span>Balance</span>
                                <span>DOP$1,270,428.33</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold">Actividades</CardTitle>
                            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">Mostrar: Semana ˅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-red-500 bg-background text-red-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 box-content"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold text-red-500">En atraso</h4>
                                            <span className="text-[10px] text-muted-foreground">Hace 5 días</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Pago pendiente para la <span className="text-primary cursor-pointer hover:underline">factura #1234</span> de Terra Performance Inc.</p>
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 box-content"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold">Pago entrante</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Tienes un <span className="text-primary cursor-pointer hover:underline">pago entrante</span> de Joey Mantia.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CENTER COLUMN: Main Charts (Income, Invoices, Expenses) */}
                <div className="lg:col-span-6 space-y-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                            <CardTitle className="text-base font-semibold">Ingresos & Gastos</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <IngresosGastosBar />
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50 text-center">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Ingresos</p>
                                    <p className="text-lg font-bold text-foreground">$50,801.84</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Gastos</p>
                                    <p className="text-lg font-bold text-muted-foreground">-$30,200.00</p>
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Resultado</p>
                                    <p className="text-lg font-bold text-emerald-500">$20,601.84</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold">Facturas & Cobros</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-10 w-full flex rounded-sm overflow-hidden text-white font-bold text-xs mt-2">
                                <div className="bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center pl-3" style={{ width: '60%' }}>$18,500.50</div>
                                <div className="bg-amber-400 hover:bg-amber-500 transition-colors flex items-center pl-3" style={{ width: '30%' }}>$12,300.45</div>
                                <div className="bg-rose-500 hover:bg-rose-600 transition-colors flex items-center pl-3" style={{ width: '10%' }}>$3,550.00</div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                                <span>Cobrado</span>
                                <span>Pendiente</span>
                                <span>En Atraso</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-semibold">Resumen de Gastos</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center justify-between">
                            <div className="w-full sm:w-1/2">
                                <ResumenGastosDonut />
                            </div>
                            <div className="w-full sm:w-1/2 space-y-3 mt-6 sm:mt-0">
                                <p className="text-xs text-muted-foreground font-semibold mb-4">Categorías Principales</p>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                                        <span className="font-medium">Nómina</span>
                                    </div>
                                    <span className="text-muted-foreground">$12,080</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                        <span className="font-medium">Mercadeo</span>
                                    </div>
                                    <span className="text-muted-foreground">$6,040</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                                        <span className="font-medium">Alquiler oficina</span>
                                    </div>
                                    <span className="text-muted-foreground">$4,530</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
                                        <span className="font-medium">Misceláneo</span>
                                    </div>
                                    <span className="text-muted-foreground">$2,416</span>
                                </div>
                                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="font-medium">Todo lo demás</span>
                                    </div>
                                    <span className="text-muted-foreground">$9,060</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Aging */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle className="text-base font-semibold">Antigüedad por Cobrar</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <AntiguedadHorizontalBar data={cobrarData} color="#10b981" />
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total por cobrar</span>
                                <span className="font-bold text-emerald-500">$9,329.30</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <CardTitle className="text-base font-semibold">Antigüedad por Pagar</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <AntiguedadHorizontalBar data={pagarData} color="#f43f5e" />
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total por pagar</span>
                                <span className="font-bold text-rose-500">$4,235.75</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
