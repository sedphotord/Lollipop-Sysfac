"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft, Building2, CheckCircle2, Sparkles
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { cn } from "@/lib/utils";

const SECTORS = [
    "Tecnología", "Restaurante / Comida", "Consultoría Financiera", "Comercio al por Menor",
    "Manufactura", "Salud / Médico", "Educación", "Construcción",
    "Importación / Exportación", "Transporte / Logística", "Servicios Profesionales", "Otro"
];

const COLORS = [
    "#2563eb", "#7c3aed", "#059669", "#d97706",
    "#dc2626", "#0891b2", "#4f46e5", "#be185d",
];

export default function NuevaEmpresaPage() {
    const router = useRouter();
    const { createCompany, switchCompany } = useCompany();

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [rnc, setRnc] = useState("");
    const [sector, setSector] = useState("");
    const [role, setRole] = useState("Administrador");
    const [color, setColor] = useState(COLORS[0]);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [created, setCreated] = useState<any>(null);

    const ROLES = ["Administrador", "Contador", "Colaborador", "Propietario", "Gerente"];

    const handleCreate = () => {
        if (!name.trim()) return;
        const company = createCompany({ name, rnc, sector: sector || "Otro", role, color, address, phone, email });
        setCreated(company);
        setStep(3);
    };

    const handleSwitch = () => {
        if (created) switchCompany(created.id);
        router.push('/dashboard');
    };

    return (
        <div className="max-w-lg mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/settings/empresa">
                    <button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground"><ArrowLeft className="w-5 h-5" /></button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Nueva Empresa</h2>
                    <p className="text-sm text-muted-foreground">Registra una empresa adicional en tu cuenta</p>
                </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2">
                {[1, 2].map(s => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            step > s ? "bg-emerald-500 text-white" : step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                            {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground hidden sm:block">
                            {s === 1 ? "Datos básicos" : "Personalizar"}
                        </span>
                        {s < 2 && <div className={cn("flex-1 h-0.5 rounded", step > s ? "bg-emerald-500" : "bg-muted")} />}
                    </div>
                ))}
            </div>

            {/* ── Step 1: Basic info ────── */}
            {step === 1 && (
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Información de la empresa</p>
                                <p className="text-xs text-muted-foreground">Datos de identificación fiscal</p>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre de la empresa *</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Mi Empresa SRL" autoFocus />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">RNC / Cédula</Label>
                            <Input value={rnc} onChange={e => setRnc(e.target.value)} placeholder="1-31-12345-6" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sector / Industria</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {SECTORS.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSector(s)}
                                        className={cn(
                                            "text-left text-xs px-3 py-2 rounded-xl border transition-all",
                                            sector === s
                                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                                : "border-border hover:border-muted-foreground text-muted-foreground"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tu rol en esta empresa</Label>
                            <div className="flex flex-wrap gap-2">
                                {ROLES.map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={cn(
                                            "text-xs px-3 py-1.5 rounded-lg border transition-all",
                                            role === r
                                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                                : "border-border text-muted-foreground hover:border-muted-foreground"
                                        )}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button className="w-full" disabled={!name.trim()} onClick={() => setStep(2)}>
                            Continuar →
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* ── Step 2: Color + contact ─ */}
            {step === 2 && (
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ background: color }}>
                                {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{name}</p>
                                <p className="text-xs text-muted-foreground">RNC: {rnc || '—'} · {sector || 'Sin sector'}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color identificador</Label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={cn("w-9 h-9 rounded-xl transition-all border-2", color === c ? "border-foreground scale-110 shadow-md" : "border-transparent hover:scale-105")}
                                        style={{ background: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dirección</Label>
                            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Av. 27 de Febrero #251, Santo Domingo" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teléfono</Label>
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="809-555-0000" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.do" type="email" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>← Atrás</Button>
                            <Button className="flex-1 gap-2 bg-primary text-white" onClick={handleCreate}>
                                <Sparkles className="w-4 h-4" /> Crear empresa
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Step 3: Success ──────── */}
            {step === 3 && created && (
                <Card className="bg-card/50 border-border/60 shadow-sm">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md mx-auto" style={{ background: created.color }}>
                            {created.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <h3 className="font-bold text-lg">{created.name}</h3>
                            <p className="text-sm text-muted-foreground">Empresa creada correctamente</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard/settings/empresa')}>Ver mis empresas</Button>
                            <Button className="flex-1 bg-primary text-white" onClick={handleSwitch}>Cambiar a esta empresa</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
