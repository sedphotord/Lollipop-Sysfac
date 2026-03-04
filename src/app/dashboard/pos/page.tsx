"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Check, CreditCard, DollarSign, Minus, Plus, Search,
    ShoppingBag, ShoppingCart, Trash2, Zap,
    Printer, RefreshCw, Settings, Percent, Sliders, Tags, Package, X, Lock, Unlock, Clock3, ArrowRightLeft, FileDown, FileSpreadsheet, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// Lazy-load invoice templates — only needed when printing, not on initial page load
const InvoiceStandard = dynamic(() => import("@/components/templates/InvoiceStandard").then(m => m.InvoiceStandard), { ssr: false });
const InvoiceCorporate = dynamic(() => import("@/components/templates/InvoiceCorporate").then(m => m.InvoiceCorporate), { ssr: false });
const InvoiceMinimal = dynamic(() => import("@/components/templates/InvoiceMinimal").then(m => m.InvoiceMinimal), { ssr: false });
const InvoiceModern = dynamic(() => import("@/components/templates/InvoiceModern").then(m => m.InvoiceModern), { ssr: false });
const InvoiceElegant = dynamic(() => import("@/components/templates/InvoiceElegant").then(m => m.InvoiceElegant), { ssr: false });

const INVOICE_TEMPLATES = {
    'inv-standard': InvoiceStandard,
    'inv-corporate': InvoiceCorporate,
    'inv-minimal': InvoiceMinimal,
    'inv-modern': InvoiceModern,
    'inv-elegant': InvoiceElegant,
};

// ─────────────────────────────────────────────
//  MOCK DATA (Shared with Invoice System)
// ─────────────────────────────────────────────
const DEFAULT_CLIENTS = [
    { id: "1", rnc: "101010101", name: "COMPAÑIA DOMINICANA DE TELEFONOS S.A.", trade: "CLARO", type: "SRL", status: "Activo" },
    { id: "2", rnc: "130000001", name: "JUAN ANTONIO PEREZ ROSARIO", trade: "", type: "Persona Física", status: "Activo" },
    { id: "3", rnc: "130819985", name: "ALTICE DOMINICANA S.A.", trade: "ALTICE", type: "SRL", status: "Activo" },
];

const INITIAL_PRODUCTS = [
    { id: "1", code: "PRD-001", name: "Laptop Dell XPS 15", description: "Potente laptop con pantalla InfinityEdge de 15 pulgadas y procesador de última generación.", price: 85000, itbis: 18, category: "Hardware", image: "/laptop_product_photo_1772472640429.png" },
    { id: "2", code: "PRD-002", name: "Monitor Samsung 27\"", description: "Monitor curvo con resolución QHD y tasa de refresco de 144Hz para máxima fluidez.", price: 32000, itbis: 18, category: "Hardware", image: "/monitor_product_photo_1772472659191.png" },
    { id: "3", code: "PRD-003", name: "Teclado Mecánico", description: "Teclado RGB con switches táctiles, ideal para productividad y gaming intensivo.", price: 8500, itbis: 18, category: "Hardware", image: "/keyboard_product_photo_1772472671935.png" },
    { id: "4", code: "SRV-001", name: "Consultoría IT (hora)", description: "Asesoría especializada en infraestructura, seguridad y optimización de sistemas.", price: 5000, itbis: 18, category: "Servicio", image: "/laptop_product_photo_1772472640429.png" },
    { id: "5", code: "PRD-005", name: "UPS APC 1500VA", description: "Respaldo de energía confiable con regulación de voltaje para equipos críticos.", price: 18000, itbis: 18, category: "Hardware", image: "/monitor_product_photo_1772472659191.png" },
    { id: "6", code: "SFT-001", name: "MS Office 365 (año)", description: "Suscripción anual que incluye Word, Excel, PowerPoint y 1TB de almacenamiento en la nube.", price: 6500, itbis: 18, category: "Software", image: "/keyboard_product_photo_1772472671935.png" },
];

const TIPOS_NCF = [
    { code: "B01", name: "Crédito Fiscal" },
    { code: "B02", name: "Consumo" },
    { code: "B14", name: "Gubernamental" },
    { code: "B15", name: "Exportación" },
];

const VENDEDORES = ["Marcos Perez", "Ana Rodriguez", "Jose Manuel"];
const BANCOS = ["Popular", "BHD León", "Banreservas", "Scotiabank"];

type CartItem = { id: string; name: string; description?: string; price: number; itbis: number; qty: number; image: string };
type Client = typeof DEFAULT_CLIENTS[0];

