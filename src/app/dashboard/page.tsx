"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
    ArrowUpRightIcon, ArrowDownRightIcon, BanknotesIcon,
    ReceiptPercentIcon, ShoppingCartIcon, ClockIcon,
    ExclamationCircleIcon, CheckCircleIcon, CreditCardIcon,
    WalletIcon, BuildingOffice2Icon, ChartBarIcon,
    DocumentTextIcon, UsersIcon, ArrowPathIcon, ChartPieIcon,
} from "@heroicons/react/24/outline";
import { IngresosGastosBar } from "@/components/dashboard/IngresosGastosBar";
import { ResumenGastosDonut } from "@/components/dashboard/ResumenGastosDonut";
import { AntiguedadHorizontalBar } from "@/components/dashboard/AntiguedadHorizontalBar";
import { useEffect, useState } from "react";
import { companyStorage } from "@/lib/company-storage";
import { useCompany } from "@/contexts/CompanyContext";

function fmt(n: number) {
    return `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function monthOf(dateStr: string) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : { m: d.getMonth(), y: d.getFullYear() };
}

export default function DashboardOverview() {
    const { activeCompany } = useCompany();
    const [kpis, setKpis] = useState({ ingresos: 0, gastos: 0, porCobrar: 0, porCobrarCount: 0, porPagar: 0, porPagarCount: 0 });
    const [bancos, setBancos] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [cobrarData, setCobrarData] = useState<{ name: string; value: number }[]>([]);
    const [pagarData, setPagarData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeCompany) return;

        // ── Invoices ──
        let invoices: any[] = [];
        try { invoices = JSON.parse(companyStorage.get("invoice_emitted") || "[]"); } catch { }

        // ── Gastos ──
        let gastos: any[] = [];
        try { gastos = JSON.parse(companyStorage.get("gastos") || "[]"); } catch { }

        // ── Bancos ──
        let bancosList: any[] = [];
        try { bancosList = JSON.parse(companyStorage.get("bancos") || "[]"); } catch { }
        setBancos(bancosList);

        const now = new Date();
        const thisM = now.getMonth();
        const thisY = now.getFullYear();
        const today = now.toISOString().split("T")[0];

        // ── KPIs ──
        const ingresosMes = invoices
            .filter(inv => { const d = monthOf(inv.date); return d?.m === thisM && d?.y === thisY && !inv.isDraft; })
            .reduce((a, inv) => a + (inv.total || 0), 0);

        const gastosMes = gastos
            .filter(g => { const d = monthOf(g.fecha || g.date); return d?.m === thisM && d?.y === thisY; })
            .reduce((a, g) => a + (g.monto || g.amount || g.total || 0), 0);

        const pendientes = invoices.filter(inv => !inv.isDraft && inv.paymentStatus !== "pagada");
        const porCobrar = pendientes.reduce((a, inv) => a + (inv.total || 0), 0);

        // Gastos por pagar (pendientes)
        const gastosPendientes = gastos.filter(g => g.status === "pendiente");
        const porPagar = gastosPendientes.reduce((a, g) => a + (g.monto || g.amount || 0), 0);

        setKpis({
            ingresos: ingresosMes,
            gastos: gastosMes,
            porCobrar,
            porCobrarCount: pendientes.length,
            porPagar,
            porPagarCount: gastosPendientes.length,
        });

        // ── Aging (Por Cobrar) ──
        const aging = { "Corriente": 0, "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
        pendientes.forEach(inv => {
            const due = inv.vencimiento ? new Date(inv.vencimiento) : null;
            const days = due ? Math.floor((now.getTime() - due.getTime()) / 86400000) : 0;
            const amt = inv.total || 0;
            if (!due || days < 0) aging["Corriente"] += amt;
            else if (days <= 30) aging["0-30"] += amt;
            else if (days <= 60) aging["31-60"] += amt;
            else if (days <= 90) aging["61-90"] += amt;
            else aging["90+"] += amt;
        });
        setCobrarData(Object.entries(aging).map(([name, value]) => ({ name, value })));

        // ── Aging (Por Pagar) ──
        const agingP = { "Corriente": 0, "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
        gastosPendientes.forEach(g => {
            agingP["0-30"] += (g.monto || 0);
        });
        setPagarData(Object.entries(agingP).map(([name, value]) => ({ name, value })));

        // ── Recent Activity ──
        const activity: any[] = [];
        // Facturas recientes
        [...invoices]
            .filter(inv => !inv.isDraft)
            .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
            .slice(0, 3)
            .forEach(inv => {
                const isOverdue = inv.paymentStatus !== "pagada" && inv.vencimiento && inv.vencimiento < today;
                activity.push({
                    type: isOverdue ? "overdue" : inv.paymentStatus === "pagada" ? "paid" : "invoice",
                    title: isOverdue ? "Factura vencida" : inv.paymentStatus === "pagada" ? "Pago recibido" : "Factura emitida",
                    desc: `${inv.ecf || inv.id} · ${inv.cliente}`,
                    sub: `${inv.date} · ${fmt(inv.total || 0)}`,
                    href: `/dashboard/invoices/${inv.id}`,
                });
            });
        setRecentActivity(activity);
        setLoading(false);
    }, [activeCompany]);

    const now = new Date();
    const monthName = now.toLocaleString("es-DO", { month: "long", year: "numeric" });

    const KPI_STATS = [
        {
            label: "Ingresos del Mes",
            value: fmt(kpis.ingresos),
            change: `${kpis.porCobrarCount} fact. emitidas`,
            up: true,
            icon: ArrowTrendingUpIcon,
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-200/60 dark:border-emerald-800/40",
        },
        {
            label: "Gastos del Mes",
            value: fmt(kpis.gastos),
            change: `${kpis.porPagarCount} pend.`,
            up: false,
            icon: ShoppingCartIcon,
            bg: "bg-rose-50 dark:bg-rose-950/30",
            iconColor: "text-rose-600 dark:text-rose-400",
            border: "border-rose-200/60 dark:border-rose-800/40",
        },
        {
            label: "Por Cobrar",
            value: fmt(kpis.porCobrar),
            change: `${kpis.porCobrarCount} facturas`,
            up: null,
            icon: ReceiptPercentIcon,
            bg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            border: "border-blue-200/60 dark:border-blue-800/40",
        },
        {
            label: "Por Pagar",
            value: fmt(kpis.porPagar),
            change: `${kpis.porPagarCount} gastos`,
            up: null,
            icon: CreditCardIcon,
            bg: "bg-amber-50 dark:bg-amber-950/30",
            iconColor: "text-amber-600 dark:text-amber-400",
            border: "border-amber-200/60 dark:border-amber-800/40",
        },
    ];

    const totalBancos = bancos.reduce((a, b) => a + (b.saldo || 0), 0);

    return (
        <div className="space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Panel de Control</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Resumen financiero · <span className="capitalize">{monthName}</span>
                        {loading && <span className="ml-2 text-xs text-muted-foreground/50 animate-pulse">cargando...</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs text-muted-foreground" onClick={() => window.location.reload()}>
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
                            <Link href="/dashboard/bancos">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Ver</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 space-y-3">
                            {bancos.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-2">No hay cuentas registradas.</p>
                            ) : (
                                bancos.slice(0, 3).map(b => (
                                    <div key={b.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                                {b.banco?.substring(0, 2).toUpperCase() || "BN"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-foreground leading-none">{b.tipo || "Corriente"}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{b.banco}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-foreground tabular-nums">
                                            {b.moneda === "USD" ? "$" : "RD$"}{(b.saldo || 0).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div className="pt-3 border-t-2 border-border flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Balance total</span>
                                <span className="text-sm font-black text-gradient">RD$ {totalBancos.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ClockIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Actividad Reciente</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            {recentActivity.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-2">No hay actividad reciente.</p>
                            ) : (
                                <div className="space-y-4 relative">
                                    <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
                                    {recentActivity.map((a, i) => (
                                        <Link key={i} href={a.href || "#"}>
                                            <div className="relative flex gap-3 pl-6 hover:opacity-80 transition-opacity">
                                                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center
                                                    ${a.type === "overdue" ? "border-rose-400 bg-rose-50" : a.type === "paid" ? "border-emerald-400 bg-emerald-50" : "border-blue-400 bg-blue-50"}`}>
                                                    {a.type === "overdue"
                                                        ? <ExclamationCircleIcon className="w-2.5 h-2.5 text-rose-500" />
                                                        : a.type === "paid"
                                                            ? <CheckCircleIcon className="w-2.5 h-2.5 text-emerald-500" />
                                                            : <DocumentTextIcon className="w-2.5 h-2.5 text-blue-500" />}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold ${a.type === "overdue" ? "text-rose-600" : a.type === "paid" ? "text-emerald-600" : "text-blue-600"}`}>{a.title}</p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</p>
                                                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.sub}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
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
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <IngresosGastosBar />
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-border/40">
                                {[
                                    { label: "Ingresos", value: fmt(kpis.ingresos), icon: ArrowTrendingUpIcon, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                                    { label: "Gastos", value: fmt(kpis.gastos), icon: ArrowTrendingDownIcon, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
                                    { label: "Resultado", value: fmt(kpis.ingresos - kpis.gastos), icon: ArrowUpRightIcon, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
                                ].map(m => {
                                    const Ic = m.icon;
                                    return (
                                        <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
                                            <Ic className={`w-4 h-4 ${m.color} mx-auto mb-1.5`} />
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{m.label}</p>
                                            <p className={`text-sm font-black ${m.color} mt-0.5`}>{m.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Facturas & Cobros */}
                    <Card className="bg-card/60 backdrop-blur-xl shadow-sm border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-5">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ReceiptPercentIcon className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <CardTitle className="text-sm font-semibold">Facturas &amp; Cobros</CardTitle>
                            </div>
                            <Link href="/dashboard/invoices">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">Ver todas</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            {(() => {
                                const total = kpis.porCobrar + kpis.ingresos;
                                if (total === 0) return <p className="text-xs text-muted-foreground text-center py-4">No hay facturas este mes.</p>;
                                const cobradoPct = total > 0 ? Math.round((kpis.ingresos / total) * 100) : 0;
                                const pendPct = 100 - cobradoPct;
                                return (
                                    <>
                                        <div className="h-9 w-full flex rounded-xl overflow-hidden text-white font-bold text-[11px] shadow-inner">
                                            {cobradoPct > 0 && (
                                                <div className="bg-emerald-500 flex items-center pl-3 gap-1.5 transition-all" style={{ width: `${cobradoPct}%` }}>
                                                    <CheckCircleIcon className="w-3 h-3 opacity-80" />
                                                    {cobradoPct > 15 && fmt(kpis.ingresos)}
                                                </div>
                                            )}
                                            {pendPct > 0 && (
                                                <div className="bg-amber-400 flex items-center pl-3 gap-1.5 transition-all" style={{ width: `${pendPct}%` }}>
                                                    <ClockIcon className="w-3 h-3 opacity-80" />
                                                    {pendPct > 15 && fmt(kpis.porCobrar)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Cobrado ({cobradoPct}%)</span>
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pendiente ({pendPct}%)</span>
                                        </div>
                                    </>
                                );
                            })()}
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
                        </CardHeader>
                        <CardContent className="px-5 pb-5 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-full sm:w-1/2">
                                <ResumenGastosDonut />
                            </div>
                            <div className="w-full sm:w-1/2 space-y-2.5">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Este Mes</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">Total Gastos</span>
                                    <span className="font-bold text-rose-500">{fmt(kpis.gastos)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm border-t border-border/30 pt-2">
                                    <span className="font-medium text-foreground">Por Pagar</span>
                                    <span className="font-bold text-amber-600">{fmt(kpis.porPagar)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">Saldo Bancos</span>
                                    <span className="font-bold text-emerald-600">RD$ {totalBancos.toLocaleString()}</span>
                                </div>
                                <Link href="/dashboard/gastos" className="block">
                                    <Button variant="outline" size="sm" className="w-full text-xs mt-2">Ver todos los gastos</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── RIGHT: Aging + Quick Actions ── */}
                <div className="lg:col-span-3 space-y-5">
                    {[
                        { title: "Por Cobrar", total: fmt(kpis.porCobrar), totalColor: "text-emerald-600", data: cobrarData, color: "#10b981", icon: UsersIcon, label: "Antigüedad por Cobrar" },
                        { title: "Por Pagar", total: fmt(kpis.porPagar), totalColor: "text-rose-500", data: pagarData, color: "#f43f5e", icon: CreditCardIcon, label: "Antigüedad por Pagar" },
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
                                { label: "Ver Clientes", icon: UsersIcon, href: "/dashboard/clients", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
                                { label: "Reportes", icon: ChartBarIcon, href: "/dashboard/reportes", color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
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
