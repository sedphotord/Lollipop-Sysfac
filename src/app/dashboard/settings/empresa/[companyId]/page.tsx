"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, BadgeCheck, Building2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getCompanies, saveCompanies, type Company } from "@/lib/company-store";
import { cn } from "@/lib/utils";

const SECTORS = [
    "Tecnología", "Restaurante / Comida", "Consultoría Financiera", "Comercio al por Menor",
    "Manufactura", "Salud / Médico", "Educación", "Construcción",
    "Importación / Exportación", "Transporte / Logística", "Servicios Profesionales", "Otro"
];

const COLORS = [
    "#2563eb", "#7c3aed", "#059669", "#d97706",
    "#dc2626", "#0891b2", "#4f46e5", "#be185d",
    "#374151", "#0d9488", "#b45309", "#6d28d9",
];

function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function EditarEmpresaPage() {
    const router = useRouter();
    const params = useParams();
    const companyId = params.companyId as string;

    const [company, setCompany] = useState<Company | null>(null);
    const [name, setName] = useState("");
    const [rnc, setRnc] = useState("");
    const [sector, setSector] = useState("");
    const [color, setColor] = useState(COLORS[0]);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [saved, setSaved] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        const companies = getCompanies();
        const found = companies.find(c => c.id === companyId);
        if (!found) { router.replace("/dashboard/settings/empresa"); return; }
        setCompany(found);
        setName(found.name);
        setRnc(found.rnc ?? "");
        setSector(found.sector ?? "");
        setColor(found.color ?? COLORS[0]);
        setAddress(found.address ?? "");
        setPhone(found.phone ?? "");
        setEmail(found.email ?? "");
    }, [companyId, router]);

    const handleSave = () => {
        if (!name.trim()) return;
        const companies = getCompanies();
        const updated = companies.map(c =>
            c.id === companyId
                ? { ...c, name, rnc, sector, color, address, phone, email }
                : c
        );
        saveCompanies(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleDelete = () => {
        const companies = getCompanies();
        saveCompanies(companies.filter(c => c.id !== companyId));
        router.replace("/dashboard/settings/empresa");
    };

    if (!company) return null;

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/settings/empresa">
                    <button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </Link>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
                        style={{ background: color }}>
                        {initials(name || company.name)}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold tracking-tight truncate">{name || company.name}</h2>
                        <p className="text-sm text-muted-foreground">Editar información de la empresa</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={!name.trim()}
                    className={cn("gap-2 shrink-0", saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700")}>
                    {saved ? <BadgeCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "¡Guardado!" : "Guardar"}
                </Button>
            </div>

            {/* Datos básicos */}
            <Card className="bg-card/50 border-border/60">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" /> Información Legal
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre de la Empresa *</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mi Empresa SRL" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">RNC / Cédula</Label>
                            <Input value={rnc} onChange={e => setRnc(e.target.value)} placeholder="1-31-12345-6" className="font-mono" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="info@empresa.do" type="email" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teléfono</Label>
                            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="809-555-0000" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dirección</Label>
                            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Av. Winston Churchill, Santo Domingo" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sector */}
            <Card className="bg-card/50 border-border/60">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Sector / Industria</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SECTORS.map(s => (
                            <button key={s} type="button" onClick={() => setSector(s)}
                                className={cn(
                                    "text-left text-xs px-3 py-2 rounded-xl border transition-all",
                                    sector === s
                                        ? "border-blue-500 bg-blue-500/5 text-blue-600 font-semibold"
                                        : "border-border hover:border-muted-foreground text-muted-foreground"
                                )}>
                                {s}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Color */}
            <Card className="bg-card/50 border-border/60">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Color de Identificación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map(c => (
                            <button key={c} type="button" onClick={() => setColor(c)}
                                className={cn("w-10 h-10 rounded-xl transition-all border-2",
                                    color === c ? "border-foreground scale-110 shadow-md ring-2 ring-offset-2 ring-blue-500" : "border-transparent hover:scale-105"
                                )}
                                style={{ background: c }}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md" style={{ background: color }}>
                            {initials(name || company.name)}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{name || company.name}</p>
                            <p className="text-xs text-muted-foreground">{sector || "Sin sector"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="bg-card/50 border-red-500/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-500">Zona de Peligro</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Eliminar esta empresa</p>
                            <p className="text-xs text-muted-foreground">Se eliminarán todos los datos asociados. Esta acción no se puede deshacer.</p>
                        </div>
                        <Button variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-50 hover:border-red-500 gap-2 shrink-0 ml-4"
                            onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="w-4 h-4" /> Eliminar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar empresa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar <strong>{company.name}</strong>. Esta acción no se puede deshacer y todos los datos de esta empresa se perderán.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
