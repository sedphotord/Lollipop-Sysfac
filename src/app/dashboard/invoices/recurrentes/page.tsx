"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, FileText, Plus, Repeat, Send, Users } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const RECURRENTES_MOCK = [
    { id: "REC-001", cliente: "GRUPO SALCEDO SRL", monto: 15000, frecuencia: "Mensual", proximo: "01 Nov 2024", activa: true },
    { id: "REC-002", cliente: "Juan Pérez", monto: 3500, frecuencia: "Semanal", proximo: "25 Oct 2024", activa: true },
    { id: "REC-003", cliente: "Constructora Bisono", monto: 45000, frecuencia: "Anual", proximo: "01 Ene 2025", activa: false },
];

export default function FacturasRecurrentesPage() {
    const [activos, setActivos] = useState(RECURRENTES_MOCK);

    const toggleActiva = (id: string) => {
        setActivos(activos.map(a => a.id === id ? { ...a, activa: !a.activa } : a));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/invoices" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight">Facturas Recurrentes</h2>
                    </div>
                    <p className="text-muted-foreground text-sm">Automatiza la emisión de facturas para igualas, alquileres o suscripciones.</p>
                </div>
                <Button className="bg-gradient-brand border-0 glow-sm-brand hover:scale-[1.02] transition-transform">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Recurrente
                </Button>
            </div>

            {/* Formulario / Creador */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Repeat className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-lg">Configurar Nueva Automatización</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Cliente</Label>
                            <Select>
                                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Seleccionar Cliente" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1">GRUPO SALCEDO SRL</SelectItem>
                                    <SelectItem value="c2">Juan Pérez</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Frecuencia</Label>
                            <Select defaultValue="mensual">
                                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Frecuencia" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semanal">Semanal</SelectItem>
                                    <SelectItem value="quincenal">Quincenal</SelectItem>
                                    <SelectItem value="mensual">Mensual</SelectItem>
                                    <SelectItem value="anual">Anual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Enviar por correo</Label>
                            <div className="flex items-center gap-3 h-10 px-3 rounded-md border border-input bg-muted/50 text-sm">
                                <Switch id="auto-email" defaultChecked />
                                <Label htmlFor="auto-email" className="cursor-pointer">Enviar factura automáticamente</Label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline">Cancelar</Button>
                        <Button className="bg-gradient-brand text-white border-0">
                            Guardar Automatización
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Listado */}
            <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" /> Automatizaciones Activas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activos.map(rec => (
                        <Card key={rec.id} className={`transition-all ${rec.activa ? 'border-primary/30 shadow-md ring-1 ring-primary/10' : 'opacity-70 grayscale-[0.5]'}`}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-sm truncate">{rec.cliente}</p>
                                        <p className="text-xs text-muted-foreground">{rec.id}</p>
                                    </div>
                                    <Switch checked={rec.activa} onCheckedChange={() => toggleActiva(rec.id)} />
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Frecuencia</p>
                                        <p className="text-sm font-medium">{rec.frecuencia}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Próxima Emisión</p>
                                        <p className="text-sm font-bold text-primary">{rec.proximo}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">Monto por factura</p>
                                    <p className="font-black text-lg">RD$ {rec.monto.toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
