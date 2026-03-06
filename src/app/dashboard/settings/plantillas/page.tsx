"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Check, Image as ImageIcon, LayoutTemplate,
    Save, Upload, Mail, FileText, Copy, Plus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const THEME_COLORS = [
    { name: "Blue", value: "#2563eb" },
    { name: "Slate", value: "#0f172a" },
    { name: "Emerald", value: "#059669" },
    { name: "Violet", value: "#7c3aed" },
    { name: "Rose", value: "#e11d48" },
    { name: "Orange", value: "#ea580c" },
];

const MOCK_INVOICE = {
    numero: "B0100000125", fecha: "2024-11-20", vence: "2024-12-20",
    cliente: { nombre: "Inversiones Tecnológicas SRL", rnc: "1-32-45678-9", direccion: "Av. Winston Churchill #105" },
    items: [
        { desc: "Consultoría de Software", cant: 40, precio: 2500, impuesto: 0.18, desc_pct: 0 },
        { desc: "Licencia Anual Plataforma V2", cant: 1, precio: 15000, impuesto: 0.18, desc_pct: 10 },
    ]
};

const DEFAULT_TEMPLATES = [
    {
        id: "factura-emitida", nombre: "Factura Emitida", tipo: "email", activa: true,
        asunto: "Factura {{numero}} de {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},\n\nAdjunto encontrará la factura N° {{numero}} por un monto total de RD$ {{total}}.\n\n📅 Fecha de vencimiento: {{vencimiento}}\n\nAgradecemos su preferencia.\n\nCordialmente,\n{{empresa}} | {{correo_empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "recordatorio-pago", nombre: "Recordatorio de Pago", tipo: "email", activa: true,
        asunto: "Recordatorio: Factura {{numero}} próxima a vencer",
        cuerpo: `Estimado/a {{cliente}},\n\nLe recordamos que la factura N° {{numero}} por RD$ {{total}} vence el {{vencimiento}}.\n\nSi ya realizó el pago, puede ignorar este mensaje.\n\nSaludos,\n{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}"],
    },
    {
        id: "pago-vencido", nombre: "Pago Vencido", tipo: "email", activa: false,
        asunto: "⚠️ Factura {{numero}} VENCIDA — {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},\n\nLe informamos que la factura N° {{numero}} por RD$ {{total}} se encuentra vencida desde el {{vencimiento}}.\n\nPor favor regularice su cuenta a la brevedad posible.\n\n{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}", "{{telefono_empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "cotizacion", nombre: "Cotización Enviada", tipo: "email", activa: true,
        asunto: "Cotización N° {{numero}} — {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},\n\nAdjuntamos la cotización N° {{numero}} con validez hasta el {{vencimiento}}.\n\nPara confirmar el pedido simplemente responda este correo.\n\n{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{vencimiento}}", "{{empresa}}"],
    },
    {
        id: "recibo-pago", nombre: "Recibo de Pago", tipo: "email", activa: true,
        asunto: "✅ Pago recibido — Factura {{numero}}",
        cuerpo: `Estimado/a {{cliente}},\n\nConfirmamos la recepción de su pago por RD$ {{monto_pagado}} correspondiente a la factura N° {{numero}}.\n\nGracias por su puntualidad.\n\n{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{monto_pagado}}", "{{empresa}}"],
    },
    {
        id: "nota-credito", nombre: "Nota de Crédito", tipo: "email", activa: true,
        asunto: "Nota de Crédito NC-{{numero}} emitida",
        cuerpo: `Estimado/a {{cliente}},\n\nAdjuntamos la Nota de Crédito N° NC-{{numero}} por RD$ {{total}} aplicada a la factura {{factura_referencia}}.\n\n{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{factura_referencia}}", "{{empresa}}"],
    },
    {
        id: "bienvenida-cliente", nombre: "Bienvenida al Cliente", tipo: "email", activa: true,
        asunto: "¡Bienvenido/a a {{empresa}}!",
        cuerpo: `Estimado/a {{cliente}},\n\nNos complace darle la bienvenida como nuevo cliente de {{empresa}}.\n\n¡Estamos a sus órdenes!\n\n{{empresa}} | {{correo_empresa}}`,
        variables: ["{{cliente}}", "{{empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "estado-cuenta", nombre: "Estado de Cuenta", tipo: "email", activa: false,
        asunto: "Estado de Cuenta — {{cliente}} / {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},\n\nAdjuntamos su estado de cuenta al {{fecha}}.\n\nSaldo total pendiente: RD$ {{saldo_total}}\n\n{{empresa}}`,
        variables: ["{{cliente}}", "{{empresa}}", "{{fecha}}", "{{saldo_total}}", "{{facturas_vencidas}}", "{{proximo_vencimiento}}"],
    },
    {
        id: "ticket-pos", nombre: "Ticket POS (Correo)", tipo: "email", activa: true,
        asunto: "Tu compra en {{empresa}} — {{fecha}}",
        cuerpo: `Gracias por tu compra.\n\nTicket N°: {{numero}}\nFecha: {{fecha}}\nTotal: RD$ {{total}}\n\n{{empresa}}`,
        variables: ["{{numero}}", "{{fecha}}", "{{total}}", "{{vendedor}}", "{{empresa}}"],
    },
];

