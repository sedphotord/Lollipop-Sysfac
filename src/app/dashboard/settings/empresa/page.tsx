"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function EmpresaListPage() {
    const router = useRouter();
    const { companies, activeCompany, switchCompany } = useCompany();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mis Empresas</h2>
                    <p className="text-muted-foreground text-sm mt-1">Administra y edita los datos de cada empresa.</p>
                </div>
                <Button onClick={() => router.push("/dashboard/settings/empresa/nueva")}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" /> Nueva Empresa
                </Button>
            </div>

            <div className="space-y-3">
                {companies.map(company => (
                    <Card key={company.id} className={cn(
                        "bg-card/50 border-border/60 hover:shadow-md transition-all",
                        activeCompany?.id === company.id && "border-blue-500/40 shadow-sm shadow-blue-500/10"
                    )}>
                        <CardContent className="p-4 flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
                                style={{ background: company.color }}>
                                {initials(company.name)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-base truncate">{company.name}</p>
                                    {activeCompany?.id === company.id && (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] h-4 px-1.5">
                                            Activa
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {company.rnc ? `RNC ${company.rnc}` : "Sin RNC"} · {company.sector}
                                </p>
                                {company.email && <p className="text-xs text-muted-foreground truncate">{company.email}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {activeCompany?.id !== company.id && (
                                    <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() => switchCompany(company.id)}>
                                        Activar
                                    </Button>
                                )}
                                <Link href={`/dashboard/settings/empresa/${company.id}`}>
                                    <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                                        <Pencil className="w-3 h-3" /> Editar
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {companies.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-semibold">No hay empresas registradas</p>
                        <Button onClick={() => router.push("/dashboard/settings/empresa/nueva")} className="mt-4 gap-2">
                            <Plus className="w-4 h-4" /> Crear primera empresa
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
