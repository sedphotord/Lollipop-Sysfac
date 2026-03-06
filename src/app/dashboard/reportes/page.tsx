"use client";

import { companyStorage } from "@/lib/company-storage";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    BarChart3, BookMarked, Calendar, Download, FileBarChart2, FileText,
    Globe, Search, ShoppingCart, Star, TrendingUp, CheckCircle2,
    Building2, AlertTriangle, X, Eye
} from "lucide-react";

// ÔöÇÔöÇÔöÇ Types ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
type Reporte = { id: string; nombre: string; desc: string; icon: any; dgiiCode?: string };

const CATEGORIAS: Record<string, { color: string; icon: any; reportes: Reporte[] }> = {
    ventas: {
        color: "text-blue-600 bg-blue-500/10 border-blue-500/20", icon: TrendingUp,
        reportes: [
            { id: "V1", nombre: "Ventas por Cliente", desc: "Distribuci├│n de ventas por cliente en el per├¡odo.", icon: FileText },
            { id: "V2", nombre: "Ventas por Producto", desc: "An├ílisis de productos m├ís vendidos.", icon: ShoppingCart },
            { id: "V3", nombre: "Ventas por Per├¡odo", desc: "Comparativa mensual/trimestral de ingresos.", icon: Calendar },
            { id: "V4", nombre: "Facturas Pendientes de Cobro", desc: "CxC vencidas y por vencer.", icon: FileBarChart2 },
            { id: "V5", nombre: "Cotizaciones Emitidas", desc: "Tasa de conversi├│n de cotizaciones.", icon: FileText },
            { id: "V6", nombre: "Ventas por Vendedor", desc: "Rendimiento y comisiones por vendedor.", icon: FileText },
            { id: "V7", nombre: "Ventas POS por Turno", desc: "Resumen de ventas generadas en cada turno del POS.", icon: ShoppingCart },
        ],
    },
    administrativos: {
        color: "text-violet-600 bg-violet-500/10 border-violet-500/20", icon: BookMarked,
        reportes: [
            { id: "A1", nombre: "Balance de Comprobaci├│n", desc: "Estado de cuentas contables del per├¡odo.", icon: FileBarChart2 },
            { id: "A2", nombre: "Cuentas por Cobrar", desc: "Detalle de saldos pendientes por cliente.", icon: FileText },
            { id: "A3", nombre: "Cuentas por Pagar", desc: "Detalle de obligaciones con proveedores.", icon: FileText },
            { id: "A4", nombre: "Antig├╝edad de Saldos", desc: "An├ílisis de vencimiento de CxC/CxP.", icon: Calendar },
            { id: "A5", nombre: "Gastos por Categor├¡a", desc: "Clasificaci├│n de egresos por tipo.", icon: BarChart3 },
            { id: "A6", nombre: "Conciliaci├│n Bancaria", desc: "Diferencias entre banco y libros.", icon: FileText },
        ],
    },
    contables: {
        color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20", icon: BookMarked,
        reportes: [
            { id: "C1", nombre: "Estado de Resultados", desc: "Ingresos, costos y utilidades del per├¡odo.", icon: FileBarChart2 },
            { id: "C2", nombre: "Balance General", desc: "Activos, pasivos y patrimonio.", icon: FileText },
            { id: "C3", nombre: "Libro Diario", desc: "Todos los asientos contables del per├¡odo.", icon: BookMarked },
            { id: "C4", nombre: "Libro Mayor", desc: "Movimientos por cuenta contable.", icon: FileText },
            { id: "C5", nombre: "Activos Fijos y Depreciaci├│n", desc: "Bienes del activo y su depreciaci├│n.", icon: FileText },
            { id: "C6", nombre: "Flujo de Efectivo", desc: "Entradas y salidas de caja del per├¡odo.", icon: FileBarChart2 },
        ],
    },
    fiscales: {
        color: "text-rose-600 bg-rose-500/10 border-rose-500/20", icon: FileBarChart2,
        reportes: [
            { id: "T1", nombre: "Formato 606 ÔÇö Compras", desc: "Declaraci├│n mensual de compras y servicios recibidos.", icon: FileText, dgiiCode: "606" },
            { id: "T2", nombre: "Formato 607 ÔÇö Ventas", desc: "Declaraci├│n mensual de ventas de bienes y servicios.", icon: FileText, dgiiCode: "607" },
            { id: "T3", nombre: "Formato 608 ÔÇö Anulados", desc: "NCF anulados del per├¡odo.", icon: FileText, dgiiCode: "608" },
            { id: "T4", nombre: "Formato 609 ÔÇö Exterior", desc: "Pagos a proveedores del exterior.", icon: Globe, dgiiCode: "609" },
            { id: "T5", nombre: "IT-1 ÔÇö ITBIS Mensual", desc: "Declaraci├│n mensual de ITBIS (Formulario IT-1).", icon: FileBarChart2 },
            { id: "T6", nombre: "IR-2 ÔÇö ISR Empresas", desc: "Declaraci├│n anual de renta corporativa.", icon: FileBarChart2 },
            { id: "T7", nombre: "TSS ÔÇö N├│mina Mensual", desc: "Reporte de seguridad social mensual.", icon: FileText },
        ],
    },
    exportar: {
        color: "text-amber-600 bg-amber-500/10 border-amber-500/20", icon: Download,
        reportes: [
            { id: "P1", nombre: "Exportar Facturas (Excel)", desc: "Todas las facturas del per├¡odo en Excel.", icon: Download },
            { id: "P2", nombre: "Exportar Clientes (CSV)", desc: "Base de datos de clientes exportable.", icon: Download },
            { id: "P3", nombre: "Exportar Gastos (Excel)", desc: "Todos los gastos del per├¡odo en Excel.", icon: Download },
            { id: "P4", nombre: "Exportar Facturas POS (CSV)", desc: "Ventas del terminal POS en formato CSV.", icon: Download },
        ],
    },
};

