"use client";
import Link from "next/link";
import { ShimmerButton, GradientText, Particles } from "@/components/magicui";
import { ArrowRight, CheckCircle2, Shield, Zap, Globe, BarChart3, Lock, Cpu } from "lucide-react";

const HIGHLIGHTS = [
    { icon: Shield, label: "Certificado DGII", desc: "Proveedor autorizado de comprobantes electronicos." },
    { icon: Lock, label: "Encriptacion total", desc: "Datos protegidos con cifrado de extremo a extremo." },
    { icon: Globe, label: "100% en la nube", desc: "Accede desde cualquier lugar, sin instalaciones." },
    { icon: Cpu, label: "Inteligencia Artificial", desc: "Sugerencias inteligentes, clasificacion automatica." },
    { icon: BarChart3, label: "Reportes en tiempo real", desc: "Dashboards actualizados al segundo." },
    { icon: Zap, label: "Velocidad extrema", desc: "Firma e-CF en menos de 3 segundos." },
];

export function AdvancedFeatures() {
    return (
        <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-white to-purple-50/50 dark:from-neutral-950 dark:to-purple-950/20">
            <Particles className="opacity-20" count={25} color="#06b6d4" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Left: content */}
                    <div>
                        <p className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase mb-3">Por que Lollipop</p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                            Tecnologia que{" "}
                            <GradientText>impulsa</GradientText>
                            {" "}tu negocio
                        </h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Construido con las mejores practicas de seguridad, rendimiento y escalabilidad.
                            Tu informacion financiera siempre segura y accesible.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {HIGHLIGHTS.map((h, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/30 flex items-center justify-center shrink-0 text-purple-500 group-hover:shadow-md group-hover:shadow-purple-500/15 transition-shadow">
                                        <h.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{h.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/register">
                            <ShimmerButton className="text-sm">
                                Empezar Ahora <ArrowRight className="w-4 h-4 ml-2 inline" />
                            </ShimmerButton>
                        </Link>
                    </div>

                    {/* Right: visual */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-3xl blur-2xl pointer-events-none" />
                        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 shadow-xl shadow-purple-500/10 p-8">
                            {/* Mock dashboard stats */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm">L</div>
                                        <div><p className="font-bold text-sm">Panel de Control</p><p className="text-[10px] text-muted-foreground">Mi Empresa SRL</p></div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">En linea</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Ingresos", value: "$50,801", color: "text-emerald-600" },
                                        { label: "Gastos", value: "$30,200", color: "text-rose-500" },
                                        { label: "Resultado", value: "$20,601", color: "text-purple-600" },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-muted/50 rounded-xl p-3 text-center">
                                            <p className="text-[10px] text-muted-foreground">{s.label}</p>
                                            <p className={`font-black text-sm tabular-nums ${s.color}`}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {["Factura #1245 emitida a CLARO", "Pago de $45,000 recibido", "Stock bajo: Toner HP"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-xs">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
