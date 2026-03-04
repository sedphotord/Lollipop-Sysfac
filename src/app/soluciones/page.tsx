import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, Calculator, CheckCircle2, FileText, Globe, Shield, Store, Truck, Users, Zap } from "lucide-react";

const SOLUCIONES = [
    {
        slug: "facturacion-electronica",
        icon: Zap,
        title: "Facturacion Electronica e-CF",
        desc: "Emite facturas electronicas certificadas por la DGII en segundos. Comprobantes B01, B02, B04, B14, B15 firmados digitalmente.",
        features: ["Firma digital automatica", "Envio directo a DGII", "Todos los tipos de NCF", "Formato 606/607 automatico", "Cotizaciones y notas de credito", "Multi-moneda"],
        color: "from-purple-600 to-purple-400",
        badge: "PRO",
    },
    {
        slug: "punto-de-venta",
        icon: Store,
        title: "Punto de Venta (POS)",
        desc: "Sistema de caja rapido e intuitivo. Busqueda de productos, calculos automaticos, tickets y facturas e-CF desde el POS.",
        features: ["Interfaz tactil moderna", "Busqueda instantanea", "Tickets y facturas e-CF", "Descuentos y promociones", "Modo offline basico", "Multi-caja"],
        color: "from-cyan-500 to-cyan-400",
        badge: "NUEVO",
    },
    {
        slug: "nomina",
        icon: Users,
        title: "Nomina y Recursos Humanos",
        desc: "Calcula sueldos, deducciones TSS/ISR, genera reportes de nomina y el formato 606 de seguridad social.",
        features: ["Calculo automatico TSS/ISR", "Historial de nomina", "Empleados y departamentos", "Formato 606 generado", "Vacaciones y permisos", "Recibos de pago"],
        color: "from-rose-500 to-rose-400",
        badge: null,
    },
    {
        slug: "contabilidad",
        icon: Calculator,
        title: "Contabilidad Integrada",
        desc: "Plan de cuentas dominicano, asientos automaticos al facturar, balance general y estados financieros NIIF.",
        features: ["Plan de cuentas DR", "Asientos automaticos", "Balance y Estado de Resultados", "Libro Diario y Mayor", "Conciliacion bancaria", "Reportes NIIF"],
        color: "from-amber-500 to-amber-400",
        badge: null,
    },
    {
        slug: "inventario",
        icon: Truck,
        title: "Control de Inventario",
        desc: "Administra productos, categorias, multi-almacen, ajustes de stock y alertas de minimo automaticas.",
        features: ["Multi-almacen", "Categorias y atributos", "Ajustes de inventario", "Alertas de stock", "Codigos de barra", "Reportes de movimiento"],
        color: "from-emerald-500 to-emerald-400",
        badge: null,
    },
    {
        slug: "multiempresa",
        icon: Globe,
        title: "Gestion Multiempresa",
        desc: "Administra varias empresas desde un solo panel. Cada una con su propia configuracion, numeraciones y reportes.",
        features: ["Panel centralizado", "Configuracion independiente", "Reportes consolidados", "Usuarios compartidos", "Cambio rapido de empresa", "Permisos por empresa"],
        color: "from-blue-500 to-blue-400",
        badge: null,
    },
];

export default function SolucionesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 md:py-28 relative overflow-hidden bg-[#faf9ff] dark:bg-neutral-950">
                    <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-400/15 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                        <p className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase mb-3">Soluciones</p>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Una solucion para cada{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">necesidad</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Lollipop es la plataforma mas completa para gestionar tu negocio en Republica Dominicana. Descubre cada modulo.
                        </p>
                    </div>
                </section>

                {/* Solutions grid */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="space-y-12 max-w-6xl mx-auto">
                            {SOLUCIONES.map((sol, i) => (
                                <div key={sol.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                                    <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sol.color} flex items-center justify-center text-white shadow-lg`}>
                                                <sol.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-2xl font-black">{sol.title}</h2>
                                                    {sol.badge && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold">{sol.badge}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed mb-6">{sol.desc}</p>
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {sol.features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />{f}
                                                </div>
                                            ))}
                                        </div>
                                        <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                                            Probar gratis <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                                        <div className="relative">
                                            <div className={`absolute -inset-4 bg-gradient-to-br ${sol.color} opacity-10 rounded-3xl blur-xl pointer-events-none`} />
                                            <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 shadow-xl shadow-purple-500/5 p-8 flex items-center justify-center aspect-[4/3]">
                                                <div className="text-center">
                                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                                                        <sol.icon className="w-8 h-8" />
                                                    </div>
                                                    <p className="font-bold text-lg">{sol.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Vista previa del modulo</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-cyan-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
                    <div className="container mx-auto px-4 relative z-10 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Listo para transformar tu negocio?</h2>
                        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Prueba Lollipop gratis por 15 dias. Sin tarjeta, sin compromiso.</p>
                        <Link href="/register">
                            <button className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-shadow text-base">
                                Empezar Ahora — Es gratis <ArrowRight className="w-4 h-4 ml-2 inline" />
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