const TAB_LABELS: Record<string, string> = {
    ventas: "Ventas", administrativos: "Administrativos",
    contables: "Contables", fiscales: "Fiscales DGII", exportar: "Exportar",
};
const TAB_KEYS = Object.keys(CATEGORIAS);

// ÔöÇÔöÇÔöÇ DGII Generator ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
type DGIIRow = Record<string, string | number>;

function generate606(expenses: any[], mes: number, anio: number): DGIIRow[] {
    return expenses
        .filter(g => {
            const d = new Date(g.date ?? g.fecha ?? "");
            return !isNaN(d.getTime()) && d.getMonth() === mes && d.getFullYear() === anio;
        })
        .map((g, i) => ({
            "RNC Proveedor": g.rnc ?? g.proveedorRnc ?? "000-00000-0",
            "Tipo ID": "1",
            "Tipo Bienes/SS": g.categoria === "servicios" ? "2" : "1",
            "NCF": g.ncf ?? g.ecf ?? `B01${String(i + 1).padStart(8, "0")}`,
            "Fecha Comprobante": g.date ?? g.fecha ?? "",
            "Fecha Pago": g.fechaPago ?? g.date ?? g.fecha ?? "",
            "Monto Servicios": g.categoria === "servicios" ? (g.total ?? g.amount ?? 0) : 0,
            "Monto Bienes": g.categoria !== "servicios" ? (g.total ?? g.amount ?? 0) : 0,
            "Total Monto Facturado": g.total ?? g.amount ?? 0,
            "ITBIS Facturado": ((g.total ?? g.amount ?? 0) * 0.18).toFixed(2),
            "ITBIS Retenido": "0.00",
            "ITBIS Sujeto Proporcionalidad": "0.00",
            "ITBIS Llevado al Costo": "0.00",
            "ITBIS por Adelantar": ((g.total ?? g.amount ?? 0) * 0.18).toFixed(2),
            "Tipo de Retenci├│n en ISR": "0",
            "Monto Retenci├│n en ISR": "0.00",
        }));
}

