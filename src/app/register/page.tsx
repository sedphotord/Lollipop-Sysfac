"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, Star, TrendingUp, Users, Zap } from "lucide-react";

const STATS = [
    { v: "4,500+", l: "Empresas" },
    { v: "99.9%", l: "Uptime DGII" },
    { v: "15 días", l: "Prueba gratis" },
];

const FEATURES = [
    "e-CF generados en segundos con firma digital",
    "Sede secundaria: multi-empresa y multi-usuario",
    "Formatos 606 / 607 / IT-1 automáticos",
    "Soporte por WhatsApp en horario extendido",
    "Sincronización en tiempo real con la DGII",
];

export default function RegisterPage() {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left: form ─────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background overflow-y-auto animate-in fade-in slide-in-from-left-4 duration-700 relative">
                {/* Back button */}
                <Link
                    href="/"
                    className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-muted transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Volver
                </Link>

                <div className="w-full max-w-md space-y-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-both">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 lg:hidden mb-6 group">
                        <div className="w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">S</div>
                        <span className="text-xl font-black">Sys<span className="text-primary">Fac</span></span>
                    </Link>

                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-1 mb-4 animate-bounce-subtle">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            Sin tarjeta de crédito requerida
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Crea tu cuenta gratis</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Comienza tu prueba de 15 días y emite e-CF hoy mismo.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5 group">
                                <Label htmlFor="firstName">Nombre *</Label>
                                <Input id="firstName" placeholder="Carlos" defaultValue="Carlos" required className="h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                            <div className="space-y-1.5 group">
                                <Label htmlFor="lastName">Apellido *</Label>
                                <Input id="lastName" placeholder="Gómez" defaultValue="Gómez" required className="h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="companyName" placeholder="Mi Empresa SRL" defaultValue="Comercial Gómez SRL" required className="pl-10 h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <Label htmlFor="rnc">RNC *</Label>
                            <Input id="rnc" placeholder="1-23-45678-9" defaultValue="1-31-23456-7" required className="h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                        </div>

                        <div className="space-y-1.5 group">
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="email" type="email" placeholder="carlos@empresa.do" defaultValue="carlos@comercialgomez.do" required className="pl-10 h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="phone" placeholder="809-555-0000" defaultValue="809-555-1234" className="pl-10 h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Sector de la empresa</Label>
                            <Select defaultValue="comercio">
                                <SelectTrigger className="h-10 bg-muted/30 border-muted"><SelectValue placeholder="Selecciona tu sector..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="comercio">Comercio</SelectItem>
                                    <SelectItem value="servicios">Servicios Profesionales</SelectItem>
                                    <SelectItem value="construccion">Construcción</SelectItem>
                                    <SelectItem value="salud">Salud</SelectItem>
                                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5 group">
                            <Label htmlFor="password">Contraseña *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="password" type={show ? "text" : "password"} defaultValue="DemoPass123!" required className="pl-10 pr-10 h-10 bg-muted/30 focus:bg-background border-muted transition-all" />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Mínimo 8 caracteres, una mayúscula y un número.</p>
                        </div>

                        <div className="flex items-start gap-2.5 pt-1 group">
                            <Checkbox id="terms" defaultChecked className="mt-0.5 border-muted data-[state=checked]:bg-primary transition-colors" />
                            <Label htmlFor="terms" className="text-[11px] font-normal text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
                                Acepto los <Link href="#" className="font-semibold text-primary hover:underline">Términos del Servicio</Link> y la <Link href="#" className="font-semibold text-primary hover:underline">Política de Privacidad</Link>. Declaro que la empresa está constituida en República Dominicana.
                            </Label>
                        </div>

                        <Button type="submit" size="lg" className="w-full bg-gradient-brand glow-sm-brand border-0 font-bold text-base h-12 mt-2 hover:scale-[1.01] transition-transform active:scale-[0.98]">
                            Crear Cuenta Gratis →
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline hover:scale-105 inline-block transition-transform">Inicia sesión →</Link>
                    </p>
                </div>
            </div>

            {/* ── Right: gradient panel ─────────────────── */}
            <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden flex-col items-center justify-center p-16 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
                <div className="blob absolute w-80 h-80 bg-white/10 -top-20 -right-20 pointer-events-none" />
                <div className="blob absolute w-60 h-60 bg-violet-400/10 bottom-10 -left-10 pointer-events-none" style={{ animationDelay: "6s" }} />

                <div className="relative z-10 w-full max-w-sm text-white animate-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
                    <Link href="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">S</div>
                        <span className="text-2xl font-black group-hover:text-blue-200 transition-colors">Lollipop</span>
                    </Link>

                    <h2 className="text-4xl font-black leading-tight mb-3">
                        Todo lo que necesitas<br />
                        <span className="text-gradient-light">en un solo lugar.</span>
                    </h2>
                    <p className="text-white/70 mb-8 leading-relaxed text-sm">
                        Desde emitir tu primera factura hasta cerrar tu contabilidad mensual — sin salir de Lollipop.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {STATS.map((s, i) => (
                            <div key={i} className="glass-brand text-center rounded-xl p-3 border border-white/15 hover:bg-white/15 transition-colors cursor-default translate-y-0 hover:-translate-y-1 duration-300">
                                <p className="text-xl font-black">{s.v}</p>
                                <p className="text-xs text-white/60 mt-0.5">{s.l}</p>
                            </div>
                        ))}
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-3">
                        {FEATURES.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-white/85 group/feat cursor-default">
                                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0 group-hover/feat:scale-125 transition-transform" />
                                <span className="group-hover/feat:text-white transition-colors">{f}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Testimonial */}
                    <div className="mt-10 rounded-2xl border border-white/15 bg-white/8 p-5 hover:bg-white/12 transition-all hover:scale-[1.02] cursor-default animate-in zoom-in-95 duration-700 delay-700 fill-mode-both">
                        <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                        <p className="text-sm text-white/80 italic leading-relaxed">"Lollipop nos ahorró 6 horas semanales de trabajo manual con la DGII. La conciliación de 606/607 ahora la hacemos en minutos."</p>
                        <p className="text-xs text-white/50 mt-3 font-semibold">— Ana M. · Directora Financiera, GRUPO SALCEDO</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