export default function POSPage() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [catFilter, setCatFilter] = useState("all");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [ncfType, setNcfType] = useState("B01");
    const [priceList, setPriceList] = useState("General");
    const [discount, setDiscount] = useState(0);

    const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS);
    const [clientSearch, setClientSearch] = useState("");
    const [showClientDropdown, setShowClientDropdown] = useState(false);

    // UI Modals
    const [showPayModal, setShowPayModal] = useState(false);
    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<"methods" | "detail" | "success">("methods");
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    // Form states for New Product
    const [newProdName, setNewProdName] = useState("");
    const [newProdPrice, setNewProdPrice] = useState("");
    const [newProdCat, setNewProdCat] = useState("Hardware");

    // Form states for New Client
    const [newClientName, setNewClientName] = useState("");
    const [newClientRnc, setNewClientRnc] = useState("");
    const [newClientEmail, setNewClientEmail] = useState("");

    // Form states
    const [splitPayments, setSplitPayments] = useState<{ method: string, amount: number }[]>([]);
    const [splitMethod, setSplitMethod] = useState("efectivo");
    const [splitAmount, setSplitAmount] = useState<string>("");
    const [amountPaid, setAmountPaid] = useState<string>("");
    const [selectedVendedor, setSelectedVendedor] = useState("");
    const [selectedBanco, setSelectedBanco] = useState("");
    const [observations, setObservations] = useState("");
    const [invoiceCreated, setInvoiceCreated] = useState<any>(null);
    const [printMode, setPrintMode] = useState<'ticket' | 'invoice'>('ticket');
    const [globalTemplateId, setGlobalTemplateId] = useState('inv-standard');
    const [globalColor, setGlobalColor] = useState('#3b82f6');

    // Cash Drawer / Shift state
    const [shiftOpen, setShiftOpen] = useState(false);
    const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
    const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
    const [shiftOpenTime, setShiftOpenTime] = useState<string | null>(null);
    const [openingFloat, setOpeningFloat] = useState("");
    const [shiftSales, setShiftSales] = useState<{ id: string; total: number; method: string; time: string }[]>([]);
    const DENOMINATIONS = [2000, 1000, 500, 200, 100, 50, 25, 10, 5, 1];
    const [denomCounts, setDenomCounts] = useState<Record<number, string>>({});
    const [shiftClosed, setShiftClosed] = useState(false); // shows export step
    const [closedRecord, setClosedRecord] = useState<any>(null);

    useEffect(() => {
        const savedColor = localStorage.getItem('lollipop_theme_color');
        if (savedColor) setGlobalColor(savedColor);

        const savedInvoice = localStorage.getItem('lollipop_invoice_template_id');
        if (savedInvoice && Object.keys(INVOICE_TEMPLATES).includes(savedInvoice)) {
            setGlobalTemplateId(savedInvoice);
        }

        // Inject POS print styles once
        const styleId = 'pos-print-styles';
        if (document.getElementById(styleId)) {
            document.getElementById(styleId)!.remove();
        }
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @media print {
                body * { visibility: hidden !important; }
                #print-ticket, #print-ticket * { visibility: visible !important; }
                #print-ticket {
                    position: fixed !important;
                    left: 0 !important; top: 0 !important;
                    width: 80mm !important;
                    visibility: visible !important;
                    z-index: 999999 !important;
                    background: white !important;
                    display: block !important;
                }
                #print-invoice, #print-invoice * { visibility: visible !important; }
                #print-invoice {
                    position: fixed !important;
                    left: 0 !important; top: 0 !important;
                    width: 8.5in !important;
                    visibility: visible !important;
                    z-index: 999999 !important;
                    background: white !important;
                    display: block !important;
                }
            }
            @page { size: letter; margin: 0; }
            .scrollbar-none::-webkit-scrollbar { display: none; }
            .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            .shadow-brand { box-shadow: 0 4px 14px 0 rgba(35,70,232,0.39); }
        `;
        document.head.appendChild(style);
    }, []);

    const cats = Array.from(new Set(products.map(p => p.category)));
    const filtered = products.filter(p => {
        const s = p.name.toLowerCase().includes(search.toLowerCase());
        const c = catFilter === 'all' || p.category === catFilter;
        return s && c;
    });

    const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
    const discountVal = (subtotal * discount) / 100;
    const itbisTotal = cart.reduce((a, i) => a + (i.price * i.qty * i.itbis / 100), 0);
    const total = (subtotal - discountVal) + itbisTotal;

    const addToCart = (p: typeof products[0]) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === p.id);
            if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { id: p.id, name: p.name, description: p.description, price: p.price, itbis: p.itbis, qty: 1, image: p.image }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter(i => i.qty > 0));
    };

    const handleNewProduct = () => {
        if (!newProdName || !newProdPrice) return;
        const p = {
            id: Math.random().toString(),
            code: "TMP-" + Math.floor(Math.random() * 1000),
            name: newProdName,
            description: "Producto de venta rápida",
            price: parseFloat(newProdPrice),
            itbis: 18,
            category: newProdCat,
            image: "/laptop_product_photo_1772472640429.png"
        };
        setProducts([p, ...products]);
        addToCart(p);
        setShowNewProductModal(false);
        setNewProdName("");
        setNewProdPrice("");
    };

    const handleNewClient = () => {
        if (!newClientName || !newClientRnc) return;
        const newClient = {
            id: Math.random().toString(),
            rnc: newClientRnc,
            name: newClientName,
            trade: "",
            type: "Nuevo Cliente",
            status: "Activo"
        };
        setClients([newClient, ...clients]);
        setSelectedClient(newClient);
        setShowNewClientModal(false);
        setNewClientName("");
        setNewClientRnc("");
        setNewClientEmail("");
    };

    const cashCountTotal = DENOMINATIONS.reduce((a, d) => a + (parseFloat(denomCounts[d] || '0') || 0) * d, 0);
    const shiftTotalSales = shiftSales.reduce((a, s) => a + s.total, 0);

    const buildShiftRecord = () => ({
        id: 'TRN-' + Date.now(),
        openTime: shiftOpenTime || '',
        closeTime: new Date().toLocaleTimeString('es-DO'),
        closeDate: new Date().toLocaleDateString('es-DO'),
        openingFloat: parseFloat(openingFloat || '0'),
        totalSales: shiftTotalSales,
        cashCountTotal,
        salesCount: shiftSales.length,
        sales: shiftSales,
        denomCounts: { ...denomCounts },
    });

    const saveShiftToHistory = (record: any) => {
        const raw = localStorage.getItem('pos_shift_history');
        const hist = raw ? JSON.parse(raw) : [];
        hist.unshift(record);
        localStorage.setItem('pos_shift_history', JSON.stringify(hist));
    };

    const exportShiftCSV = (rec: any) => {
        const rows = [
            ['Cierre de Turno'],
            ['ID Turno', rec.id],
            ['Fecha', rec.closeDate],
            ['Apertura', rec.openTime],
            ['Cierre', rec.closeTime],
            ['Monto apertura', rec.openingFloat],
            ['Total vendido', rec.totalSales],
            ['Total efectivo contado', rec.cashCountTotal],
            ['Núm. ventas', rec.salesCount],
            [],
            ['ID Venta', 'Método', 'Hora', 'Total'],
            ...rec.sales.map((s: any) => [s.id, s.method, s.time, s.total]),
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `cierre-${rec.id}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const exportShiftExcel = async (rec: any) => {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        // Summary sheet
        const summaryData = [
            ['Cierre de Turno', rec.id],
            ['Fecha', rec.closeDate],
            ['Apertura', rec.openTime],
            ['Cierre', rec.closeTime],
            ['Monto apertura', rec.openingFloat],
            ['Total vendido', rec.totalSales],
            ['Total efectivo contado', rec.cashCountTotal],
            ['Núm. ventas', rec.salesCount],
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');
        // Sales sheet
        const salesData = [['ID', 'Método', 'Hora', 'Total'], ...rec.sales.map((s: any) => [s.id, s.method, s.time, s.total])];
        const ws2 = XLSX.utils.aoa_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Ventas');
        XLSX.writeFile(wb, `cierre-${rec.id}.xlsx`);
    };

    const exportShiftPDF = (rec: any) => {
        const w = window.open('', '_blank')!;
        w.document.write(`
            <html><head><title>Cierre ${rec.id}</title>
            <style>body{font-family:Arial,sans-serif;padding:24px;font-size:13px}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}th{background:#f5f5f5}tfoot td{font-weight:bold}</style>
            </head><body>
            <h1>Cierre de Turno — ${rec.id}</h1>
            <p>Fecha: ${rec.closeDate} | Apertura: ${rec.openTime} | Cierre: ${rec.closeTime}</p>
            <table><tr><th>Concepto</th><th>Valor</th></tr>
            <tr><td>Monto apertura</td><td>RD$ ${rec.openingFloat.toFixed(2)}</td></tr>
            <tr><td>Total vendido</td><td>RD$ ${rec.totalSales.toFixed(2)}</td></tr>
            <tr><td>Efectivo contado</td><td>RD$ ${rec.cashCountTotal.toFixed(2)}</td></tr>
            <tr><td>Diferencia</td><td>RD$ ${(rec.cashCountTotal - rec.openingFloat - rec.totalSales).toFixed(2)}</td></tr>
            </table>
            <h3 style="margin-top:20px">Ventas del turno (${rec.salesCount})</h3>
            <table><thead><tr><th>ID</th><th>Método</th><th>Hora</th><th>Total</th></tr></thead>
            <tbody>${rec.sales.map((s: any) => `<tr><td>${s.id}</td><td>${s.method}</td><td>${s.time}</td><td>RD$ ${s.total.toFixed(2)}</td></tr>`).join('')}</tbody>
            <tfoot><tr><td colspan="3">Total</td><td>RD$ ${rec.totalSales.toFixed(2)}</td></tr></tfoot></table>
            </body></html>`);
        w.document.close();
        w.print();
    };

    const handleCloseShift = () => {
        const rec = buildShiftRecord();
        saveShiftToHistory(rec);
        setClosedRecord(rec);
        setShiftOpen(false);
        setShiftClosed(true);
        setShiftSales([]);
        setOpeningFloat('');
        setDenomCounts({});
    };

    const handleCompletePayment = () => {
        const inv = {
            id: Math.random().toString(36).substr(2, 6).toUpperCase(),
            ncf: ncfType === 'B01' ? 'B0100000001' : 'B0200000001',
            client: selectedClient?.name || "Consumidor final",
            total: total,
            date: new Date().toLocaleDateString('es-DO'),
            time: new Date().toLocaleTimeString('es-DO'),
            method: paymentMethod || 'efectivo'
        };
        setInvoiceCreated(inv);
        setCheckoutStep("success");
        // Record sale in shift
        if (shiftOpen) {
            setShiftSales(prev => [...prev, { id: inv.id, total: inv.total, method: inv.method, time: inv.time }]);
        }
    };

    const handlePrint = (mode: 'ticket' | 'invoice') => {
        setPrintMode(mode);
        setTimeout(() => window.print(), 100);
    };

    // Prevent hydration mismatch for currency formatting
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);
    };

    return (
        <>
            {/* ── Open Shift Modal ── */}
            {showOpenShiftModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowOpenShiftModal(false)}>
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-2 border-b">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Unlock className="w-5 h-5" /></div>
                                <div>
                                    <h2 className="font-bold text-lg">Abrir Turno</h2>
                                    <p className="text-xs text-muted-foreground">{new Date().toLocaleString('es-DO')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold">Monto de apertura (efectivo en caja)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">RD$</span>
                                    <Input value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} className="pl-10 h-11 text-lg font-bold" placeholder="0.00" type="number" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowOpenShiftModal(false)}>Cancelar</Button>
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => {
                                setShiftOpen(true);
                                setShiftOpenTime(new Date().toLocaleTimeString('es-DO'));
                                setShiftSales([]);
                                setDenomCounts({});
                                setShowOpenShiftModal(false);
                            }}>
                                <Unlock className="w-4 h-4" /> Abrir Turno
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Close Shift / Cuadre de Caja Modal ── */}
            {showCloseShiftModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCloseShiftModal(false)}>
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <div className="px-6 pt-6 pb-2 border-b sticky top-0 bg-background z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center"><Lock className="w-5 h-5" /></div>
                                    <div>
                                        <h2 className="font-bold text-lg">Cuadre de Caja</h2>
                                        <p className="text-xs text-muted-foreground">Turno abierto a las {shiftOpenTime}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCloseShiftModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-5">
                            {/* Sales summary */}
                            <div className="grid grid-cols-3 gap-3">
                                {[{ label: 'Ventas', value: shiftSales.length.toString() },
                                { label: 'Total vendido', value: `RD$ ${shiftSales.reduce((a, s) => a + s.total, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}` },
                                { label: 'Apertura', value: `RD$ ${parseFloat(openingFloat || '0').toLocaleString('es-DO', { minimumFractionDigits: 2 })}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-muted/40 rounded-xl p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
                                        <p className="font-bold text-sm mt-0.5">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Denomination count */}
                            <div>
                                <p className="text-sm font-bold mb-3">Conteo de efectivo en caja</p>
                                <div className="space-y-2">
                                    {DENOMINATIONS.map(d => (
                                        <div key={d} className="flex items-center gap-3">
                                            <span className="w-20 text-sm font-mono text-right text-muted-foreground">RD$ {d}</span>
                                            <Input
                                                type="number" min={0}
                                                value={denomCounts[d] || ""}
                                                onChange={e => setDenomCounts(prev => ({ ...prev, [d]: e.target.value }))}
                                                className="h-8 w-20 text-center font-mono"
                                                placeholder="0"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                = RD$ {((parseFloat(denomCounts[d] || '0') || 0) * d).toLocaleString('es-DO')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-3 pt-3 border-t font-bold text-base">
                                    <span>Total efectivo contado</span>
                                    <span className="text-emerald-600">
                                        RD$ {DENOMINATIONS.reduce((a, d) => a + (parseFloat(denomCounts[d] || '0') || 0) * d, 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Sales list */}
                            {shiftSales.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold mb-2">Ventas del turno</p>
                                    <div className="divide-y border rounded-xl overflow-hidden">
                                        {shiftSales.map(s => (
                                            <div key={s.id} className="flex items-center justify-between px-4 py-2 text-sm">
                                                <div>
                                                    <span className="font-mono font-bold text-xs">{s.id}</span>
                                                    <span className="text-muted-foreground ml-2 text-xs">{s.method} · {s.time}</span>
                                                </div>
                                                <span className="font-semibold">RD$ {s.total.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-6 pb-6 flex gap-3 border-t pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setShowCloseShiftModal(false)}>Cancelar</Button>
                            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2" onClick={handleCloseShift}>
                                <Lock className="w-4 h-4" /> Cerrar Turno
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Shift Closed — Export Modal ── */}
            {shiftClosed && closedRecord && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 pt-6 pb-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>
                            <h2 className="font-bold text-xl">Turno cerrado</h2>
                            <p className="text-sm text-muted-foreground mt-1">{closedRecord.closeDate} · {closedRecord.openTime} &rarr; {closedRecord.closeTime}</p>
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                {[{ label: 'Ventas', value: closedRecord.salesCount },
                                { label: 'Total vendido', value: `RD$ ${closedRecord.totalSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}` },
                                { label: 'Efectivo contado', value: `RD$ ${closedRecord.cashCountTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-muted/40 rounded-xl p-3">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{label}</p>
                                        <p className="font-bold text-sm mt-0.5">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 pb-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Exportar informe</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => window.print()}>
                                    <Printer className="w-4 h-4" /> Imprimir
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportShiftPDF(closedRecord)}>
                                    <FileDown className="w-4 h-4 text-red-500" /> PDF
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportShiftCSV(closedRecord)}>
                                    <FileDown className="w-4 h-4 text-blue-500" /> CSV
                                </Button>
                                <Button variant="outline" className="gap-2 text-sm" onClick={() => exportShiftExcel(closedRecord)}>
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
                                </Button>
                            </div>
                        </div>
                        <div className="px-6 pb-6 mt-4 flex flex-col gap-2">
                            <Button className="w-full" onClick={() => { setShiftClosed(false); setClosedRecord(null); setShowCloseShiftModal(false); }}>
                                Listo
                            </Button>
                            <Link href="/dashboard/pos/turnos" className="text-center text-xs text-primary hover:underline mt-1">
                                Ver historial de turnos →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-[calc(100vh-4rem)] gap-0 overflow-hidden -mx-6 -mt-6 bg-muted/20">
                {/* Left: Product Selection */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 bg-white/50 backdrop-blur-md border-b flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos"
                                className="pl-9 h-10 bg-white border-border/60 rounded-xl focus-visible:ring-primary font-medium"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Shift status pill */}
                        <button
                            onClick={() => shiftOpen ? setShowCloseShiftModal(true) : setShowOpenShiftModal(true)}
                            className={cn(
                                "flex items-center gap-2 h-10 px-4 rounded-xl font-bold text-xs border transition-all whitespace-nowrap",
                                shiftOpen
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            )}
                        >
                            {shiftOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            {shiftOpen ? 'Turno abierto' : 'Abrir turno'}
                        </button>
                        <Link href="/dashboard/pos/turnos">
                            <Button variant="outline" className="h-10 gap-1.5 text-xs font-bold">
                                <Clock3 className="w-4 h-4" /> Historial
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setShowNewProductModal(true)}
                            className="h-10 bg-gradient-brand text-white font-bold uppercase text-[10px] gap-2 hover:opacity-90 shadow-brand group rounded-xl"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Nuevo producto
                        </Button>
                    </div>

                    <div className="p-4 bg-white/30 backdrop-blur-sm border-b overflow-x-auto flex gap-2 scrollbar-none">
                        {['all', ...cats].map(cat => (
                            <button key={cat} onClick={() => setCatFilter(cat)} className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border whitespace-nowrap",
                                catFilter === cat ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-muted-foreground border-border/60 hover:border-primary/50"
                            )}>
                                {cat === 'all' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filtered.map(p => {
                                const inCart = cart.find(i => i.id === p.id);
                                return (
                                    <button key={p.id} onClick={() => addToCart(p)} className={cn(
                                        "text-left p-3 rounded-2xl transition-all hover:shadow-xl active:scale-95 group relative border hover:-translate-y-1 duration-300",
                                        inCart ? "border-primary ring-2 ring-primary/20 bg-white" : "bg-white hover:bg-white border-border/30 hover:border-primary/30 shadow-sm"
                                    )}>
                                        <div className="aspect-square relative mb-3 rounded-xl overflow-hidden border border-border/20 bg-muted/20">
                                            <Image
                                                src={p.image}
                                                alt={p.name}
                                                fill
                                                sizes="200px"
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <h3 className="text-xs font-bold text-foreground line-clamp-1 mb-0.5 leading-tight">{p.name}</h3>
                                        <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2 h-7 leading-tight">{p.description}</p>
                                        <p className="text-sm font-bold text-primary">{formatCurrency(p.price)}</p>
                                        {inCart && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-brand">
                                                {inCart.qty}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="w-[420px] border-l bg-white/80 backdrop-blur-xl flex flex-col shadow-2xl z-20">
                    {/* Header Section */}
                    <div className="p-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Factura de venta</h2>
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Zap className="w-3 h-3 text-primary fill-primary" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <button className="hover:text-primary transition-colors"><Percent className="w-5 h-5" /></button>
                            <button onClick={() => handlePrint('ticket')} className="hover:text-primary transition-colors"><Printer className="w-5 h-5" /></button>
                            <button onClick={() => setIsConfigOpen(true)} className="hover:text-primary transition-colors"><Sliders className="w-5 h-5" /></button>
                            <button onClick={() => setCart([])} className="hover:text-destructive transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Selectors Area */}
                    <div className="p-5 space-y-4 bg-white/40 border-b">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Lista de precio</Label>
                                <Select value={priceList} onValueChange={setPriceList}>
                                    <SelectTrigger className="h-10 bg-white border-border/60 rounded-xl text-xs font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Mayorista">Mayorista</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Numeración</Label>
                                <Select value={ncfType} onValueChange={setNcfType}>
                                    <SelectTrigger className="h-10 bg-white border-border/60 rounded-xl text-xs font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPOS_NCF.map(t => (
                                            <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            <div className="col-span-3 space-y-1.5 relative z-50">
                                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cliente</Label>
                                <div className="flex gap-2 relative">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder={selectedClient ? selectedClient.name : "Buscar o crear cliente..."}
                                            value={clientSearch}
                                            onChange={e => { setClientSearch(e.target.value); setShowClientDropdown(true); }}
                                            onFocus={() => setShowClientDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                                            className="pl-9 h-10 font-sans text-sm bg-white border-border/60 rounded-xl focus-visible:ring-primary shadow-sm"
                                        />
                                        {showClientDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border/50 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                                <button
                                                    className="w-full text-left px-4 py-3 hover:bg-primary/5 text-sm font-sans border-b border-border/30 flex items-center transition-colors"
                                                    onClick={() => { setSelectedClient(null); setClientSearch(""); setShowClientDropdown(false); }}
                                                >
                                                    <span className="font-medium text-foreground">Consumidor final</span>
                                                </button>
                                                {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.rnc.includes(clientSearch)).length > 0 ? (
                                                    clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.rnc.includes(clientSearch)).map(c => (
                                                        <button
                                                            key={c.id}
                                                            className="w-full text-left px-4 py-2.5 hover:bg-primary/5 border-b border-border/30 last:border-0 flex flex-col gap-0.5 transition-colors"
                                                            onClick={() => { setSelectedClient(c); setClientSearch(""); setShowClientDropdown(false); }}
                                                        >
                                                            <span className="font-medium text-sm text-foreground">{c.name}</span>
                                                            <span className="text-xs font-mono text-muted-foreground">RNC: {c.rnc}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                                                        No se encontraron clientes
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => setShowNewClientModal(true)}
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-xl bg-white shrink-0 hover:bg-primary/10 hover:text-primary transition-colors border-border/60 shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Vendedor</Label>
                                <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                                    <SelectTrigger className="h-10 bg-white border-border/60 rounded-xl text-xs font-bold text-primary">
                                        <SelectValue placeholder="Elegir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VENDEDORES.map(v => (
                                            <SelectItem key={v} value={v}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Items Area */}
                    <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground/40 p-8">
                                <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 opacity-30" />
                                </div>
                                <h3 className="text-sm font-bold text-muted-foreground/60 mb-2">Carrito vacío</h3>
                                <p className="text-[11px] font-bold leading-relaxed max-w-[200px] uppercase tracking-tighter">Selecciona productos del catálogo para iniciar una venta.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-2 duration-300 p-2 rounded-xl border border-transparent hover:border-border/40 hover:bg-white/50 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-muted/20 border border-border/20 relative shrink-0 overflow-hidden shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-foreground truncate mb-0.5">{item.name}</h4>
                                            <p className="text-[10px] text-muted-foreground truncate mb-1">{item.description}</p>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-muted/40 rounded-lg p-1">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <span className="text-xs font-bold text-foreground whitespace-nowrap">{formatCurrency(item.price * item.qty)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-6 border-t bg-muted/30 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                                <span className="flex items-center gap-1"><Tags className="w-3 h-3" /> Descuento %</span>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-right text-xs font-bold bg-white rounded-lg"
                                        value={discount}
                                        onChange={e => setDiscount(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                                    />
                                    <span>-{formatCurrency(discountVal)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                <span>ITBIS (18%)</span>
                                <span>{formatCurrency(itbisTotal)}</span>
                            </div>
                            <Separator className="bg-border/60" />
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-sm font-bold text-foreground">Total general</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setCheckoutStep("methods");
                                setPaymentMethod(null);
                                setAmountPaid(total.toString());
                                setShowPayModal(true);
                            }}
                            disabled={cart.length === 0}
                            className="w-full h-14 bg-gradient-brand hover:opacity-90 text-white font-bold text-sm flex justify-between px-8 rounded-2xl transition-all active:scale-95 shadow-brand shadow-primary/20"
                        >
                            <span>Completar Venta</span>
                            <ShoppingCart className="w-5 h-5 ml-2" />
                        </Button>
                        <div className="flex items-center justify-between text-[11px] px-2 font-bold uppercase tracking-wider text-muted-foreground/60">
                            <span>{cart.length} Artículos</span>
                            <button onClick={() => setCart([])} className="hover:text-destructive transition-colors">Cancelar venta</button>
                        </div>
                    </div>
                </div>

                {/* ── New Product Modal ────────────────────────────────────────────── */}
                <Dialog open={showNewProductModal} onOpenChange={setShowNewProductModal}>
                    <DialogContent className="sm:max-w-[450px] p-0 font-sans overflow-hidden border-none rounded-3xl shadow-3xl glass backdrop-blur-2xl">
                        <div className="p-6 bg-white/60 border-b border-border/40 flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">Nuevo producto rápido</DialogTitle>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre del producto</Label>
                                <Input
                                    placeholder="Ej: Pizza Personal"
                                    className="h-12 text-sm font-bold bg-white border-border/60 rounded-xl"
                                    value={newProdName}
                                    onChange={e => setNewProdName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Precio (RD$)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="h-12 text-sm font-bold bg-white border-border/60 rounded-xl"
                                        value={newProdPrice}
                                        onChange={e => setNewProdPrice(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoría</Label>
                                    <Select value={newProdCat} onValueChange={setNewProdCat}>
                                        <SelectTrigger className="h-12 bg-white border-border/60 rounded-xl text-sm font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hardware">Hardware</SelectItem>
                                            <SelectItem value="Servicio">Servicio</SelectItem>
                                            <SelectItem value="Software">Software</SelectItem>
                                            <SelectItem value="Otros">Otros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border/40 flex gap-3">
                            <Button variant="ghost" className="flex-1 h-12 font-bold text-xs uppercase text-muted-foreground" onClick={() => setShowNewProductModal(false)}>Descartar</Button>
                            <Button
                                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase rounded-xl shadow-brand"
                                onClick={handleNewProduct}
                            >
                                Añadir a la venta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── New Client Modal ────────────────────────────────────────────── */}
                <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
                    <DialogContent className="sm:max-w-[450px] p-0 font-sans overflow-hidden border-none rounded-3xl shadow-3xl glass backdrop-blur-2xl">
                        <div className="p-6 bg-white/80 border-b border-border/40 flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">Crear Nuevo Cliente</DialogTitle>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre / Razón Social</Label>
                                <Input
                                    placeholder="Ej: Juan Perez"
                                    className="h-12 text-sm font-medium bg-white border-border/60 rounded-xl focus-visible:ring-primary shadow-sm"
                                    value={newClientName}
                                    onChange={e => setNewClientName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cédula o RNC</Label>
                                    <Input
                                        placeholder="402XXXXXXX"
                                        className="h-12 font-mono text-sm bg-white border-border/60 rounded-xl focus-visible:ring-primary shadow-sm"
                                        value={newClientRnc}
                                        onChange={e => setNewClientRnc(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email (Opcional)</Label>
                                    <Input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        className="h-12 text-sm bg-white border-border/60 rounded-xl focus-visible:ring-primary shadow-sm"
                                        value={newClientEmail}
                                        onChange={e => setNewClientEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border/40 flex gap-3">
                            <Button variant="ghost" className="flex-1 h-12 font-bold text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground rounded-xl" onClick={() => setShowNewClientModal(false)}>Cancelar</Button>
                            <Button
                                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-brand"
                                onClick={handleNewClient}
                            >
                                Guardar Cliente
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── Payment Modal ────────────────────────────────────────────── */}
                <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
                    <DialogContent className="sm:max-w-[700px] p-0 font-sans overflow-hidden border-none rounded-3xl shadow-3xl glass backdrop-blur-3xl">
                        <div className="p-6 bg-white/60 border-b border-border/40 flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                                {checkoutStep === 'success' ? 'Venta exitosa' : 'Pagar factura'}
                            </DialogTitle>
                        </div>

                        <div className="bg-muted/10 min-h-[450px]">
                            {checkoutStep === 'methods' && (
                                <div className="p-10 space-y-10 text-center animate-in fade-in zoom-in-95 duration-500">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Total a pagar</span>
                                        <h2 className="text-5xl font-bold text-primary tracking-tight">{formatCurrency(total)}</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-5">
                                        {[
                                            { id: 'efectivo', label: 'Efectivo', icon: DollarSign },
                                            { id: 'tarjeta-credito', label: 'Tarjeta de crédito', icon: CreditCard },
                                            { id: 'transferencia', label: 'Transferencia', icon: RefreshCw },
                                            { id: 'tarjeta-debito', label: 'Tarjeta débito', icon: CreditCard },
                                            { id: 'combinado', label: 'Combinado', icon: DollarSign },
                                            { id: 'otros', label: 'Otros métodos', icon: Settings },
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    setPaymentMethod(m.id);
                                                    setAmountPaid(total.toString());
                                                    setCheckoutStep("detail");
                                                }}
                                                className="bg-white/60 border border-border/40 hover:border-primary hover:bg-white p-6 rounded-3xl flex flex-col items-center gap-4 transition-all group active:scale-95 shadow-sm hover:shadow-xl"
                                            >
                                                <div className="w-14 h-14 rounded-2xl border border-border/20 bg-muted/30 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all text-muted-foreground/60 shadow-inner">
                                                    <m.icon className="w-7 h-7" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex justify-center">
                                        <button onClick={() => setShowPayModal(false)} className="text-[11px] font-bold uppercase text-muted-foreground/60 hover:text-foreground tracking-wider border-b border-transparent hover:border-foreground transition-all">Cancelar transacción</button>
                                    </div>
                                </div>
                            )}

                            {checkoutStep === 'detail' && (
                                <div className="p-10 space-y-8 animate-in slide-in-from-right-10 duration-500">
                                    <div className="flex items-center justify-between bg-white/80 p-6 rounded-2xl border border-border/40 shadow-sm">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Saldo pendiente</span>
                                            <h3 className="text-3xl font-bold text-foreground">{formatCurrency(total)}</h3>
                                        </div>
                                        <button onClick={() => setCheckoutStep("methods")} className="text-xs font-bold text-primary flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/20">
                                            <RefreshCw className="w-4 h-4" /> Cambiar método
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            {paymentMethod === 'combinado' ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Método</Label>
                                                            <Select value={splitMethod} onValueChange={setSplitMethod}>
                                                                <SelectTrigger className="h-12 border-border/60 rounded-xl font-bold bg-white">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Monto</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={splitAmount}
                                                                    onChange={e => setSplitAmount(e.target.value)}
                                                                    className="h-12 text-lg font-bold border-border/60 rounded-xl focus:ring-primary shadow-inner bg-white"
                                                                />
                                                                <Button onClick={() => {
                                                                    const amt = parseFloat(splitAmount);
                                                                    if (amt > 0) {
                                                                        setSplitPayments([...splitPayments, { method: splitMethod, amount: amt }]);
                                                                        setSplitAmount("");
                                                                    }
                                                                }} className="h-12 w-12 p-0 bg-primary rounded-xl shadow-brand text-white">
                                                                    <Plus className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                                                        {splitPayments.map((sp, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-border/40 rounded-xl shadow-sm">
                                                                <span className="text-xs font-bold uppercase text-muted-foreground">{sp.method}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-bold text-foreground text-sm">{formatCurrency(sp.amount)}</span>
                                                                    <button onClick={() => setSplitPayments(splitPayments.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {splitPayments.length > 0 && (
                                                            <div className="flex justify-between items-center p-3 mt-2 bg-primary/5 rounded-xl border border-primary/20">
                                                                <span className="text-xs font-bold uppercase text-primary">Restante</span>
                                                                <span className="font-bold text-primary">{formatCurrency(Math.max(0, total - splitPayments.reduce((a, b) => a + b.amount, 0)))}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                            {paymentMethod === 'efectivo' ? 'Valor entregado' : 'Valor del pago'}
                                                        </Label>
                                                        <Input
                                                            autoFocus
                                                            type="number"
                                                            value={amountPaid}
                                                            onChange={e => setAmountPaid(e.target.value)}
                                                            className="h-14 text-2xl font-bold border-border/60 rounded-2xl focus:ring-primary shadow-inner bg-white"
                                                        />
                                                    </div>

                                                    {paymentMethod === 'efectivo' && (
                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider opacity-60">Acceso rápido</Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {[Math.ceil(total), 100, 200, 500, 1000, 2000].map(val => (
                                                                    <button
                                                                        key={val}
                                                                        onClick={() => setAmountPaid(val.toString())}
                                                                        className="px-4 py-2 border border-border/40 bg-white rounded-xl text-[11px] font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                                                                    >
                                                                        RD${val.toLocaleString()}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vendedor asignado</Label>
                                                <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                                                    <SelectTrigger className="h-14 border-border/60 rounded-2xl font-bold bg-white">
                                                        <SelectValue placeholder="Seleccionar..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {VENDEDORES.map(v => (
                                                            <SelectItem key={v} value={v}>{v}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Observación</Label>
                                                <textarea
                                                    className="w-full h-24 bg-white border border-border/60 rounded-2xl p-4 text-sm font-medium focus:ring-primary outline-none resize-none shadow-sm"
                                                    placeholder="..."
                                                    value={observations}
                                                    onChange={e => setObservations(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-border/40">
                                        <div className="space-y-1">
                                            {paymentMethod === 'efectivo' && parseFloat(amountPaid) > total && (
                                                <>
                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Cambio a devolver</p>
                                                    <p className="text-2xl font-bold text-emerald-500">{formatCurrency(parseFloat(amountPaid) - total)}</p>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <Button variant="ghost" onClick={() => setShowPayModal(false)} className="h-14 px-8 font-bold text-muted-foreground uppercase text-xs tracking-wider">Cancelar</Button>
                                            <Button
                                                onClick={handleCompletePayment}
                                                disabled={paymentMethod === 'combinado' && splitPayments.reduce((a, b) => a + b.amount, 0) < total}
                                                className="h-14 px-12 bg-primary hover:opacity-90 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-brand shadow-primary/30 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                                Procesar Pago
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {checkoutStep === 'success' && (
                                <div className="p-16 text-center space-y-10 animate-in zoom-in-95 duration-500">
                                    <div className="w-28 h-28 bg-gradient-brand rounded-[40px] flex items-center justify-center mx-auto text-white shadow-brand shadow-primary/40 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                        <Check className="w-14 h-14 relative z-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight">¡Pago confirmado!</h3>
                                        <p className="text-muted-foreground text-sm font-bold bg-muted/30 py-1 px-4 rounded-full inline-block">Factura #{invoiceCreated.id}</p>
                                    </div>
                                    <div className="bg-white/80 border border-border/40 rounded-3xl p-8 flex justify-between items-center text-sm font-bold shadow-xl border-l-4 border-l-primary">
                                        <span className="text-muted-foreground uppercase tracking-wider">Monto recibido:</span>
                                        <span className="text-3xl font-bold text-primary tracking-tighter">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button onClick={() => handlePrint('ticket')} variant="outline" className="flex-1 h-14 border-2 font-bold gap-2 hover:bg-white transition-all rounded-2xl shadow-sm text-xs uppercase tracking-wider text-primary border-primary/20">
                                            <Printer className="w-5 h-5" /> Ticket 80mm
                                        </Button>
                                        <Button onClick={() => handlePrint('invoice')} variant="outline" className="flex-1 h-14 border-2 font-bold gap-2 hover:bg-white transition-all rounded-2xl shadow-sm text-xs uppercase tracking-wider text-primary border-primary/20">
                                            <Printer className="w-5 h-5" /> Factura A4
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setCart([]);
                                                setShowPayModal(false);
                                                setInvoiceCreated(null);
                                            }}
                                            className="col-span-2 h-14 bg-primary hover:opacity-90 text-white font-bold rounded-2xl shadow-brand shadow-primary/20 text-xs uppercase tracking-wider"
                                        >
                                            Nueva Venta
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Config Modal */}
                <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-3xl shadow-3xl glass">
                        <div className="p-6 bg-white/60 border-b border-border/40 flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                                Configuración de POS
                            </DialogTitle>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-start gap-5">
                                <Zap className="w-6 h-6 text-primary fill-primary mt-1 shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-foreground tracking-tight uppercase tracking-wider">Modo Venta rápida</h4>
                                        <input type="checkbox" className="w-8 h-4 rounded-full accent-primary" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                        Las facturas se cobrarán automáticamente con el método predefinido al ser creadas. <span className="text-primary font-bold hover:underline cursor-pointer">Detalles</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Método de pago por defecto</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-white border-border/60 rounded-xl font-bold">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vendedor predeterminado</Label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-white border-border/60 rounded-xl font-bold">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/20 border-t border-border/40 flex gap-4">
                            <Button variant="ghost" className="flex-1 h-12 font-bold text-xs uppercase text-muted-foreground" onClick={() => setIsConfigOpen(false)}>Descartar</Button>
                            <Button className="flex-1 h-12 bg-primary hover:opacity-90 text-white font-bold text-xs uppercase rounded-xl shadow-brand" onClick={() => setIsConfigOpen(false)}>Actualizar</Button>
                        </div>
                    </DialogContent>
                </Dialog>


                {/* ── Hidden Print Ticket (Thermal 80mm) ────────────────────────── */}
                <div id="print-ticket" className="hidden print:block bg-white p-6 w-[80mm] mx-auto text-black font-mono text-[12px] leading-tight">
                    <div className="text-center space-y-2 mb-6">
                        <h1 className="text-lg font-bold uppercase tracking-tighter">Lollipop Commercial</h1>
                        <p className="font-bold">RNC: 1-30-00000-1</p>
                        <p>Av. Winston Churchill #123</p>
                        <p>Santo Domingo, R.D.</p>
                        <p>Tel: (809) 555-5555</p>
                    </div>

                    <div className="border-y border-dashed py-3 mb-4 space-y-1">
                        <p className="flex justify-between"><span>FACTURA:</span> <span className="font-bold">#{invoiceCreated?.id || 'PRO-FORMA'}</span></p>
                        <p className="flex justify-between"><span>NCF:</span> <span className="font-bold">{ncfType === 'B01' ? 'B0100000001' : 'B0200000001'}</span></p>
                        <p className="flex justify-between"><span>FECHA:</span> <span>{new Date().toLocaleDateString('es-DO')} {new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}</span></p>
                        <p className="flex justify-between"><span>CLIENTE:</span> <span className="uppercase">{selectedClient?.name || 'CONSUMIDOR FINAL'}</span></p>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between font-bold border-b border-black pb-1 mb-2">
                            <span>Cant / Item</span>
                            <span>Total</span>
                        </div>
                        {cart.map(item => (
                            <div key={item.id} className="mb-2">
                                <p className="font-bold uppercase">{item.name}</p>
                                <div className="flex justify-between text-[11px]">
                                    <span>{item.qty} x {formatCurrency(item.price).replace('RD$', '')}</span>
                                    <span>{formatCurrency(item.price * item.qty).replace('RD$', '')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-black pt-3 space-y-1 uppercase font-bold text-[11px]">
                        <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(subtotal).replace('RD$', '')}</span></div>
                        {discount > 0 && <div className="flex justify-between"><span>Desc {discount}%:</span> <span>-{formatCurrency(discountVal).replace('RD$', '')}</span></div>}
                        <div className="flex justify-between"><span>ITBIS:</span> <span>{formatCurrency(itbisTotal).replace('RD$', '')}</span></div>
                        <div className="flex justify-between text-[14px] font-bold border-t border-black mt-2 pt-2">
                            <span>TOTAL:</span>
                            <span>RD$ {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-10 text-center space-y-4">
                        <p className="text-[10px] font-bold">¡GRACIAS POR SU COMPRA!</p>
                        <div className="flex justify-center grayscale opacity-10">
                            <Zap className="w-12 h-12" />
                        </div>
                        <p className="text-[9px] uppercase tracking-wider opacity-30">Powered by Lollipop</p>
                    </div>
                    {/* ── Hidden Print Invoice (Letter 8.5x11) ────────────────────────── */}
                    <div id="print-invoice" className="hidden print:block absolute top-0 left-0 w-[8.5in] bg-white">
                        {invoiceCreated && (() => {
                            const ActiveTemplate = INVOICE_TEMPLATES[globalTemplateId as keyof typeof INVOICE_TEMPLATES] || InvoiceStandard;
                            return (
                                <ActiveTemplate data={{
                                    color: { primary: globalColor },
                                    company: {
                                        name: "Lollipop Commercial",
                                        rnc: "1-30-00000-1",
                                        phone: "(809) 555-5555",
                                        email: "facturacion@lollipop.do",
                                        address: "Av. Winston Churchill #123, Santo Domingo, R.D.",
                                    },
                                    client: {
                                        name: selectedClient?.name || "Consumidor final",
                                        address: "",
                                        rnc: selectedClient?.rnc || "",
                                    },
                                    document: {
                                        type: ncfType === 'B01' ? "Factura de Crédito Fiscal" : "Factura de Consumo",
                                        number: invoiceCreated.id || "PRO-FORMA",
                                        date: invoiceCreated.date || "",
                                        ncf: invoiceCreated.ncf || "",
                                        seller: selectedVendedor || "Vendedor",
                                    },
                                    items: cart.map(i => ({
                                        id: i.id,
                                        description: i.name,
                                        qty: i.qty,
                                        price: i.price,
                                        discount: 0,
                                        tax: i.price * i.qty * (i.itbis / 100),
                                        total: i.qty * i.price
                                    })),
                                    totals: {
                                        subtotal: subtotal,
                                        discount: discountVal,
                                        tax: itbisTotal,
                                        total: total
                                    },
                                    payments: [{
                                        date: invoiceCreated?.date || "",
                                        method: paymentMethod || "Efectivo",
                                        amount: parseFloat(amountPaid) || total
                                    }]
                                }} />
                            );
                        })()}
                    </div>
                </div>
            </div>
            );
        </>
    );
}
