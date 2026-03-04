"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, FileText, Lock, Mail, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
    { icon: Zap, text: "e-CF DGII en segundos" },
    { icon: ShieldCheck, text: "Firma digital P12 integrada" },
    { icon: FileText, text: "Formatos 606 / 607 automáticos" },
];

export default function LoginPage() {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left: gradient panel ─────────────────── */}
            <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden flex-col items-center justify-center p-16 animate-in fade-in duration-700">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

                {/* Blobs */}
                <div className="blob absolute w-72 h-72 bg-white/10 -top-16 -left-16 pointer-events-none" />
                <div className="blob absolute w-56 h-56 bg-white/10 bottom-8 right-0 pointer-events-none" style={{ animationDelay: "4s" }} />

                {/* Content */}
                <div className="relative z-10 w-full max-w-sm text-white animate-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
                    <Link href="/" className="flex items-center gap-3 mb-14 group">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-white/30 transition-all hover:scale-110">S</div>
                        <span className="text-2xl font-black tracking-tight group-hover:text-blue-200 transition-colors">Lollipop</span>
                    </Link>

                    <h2 className="text-4xl font-black leading-tight mb-4">
                        La facturación<br />
                        <span className="text-gradient-light">inteligente</span><br />
                        para tu empresa.
                    </h2>
                    <p className="text-white/70 mb-10 leading-relaxed">
                        Emite e-CF válidos ante la DGII, gestiona tu contabilidad y controla tu negocio desde un solo lugar.
                    </p>

                    <div className="space-y-4">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/90 group/item hover:translate-x-1 transition-transform cursor-default">
                                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 group-hover/item:bg-white/25 transition-colors">
                                    <f.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Floating card mockup */}
                    <div className="mt-14 glass rounded-2xl p-5 border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30 transition-all hover:scale-[1.02] shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Última factura emitida</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="font-bold text-lg">CLARO DO</p>
                                <p className="text-white/60 text-sm font-mono">B01-00000042</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black">RD$ 605,800</p>
                                <p className="text-xs text-white/70 flex items-center justify-end gap-1 mt-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-300" /> Firmada DGII
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right: form ─────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background animate-in slide-in-from-right-8 duration-700 relative">
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

                <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
                    {/* Logo mobile */}
                    <div className="lg:hidden flex justify-center mb-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">S</div>
                            <span className="text-xl font-black">Sys<span className="text-primary">Fac</span></span>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Bienvenido de vuelta</h1>
                        <p className="text-muted-foreground mt-2 text-sm">Inicia sesión para acceder a tu empresa</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-1.5 group">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="email" type="email" placeholder="admin@lollipop.do" defaultValue="admin@lollipop.do" required className="pl-10 h-11 bg-muted/30 focus:bg-background border-muted transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5 group">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link href="#" className="text-xs font-medium text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="password" type={show ? "text" : "password"} defaultValue="DemoPass123!" required className="pl-10 pr-10 h-11 bg-muted/30 focus:bg-background border-muted transition-all" />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Demo credentials hint */}
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground animate-pulse hover:animate-none transition-all cursor-default">
                            <strong className="text-primary font-bold">Demo:</strong> admin@lollipop.do / DemoPass123!
                        </div>

                        <Button type="submit" size="lg" className="w-full bg-gradient-brand glow-sm-brand border-0 font-bold text-base h-12 hover:scale-[1.01] transition-transform active:scale-[0.98]">
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O continúa con</span></div></div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-11 gap-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </Button>
                        <Button variant="outline" className="h-11 gap-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            LinkedIn
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline hover:scale-105 inline-block transition-transform">Crea tu cuenta gratis →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
