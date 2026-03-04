"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileText, Hash, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
    { id: 1, tipo: "B01", nombre: "Factura de Credito Fiscal", serie: "E310000000001", desde: 1, hasta: 500, usado: 47, estado: "activa" },
    { id: 2, tipo: "B02", nombre: "Factura de Consumo", serie: "E310000001001", desde: 1, hasta: 1000, usado: 234, estado: "activa" },
    { id: 3, tipo: "B04", nombre: "Nota de Credito", serie: "E310000002001", desde: 1, hasta: 200, usado: 12, estado: "activa" },
    { id: 4, tipo: "B14", nombre: "Regimen Especial", serie: "E310000003001", desde: 1, hasta: 100, usado: 3, estado: "activa" },
    { id: 5, tipo: "B15", nombre: "Comprobante Gubernamental", serie: "E310000004001", desde: 1, hasta: 50, usado: 0, estado: "inactiva" },
];

const TIPO_COLORS: Record<string, string> = {
    B01: "bg-blue-500/10 text-blue-600", B02: "bg-emerald-500/10 text-emerald-600",
    B04: "bg-rose-500/10 text-rose-600", B14: "bg-violet-500/10 text-violet-600",
    B15: "bg-amber-500/10 text-amber-600",
};

export default function NumeracionesPage() {
    const [list, setList] = useState(INIT);
    const [open, setOpen] = useState(false);
    const [ft, setFt] = useState("B01"); const [fs, setFs] = useState(""); const [fd, setFd] = useState("1"); const [fh, setFh] = useState("500");

    const add = () => {
        if (!fs) return;
        const nombres: Record<string, string> = { B01: "Factura de Credito Fiscal", B02: "Factura de Consumo", B04: "Nota de Credito", B14: "Regimen Especial", B15: "Gubernamental" };
        setList(p => [...p, { id: Date.now(), tipo: ft, nombre: nombres[ft] || ft, serie: fs, desde: parseInt(fd), hasta: parseInt(fh), usado: 0, estado: "activa" }]);
        setOpen(false); setFs(""); setFd("1"); setFh("500");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Numeraciones e-CF</h2><p className="text-muted-foreground mt-1 text-sm">Administra las secuencias de comprobantes fiscales electronicos autorizados por la DGII.</p></div>
                <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" />Nueva Secuencia</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Nueva Numeracion</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Tipo NCF</Label><Select value={ft} onValueChange={setFt}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="B01">B01 - Credito Fiscal</SelectItem><SelectItem value="B02">B02 - Consumo</SelectItem><SelectItem value="B04">B04 - Nota de Credito</SelectItem><SelectItem value="B14">B14 - Regimen Especial</SelectItem><SelectItem value="B15">B15 - Gubernamental</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>Serie (e-CF)</Label><Input placeholder="E310000000001" className="font-mono" value={fs} onChange={e => setFs(e.target.value)} /></div>
                            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Desde</Label><Input type="number" value={fd} onChange={e => setFd(e.target.value)} /></div><div className="space-y-2"><Label>Hasta</Label><Input type="number" value={fh} onChange={e => setFh(e.target.value)} /></div></div>
                        </div><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}>Guardar</Button></div>
                    </DialogContent></Dialog>
            </div>
            <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/30"><CardContent className="p-4 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /><p className="text-sm text-amber-800 dark:text-amber-200">Las secuencias deben coincidir con las autorizadas en tu cuenta DGII. Asegurate de ingresar los rangos correctos.</p></CardContent></Card>
            <div className="grid gap-3">{list.map(n => {
                const pct = n.hasta > 0 ? Math.round((n.usado / n.hasta) * 100) : 0;
                const low = pct > 80;
                return (
                    <Card key={n.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm", n.estado === "inactiva" && "opacity-50")}><CardContent className="p-5"><div className="flex items-center gap-4">
                        <div className={cn("w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-black text-sm", TIPO_COLORS[n.tipo] || "bg-muted")}><Hash className="w-4 h-4 mb-0.5" />{n.tipo}</div>
                        <div className="flex-1"><p className="font-bold">{n.nombre}</p><p className="text-xs text-muted-foreground font-mono mt-0.5">{n.serie}</p></div>
                        <div className="text-center hidden sm:block"><p className="text-xs text-muted-foreground">Rango</p><p className="text-sm font-mono tabular-nums">{n.desde} - {n.hasta}</p></div>
                        <div className="text-center hidden sm:block"><p className="text-xs text-muted-foreground">Usados</p><p className="text-sm font-bold tabular-nums">{n.usado} / {n.hasta}</p></div>
                        <div className="w-24 hidden sm:block"><div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all", low ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to-cyan-500")} style={{ width: `${pct}%` }} /></div><p className={cn("text-[10px] text-center mt-1 font-bold tabular-nums", low ? "text-red-500" : "text-muted-foreground")}>{pct}%</p></div>
                        <Badge variant="outline" className={cn("text-xs", n.estado === "activa" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-muted-foreground")}>{n.estado}</Badge>
                    </div></CardContent></Card>
                );
            })}</div>
        </div>
    );
}
