"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUsers, setSession, getSession } from "@/lib/auth-store";
import { getActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LogIn, ArrowLeft, CheckCircle2, Receipt, Building2, ShieldCheck, BarChart3 } from "lucide-react";

// ── Left banner features ───────────────────────────────────────────────────
const FEATURES = [
    { icon: Receipt, title: "Facturación e-CF DGII", desc: "Emite comprobantes electrónicos certificados." },
    { icon: Building2, title: "Multi-empresa", desc: "Gestiona varias empresas desde una sola cuenta." },
    { icon: ShieldCheck, title: "Roles y permisos", desc: "Contador, propietario, cajero — cada uno ve lo suyo." },
    { icon: BarChart3, title: "Reportes en tiempo real", desc: "Dashboard financiero actualizado al instante." },
];

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("juan@lollipop.do");
    const [pin, setPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        seedAllCompaniesData();
        if (getSession()) router.replace("/dashboard");
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) { setError("Correo no registrado."); return; }
        if (user.pin !== pin) { setError("PIN incorrecto."); setPin(""); return; }

        setIsLoading(true);
        setSession(user.id);
        if (user.companiesAccess.length > 0) {
            const stored = getActiveCompanyId();
            if (!user.companiesAccess.includes(stored))
                localStorage.setItem("lollipop_active_company", user.companiesAccess[0]);
        }
        router.replace("/dashboard");
    };

    return (
        <div className="min-h-screen flex">

            {/* ── LEFT BANNER ──────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[52%] relative flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[80px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />

                {/* Content */}
                <div className="relative flex flex-col h-full p-10 z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-auto">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">Lollipop</span>
                    </div>

                    {/* Hero text */}
                    <div className="py-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Sistema activo · República Dominicana
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-5">
                            El software de<br />
                            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                                facturación
                            </span>{" "}
                            que tu<br />negocio necesita.
                        </h1>
                        <p className="text-blue-200/70 text-base max-w-sm leading-relaxed">
                            e-CF certificado DGII, POS, inventario, bancos y contabilidad — todo en una plataforma.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-4 mb-auto">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4 text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold leading-snug">{title}</p>
                                    <p className="text-blue-300/60 text-xs mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quote */}
                    <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <p className="text-white/80 text-sm italic leading-relaxed">
                            "Lollipop nos ahorró horas en la emisión de facturas electrónicas.
                            La integración con DGII es perfecta."
                        </p>
                        <div className="flex items-center gap-2.5 mt-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">CM</div>
                            <div>
                                <p className="text-white text-xs font-semibold">Carlos Méndez</p>
                                <p className="text-white/40 text-[10px]">CEO · TechSolutions RD</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (form) ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#09090f]">
                {/* Top bar: back + register link */}
                <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border/40">
                    <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        ¿Primera vez?{" "}
                        <Link href="/registro" className="font-semibold text-blue-600 hover:underline">Crear cuenta</Link>
                    </div>
                </div>

                {/* Form area - centered */}
                <div className="flex-1 flex items-center justify-center px-6 md:px-12">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Receipt className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-black text-xl">Lollipop</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-foreground">Bienvenido de vuelta</h2>
                            <p className="text-muted-foreground text-sm mt-1">Ingresa tus credenciales para acceder al sistema.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correo electrónico</label>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(""); }}
                                    placeholder="tu@correo.com"
                                    required
                                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>

                            {/* PIN */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">PIN de acceso</label>
                                    <span className="text-[11px] text-muted-foreground">4 dígitos</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPin ? "text" : "password"}
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={pin}
                                        onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                                        placeholder="••••"
                                        required
                                        className="w-full border border-border rounded-xl px-4 py-3 pr-12 text-sm font-mono tracking-[0.4em] bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPin(s => !s)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button type="submit" disabled={!email || pin.length !== 4 || isLoading}
                                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                                {isLoading
                                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><LogIn className="w-4 h-4" /> Iniciar Sesión</>
                                }
                            </button>
                        </form>

                        {/* Demo accounts */}
                        <details className="mt-6 group">
                            <summary className="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors select-none text-center">
                                Ver otras cuentas de prueba ▾
                            </summary>
                            <div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/60 space-y-1.5">
                                {[
                                    { email: "juan@lollipop.do", pin: "1234", role: "Contador · 3 empresas" },
                                    { email: "carlos@techsolutionsrd.com", pin: "4321", role: "Propietario · TechSolutions" },
                                    { email: "pedro@buensabor.do", pin: "5678", role: "Propietario · Cafetería" },
                                    { email: "maria@buensabor.do", pin: "0000", role: "Cajera · Solo POS" },
                                ].map(u => (
                                    <button key={u.email} type="button"
                                        onClick={() => { setEmail(u.email); setPin(u.pin); setError(""); }}
                                        className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-background transition-colors group/btn">
                                        <div>
                                            <p className="text-xs font-semibold text-foreground group-hover/btn:text-blue-600 transition-colors">{u.email}</p>
                                            <p className="text-[10px] text-muted-foreground">{u.role}</p>
                                        </div>
                                        <span className="font-mono text-xs text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">{u.pin}</span>
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[11px] text-muted-foreground/40 py-4 px-6">
                    © 2025 Lollipop · Hecho en República Dominicana
                </p>
            </div>
        </div>
    );
}