function generate607(invoices: any[], mes: number, anio: number): DGIIRow[] {
    return invoices
        .filter(inv => {
            const d = new Date(inv.date ?? "");
            return !isNaN(d.getTime()) && d.getMonth() === mes && d.getFullYear() === anio
                && inv.status !== "draft" && !(inv as any).isDraft;
        })
        .map(inv => {
            const base = inv.total / 1.18;
            const itbis = inv.total - base;
            return {
                "RNC/C├®dula": inv.rnc ?? "000-0000000-0",
                "Tipo ID": "1",
                "NCF": inv.ecf ?? inv.id,
                "NCF Modificado": "",
                "Tipo de Ingreso": "01",
                "Fecha Comprobante": inv.date ?? "",
                "Fecha de Vencimiento": inv.vencimiento ?? "",
                "Monto Facturado": inv.total?.toFixed(2) ?? "0.00",
                "ITBIS Facturado": itbis.toFixed(2),
                "ITBIS Cobrado por Adelantado": "0.00",
                "ITBIS Retenido por Terceros": "0.00",
                "ITBIS Percibido": "0.00",
                "Tipo de Retenci├│n en ISR": "0",
                "Retenci├│n en ISR Cobrado por Adelantado": "0.00",
                "ISR Percibido": "0.00",
                "Otras Tasas Facturadas": "0.00",
                "Monto Propinas Legales": "0.00",
                "Efectivo Generado": inv.paymentMethod === "cash" ? inv.total?.toFixed(2) : "0.00",
                "Cheque/Transferencia/Dep├│sito": inv.paymentMethod === "transfer" ? inv.total?.toFixed(2) : "0.00",
                "Tarjeta de Cr├®dito/D├®bito": inv.paymentMethod === "card" ? inv.total?.toFixed(2) : "0.00",
                "Venta a Cr├®dito": inv.paymentStatus !== "pagada" ? inv.total?.toFixed(2) : "0.00",
                "Bonos o Certificados de Regalo": "0.00",
                "Permuta": "0.00",
                "Otras Formas de Venta": "0.00",
            };
        });
}

function generate608(invoices: any[], mes: number, anio: number): DGIIRow[] {
    return invoices
        .filter(inv => {
            const d = new Date(inv.date ?? "");
            return !isNaN(d.getTime()) && d.getMonth() === mes && d.getFullYear() === anio
                && inv.status === "rejected";
        })
        .map(inv => ({
            "NCF": inv.ecf ?? inv.id,
            "Fecha": inv.date ?? "",
            "Tipo de Anulaci├│n": "1",
        }));
}

function toTXT(rows: DGIIRow[], headers: string[]): string {
    const head = headers.join("|");
    const body = rows.map(r => headers.map(h => r[h] ?? "").join("|")).join("\n");
    return head + "\n" + body;
}

function toCSV(rows: DGIIRow[], headers: string[]): string {
    const head = headers.join(",");
    const body = rows.map(r => headers.map(h => `"${r[h] ?? ""}"`).join(",")).join("\n");
    return head + "\n" + body;
}

