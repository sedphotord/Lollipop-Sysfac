"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/auth-store";
import { setSession, getSession } from "@/lib/auth-store";
import { getActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData } from "@/lib/seed-data";
import type { AppUser } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Delete, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

// Role labels for display
const GLOBAL_ROLE_LABELS: Record<string, string> = {
    contador: "Contador",
    propietario: "Propietario",
    empleado: "Empleado",
};

const GLOBAL_ROLE_COLORS: Record<string, string> = {
    contador: "from-blue-500 to-indigo-600",
    propietario: "from-amber-500 to-orange-600",
    empleado: "from-emerald-500 to-teal-600",
};

export default function LoginPage() {
    const router = useRouter();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        seedAllCompaniesData();
        // If already logged in, go to dashboard
        if (getSession()) {
            router.replace("/dashboard");
            return;
        }
        setUsers(getUsers());
    }, [router]);

    const handlePinKey = (key: string) => {
        if (key === "del") {
            setPin(p => p.slice(0, -1));
            setError("");
            return;
        }
        if (pin.length >= 4) return;
        const next = pin + key;
        setPin(next);
        setError("");
        if (next.length === 4) {
            setTimeout(() => attemptLogin(next), 100);
        }
    };

    const attemptLogin = (enteredPin: string) => {
        if (!selectedUser) return;
        setIsLoading(true);
        setTimeout(() => {
            if (enteredPin === selectedUser.pin) {
                setSession(selectedUser.id);
                // Set active company to first accessible company
                if (selectedUser.companiesAccess.length > 0) {
                    const stored = getActiveCompanyId();
                    if (!selectedUser.companiesAccess.includes(stored)) {
                        localStorage.setItem("lollipop_active_company", selectedUser.companiesAccess[0]);
                    }
                }
                router.replace("/dashboard");
            } else {
                setPin("");
                setError("PIN incorrecto. Intenta de nuevo.");
                setIsLoading(false);
            }
        }, 300);
    };

    const initials = (name: string) =>
        name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    const handleSelectUser = (user: AppUser) => {
        setSelectedUser(user);
        setPin("");
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Lollipop</h1>
                    <p className="text-blue-300/80 text-sm mt-1">Sistema de Facturación</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/40">

                    {!selectedUser ? (
                        /* ── STEP 1: Select user ── */
                        <div>
                            <p className="text-center text-white/70 text-sm mb-5 font-medium">
                                Selecciona tu cuenta para continuar
                            </p>
                            <div className="space-y-2">
                                {users.length === 0 ? (
                                    <p className="text-center text-white/40 py-8 text-sm">Cargando usuarios...</p>
                                ) : (
                                    users.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleSelectUser(user)}
                                            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group text-left"
                                        >
                                            <div className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 bg-gradient-to-br shadow-inner",
                                                GLOBAL_ROLE_COLORS[user.globalRole] ?? "from-slate-500 to-slate-600"
                                            )}>
                                                {initials(user.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                                                <p className="text-[11px] text-white/50">{GLOBAL_ROLE_LABELS[user.globalRole]} · {user.email}</p>
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gradient-to-br text-white opacity-70 group-hover:opacity-100 transition-opacity shrink-0",
                                                GLOBAL_ROLE_COLORS[user.globalRole]
                                            )}>
                                                {GLOBAL_ROLE_LABELS[user.globalRole]}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── STEP 2: PIN ── */
                        <div>
                            {/* Back + user info */}
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={() => { setSelectedUser(null); setPin(""); setError(""); }}
                                    className="text-white/50 hover:text-white transition-colors text-sm"
                                >
                                    ← Volver
                                </button>
                                <div className="flex-1" />
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br",
                                        GLOBAL_ROLE_COLORS[selectedUser.globalRole]
                                    )}>
                                        {initials(selectedUser.name)}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-semibold">{selectedUser.name}</p>
                                        <p className="text-white/50 text-[10px]">{GLOBAL_ROLE_LABELS[selectedUser.globalRole]}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-white/60 text-sm mb-5">Ingresa tu PIN de 4 dígitos</p>

                            {/* PIN dots */}
                            <div className="flex justify-center gap-4 mb-6">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className={cn(
                                        "w-4 h-4 rounded-full border-2 transition-all duration-150",
                                        i < pin.length
                                            ? "bg-blue-400 border-blue-400 scale-110 shadow-lg shadow-blue-500/40"
                                            : "bg-transparent border-white/30"
                                    )} />
                                ))}
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-center text-red-400 text-xs mb-4 font-medium animate-shake">{error}</p>
                            )}

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-2.5">
                                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(k => (
                                    <button
                                        key={k}
                                        onClick={() => handlePinKey(k)}
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/10 text-white font-bold text-lg transition-all duration-100 disabled:opacity-40"
                                    >
                                        {k}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowPin(s => !s)}
                                    className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/60 transition-all flex items-center justify-center"
                                >
                                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handlePinKey("0")}
                                    disabled={isLoading}
                                    className="h-14 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/10 text-white font-bold text-lg transition-all duration-100 disabled:opacity-40"
                                >
                                    0
                                </button>
                                <button
                                    onClick={() => handlePinKey("del")}
                                    disabled={isLoading}
                                    className="h-14 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 text-white/50 hover:text-red-400 transition-all flex items-center justify-center disabled:opacity-40"
                                >
                                    <Delete className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Enter button */}
                            <button
                                onClick={() => pin.length === 4 && attemptLogin(pin)}
                                disabled={pin.length < 4 || isLoading}
                                className="mt-4 w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Ingresar
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Demo hint */}
                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Cuentas de demo</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {[
                            { name: "Juan Pérez", role: "Contador", pin: "1234" },
                            { name: "Carlos Méndez", role: "Propietario Tech", pin: "4321" },
                            { name: "Pedro García", role: "Propietario Café", pin: "5678" },
                            { name: "María Sánchez", role: "Cajera", pin: "0000" },
                        ].map(u => (
                            <div key={u.pin} className="text-[10px] text-white/40">
                                <span className="text-white/60 font-semibold">{u.name}</span>
                                <span className="text-white/30"> · PIN: </span>
                                <span className="font-mono text-blue-400/70">{u.pin}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
