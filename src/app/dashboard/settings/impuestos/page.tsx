"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Percent, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
    { id: "T1", nombre: "ITBIS 18%", tipo: "IVA", tasa: 18, aplica: "Bienes y servicios afectos", activo: true, sis: true },
    { id: "T2", nombre: "ITBIS 16%", tipo: "IVA", tasa: 16, aplica: "Telecomunicaciones", activo: true, sis: true },
    { id: "T3", nombre: "ITBIS Exento", tipo: "Exento", tasa: 0, aplica: "Productos exentos", activo: true, sis: true },
    { id: "T4", nombre: "Retencion ISR 10%", tipo: "Retencion", tasa: 10, aplica: "Servicios profesionales", activo: true, sis: false },
    { id: "T5", nombre: "Retencion ITBIS 30%", tipo: "Retencion", tasa: 30, aplica: "Personas fisicas", activo: true, sis: false },
];
const TC: Record<string, string> = { IVA: "bg-blue-500/10 text-blue-600 border-blue-500/20", Exento: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", Retencion: "bg-rose-500/10 text-rose-600 border-rose-500/20", Otro: "bg-amber-500/10 text-amber-600 border-amber-500/20" };

export default function ImpuestosPage() {
    const [list, setList] = useState(INIT);
    const [open, setOpen] = useState(false);
    const [fn, setFn] = useState(""); const [ft, setFt] = useState("IVA"); const [fp, setFp] = useState(""); const [fa, setFa] = useState("");
    const toggle = (id: string) => setList(p => p.map(t => t.id === id && !t.sis ? { ...t, activo: !t.activo } : t));
    const remove = (id: string) => setList(p => p.filter(t => t.id !== id || t.sis));
    const add = () => { if (!fn || !fp) return; setList(p => [...p, { id: `T${p.length + 1}`, nombre: fn, tipo: ft, tasa: parseFloat(fp), aplica: fa, activo: true, sis: false }]); setOpen(false); setFn(""); setFp(""); setFa(""); setFt("IVA"); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Impuestos y Retenciones</h2><p className="text-muted-foreground mt-1 text-sm">Configura ITBIS, retenciones ISR y otros impuestos.</p></div>
                <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" />Nuevo</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Crear Impuesto</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Nombre</Label><Input placeholder="ITBIS 18%" value={fn} onChange={e => setFn(e.target.value)} /></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Tipo</Label><Select value={ft} onValueChange={setFt}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="IVA">IVA/ITBIS</SelectItem><SelectItem value="Retencion">Retencion</SelectItem><SelectItem value="Exento">Exento</SelectItem><SelectItem value="Otro">Otro</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Tasa (%)</Label><Input type="number" placeholder="18" value={fp} onChange={e => setFp(e.target.value)} /></div></div>
                            <div className="space-y-2"><Label>Aplica a</Label><Input placeholder="Bienes y servicios" value={fa} onChange={e => setFa(e.target.value)} /></div>
                        </div><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}>Guardar</Button></div>
                    </DialogContent></Dialog>
            </div>
            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/30"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /><p className="text-sm text-amber-800 dark:text-amber-200">Los impuestos del sistema no pueden modificarse (vinculados al esquema e-CF DGII).</p></CardContent></Card>
            <div className="grid gap-3">{list.map(t => (
                <Card key={t.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm", !t.activo && "opacity-50")}><CardContent className="p-4"><div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border", TC[t.tipo] || TC["Otro"])}><Percent className="w-4 h-4" /><span className="font-black text-sm tabular-nums">{t.tasa}%</span></div>
                    <div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><p className="font-bold">{t.nombre}</p><Badge variant="outline" className={cn("text-[10px]", TC[t.tipo] || TC["Otro"])}>{t.tipo}</Badge>{t.sis && <Badge variant="outline" className="text-[10px] text-muted-foreground">DGII</Badge>}</div><p className="text-xs text-muted-foreground mt-0.5">{t.aplica}</p></div>
                    <div className="flex items-center gap-2">{!t.sis && <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4" /></Button>}<Switch checked={t.activo} onCheckedChange={() => toggle(t.id)} disabled={t.sis} /></div>
                </div></CardContent></Card>
            ))}</div>
        </div>
    );
}
