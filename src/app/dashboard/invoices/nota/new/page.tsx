"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle, ArrowLeft, Check, FileText, GripVertical,
    Info, Plus, QrCode, Search, Send, Trash2, FileSignature
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// The original invoice being credited
const ORIGINAL_INVOICE = {
    id: "INV-2024-0038",
    ecf: "E3200000009",
    tipo: "B02",
    date: "08 Oct 2024",
    cliente: "María Santos",
    rnc: "40212345678",
    items: [
        { id: "1", desc: "Servicio de Diseño Gráfico", code: "SRV-020", qty: 2, price: 4375, itbis: 18 },
    ],
    total: 10325,
};

const NOTA_TIPOS = [
    {
        type: "B04",
        ecfType: "34",
        name: "Nota de Crédito",
        desc: "Reduce el valor de la factura original. Devuelve dinero al cliente.",
        color: "text-rose-600",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
    },
    {
        type: "B03",
        ecfType: "33",
        name: "Nota de Débito",
        desc: "Aumenta el valor de la factura original. Cobra más al cliente.",
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
    },
];

export default function NotaCreditoNewPage() {
    const [notaTipo, setNotaTipo] = useState<"B04" | "B03">("B04");
    const [motivo, setMotivo] = useState("devolucion");
    const [items, setItems] = useState([
        { id: Date.now(), desc: ORIGINAL_INVOICE.items[0].desc, qty: 2, price: 4375, itbis: 18 },
    ]);

    const addItem = () => setItems([...items, { id: Date.now(), desc: "", qty: 1, price: 0, itbis: 18 }]);
    const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));
    const updateItem = (id: number, field: string, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
    const itbis = items.reduce((a, i) => a + (i.price * i.qty * i.itbis / 100), 0);
    const total = subtotal + itbis;

    const tipoInfo = NOTA_TIPOS.find(t => t.type === notaTipo)!;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            {/* Toolbar */}
            <div className="border-b bg-card/40 backdrop-blur-xl px-4 lg:px-6 py-3 shrink-0 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/invoices/nota">
                        <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">
                            {notaTipo === "B04" ? "Nueva Nota de Crédito" : "Nueva Nota de Débito"}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Vinculada a <span className="font-mono font-medium text-foreground">{ORIGINAL_INVOICE.id}</span> · e-CF {ORIGINAL_INVOICE.ecf}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Guardar Borrador</Button>
                    <Button size="sm" className={cn(
                        "shadow-lg text-white border-none",
                        notaTipo === "B04"
                            ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                            : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                    )}>
                        <Send className="w-4 h-4 mr-2" /> Firmar y Enviar DGII
                    </Button>
                </div>
            </div>

            {/* Split Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor */}
                <div className="w-full lg:w-3/5 xl:w-[55%] border-r flex flex-col bg-background/50">
                    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-10 pb-20">

                        {/* Factura original */}
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Factura Original Referenciada</h2>
                            <Card className="bg-card/60 border-border/60 shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold font-mono">{ORIGINAL_INVOICE.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {ORIGINAL_INVOICE.cliente} · {ORIGINAL_INVOICE.date} · RD$ {ORIGINAL_INVOICE.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">{ORIGINAL_INVOICE.tipo}</Badge>
                                        <Badge variant="outline" className="font-mono text-xs text-muted-foreground">{ORIGINAL_INVOICE.ecf}</Badge>
                                        <Link href={`/dashboard/invoices/${ORIGINAL_INVOICE.id}`}>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Ver →</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Tipo */}
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Paso 1: Tipo de Nota</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {NOTA_TIPOS.map(t => (
                                    <div
                                        key={t.type}
                                        onClick={() => setNotaTipo(t.type as "B04" | "B03")}
                                        className={cn(
                                            "border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
                                            notaTipo === t.type
                                                ? `${t.border} ${t.bg} ring-1 ring-current shadow-sm`
                                                : "border-border bg-card/40 hover:border-border"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <Badge variant="outline" className={cn(
                                                "font-mono text-sm",
                                                notaTipo === t.type ? `${t.color} ${t.border} ${t.bg}` : "bg-muted"
                                            )}>{t.type}</Badge>
                                            {notaTipo === t.type && <Check className={cn("w-5 h-5", t.color)} />}
                                        </div>
                                        <p className={cn("font-bold text-base mb-1", notaTipo === t.type ? t.color : "")}>{t.name}</p>
                                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Motivo */}
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Paso 2: Motivo</h2>
                            <Select value={motivo} onValueChange={setMotivo}>
                                <SelectTrigger className="bg-card">
                                    <SelectValue placeholder="Seleccione el motivo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {notaTipo === "B04" ? (
                                        <>
                                            <SelectItem value="devolucion">Devolución de mercancía</SelectItem>
                                            <SelectItem value="descuento">Descuento no aplicado</SelectItem>
                                            <SelectItem value="error_precio">Error en precio</SelectItem>
                                            <SelectItem value="anulacion">Anulación parcial del servicio</SelectItem>
                                            <SelectItem value="otro">Otro motivo</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="gasto_adicional">Gasto adicional no facturado</SelectItem>
                                            <SelectItem value="ajuste_precio">Ajuste de precio acordado</SelectItem>
                                            <SelectItem value="penalidad">Penalidad por incumplimiento</SelectItem>
                                            <SelectItem value="otro">Otro motivo</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm">
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>
                                    <strong>Regla DGII:</strong> La {tipoInfo.name} ({tipoInfo.type}) debe emitirse dentro de los <strong>30 días hábiles</strong> siguientes a la fecha de la factura original.
                                </p>
                            </div>
                        </section>

                        {/* Líneas */}
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Paso 3: Conceptos a {notaTipo === "B04" ? "Acreditar" : "Debitar"}</h2>
                            <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[40px]"></TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead className="w-[90px] text-right">Cant.</TableHead>
                                            <TableHead className="w-[140px] text-right">Precio</TableHead>
                                            <TableHead className="w-[100px] text-right">ITBIS</TableHead>
                                            <TableHead className="w-[120px] text-right">Total</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map(item => (
                                            <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors">
                                                <TableCell className="p-2 text-muted-foreground/30 group-hover:text-muted-foreground"><GripVertical className="w-4 h-4 mx-auto" /></TableCell>
                                                <TableCell className="p-2">
                                                    <Input value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} placeholder="Descripción del concepto..." className="h-9 border-transparent hover:border-border bg-transparent shadow-none" />
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <Input type="number" min="1" value={item.qty} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} className="text-right h-9 border-transparent hover:border-border bg-transparent shadow-none" />
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <Input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="text-right h-9 border-transparent hover:border-border bg-transparent shadow-none" />
                                                </TableCell>
                                                <TableCell className="p-2">
                                                    <Select value={item.itbis.toString()} onValueChange={v => updateItem(item.id, 'itbis', parseInt(v))}>
                                                        <SelectTrigger className="h-9 border-transparent hover:border-border bg-transparent shadow-none px-2 justify-end"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="18">18%</SelectItem>
                                                            <SelectItem value="16">16%</SelectItem>
                                                            <SelectItem value="0">Exento</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="p-2 text-right font-medium">{(item.price * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="p-2">
                                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="p-2 bg-muted/20 border-t">
                                    <Button variant="ghost" size="sm" onClick={addItem} className="text-primary font-semibold hover:bg-primary/10"><Plus className="w-4 h-4 mr-2" /> Agregar Línea</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right: Paper Preview */}
                <div className="hidden lg:flex flex-col w-2/5 xl:w-[45%] bg-muted/30 h-full overflow-y-auto p-6 lg:p-8">
                    <div className="flex flex-col items-center min-h-full">
                        <div className={cn(
                            "bg-white text-stone-900 w-full max-w-[760px] rounded-sm border overflow-hidden",
                            notaTipo === "B04" ? "border-rose-200" : "border-amber-200"
                        )}>
                            <div className={cn("h-2 w-full", notaTipo === "B04" ? "bg-rose-600" : "bg-amber-600")}></div>
                            <div className="p-8 md:p-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="font-black text-2xl tracking-tighter text-slate-800 mb-3 flex items-center gap-2">
                                            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-sm">M</div>
                                            Sed Photo SRL
                                        </div>
                                        <p className="text-sm text-stone-600">RNC: 130123456</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 border",
                                            notaTipo === "B04" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-600 border-amber-200"
                                        )}>
                                            {tipoInfo.name}
                                        </div>
                                        <p className="text-sm mt-1"><span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold mr-1">e-CF:</span><span className="font-mono font-semibold">{notaTipo === 'B04' ? 'E3400000001' : 'E3300000001'}</span></p>
                                        <p className="text-xs text-stone-400 mt-2">Ref. Original: <span className="font-mono">{ORIGINAL_INVOICE.ecf}</span></p>
                                    </div>
                                </div>

                                {/* Client */}
                                <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-stone-400 uppercase tracking-wider text-[10px] font-bold mb-1">Cliente:</p>
                                    <h3 className="font-bold text-slate-800">{ORIGINAL_INVOICE.cliente}</h3>
                                    <p className="text-sm"><span className="text-stone-400 text-[10px] uppercase font-bold mr-1">RNC/CÉD:</span>{ORIGINAL_INVOICE.rnc}</p>
                                </div>

                                {/* Motivo */}
                                <div className={cn("mb-6 p-3 rounded-lg text-sm border", notaTipo === "B04" ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-amber-50 border-amber-100 text-amber-700")}>
                                    <span className="font-bold uppercase text-xs tracking-wider">Motivo: </span>
                                    {motivo === 'devolucion' ? 'Devolución de mercancía' : motivo === 'descuento' ? 'Descuento no aplicado' : motivo === 'error_precio' ? 'Error en precio' : 'Ajuste acordado'}
                                </div>

                                {/* Items */}
                                <div className="mb-6 overflow-hidden rounded-t-lg border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                                                <th className="py-2 px-3 text-left w-[55%]">Descripción</th>
                                                <th className="py-2 px-3 text-right">Cant.</th>
                                                <th className="py-2 px-3 text-right">Precio</th>
                                                <th className="py-2 px-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, i) => (
                                                <tr key={i} className="border-b border-stone-100 last:border-0 bg-white">
                                                    <td className="py-3 px-3 font-medium text-slate-800">{item.desc || "Sin descripción"}</td>
                                                    <td className="py-3 px-3 text-right tabular-nums">{item.qty}</td>
                                                    <td className="py-3 px-3 text-right tabular-nums">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                    <td className="py-3 px-3 text-right tabular-nums font-semibold text-slate-800">{(item.price * item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-between items-end gap-6 pt-4 border-t border-slate-200">
                                    <div className="text-xs text-stone-400">
                                        <div className="w-16 h-16 bg-white border-2 border-stone-200 rounded flex items-center justify-center text-stone-300 mb-2"><QrCode className="w-10 h-10" /></div>
                                        <div className="flex items-center gap-1 text-blue-600"><FileSignature className="w-3 h-3" /> Firma Digital</div>
                                    </div>
                                    <div className="min-w-[220px] space-y-2 text-sm">
                                        <div className="flex justify-between text-stone-600"><span>Subtotal:</span><span className="tabular-nums font-mono">RD$ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                        <div className="flex justify-between text-stone-600"><span>ITBIS:</span><span className="tabular-nums font-mono">RD$ {itbis.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                        <div className={cn(
                                            "flex justify-between p-3 rounded-lg mt-3 text-white font-bold",
                                            notaTipo === "B04" ? "bg-rose-600" : "bg-amber-600"
                                        )}>
                                            <span className="uppercase text-sm tracking-wider">
                                                {notaTipo === "B04" ? "A Acreditar" : "A Debitar"}
                                            </span>
                                            <span className="text-base tabular-nums">RD$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs mt-4 text-center max-w-sm">Vista previa del documento e-CF ({notaTipo === 'B04' ? '34' : '33'}) que se enviará a la DGII.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
