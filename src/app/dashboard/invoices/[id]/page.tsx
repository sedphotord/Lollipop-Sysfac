"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, ZoomIn, ZoomOut, Edit, Edit3 } from "lucide-react";
import Link from "next/link";
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
            const drafts = JSON.parse(localStorage.getItem('invoice_drafts') || '[]');
            invoice = drafts.find((d: any) => d.id === routeId);
            if (!invoice) {
                const legacyDraft = JSON.parse(localStorage.getItem('invoice_draft') || '{}');
                if (legacyDraft.id === routeId) invoice = legacyDraft;
            }
        } else {
            const emitted = JSON.parse(localStorage.getItem('invoice_emitted') || '[]');
            invoice = emitted.find((i: any) => i.id === routeId);
        }

        if (invoice) {
            setPreviewData(invoice);
            if (invoice.plantilla && TEMPLATES[invoice.plantilla]) {
                setTemplateId(invoice.plantilla);
            } else {
                const ssTpl = sessionStorage.getItem('invoice_selected_template');
                if (ssTpl && TEMPLATES[ssTpl]) { setTemplateId(ssTpl); }
                else {
                    const saved = localStorage.getItem('lollipop_invoice_template_id');
                    if (saved && TEMPLATES[saved]) setTemplateId(saved);
                }
            }
        }

        const savedColor = localStorage.getItem('lollipop_theme_color');
        if (savedColor) setGlobalColor(savedColor);

        // Logo
        const savedLogo = localStorage.getItem('lollipop_company_logo') || localStorage.getItem('sysfac_company_logo');
        if (savedLogo) setGlobalLogo(savedLogo);

        // Company settings
        const coRaw = localStorage.getItem('lollipop_company_settings');
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

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />
            <div className="min-h-screen bg-muted/30 flex flex-col">
                {/* Toolbar */}
                <div className="bg-background border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm print:hidden">
                    <Link href="/dashboard/invoices">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                            <ArrowLeft className="w-4.5 h-4.5" />
                        </button>
                    </Link>
                    <span className="font-bold text-foreground">Visor de Comprobante</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted/40 rounded-full border">
                        {routeId}
                    </span>

                    <div className="flex-1" />

                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30 mr-2">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono w-10 text-center text-muted-foreground">{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-1 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Imprimir
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                        <Download className="w-4 h-4" /> PDF
                    </Button>
                    <Link href={`/dashboard/invoices/${routeId}/edit`}>
                        <Button size="sm" className="bg-primary text-white gap-2 shadow-sm">
                            <Edit3 className="w-4 h-4" /> Editar
                        </Button>
                    </Link>
                </div>

                {/* Preview area */}
                <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 overflow-auto">
                    {!fullData ? (
                        <div className="flex flex-col items-center gap-4 mt-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                                <Printer className="w-8 h-8 text-primary/40" />
                            </div>
                            <h2 className="text-lg font-bold text-muted-foreground">Cargando comprobante...</h2>
                        </div>
                    ) : (
                        <div
                            id="preview-template-area"
                            className="w-full max-w-[860px] transition-all duration-300"
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                                marginBottom: `${(zoom / 100 - 1) * -100}%`,
                                '--template-primary': globalColor
                            } as React.CSSProperties}
                        >
                            <ActiveTemplate data={fullData} />
                        </div>
                    )}
                </div>
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
