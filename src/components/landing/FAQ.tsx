"use client";
import { useState } from "react";
import { GradientText } from "@/components/magicui";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
    { q: "Que es un comprobante electronico (e-CF)?", a: "Es un documento fiscal digital validado por la DGII que sustituye los comprobantes en papel. Lollipop genera e-CF automaticamente al emitir facturas." },
    { q: "Necesito certificado digital para usar Lollipop?", a: "Si, necesitas un certificado digital P12 emitido por una entidad autorizada. Lollipop te guia paso a paso en el proceso de configuracion." },
    { q: "Puedo migrar mis datos desde otro sistema?", a: "Si. Ofrecemos importacion masiva de clientes, productos y facturas desde Excel/CSV. Nuestro equipo te ayuda en la migracion." },
    { q: "Cuantos usuarios puedo agregar?", a: "Depende del plan: Starter (1 usuario), Pro (5 usuarios), Enterprise (ilimitados). Cada usuario tiene permisos personalizables." },
    { q: "Lollipop funciona offline?", a: "El POS tiene modo offline basico para emergencias. Al recuperar conexion, sincroniza automaticamente con la DGII." },
    { q: "Como funciona la facturacion recurrente?", a: "Configuras la frecuencia y el monto, y Lollipop emite las facturas automaticamente cada periodo. Puedes pausar o cancelar en cualquier momento." },
    { q: "Puedo usar Lollipop en mi celular?", a: "Si, Lollipop es 100% responsive. Puedes facturar, cobrar y ver reportes desde cualquier dispositivo con navegador." },
];

export function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-20 md:py-28 bg-[#faf9ff] dark:bg-neutral-950 relative" id="faq">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs font-bold text-blue-400 tracking-[0.2em] uppercase mb-3">FAQ</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                        Preguntas <GradientText>frecuentes</GradientText>
                    </h2>
                    <p className="text-muted-foreground">Todo lo que necesitas saber para empezar con Lollipop.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-xl overflow-hidden hover:border-blue-200/40 transition-colors">
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left">
                                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                                <ChevronDown className={cn("w-4 h-4 shrink-0 text-blue-400 transition-transform duration-200", open === i && "rotate-180")} />
                            </button>
                            <div className={cn("overflow-hidden transition-all duration-300", open === i ? "max-h-40 pb-5 px-5" : "max-h-0")}>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
