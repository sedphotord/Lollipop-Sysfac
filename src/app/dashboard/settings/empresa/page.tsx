"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    ArrowLeft, Plus, Search, Building2, CheckCircle2, Globe, Pencil,
    Trash2, ArrowLeftRight, TrendingUp, Users
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { cn } from "@/lib/utils";

export default function EmpresaPage() {
    const { companies, activeCompany, switchCompany } = useCompany();
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.rnc.includes(search) ||
        c.sector.toLowerCase().includes(search.toLowerCase())
    );

    const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const SECTOR_COLORS: Record<string, string> = {
        'Tecnología': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
        'Restaurante / Comida': 'bg-amber-500/10 text-amber-700 border-amber-500/30',
        'Consultoría Financiera': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/settings">
                        <button className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Mis Empresas</h2>
                        <p className="text-sm text-muted-foreground">Administra y cambia entre las empresas registradas</p>
                    </div>
                </div>
                <Button onClick={() => router.push('/dashboard/settings/empresa/nueva')} className="gap-2 bg-primary text-white hover:opacity-90">
                    <Plus className="w-4 h-4" /> Nueva Empresa
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Empresas registradas", value: companies.length, icon: Building2, color: "bg-blue-500/10 text-blue-600" },
                    { label: "Empresa activa", value: activeCompany?.name ?? '—', icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600", truncate: true },
                    { label: "Sectores", value: [...new Set(companies.map(c => c.sector))].length, icon: Globe, color: "bg-violet-500/10 text-violet-600" },
                ].map(({ label, value, icon: Icon, color, truncate }) => (
                    <Card key={label} className="bg-card/50 border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}><Icon className="w-5 h-5" /></div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                                <p className={cn("text-base font-bold", truncate && "truncate")}>{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar empresa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>

            {/* Company Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(comp => {
                    const isActive = activeCompany?.id === comp.id;
                    return (
                        <Card key={comp.id} className={cn(
                            "border-border/60 shadow-sm transition-all",
                            isActive
                                ? "border-primary/40 bg-primary/5 shadow-primary/10"
                                : "bg-card/50 hover:border-border hover:shadow-md"
                        )}>
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm" style={{ background: comp.color }}>
                                        {initials(comp.name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-sm truncate">{comp.name}</h3>
                                            {isActive && <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/30 border">Activa</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">RNC: {comp.rnc} · {comp.role}</p>
                                        <Badge
                                            className={cn("mt-2 text-[10px] border", SECTOR_COLORS[comp.sector] ?? 'bg-muted text-muted-foreground border-border')}
                                            variant="outline"
                                        >
                                            {comp.sector}
                                        </Badge>
                                        {comp.address && <p className="text-xs text-muted-foreground mt-2 truncate">{comp.address}</p>}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border/40">
                                    {!isActive && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="gap-1.5 text-xs h-8 flex-1"
                                            onClick={() => { switchCompany(comp.id); router.refresh(); }}
                                        >
                                            <ArrowLeftRight className="w-3.5 h-3.5" /> Cambiar a esta empresa
                                        </Button>
                                    )}
                                    {isActive && (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold flex-1">
                                            <CheckCircle2 className="w-4 h-4" /> Empresa activa actualmente
                                        </div>
                                    )}
                                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 px-3" onClick={() => router.push(`/dashboard/settings/empresa/${comp.id}`)}>
                                        <Pencil className="w-3.5 h-3.5" /> Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="lg:col-span-2 text-center py-16 text-muted-foreground">
                        No hay empresas registradas.
                    </div>
                )}
            </div>
        </div>
    );
}