type Theme = "standard" | "modern" | "corporate" | "elegant" | "minimal" | "ticket80";

const THEMES: { key: Theme; label: string; desc: string }[] = [
    { key: "standard", label: "Estándar", desc: "Profesional y limpio" },
    { key: "modern", label: "Moderno", desc: "Header con color" },
    { key: "corporate", label: "Corporativo", desc: "Barra lateral" },
    { key: "elegant", label: "Elegante", desc: "Doble línea fina" },
    { key: "minimal", label: "Minimalista", desc: "Sin adornos" },
    { key: "ticket80", label: "Ticket 80mm", desc: "Impresora térmica" },
];

export default function PlantillasPage() {
    const [template, setTemplate] = useState<Theme>("standard");
    const [primaryColor, setPrimaryColor] = useState(THEME_COLORS[0].value);
    const [showLogo, setShowLogo] = useState(true);
    const [showDiscount, setShowDiscount] = useState(true);
    const [showTaxCode, setShowTaxCode] = useState(false);
    const [showCodigo, setShowCodigo] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);

    const [emailTemplates, setEmailTemplates] = useState(DEFAULT_TEMPLATES);
    const [editingTpl, setEditingTpl] = useState<string | null>(null);
    const [editAsunto, setEditAsunto] = useState("");
    const [editCuerpo, setEditCuerpo] = useState("");

    const subtotal = MOCK_INVOICE.items.reduce((a, it) => a + it.cant * it.precio, 0);
    const discount = MOCK_INVOICE.items.reduce((a, it) => a + it.cant * it.precio * (it.desc_pct / 100), 0);
    const tax = MOCK_INVOICE.items.reduce((a, it) => {
        const net = it.cant * it.precio * (1 - it.desc_pct / 100);
        return a + net * it.impuesto;
    }, 0);
    const total = subtotal - discount + tax;
    const fmt = (n: number) => new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(n);

    const startEdit = (tpl: any) => { setEditingTpl(tpl.id); setEditAsunto(tpl.asunto); setEditCuerpo(tpl.cuerpo); };
    const saveEdit = () => {
        setEmailTemplates(prev => prev.map(t => t.id === editingTpl ? { ...t, asunto: editAsunto, cuerpo: editCuerpo } : t));
        setEditingTpl(null);
        toast.success("Plantilla actualizada");
    };
    const toggleActive = (id: string) => {
        setEmailTemplates(prev => prev.map(t => t.id === id ? { ...t, activa: !t.activa } : t));
    };
    const copyBody = (text: string) => {
        navigator.clipboard?.writeText(text).then(() => toast.success("Copiado al portapapeles"));
    };

    // Theme thumbnail renderers
    const ThumbStandard = () => (
        <>
            <div className="absolute top-0 left-0 right-0 h-3" style={{ background: primaryColor }} />
            <div className="absolute top-5 left-2 right-2 h-1 bg-slate-200 rounded" />
            <div className="absolute top-7 left-2 right-4 h-0.5 bg-slate-100 rounded" />
            <div className="absolute top-9 left-2 right-6 h-0.5 bg-slate-100 rounded" />
        </>
    );
    const ThumbModern = () => (
        <>
            <div className="absolute top-0 left-0 right-0 h-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}bb)` }} />
            <div className="absolute top-1.5 left-2 w-7 h-2 bg-white/70 rounded-sm" />
            <div className="absolute top-8 left-2 right-2 h-1 bg-slate-200 rounded" />
            <div className="absolute top-10 left-2 right-4 h-0.5 bg-slate-100 rounded" />
        </>
    );
    const ThumbCorporate = () => (
        <>
            <div className="absolute top-0 left-0 bottom-0 w-3" style={{ background: primaryColor }} />
            <div className="absolute top-2.5 left-5 right-2 h-2 bg-slate-700/70 rounded-sm" />
            <div className="absolute top-6.5 left-5 right-3 h-0.5 bg-slate-200 rounded" />
            <div className="absolute top-8.5 left-5 right-5 h-0.5 bg-slate-200 rounded" />
        </>
    );
    const ThumbElegant = () => (
        <>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: primaryColor }} />
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: primaryColor }} />
            <div className="absolute top-3 left-3 right-5 h-1.5 bg-slate-700/50 rounded-sm" />
            <div className="absolute top-6.5 left-3 right-4 h-px bg-slate-200 rounded" />
            <div className="absolute top-8.5 left-3 right-6 h-0.5 bg-slate-100 rounded" />
        </>
    );
    const ThumbMinimal = () => (
        <>
            <div className="absolute top-3 left-3 right-3 h-px bg-slate-200" />
            <div className="absolute top-5.5 left-3 right-5 h-0.5 bg-slate-100 rounded" />
            <div className="absolute top-7.5 left-3 right-4 h-0.5 bg-slate-100 rounded" />
            <div className="absolute top-9.5 left-3 right-7 h-0.5 bg-slate-100 rounded" />
        </>
    );
    const ThumbTicket = () => (
        <div className="absolute inset-1.5 bg-white border border-dashed border-slate-200 rounded flex flex-col items-center gap-0.5 pt-1.5 overflow-hidden">
            <div className="h-1 bg-slate-500 rounded w-3/4" />
            <div className="h-0.5 bg-slate-200 rounded w-1/2" />
            <div className="h-px bg-slate-100 w-full mt-0.5" />
            <div className="h-0.5 bg-slate-100 w-full" />
            <div className="h-px bg-slate-100 w-full" />
        </div>
    );

    const thumbMap: Record<Theme, React.ReactNode> = {
        standard: <ThumbStandard />,
        modern: <ThumbModern />,
        corporate: <ThumbCorporate />,
        elegant: <ThumbElegant />,
        minimal: <ThumbMinimal />,
        ticket80: <ThumbTicket />,
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] -m-4 md:-m-8">
            {/* Topbar */}
            <div className="h-14 border-b border-border/50 bg-background/95 backdrop-blur flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ArrowLeft className="w-4 h-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-base font-bold flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-blue-600" />
                            Plantillas
                        </h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">PDF de documentos y correos electrónicos.</p>
                    </div>
                </div>
                <Button size="sm" onClick={() => toast.success("Plantillas guardadas")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
            </div>

            <Tabs defaultValue="pdf" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 pt-3 border-b border-border/50 bg-background/80">
                    <TabsList className="bg-muted/50 h-9">
                        <TabsTrigger value="pdf" className="gap-2 text-xs">
                            <FileText className="w-3.5 h-3.5" /> Plantillas PDF
                        </TabsTrigger>
                        <TabsTrigger value="email" className="gap-2 text-xs">
                            <Mail className="w-3.5 h-3.5" /> Plantillas de Correo
                            <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">{emailTemplates.filter(t => t.activa).length} activas</Badge>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ── PDF TEMPLATES ── */}
                <TabsContent value="pdf" className="flex-1 flex overflow-hidden m-0 mt-0">

                    {/* LEFT: Controls */}
                    <div className="w-full md:w-[340px] border-r border-border/50 bg-muted/10 flex flex-col shrink-0 overflow-y-auto">
                        <div className="p-5 space-y-7">

                            {/* 1. Tema visual */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Tema Visual</p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">Un tema aplica a todos los documentos: facturas, cotizaciones, conduces, notas de crédito, comprobantes.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {THEMES.map(({ key, label, desc }) => (
                                        <button key={key} onClick={() => setTemplate(key)}
                                            className={cn("border-2 rounded-xl p-2 cursor-pointer transition-all text-center group",
                                                template === key
                                                    ? "border-blue-600 bg-blue-50/60 shadow-sm shadow-blue-200"
                                                    : "border-border/50 hover:border-blue-300/70 hover:bg-muted/30"
                                            )}
                                        >
                                            <div className="w-full h-11 bg-white rounded border border-border/30 mb-1.5 relative overflow-hidden shadow-sm">
                                                {thumbMap[key]}
                                            </div>
                                            <span className={cn("text-[10px] font-bold leading-tight block",
                                                template === key ? "text-blue-700" : "text-foreground/70")}>{label}</span>
                                            <span className={cn("text-[9px] leading-tight block mt-0.5",
                                                template === key ? "text-blue-500" : "text-muted-foreground/50")}>{desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Color */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Color Principal</p>
                                <div className="flex flex-wrap gap-2">
                                    {THEME_COLORS.map(c => (
                                        <button key={c.value} onClick={() => setPrimaryColor(c.value)}
                                            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border-2",
                                                primaryColor === c.value ? "border-foreground scale-110" : "border-transparent")}
                                            style={{ background: c.value }}>
                                            {primaryColor === c.value && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                                        </button>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                                        <div className="w-4 h-4 rounded-full" style={{ background: primaryColor }} />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Logo */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">3. Logo y Marca</p>
                                <div className="space-y-3">
                                    {[
                                        { id: "logo", label: "Mostrar Logo", val: showLogo, set: setShowLogo },
                                        { id: "wm", label: "Marca de Agua", val: showWatermark, set: setShowWatermark },
                                    ].map(({ id, label, val, set }) => (
                                        <div key={id} className="flex items-center justify-between">
                                            <Label className="text-sm">{label}</Label>
                                            <Switch checked={val} onCheckedChange={set} />
                                        </div>
                                    ))}
                                    {showLogo && (
                                        <div className="border-2 border-dashed border-border/50 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">Subir logo (PNG/JPG max 2MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Columnas */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">4. Columnas de la Tabla</p>
                                {[
                                    { id: "codigo", label: "Mostrar Código", val: showCodigo, set: setShowCodigo },
                                    { id: "desc", label: "Columna Descuento", val: showDiscount, set: setShowDiscount },
                                    { id: "tax", label: "% ITBIS por línea", val: showTaxCode, set: setShowTaxCode },
                                ].map(({ id, label, val, set }) => (
                                    <div key={id} className="flex items-center justify-between">
                                        <Label className="text-sm">{label}</Label>
                                        <Switch checked={val} onCheckedChange={set} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Live Preview */}
                    <div className="flex-1 bg-[#dde3ed] dark:bg-[#0f172a] overflow-y-auto p-8 flex justify-center items-start">

                        {/* Badge */}
                        <div className="absolute top-[7.5rem] right-8 z-10">
                            <div className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow">
                                Vista previa · {THEMES.find(t => t.key === template)?.label}
                            </div>
                        </div>

                        {/* TICKET 80mm */}
                        {template === "ticket80" ? (
                            <div className="w-[280px] bg-white shadow-2xl text-slate-800 font-mono rounded-sm">
                                <div className="p-4">
                                    <div className="text-center mb-3">
                                        <p className="font-black text-sm tracking-tight">MI EMPRESA SRL</p>
                                        <p className="text-slate-500 text-[10px]">RNC: 1-01-12345-1</p>
                                        <p className="text-slate-500 text-[10px]">809-555-0000</p>
                                        <div className="border-t border-dashed border-slate-300 my-2" />
                                        <p className="text-[10px] text-slate-600 font-bold">FACTURA</p>
                                        <p className="text-[10px] text-slate-500">{MOCK_INVOICE.numero}</p>
                                        <p className="text-[10px] text-slate-500">{MOCK_INVOICE.fecha}</p>
                                    </div>
                                    <div className="border-t border-dashed border-slate-300 mb-2" />
                                    <p className="text-[10px] text-slate-600 mb-1">Cliente: {MOCK_INVOICE.cliente.nombre}</p>
                                    <div className="border-t border-dashed border-slate-300 mb-2" />
                                    <table className="w-full text-[10px]">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-0.5">Desc.</th>
                                                <th className="text-center py-0.5">Cant</th>
                                                <th className="text-right py-0.5">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_INVOICE.items.map((item, i) => (
                                                <tr key={i} className="border-b border-slate-100">
                                                    <td className="py-0.5 pr-1 leading-tight text-[9px]">{item.desc}</td>
                                                    <td className="py-0.5 text-center">{item.cant}</td>
                                                    <td className="py-0.5 text-right">{fmt(item.cant * item.precio)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="border-t border-dashed border-slate-300 mt-2 pt-2 space-y-0.5 text-[10px]">
                                        <div className="flex justify-between"><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
                                        <div className="flex justify-between"><span>ITBIS 18%:</span><span>{fmt(tax)}</span></div>
                                        <div className="flex justify-between font-black text-sm border-t border-slate-400 pt-1 mt-1">
                                            <span>TOTAL:</span><span>{fmt(total)}</span>
                                        </div>
                                    </div>
                                    <div className="text-center mt-3 text-slate-400 text-[9px]">
                                        <div className="border-t border-dashed border-slate-200 pt-2">Gracias por su compra</div>
                                        <div className="mt-1 font-mono tracking-widest text-[8px]">||| | || ||| | | |||| |</div>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            /* STANDARD / MODERN / CORPORATE / ELEGANT / MINIMAL */
                            <div className={cn("w-full max-w-[680px] bg-white shadow-2xl overflow-hidden text-slate-800 text-sm",
                                template === "standard" && "border-t-[10px]",
                                template === "corporate" && "border-l-[10px]",
                                template === "elegant" && "border-t-[2px] border-b-[2px]",
                                template === "minimal" && "border border-slate-200 rounded-sm",
                            )} style={{
                                borderTopColor: ["standard", "elegant"].includes(template) ? primaryColor : undefined,
                                borderLeftColor: template === "corporate" ? primaryColor : undefined,
                                borderBottomColor: template === "elegant" ? primaryColor : undefined,
                            }}>

                                {/* MODERN: full-bleed header */}
                                {template === "modern" && (
                                    <div className="px-10 py-8 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` }}>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                {showLogo
                                                    ? <div className="w-24 h-10 bg-white/20 rounded flex items-center justify-center mb-2 text-white/70 text-xs"><ImageIcon className="w-4 h-4 mr-1" />Logo</div>
                                                    : <h2 className="text-2xl font-black tracking-tight">MI EMPRESA SRL</h2>}
                                                <p className="text-white/70 text-xs mt-1">RNC: 1-01-12345-1 · 809-555-0000</p>
                                            </div>
                                            <div className="text-right">
                                                <h1 className="text-4xl font-black uppercase tracking-tight opacity-90">Factura</h1>
                                                <p className="text-white/80 text-sm font-mono">{MOCK_INVOICE.numero}</p>
                                                <p className="text-white/60 text-xs mt-1">{MOCK_INVOICE.fecha} → {MOCK_INVOICE.vence}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CORPORATE: sidebar always visible via border, structured header */}
                                {template === "corporate" && (
                                    <div className="px-8 pt-8 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {showLogo
                                                    ? <div className="w-28 h-10 bg-slate-100 rounded flex items-center justify-center mb-2 text-slate-400 border text-xs"><ImageIcon className="w-4 h-4 mr-1" />Logo</div>
                                                    : <h2 className="text-xl font-black mb-1">MI EMPRESA SRL</h2>}
                                                <p className="text-xs text-slate-500">RNC: 1-01-12345-1</p>
                                                <p className="text-xs text-slate-500">809-555-0000</p>
                                            </div>
                                            <div className="text-right bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                <h1 className="text-2xl font-black uppercase" style={{ color: primaryColor }}>Factura</h1>
                                                <p className="text-sm font-mono text-slate-600">{MOCK_INVOICE.numero}</p>
                                                <p className="text-xs text-slate-500 mt-2">Fecha: {MOCK_INVOICE.fecha}</p>
                                                <p className="text-xs text-slate-500">Vence: {MOCK_INVOICE.vence}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-10" style={{ paddingTop: template === "modern" ? "24px" : template === "corporate" ? "16px" : undefined }}>

                                    {/* STANDARD / ELEGANT / MINIMAL header */}
                                    {["standard", "elegant", "minimal"].includes(template) && (
                                        <div className={cn("flex justify-between items-start mb-10",
                                            template === "elegant" && "border-b border-slate-200 pb-8",
                                            template === "minimal" && "border-b border-slate-100 pb-6"
                                        )}>
                                            <div>
                                                {showLogo
                                                    ? <div className="w-32 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 border border-slate-200 mb-3 text-xs"><ImageIcon className="w-4 h-4 mr-1" />Logo</div>
                                                    : <h2 className="text-xl font-black mb-3" style={{ color: template === "minimal" ? "#1e293b" : primaryColor }}>MI EMPRESA SRL</h2>}
                                                <div className="text-xs text-slate-500 leading-5">
                                                    <p>RNC: 1-01-12345-1</p><p>Av. 27 de Febrero #22</p><p>809-555-0000</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h1 className={cn("font-black uppercase mb-1",
                                                    template === "elegant" ? "text-2xl tracking-[0.12em]" : "text-3xl"
                                                )} style={{ color: template === "minimal" ? "#64748b" : primaryColor }}>Factura</h1>
                                                <p className="text-sm font-mono text-slate-600 mb-3">{MOCK_INVOICE.numero}</p>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                                    <span className="text-slate-400 text-right">Fecha:</span><span>{MOCK_INVOICE.fecha}</span>
                                                    <span className="text-slate-400 text-right">Vence:</span><span>{MOCK_INVOICE.vence}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* MODERN: client + dates below header */}
                                    {template === "modern" && (
                                        <div className="flex justify-between mb-8">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Facturar a</p>
                                                <p className="font-bold">{MOCK_INVOICE.cliente.nombre}</p>
                                                <p className="text-xs text-slate-500">RNC: {MOCK_INVOICE.cliente.rnc}</p>
                                            </div>
                                            <div className="text-right text-xs text-slate-500">
                                                <p>Fecha: {MOCK_INVOICE.fecha}</p>
                                                <p>Vence: {MOCK_INVOICE.vence}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Client block — standard/elegant/minimal */}
                                    {["standard", "elegant", "minimal"].includes(template) && (
                                        <div className="mb-7">
                                            <h3 className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: template === "minimal" ? "#64748b" : primaryColor }}>Facturar a:</h3>
                                            <p className="font-bold">{MOCK_INVOICE.cliente.nombre}</p>
                                            <p className="text-xs text-slate-500">RNC: {MOCK_INVOICE.cliente.rnc}</p>
                                            <p className="text-xs text-slate-500">{MOCK_INVOICE.cliente.direccion}</p>
                                        </div>
                                    )}

                                    {/* Corporate: client block */}
                                    {template === "corporate" && (
                                        <div className="mb-7 pt-4 border-t border-slate-200">
                                            <h3 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>Cliente:</h3>
                                            <p className="font-bold">{MOCK_INVOICE.cliente.nombre}</p>
                                            <p className="text-xs text-slate-500">RNC: {MOCK_INVOICE.cliente.rnc}</p>
                                        </div>
                                    )}

                                    {/* Items table */}
                                    <table className="w-full text-xs mb-6">
                                        <thead>
                                            <tr className={cn("text-left",
                                                template === "minimal" ? "border-b border-slate-200 text-slate-500" :
                                                    template === "elegant" ? "border-b-2 border-slate-300 text-slate-600" :
                                                        "text-white"
                                            )} style={{ backgroundColor: ["standard", "modern", "corporate"].includes(template) ? primaryColor : "transparent" }}>
                                                {showCodigo && <th className="p-2">Código</th>}
                                                <th className="p-2 w-1/2">Descripción</th>
                                                <th className="p-2 text-center">Cant</th>
                                                <th className="p-2 text-right">Precio</th>
                                                {showDiscount && <th className="p-2 text-right">Desc%</th>}
                                                {showTaxCode && <th className="p-2 text-center">ITBIS</th>}
                                                <th className="p-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {MOCK_INVOICE.items.map((item, i) => (
                                                <tr key={i} className={cn("text-slate-700",
                                                    template === "modern" && i % 2 === 0 && "bg-slate-50/40",
                                                    template === "corporate" && i % 2 === 0 && "bg-slate-50/30",
                                                )}>
                                                    {showCodigo && <td className="p-2 text-slate-400 font-mono">SRV-{100 + i}</td>}
                                                    <td className="p-2 font-medium">{item.desc}</td>
                                                    <td className="p-2 text-center">{item.cant}</td>
                                                    <td className="p-2 text-right">{fmt(item.precio)}</td>
                                                    {showDiscount && <td className="p-2 text-right text-slate-500">{item.desc_pct > 0 ? `${item.desc_pct}%` : "—"}</td>}
                                                    {showTaxCode && <td className="p-2 text-center text-slate-500">18%</td>}
                                                    <td className="p-2 text-right font-semibold">{fmt(item.cant * item.precio * (1 - item.desc_pct / 100))}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Totals */}
                                    <div className="flex justify-end">
                                        <div className="w-52 space-y-2 text-xs">
                                            <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
                                            <div className="flex justify-between text-slate-600"><span>Descuentos:</span><span className="text-red-500">-{fmt(discount)}</span></div>
                                            <div className="flex justify-between text-slate-600"><span>ITBIS 18%:</span><span>{fmt(tax)}</span></div>
                                            <div className={cn("flex justify-between font-black text-base pt-3 border-t-2",
                                                template === "minimal" ? "border-slate-100" : "border-slate-200"
                                            )} style={{ color: ["standard", "modern", "corporate"].includes(template) ? primaryColor : "#0f172a" }}>
                                                <span>TOTAL DOP:</span><span>{fmt(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Elegant footer */}
                                    {template === "elegant" && (
                                        <div className="mt-12 pt-4 border-t border-slate-200 text-center">
                                            <p className="text-xs text-slate-400 tracking-[0.15em] uppercase">Gracias por su preferencia</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ── EMAIL TEMPLATES ── */}
                <TabsContent value="email" className="flex-1 overflow-y-auto m-0 mt-0 p-6">
                    <div className="max-w-5xl mx-auto space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="font-bold text-lg">Plantillas de Correo</p>
                                <p className="text-xs text-muted-foreground">Personaliza los correos automáticos que se envían a tus clientes</p>
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => toast.info("Próximamente: crear plantilla personalizada")}>
                                <Plus className="w-4 h-4" /> Nueva Plantilla
                            </Button>
                        </div>
                        {emailTemplates.map(tpl => (
                            <div key={tpl.id} className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
                                {editingTpl === tpl.id ? (
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm">{tpl.nombre}</p>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingTpl(null)} className="text-muted-foreground h-7 px-2">✕</Button>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Asunto</Label>
                                            <input className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                value={editAsunto} onChange={e => setEditAsunto(e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Cuerpo</Label>
                                            <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                                                value={editCuerpo} onChange={e => setEditCuerpo(e.target.value)} />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => setEditingTpl(null)}>Cancelar</Button>
                                            <Button size="sm" onClick={saveEdit} className="bg-primary text-white"><Save className="w-3.5 h-3.5 mr-1" />Guardar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 flex items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-sm">{tpl.nombre}</p>
                                                <Badge variant={tpl.activa ? "default" : "secondary"} className={cn("text-[9px] h-4 px-1.5", tpl.activa ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "")}>
                                                    {tpl.activa ? "Activa" : "Inactiva"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">Asunto: {tpl.asunto}</p>
                                            <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">{tpl.cuerpo.split('\n')[0]}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {tpl.variables.map(v => (
                                                    <code key={v} className="text-[9px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground font-mono">{v}</code>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Switch checked={tpl.activa} onCheckedChange={() => toggleActive(tpl.id)} />
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyBody(tpl.cuerpo)}>
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => startEdit(tpl)}>
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
