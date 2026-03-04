"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton, AnimatedCounter, GradientText, Particles, WordRotate, DotPattern } from "@/components/magicui";
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Zap, Lock } from "lucide-react";

const METRICS = [
    { target: 4500, suffix: "+", label: "empresas activas" },
    { target: 2800000, suffix: "+", label: "e-CF emitidos", displayAs: "2.8M+" },
    { target: 99, suffix: ".9%", label: "disponibilidad" },
    { target: 3, suffix: " seg", label: "tiempo de firma", prefix: "<" },
];

const BADGES = ["B01", "B02", "B04", "B14", "B15", "606", "607", "IT-1"];

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#faf9ff] dark:bg-neutral-950">
            {/* Background effects */}
            <Particles className="opacity-40" count={40} color="#7c3aed" />
            <DotPattern className="opacity-[0.08] [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]" spacing={24} />

            {/* Gradient orbs */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-400/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Announcement badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-800/40 mb-8 animate-float-up">
                        <Zap className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Nuevo: Punto de Venta integrado con DGII</span>
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                    </div>

                    {/* Main headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-float-up stagger-1" style={{ animationFillMode: "backwards" }}>
                        La forma{" "}
                        <GradientText className="font-black">inteligente</GradientText>
                        <br />
                        de{" "}
                        <WordRotate
                            words={["facturar", "cobrar", "crecer", "gestionar"]}
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
                            interval={2500}
                        />
                        {" "}tu negocio
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-float-up stagger-2 leading-relaxed" style={{ animationFillMode: "backwards" }}>
                        Facturacion electronica e-CF, contabilidad, nomina, POS e inventario.
                        Todo en una plataforma moderna pensada para Republica Dominicana.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-float-up stagger-3" style={{ animationFillMode: "backwards" }}>
                        <Link href="/register">
                            <ShimmerButton className="text-base px-8 py-4 shadow-xl shadow-purple-500/20">
                                Empieza Gratis — 15 Dias
                                <ArrowRight className="w-4 h-4 ml-2 inline" />
                            </ShimmerButton>
                        </Link>
                        <Link href="#demo">
                            <Button variant="outline" size="lg" className="rounded-full px-6 border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 gap-2 h-[52px]">
                                <Play className="w-4 h-4 text-purple-500" /> Ver Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground mb-16 animate-float-up stagger-4" style={{ animationFillMode: "backwards" }}>
                        {["Sin tarjeta de credito", "Certificado DGII", "Soporte 24/7"].map(t => (
                            <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{t}</span>
                        ))}
                    </div>

                    {/* NCF badge ticker */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-float-up stagger-5" style={{ animationFillMode: "backwards" }}>
                        {BADGES.map(b => (
                            <span key={b} className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-purple-100/50 dark:border-purple-800/30 text-xs font-mono font-bold text-purple-600 shadow-sm backdrop-blur-sm">
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-float-up stagger-6" style={{ animationFillMode: "backwards" }}>
                        {METRICS.map((m, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-2xl group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-colors" />
                                <div className="relative p-4 text-center">
                                    <p className="text-2xl md:text-3xl font-black tabular-nums bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                        {m.displayAs ? m.displayAs : <AnimatedCounter target={m.target} suffix={m.suffix} prefix={m.prefix || ""} />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard preview mockup */}
                <div className="mt-20 max-w-5xl mx-auto relative perspective-[2000px]">
                    <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent rounded-3xl blur-xl pointer-events-none" />

                    {/* Background Settings Window */}
                    <div className="absolute top-0 left-8 right-8 bg-white/40 dark:bg-neutral-900/40 rounded-t-2xl border border-purple-200/30 dark:border-purple-800/20 shadow-xl overflow-hidden transform -translate-y-8 md:-translate-y-12 scale-[0.95] opacity-60 backdrop-blur-sm transition-transform duration-500">
                        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-200/50 dark:border-neutral-700/50">
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /></div>
                        </div>
                        <div className="relative aspect-[16/9] bg-muted/10 overflow-hidden">
                            <img src="/images/settings-preview.png" alt="Lollipop Settings" className="absolute top-0 left-0 w-full h-auto object-cover object-top opacity-50 filter blur-[1px]" />
                        </div>
                    </div>

                    {/* Foreground Dashboard Window */}
                    <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 shadow-2xl shadow-purple-500/20 overflow-hidden transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-purple-500/30">
                        {/* Browser bar */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1.5 bg-white dark:bg-neutral-900 rounded-lg text-xs text-muted-foreground font-mono border shadow-sm flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-emerald-500" />
                                    app.lollipop.do/dashboard
                                </div>
                            </div>
                        </div>
                        {/* Actual dashboard screenshot */}
                        <div className="relative aspect-[16/9] bg-muted/20 overflow-hidden group">
                            <img src="/images/dashboard-preview.png" alt="Lollipop Dashboard" className="absolute top-0 left-0 w-full h-auto object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                            {/* Glass reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
