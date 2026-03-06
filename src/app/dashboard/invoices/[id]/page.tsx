"use client";

import { companyStorage } from "@/lib/company-storage";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Printer, Download, ZoomIn, ZoomOut, Edit, Edit3,
    CheckCircle2, AlertCircle, DollarSign, History as HistoryIcon, Plus,
    Share2, ChevronDown, MessageSquare, Paperclip, Check, FileDown, Info
} from "lucide-react";
import { MOCK_INVOICES } from "@/lib/mock-invoices";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { InvoiceStandard } from "@/components/templates/InvoiceStandard";
import { InvoiceCorporate } from "@/components/templates/InvoiceCorporate";
import { InvoiceMinimal } from "@/components/templates/InvoiceMinimal";
import { InvoiceModern } from "@/components/templates/InvoiceModern";
import { InvoiceElegant } from "@/components/templates/InvoiceElegant";
import { QuoteStandard } from "@/components/templates/QuoteStandard";
import { QuoteDetailed } from "@/components/templates/QuoteDetailed";
import { PaymentReceipt } from "@/components/templates/PaymentReceipt";
import { TicketPOS } from "@/components/templates/TicketPOS";
import { DeliveryNote } from "@/components/templates/DeliveryNote";
import { AccountStatement } from "@/components/templates/AccountStatement";

const TEMPLATES: Record<string, React.ComponentType<{ data: any }>> = {
    'InvoiceStandard': InvoiceStandard as any,
    'InvoiceCorporate': InvoiceCorporate as any,
    'InvoiceMinimal': InvoiceMinimal as any,
    'InvoiceModern': InvoiceModern as any,
    'InvoiceElegant': InvoiceElegant as any,
    'QuoteStandard': QuoteStandard as any,
    'QuoteDetailed': QuoteDetailed as any,
    'PaymentReceipt': PaymentReceipt as any,
    'TicketPOS': TicketPOS as any,
    'DeliveryNote': DeliveryNote as any,
    'AccountStatement': AccountStatement as any,
    // legacy
    'inv-standard': InvoiceStandard as any,
    'inv-corporate': InvoiceCorporate as any,
    'inv-minimal': InvoiceMinimal as any,
    'inv-modern': InvoiceModern as any,
    'inv-elegant': InvoiceElegant as any,
};

const TEMPLATE_LABELS: Record<string, string> = {
    'InvoiceStandard': 'Factura Estándar',
    'InvoiceCorporate': 'Factura Corporativa',
    'InvoiceMinimal': 'Factura Minimalista',
    'InvoiceModern': 'Factura Moderna',
    'InvoiceElegant': 'Factura Elegante',
    'QuoteStandard': 'Cotización Estándar',
    'QuoteDetailed': 'Cotización Detallada',
    'PaymentReceipt': 'Recibo de Pago',
    'TicketPOS': 'Ticket POS',
    'DeliveryNote': 'Conduce / Remisión',
    'AccountStatement': 'Estado de Cuenta',
};

const PRINT_STYLE = `
@page { size: letter; margin: 0; }
@media print {
    body * { visibility: hidden !important; }
    #preview-template-area, #preview-template-area * { visibility: visible !important; }
    #preview-template-area { position: fixed; inset: 0; width: 100%; z-index: 99999; transform: none !important; margin: 0 !important; }
}
`;

