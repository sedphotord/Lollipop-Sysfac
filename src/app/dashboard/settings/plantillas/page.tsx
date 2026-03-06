"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Check, Image as ImageIcon, LayoutTemplate, Palette,
    Save, Upload, Mail, FileText, Copy, Pencil, CheckCircle2, Plus,
    Send, Clock, RefreshCw, X
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
    cliente: { nombre: "Inversiones Tecnológicas SRL", rnc: "1-32-45678-9", direccion: "Av. Winston Churchill #105", telefono: "809-555-0198" },
    items: [
        { desc: "Consultoría de Software", cant: 40, precio: 2500, impuesto: 0.18, desc_pct: 0 },
        { desc: "Licencia Anual Plataforma V2", cant: 1, precio: 15000, impuesto: 0.18, desc_pct: 10 },
    ]
};

const DEFAULT_TEMPLATES = [
    {
        id: "factura-emitida", nombre: "Factura Emitida", tipo: "email", activa: true,
        asunto: "Factura {{numero}} de {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},

Adjunto encontrará la factura N° {{numero}} por un monto total de RD$ {{total}}.

📅 Fecha de vencimiento: {{vencimiento}}

Para realizar su pago puede contactarnos o hacer una transferencia a:
• Banco Popular: 071-23456-1
• BHDLEÓN: 202-0001-12345-6

Agradecemos su preferencia.

Cordialmente,
{{empresa}} | {{correo_empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "recordatorio-pago", nombre: "Recordatorio de Pago", tipo: "email", activa: true,
        asunto: "Recordatorio: Factura {{numero}} próxima a vencer",
        cuerpo: `Estimado/a {{cliente}},

Le recordamos que la factura N° {{numero}} por RD$ {{total}} vence el {{vencimiento}}.

Si ya realizó el pago, puede ignorar este mensaje.

De tener alguna consulta, no dude en contactarnos.

Saludos,
{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}"],
    },
    {
        id: "pago-vencido", nombre: "Pago Vencido", tipo: "email", activa: false,
        asunto: "⚠️ Factura {{numero}} VENCIDA — {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},

Le informamos que la factura N° {{numero}} por RD$ {{total}} se encuentra vencida desde el {{vencimiento}}.

Por favor regularice su cuenta a la brevedad posible para evitar recargos.

Para coordinar el pago, comuníquese con nosotros:
📞 {{telefono_empresa}}
✉️ {{correo_empresa}}

{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{vencimiento}}", "{{empresa}}", "{{telefono_empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "cotizacion", nombre: "Cotización Enviada", tipo: "email", activa: true,
        asunto: "Cotización N° {{numero}} — {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},

En respuesta a su solicitud, adjuntamos la cotización N° {{numero}} con validez hasta el {{vencimiento}}.

Para confirmar el pedido simplemente responda este correo.

{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{vencimiento}}", "{{empresa}}"],
    },
    {
        id: "recibo-pago", nombre: "Recibo de Pago", tipo: "email", activa: true,
        asunto: "✅ Pago recibido — Factura {{numero}}",
        cuerpo: `Estimado/a {{cliente}},

Confirmamos la recepción de su pago por RD$ {{monto_pagado}} correspondiente a la factura N° {{numero}}.

Gracias por su puntualidad.

{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{monto_pagado}}", "{{empresa}}"],
    },
    {
        id: "nota-credito", nombre: "Nota de Crédito", tipo: "email", activa: true,
        asunto: "Nota de Crédito NC-{{numero}} emitida",
        cuerpo: `Estimado/a {{cliente}},

Adjuntamos la Nota de Crédito N° NC-{{numero}} por RD$ {{total}} aplicada a la factura {{factura_referencia}}.

El saldo a su favor queda reflejado en su cuenta.

{{empresa}}`,
        variables: ["{{numero}}", "{{cliente}}", "{{total}}", "{{factura_referencia}}", "{{empresa}}"],
    },
    {
        id: "bienvenida-cliente", nombre: "Bienvenida al Cliente", tipo: "email", activa: true,
        asunto: "¡Bienvenido/a a {{empresa}}!",
        cuerpo: `Estimado/a {{cliente}},

Nos complace darle la bienvenida como nuevo cliente de {{empresa}}.

A partir de ahora recibirá nuestras facturas, cotizaciones y comunicaciones a través de esta dirección.

¡Estamos a sus órdenes!

{{empresa}} | {{correo_empresa}}`,
        variables: ["{{cliente}}", "{{empresa}}", "{{correo_empresa}}"],
    },
    {
        id: "estado-cuenta", nombre: "Estado de Cuenta", tipo: "email", activa: false,
        asunto: "Estado de Cuenta — {{cliente}} / {{empresa}}",
        cuerpo: `Estimado/a {{cliente}},

Adjuntamos su estado de cuenta al {{fecha}}.

Saldo total pendiente: RD$ {{saldo_total}}
Facturas vencidas: {{facturas_vencidas}}
Próximo vencimiento: {{proximo_vencimiento}}

Por favor revise el detalle adjunto y proceda con los pagos correspondientes.

{{empresa}}`,
        variables: ["{{cliente}}", "{{empresa}}", "{{fecha}}", "{{saldo_total}}", "{{facturas_vencidas}}", "{{proximo_vencimiento}}"],
    },
    {
        id: "ticket-pos", nombre: "Ticket POS (Correo)", tipo: "email", activa: true,
        asunto: "Tu compra en {{empresa}} — {{fecha}}",
        cuerpo: `Gracias por tu compra.

Ticket N°: {{numero}}
Fecha: {{fecha}}
Total: RD$ {{total}}
Atendido por: {{vendedor}}

{{empresa}}`,
        variables: ["{{numero}}", "{{fecha}}", "{{total}}", "{{vendedor}}", "{{empresa}}"],
    },
];

export default function PlantillasPage() {
    const [template, setTemplate] = useState<string>("InvoiceStandard");
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

    const startEdit = (tpl: any) => {
        setEditingTpl(tpl.id);
        setEditAsunto(tpl.asunto);
        setEditCuerpo(tpl.cuerpo);
    };

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
                        <p className="text-xs text-muted-foreground hidden sm:block">PDF de facturas y correos electrónicos.</p>
                    </div>
                </div>
                <Button size="sm" onClick={() => toast.success("Plantillas PDF guardadas")} className="bg-blue-600 hover:bg-blue-700 text-white">
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

                {/* ── PDF TEMPLATES ────────── */}
                <TabsContent value="pdf" className="flex-1 flex overflow-hidden m-0 mt-0">
                    <div className="w-full md:w-[380px] border-r border-border/50 bg-muted/10 flex flex-col shrink-0 overflow-y-auto">
                        <div className="p-5 space-y-7">
                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Plantilla</p>
                                {([
                                    {
                                        group: "Facturas", items: [
                                            { key: "InvoiceStandard", label: "Estándar", preview: "top-band" },
                                            { key: "InvoiceModern", label: "Moderno", preview: "gradient" },
                                            { key: "InvoiceCorporate", label: "Corporativo", preview: "sidebar" },
                                            { key: "InvoiceElegant", label: "Elegante", preview: "elegant" },
                                            { key: "InvoiceMinimal", label: "Minimalista", preview: "minimal" },
                                        ]
                                    },
                                    {
                                        group: "Cotizaciones", items: [
                                            { key: "QuoteStandard", label: "Cotización Estándar", preview: "top-band" },
                                            { key: "QuoteDetailed", label: "Cotización Detallada", preview: "two-col" },
                                        ]
                                    },
                                    {
                                        group: "Comprobantes", items: [
                                            { key: "PaymentReceipt", label: "Recibo de Pago", preview: "receipt" },
                                            { key: "TicketPOS", label: "Ticket POS (80mm)", preview: "ticket" },
                                        ]
                                    },
                                    {
                                        group: "Documentos", items: [
                                            { key: "DeliveryNote", label: "Conduce / Remisión", preview: "minimal" },
                                            { key: "AccountStatement", label: "Estado de Cuenta", preview: "table" },
                                        ]
                                    },
                                ] as const).map(({ group, items }) => (
                                    <div key={group}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-2">
                                            <span className="h-px flex-1 bg-border/50" />
                                            {group}
                                            <span className="h-px flex-1 bg-border/50" />
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {items.map(({ key, label, preview }) => (
                                                <button key={key} onClick={() => setTemplate(key)}
                                                    className={cn("border-2 rounded-xl p-2.5 cursor-pointer transition-all text-left", template === key ? "border-blue-600 bg-blue-50/50" : "border-border/50 hover:border-border")}
                                                >
                                                    <div className="w-full h-8 bg-white rounded border border-border/40 mb-1.5 relative overflow-hidden">
                                                        {preview === "top-band" && <div className="absolute top-0 left-0 right-0 h-2" style={{ background: primaryColor }} />}
                                                        {preview === "gradient" && <div className="absolute top-0 left-0 right-0 h-full opacity-20" style={{ background: `linear-gradient(135deg, ${primaryColor}, transparent)` }} />}
                                                        {preview === "sidebar" && <div className="absolute top-0 left-0 bottom-0 w-3" style={{ background: primaryColor }} />}
                                                        {preview === "elegant" && <><div className="absolute top-0 left-0 right-0 h-1" style={{ background: primaryColor }} /><div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: primaryColor }} /></>}
                                                        {preview === "minimal" && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-0.5 bg-slate-300" /></div>}
                                                        {preview === "receipt" && <div className="absolute bottom-0 left-0 right-0 h-3 bg-emerald-600/20 border-t border-emerald-600/30" />}
                                                        {preview === "ticket" && <><div className="absolute top-0 left-0 right-0 h-full bg-slate-50" /><div className="absolute inset-x-2 top-1 bottom-1 border border-dashed border-slate-300 rounded" /></>}
                                                        {preview === "two-col" && <><div className="absolute top-0 left-0 bottom-0 w-1/3 bg-slate-100" /><div className="absolute top-0 left-0 right-0 h-2" style={{ background: primaryColor }} /></>}
                                                        {preview === "table" && <><div className="absolute top-0 left-0 right-0 h-2 bg-slate-200" /><div className="absolute top-3 left-0 right-0 h-px bg-slate-200" /><div className="absolute top-5 left-0 right-0 h-px bg-slate-200" /></>}
                                                    </div>
                                                    <span className={cn("text-[10px] font-semibold leading-tight", template === key ? "text-blue-700" : "text-muted-foreground")}>{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Color Principal</p>
                                <div className="flex flex-wrap gap-2">
                                    {THEME_COLORS.map(c => (
                                        <button key={c.value} onClick={() => setPrimaryColor(c.value)}
                                            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border-2", primaryColor === c.value ? "border-foreground scale-110" : "border-transparent")}
                                            style={{ background: c.value }}>
                                            {primaryColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                                        </button>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative">
                                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                                        <div className="w-4 h-4 rounded-full" style={{ background: primaryColor }} />
                                    </div>
                                </div>
                            </div>

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

                    {/* PDF Preview */}
                    <div className="flex-1 bg-[#e2e8f0] dark:bg-[#0f172a] overflow-y-auto p-6 flex justify-center items-start">
                        <div className={cn("w-full max-w-[720px] bg-white shadow-2xl overflow-hidden min-h-[900px] relative text-slate-800 text-sm",
                            ["InvoiceStandard", "InvoiceModern", "QuoteStandard", "QuoteDetailed", "DeliveryNote", "AccountStatement"].includes(template) && "border-t-[12px]",
                            template === "InvoiceCorporate" && "border-l-[8px]",
                            template === "InvoiceElegant" && "border-t-4 border-b-4",
                            template === "TicketPOS" && "max-w-[200px] mx-auto",
                            template === "PaymentReceipt" && "border-t-[6px]"
                        )}
                            style={{
                                borderTopColor: ["InvoiceStandard", "InvoiceModern", "QuoteStandard", "QuoteDetailed", "DeliveryNote", "AccountStatement", "InvoiceElegant", "PaymentReceipt"].includes(template) ? primaryColor : undefined,
                                borderLeftColor: template === "InvoiceCorporate" ? primaryColor : undefined,
                                borderBottomColor: template === "InvoiceElegant" ? primaryColor : undefined,
                            }}>
                            <div className="p-10">
                                <div className={cn("flex justify-between items-start mb-10",
                                    template === "InvoiceMinimal" && "flex-col gap-4 items-center text-center",
                                    template === "InvoiceCorporate" && "border-b-2 pb-5 border-slate-200",
                                    template === "QuoteDetailed" && "border-b border-dashed pb-5 border-slate-300"
                                )}>
                                    <div>
                                        {showLogo ? <div className="w-32 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 border border-slate-200 mb-3"><ImageIcon className="w-4 h-4 mr-1" />Logo</div>
                                            : <h2 className="text-xl font-black mb-3" style={{ color: primaryColor }}>MI EMPRESA SRL</h2>}
                                        <div className="text-xs text-slate-500 leading-5"><p>RNC: 1-01-12345-1</p><p>Av. 27 de Febrero #22</p><p>809-555-0000</p></div>
                                    </div>
                                    <div className={cn("text-right", template === "modern" && "bg-slate-50 p-4 rounded-xl border border-slate-100")}>
                                        <h1 className="text-3xl font-black uppercase mb-1" style={{ color: template === "modern" ? primaryColor : "#1e293b" }}>Factura</h1>
                                        <p className="text-base font-medium text-slate-700 mb-3">{MOCK_INVOICE.numero}</p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                            <div className="text-slate-500 text-right">Fecha:</div><div className="text-slate-800 text-left">{MOCK_INVOICE.fecha}</div>
                                            <div className="text-slate-500 text-right">Vence:</div><div className="text-slate-800 text-left">{MOCK_INVOICE.vence}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-7">
                                    <h3 className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: primaryColor }}>Facturar a:</h3>
                                    <p className="font-bold">{MOCK_INVOICE.cliente.nombre}</p>
                                    <p className="text-xs text-slate-500">RNC: {MOCK_INVOICE.cliente.rnc}</p>
                                    <p className="text-xs text-slate-500">{MOCK_INVOICE.cliente.direccion}</p>
                                </div>
                                <table className="w-full text-xs mb-6">
                                    <thead>
                                        <tr className={cn("text-left", template === "modern" ? "text-white" : "border-b-2 border-slate-300 text-slate-600")}
                                            style={{ backgroundColor: ["InvoiceStandard", "InvoiceModern", "InvoiceCorporate", "InvoiceElegant", "QuoteStandard", "QuoteDetailed", "DeliveryNote", "AccountStatement"].includes(template) ? primaryColor : template === "PaymentReceipt" ? "#059669" : "transparent" }}>
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
                                            <tr key={i} className={cn("text-slate-700", template === "modern" && i % 2 === 0 ? "bg-slate-50/50" : "")}>
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
                                <div className="flex justify-end">
                                    <div className="w-52 space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
                                        <div className="flex justify-between text-slate-600"><span>Descuentos:</span><span className="text-red-500">-{fmt(discount)}</span></div>
                                        <div className="flex justify-between text-slate-600"><span>ITBIS 18%:</span><span>{fmt(tax)}</span></div>
                                        <div className="flex justify-between font-black text-base pt-3 border-t-2 border-slate-200" style={{ color: template === "modern" ? primaryColor : "#0f172a" }}>
                                            <span>TOTAL DOP:</span><span>{fmt(total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* ── EMAIL TEMPLATES ─────── */}
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {emailTemplates.map(tpl => (
                                <Card key={tpl.id} className={cn("border-border/60 shadow-sm transition-all", tpl.activa ? "bg-card/50" : "bg-muted/30 opacity-70")}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", tpl.activa ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground")}>
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{tpl.nombre}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{tpl.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch checked={tpl.activa} onCheckedChange={() => toggleActive(tpl.id)} />
                                                <Badge variant="outline" className={cn("text-[9px]", tpl.activa ? "border-emerald-400 text-emerald-600" : "text-muted-foreground")}>
                                                    {tpl.activa ? "Activa" : "Inactiva"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {editingTpl === tpl.id ? (
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">Asunto</Label>
                                                    <Input value={editAsunto} onChange={e => setEditAsunto(e.target.value)} className="text-sm" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">Cuerpo del correo</Label>
                                                    <Textarea value={editCuerpo} onChange={e => setEditCuerpo(e.target.value)} rows={8} className="text-xs font-mono resize-none" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={saveEdit} className="gap-1.5 flex-1"><CheckCircle2 className="w-3.5 h-3.5" /> Guardar</Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingTpl(null)}><X className="w-3.5 h-3.5" /></Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bg-muted/40 rounded-lg px-3 py-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Asunto</p>
                                                    <p className="text-xs font-medium truncate">{tpl.asunto}</p>
                                                </div>
                                                <div className="bg-muted/40 rounded-lg px-3 py-2 max-h-20 overflow-hidden relative">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Vista previa</p>
                                                    <p className="text-xs text-muted-foreground whitespace-pre-line leading-4 line-clamp-3">{tpl.cuerpo.slice(0, 120)}...</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {tpl.variables.slice(0, 4).map(v => (
                                                        <span key={v} className="text-[9px] bg-primary/5 text-primary border border-primary/20 rounded px-1.5 py-0.5 font-mono">{v}</span>
                                                    ))}
                                                    {tpl.variables.length > 4 && <span className="text-[9px] text-muted-foreground">+{tpl.variables.length - 4} más</span>}
                                                </div>
                                                <div className="flex gap-2 pt-1">
                                                    <Button size="sm" variant="outline" className="gap-1.5 flex-1 h-7 text-xs" onClick={() => startEdit(tpl)}>
                                                        <Pencil className="w-3 h-3" /> Editar
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs px-3" onClick={() => copyBody(tpl.cuerpo)}>
                                                        <Copy className="w-3 h-3" /> Copiar
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="gap-1.5 h-7 text-xs px-3" onClick={() => toast.success(`Prueba enviada para plantilla "${tpl.nombre}"`)}>
                                                        <Send className="w-3 h-3" /> Prueba
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
