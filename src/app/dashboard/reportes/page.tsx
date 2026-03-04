"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3, BookMarked, Calendar, Download, FileBarChart2, FileText,
    Globe, Search, ShoppingCart, Star, TrendingUp, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Reporte = { id: string; nombre: string; desc: string; icon: any; fav?: boolean };

// ... (Categorías definidas previamente)
const CATEGORIAS: Record<string, { color: string; icon: any; reportes: Reporte[] }> = {
    ventas: {
        color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        icon: TrendingUp,
        reportes: [
            { id: "V1", nombre: "Ventas por Cliente", desc: "Distribución de ventas por cliente en el período.", icon: FileText },
            { id: "V2", nombre: "Ventas por Producto", desc: "Análisis de productos más vendidos.", icon: ShoppingCart },
            { id: "V3", nombre: "Ventas por Período", desc: "Comparativa mensual/trimestral de ingresos.", icon: Calendar },
            { id: "V4", nombre: "Facturas Pendientes", desc: "CxC vencidas y por vencer.", icon: FileBarChart2 },
            { id: "V5", nombre: "Cotizaciones Emitidas", desc: "Tasa de conversión de cotizaciones.", icon: FileText },
            { id: "V6", nombre: "Vendedores", desc: "Rendimiento por vendedor.", icon: FileText },
        ],
    },
    administrativos: {
        color: "text-violet-600 bg-violet-500/10 border-violet-500/20",
        icon: BookMarked,
        reportes: [
            { id: "A1", nombre: "Balance de Comprobación", desc: "Estado de cuentas contables del período.", icon: FileBarChart2 },
            { id: "A2", nombre: "Cuentas por Cobrar", desc: "Detalle de saldos pendientes por cliente.", icon: FileText },
            { id: "A3", nombre: "Cuentas por Pagar", desc: "Detalle de obligaciones con proveedores.", icon: FileText },
            { id: "A4", nombre: "Antigüedad de Saldos", desc: "Análisis de vencimiento de CxC/CxP.", icon: Calendar },
            { id: "A5", nombre: "Gastos por Categoría", desc: "Clasificación de egresos por tipo.", icon: BarChart3 },
            { id: "A6", nombre: "Conciliación Bancaria", desc: "Diferencias entre banco y libros.", icon: FileText },
            { id: "A7", nombre: "Nómina Mensual", desc: "Resumen de sueldos y retenciones.", icon: FileText },
        ],
    },
    financieros: {
        color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        icon: BarChart3,
        reportes: [
            { id: "F1", nombre: "Estado de Flujo de Efectivo", desc: "Entradas y salidas de efectivo del período.", icon: FileBarChart2 },
        ],
    },
    contables: {
        color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
        icon: BookMarked,
        reportes: [
            { id: "C1", nombre: "Estado de Resultados", desc: "Ingresos, costos y utilidades del período.", icon: FileBarChart2 },
            { id: "C2", nombre: "Balance General", desc: "Activos, pasivos y patrimonio.", icon: FileText },
            { id: "C3", nombre: "Libro Diario", desc: "Todos los asientos contables del período.", icon: BookMarked },
            { id: "C4", nombre: "Libro Mayor", desc: "Movimientos por cuenta contable.", icon: FileText },
            { id: "C5", nombre: "Activos Fijos", desc: "Bienes del activo y su depreciación.", icon: FileText },
            { id: "C6", nombre: "Estados Financieros", desc: "Reportes NIIF condensados.", icon: FileBarChart2 },
            { id: "C7", nombre: "Variaciones Patrimoniales", desc: "Cambios en el patrimonio del período.", icon: TrendingUp },
        ],
    },
    fiscales: {
        color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        icon: FileBarChart2,
        reportes: [
            { id: "T1", nombre: "Formato 606 (Compras)", desc: "Declaración mensual de compras DGII.", icon: FileText },
            { id: "T2", nombre: "Formato 607 (Ventas)", desc: "Declaración mensual de ventas DGII.", icon: FileText },
            { id: "T3", nombre: "Formato 608 (Anulados)", desc: "NCF anulados del período.", icon: FileText },
            { id: "T4", nombre: "Formato 609 (Exterior)", desc: "Pagos a proveedores del exterior.", icon: Globe },
            { id: "T5", nombre: "IT-1 (ITBIS Mensual)", desc: "Declaración mensual de ITBIS.", icon: FileBarChart2 },
            { id: "T6", nombre: "IR-2 (ISR Empresas)", desc: "Declaración anual de renta corporativa.", icon: FileBarChart2 },
            { id: "T7", nombre: "TSS Nómina", desc: "Reporte de seguridad social mensual.", icon: FileText },
        ],
    },
    paraTrabajar: {
        color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        icon: Download,
        reportes: [
            { id: "P1", nombre: "Exportar Facturas (Excel)", desc: "Todas las facturas en formato Excel.", icon: Download },
            { id: "P2", nombre: "Exportar Clientes (CSV)", desc: "Base de clientes exportable.", icon: Download },
        ],
    },
};

