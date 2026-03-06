"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    BellIcon, EnvelopeIcon, DevicePhoneMobileIcon,
    CheckCircleIcon, XCircleIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_notificaciones_config";

type Config = { id: string; label: string; email: boolean; push: boolean };

const DEFAULTS: Config[] = [
    { id: "factura_nueva", label: "Nueva factura emitida", email: true, push: true },
    { id: "pago_recibido", label: "Pago recibido", email: true, push: true },
    { id: "factura_vencida", label: "Factura próxima a vencer", email: true, push: false },
    { id: "cotizacion_aceptada", label: "Cotización aceptada por cliente", email: true, push: true },
    { id: "inventario_bajo", label: "Producto con inventario bajo", email: false, push: true },
    { id: "turno_cerrado", label: "Cierre de turno POS", email: false, push: true },
    { id: "gasto_registrado", label: "Nuevo gasto registrado", email: true, push: false },
    { id: "reporte_mensual", label: "Reporte mensual listo", email: true, push: false },
];

export default function NotificacionesPage() {
    const [config, setConfig] = useState<Config[]>([]);
    const [saved, setSaved] = useState(false);
    const [dias, setDias] = useState("3");

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) { const parsed = JSON.parse(raw); setConfig(parsed.config || DEFAULTS); setDias(parsed.dias || "3"); } else { setConfig(DEFAULTS); }
        } catch { setConfig(DEFAULTS); }
    }, []);

    const persist = () => {
        try { localStorage.setItem(LS_KEY, JSON.stringify({ config, dias })); } catch { }
        setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    const toggle = (id: string, field: "email" | "push") =>
        setConfig(p => p.map(c => c.id === id ? { ...c, [field]: !c[field] } : c));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notificaciones</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Configura qué eventos activan notificaciones por email y push.</p>
                </div>
                <Button onClick={persist} className="bg-gradient-brand border-0 text-white gap-2">
                    {saved ? <><CheckCircleIcon className="w-4 h-4" />Guardado!</> : <><BellIcon className="w-4 h-4" />Guardar</>}
                </Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        <BellIcon className="w-4 h-4 text-blue-500" /> Preferencias Generales
                    </h3>
                    <div className="space-y-2">
                        <Label>Avisar vencimiento de facturas (días antes)</Label>
                        <Select value={dias} onValueChange={setDias}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 día</SelectItem>
                                <SelectItem value="3">3 días</SelectItem>
                                <SelectItem value="5">5 días</SelectItem>
                                <SelectItem value="7">7 días</SelectItem>
                                <SelectItem value="15">15 días</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[1fr_64px_64px] px-5 py-3 bg-muted/40 border-b border-border/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evento</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center flex items-center gap-1 justify-center"><EnvelopeIcon className="w-3.5 h-3.5" />Email</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center flex items-center gap-1 justify-center"><DevicePhoneMobileIcon className="w-3.5 h-3.5" />Push</span>
                </div>
                <div className="divide-y divide-border/30">
                    {config.map(c => (
                        <div key={c.id} className="grid grid-cols-[1fr_64px_64px] px-5 py-3.5 hover:bg-muted/20 transition-colors">
                            <span className="text-sm font-medium">{c.label}</span>
                            <div className="flex justify-center"><Switch checked={c.email} onCheckedChange={() => toggle(c.id, "email")} /></div>
                            <div className="flex justify-center"><Switch checked={c.push} onCheckedChange={() => toggle(c.id, "push")} /></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
