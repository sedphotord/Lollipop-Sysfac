"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers, setSession, getSession } from "@/lib/auth-store";
import { getActiveCompanyId } from "@/lib/company-store";
import { seedAllCompaniesData } from "@/lib/seed-data";
import type { AppUser } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Delete, Eye, EyeOff, LogIn, ShieldCheck, Search, User } from "lucide-react";

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

function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function LoginPage() {
    const router = useRouter();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Username search mode
    const [searchMode, setSearchMode] = useState(false);
    const [usernameSearch, setUsernameSearch] = useState("");
    const [manualPin, setManualPin] = useState("");

    useEffect(() => {
        seedAllCompaniesData();
        if (getSession()) {
            router.replace("/dashboard");
            return;
        }
        setUsers(getUsers());
    }, [router]);

    // Filtered user list for search
    const filteredUsers = users.filter(u =>
        !usernameSearch ||
        u.name.toLowerCase().includes(usernameSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(usernameSearch.toLowerCase())
    );

    const handlePinKey = (key: string) => {
        if (key === "del") { setPin(p => p.slice(0, -1)); setError(""); return; }
        if (pin.length >= 4) return;
        const next = pin + key;
        setPin(next);
        setError("");
        if (next.length === 4) setTimeout(() => attemptLogin(next), 100);
    };

    const attemptLogin = (enteredPin: string) => {
        if (!selectedUser) return;
        setIsLoading(true);
        setTimeout(() => {
            if (enteredPin === selectedUser.pin) {
                setSession(selectedUser.id);
                if (selectedUser.companiesAccess.length > 0) {
                    const stored = getActiveCompanyId();
                    if (!selectedUser.companiesAccess.includes(stored)) {
                        localStorage.setItem("lollipop_active_company", selectedUser.companiesAccess[0]);
                    }
                }
                router.replace("/dashboard");
            } else {
                setPin(""); setManualPin("");
                setError("PIN incorrecto. Intenta de nuevo.");
                setIsLoading(false);
            }
        }, 300);
    };

    const handleUsernameLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        attemptLogin(manualPin);
    };

    const handleSelectUser = (user: AppUser) => {
        setSelectedUser(user);
        setPin(""); setManualPin(""); setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Lollipop</h1>
                    <p className="text-blue-300/80 text-sm mt-1">Sistema de Facturación</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/40">

                    {/* Mode toggle */}
                    {!selectedUser && (
                        <div className="flex gap-2 mb-5">
                            <button
                                onClick={() => setSearchMode(false)}
                                className={cn("flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                                    !searchMode ? "bg-blue-600 text-white shadow" : "bg-white/5 text-white/50 hover:text-white/80")}
                            >
                                Seleccionar cuenta
                            </button>
                            <button
                                onClick={() => setSearchMode(true)}
                                className={cn("flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                                    searchMode ? "bg-blue-600 text-white shadow" : "bg-white/5 text-white/50 hover:text-white/80")}
                            >
                                <Search className="w-3.5 h-3.5 inline mr-1.5" />Buscar usuario
                            </button>
                        </div>
                    )}

                    {!selectedUser ? (
                        <div>
                            {searchMode ? (
                                /* ── Search mode ── */
                                <div>
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            autoFocus
                                            type="text"
                                            value={usernameSearch}
                                            onChange={e => setUsernameSearch(e.target.value)}
                                            placeholder="Buscar por nombre o correo..."
                                            className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-blue-400/50 focus:bg-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-center text-white/30 py-6 text-sm">Sin resultados</p>
                                        ) : filteredUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleSelectUser(user)}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
                                            >
                                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0 bg-gradient-to-br", GLOBAL_ROLE_COLORS[user.globalRole])}>
                                                    {initials(user.name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                                                    <p className="text-[11px] text-white/40 truncate">{user.email || GLOBAL_ROLE_LABELS[user.globalRole]}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* ── User cards list ── */
                                <div className="space-y-2">
                                    <p className="text-center text-white/60 text-sm mb-4">Selecciona tu cuenta</p>
                                    {users.length === 0 ? (
                                        <p className="text-center text-white/40 py-8 text-sm">Cargando...</p>
                                    ) : users.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleSelectUser(user)}
                                            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group text-left"
                                        >
                                            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 bg-gradient-to-br", GLOBAL_ROLE_COLORS[user.globalRole])}>
                                                {initials(user.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                                                <p className="text-[11px] text-white/50">{GLOBAL_ROLE_LABELS[user.globalRole]} · {user.email}</p>
                                            </div>
                                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gradient-to-br text-white opacity-60 group-hover:opacity-100 transition-opacity shrink-0", GLOBAL_ROLE_COLORS[user.globalRole])}>
                                                {GLOBAL_ROLE_LABELS[user.globalRole]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── PIN entry ── */
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <button onClick={() => { setSelectedUser(null); setPin(""); setManualPin(""); setError(""); }} className="text-white/50 hover:text-white transition-colors text-sm">
                                    ← Volver
                                </button>
                                <div className="flex-1" />
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br", GLOBAL_ROLE_COLORS[selectedUser.globalRole])}>
                                        {initials(selectedUser.name)}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-semibold">{selectedUser.name}</p>
                                        <p className="text-white/50 text-[10px]">{GLOBAL_ROLE_LABELS[selectedUser.globalRole]}</p>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-center text-red-400 text-xs mb-4 font-medium">{error}</p>}

                            {/* Toggle between keypad and text PIN */}
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setShowPin(false)} className={cn("flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all", !showPin ? "bg-white/15 text-white" : "text-white/40 hover:text-white/60")}>
                                    Teclado PIN
                                </button>
                                <button onClick={() => setShowPin(true)} className={cn("flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all", showPin ? "bg-white/15 text-white" : "text-white/40 hover:text-white/60")}>
                                    <User className="w-3 h-3 inline mr-1" />Escribir PIN
                                </button>
                            </div>

                            {showPin ? (
                                /* Text PIN input */
                                <form onSubmit={handleUsernameLogin} className="space-y-3">
                                    <div className="relative">
                                        <input
                                            autoFocus
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={4}
                                            value={manualPin}
                                            onChange={e => { setManualPin(e.target.value); setError(""); }}
                                            placeholder="PIN de 4 dígitos"
                                            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-white/20 placeholder:text-base placeholder:tracking-normal outline-none focus:border-blue-400/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={manualPin.length !== 4 || isLoading}
                                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                                    >
                                        {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Ingresar</>}
                                    </button>
                                </form>
                            ) : (
                                /* PIN keypad */
                                <>
                                    <p className="text-center text-white/60 text-sm mb-4">Ingresa tu PIN de 4 dígitos</p>
                                    <div className="flex justify-center gap-4 mb-5">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className={cn("w-4 h-4 rounded-full border-2 transition-all duration-150",
                                                i < pin.length ? "bg-blue-400 border-blue-400 scale-110 shadow-lg shadow-blue-500/40" : "bg-transparent border-white/30"
                                            )} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(k => (
                                            <button key={k} onClick={() => handlePinKey(k)} disabled={isLoading}
                                                className="h-14 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/10 text-white font-bold text-lg transition-all disabled:opacity-40">
                                                {k}
                                            </button>
                                        ))}
                                        <div className="h-14" />
                                        <button onClick={() => handlePinKey("0")} disabled={isLoading}
                                            className="h-14 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 border border-white/10 text-white font-bold text-lg transition-all disabled:opacity-40">
                                            0
                                        </button>
                                        <button onClick={() => handlePinKey("del")} disabled={isLoading}
                                            className="h-14 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 text-white/50 hover:text-red-400 transition-all flex items-center justify-center">
                                            <Delete className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button onClick={() => pin.length === 4 && attemptLogin(pin)} disabled={pin.length < 4 || isLoading}
                                        className="mt-4 w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                                        {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Ingresar</>}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Demo hints */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
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