const TAB_KEYS = Object.keys(CATEGORIAS) as (keyof typeof CATEGORIAS)[];
const TAB_LABELS: Record<string, string> = {
    ventas: "Ventas",
    administrativos: "Administrativos",
    financieros: "Financieros",
    contables: "Contables",
    fiscales: "Fiscales",
    paraTrabajar: "Para Trabajar",
};

export default function ReportesPage() {
    const [search, setSearch] = useState("");
    const [favs, setFavs] = useState<string[]>([]);
    const [selectedReport, setSelectedReport] = useState<Reporte | null>(null);

    const toggleFav = (id: string) => setFavs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

    const handleDownload = (format: "TXT" | "EXCEL") => {
        toast.success(`Generando ${selectedReport?.nombre} en ${format}...`, {
            description: "El archivo se descargará automáticamente en unos segundos."
        });
        setTimeout(() => {
            setSelectedReport(null);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Visión completa de la información contable, administrativa y fiscal.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar reporte..." className="pl-9 bg-muted/50" />
                </div>
            </div>

            {/* Resumen de categorías */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {TAB_KEYS.map(key => {
                    const cat = CATEGORIAS[key];
                    return (
                        <Card key={key} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30 group">
                            <CardContent className="p-4 text-center">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", cat.color)}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold">{TAB_LABELS[key]}</p>
                                <p className="text-lg font-black tabular-nums mt-1">{cat.reportes.length}</p>
                                <p className="text-[10px] text-muted-foreground">reportes</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

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
                                    <Card key={rpt.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                                        <CardContent className="p-4 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", CATEGORIAS[key].color)}>
                                                    <rpt.icon className="w-4 h-4" />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleFav(rpt.id); }}
                                                    className={cn("transition-colors", favs.includes(rpt.id) ? "text-amber-500" : "text-muted-foreground/30 group-hover:text-muted-foreground")}
                                                >
                                                    <Star className={cn("w-4 h-4", favs.includes(rpt.id) && "fill-amber-500")} />
                                                </button>
                                            </div>
                                            <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{rpt.nombre}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{rpt.desc}</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedReport(rpt)}
                                                className="w-full h-7 text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all mt-auto"
                                            >
                                                <Download className="w-3 h-3 mr-1.5" /> Generar
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Modal de Generación de Reporte DGII */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileBarChart2 className="w-5 h-5 text-primary" />
                            Generar: {selectedReport?.nombre}
                        </DialogTitle>
                        <DialogDescription>
                            Selecciona los parámetros de fecha para generar tu reporte oficial.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Mes</label>
                                <Select defaultValue={new Date().getMonth().toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">01 - Enero</SelectItem>
                                        <SelectItem value="1">02 - Febrero</SelectItem>
                                        <SelectItem value="2">03 - Marzo</SelectItem>
                                        <SelectItem value="3">04 - Abril</SelectItem>
                                        <SelectItem value="4">05 - Mayo</SelectItem>
                                        <SelectItem value="5">06 - Junio</SelectItem>
                                        <SelectItem value="6">07 - Julio</SelectItem>
                                        <SelectItem value="7">08 - Agosto</SelectItem>
                                        <SelectItem value="8">09 - Septiembre</SelectItem>
                                        <SelectItem value="9">10 - Octubre</SelectItem>
                                        <SelectItem value="10">11 - Noviembre</SelectItem>
                                        <SelectItem value="11">12 - Diciembre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Año</label>
                                <Select defaultValue={new Date().getFullYear().toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Año" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2026">2026</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Mostrar info extra si es 606/607 */}
                        {(selectedReport?.id === "T1" || selectedReport?.id === "T2") && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-2">
                                <p className="text-xs text-primary font-medium flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>Este archivo se generará codificado en <strong>UTF-8</strong> (estándar). Si previsualizas caracteres raros (ñ, tildes) en Excel antiguo, utiliza el Bloc de Notas o envíalo directo a la Oficina Virtual DGII.</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => handleDownload("EXCEL")} className="w-full sm:w-1/2">
                            <Download className="w-4 h-4 mr-2" />
                            Previsualizar Excel
                        </Button>
                        <Button onClick={() => handleDownload("TXT")} className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white">
                            <FileText className="w-4 h-4 mr-2" />
                            Descargar TXT Oficial
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
