"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, BookOpen, Calculator, DollarSign, Save, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContabilidadConfigPage() {
    const [metodo, setMetodo] = useState("devengado");
    const [moneda, setMoneda] = useState("DOP");
    const [autoAsientos, setAutoAsientos] = useState(true);
    const [retencionAuto, setRetencionAuto] = useState(true);
    const [cierreAuto, setCierreAuto] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Configuracion Contable</h2><p className="text-muted-foreground mt-1 text-sm">Define los parametros contables de tu empresa.</p></div>
                <Button onClick={handleSave} className="gap-2">{saved ? <BadgeCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}{saved ? "Guardado!" : "Guardar"}</Button>
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calculator className="w-5 h-5 text-purple-500" />Metodo Contable</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Metodo de contabilidad</Label>
                        <Select value={metodo} onValueChange={setMetodo}><SelectTrigger className="w-full max-w-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="devengado">Devengado (Accrual)</SelectItem><SelectItem value="efectivo">Base de Efectivo (Cash)</SelectItem></SelectContent></Select>
                        <p className="text-xs text-muted-foreground">{metodo === "devengado" ? "Los ingresos y gastos se registran cuando se generan, independientemente del cobro." : "Los ingresos y gastos se registran cuando se cobra o paga."}</p>
                    </div>
                    <div className="space-y-2"><Label>Moneda base</Label>
                        <Select value={moneda} onValueChange={setMoneda}><SelectTrigger className="w-full max-w-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DOP">DOP - Peso Dominicano</SelectItem><SelectItem value="USD">USD - Dolar</SelectItem></SelectContent></Select>
                    </div>
                </CardContent></Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="w-5 h-5 text-purple-500" />Automatizaciones</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                    {[
                        { label: "Asientos automaticos", desc: "Genera asientos contables al emitir facturas y registrar pagos.", checked: autoAsientos, onChange: setAutoAsientos },
                        { label: "Retenciones automaticas", desc: "Calcula y aplica retenciones TSS/ISR al procesar nomina.", checked: retencionAuto, onChange: setRetencionAuto },
                        { label: "Cierre mensual automatico", desc: "Cierra el periodo contable automaticamente el ultimo dia del mes.", checked: cierreAuto, onChange: setCierreAuto },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <div><p className="font-semibold text-sm">{item.label}</p><p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p></div>
                            <Switch checked={item.checked} onCheckedChange={item.onChange} />
                        </div>
                    ))}
                </CardContent></Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="w-5 h-5 text-purple-500" />Periodo Fiscal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Inicio del ejercicio</Label><Select defaultValue="enero"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"].map(m => <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Periodo actual</Label><div className="h-9 px-3 flex items-center bg-muted rounded-md text-sm font-medium">Enero - Diciembre 2024</div></div>
                    </div>
                </CardContent></Card>
        </div>
    );
}
