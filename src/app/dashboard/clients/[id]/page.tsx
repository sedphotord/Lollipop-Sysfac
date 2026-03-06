"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Building2, Calendar, CheckCircle2, Clock,
    CreditCard, DollarSign, Edit, ExternalLink, FileText, Mail,
    MapPin, Phone, Plus, Receipt, ShieldCheck, User2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";

const STATUS_COLORS: Record<string, string> = {
    pagada: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    pendiente: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    vencida: "text-red-500 bg-red-500/10 border-red-500/30",
};

function fmt(n: number) {
    return n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    const [client, setClient] = useState<any>(null);
    const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load client from localStorage
        try {
            const clientsRaw = companyStorage.get("clientes");
            const clients: any[] = clientsRaw ? JSON.parse(clientsRaw) : [];
            const found = clients.find((c: any) => c.id === clientId || c.rnc === clientId);
            if (found) setClient(found);
        } catch { }

        // Load invoices for this client
        try {
            const invRaw = companyStorage.get("invoice_emitted");
            const invoices: any[] = invRaw ? JSON.parse(invRaw) : [];
            const now = new Date().toISOString().split("T")[0];

            const clientInvoices = invoices
                .filter((inv: any) => {
                    if (inv.isDraft) return false;
                    const clientName = inv.cliente?.toLowerCase() || "";
                    const clientRnc = inv.rnc || "";
                    return (
                        inv.clientId === clientId ||
                        clientRnc === clientId ||
                        clientName.includes(clientId.toLowerCase())
                    );
                })
                .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
                .map((inv: any) => {
                    const isOverdue = inv.paymentStatus !== "pagada" && inv.vencimiento && inv.vencimiento < now;
                    return {
                        ...inv,
                        statusLabel: inv.paymentStatus === "pagada" ? "pagada" : isOverdue ? "vencida" : "pendiente",
                    };
                });

            setInvoiceHistory(clientInvoices);
        } catch { }

        setLoading(false);
    }, [clientId]);

    if (loading) return <div className="py-24 text-center text-muted-foreground animate-pulse">Cargando...</div>;

    // Fallback data if client not found in localStorage (might be accessed via name search)
    const c = client || {
        id: clientId,
        nombre: clientId,
        comercialName: clientId,
        rnc: "",
        tipo: "—",
        regimen: "Ordinario",
        status: "Activo",
        actividadEconomica: "—",
        direccion: "—",
        telefono: "—",
        email: "—",
        contacto: "—",
        condicionPago: "Contado",
        limiteCredito: 0,
    };

    const totalFacturado = invoiceHistory.reduce((a, i) => a + (i.total || 0), 0);
    const pendientes = invoiceHistory.filter(i => i.statusLabel !== "pagada");
    const saldoPendiente = pendientes.reduce((a, i) => a + (i.total || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/dashboard/clients")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-blue-600/5 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                            {(c.comercialName || c.nombre || "CL").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {c.comercialName || c.nombre || c.id}
                                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs py-0 gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> {c.status || "Activo"}
                                </Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {c.nombre !== c.comercialName && c.nombre ? c.nombre + " · " : ""}
                                <span className="font-mono">{c.rnc || "—"}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
                    <Link href={`/dashboard/invoices/new?clienteId=${c.id}&clienteNombre=${encodeURIComponent(c.comercialName || c.nombre || "")}`}>
                        <Button size="sm" className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Factura</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Facturado", value: `RD$ ${fmt(totalFacturado)}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Facturas Emitidas", value: invoiceHistory.length.toString(), icon: Receipt, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Saldo Pendiente", value: `RD$ ${fmt(saldoPendiente)}`, icon: Clock, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Facturas Pendientes", value: pendientes.length.toString(), icon: Calendar, color: "text-violet-600 bg-violet-500/10" },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", kpi.color)}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                                <p className="text-lg font-bold tracking-tight">{kpi.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Client Info */}
                <div className="space-y-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { icon: Building2, label: "Tipo", value: c.tipo || c.type || "—" },
                                { icon: ShieldCheck, label: "RNC", value: c.rnc || "—" },
                                { icon: Receipt, label: "Régimen", value: c.regimen || c.regime || "Ordinario" },
                                { icon: FileText, label: "Actividad", value: c.actividadEconomica || "—" },
                                { icon: CreditCard, label: "Condición Pago", value: c.condicionPago || "Contado" },
                                { icon: DollarSign, label: "Límite Crédito", value: c.limiteCredito ? `RD$ ${c.limiteCredito.toLocaleString()}` : "Sin límite" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground min-w-[110px]">{item.label}</span>
                                    <span className="font-medium">{item.value}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-3">
                                {c.direccion && c.direccion !== "—" && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground">{c.direccion}</span>
                                    </div>
                                )}
                                {c.telefono && c.telefono !== "—" && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{c.telefono}</span>
                                    </div>
                                )}
                                {c.email && c.email !== "—" && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{c.email}</span>
                                    </div>
                                )}
                                {c.contacto && c.contacto !== "—" && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <User2 className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{c.contacto}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Invoices History */}
                <div className="lg:col-span-2">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Historial de Facturas</CardTitle>
                            <Link href={`/dashboard/invoices/new`}>
                                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Nueva Factura</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {invoiceHistory.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No hay facturas registradas para este cliente.</p>
                                    <Link href="/dashboard/invoices/new">
                                        <Button variant="outline" size="sm" className="mt-3 gap-2">
                                            <Plus className="w-4 h-4" /> Crear primera factura
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead>e-CF / NCF</TableHead>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                    <TableHead className="w-10" />
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {invoiceHistory.map((inv) => (
                                                    <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                                                        <TableCell className="font-mono text-xs text-muted-foreground">{inv.ecf || inv.id}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                                                        <TableCell className="text-right font-medium tabular-nums">RD$ {fmt(inv.total || 0)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={cn("text-xs capitalize", STATUS_COLORS[inv.statusLabel])}>
                                                                {inv.statusLabel}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Link href={`/dashboard/invoices/${inv.id}`}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 rounded-lg p-4">
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">{invoiceHistory.length}</span> facturas registradas
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Total Facturado: </span>
                                                <span className="font-bold text-foreground">RD$ {fmt(totalFacturado)}</span>
                                            </div>
                                            {saldoPendiente > 0 && (
                                                <div className="text-amber-600 font-semibold">
                                                    Por cobrar: RD$ {fmt(saldoPendiente)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