function downloadFile(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ÔöÇÔöÇÔöÇ Component ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
export default function ReportesPage() {
    const [search, setSearch] = useState("");
    const [favs, setFavs] = useState<string[]>([]);
    const [selectedReport, setSelectedReport] = useState<Reporte | null>(null);
    const [reportMes, setReportMes] = useState(new Date().getMonth().toString());
    const [reportAnio, setReportAnio] = useState(new Date().getFullYear().toString());
    const [previewRows, setPreviewRows] = useState<DGIIRow[]>([]);
    const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);

    useEffect(() => {
        try { setInvoices(JSON.parse(companyStorage.get("invoice_emitted") || "[]")); } catch { }
        try { setExpenses(JSON.parse(companyStorage.get("gastos") || "[]")); } catch { }
    }, []);

    const toggleFav = (id: string) => setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);

    const handleGenerate = (format: "TXT" | "CSV" | "PREVIEW") => {
        if (!selectedReport) return;
        const mes = parseInt(reportMes);
        const anio = parseInt(reportAnio);
        const mesStr = String(mes + 1).padStart(2, "0");
        let rows: DGIIRow[] = [];
        let headers: string[] = [];

        if (selectedReport.id === "T1") {
            rows = generate606(expenses, mes, anio);
            headers = ["RNC Proveedor", "Tipo ID", "Tipo Bienes/SS", "NCF", "Fecha Comprobante", "Fecha Pago", "Monto Servicios", "Monto Bienes", "Total Monto Facturado", "ITBIS Facturado", "ITBIS Retenido", "ITBIS Sujeto Proporcionalidad", "ITBIS Llevado al Costo", "ITBIS por Adelantar", "Tipo de Retenci├│n en ISR", "Monto Retenci├│n en ISR"];
        } else if (selectedReport.id === "T2") {
            rows = generate607(invoices, mes, anio);
            headers = ["RNC/C├®dula", "Tipo ID", "NCF", "NCF Modificado", "Tipo de Ingreso", "Fecha Comprobante", "Fecha de Vencimiento", "Monto Facturado", "ITBIS Facturado", "ITBIS Cobrado por Adelantado", "ITBIS Retenido por Terceros", "ITBIS Percibido", "Tipo de Retenci├│n en ISR", "Retenci├│n en ISR Cobrado por Adelantado", "ISR Percibido", "Otras Tasas Facturadas", "Monto Propinas Legales", "Efectivo Generado", "Cheque/Transferencia/Dep├│sito", "Tarjeta de Cr├®dito/D├®bito", "Venta a Cr├®dito", "Bonos o Certificados de Regalo", "Permuta", "Otras Formas de Venta"];
        } else if (selectedReport.id === "T3") {
            rows = generate608(invoices, mes, anio);
            headers = ["NCF", "Fecha", "Tipo de Anulaci├│n"];
        } else {
            // Generic export for other reports
            rows = [{ "Per├¡odo": `${mesStr}/${anio}`, "Tipo": selectedReport.nombre, "Estado": "No hay datos reales ÔÇö integra tu contabilidad" }];
            headers = ["Per├¡odo", "Tipo", "Estado"];
        }

        if (format === "PREVIEW") {
            setPreviewRows(rows); setPreviewHeaders(headers); setShowPreview(true); return;
        }

        if (rows.length === 0) {
            toast.warning(`Sin datos para ${mesStr}/${anio}`, { description: "No hay registros en ese per├¡odo." }); return;
        }

        const filename = `${selectedReport.dgiiCode ?? selectedReport.id}_${anio}${mesStr}`;
        if (format === "TXT") {
            downloadFile(toTXT(rows, headers), `${filename}.txt`, "text/plain;charset=utf-8");
            toast.success(`${selectedReport.nombre} generado`, { description: `${rows.length} registros exportados como TXT.` });
        } else {
            downloadFile(toCSV(rows, headers), `${filename}.csv`, "text/csv;charset=utf-8");
            toast.success(`${selectedReport.nombre} generado`, { description: `${rows.length} registros exportados como CSV.` });
        }
        setSelectedReport(null);
    };

    const isDGII = (id: string) => ["T1", "T2", "T3", "T4", "T5", "T6", "T7"].includes(id);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Reportes contables, administrativos y fiscales DGII.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar reporte..." className="pl-9 bg-muted/50" />
                </div>
            </div>

            {/* Category summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {TAB_KEYS.map(key => {
                    const cat = CATEGORIAS[key];
                    return (
                        <Card key={key} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <CardContent className="p-4 text-center">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 border", cat.color)}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold">{TAB_LABELS[key]}</p>
                                <p className="text-xl font-black tabular-nums mt-1">{cat.reportes.length}</p>
                                <p className="text-[10px] text-muted-foreground">reportes</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* DGII quick-access banner */}
            <Card className="bg-rose-500/5 border-rose-500/20 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-rose-700">Formatos DGII disponibles</p>
                        <p className="text-xs text-muted-foreground">Genera los archivos TXT oficiales 606, 607, 608 y 609 desde la pesta├▒a <strong>Fiscales DGII</strong> con tus datos reales.</p>
                    </div>
                    <Badge className="bg-rose-500 text-white shrink-0 hidden sm:flex">IT-1 ┬À IR-2 ┬À TSS</Badge>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="ventas">
                <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
                    {TAB_KEYS.map(key => (
                        <TabsTrigger key={key} value={key} className="text-xs">
                            {TAB_LABELS[key]}
                            <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1">{CATEGORIAS[key].reportes.length}</Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {TAB_KEYS.map(key => (
                    <TabsContent key={key} value={key} className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {CATEGORIAS[key].reportes
                                .filter(r => !search || r.nombre.toLowerCase().includes(search.toLowerCase()))
                                .map(rpt => (
                                    <Card key={rpt.id} className="bg-card/50 border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                                        <CardContent className="p-4 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", CATEGORIAS[key].color)}>
                                                    <rpt.icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {rpt.dgiiCode && (
                                                        <Badge className="text-[9px] bg-rose-100 text-rose-700 border-rose-300 border h-4 px-1">{rpt.dgiiCode}</Badge>
                                                    )}
                                                    <button
                                                        onClick={e => { e.stopPropagation(); toggleFav(rpt.id); }}
                                                        className={cn("transition-colors", favs.includes(rpt.id) ? "text-amber-500" : "text-muted-foreground/30 group-hover:text-muted-foreground")}
                                                    >
                                                        <Star className={cn("w-4 h-4", favs.includes(rpt.id) && "fill-amber-500")} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{rpt.nombre}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{rpt.desc}</p>
                                            <Button
                                                size="sm" variant="outline"
                                                onClick={() => setSelectedReport(rpt)}
                                                className="w-full h-7 text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all mt-auto"
                                            >
                                                <Download className="w-3 h-3 mr-1.5" />
                                                {isDGII(rpt.id) ? "Generar DGII" : "Generar"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* ÔöÇÔöÇÔöÇ Reporte Dialog ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
            <Dialog open={!!selectedReport && !showPreview} onOpenChange={open => !open && setSelectedReport(null)}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileBarChart2 className="w-5 h-5 text-primary" />
                            {selectedReport?.nombre}
                            {selectedReport?.dgiiCode && (
                                <Badge className="bg-rose-100 text-rose-700 border-rose-300 border ml-1">Formato {selectedReport.dgiiCode}</Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>{selectedReport?.desc}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Mes</label>
                                <Select value={reportMes} onValueChange={setReportMes}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => (
                                            <SelectItem key={i} value={i.toString()}>{String(i + 1).padStart(2, "0")} - {m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">A├▒o</label>
                                <Select value={reportAnio} onValueChange={setReportAnio}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["2026", "2025", "2024", "2023"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isDGII(selectedReport?.id ?? "") && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                <p className="text-xs text-primary font-medium flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>El archivo se genera en <strong>UTF-8</strong> con el formato oficial DGII. Para el 606/607 se leen tus gastos y facturas reales del per├¡odo seleccionado.</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => handleGenerate("PREVIEW")} className="sm:w-auto w-full">
                            <Eye className="w-4 h-4 mr-2" /> Previsualizar
                        </Button>
                        <Button variant="outline" onClick={() => handleGenerate("CSV")} className="sm:w-auto w-full">
                            <Download className="w-4 h-4 mr-2" /> Exportar CSV
                        </Button>
                        <Button onClick={() => handleGenerate("TXT")} className="sm:w-auto w-full bg-rose-600 hover:bg-rose-700 text-white">
                            <FileText className="w-4 h-4 mr-2" /> Descargar TXT Oficial
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ÔöÇÔöÇÔöÇ Preview Dialog ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */}
            <Dialog open={showPreview} onOpenChange={open => !open && setShowPreview(false)}>
                <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" /> Previsualizaci├│n ÔÇö {selectedReport?.nombre}
                            <Badge variant="secondary">{previewRows.length} registros</Badge>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto border rounded-lg">
                        {previewRows.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                                <p className="font-semibold">Sin datos para este per├¡odo</p>
                                <p className="text-xs mt-1">No hay registros en {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][parseInt(reportMes)]} {reportAnio}.</p>
                            </div>
                        ) : (
                            <table className="text-xs w-full">
                                <thead className="sticky top-0 bg-muted/90 backdrop-blur">
                                    <tr>
                                        {previewHeaders.map(h => (
                                            <th key={h} className="px-3 py-2 text-left font-bold border-b border-border/60 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {previewRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/20">
                                            {previewHeaders.map(h => (
                                                <td key={h} className="px-3 py-1.5 whitespace-nowrap font-mono">{row[h] ?? ""}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setShowPreview(false)}>Cerrar</Button>
                        <Button variant="outline" onClick={() => { setShowPreview(false); handleGenerate("CSV"); }}>
                            <Download className="w-4 h-4 mr-2" /> CSV
                        </Button>
                        <Button onClick={() => { setShowPreview(false); handleGenerate("TXT"); }} className="bg-rose-600 hover:bg-rose-700 text-white">
                            <FileText className="w-4 h-4 mr-2" /> Descargar TXT
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}