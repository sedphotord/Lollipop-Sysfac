"use client";

import { companyStorage } from "@/lib/company-storage";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowDownTrayIcon, PrinterIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy-load all invoice templates
const TEMPLATES: Record<string, React.ComponentType<any>> = {
    InvoiceStandard: dynamic(() => import("@/components/templates/InvoiceStandard").then(m => m.InvoiceStandard), { ssr: false }),
    InvoiceModern: dynamic(() => import("@/components/templates/InvoiceModern").then(m => m.InvoiceModern), { ssr: false }),
    InvoiceCorporate: dynamic(() => import("@/components/templates/InvoiceCorporate").then(m => m.InvoiceCorporate), { ssr: false }),
    InvoiceElegant: dynamic(() => import("@/components/templates/InvoiceElegant").then(m => m.InvoiceElegant), { ssr: false }),
    InvoiceMinimal: dynamic(() => import("@/components/templates/InvoiceMinimal").then(m => m.InvoiceMinimal), { ssr: false }),
    QuoteStandard: dynamic(() => import("@/components/templates/QuoteStandard").then(m => m.QuoteStandard), { ssr: false }),
    QuoteDetailed: dynamic(() => import("@/components/templates/QuoteDetailed").then(m => m.QuoteDetailed), { ssr: false }),
};

function InvoicePreviewContent() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [companySettings, setCompanySettings] = useState<any>({});

    useEffect(() => {
        // Read preview data stored by the editor
        try {
            const raw = sessionStorage.getItem("invoice_preview_data");
            if (raw) setData(JSON.parse(raw));
        } catch { }

        // Read company info
        try {
            const logo = companyStorage.get("lollipop_company_logo") || companyStorage.get("sysfac_company_logo");
            if (logo) setCompanyLogo(logo);
            const raw = companyStorage.get("lollipop_company_settings");
            if (raw) setCompanySettings(JSON.parse(raw));
        } catch { }
    }, []);

    const handlePrint = () => window.print();

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">No hay datos de vista previa.</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver al editor
                    </Button>
                </div>
            </div>
        );
    }

    // Map editor data to template props format
    const templateId =
        data.template ||
        sessionStorage.getItem("invoice_selected_template") ||
        "InvoiceStandard";
    const TemplateComponent = TEMPLATES[templateId] || TEMPLATES["InvoiceStandard"];

    const TIPO_NAMES: Record<string, string> = {
        B01: "Crédito Fiscal", B02: "Consumo", B14: "Gubernamental", B15: "Exportación",
        E31: "Crédito Fiscal (e-CF)", E32: "Consumidor Final (e-CF)", E44: "Gubernamental (e-CF)", E45: "Exportación (e-CF)",
    };

    const templateProps = {
        company: {
            name: companySettings.name || "Mi Empresa SRL",
            rnc: companySettings.rnc || "130-12345-6",
            address: companySettings.address || "",
            phone: companySettings.phone || "",
            email: companySettings.email || "",
            logo: companyLogo || undefined,
        },
        client: data.client || { name: "Consumidor Final", rnc: "", address: "", phone: "", email: "" },
        document: {
            type: TIPO_NAMES[data.tipo] || data.tipo || "Consumo",
            number: data.ncf || "",
            date: data.date || new Date().toLocaleDateString("es-DO"),
            dueDate: data.dueDate || "—",
            terms: data.paymentTerms || "",
            seller: data.vendedor || "",
            notes: data.notes || "",
            footer: data.footer || "",
            currency: data.moneda || "DOP",
            mode: data.invoiceMode || "tradicional",
        },
        items: data.items || [],
        totals: data.totals || { subtotal: 0, discount: 0, tax: 0, total: 0 },
        color: { primary: companyStorage.get("lollipop_theme_color") || "#3b82f6" },
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* ── Top Toolbar ── */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm print:hidden">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-base font-bold text-foreground">Vista previa</h1>
                        <p className="text-xs text-muted-foreground">{templateId} · {data.ncf || "Sin NCF"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 text-sm" onClick={handlePrint}>
                        <PrinterIcon className="w-4 h-4" /> Imprimir / PDF
                    </Button>
                    <Button variant="outline" className="gap-2 text-sm" disabled title="Próximamente">
                        <EnvelopeIcon className="w-4 h-4" /> Enviar por correo
                    </Button>
                </div>
            </div>

            {/* ── Invoice Preview Area ── */}
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div
                    id="invoice-print-area"
                    className="bg-white shadow-xl rounded-xl overflow-hidden border border-border/30 print:shadow-none print:rounded-none print:border-0"
                    style={{ minHeight: "29.7cm" }}
                >
                    <React.Suspense
                        fallback={
                            <div className="flex items-center justify-center h-96 text-muted-foreground">
                                <div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                                Cargando plantilla...
                            </div>
                        }
                    >
                        <TemplateComponent data={templateProps} />
                    </React.Suspense>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #invoice-print-area, #invoice-print-area * { visibility: visible !important; }
                    #invoice-print-area {
                        position: fixed !important;
                        left: 0 !important; top: 0 !important;
                        width: 100% !important;
                        z-index: 999999 !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default function InvoicePreviewPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando vista previa...</div>}>
            <InvoicePreviewContent />
        </Suspense>
    );
}