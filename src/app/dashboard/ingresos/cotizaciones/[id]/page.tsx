"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeftIcon, CheckCircleIcon, DocumentTextIcon, StarIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_COTS = "lollipop_cotizaciones";

const STATUS_STYLES: Record<string, string> = {
    enviada: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    aceptada: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    vencida: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    borrador: "text-amber-600 bg-amber-500/10 border-amber-500/20",
};

export default function CotizacionEditPage() {
    const params = useParams();
    const router = useRouter();
    const cotId = params.id as string;

    const [cot, setCot] = useState<any>(null);
    const [saved, setSaved] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_COTS);
            const list = raw ? JSON.parse(raw) : [];
            const found = list.find((c: any) => c.id === cotId);
            if (found) { setCot(found); } else { setNotFound(true); }
        } catch { setNotFound(true); }
    }, [cotId]);

    const handleSave = () => {
        try {
            const raw = localStorage.getItem(LS_COTS);
            const list = raw ? JSON.parse(raw) : [];
            const updated = list.map((c: any) => c.id === cotId ? cot : c);
            localStorage.setItem(LS_COTS, JSON.stringify(updated));
        } catch { }
        setSaved(true);
        setTimeout(() => { setSaved(false); router.push("/dashboard/ingresos/cotizaciones"); }, 1500);
    };

    const setStatus = (status: string) => setCot((p: any) => ({ ...p, status }));
    const setField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setCot((p: any) => ({ ...p, [field]: e.target.value }));

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <DocumentTextIcon className="w-16 h-16 text-muted-foreground/30" />
                <h2 className="text-xl font-bold">Cotización no encontrada</h2>
                <p className="text-muted-foreground text-sm">El ID <code className="bg-muted px-2 py-0.5 rounded font-mono">{cotId}</code> no existe en el sistema.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard/ingresos/cotizaciones")} className="gap-2">
                    <ArrowLeftIcon className="w-4 h-4" /> Volver a Cotizaciones
                </Button>
            </div>
        );
    }

    if (!cot) return <div className="py-24 text-center text-muted-foreground">Cargando...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/ingresos/cotizaciones")} className="rounded-full">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{cot.id}</h2>
                        <Badge variant="outline" className={cn("text-xs capitalize", STATUS_STYLES[cot.status] || "bg-muted")}>{cot.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">Editar cotización · {cot.fecha}</p>
                </div>
                <Button onClick={handleSave} className="bg-gradient-brand border-0 text-white gap-2">
                    {saved ? <><CheckCircleIcon className="w-4 h-4" />Guardado!</> : <>Guardar Cambios</>}
                </Button>
            </div>

            {/* Estado */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-sm">Estado de la Cotización</h3>
                    <div className="flex flex-wrap gap-2">
                        {["borrador", "enviada", "aceptada", "vencida"].map(s => (
                            <button key={s} onClick={() => setStatus(s)}
                                className={cn("px-4 py-1.5 rounded-full text-sm border font-medium capitalize transition-all", cot.status === s ? (STATUS_STYLES[s] || "bg-primary text-white border-primary") : "border-border/60 text-muted-foreground hover:border-border")}>
                                {s}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Datos del cliente */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2"><StarIcon className="w-4 h-4 text-blue-500" /> Datos del Cliente</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombre del Cliente</Label>
                            <Input value={cot.clientData?.name || cot.cliente || ""} onChange={e => setCot((p: any) => ({ ...p, cliente: e.target.value, clientData: { ...(p.clientData || {}), name: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>RNC</Label>
                            <Input className="font-mono" value={cot.clientData?.rnc || ""} onChange={e => setCot((p: any) => ({ ...p, clientData: { ...(p.clientData || {}), rnc: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={cot.clientData?.email || ""} onChange={e => setCot((p: any) => ({ ...p, clientData: { ...(p.clientData || {}), email: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input value={cot.clientData?.phone || ""} onChange={e => setCot((p: any) => ({ ...p, clientData: { ...(p.clientData || {}), phone: e.target.value } }))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detalles */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-sm">Detalles de la Cotización</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input value={cot.fecha || ""} onChange={setField("fecha")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Válida hasta</Label>
                            <Input value={cot.validez || ""} onChange={setField("validez")} />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Concepto / Descripción</Label>
                            <Input value={cot.concepto || ""} onChange={setField("concepto")} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-4">Renglones</h3>
                    <div className="divide-y divide-border/40 space-y-2">
                        {(cot.items || []).map((item: any, i: number) => (
                            <div key={i} className="pt-2 first:pt-0">
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-xs">Descripción</Label>
                                        <Input value={item.description || ""} onChange={e => setCot((p: any) => {
                                            const items = [...p.items]; items[i] = { ...items[i], description: e.target.value }; return { ...p, items };
                                        })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Cant.</Label>
                                        <Input type="number" value={item.qty || ""} onChange={e => setCot((p: any) => {
                                            const items = [...p.items]; items[i] = { ...items[i], qty: parseInt(e.target.value) || 0 }; return { ...p, items };
                                        })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Precio (RD$)</Label>
                                        <Input type="number" value={item.price || ""} onChange={e => setCot((p: any) => {
                                            const items = [...p.items]; items[i] = { ...items[i], price: parseFloat(e.target.value) || 0 }; return { ...p, items };
                                        })} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className="mt-4 pt-4 border-t border-border/40 flex justify-end">
                        <div className="w-52 space-y-1 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>RD$ {(cot.items || []).reduce((a: number, it: any) => a + (it.qty || 0) * (it.price || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-black text-base pt-1 border-t border-border/40">
                                <span>Total</span>
                                <span className="text-primary">RD$ {(cot.totals?.total || cot.monto || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/dashboard/ingresos/cotizaciones")}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-gradient-brand border-0 text-white gap-2">
                    {saved ? <><CheckCircleIcon className="w-4 h-4" />Guardado!</> : "Guardar Cambios"}
                </Button>
            </div>
        </div>
    );
}
