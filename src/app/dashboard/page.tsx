"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PlusIcon,
    EllipsisHorizontalIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ArrowUpRightIcon,
    ArrowDownRightIcon,
    BanknotesIcon,
    ReceiptPercentIcon,
    ShoppingCartIcon,
    ClockIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    CreditCardIcon,
    WalletIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    DocumentTextIcon,
    UsersIcon,
    ArrowPathIcon,
    ChartPieIcon,
} from "@heroicons/react/24/outline";
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

const KPI_STATS = [
    {
        label: "Ingresos del Mes",
        value: "RD$ 50,801.84",
        change: "+12.4%",
        up: true,
        icon: ArrowTrendingUpIcon,
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
        label: "Gastos del Mes",
        value: "RD$ 30,200.00",
        change: "-3.1%",
        up: false,
        icon: ShoppingCartIcon,
        bg: "bg-rose-50 dark:bg-rose-950/30",
        iconColor: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200/60 dark:border-rose-800/40",
    },
    {
        label: "Por Cobrar",
        value: "RD$ 9,329.30",
        change: "5 facturas",
        up: null,
        icon: ReceiptPercentIcon,
        bg: "bg-blue-50 dark:bg-blue-950/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200/60 dark:border-blue-800/40",
    },
    {
        label: "Por Pagar",
        value: "RD$ 4,235.75",
        change: "3 facturas",
        up: null,
        icon: CreditCardIcon,
        bg: "bg-amber-50 dark:bg-amber-950/30",
        iconColor: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200/60 dark:border-amber-800/40",
    },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Panel de Control</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Resumen financiero · marzo 2025</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                        <ArrowPathIcon className="w-3.5 h-3.5" /> Actualizar
                    </Button>
                    <Link href="/dashboard/invoices/new">
                        <Button className="bg-gradient-brand border-0 text-white shadow-sm hover:opacity-90 gap-1.5">
                            <PlusIcon className="w-4 h-4" /> Nueva Factura
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── KPI Row ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {KPI_STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`relative rounded-2xl border ${stat.border} ${stat.bg} p-5 overflow-hidden group hover:shadow-md transition-all duration-200`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <div className={`w-8 h-8 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <p className="text-xl font-bold text-foreground leading-none mb-2">{stat.value}</p>
                            <div className="flex items-center gap-1">
                                {stat.up === true && <ArrowUpRightIcon className="w-3.5 h-3.5 text-emerald-500" />}
                                {stat.up === false && <ArrowDownRightIcon className="w-3.5 h-3.5 text-rose-500" />}
                                {stat.up === null && <DocumentTextIcon className="w-3.5 h-3.5 text-muted-foreground/60" />}
                                <span className={`text-xs font-semibold ${stat.up === true ? "text-emerald-600" : stat.up === false ? "text-rose-500" : "text-muted-foreground"}`}>
                                    {stat.change}
                                </span>
                                {stat.up !== null && (
                                    <span className="text-[10px] text-muted-foreground ml-0.5">vs mes anterior</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── 3-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* ── LEFT: Banks & Activities ── */}
                <div className="lg:col-span-3 space-y-5">
                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <BuildingOffice2Icon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Cuentas de Banco</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 space-y-5">
                            <div>
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3 cursor-pointer hover:text-foreground transition-colors">
                                    <span className="flex items-center gap-1">
                                        <WalletIcon className="w-3.5 h-3.5" />
                                        Efectivo &amp; Cuentas
                                    </span>
                                    <span className="text-foreground font-bold">RD$2.1M</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { abbr: "BP", name: "Banco Popular", type: "Corriente", amount: "$1,250,423.59", color: "bg-blue-500/15 text-blue-700" },
                                        { abbr: "BR", name: "Banreservas", type: "Corriente", amount: "$850,325.41", color: "bg-indigo-500/15 text-indigo-700" },
                                    ].map(b => (
                                        <div key={b.abbr} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-xl ${b.color} flex items-center justify-center font-bold text-[10px]`}>{b.abbr}</div>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground leading-none">{b.type}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{b.name}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-foreground">{b.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {[
                                { label: "Tarjetas de Crédito", amount: "-$80,095.37", icon: CreditCardIcon },
                                { label: "Préstamos", amount: "-$750,225.30", icon: BanknotesIcon },
                            ].map(item => {
                                const Ic = item.icon;
                                return (
                                    <div key={item.label} className="pt-3 border-t border-border/40">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                            <span className="flex items-center gap-1.5">
                                                <Ic className="w-3.5 h-3.5" />
                                                {item.label}
                                            </span>
                                            <span className="font-semibold text-rose-500">{item.amount}</span>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-3 border-t-2 border-border flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Balance total</span>
                                <span className="text-sm font-black text-gradient">RD$1,270,428</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ClockIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Actividades</CardTitle>
                            </div>
                            <span className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground border border-border/50 rounded-md px-2 py-1 font-medium">
                                Esta semana
                            </span>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="space-y-4 relative">
                                <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
                                {[
                                    {
                                        icon: ExclamationCircleIcon,
                                        iconColor: "text-rose-500",
                                        dotColor: "border-rose-400 bg-rose-50",
                                        title: "En atraso",
                                        titleColor: "text-rose-600",
                                        desc: "Pago pendiente · factura",
                                        link: "#1234",
                                        sub: "Terra Performance · hace 5 días",
                                    },
                                    {
                                        icon: CheckCircleIcon,
                                        iconColor: "text-emerald-500",
                                        dotColor: "border-emerald-400 bg-emerald-50",
                                        title: "Pago entrante",
                                        titleColor: "text-emerald-600",
                                        desc: "Pago recibido de",
                                        link: "Joey Mantia",
                                        sub: "Hoy · RD$ 12,500.00",
                                    },
                                ].map((a, i) => {
                                    const Ic = a.icon;
                                    return (
                                        <div key={i} className="relative flex gap-3 pl-6">
                                            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${a.dotColor} z-10 flex items-center justify-center`}>
                                                <Ic className={`w-2.5 h-2.5 ${a.iconColor}`} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${a.titleColor}`}>{a.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {a.desc} <span className="text-primary font-medium cursor-pointer hover:underline">{a.link}</span>
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.sub}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── CENTER: Charts ── */}
                <div className="lg:col-span-6 space-y-5">
                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ChartBarIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Ingresos &amp; Gastos</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <IngresosGastosBar />
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-border/40">
                                {[
                                    { label: "Ingresos", value: "$50,801", icon: ArrowTrendingUpIcon, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                                    { label: "Gastos", value: "$30,200", icon: ArrowTrendingDownIcon, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
                                    { label: "Resultado", value: "$20,601", icon: ArrowUpRightIcon, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
                                ].map(m => {
                                    const Ic = m.icon;
                                    return (
                                        <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
                                            <Ic className={`w-4 h-4 ${m.color} mx-auto mb-1.5`} />
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{m.label}</p>
                                            <p className={`text-base font-black ${m.color} mt-0.5`}>{m.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ReceiptPercentIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Facturas &amp; Cobros</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="h-9 w-full flex rounded-xl overflow-hidden text-white font-bold text-[11px] shadow-inner">
                                <div className="bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center pl-3 gap-1.5" style={{ width: '60%' }}>
                                    <CheckCircleIcon className="w-3 h-3 opacity-80" /> $18,500
                                </div>
                                <div className="bg-amber-400 hover:bg-amber-500 transition-colors flex items-center pl-3 gap-1.5" style={{ width: '30%' }}>
                                    <ClockIcon className="w-3 h-3 opacity-80" /> $12,300
                                </div>
                                <div className="bg-rose-500 hover:bg-rose-600 transition-colors flex items-center pl-3 gap-1.5" style={{ width: '10%' }}>
                                    <ExclamationCircleIcon className="w-3 h-3 opacity-80" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Cobrado</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pendiente</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> En Atraso</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ChartPieIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Resumen de Gastos</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-full sm:w-1/2">
                                <ResumenGastosDonut />
                            </div>
                            <div className="w-full sm:w-1/2 space-y-2.5">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Categorías</p>
                                {[
                                    { label: "Nómina", value: "$12,080", color: "bg-emerald-500" },
                                    { label: "Mercadeo", value: "$6,040", color: "bg-blue-500" },
                                    { label: "Alquiler oficina", value: "$4,530", color: "bg-amber-500" },
                                    { label: "Misceláneo", value: "$2,416", color: "bg-rose-500" },
                                    { label: "Otros", value: "$9,060", color: "bg-slate-300 dark:bg-slate-600" },
                                ].map(cat => (
                                    <div key={cat.label} className="flex items-center justify-between text-xs last:pt-2 last:border-t last:border-border/40">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-sm ${cat.color}`} />
                                            <span className="font-medium text-foreground">{cat.label}</span>
                                        </div>
                                        <span className="font-bold text-muted-foreground">{cat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── RIGHT: Aging + Quick Actions ── */}
                <div className="lg:col-span-3 space-y-5">
                    {[
                        {
                            title: "Por Cobrar",
                            total: "RD$ 9,329.30",
                            totalColor: "text-emerald-600",
                            data: cobrarData,
                            color: "#10b981",
                            icon: UsersIcon,
                            label: "Antigüedad por Cobrar",
                        },
                        {
                            title: "Por Pagar",
                            total: "RD$ 4,235.75",
                            totalColor: "text-rose-500",
                            data: pagarData,
                            color: "#f43f5e",
                            icon: CreditCardIcon,
                            label: "Antigüedad por Pagar",
                        },
                    ].map(section => {
                        const Ic = section.icon;
                        return (
                            <Card key={section.title} className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-5 px-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Ic className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <CardTitle className="text-sm font-semibold">{section.label}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                        <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="px-5 pb-5">
                                    <AntiguedadHorizontalBar data={section.data} color={section.color} />
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            Total {section.title.toLowerCase()}
                                        </span>
                                        <span className={`font-black text-sm ${section.totalColor}`}>{section.total}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="pb-3 pt-5 px-5">
                            <CardTitle className="text-sm font-semibold">Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 grid grid-cols-2 gap-2">
                            {[
                                { label: "Nueva Factura", icon: DocumentTextIcon, href: "/dashboard/invoices/new", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
                                { label: "Nuevo Gasto", icon: ShoppingCartIcon, href: "/dashboard/gastos/new", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30" },
                                { label: "Ver Clientes", icon: UsersIcon, href: "/dashboard/contacts", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
                                { label: "Reportes", icon: ChartBarIcon, href: "/dashboard/reports", color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
                            ].map(action => {
                                const Ic = action.icon;
                                return (
                                    <Link key={action.label} href={action.href}>
                                        <div className={`${action.color} rounded-xl p-3 flex flex-col items-center gap-2 text-center hover:shadow-sm transition-all duration-150 cursor-pointer border border-transparent hover:border-border/30`}>
                                            <Ic className="w-5 h-5" />
                                            <span className="text-[11px] font-semibold leading-tight">{action.label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
