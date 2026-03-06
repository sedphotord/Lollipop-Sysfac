"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, FileSpreadsheet, Calculator, FileText } from "lucide-react";
import { companyStorage } from "@/lib/company-storage";
import Link from "next/link";

export default function ContabilidadPage() {
    const [periodo, setPeriodo] = useState("");
    const [itbisVentas, setItbisVentas] = useState(0);
    const [itbisCompras, setItbisCompras] = useState(0);

    useEffect(() => {
        const now = new Date();
        const mesNombre = now.toLocaleDateString("es-DO", { month: "long", year: "numeric" });
        setPeriodo(mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1));

        try {
            const invoices: any[] = JSON.parse(companyStorage.get("invoice_emitted") || "[]");
            const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            const mesInv = invoices.filter(i => (i.date || i.createdAt || "").startsWith(ym));
            setItbisVentas(mesInv.reduce((a, i) => a + (i.totals?.tax || 0), 0));
        } catch { }

        try {
            const gastos: any[] = JSON.parse(companyStorage.get("gastos") || "[]");
            const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
            const mesGastos = gastos.filter(g => (g.fecha || "").startsWith(ym));
            setItbisCompras(mesGastos.reduce((a, g) => a + (g.itbis || 0), 0));
        } catch { }
    }, []);

    const itbisNeto = itbisVentas - itbisCompras;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contabilidad &amp; Fiscal (DGII)</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Genera reportes 606, 607, IT-1 y gestiona tu catálogo de cuentas.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 606 */}
                <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60 hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <CardTitle>Formato 606</CardTitle>
                        <CardDescription>Reporte de compras y gastos fiscales para envíos mensuales a la DGII.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Período Actual:</span>
                                <span className="font-semibold">{periodo}</span>
                            </div>
                            <Link href="/dashboard/reportes/606">
                                <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20" variant="ghost">
                                    <Download className="w-4 h-4 mr-2" /> Ir al Reporte 606
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* 607 */}
                <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60 hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                            <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <CardTitle>Formato 607</CardTitle>
                        <CardDescription>Reporte de ventas de bienes y servicios (facturas de consumo y crédito).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Período Actual:</span>
                                <span className="font-semibold">{periodo}</span>
                            </div>
                            <Link href="/dashboard/reportes/607">
                                <Button className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" variant="ghost">
                                    <Download className="w-4 h-4 mr-2" /> Ir al Reporte 607
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* IT-1 */}
                <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60 hover:shadow-md transition-all">
                    <CardHeader>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                            <Calculator className="w-6 h-6" />
                        </div>
                        <CardTitle>Borrador IT-1</CardTitle>
                        <CardDescription>Pre-cálculo del ITBIS a pagar según ventas y compras registradas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ITBIS Ventas ({periodo}):</span>
                                <span className="font-semibold text-primary">RD$ {itbisVentas.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ITBIS Compras ({periodo}):</span>
                                <span className="font-semibold text-emerald-600">-RD$ {itbisCompras.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-2 mt-1">
                                <span className="text-muted-foreground font-medium">ITBIS a Pagar (Est.):</span>
                                <span className={`font-bold border-b border-border ${itbisNeto >= 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                    RD$ {itbisNeto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <Button className="w-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 mt-2" variant="ghost">
                                <FileText className="w-4 h-4 mr-2" /> Ver Borrador
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
