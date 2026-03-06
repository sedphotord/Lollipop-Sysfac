"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upsertUser, setSession, getUsers } from "@/lib/auth-store";
import { getCompanies, saveCompanies, setActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData } from "@/lib/seed-data";
import { Eye, EyeOff, ArrowLeft, UserPlus, Receipt, Building2, ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];

const FEATURES = [
    { icon: Receipt, title: "Facturas electrónicas e-CF", desc: "Certificado DGII, listo para emitir desde el día 1." },
    { icon: Building2, title: "Gestión multi-empresa", desc: "Un contador, todas sus empresas en un solo lugar." },
    { icon: ShieldCheck, title: "Control de acceso por roles", desc: "Define quién ve qué dentro de tu negocio." },
    { icon: BarChart3, title: "Dashboard financiero live", desc: "Reportes de ventas, gastos y margen en tiempo real." },
];

export default function RegistroPage() {
    const router = useRouter();

    // Pre-filled with demo main account data
    const [name, setName] = useState("Juan Pérez");
    const [email, setEmail] = useState("juan@lollipop.do");
    const [pin, setPin] = useState("1234");
    const [pinConfirm, setPinConfirm] = useState("1234");
    const [companyName, setCompanyName] = useState("TechSolutions RD");
    const [rnc, setRnc] = useState("131-00168-5");
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) { setError("Completa todos los campos."); return; }
        if (pin.length !== 4) { setError("El PIN debe tener 4 dígitos."); return; }
        if (pin !== pinConfirm) { setError("Los PINs no coinciden."); return; }
        // Check email not taken
        seedAllCompaniesData();
        const existing = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) { setError("Este correo ya está registrado."); return; }
        setError("");
        setStep(2);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Create company
        const compId = `comp-${Date.now()}`;
        const company = {
            id: compId,
            name: companyName || "Mi Empresa",
            rnc: rnc,
            sector: "Otro",
            role: "Administrador",
            color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            createdAt: new Date().toLocaleDateString("es-DO"),
        };
        const companies = getCompanies();
        saveCompanies([...companies, company]);
        setActiveCompanyId(compId);

        // Create user (contador — top level)
        const userId = `usr-${Date.now()}`;
        upsertUser({
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            pin,
            globalRole: "contador",
            companiesAccess: [compId],
            createdBy: "self",
            createdAt: new Date().toLocaleDateString("es-DO"),
            color: AVATAR_COLORS[0],
        });

        setSession(userId);
        router.replace("/dashboard");
    };

    return (
        <div className="min-h-screen flex">

            {/* ── LEFT BANNER ──────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[52%] relative flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[80px]" />

                <div className="relative flex flex-col h-full p-10 z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-auto">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">Lollipop</span>
                    </div>

                    <div className="py-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-semibold mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Gratis durante 30 días · Sin tarjeta
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-5">
                            Empieza a facturar<br />
                            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                                en minutos.
                            </span>
                        </h1>
                        <p className="text-blue-200/70 text-base max-w-sm leading-relaxed">
                            Crea tu cuenta, registra tu empresa y emite tu primera factura e-CF hoy mismo.
                        </p>
                    </div>

                    {/* Features */}
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

                    {/* Social proof */}
                    <div className="mt-10 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex -space-x-2">
                            {["CM", "PG", "AS", "MR"].map((initials, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ background: AVATAR_COLORS[i] }}>
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-white text-xs font-semibold">+240 negocios activos</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                                <span className="text-white/40 text-[10px] ml-1">4.9/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#09090f]">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border/40">
                    <button onClick={() => step === 2 ? setStep(1) : router.push("/login")}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        {step === 2 ? "Atrás" : "Volver"}
                    </button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-semibold text-blue-600 hover:underline">Iniciar sesión</Link>
                    </div>
                </div>

                {/* Form */}
                <div className="flex-1 flex items-center justify-center px-6 md:px-12">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Receipt className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-black text-xl">Lollipop</span>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center gap-3 mb-8">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        step > s ? "bg-emerald-500 text-white" :
                                            step === s ? "bg-blue-600 text-white" :
                                                "bg-muted text-muted-foreground")}>
                                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                    </div>
                                    <span className={cn("text-xs font-medium", step === s ? "text-foreground" : "text-muted-foreground")}>
                                        {s === 1 ? "Tu cuenta" : "Tu empresa"}
                                    </span>
                                    {s < 2 && <div className={cn("w-8 h-0.5 rounded", step > s ? "bg-emerald-500" : "bg-border")} />}
                                </div>
                            ))}
                        </div>

                        {step === 1 ? (
                            /* ── Step 1: Account ── */
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black">Crea tu cuenta</h2>
                                    <p className="text-muted-foreground text-sm mt-1">Tu acceso personal al sistema.</p>
                                </div>

                                <form onSubmit={handleNext} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre completo</label>
                                        <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
                                            placeholder="Tu nombre"
                                            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correo electrónico</label>
                                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                                            placeholder="tu@correo.com"
                                            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">PIN (4 dígitos)</label>
                                            <div className="relative">
                                                <input type={showPin ? "text" : "password"} inputMode="numeric" maxLength={4}
                                                    value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                                                    placeholder="••••"
                                                    className="w-full border border-border rounded-xl px-4 py-3 pr-10 text-sm font-mono tracking-[0.3em] bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" required />
                                                <button type="button" onClick={() => setShowPin(s => !s)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirmar PIN</label>
                                            <input type={showPin ? "text" : "password"} inputMode="numeric" maxLength={4}
                                                value={pinConfirm} onChange={e => { setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                                                placeholder="••••"
                                                className={cn("w-full border rounded-xl px-4 py-3 text-sm font-mono tracking-[0.3em] bg-background outline-none focus:ring-2 transition-all",
                                                    pinConfirm && pin !== pinConfirm ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-border focus:border-blue-500 focus:ring-blue-500/20"
                                                )} required />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit"
                                        disabled={!name || !email || pin.length !== 4 || pin !== pinConfirm}
                                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 active:scale-[0.98]">
                                        Continuar →
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* ── Step 2: Company ── */
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black">Tu empresa</h2>
                                    <p className="text-muted-foreground text-sm mt-1">Puedes agregar más empresas después.</p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre de la empresa *</label>
                                        <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                                            placeholder="Mi Empresa SRL"
                                            className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">RNC / Cédula</label>
                                        <input value={rnc} onChange={e => setRnc(e.target.value)}
                                            placeholder="1-31-12345-6" className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono bg-background outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                    </div>

                                    {error && (
                                        <div className="text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit" disabled={!companyName.trim() || isLoading}
                                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 active:scale-[0.98]">
                                        {isLoading
                                            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <><UserPlus className="w-4 h-4" /> Crear cuenta</>
                                        }
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-[11px] text-muted-foreground/40 py-4 px-6">
                    © 2025 Lollipop · Al registrarte aceptas nuestros Términos de Servicio.
                </p>
            </div>
        </div>
    );
}
