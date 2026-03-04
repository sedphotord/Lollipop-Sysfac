"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, ZoomIn, ZoomOut } from "lucide-react";
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
    #preview-template-area { position: fixed; inset: 0; width: 100%; z-index: 99999; transform: none !important; }
}
`;

export default function InvoicePreviewPage() {
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
        const raw = sessionStorage.getItem('invoice_preview_data');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                setPreviewData(data);
                // Read template from preview data first
                if (data.template && TEMPLATES[data.template]) {
                    setTemplateId(data.template);
                } else {
                    // fallback: sessionStorage selected template (persisted on change)
                    const ssTpl = sessionStorage.getItem('invoice_selected_template');
                    if (ssTpl && TEMPLATES[ssTpl]) { setTemplateId(ssTpl); }
                    else {
                        const saved = localStorage.getItem('lollipop_invoice_template_id');
                        if (saved && TEMPLATES[saved]) setTemplateId(saved);
                    }
                }
            } catch (_) { }
        } else {
            const ssTpl = sessionStorage.getItem('invoice_selected_template');
            if (ssTpl && TEMPLATES[ssTpl]) setTemplateId(ssTpl);
            else {
                const saved = localStorage.getItem('lollipop_invoice_template_id');
                if (saved && TEMPLATES[saved]) setTemplateId(saved);
            }
        }
        const savedColor = localStorage.getItem('lollipop_theme_color');
        if (savedColor) setGlobalColor(savedColor);

        // Logo — try both possible keys
        const savedLogo = localStorage.getItem('lollipop_company_logo') || localStorage.getItem('sysfac_company_logo');
        if (savedLogo) setGlobalLogo(savedLogo);

        // Company settings — merge with good defaults
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
    }, []);

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
        client: previewData.client || { name: "—", rnc: "", address: "", phone: "", email: "" },
        document: {
            type: previewData.tipo || "Crédito Fiscal",
            number: previewData.ncf || (previewData.tipo === 'B01' ? 'B0100000001'
                : previewData.tipo === 'B02' ? 'B0200000001'
                    : previewData.tipo === 'B14' ? 'B1400000001'
                        : previewData.tipo === 'B15' ? 'B1500000001'
                            : 'B0100000001'),
            date: previewData.date || "",
            dueDate: previewData.dueDate || "",
            ncf: previewData.ncf || (previewData.tipo === 'B01' ? 'B0100000001'
                : previewData.tipo === 'B02' ? 'B0200000001'
                    : previewData.tipo === 'B14' ? 'B1400000001'
                        : previewData.tipo === 'B15' ? 'B1500000001'
                            : 'B0100000001'),
            terms: previewData.paymentTerms || "Vencimiento manual",
            seller: previewData.vendedor || "—",
            notes: previewData.notes || "",
            footer: previewData.footer || "",
        },
        items: previewData.items || [],
        totals: previewData.totals || { subtotal: 0, discount: 0, tax: 0, total: 0 }
    } : null;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />
            <div className="min-h-screen bg-muted/30 flex flex-col">
                {/* Toolbar */}
                <div className="bg-background border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm print:hidden">
                    <Link href="/dashboard/invoices/new">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                            <ArrowLeft className="w-4.5 h-4.5" />
                        </button>
                    </Link>
                    <span className="font-bold text-foreground">Vista Previa</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted/40 rounded-full border">
                        {TEMPLATE_LABELS[templateId] || templateId}
                    </span>

                    <div className="flex-1" />

                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono w-10 text-center text-muted-foreground">{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-1 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Imprimir / PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                        <Download className="w-4 h-4" /> Descargar PDF
                    </Button>
                    <Link href="/dashboard/invoices/new">
                        <Button size="sm" className="bg-gradient-brand border-0 text-white gap-2 shadow-sm">
                            Volver a editar
                        </Button>
                    </Link>
                </div>

                {/* Preview area */}
                <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 overflow-auto">
                    {!fullData ? (
                        <div className="flex flex-col items-center gap-4 mt-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Printer className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-foreground">Sin datos de factura</h2>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Crea una factura primero y haz clic en &quot;Vista previa&quot; para ver cómo quedará impresa.
                            </p>
                            <Link href="/dashboard/invoices/new">
                                <Button className="bg-gradient-brand border-0 text-white mt-2">
                                    Crear Nueva Factura
                                </Button>
                            </Link>
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
