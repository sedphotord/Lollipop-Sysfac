"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, HelpCircle, MessageSquare, PlayCircle, Search, Video, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ARTICLES = [
    { cat: "Primeros pasos", title: "¿Cómo crear mi primera factura e-CF?", popular: true },
    { cat: "Primeros pasos", title: "Configurar el certificado digital P12", popular: true },
    { cat: "DGII", title: "Tipos de NCF y cuándo usar cada uno", popular: false },
    { cat: "DGII", title: "Cómo presentar el Formato 607 mensual", popular: false },
    { cat: "Productos", title: "Crear productos con ITBIS diferenciado", popular: false },
    { cat: "Clientes", title: "Consultar un RNC en la API de DGII", popular: true },
    { cat: "Nómina", title: "Calcular descuentos TSS e ISR correctamente", popular: false },
];

export default function AyudaPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Centro de Ayuda</h2>
                <p className="text-muted-foreground">¿En qué podemos ayudarte hoy?</p>
                <div className="relative mt-6 max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Busca artículos, guías, tutoriales..." className="pl-12 h-12 text-base bg-card border-border rounded-xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ icon: BookOpen, title: "Documentación", desc: "Guías completas de todos los módulos", color: "text-blue-600 bg-blue-500/10" }, { icon: Video, title: "Videotutoriales", desc: "Aprende con tutoriales en video paso a paso", color: "text-violet-600 bg-violet-500/10" }, { icon: MessageSquare, title: "Soporte en Vivo", desc: "Chatea con un agente en horario comercial", color: "text-emerald-600 bg-emerald-500/10" }].map((c, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                        <CardContent className="p-5 flex gap-4 items-start">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", c.color)}><c.icon className="w-6 h-6" /></div>
                            <div><p className="font-bold mb-1 group-hover:text-primary transition-colors">{c.title}</p><p className="text-sm text-muted-foreground">{c.desc}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" />Artículos Populares</CardTitle></CardHeader>
                <CardContent>
                    <div className="divide-y divide-border/60">
                        {ARTICLES.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase())).map((a, i) => (
                            <div key={i} className="py-3 flex items-center justify-between gap-4 group cursor-pointer hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">{a.cat}</p>
                                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{a.title}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {a.popular && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">Popular</Badge>}
                                    <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
