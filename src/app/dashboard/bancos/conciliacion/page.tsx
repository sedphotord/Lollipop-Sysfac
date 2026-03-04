"use client";

import React, { useState } from "react";
import {
    Building2,
    Search,
    AlertCircle,
    CheckCircle2,
    FileText,
    ArrowRightLeft,
    ArrowUpRight,
    ArrowDownRight,
    Plus
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Tipos de Datos (Simulando API) ---

type BankTransaction = {
    id: string;
    date: string;
    description: string;
    reference: string;
    amount: number;
    type: "in" | "out";
    status: "pending" | "matched";
};

type SysterRecord = {
    id: string;
    date: string;
    concept: string;
    thirdParty: string;
    amount: number;
    type: "income" | "expense";
};

export default function BankReconciliationPage() {
    const [activeTab, setActiveTab] = useState<"pending" | "matched">("pending");
    const [searchQuery, setSearchQuery] = useState("");

    // Transacciones Bancarias (Lado Izquierdo)
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([
        { id: "bt_1", date: "2026-03-01", description: "Transferencia BHD CL 2939", reference: "REF-99201", amount: 15000, type: "in", status: "pending" },
        { id: "bt_2", date: "2026-03-02", description: "Pago de Nomina Q1", reference: "TX-4402", amount: 45000, type: "out", status: "pending" },
        { id: "bt_3", date: "2026-03-03", description: "Deposito en Efectivo Ofic", reference: "DEP-001", amount: 8500, type: "in", status: "pending" },
        { id: "bt_4", date: "2026-02-28", description: "Cobro Servicio AWS", reference: "AWS-992", amount: 6500, type: "out", status: "matched" },
    ]);

    // Registros en Sysfac (Lado Derecho)
    const [systemRecords, setSystemRecords] = useState<SysterRecord[]>([
        { id: "sys_1", date: "2026-03-01", concept: "Cobro Factura F-0012", thirdParty: "Ferreteria Ochoa", amount: 15000, type: "income" },
        { id: "sys_2", date: "2026-03-02", concept: "Recibo de Ingreso #99", thirdParty: "Cliente Mostrador", amount: 8500, type: "income" },
        { id: "sys_3", date: "2026-03-02", concept: "CxP Planilla Empleados", thirdParty: "Tesoreria", amount: 45000, type: "expense" },
        { id: "sys_4", date: "2026-03-04", concept: "Pago Factura Internet", thirdParty: "Claro Dominicana", amount: 3200, type: "expense" },
    ]);

    const [selectedBankTx, setSelectedBankTx] = useState<string | null>(null);

    // Derivados
    const pendingTransactions = bankTransactions.filter(t => t.status === "pending");
    const matchedTransactions = bankTransactions.filter(t => t.status === "matched");

    const handleMatch = (bankTxId: string, systemRecordId: string) => {
        // Aquí iría la lógica real de actualizar la Base de Datos
        setBankTransactions(prev => prev.map(tx => tx.id === bankTxId ? { ...tx, status: "matched" } : tx));
        setSelectedBankTx(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 relative min-h-screen">

            {/* Background Decorativo Glassmorphism */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent -z-10 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] -z-10 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                        Conciliación Bancaria
                    </h2>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Enlaza tus movimientos del banco con los registros de Sysfac.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button variant="outline" className="w-full sm:w-auto bg-white/50 dark:bg-black/50 backdrop-blur-md border-primary/20 hover:border-primary/50 transition-all">
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Importar Estado (Excel/CSV)
                    </Button>
                    <Button className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalizar Conciliación
                    </Button>
                </div>
            </div>

            {/* Selector de Banco y Resumen */}
            <Card className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-xl overflow-hidden mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Banco Popular Dominicano</h3>
                                <p className="text-sm text-muted-foreground">Cuenta Corriente ****8832 • DOP</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Saldo en Bancos (Extracto)</p>
                                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">$1,450,230.00</p>
                            </div>
                            <div className="h-10 w-px bg-border"></div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Saldo en Sysfac (Libros)</p>
                                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">$1,438,230.00</p>
                            </div>
                            <div className="h-10 w-px bg-border"></div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Diferencia</p>
                                <p className="text-2xl font-bold font-mono text-amber-500">$12,000.00</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("pending")}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        activeTab === "pending"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                >
                    Pendientes ({pendingTransactions.length})
                </button>
                <button
                    onClick={() => setActiveTab("matched")}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        activeTab === "matched"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                >
                    Conciliados ({matchedTransactions.length})
                </button>
            </div>

            {/* SPLIT SCREEN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* COLUMNA IZQUIERDA: MOVIMIENTOS DEL BANCO */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                            Movimientos del Banco
                        </h3>
                        <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                            {activeTab === "pending" ? pendingTransactions.length : matchedTransactions.length} items
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-3">
                        {(activeTab === "pending" ? pendingTransactions : matchedTransactions).map(tx => (
                            <Card
                                key={tx.id}
                                className={cn(
                                    "bg-white/70 dark:bg-black/40 backdrop-blur-md transition-all cursor-pointer hover:border-primary/50 overflow-hidden relative group",
                                    selectedBankTx === tx.id ? "ring-2 ring-primary border-primary shadow-md shadow-primary/10" : "border-border/50",
                                    tx.status === "matched" && "opacity-70"
                                )}
                                onClick={() => tx.status === "pending" && setSelectedBankTx(tx.id)}
                            >
                                {selectedBankTx === tx.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                )}
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                                tx.type === "in" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                            )}>
                                                {tx.type === "in" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{tx.description}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                    <span>{format(new Date(tx.date), "dd MMM yyyy", { locale: es })}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">{tx.reference}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "font-bold font-mono text-base",
                                                tx.type === "in" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100"
                                            )}>
                                                {tx.type === "in" ? "+" : "-"}{formatCurrency(tx.amount)}
                                            </p>
                                            {tx.status === "matched" && (
                                                <Badge className="mt-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                                                    Conciliado
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {activeTab === "pending" && pendingTransactions.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 bg-white/40 dark:bg-black/20 rounded-xl border border-dashed border-border">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 opacity-50" />
                                <p className="text-emerald-600 font-medium">¡Todo conciliado!</p>
                                <p className="text-sm text-muted-foreground text-center mt-1">No hay movimientos pendientes en el banco.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: REGISTROS DE SYSFAC (A sugerir match) */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            Registros en Sysfac
                        </h3>

                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar factura o cobro..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20"
                                disabled={activeTab === "matched"}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {activeTab === "matched" ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-black/20 rounded-xl border border-border h-full">
                                <p className="text-muted-foreground text-center">Selecciona la pestaña de "Pendientes" para vincular nuevos movimientos.</p>
                            </div>
                        ) : !selectedBankTx ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white/40 dark:bg-black/20 rounded-xl border border-dashed border-border h-full transition-all">
                                <ArrowRightLeft className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                                <h4 className="text-lg font-medium">Selecciona un Movimiento</h4>
                                <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                                    Haz clic en una transacción bancaria a la izquierda para buscar automáticamente su factura o recibo correspondiente en Sysfac.
                                </p>
                            </div>
                        ) : (
                            // Cuando hay un movimiento seleccionado, mostrar las posibles coincidencias
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary" />
                                    <p className="text-sm text-primary font-medium">Sugerencias inteligentes basadas en monto y fecha.</p>
                                </div>

                                {systemRecords.filter(r => {
                                    const tx = bankTransactions.find(t => t.id === selectedBankTx);
                                    if (!tx) return false;
                                    // Sugerir records del mismo tipo (in->income, out->expense) y monto similar/exacto
                                    const typeMatch = (tx.type === "in" && r.type === "income") || (tx.type === "out" && r.type === "expense");
                                    return typeMatch;
                                }).map(record => {
                                    const currentTx = bankTransactions.find(t => t.id === selectedBankTx)!;
                                    const isExactAmount = record.amount === currentTx.amount;

                                    return (
                                        <div key={record.id} className="flex gap-4">
                                            {/* Línea conectora visual */}
                                            <div className="w-8 flex flex-col items-center justify-center shrink-0">
                                                <div className="h-full w-px bg-border/50"></div>
                                                <div className="w-6 h-6 rounded-full bg-background border flex items-center justify-center shadow-sm z-10">
                                                    <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <div className="h-full w-px bg-border/50"></div>
                                            </div>

                                            <Card className="flex-1 overflow-hidden border-border/50 bg-white/70 dark:bg-black/40 backdrop-blur-md hover:border-primary/50 transition-all">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Badge variant={record.type === "income" ? "default" : "secondary"} className="text-[10px] uppercase font-bold tracking-wider rounded-sm">
                                                                    {record.type === "income" ? "Ingreso" : "Gasto"}
                                                                </Badge>
                                                                {isExactAmount && (
                                                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[10px] uppercase">
                                                                        Coincidencia Exacta
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{record.concept}</p>
                                                            <p className="text-sm text-muted-foreground">{record.thirdParty} • {format(new Date(record.date), "dd MMM yyyy", { locale: es })}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold font-mono text-lg text-gray-900 dark:text-gray-100">
                                                                {formatCurrency(record.amount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 w-full pt-3 border-t border-border/50">
                                                        <Button
                                                            onClick={() => handleMatch(selectedBankTx, record.id)}
                                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                                                        >
                                                            Vincular Registros
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                })}

                                <div className="pt-4 flex items-center gap-4">
                                    <div className="h-px bg-border flex-1"></div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">O crear nuevo</span>
                                    <div className="h-px bg-border flex-1"></div>
                                </div>

                                <Button variant="outline" className="w-full border-dashed border-2 bg-transparent hover:bg-primary/5 hover:text-primary hover:border-primary/50 h-14">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Gasto / Ingreso directamente
                                </Button>

                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
