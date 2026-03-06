"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    FileText, Users, Package, ShoppingCart, Truck, Settings,
    User, BookOpen, Store, PieChart, Search, ArrowRight,
    Building2, Plus, Receipt, CreditCard,
} from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useCompany } from "@/contexts/CompanyContext";
import { formatCurrency } from "@/lib/utils";

// ── helpers ──────────────────────────────────────────────────────────────────
function loadKey<T>(companyId: string, key: string): T[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(`company_${companyId}_${key}`) ?? "[]") as T[];
    } catch { return []; }
}

function badge(str: string) {
    return str?.toLowerCase();
}

function matches(query: string, ...fields: (string | undefined | null)[]) {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return fields.some(f => f && f.toLowerCase().includes(q));
}

// ── quick actions (static) ────────────────────────────────────────────────────
const QUICK_ACTIONS = [
    { icon: FileText, label: "Nueva Factura", href: "/dashboard/invoices/new", color: "text-blue-500", shortcut: "⌘N" },
    { icon: FileText, label: "Nueva Cotización", href: "/dashboard/ingresos/cotizaciones/new", color: "text-sky-500" },
    { icon: Users, label: "Nuevo Cliente", href: "/dashboard/clients/new", color: "text-emerald-500" },
    { icon: Package, label: "Nuevo Producto", href: "/dashboard/products/new", color: "text-violet-500" },
    { icon: ShoppingCart, label: "Registrar Gasto", href: "/dashboard/gastos/new", color: "text-rose-500" },
    { icon: Truck, label: "Nuevo Conduce", href: "/dashboard/ingresos/conduces", color: "text-indigo-500" },
];

