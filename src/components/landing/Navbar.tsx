"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui";
import {
    ChevronDown, FileText, ShoppingCart, Calculator, Boxes, PieChart,
    Users, Receipt, Store, Building2, Briefcase, Zap, BarChart3, Globe,
    Shield, Cpu, CreditCard, Truck, Menu, X
} from "lucide-react";
import { useState } from "react";

const FUNCIONES = [
    { href: "/dashboard/invoices", icon: FileText, label: "Facturacion y Ventas", desc: "Crea facturas e-CF, cotizaciones y notas de credito.", color: "text-purple-500" },
    { href: "/dashboard/bancos", icon: Receipt, label: "Cuentas Bancarias", desc: "Concilia pagos y gestiona tus cuentas bancarias.", color: "text-cyan-500" },
    { href: "/dashboard/gastos", icon: ShoppingCart, label: "Gastos y Compras", desc: "Registra, organiza y controla todos tus egresos.", color: "text-rose-500" },
    { href: "/dashboard/contabilidad", icon: Calculator, label: "Contabilidad y Fiscal", desc: "Balance general, diario, 606/607 y declaraciones.", color: "text-amber-500" },
    { href: "/dashboard/products", icon: Boxes, label: "Inventario", desc: "Productos, almacenes, ajustes y categorias.", color: "text-emerald-500" },
    { href: "/dashboard/reportes", icon: PieChart, label: "Reportes", desc: "Reportes inteligentes de ventas, gastos y mas.", color: "text-blue-500" },
];

const SOLUCIONES = [
    { href: "/soluciones/facturacion-electronica", icon: Zap, label: "Facturacion Electronica", desc: "Emite e-CF validados por la DGII al instante.", badge: "PRO", badgeColor: "bg-purple-100 text-purple-700" },
    { href: "/soluciones/punto-de-venta", icon: Store, label: "Punto de Venta (POS)", desc: "Sistema de caja rapido, moderno y facil de usar.", badge: "NUEVO", badgeColor: "bg-cyan-100 text-cyan-700" },
    { href: "/soluciones/nomina", icon: Users, label: "Nomina y RRHH", desc: "Sueldos, TSS, ISR y gestion de empleados.", badge: null, badgeColor: "" },
    { href: "/soluciones/contabilidad", icon: BarChart3, label: "Contabilidad Integrada", desc: "Plan de cuentas, asientos automaticos y reportes.", badge: null, badgeColor: "" },
    { href: "/soluciones/inventario", icon: Truck, label: "Control de Inventario", desc: "Multi-almacen, ajustes y alertas de stock.", badge: null, badgeColor: "" },
    { href: "/soluciones/multiempresa", icon: Globe, label: "Multiempresa", desc: "Gestiona varias empresas desde un solo panel.", badge: null, badgeColor: "" },
];

const TAMANO = [
    { href: "/soluciones", icon: Briefcase, label: "Emprendedores", desc: "Todo lo esencial para iniciar." },
    { href: "/soluciones", icon: Store, label: "Pequena Empresa", desc: "Herramientas para crecer rapido." },
    { href: "/soluciones", icon: Building2, label: "Mediana Empresa", desc: "Solucion completa y escalable." },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-100/30 dark:border-purple-900/20 backdrop-blur-xl bg-white/70 dark:bg-black/70">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">🍭</div>
                        <span className="text-xl font-black tracking-tight">Lolli<span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">pop</span></span>
                    </Link>

                    <nav className="hidden lg:flex gap-1 h-full items-center">
                        {/* Funciones Mega Menu */}
                        <div className="group h-16 flex items-center relative px-3">
                            <button className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 h-full">
                                Funciones <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-[64px] left-[-100px] w-[700px] bg-white dark:bg-neutral-950 border border-purple-100/40 dark:border-purple-900/30 rounded-2xl shadow-2xl shadow-purple-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 grid grid-cols-2 gap-1 z-50">
                                {FUNCIONES.map(f => (
                                    <Link key={f.href} href={f.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-colors group/item">
                                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/30 dark:to-cyan-900/20 flex items-center justify-center shrink-0 ${f.color}`}>
                                            <f.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm group-hover/item:text-purple-600 transition-colors">{f.label}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{f.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Soluciones Mega Menu */}
                        <div className="group h-16 flex items-center relative px-3">
                            <button className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 h-full">
                                Soluciones <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-[64px] left-[-200px] w-[800px] bg-white dark:bg-neutral-950 border border-purple-100/40 dark:border-purple-900/30 rounded-2xl shadow-2xl shadow-purple-500/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 grid grid-cols-12 gap-6 z-50">
                                {/* Soluciones column */}
                                <div className="col-span-8 border-r border-purple-100/40 dark:border-purple-800/30 pr-6">
                                    <h4 className="text-[10px] font-bold text-purple-400 tracking-[0.15em] uppercase mb-4">Por Necesidad</h4>
                                    <div className="grid grid-cols-2 gap-1">
                                        {SOLUCIONES.map(s => (
                                            <Link key={s.href} href={s.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-colors group/item">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/30 flex items-center justify-center shrink-0 text-purple-500">
                                                    <s.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="font-semibold text-sm group-hover/item:text-purple-600 transition-colors">{s.label}</p>
                                                        {s.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${s.badgeColor}`}>{s.badge}</span>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                {/* Tamano column */}
                                <div className="col-span-4">
                                    <h4 className="text-[10px] font-bold text-purple-400 tracking-[0.15em] uppercase mb-4">Por Tamano</h4>
                                    <div className="space-y-1">
                                        {TAMANO.map(t => (
                                            <Link key={t.label} href={t.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-colors group/item">
                                                <t.icon className="w-4 h-4 mt-0.5 text-cyan-500 shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-sm group-hover/item:text-purple-600 transition-colors">{t.label}</p>
                                                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {/* CTA inside mega menu */}
                                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/30 dark:to-cyan-900/20 border border-purple-200/50 dark:border-purple-800/30">
                                        <p className="font-bold text-sm mb-1">No sabes cual elegir?</p>
                                        <p className="text-xs text-muted-foreground mb-3">Te ayudamos a encontrar el plan ideal para tu negocio.</p>
                                        <Link href="/register"><Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-0 text-xs">Ver Planes</Button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3">Precios</Link>
                        <Link href="/soluciones" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3">Recursos</Link>
                    </nav>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-purple-600 transition-colors">Iniciar sesion</Link>
                    <Link href="/register" className="hidden sm:block">
                        <ShimmerButton className="text-sm px-6 py-2.5">15 Dias Gratis</ShimmerButton>
                    </Link>
                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-purple-100/30 bg-white dark:bg-neutral-950 p-4 space-y-3 animate-float-up">
                    {FUNCIONES.map(f => (
                        <Link key={f.href} href={f.href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>
                            <f.icon className={`w-4 h-4 ${f.color}`} /><span className="text-sm font-medium">{f.label}</span>
                        </Link>
                    ))}
                    <div className="border-t pt-3 mt-3 space-y-2">
                        <Link href="/login" className="block text-sm font-medium text-center py-2">Iniciar sesion</Link>
                        <Link href="/register" className="block"><Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white">15 Dias Gratis</Button></Link>
                    </div>
                </div>
            )}
        </header>
    );
}
