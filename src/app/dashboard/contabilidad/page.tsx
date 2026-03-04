import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, FileSpreadsheet, Calculator, FileText } from "lucide-react";

export default function ContabilidadPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contabilidad & Fiscal (DGII)</h2>
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
                                <span className="font-semibold">Octubre 2023</span>
                            </div>
                            <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20" variant="ghost">
                                <Download className="w-4 h-4 mr-2" /> Descargar TXT
                            </Button>
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
                                <span className="font-semibold">Octubre 2023</span>
                            </div>
                            <Button className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" variant="ghost">
                                <Download className="w-4 h-4 mr-2" /> Descargar TXT
                            </Button>
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
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ITBIS a Pagar (Est.):</span>
                                <span className="font-bold border-b border-border">RD$ 15,200.00</span>
                            </div>
                            <Button className="w-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" variant="ghost">
                                <FileText className="w-4 h-4 mr-2" /> Ver Borrador
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
