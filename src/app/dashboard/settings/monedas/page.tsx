"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Plus, TrendingDown, TrendingUp, Pencil, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_currencies";

type Currency = {
    code: string;
    name: string;
    symbol: string;
    rate: number;
    def: boolean;
    on: boolean;
    trend: number;
    updatedAt?: string;
};

const DEFAULTS: Currency[] = [
    { code: "DOP", name: "Peso Dominicano", symbol: "RD$", rate: 1, def: true, on: true, trend: 0, updatedAt: "" },
    { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 59.25, def: false, on: true, trend: 0.12, updatedAt: "" },
    { code: "EUR", name: "Euro", symbol: "€", rate: 64.80, def: false, on: true, trend: -0.05, updatedAt: "" },
    { code: "CAD", name: "Dólar Canadiense", symbol: "CA$", rate: 43.10, def: false, on: false, trend: 0.08, updatedAt: "" },
];

function now() {
    return new Date().toLocaleString("es-DO", { dateStyle: "short", timeStyle: "short" });
}

function load(): Currency[] {
    if (typeof window === "undefined") return DEFAULTS;
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : DEFAULTS;
    } catch { return DEFAULTS; }
}
function save(list: Currency[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function MonedasPage() {
    const [list, setList] = useState<Currency[]>(DEFAULTS);
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [fc, setFc] = useState(""); const [fn, setFn] = useState("");
    const [fs, setFs] = useState(""); const [fr, setFr] = useState("");

    useEffect(() => { setList(load()); }, []);

    const persist = (updated: Currency[]) => { setList(updated); save(updated); };

    const toggle = (code: string) =>
        persist(list.map(x => x.code === code && !x.def ? { ...x, on: !x.on } : x));

    const startEdit = (c: Currency) => {
        if (c.def) return;
        setEditingCode(c.code);
        setEditValue(c.rate.toString());
    };

    const cancelEdit = () => { setEditingCode(null); setEditValue(""); };

    const confirmEdit = (code: string) => {
        const newRate = parseFloat(editValue);
        if (isNaN(newRate) || newRate <= 0) return;
        const prev = list.find(c => c.code === code);
        const oldRate = prev?.rate ?? newRate;
        const trend = parseFloat((newRate - oldRate).toFixed(4));
        persist(list.map(c =>
            c.code === code ? { ...c, rate: newRate, trend, updatedAt: now() } : c
        ));
        cancelEdit();
    };

    const addCurrency = () => {
        if (!fc || !fn || !fr) return;
        const rate = parseFloat(fr);
        if (isNaN(rate) || rate <= 0) return;
        const newList: Currency[] = [
            ...list,
            { code: fc.toUpperCase().slice(0, 3), name: fn, symbol: fs || fc.toUpperCase().slice(0, 3), rate, def: false, on: true, trend: 0, updatedAt: now() }
        ];
        persist(newList);
        setAddOpen(false); setFc(""); setFn(""); setFs(""); setFr("");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Monedas</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Administra las tasas de cambio. Haz clic en la tasa para editarla manualmente.
                    </p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2">
                            <Plus className="w-4 h-4" /> Agregar moneda
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader><DialogTitle>Nueva Moneda</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Código ISO</Label>
                                    <Input placeholder="GBP" value={fc} onChange={e => setFc(e.target.value)} maxLength={3} className="font-mono uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Símbolo</Label>
                                    <Input placeholder="£" value={fs} onChange={e => setFs(e.target.value)} maxLength={4} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nombre</Label>
                                <Input placeholder="Libra Esterlina" value={fn} onChange={e => setFn(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tasa vs DOP</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">RD$</span>
                                    <Input type="number" step="0.01" min="0" placeholder="74.50" value={fr} onChange={e => setFr(e.target.value)} className="pl-12 font-mono" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
                            <Button onClick={addCurrency} disabled={!fc || !fn || !fr} className="bg-blue-600 text-white">Guardar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Currency cards */}
            <div className="grid gap-3">
                {list.map(c => (
                    <Card key={c.code} className={cn(
                        "bg-card/50 border-border/60 shadow-sm transition-all",
                        !c.on && "opacity-50"
                    )}>
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                {/* Currency icon */}
                                <div className={cn(
                                    "w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-black text-base",
                                    c.def ? "bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20"
                                        : "bg-muted text-foreground"
                                )}>
                                    {c.symbol}
                                </div>

                                {/* Name + code */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold truncate">{c.name}</p>
                                        {c.def && (
                                            <Badge className="text-[10px] bg-gradient-to-r from-blue-600 to-sky-500 text-white border-0">
                                                Principal
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.code}</p>
                                    {c.updatedAt && (
                                        <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-1">
                                            <Clock className="w-2.5 h-2.5" /> Actualizado {c.updatedAt}
                                        </p>
                                    )}
                                </div>

                                {/* Rate — inline editable */}
                                <div className="text-center shrink-0">
                                    <p className="text-xs text-muted-foreground mb-1">Tasa (DOP)</p>
                                    {c.def ? (
                                        <p className="font-black text-lg tabular-nums">RD$ 1.00</p>
                                    ) : editingCode === c.code ? (
                                        <div className="flex items-center gap-1.5">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">RD$</span>
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") confirmEdit(c.code);
                                                        if (e.key === "Escape") cancelEdit();
                                                    }}
                                                    className="w-28 pl-9 pr-2 py-1.5 border-2 border-blue-500 rounded-lg text-sm font-mono bg-background outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <button onClick={() => confirmEdit(c.code)}
                                                className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors">
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={cancelEdit}
                                                className="w-7 h-7 rounded-full bg-muted hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(c)}
                                            className="group flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                                            title="Click para editar tasa"
                                        >
                                            <p className="font-black text-lg tabular-nums group-hover:text-blue-600 transition-colors">
                                                RD$ {c.rate.toFixed(2)}
                                            </p>
                                            <Pencil className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    )}
                                    {c.trend !== 0 && editingCode !== c.code && (
                                        <p className={cn("text-[11px] flex items-center gap-0.5 justify-center mt-0.5",
                                            c.trend > 0 ? "text-emerald-600" : "text-red-500")}>
                                            {c.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {c.trend > 0 ? "+" : ""}{c.trend.toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* Toggle */}
                                <Switch checked={c.on} onCheckedChange={() => toggle(c.code)} disabled={c.def} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info card */}
            <Card className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10 border-blue-200/50 dark:border-blue-800/30">
                <CardContent className="p-5 flex items-start gap-4">
                    <Globe className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">Edición manual de tasas</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            Haz clic en cualquier tasa para editarla. Presiona <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Enter</kbd> para confirmar
                            o <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Esc</kbd> para cancelar.
                            Las tasas se guardan automáticamente y persisten entre sesiones.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
