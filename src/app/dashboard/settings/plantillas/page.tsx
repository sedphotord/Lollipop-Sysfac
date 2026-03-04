"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Edit2, Eye, Mail, Plus, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
    { id: 1, nombre: "Factura emitida", asunto: "Factura #{numero} - {empresa}", trigger: "Al emitir factura", activo: true },
    { id: 2, nombre: "Recordatorio de pago", asunto: "Recordatorio: Factura #{numero} pendiente", trigger: "3 dias antes de vencer", activo: true },
    { id: 3, nombre: "Pago recibido", asunto: "Pago recibido - Factura #{numero}", trigger: "Al registrar pago", activo: true },
    { id: 4, nombre: "Cotizacion enviada", asunto: "Cotizacion #{numero} - {empresa}", trigger: "Al enviar cotizacion", activo: true },
    { id: 5, nombre: "Factura vencida", asunto: "Factura #{numero} vencida", trigger: "Al dia de vencimiento", activo: false },
];

export default function PlantillasCorreoPage() {
    const [list, setList] = useState(INIT);
    const [open, setOpen] = useState(false);
    const [fn, setFn] = useState(""); const [fa, setFa] = useState(""); const [ft, setFt] = useState("");
    const [preview, setPreview] = useState<number | null>(null);

    const toggle = (id: number) => setList(p => p.map(t => t.id === id ? { ...t, activo: !t.activo } : t));
    const add = () => { if (!fn || !fa) return; setList(p => [...p, { id: Date.now(), nombre: fn, asunto: fa, trigger: ft, activo: true }]); setOpen(false); setFn(""); setFa(""); setFt(""); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Plantillas de Correo</h2><p className="text-muted-foreground mt-1 text-sm">Personaliza los correos automaticos que se envian a tus clientes.</p></div>
                <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" />Nueva Plantilla</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Nueva Plantilla</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Factura emitida" value={fn} onChange={e => setFn(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Asunto del correo</Label><Input placeholder="Factura #{'{numero}'} - {'{empresa}'}" value={fa} onChange={e => setFa(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Se activa cuando</Label><Input placeholder="Al emitir factura" value={ft} onChange={e => setFt(e.target.value)} /></div>
                            <p className="text-xs text-muted-foreground">Variables: {'{numero}'}, {'{empresa}'}, {'{cliente}'}, {'{monto}'}, {'{fecha}'}</p>
                        </div><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}>Guardar</Button></div>
                    </DialogContent></Dialog>
            </div>
            <div className="grid gap-3">{list.map(t => (
                <Card key={t.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-all", !t.activo && "opacity-50")}><CardContent className="p-4"><div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-purple-500" /></div>
                    <div className="flex-1"><p className="font-bold text-sm">{t.nombre}</p><p className="text-xs text-muted-foreground font-mono mt-0.5">{t.asunto}</p><p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Send className="w-3 h-3" />{t.trigger}</p></div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                        <Switch checked={t.activo} onCheckedChange={() => toggle(t.id)} />
                    </div>
                </div></CardContent></Card>
            ))}</div>
        </div>
    );
}
