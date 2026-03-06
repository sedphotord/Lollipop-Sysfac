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
import { Calendar, Edit2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
    { id: 1, nombre: "Contado", dias: 0, desc: "Pago inmediato al emitir factura", predeterminado: true, activo: true },
    { id: 2, nombre: "Credito 15 dias", dias: 15, desc: "Vence 15 dias despues de la fecha", predeterminado: false, activo: true },
    { id: 3, nombre: "Credito 30 dias", dias: 30, desc: "Vence 30 dias despues de la fecha", predeterminado: false, activo: true },
    { id: 4, nombre: "Credito 45 dias", dias: 45, desc: "Vence 45 dias despues de la fecha", predeterminado: false, activo: true },
    { id: 5, nombre: "Credito 60 dias", dias: 60, desc: "Vence 60 dias despues de la fecha", predeterminado: false, activo: true },
    { id: 6, nombre: "Credito 90 dias", dias: 90, desc: "Vence 90 dias despues de la fecha", predeterminado: false, activo: false },
];

export default function TerminosPagoPage() {
    const [list, setList] = useState(INIT);
    const [open, setOpen] = useState(false);
    const [fn, setFn] = useState(""); const [fd, setFd] = useState(""); const [fDesc, setFDesc] = useState("");

    const toggle = (id: number) => setList(p => p.map(t => t.id === id ? { ...t, activo: !t.activo } : t));
    const setDefault = (id: number) => setList(p => p.map(t => ({ ...t, predeterminado: t.id === id })));
    const remove = (id: number) => setList(p => p.filter(t => t.id !== id || t.predeterminado));
    const add = () => { if (!fn) return; setList(p => [...p, { id: Date.now(), nombre: fn, dias: parseInt(fd) || 0, desc: fDesc, predeterminado: false, activo: true }]); setOpen(false); setFn(""); setFd(""); setFDesc(""); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Terminos de Pago</h2><p className="text-muted-foreground mt-1 text-sm">Define las condiciones de pago disponibles para facturas y cotizaciones.</p></div>
                <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" />Nuevo Termino</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Nuevo Termino de Pago</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Credito 30 dias" value={fn} onChange={e => setFn(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Dias de credito</Label><Input type="number" min="0" placeholder="30" value={fd} onChange={e => setFd(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Descripcion</Label><Input placeholder="Vence 30 dias despues..." value={fDesc} onChange={e => setFDesc(e.target.value)} /></div>
                        </div><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}>Guardar</Button></div>
                    </DialogContent></Dialog>
            </div>
            <div className="grid gap-3">{list.map(t => (
                <Card key={t.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-all", !t.activo && "opacity-50")}><CardContent className="p-4"><div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm tabular-nums", t.predeterminado ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white" : "bg-muted text-foreground")}>{t.dias === 0 ? "HOY" : t.dias + "d"}</div>
                    <div className="flex-1"><div className="flex items-center gap-2"><p className="font-bold">{t.nombre}</p>{t.predeterminado && <Badge className="text-[10px] bg-gradient-to-r from-blue-600 to-sky-500 text-white border-0">Default</Badge>}</div><p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p></div>
                    <div className="flex items-center gap-2">
                        {!t.predeterminado && <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setDefault(t.id)}>Hacer default</Button>}
                        {!t.predeterminado && <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4" /></Button>}
                        <Switch checked={t.activo} onCheckedChange={() => toggle(t.id)} />
                    </div>
                </div></CardContent></Card>
            ))}</div>
        </div>
    );
}
