"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton, GradientText } from "@/components/magicui";
import { CheckCircle2, ArrowRight, Sparkles, ZapIcon } from "lucide-react";

const PLANS = [
    {
        name: "Starter",
        price: "Gratis",
        sub: "Para siempre",
        desc: "Todo lo basico para empezar a facturar.",
        features: ["5 facturas/mes", "1 usuario", "Facturacion basica", "Reportes limitados", "Soporte por email"],
        cta: "Empezar Gratis",
        popular: false,
        gradient: "",
    },
    {
        name: "Pro",
        price: "RD$ 1,499",
        sub: "/mes",
        desc: "Para negocios en crecimiento.",
        features: ["Facturas ilimitadas", "5 usuarios", "POS incluido", "Nomina basica", "Contabilidad completa", "Reportes avanzados", "Soporte prioritario", "e-CF DGII"],
        cta: "Probar 15 Dias Gratis",
        popular: true,
        gradient: "from-purple-600 to-cyan-500",
    },
    {
        name: "Enterprise",
        price: "RD$ 3,499",
        sub: "/mes",
        desc: "Para empresas con necesidades complejas.",
        features: ["Todo lo de Pro", "Usuarios ilimitados", "Multi-empresa", "API completa", "Multi-almacen", "Integraciones", "Gerente de cuenta", "SLA garantizado"],
        cta: "Contactar Ventas",
        popular: false,
        gradient: "",
    },
];

export function Pricing() {
    return (
        <section className="py-20 md:py-28 bg-[#faf9ff] dark:bg-neutral-950 relative overflow-hidden" id="pricing">
            {/* Background orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase mb-3">Precios transparentes</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                        Planes que <GradientText>crecen contigo</GradientText>
                    </h2>
                    <p className="text-muted-foreground">Sin sorpresas, sin contratos. Cancela cuando quieras.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`relative rounded-2xl p-[1px] ${plan.popular ? "bg-gradient-to-b from-purple-500 to-cyan-500" : ""}`}>
                            <div className={`h-full rounded-2xl p-6 flex flex-col ${plan.popular ? "bg-white dark:bg-neutral-900" : "bg-card/50 backdrop-blur-xl border border-border/60"}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                                        <Sparkles className="w-3 h-3" /> Mas Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                    <p className="text-xs text-muted-foreground">{plan.desc}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-black">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground">{plan.sub}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.popular ? "text-purple-500" : "text-emerald-500"}`} />{f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register">
                                    {plan.popular ? (
                                        <ShimmerButton className="w-full text-sm py-3">{plan.cta}<ArrowRight className="w-4 h-4 ml-2 inline" /></ShimmerButton>
                                    ) : (
                                        <Button variant="outline" className="w-full rounded-full">{plan.cta}</Button>
                                    )}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