function InvoiceViewContent({ routeId }: { routeId: string }) {
    const [previewData, setPreviewData] = useState<any>(null);
    const [templateId, setTemplateId] = useState('InvoiceStandard');
    const [globalColor, setGlobalColor] = useState('#2346e8');
    const [globalLogo, setGlobalLogo] = useState<string | null>(null);
    const [zoom, setZoom] = useState(90);
    const [company, setCompany] = useState({
        name: 'Mi Empresa SRL',
        rnc: '130-12345-6',
        address: '',
        email: '',
        phone: '',
        web: ''
    });

    useEffect(() => {
        let invoice = null;

        if (routeId.startsWith("DRAFT-")) {
            const drafts = JSON.parse(companyStorage.get('invoice_drafts') || '[]');
            invoice = drafts.find((d: any) => d.id === routeId);
            if (!invoice) {
                const legacyDraft = JSON.parse(companyStorage.get('invoice_draft') || '{}');
                if (legacyDraft.id === routeId) invoice = legacyDraft;
            }
        } else {
            const emitted = JSON.parse(companyStorage.get('invoice_emitted') || '[]');
            invoice = emitted.find((i: any) => i.id === routeId) || MOCK_INVOICES.find((i: any) => i.id === routeId);
        }

        if (invoice) {
            setPreviewData(invoice);
            if (invoice.plantilla && TEMPLATES[invoice.plantilla]) {
                setTemplateId(invoice.plantilla);
            } else {
                const ssTpl = sessionStorage.getItem('invoice_selected_template');
                if (ssTpl && TEMPLATES[ssTpl]) { setTemplateId(ssTpl); }
                else {
                    const saved = companyStorage.get('lollipop_invoice_template_id');
                    if (saved && TEMPLATES[saved]) setTemplateId(saved);
                }
            }
        }

        const savedColor = companyStorage.get('lollipop_theme_color');
        if (savedColor) setGlobalColor(savedColor);

        // Logo
        const savedLogo = companyStorage.get('lollipop_company_logo') || companyStorage.get('sysfac_company_logo');
        if (savedLogo) setGlobalLogo(savedLogo);

        // Company settings
        const coRaw = companyStorage.get('lollipop_company_settings');
        if (coRaw) {
            try {
                const co = JSON.parse(coRaw);
                setCompany(prev => ({
                    ...prev,
                    name: co.name || prev.name,
                    rnc: co.rnc || prev.rnc,
                    address: co.address || prev.address,
                    email: co.email || prev.email,
                    phone: co.phone || prev.phone,
                    web: co.web || '',
                }));
            } catch { }
        }
    }, [routeId]);

    const ActiveTemplate = TEMPLATES[templateId] || InvoiceStandard;

    const fullData = previewData ? {
        color: { primary: globalColor },
        company: {
            name: company.name,
            rnc: company.rnc,
            logo: globalLogo,
            address: company.address,
            email: company.email,
            phone: company.phone,
        },
        client: {
            name: previewData.cliente || previewData.client?.name || "—",
            rnc: previewData.rnc || previewData.client?.rnc || "",
            address: previewData.client?.address || "",
            phone: previewData.client?.phone || "",
            email: previewData.client?.email || "",
        },
        document: {
            type: previewData.tipoName || previewData.tipo || "Crédito Fiscal",
            number: previewData.ecf || previewData.ncf || "",
            date: previewData.date || "",
            dueDate: previewData.vencimiento || previewData.dueDate || "",
            ncf: previewData.ecf || previewData.ncf || "",
            terms: previewData.paymentTerms || "Vencimiento manual",
            seller: previewData.vendedor || "—",
            notes: previewData.notes || "",
            footer: previewData.footer || "",
        },
        items: previewData.items?.map((i: any) => ({
            id: i.id,
            description: i.name || i.description || "—",
            qty: i.qty || 1,
            price: i.price || 0,
            discount: i.price * i.qty * ((i.disc || 0) / 100),
            tax: i.price * i.qty * (1 - (i.disc || 0) / 100) * ((i.itbis || 18) / 100),
            total: i.price * i.qty * (1 - (i.disc || 0) / 100)
        })) || [],
        totals: previewData.totals || { subtotal: 0, discount: 0, tax: 0, total: previewData.total || 0 }
    } : null;

    const isPaid = previewData?.paymentStatus === 'pagada';
    const isOverdue = !isPaid && previewData?.vencimiento && new Date(previewData.vencimiento) < new Date();

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />
            <div className="min-h-screen bg-muted/30 flex flex-col">
                {/* Header Actions */}
                <div className="bg-background !bg-[#f9fafb] px-6 py-6 flex flex-col gap-5 w-full print:hidden">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Link href="/dashboard/invoices">
                            <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </Link>
                        Factura de venta {(previewData?.tipo === 'B01' || previewData?.tipo === 'B02' || previewData?.tipo === 'B14' || previewData?.tipo === 'B15') ? 'NCF' : 'e-CF'} {previewData?.ecf || previewData?.ncf || ''}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link href={`/dashboard/invoices/${routeId}/edit`}>
                            <Button variant="outline" className="gap-2 shadow-sm font-medium bg-white">
                                <Edit3 className="w-4 h-4 text-slate-500" /> Editar
                            </Button>
                        </Link>
                        <Button variant="outline" className="gap-2 shadow-sm font-medium bg-white" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 text-slate-500" /> Imprimir
                        </Button>
                        <Button variant="outline" className="gap-2 shadow-sm font-medium bg-white" onClick={() => window.print()}>
                            <Download className="w-4 h-4 text-slate-500" /> Descargar PDF
                        </Button>
                        <Button variant="outline" className="gap-2 shadow-sm font-medium bg-white">
                            <Share2 className="w-4 h-4 text-slate-500" /> Compartir
                        </Button>
                        {!isPaid && (
                            <Link href={`/dashboard/ingresos/pagos/new?invoiceId=${routeId}`}>
                                <Button variant="outline" className="gap-2 shadow-sm font-semibold bg-white">
                                    <Plus className="w-4 h-4 text-slate-500" /> Agregar pago
                                </Button>
                            </Link>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 shadow-sm font-medium bg-white ml-auto">
                                    Más acciones <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 text-sm font-medium text-slate-700">
                                <DropdownMenuItem className="cursor-pointer py-2">Clonar</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Volver recurrente</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Editar retenciones</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Ver versiones</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Anular</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Cerrar sin pago</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2 text-muted-foreground" disabled>Aplicar anticipos</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Aplicar nota de crédito</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2 border-t mt-1">Imprimir como copia</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Descargar como copia</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Enviar como copia</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2 border-t mt-1">Adjuntar archivos</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">Convertir a borrador</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Summary Cards */}
                    {fullData && (
                        <div className="bg-white border rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x mt-2">
                            <div className="flex flex-col p-5 text-left">
                                <span className="text-sm font-medium text-slate-500 mb-2">Valor total</span>
                                <span className="text-2xl font-bold text-slate-700">RD$ {fullData.totals.total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex flex-col p-5 text-left">
                                <span className="text-sm font-medium text-slate-500 mb-2">Retenido</span>
                                <span className="text-2xl font-bold text-[#eb6146]">RD$ 0.00</span>
                            </div>
                            <div className="flex flex-col p-5 text-left">
                                <span className="text-sm font-medium text-slate-500 mb-2">Cobrado</span>
                                <span className="text-2xl font-bold text-emerald-500">RD$ {isPaid ? fullData.totals.total.toLocaleString("es-DO", { minimumFractionDigits: 2 }) : "0.00"}</span>
                            </div>
                            <div className="flex flex-col p-5 text-left">
                                <span className="text-sm font-medium text-slate-500 mb-2">Por cobrar</span>
                                <span className="text-2xl font-bold text-[#eb6146]">RD$ {isPaid ? "0.00" : fullData.totals.total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview area with Ribbon */}
                <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 overflow-auto relative">
                    {!fullData ? (
                        <div className="flex flex-col items-center gap-4 mt-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                                <Printer className="w-8 h-8 text-primary/40" />
                            </div>
                            <h2 className="text-lg font-bold text-muted-foreground">Cargando comprobante...</h2>
                        </div>
                    ) : (
                        <div className="w-full max-w-[860px] relative">
                            {/* Alegra Ribbon */}
                            <div className={cn(
                                "absolute -left-4 top-10 z-20 px-4 py-2 shadow-lg transform -rotate-2 font-black text-sm tracking-tighter rounded-r-lg border-l-4",
                                isPaid
                                    ? "bg-emerald-500 text-white border-emerald-700"
                                    : isOverdue
                                        ? "bg-red-500 text-white border-red-700"
                                        : "bg-amber-400 text-amber-900 border-amber-600"
                            )}>
                                {isPaid ? "COBRADA" : isOverdue ? "VENCIDA" : "POR COBRAR"}
                            </div>

                            <div
                                id="preview-template-area"
                                className="w-full transition-all duration-300 bg-white shadow-2xl rounded-xl overflow-hidden"
                                style={{
                                    transform: `scale(${zoom / 100})`,
                                    transformOrigin: 'top center',
                                    marginBottom: `${(zoom / 100 - 1) * -100}%`,
                                    '--template-primary': globalColor
                                } as React.CSSProperties}
                            >
                                <ActiveTemplate data={fullData} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Sections: Tabs & Metadata */}
                <div className="bg-white flex flex-col md:flex-row items-stretch border-t print:hidden py-10 px-6 gap-8 pb-32">
                    <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                        {/* Tabs */}
                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
                            <Tabs defaultValue="pagos" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
                                    <TabsTrigger value="pagos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold text-slate-600">
                                        Pagos recibidos
                                    </TabsTrigger>
                                    <TabsTrigger value="contabilidad" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold text-slate-600">
                                        Contabilidad
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="pagos" className="p-12 pl-12 flex items-center justify-center m-0 min-h-[220px]">
                                    {isPaid ? (
                                        <div className="w-full space-y-4">
                                            <div className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50 border-emerald-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-800">Pago Completo Registrado</p>
                                                        <p className="text-xs text-slate-500">Recibo #0001 - Contado</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-emerald-600">RD$ {fullData?.totals.total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border text-slate-300">
                                                <FileDown className="w-8 h-8 opacity-50" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-sm font-medium text-slate-500">Tu venta aún no tiene pagos recibidos</p>
                                                <Link href={`/dashboard/ingresos/pagos/new?invoiceId=${routeId}`}>
                                                    <Button variant="outline" size="sm" className="gap-2 font-medium">
                                                        <Plus className="w-4 h-4" /> Agregar pago
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="contabilidad" className="p-8 m-0 text-center text-muted-foreground text-sm">
                                    Aquí podrás ver el asiento contable asociado a esta venta.
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right side Info */}
                        <div className="space-y-6">
                            <div className="bg-white border rounded-xl overflow-hidden shadow-sm p-5">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Información Adicional</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Lista de precios</span>
                                        <span className="font-medium text-slate-700">{previewData?.listaPrecios || 'General'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Almacén</span>
                                        <span className="font-medium text-slate-700">{previewData?.almacen || 'Principal'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Vendedor</span>
                                        <span className="font-medium text-slate-700">{previewData?.vendedor || '—'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center gap-2 border-dashed relative group cursor-pointer hover:bg-slate-50 transition-colors">
                                <Paperclip className="w-8 h-8 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                <div>
                                    <p className="font-medium text-sm text-slate-600">Adjuntar archivos</p>
                                    <p className="text-xs text-slate-400">Tamaño máximo 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Comments */}
                <div className="w-full max-w-4xl mx-auto px-6 pb-20 print:hidden relative z-10 -mt-20">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <h2 className="font-bold text-lg text-slate-800">Comentarios</h2>
                    </div>
                    <div className="bg-white border rounded-xl shadow-sm p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 shrink-0 border border-indigo-600/20" />
                            <div className="flex-1 w-full relative">
                                <Textarea
                                    className="min-h-[100px] resize-none w-full border rounded-lg focus-visible:ring-emerald-500 p-4 text-sm bg-transparent"
                                    placeholder="Escribe un comentario"
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono">0/280</span>
                                    <Button size="sm" variant="secondary" className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold cursor-not-allowed opacity-50">Comentar</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Register payment footer (Alegra style) */}
                {fullData && !isPaid && (
                    <div className="bg-white border-t p-6 flex items-center justify-center gap-6 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Esta factura tiene un saldo de RD$ {fullData.totals.total.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Registra un pago para saldar el balance pendiente.</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <Link href={`/dashboard/ingresos/pagos/new?invoiceId=${routeId}`}>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 font-black shadow-lg shadow-emerald-500/20">
                                <DollarSign className="w-4 h-4" /> REGISTRAR PAGO AHORA
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: routeId } = React.use(params);
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando visor...</div>}>
            <InvoiceViewContent routeId={routeId} />
        </Suspense>
    );
}