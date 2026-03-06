"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Plus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const INIT = [
    { code: "DOP", name: "Peso Dominicano", symbol: "RD$", rate: 1, def: true, on: true, trend: 0 },
    { code: "USD", name: "Dolar Estadounidense", symbol: "$", rate: 59.25, def: false, on: true, trend: 0.12 },
    { code: "EUR", name: "Euro", symbol: "E", rate: 64.80, def: false, on: true, trend: -0.05 },
    { code: "CAD", name: "Dolar Canadiense", symbol: "CA$", rate: 43.10, def: false, on: false, trend: 0.08 },
];

export default function MonedasPage() {
    const [list, setList] = useState(INIT);
    const [open, setOpen] = useState(false);
    const [fc, setFc] = useState(""); const [fn, setFn] = useState(""); const [fs, setFs] = useState(""); const [fr, setFr] = useState("");

    const toggle = (c: string) => setList(p => p.map(x => x.code === c && !x.def ? { ...x, on: !x.on } : x));
    const add = () => {
        if (!fc || !fn || !fr) return;
        setList(p => [...p, { code: fc.toUpperCase(), name: fn, symbol: fs || fc, rate: parseFloat(fr), def: false, on: true, trend: 0 }]);
        setOpen(false); setFc(""); setFn(""); setFs(""); setFr("");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-4xl">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Monedas</h2><p className="text-muted-foreground mt-1 text-sm">Administra las monedas y tasas de cambio.</p></div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> Actualizar Tasas</Button>
                    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" /> Agregar</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]"><DialogHeader><DialogTitle>Nueva Moneda</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Codigo ISO</Label><Input placeholder="USD" value={fc} onChange={e => setFc(e.target.value)} className="font-mono uppercase" /></div><div className="space-y-2"><Label>Simbolo</Label><Input placeholder="$" value={fs} onChange={e => setFs(e.target.value)} /></div></div>
                                <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Dolar Estadounidense" value={fn} onChange={e => setFn(e.target.value)} /></div>
                                <div className="space-y-2"><Label>Tasa (vs DOP)</Label><Input type="number" placeholder="59.25" value={fr} onChange={e => setFr(e.target.value)} /></div>
                            </div>
                            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}>Guardar</Button></div>
                        </DialogContent></Dialog>
                </div>
            </div>
            <div className="grid gap-3">{list.map(c => (
                <Card key={c.code} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm transition-all", !c.on && "opacity-50")}><CardContent className="p-5"><div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-black text-sm", c.def ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white" : "bg-muted text-foreground")}><span>{c.symbol}</span></div>
                    <div className="flex-1"><div className="flex items-center gap-2"><p className="font-bold">{c.name}</p>{c.def && <Badge className="text-[10px] bg-gradient-to-r from-blue-600 to-sky-500 text-white border-0">Principal</Badge>}</div><p className="text-xs text-muted-foreground font-mono mt-0.5">{c.code}</p></div>
                    <div className="text-center hidden sm:block"><p className="text-xs text-muted-foreground">Tasa</p><p className="font-black text-lg tabular-nums">RD$ {c.rate.toFixed(2)}</p>
                        {c.trend !== 0 && <p className={cn("text-xs flex items-center gap-0.5 justify-center", c.trend > 0 ? "text-emerald-600" : "text-red-500")}>{c.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(c.trend).toFixed(2)}</p>}
                    </div>
                    <Switch checked={c.on} onCheckedChange={() => toggle(c.code)} disabled={c.def} />
                </div></CardContent></Card>
            ))}</div>
            <Card className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10 border-blue-200/50 dark:border-blue-800/30"><CardContent className="p-5 flex items-center gap-4"><Globe className="w-8 h-8 text-blue-500 shrink-0" /><div><p className="font-bold text-sm">Tasas automaticas</p><p className="text-xs text-muted-foreground mt-0.5">Actualizacion diaria desde el Banco Central de la RD.</p></div><Button variant="outline" className="shrink-0 ml-auto">Configurar</Button></CardContent></Card>
        </div>
    );
}
