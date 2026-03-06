"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers, setSession, getSession } from "@/lib/auth-store";
import { getActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LogIn, BookOpen } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        seedAllCompaniesData();
        if (getSession()) {
            router.replace("/dashboard");
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const users = getUsers();

        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (!user) {
            setError("Correo no registrado.");
            return;
        }
        if (user.pin !== pin) {
            setError("PIN incorrecto.");
            setPin("");
            return;
        }

        setIsLoading(true);
        setSession(user.id);

        // Set active company if current one is not accessible
        if (user.companiesAccess.length > 0) {
            const stored = getActiveCompanyId();
            if (!user.companiesAccess.includes(stored)) {
                localStorage.setItem("lollipop_active_company", user.companiesAccess[0]);
            }
        }

        router.replace("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Lollipop</h1>
                    <p className="text-blue-300/70 text-sm mt-1">Sistema de Facturación</p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-2xl shadow-black/40 space-y-4"
                >
                    <div>
                        <h2 className="text-white text-xl font-bold">Iniciar sesión</h2>
                        <p className="text-white/50 text-sm mt-0.5">Ingresa tu correo y PIN para continuar.</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Correo electrónico</label>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(""); }}
                            placeholder="tu@correo.com"
                            required
                            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all"
                        />
                    </div>

                    {/* PIN */}
                    <div className="space-y-1.5">
                        <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">PIN de acceso</label>
                        <div className="relative">
                            <input
                                type={showPin ? "text" : "password"}
                                inputMode="numeric"
                                maxLength={4}
                                value={pin}
                                onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                                placeholder="••••"
                                required
                                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/25 text-sm font-mono tracking-widest outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(s => !s)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!email || pin.length !== 4 || isLoading}
                        className={cn(
                            "w-full h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200",
                            "bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]",
                            "disabled:opacity-40"
                        )}
                    >
                        {isLoading
                            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><LogIn className="w-4 h-4" /> Iniciar Sesión</>
                        }
                    </button>
                </form>

                {/* Demo hint — collapsed */}
                <details className="mt-4 group">
                    <summary className="text-white/30 text-[11px] text-center cursor-pointer hover:text-white/50 transition-colors select-none">
                        Ver cuentas de prueba
                    </summary>
                    <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="grid grid-cols-2 gap-1.5">
                            {[
                                { email: "juan@lollipop.do", pin: "1234", role: "Contador" },
                                { email: "carlos@techsolutionsrd.com", pin: "4321", role: "Propietario" },
                                { email: "pedro@buensabor.do", pin: "5678", role: "Propietario" },
                                { email: "maria@buensabor.do", pin: "0000", role: "Cajera" },
                            ].map(u => (
                                <button
                                    key={u.email}
                                    type="button"
                                    onClick={() => { setEmail(u.email); setPin(u.pin); setError(""); }}
                                    className="text-left text-[10px] text-white/40 hover:text-white/70 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                >
                                    <span className="text-white/60 font-semibold block">{u.role}</span>
                                    <span className="font-mono text-blue-400/60">{u.email}</span>
                                    <span className="text-white/30"> · {u.pin}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
