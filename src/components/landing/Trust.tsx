"use client";
import { Marquee } from "@/components/magicui";

const LOGOS = [
    { name: "DGII", sub: "Certificado Oficial" },
    { name: "BANRESERVAS", sub: "Cliente Confianza" },
    { name: "CLARO", sub: "Telecomunicaciones" },
    { name: "ALTICE", sub: "Telecomunicaciones" },
    { name: "BANCO POPULAR", sub: "Banca" },
    { name: "GRUPO RICA", sub: "Industria Alimentaria" },
    { name: "IMCA", sub: "Construccion" },
    { name: "HUMANO", sub: "Seguros" },
];

export function Trust() {
    return (
        <section className="py-12 border-y border-purple-100/30 dark:border-purple-900/20 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm overflow-hidden">
            <div className="container mx-auto px-4 mb-6">
                <p className="text-center text-xs font-bold text-purple-400 tracking-[0.2em] uppercase">Empresas que confian en Lollipop</p>
            </div>
            <Marquee speed={35} pauseOnHover className="py-2">
                {LOGOS.map(l => (
                    <div key={l.name} className="flex items-center gap-3 mx-8 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/30 dark:to-cyan-900/20 border border-purple-100/40 dark:border-purple-800/30 flex items-center justify-center text-xs font-black text-purple-600 group-hover:shadow-md group-hover:shadow-purple-500/10 transition-shadow shrink-0">
                            {l.name.substring(0, 2)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground/80 whitespace-nowrap">{l.name}</p>
                            <p className="text-[10px] text-muted-foreground whitespace-nowrap">{l.sub}</p>
                        </div>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
