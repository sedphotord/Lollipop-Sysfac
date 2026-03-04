"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, CheckCircle2, ChevronDown, Save, Scale, X, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const MOCK_ACCOUNTS = [
    { id: "1", code: "1-1-01", name: "Caja General" },
    { id: "2", code: "1-1-02", name: "Banco Popular - Cta. Corriente" },
    { id: "3", code: "1-1-05", name: "Cuentas por Cobrar Clientes" },
    { id: "4", code: "2-1-01", name: "Cuentas por Pagar Proveedores" },
    { id: "5", code: "4-1-01", name: "Ingresos por Ventas Locales" },
    { id: "6", code: "6-1-01", name: "Gastos de Salarios" },
    { id: "7", code: "2-1-05", name: "ITBIS por Pagar" },
];

type Line = { id: number; account: string; desc: string; debit: number; credit: number };

function JournalLine({ line, onUpdate, onRemove }: { line: Line; onUpdate: (field: keyof Line, value: any) => void; onRemove: () => void; }) {
    const [accOpen, setAccOpen] = useState(false);

    // Prevent both debit and credit having value greater than 0
    const handleDebit = (val: number) => {
        onUpdate("debit", val);
        if (val > 0) onUpdate("credit", 0);
    };

    const handleCredit = (val: number) => {
        onUpdate("credit", val);
        if (val > 0) onUpdate("debit", 0);
    };

    return (
        <tr className="border-b border-border/60 hover:bg-primary/[0.02] group/row transition-colors">
            <td className="py-2 px-2">
                <Popover open={accOpen} onOpenChange={setAccOpen}>
                    <PopoverTrigger asChild>
                        <div className={cn(
                            "flex items-center justify-between h-9 px-3 rounded-lg border text-sm cursor-pointer transition-all",
                            line.account ? "border-border text-foreground hover:border-primary/50" : "border-dashed border-border text-muted-foreground bg-muted/20 hover:border-primary/40"
                        )}>
                            <span className="truncate">{line.account || "Seleccionar Cuenta..."}</span>
                            <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[360px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar cuenta o código..." />
                            <CommandList>
                                <CommandEmpty>No se encontraron cuentas</CommandEmpty>
                                <CommandGroup>
                                    {MOCK_ACCOUNTS.map(a => (
                                        <CommandItem key={a.id} onSelect={() => {
                                            onUpdate("account", `${a.code} - ${a.name}`);
                                            setAccOpen(false);
                                        }} className="flex flex-col items-start cursor-pointer py-2">
                                            <span className="font-medium text-sm">{a.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{a.code}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </td>
            <td className="py-2 px-1.5"><Input value={line.desc} onChange={e => onUpdate("desc", e.target.value)} className="h-9 min-w-[200px]" placeholder="Concepto de la línea..." /></td>
            <td className="py-2 px-1.5 w-32">
                <Input type="number" value={line.debit || ""} onChange={e => handleDebit(parseFloat(e.target.value) || 0)} className="h-9 text-right font-mono" placeholder="0.00" min={0} />
            </td>
            <td className="py-2 px-1.5 w-32">
                <Input type="number" value={line.credit || ""} onChange={e => handleCredit(parseFloat(e.target.value) || 0)} className="h-9 text-right font-mono text-primary bg-primary/5 border-primary/20" placeholder="0.00" min={0} />
            </td>
            <td className="py-2 px-2 text-center w-10">
                <button onClick={onRemove} className="text-muted-foreground/40 hover:text-destructive transition-colors"><X className="w-4 h-4" /></button>
            </td>
        </tr>
    );
}

export default function NuevaEntradaDiarioPage() {
    const todayISO = new Date().toISOString().split("T")[0];

    const [documentId, setDocumentId] = useState("AJ-2024-006");
    const [date, setDate] = useState(todayISO);
    const [reference, setReference] = useState("");
    const [description, setDescription] = useState("");
    const [saved, setSaved] = useState(false);

    const [lines, setLines] = useState<Line[]>([
        { id: 1, account: "", desc: "", debit: 0, credit: 0 },
        { id: 2, account: "", desc: "", debit: 0, credit: 0 },
    ]);

    const totalDebit = lines.reduce((a, l) => a + l.debit, 0);
    const totalCredit = lines.reduce((a, l) => a + l.credit, 0);
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    const addLine = () => setLines(p => [...p, { id: Date.now(), account: "", desc: "", debit: 0, credit: 0 }]);
    const removeLine = (id: number) => setLines(p => p.filter(l => l.id !== id));
    const updateLine = (id: number, field: keyof Line, value: any) => setLines(p => p.map(l => l.id !== id ? l : { ...l, [field]: value }));

    const handleSave = () => {
        if (!isBalanced) return;
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500 bg-muted/20 text-sm">
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-5 py-3.5 shadow-2xl">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div><p className="font-bold text-sm">Asiento Contable Registrado</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-background border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/contabilidad/diario">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-violet-600" />
                        <h1 className="text-base font-bold">Generar Entrada de Diario</h1>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    {/* Top Info */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b">
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="font-bold border-b pb-2">Información del Asiento</h3>
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Término o Justificación *</Label>
                                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Depreciación de activos fijos octubre..." className="h-10 font-medium" />
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/30 p-4 rounded-xl border">
                            <div className="flex justify-between items-center border-b pb-2 border-border/50">
                                <span className="font-bold text-sm">Registro N°</span>
                                <Input value={documentId} onChange={e => setDocumentId(e.target.value)} className="text-sm font-bold font-mono w-28 border-0 bg-transparent text-right p-0 h-6" />
                            </div>
                            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Fecha *</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9" /></div>
                            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Comprobante o Ref.</Label><Input value={reference} onChange={e => setReference(e.target.value)} placeholder="Opcional" className="h-9" /></div>
                        </div>
                    </div>

                    {/* Lines Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/30 border-b text-xs text-muted-foreground font-semibold text-left uppercase tracking-wide">
                                    <th className="py-3 px-4">Cuenta Contable</th>
                                    <th className="py-3 px-3">Descripción / Referencia</th>
                                    <th className="py-3 px-3 text-right">Débitos (RD$)</th>
                                    <th className="py-3 px-3 text-right">Créditos (RD$)</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map(line => (
                                    <JournalLine key={line.id} line={line} onUpdate={(field, val) => updateLine(line.id, field, val)} onRemove={() => removeLine(line.id)} />
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-muted/10 p-2 border-t px-4 py-3">
                            <Button variant="outline" size="sm" onClick={addLine} className="text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100 hover:text-violet-800">
                                <Plus className="w-4 h-4 mr-1" /> Añadir Movimiento
                            </Button>
                        </div>
                    </div>

                    {/* Totals & Validation */}
                    <div className="p-6 bg-muted/5">
                        <div className="flex flex-col items-end gap-3 max-w-sm ml-auto">
                            <div className="flex w-full justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Débitos</span>
                                <span className="font-mono text-base font-semibold">RD$ {totalDebit.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex w-full justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Créditos</span>
                                <span className="font-mono text-base font-semibold text-primary">RD$ {totalCredit.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className={cn(
                                "flex w-full justify-between items-center text-sm border-t pt-3 mt-1",
                                isBalanced ? "text-emerald-600 font-bold" : (totalDebit > 0 || totalCredit > 0) ? "text-red-500 font-bold" : "text-muted-foreground font-bold"
                            )}>
                                <span>Diferencia (Cuadre)</span>
                                <span className="font-mono text-lg">RD$ {difference.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                            </div>

                            {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                                <p className="text-xs text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg w-full text-center border border-red-500/20">
                                    El asiento no cuadra. Revisa los valores.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-6 py-4 flex items-center justify-between z-20">
                <Link href="/dashboard/contabilidad/diario"><Button variant="ghost">Cancelar</Button></Link>
                <div className="flex gap-3">
                    <Button
                        className={cn("text-white gap-2 shadow-lg transition-all", isBalanced ? "bg-violet-600 hover:bg-violet-700 shadow-violet-500/30" : "bg-muted-foreground")}
                        disabled={!isBalanced || description.trim() === ""}
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" /> Asentar en Libro Diario
                    </Button>
                </div>
            </div>
        </div>
    );
}
