"use client";
import { GradientText } from "@/components/magicui";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
    { name: "Carlos Ramirez", role: "CEO, Tech Solutions DR", text: "Lollipop transformo nuestra facturacion. Antes perdiamos horas con el formato 607, ahora se genera solo.", stars: 5 },
    { name: "Maria Gutierrez", role: "Contadora, Grupo Inversiones", text: "La contabilidad integrada es increible. Los asientos se generan automaticamente al facturar.", stars: 5 },
    { name: "Jose Almonte", role: "Gerente, Supermercado El Progreso", text: "El POS es rapidisimo. Mis cajeros lo aprendieron en 10 minutos y ya no quieren usar otro sistema.", stars: 5 },
    { name: "Ana Perez", role: "Propietaria, Boutique Elegance", text: "Facil de usar, bonito y funcional. El soporte responde en minutos. Totalmente recomendado.", stars: 5 },
    { name: "Roberto Mendez", role: "Director Financiero, Constructora IMCA", text: "Manejamos 3 empresas desde un solo panel. La gestion multi-empresa ahorra muchisimo tiempo.", stars: 5 },
    { name: "Sandra Torres", role: "Administradora, Clinica San Rafael", text: "Los reportes son exactamente lo que necesitaba para presentar a los socios cada mes.", stars: 4 },
];

export function Testimonials() {
    return (
        <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs font-bold text-blue-400 tracking-[0.2em] uppercase mb-3">Testimonios</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                        Lo que dicen nuestros <GradientText>clientes</GradientText>
                    </h2>
                    <p className="text-muted-foreground">Miles de empresas dominicanas confian en Lollipop para su operacion diaria.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200/40 transition-all duration-300">
                            <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 mb-4" />
                            <p className="text-sm text-foreground/80 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-500/20 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-200/50">
                                        {t.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: t.stars }).map((_, j) => (
                                        <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