const NAV_LINKS = [
    { icon: FileText, label: "Facturas de Venta", href: "/dashboard/invoices", color: "text-blue-400" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients", color: "text-emerald-400" },
    { icon: Truck, label: "Proveedores", href: "/dashboard/suppliers", color: "text-orange-400" },
    { icon: Package, label: "Productos y Servicios", href: "/dashboard/products", color: "text-violet-400" },
    { icon: ShoppingCart, label: "Gastos / Pagos", href: "/dashboard/gastos", color: "text-rose-400" },
    { icon: Store, label: "Punto de Venta (POS)", href: "/dashboard/pos", color: "text-amber-400" },
    { icon: PieChart, label: "Reportes", href: "/dashboard/reportes", color: "text-pink-400" },
    { icon: BookOpen, label: "Contabilidad", href: "/dashboard/contabilidad", color: "text-teal-400" },
    { icon: CreditCard, label: "Bancos y Cajas", href: "/dashboard/bancos", color: "text-cyan-400" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings", color: "text-slate-400" },
];

// ── types ─────────────────────────────────────────────────────────────────────
interface SearchResult {
    type: "invoice" | "client" | "supplier" | "product" | "expense";
    id: string;
    title: string;
    subtitle: string;
    href: string;
    badge?: string;
    badgeColor?: string;
}

// ── main component ────────────────────────────────────────────────────────────
export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const { activeCompany } = useCompany();

    // ── keyboard shortcut ⌘K / Ctrl+K ──────────────────────────────────────
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Reset query when closed
    useEffect(() => { if (!open) setTimeout(() => setQuery(""), 200); }, [open]);

    // ── load data from localStorage ─────────────────────────────────────────
    const cid = activeCompany?.id ?? "";

    const results = useMemo<SearchResult[]>(() => {
        if (!query.trim() || !cid) return [];

        const out: SearchResult[] = [];

        // ── Invoices ──
        const invoices: any[] = loadKey(cid, "invoice_emitted");
        for (const inv of invoices) {
            if (matches(query, inv.id, inv.ecf, inv.cliente, inv.rnc, inv.vendedor, inv.tipoName)) {
                const isPaid = inv.paymentStatus === "pagada";
                out.push({
                    type: "invoice",
                    id: inv.id,
                    title: `${inv.id} — ${inv.cliente}`,
                    subtitle: `${inv.ecf ?? inv.id} · ${inv.date} · ${formatCurrency(inv.total)}`,
                    href: `/dashboard/invoices/${inv.id}`,
                    badge: isPaid ? "Pagada" : "Pendiente",
                    badgeColor: isPaid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                });
            }
        }

        // ── Clients ──
        const clients: any[] = loadKey(cid, "clientes");
        for (const cli of clients) {
            if (matches(query, cli.id, cli.nombre, cli.rnc, cli.email, cli.telefono, cli.tipo)) {
                out.push({
                    type: "client",
                    id: cli.id,
                    title: cli.nombre,
                    subtitle: `${cli.id} · RNC: ${cli.rnc || "—"} · ${cli.tipo}`,
                    href: `/dashboard/clients`,
                    badge: cli.tipo,
                    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                });
            }
        }

        // ── Suppliers / Proveedores (from expenses) ──
        const suppliers: any[] = loadKey(cid, "proveedores");
        for (const sup of suppliers) {
            if (matches(query, sup.id, sup.nombre, sup.rnc, sup.email)) {
                out.push({
                    type: "supplier",
                    id: sup.id,
                    title: sup.nombre,
                    subtitle: `${sup.id} · RNC: ${sup.rnc || "—"}`,
                    href: `/dashboard/suppliers`,
                    badge: "Proveedor",
                    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                });
            }
        }

        // ── Products ──
        const products: any[] = loadKey(cid, "productos");
        for (const prd of products) {
            if (matches(query, prd.id, prd.nombre, prd.ref, prd.categoria)) {
                out.push({
                    type: "product",
                    id: prd.id,
                    title: prd.nombre,
                    subtitle: `${prd.ref} · ${prd.categoria} · ${formatCurrency(prd.precio)}`,
                    href: `/dashboard/products`,
                    badge: prd.categoria,
                    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                });
            }
        }

        // ── Expenses (gastos) ──
        const gastos: any[] = loadKey(cid, "gastos");
        for (const gasto of gastos) {
            if (matches(query, gasto.id, gasto.proveedor, gasto.descripcion, gasto.ncf, gasto.categoria)) {
                const isPaid = gasto.status === "pagado";
                out.push({
                    type: "expense",
                    id: gasto.id,
                    title: `${gasto.id} — ${gasto.proveedor}`,
                    subtitle: `${gasto.descripcion} · ${gasto.fecha} · ${formatCurrency(gasto.monto)}`,
                    href: `/dashboard/gastos`,
                    badge: isPaid ? "Pagado" : "Pendiente",
                    badgeColor: isPaid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                });
            }
        }

        return out.slice(0, 30); // cap at 30 results
    }, [query, cid]);

    // group results by type
    const invoices = results.filter(r => r.type === "invoice");
    const clients = results.filter(r => r.type === "client");
    const suppliers = results.filter(r => r.type === "supplier");
    const products = results.filter(r => r.type === "product");
    const expenses = results.filter(r => r.type === "expense");

    const ICON_MAP: Record<SearchResult["type"], any> = {
        invoice: FileText,
        client: Users,
        supplier: Truck,
        product: Package,
        expense: Receipt,
    };
    const COLOR_MAP: Record<SearchResult["type"], string> = {
        invoice: "text-blue-500",
        client: "text-emerald-500",
        supplier: "text-orange-500",
        product: "text-violet-500",
        expense: "text-rose-500",
    };

    const runCommand = (href: string) => {
        setOpen(false);
        router.push(href);
    };

    const showStatic = !query.trim();
    const hasResults = results.length > 0;

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-2 px-3 pt-1 border-b border-blue-100/40 dark:border-blue-900/20">
                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                <CommandInput
                    placeholder="Buscar facturas, clientes, productos, gastos..."
                    value={query}
                    onValueChange={setQuery}
                    className="border-0 shadow-none focus-visible:ring-0 pl-0"
                />
            </div>
            <CommandList className="max-h-[500px]">
                {/* ── Empty state ── */}
                {!showStatic && !hasResults && (
                    <CommandEmpty>
                        <div className="flex flex-col items-center py-8 text-center">
                            <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
                            <p className="text-sm font-medium text-muted-foreground">No se encontraron resultados</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Busca por nombre, ID, RNC, e-CF o descripción</p>
                        </div>
                    </CommandEmpty>
                )}

                {/* ── LIVE SEARCH RESULTS ── */}
                {!showStatic && hasResults && (
                    <>
                        {invoices.length > 0 && (
                            <CommandGroup heading={`Facturas (${invoices.length})`}>
                                {invoices.map(r => (
                                    <ResultItem key={r.id} result={r} Icon={ICON_MAP[r.type]} color={COLOR_MAP[r.type]} onSelect={() => runCommand(r.href)} />
                                ))}
                            </CommandGroup>
                        )}
                        {clients.length > 0 && (
                            <CommandGroup heading={`Clientes (${clients.length})`}>
                                {clients.map(r => (
                                    <ResultItem key={r.id} result={r} Icon={ICON_MAP[r.type]} color={COLOR_MAP[r.type]} onSelect={() => runCommand(r.href)} />
                                ))}
                            </CommandGroup>
                        )}
                        {suppliers.length > 0 && (
                            <CommandGroup heading={`Proveedores (${suppliers.length})`}>
                                {suppliers.map(r => (
                                    <ResultItem key={r.id} result={r} Icon={ICON_MAP[r.type]} color={COLOR_MAP[r.type]} onSelect={() => runCommand(r.href)} />
                                ))}
                            </CommandGroup>
                        )}
                        {products.length > 0 && (
                            <CommandGroup heading={`Productos (${products.length})`}>
                                {products.map(r => (
                                    <ResultItem key={r.id} result={r} Icon={ICON_MAP[r.type]} color={COLOR_MAP[r.type]} onSelect={() => runCommand(r.href)} />
                                ))}
                            </CommandGroup>
                        )}
                        {expenses.length > 0 && (
                            <CommandGroup heading={`Gastos (${expenses.length})`}>
                                {expenses.map(r => (
                                    <ResultItem key={r.id} result={r} Icon={ICON_MAP[r.type]} color={COLOR_MAP[r.type]} onSelect={() => runCommand(r.href)} />
                                ))}
                            </CommandGroup>
                        )}
                    </>
                )}

                {/* ── STATIC: Quick actions + navigation ── */}
                {showStatic && (
                    <>
                        <CommandGroup heading="Acciones Rápidas">
                            {QUICK_ACTIONS.map(a => (
                                <CommandItem key={a.href} onSelect={() => runCommand(a.href)} className="gap-2.5">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-muted`}>
                                        <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                                    </div>
                                    <span className="font-medium text-sm flex-1">{a.label}</span>
                                    {a.shortcut && <CommandShortcut>{a.shortcut}</CommandShortcut>}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Ir a...">
                            {NAV_LINKS.map(n => (
                                <CommandItem key={n.href} onSelect={() => runCommand(n.href)} className="gap-2.5">
                                    <n.icon className={`w-4 h-4 shrink-0 ${n.color}`} />
                                    <span className="text-sm flex-1">{n.label}</span>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}
            </CommandList>

            <div className="border-t border-blue-100/40 dark:border-blue-900/20 px-3 py-2 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">↑↓</kbd> navegar</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">↵</kbd> abrir</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Esc</kbd> cerrar</span>
                <span className="ml-auto">Busca por nombre, ID, RNC o e-CF</span>
            </div>
        </CommandDialog>
    );
}

// ── Result item sub-component ─────────────────────────────────────────────────
function ResultItem({
    result,
    Icon,
    color,
    onSelect,
}: {
    result: SearchResult;
    Icon: any;
    color: string;
    onSelect: () => void;
}) {
    return (
        <CommandItem onSelect={onSelect} className="gap-2.5 py-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-muted">
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">{result.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{result.subtitle}</p>
            </div>
            {result.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${result.badgeColor}`}>
                    {result.badge}
                </span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
        </CommandItem>
    );
}
