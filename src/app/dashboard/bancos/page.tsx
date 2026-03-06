"use client";

import { companyStorage } from "@/lib/company-storage";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeftRight, Check, ChevronDown, Eye, MoreVertical, Plus,
    RefreshCw, Search, Unlink, X, Pencil, PowerOff, Link2Off, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const LS_BANCOS = "lollipop_bancos";

// ── Chart (SVG with real data from localStorage) ────────────────────
function IncomesChart({ period }: { period: "6M" | "3M" | "7D" }) {
    const [ingresosData, setIngresosData] = useState<number[]>([]);
    const [gastosData2, setGastosData2] = useState<number[]>([]);
    const [chartLabels, setChartLabels] = useState<string[]>([]);

    useEffect(() => {
        const now = new Date();
        const invoices: any[] = (() => { try { return JSON.parse(companyStorage.get("invoice_emitted") || "[]"); } catch { return []; } })();
        const expenses: any[] = (() => { try { return JSON.parse(companyStorage.get("gastos") || "[]"); } catch { return []; } })();

        if (period === "7D") {
            const lbl: string[] = [], ing: number[] = [], gst: number[] = [];
            for (let d = 6; d >= 0; d--) {
                const date = new Date(now); date.setDate(now.getDate() - d);
                const iso = date.toISOString().split("T")[0];
                lbl.push(date.toLocaleDateString("es-DO", { weekday: "short" }));
                ing.push(invoices.filter((i: any) => (i.date || i.createdAt || "").startsWith(iso)).reduce((a: number, i: any) => a + (i.totals?.total || i.total || 0), 0));
                gst.push(expenses.filter((g: any) => (g.fecha || "").startsWith(iso)).reduce((a: number, g: any) => a + (g.monto || 0), 0));
            }
            setChartLabels(lbl); setIngresosData(ing); setGastosData2(gst);
        } else {
            const months = period === "6M" ? 6 : 3;
            const lbl: string[] = [], ing: number[] = [], gst: number[] = [];
            for (let m = months - 1; m >= 0; m--) {
                const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
                const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                lbl.push(d.toLocaleDateString("es-DO", { month: "short" }));
                ing.push(invoices.filter((i: any) => (i.date || i.createdAt || "").startsWith(ym)).reduce((a: number, i: any) => a + (i.totals?.total || i.total || 0), 0));
                gst.push(expenses.filter((g: any) => (g.fecha || "").startsWith(ym)).reduce((a: number, g: any) => a + (g.monto || 0), 0));
            }
            setChartLabels(lbl); setIngresosData(ing); setGastosData2(gst);
        }
    }, [period]);

    const W = 360, H = 130, PAD_L = 42, PAD_B = 30, PAD_T = 10;
    const plotW = W - PAD_L, plotH = H - PAD_B - PAD_T;
    const maxVal = Math.max(...ingresosData, ...gastosData2, 1);
    const n = chartLabels.length;
    const xS = (i: number) => PAD_L + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const yS = (v: number) => PAD_T + plotH - (v / maxVal) * plotH;
    const fmt = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toFixed(0);
    const linePath = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"} ${xS(i)} ${yS(v)}`).join(" ");
    const yTicks = [0, 1, 2, 3, 4].map(t => (t / 4) * maxVal);

    if (n === 0) return <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Cargando...</div>;
    const hasData = Math.max(...ingresosData, ...gastosData2) > 0;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
            {yTicks.map((v, i) => {
                const y = yS(v);
                return (<g key={i}><line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#e5e7eb" strokeWidth={0.8} /><text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize={8} fill="#9ca3af">{hasData ? fmt(v) : "0"}</text></g>);
            })}
            <path d={linePath(ingresosData)} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {ingresosData.map((v, i) => <circle key={i} cx={xS(i)} cy={yS(v)} r={3.5} fill="white" stroke="hsl(var(--primary))" strokeWidth={2} />)}
            <path d={linePath(gastosData2)} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {gastosData2.map((v, i) => <circle key={i} cx={xS(i)} cy={yS(v)} r={3.5} fill="white" stroke="#ef4444" strokeWidth={2} />)}
            {chartLabels.map((l, i) => <text key={i} x={xS(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">{l}</text>)}
        </svg>
    );
}

// ── Mock data ────────────────────────────────────────────────────
type Cuenta = {
    id: string; name: string; tipo: string; numero: string;
    saldo: number; currency: string; connected: boolean;
};

const INIT_CUENTAS: Cuenta[] = [
    { id: "1", name: "Tarjeta de crédito empresarial", tipo: "Tarjeta de crédito", numero: "", saldo: 0, currency: "DOP", connected: false },
    { id: "2", name: "Banco 1", tipo: "Banco", numero: "", saldo: 0, currency: "DOP", connected: false },
    { id: "3", name: "Caja general", tipo: "Efectivo", numero: "", saldo: 0, currency: "DOP", connected: false },
];

const TIPO_OPTS = [
    { value: "Banco", label: "Banco", sub: "Cuenta bancaria nacional tarjeta de débito" },
    { value: "Tarjeta de crédito", label: "Tarjeta de crédito", sub: "Tarjeta de crédito" },
    { value: "Efectivo", label: "Efectivo", sub: "Caja general o caja menor" },
];

// ── 3-dot menu component ─────────────────────────────────────────
function RowMenu({ onEdit, onDeactivate, onReconcile, onDelete }: {
    onEdit: () => void; onDeactivate: () => void; onReconcile: () => void; onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-border rounded-xl shadow-xl py-1.5 w-44 text-sm">
                    <button onClick={() => { setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/50 text-foreground transition-colors">
                        <ArrowLeftRight className="w-4 h-4 text-muted-foreground" /> Transferir
                    </button>
                    <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/50 text-foreground transition-colors">
                        <Pencil className="w-4 h-4 text-muted-foreground" /> Editar
                    </button>
                    <button onClick={() => { setOpen(false); onDeactivate(); }} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/50 text-foreground transition-colors">
                        <PowerOff className="w-4 h-4 text-muted-foreground" /> Desactivar
                    </button>
                    <button onClick={() => { setOpen(false); onReconcile(); }} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/50 text-foreground transition-colors">
                        <ArrowLeftRight className="w-4 h-4 text-muted-foreground" /> Conciliar
                    </button>
                    <div className="my-1 border-t border-border/50" />
                    <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Agregar banco modal ──────────────────────────────────────────
type BancoForm = { name: string; tipo: string; numero: string; saldo: string; currency: string; fechaSaldo: string; descripcion: string };
const EMPTY_FORM: BancoForm = {
    name: "", tipo: "Banco", numero: "", saldo: "", currency: "DOP",
    fechaSaldo: new Date().toISOString().split("T")[0], descripcion: ""
};

function AgregarBancoModal({ onClose, onSave }: { onClose: () => void; onSave: (f: BancoForm) => void }) {
    const [form, setForm] = useState<BancoForm>(EMPTY_FORM);
    const [tipoOpen, setTipoOpen] = useState(false);
    const tipoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (tipoRef.current && !tipoRef.current.contains(e.target as Node)) setTipoOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const set = (k: keyof BancoForm) => (v: string) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 fade-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="px-6 pt-6 pb-4">
                    <h2 className="text-lg font-bold text-slate-800">Agregar banco</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Crea tus cuentas de banco, efectivo o tarjetas de crédito.</p>
                </div>

                <div className="px-6 pb-6 space-y-4">
                    {/* Row 1: Nombre + Tipo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Nombre de la cuenta *</Label>
                            <Input placeholder="Nombre de la cuenta" value={form.name} onChange={e => set("name")(e.target.value)} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Tipo de cuenta *</Label>
                            {/* Custom dropdown matching the screenshot with descriptions */}
                            <div className="relative" ref={tipoRef}>
                                <button
                                    type="button"
                                    onClick={() => setTipoOpen(o => !o)}
                                    className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-input bg-background text-sm font-medium hover:border-primary/50 transition-colors"
                                >
                                    <span>{form.tipo}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", tipoOpen && "rotate-180")} />
                                </button>
                                {tipoOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-border rounded-xl shadow-xl py-1 overflow-hidden">
                                        {TIPO_OPTS.map(o => (
                                            <button key={o.value} type="button" onClick={() => { set("tipo")(o.value); setTipoOpen(false); }}
                                                className={cn("w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-start gap-2", form.tipo === o.value && "bg-primary/5")}>
                                                {form.tipo === o.value && <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />}
                                                {form.tipo !== o.value && <div className="w-4 h-4 shrink-0" />}
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{o.label}</p>
                                                    <p className="text-xs text-muted-foreground">{o.sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Número de cuenta */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">Número de cuenta</Label>
                        <Input placeholder="Número de cuenta" value={form.numero} onChange={e => set("numero")(e.target.value)} className="h-10" />
                    </div>

                    {/* Row 3: Saldo inicial + Fecha */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Saldo inicial *</Label>
                            <div className="flex h-10 rounded-lg border border-input overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <span className="px-3 flex items-center text-sm text-muted-foreground bg-muted/50 border-r border-input whitespace-nowrap">RD$</span>
                                <input
                                    type="number" placeholder="Saldo inicial" value={form.saldo}
                                    onChange={e => set("saldo")(e.target.value)}
                                    className="flex-1 px-3 text-sm bg-transparent outline-none min-w-0"
                                />
                                <span className="px-3 flex items-center text-sm text-muted-foreground bg-muted/50 border-l border-input whitespace-nowrap">
                                    <Select value={form.currency} onValueChange={set("currency")}>
                                        <SelectTrigger className="h-auto border-0 shadow-none bg-transparent p-0 text-xs font-semibold text-muted-foreground focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DOP">DOP</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Fecha de saldo inicial *</Label>
                            <div className="relative">
                                <Input type="date" value={form.fechaSaldo} onChange={e => set("fechaSaldo")(e.target.value)} className="h-10 pr-10" />
                                <button onClick={() => set("fechaSaldo")("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">Descripción</Label>
                        <Input placeholder="Descripción" value={form.descripcion} onChange={e => set("descripcion")(e.target.value)} className="h-10" />
                    </div>
                </div>

                <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
                    <button onClick={onClose} className="px-5 h-9 rounded-lg border border-border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                    <Button
                        onClick={() => { if (!form.name) return; onSave(form); }}
                        disabled={!form.name}
                        className="px-5 h-9 bg-gradient-brand border-0 text-white font-semibold rounded-lg"
                    >
                        Crear banco
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────
export default function BancosPage() {
    const [cuentas, setCuentas] = useState<Cuenta[]>(INIT_CUENTAS);
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState<"6M" | "3M" | "7D">("6M");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        try {
            const raw = companyStorage.get(LS_BANCOS);
            setCuentas(raw ? JSON.parse(raw) : INIT_CUENTAS);
        } catch { setCuentas(INIT_CUENTAS); }
    }, []);

    const persistCuentas = (data: Cuenta[]) => {
        setCuentas(data);
        try { companyStorage.set(LS_BANCOS, JSON.stringify(data)); } catch { }
    };

    const totalBancos = cuentas.filter(c => c.tipo !== "Tarjeta de crédito").reduce((a, c) => a + c.saldo, 0);
    const totalTarjetas = cuentas.filter(c => c.tipo === "Tarjeta de crédito").reduce((a, c) => a + c.saldo, 0);
    const filtered = cuentas.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const handleSave = (f: BancoForm) => {
        const newC: Cuenta = {
            id: Date.now().toString(), name: f.name, tipo: f.tipo,
            numero: f.numero, saldo: parseFloat(f.saldo) || 0, currency: f.currency, connected: false,
        };
        persistCuentas([...cuentas, newC]);
        setShowModal(false);
    };

    const handleDelete = (id: string) => persistCuentas(cuentas.filter(c => c.id !== id));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {showModal && <AgregarBancoModal onClose={() => setShowModal(false)} onSave={handleSave} />}

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bancos</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Controla los movimientos de{" "}
                        <span className="text-primary font-medium">dinero con tus cuentas de banco, efectivo y tarjetas de crédito.</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeftRight className="w-4 h-4" /> Transferir
                    </Button>
                    <Button size="sm" className="gap-2 bg-gradient-brand border-0 text-white shadow-sm" onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4" /> Agregar banco
                    </Button>
                </div>
            </div>

            {/* KPIs + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* KPI Left */}
                <div className="space-y-4">
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Saldo en bancos y efectivo</p>
                        <p className="text-2xl font-black text-primary mt-1">
                            RD${totalBancos.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Última actualización: <span className="font-semibold text-foreground">No hay datos</span></p>
                    </div>
                    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Deuda en tarjetas de crédito</p>
                        <p className="text-2xl font-black text-rose-500 mt-1">
                            RD${totalTarjetas.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Última actualización: <span className="font-semibold text-foreground">No hay datos</span></p>
                    </div>
                </div>

                {/* Chart Right */}
                <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-base">Ingresos y gastos</p>
                        <div className="flex rounded-lg border border-border overflow-hidden">
                            {(["6M", "3M", "7D"] as const).map(p => (
                                <button key={p} onClick={() => setPeriod(p)}
                                    className={cn("px-3 py-1 text-xs font-semibold transition-colors",
                                        period === p ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                                    )}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <IncomesChart period={period} />
                    <div className="flex items-center gap-4 mt-3 justify-center">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Ingresos
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Gastos
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
                {/* Table toolbar */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
                    <div className="relative w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar bancos..." value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-background text-sm" />
                    </div>
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Actualizar datos
                    </button>
                </div>

                {/* Table header */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border/60 bg-muted/20">
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-primary">Nombre</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Tipo de cuenta</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Número de cuenta</th>
                            <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground">Estado</th>
                            <th className="text-right px-4 py-2.5 font-semibold text-xs text-muted-foreground">Saldo</th>
                            <th className="w-16" />
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group">
                                <td className="px-4 py-3 font-medium text-primary hover:underline cursor-pointer">{c.name}</td>
                                <td className="px-4 py-3 text-foreground">{c.tipo}</td>
                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.numero || "—"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                        <Link2Off className="w-3.5 h-3.5" />
                                        <span>No conectado</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className={cn("font-semibold tabular-nums text-sm", c.saldo < 0 ? "text-rose-500" : "text-primary")}>
                                        RD${c.saldo.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-2 py-3">
                                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <RowMenu
                                            onEdit={() => { }}
                                            onDeactivate={() => { }}
                                            onReconcile={() => { }}
                                            onDelete={() => setCuentas(p => p.filter(x => x.id !== c.id))}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                                    No hay cuentas registradas. Agrega una para comenzar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}