"use client";
import { BentoCard, BorderBeam } from "@/components/magicui";
import { FileText, ShoppingCart, Calculator, Boxes, PieChart, Users, Receipt, Zap, Store, BarChart3 } from "lucide-react";

const FEATURES = [
    {
        icon: Zap, title: "Facturacion e-CF", desc: "Emite comprobantes electronicos B01, B02, B04, B14, B15 validados por la DGII en tiempo real.", size: "col-span-2",
        color: "from-purple-500/20 to-purple-600/10 text-purple-600", highlight: true,
    },
    {
        icon: Store, title: "Punto de Venta", desc: "POS moderno con busqueda rapida, lectores y tickets. Ideal para retail.", size: "col-span-1",
        color: "from-cyan-500/20 to-cyan-600/10 text-cyan-600", highlight: false,
    },
    {
        icon: Calculator, title: "Contabilidad", desc: "Plan de cuentas DR, asientos automaticos, balance y estados financieros NIIF.", size: "col-span-1",
        color: "from-amber-500/20 to-amber-600/10 text-amber-600", highlight: false,
    },
    {
        icon: Users, title: "Nomina y TSS", desc: "Calcula sueldos, descuentos TSS/ISR, genera el formato 606 y reportes de nomina.", size: "col-span-1",
        color: "from-rose-500/20 to-rose-600/10 text-rose-600", highlight: false,
    },
    {
        icon: Boxes, title: "Inventario Multi-Almacen", desc: "Productos, categorias, ajustes de stock y alertas de minimo. Todo organizado.", size: "col-span-1",
        color: "from-emerald-500/20 to-emerald-600/10 text-emerald-600", highlight: false,
    },
    {
        icon: Receipt, title: "Bancos y Conciliacion", desc: "Conecta tus cuentas bancarias, registra transacciones y concilia automaticamente.", size: "col-span-1",
        color: "from-blue-500/20 to-blue-600/10 text-blue-600", highlight: false,
    },
    {
        icon: ShoppingCart, title: "Gastos y Compras", desc: "Registra, categoriza y controla todos tus egresos. Ordenes de compra y mas.", size: "col-span-1",
        color: "from-orange-500/20 to-orange-600/10 text-orange-600", highlight: false,
    },
    {
        icon: PieChart, title: "Reportes Inteligentes", desc: "Ventas por cliente, producto, periodo. Formatos 606/607, IT-1 y todo lo fiscal.", size: "col-span-2",
        color: "from-violet-500/20 to-violet-600/10 text-violet-600", highlight: true,
    },
];

export function Features() {
    return (
        <section className="py-20 md:py-28 relative" id="features">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase mb-3">Todo en uno</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                        Una plataforma,{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">infinitas posibilidades</span>
                    </h2>
                    <p className="text-muted-foreground">Cada herramienta que tu negocio necesita, integrada y lista para usar desde el dia uno.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {FEATURES.map((f, i) => (
                        <BentoCard key={i} className={f.size}>
                            <div className="flex flex-col h-full">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                            </div>
                            {f.highlight && <BorderBeam size={150} duration={10} delay={i * 2} />}
                        </BentoCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
