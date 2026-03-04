"use client";
// APP NAME: Lollipop
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, ChevronDown, Settings, Bell, Search, Menu, HelpCircle,
    TrendingUp, ShoppingCart, Package, Building2, Calculator, PieChart,
    Receipt, FileText, Users, CreditCard, Landmark, BookOpen, Tag,
    Warehouse, Star, SlidersHorizontal, List, RefreshCw, ClipboardList,
    ArrowDownLeft, ArrowUpRight, Repeat, MessageSquare, Truck, BarChart3,
    BookMarked, Boxes, PlusSquare, CheckSquare, ArrowLeftRight,
    UserCircle2, Wrench, Bell as BellIcon, Globe, Link as LinkIcon,
    DollarSign, Store, Users2, UserCheck, Flame,
    LogOut, User, KeyRound, LifeBuoy, ChevronsUpDown, BadgeCheck, Building, Plus, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────
//  NAV STRUCTURE
// ──────────────────────────────────────────
type NavItem = {
    icon: any;
    label: string;
    href?: string;
    badge?: string;
    badgeColor?: string;
    children?: { icon: any; label: string; href: string }[];
};

const NAV: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
        icon: TrendingUp, label: "Ingresos",
        children: [
            { icon: FileText, label: "Facturas de Venta", href: "/dashboard/invoices" },
            { icon: Repeat, label: "Facturas Recurrentes", href: "/dashboard/invoices/recurrentes" },
            { icon: DollarSign, label: "Pagos Recibidos", href: "/dashboard/ingresos/pagos" },
            { icon: ArrowDownLeft, label: "Notas de Crédito", href: "/dashboard/invoices/notas" },
            { icon: ClipboardList, label: "Cotizaciones", href: "/dashboard/ingresos/cotizaciones" },
            { icon: Truck, label: "Conduces", href: "/dashboard/ingresos/conduces" },
        ],
    },
    {
        icon: Receipt, label: "Gastos",
        children: [
            { icon: FileText, label: "Facturas de Proveedores", href: "/dashboard/gastos/proveedores" },
            { icon: ShoppingCart, label: "Pagos / Gastos", href: "/dashboard/gastos" },
            { icon: DollarSign, label: "Gastos Menores", href: "/dashboard/gastos/menores" },
            { icon: Repeat, label: "Pagos Recurrentes", href: "/dashboard/gastos/recurrentes" },
            { icon: ArrowUpRight, label: "Notas de Crédito Compras", href: "/dashboard/gastos/nc" },
            { icon: ClipboardList, label: "Órdenes de Compra", href: "/dashboard/gastos/ordenes" },
            { icon: CheckSquare, label: "Recepción de Comprobantes", href: "/dashboard/gastos/recepcion" },
        ],
    },
    {
        icon: Package, label: "Productos",
        children: [
            { icon: Star, label: "Productos y Servicios", href: "/dashboard/products" },
            { icon: BarChart3, label: "Valor de Inventario", href: "/dashboard/productos/inventario" },
            { icon: SlidersHorizontal, label: "Ajustes de Inventario", href: "/dashboard/productos/ajustes" },
            { icon: Wrench, label: "Gestión de Productos", href: "/dashboard/productos/gestion" },
            { icon: Tag, label: "Listas de Precios", href: "/dashboard/productos/precios" },
            { icon: Warehouse, label: "Almacenes", href: "/dashboard/productos/almacenes" },
            { icon: ArrowLeftRight, label: "Transferencias", href: "/dashboard/productos/transferencias" },
            { icon: List, label: "Categorías", href: "/dashboard/productos/categorias" },
            { icon: SlidersHorizontal, label: "Atributos", href: "/dashboard/productos/atributos" },
        ],
    },
    {
        icon: Landmark, label: "Bancos y Cajas",
        children: [
            { icon: CreditCard, label: "Cuentas Bancarias", href: "/dashboard/bancos" },
            { icon: RefreshCw, label: "Conciliaciones", href: "/dashboard/bancos/conciliacion" },
        ],
    },
    {
        icon: Calculator, label: "Contabilidad",
        children: [
            { icon: BookOpen, label: "Catálogo de Cuentas", href: "/dashboard/contabilidad/catalogo" },
            { icon: PlusSquare, label: "Entrada de Diario", href: "/dashboard/contabilidad/diario" },
            { icon: Boxes, label: "Activos", href: "/dashboard/contabilidad/activos" },
            { icon: BookMarked, label: "Libro Diario", href: "/dashboard/contabilidad" },
        ],
    },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: Truck, label: "Proveedores", href: "/dashboard/suppliers" },
    { icon: Users2, label: "Nómina", href: "/dashboard/nomina" },
    { icon: Store, label: "POS", href: "/dashboard/pos", badge: "Nuevo" },
    { icon: PieChart, label: "Reportes", href: "/dashboard/reportes" },
    { icon: HelpCircle, label: "Ayuda", href: "/dashboard/ayuda" },
    {
        icon: Settings, label: "Configuración",
        children: [
            { icon: Building2, label: "Empresa", href: "/dashboard/settings" },
            { icon: UserCheck, label: "Usuarios y Roles", href: "/dashboard/settings/usuarios" },
            { icon: UserCircle2, label: "Mi Perfil", href: "/dashboard/settings/perfil" },
            { icon: Globe, label: "Monedas", href: "/dashboard/settings/monedas" },
            { icon: FileText, label: "Numeraciones e-CF", href: "/dashboard/settings/numeraciones" },
            { icon: Receipt, label: "Términos de Pago", href: "/dashboard/settings/terminos" },
            { icon: MessageSquare, label: "Plantillas de Correo", href: "/dashboard/settings/plantillas" },
            { icon: Tag, label: "Impuestos y Retenciones", href: "/dashboard/settings/impuestos" },
            { icon: Calculator, label: "Config. Contable", href: "/dashboard/settings/contabilidad" },
            { icon: BellIcon, label: "Notificaciones", href: "/dashboard/settings/notificaciones" },
            { icon: LinkIcon, label: "Integraciones", href: "/dashboard/settings/integraciones" },
        ],
    },
];

// ──────────────────────────────────────────
//  NAV ITEM — redesigned pill buttons
// ──────────────────────────────────────────
function NavSection({ item }: { item: NavItem }) {
    const pathname = usePathname();
    const isActive = item.href
        ? pathname === item.href
        : item.children?.some(c => pathname.startsWith(c.href));
    const [open, setOpen] = useState(!!isActive);

    if (!item.children) {
        return (
            <Link
                href={item.href!}
                className={cn(
                    "group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-gradient-to-r from-purple-600/15 to-cyan-500/10 text-purple-700 dark:text-purple-300 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.18)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
            >
                <span className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    isActive
                        ? "bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                )}>
                    <item.icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-gradient-to-r from-purple-600/12 to-cyan-500/8 text-purple-700 dark:text-purple-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
            >
                <span className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    isActive
                        ? "bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                )}>
                    <item.icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 text-left truncate">{item.label}</span>
                <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    open ? "rotate-180 text-purple-500" : "text-muted-foreground/50"
                )} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-250 ease-in-out",
                open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="ml-5 pl-3 border-l-2 border-purple-200/50 dark:border-purple-800/30 mt-1 space-y-0.5 pb-1">
                    {item.children.map(child => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                    "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    childActive
                                        ? "bg-gradient-to-r from-purple-500/12 to-cyan-500/8 text-purple-700 dark:text-purple-300"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                                    childActive ? "bg-purple-500 scale-125" : "bg-muted-foreground/30"
                                )} />
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────
//  SIDEBAR CONTENT
// ──────────────────────────────────────────
function SidebarContent() {
    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
                        🍭
                    </div>
                    <span className="text-xl font-black tracking-tight">
                        Lolli<span className="text-gradient">pop</span>
                    </span>
                </Link>
            </div>

            {/* Nav list */}
            <div className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
                {NAV.map((item) => (
                    <NavSection key={item.label} item={item} />
                ))}
            </div>

            {/* Upgrade card */}
            <div className="p-3 shrink-0">
                <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-purple-600 to-cyan-500 text-white">
                    {/* decorative blobs */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                    <div className="relative">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                            <p className="font-black text-xs uppercase tracking-wider">Plan Prueba</p>
                        </div>
                        <p className="text-white/75 text-[11px] mb-3">14 días restantes</p>
                        <button className="w-full bg-white text-purple-700 font-bold text-xs h-7 rounded-lg px-3 hover:bg-white/90 transition-colors">
                            Actualizar Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────
//  SIDEBAR — floating card style
// ──────────────────────────────────────────
export function Sidebar() {
    return (
        <aside className="hidden lg:block shrink-0 pl-4 py-4 w-72 h-screen sticky top-0">
            <div className="h-full bg-white dark:bg-[#0d0c16] rounded-3xl flex flex-col overflow-hidden
                shadow-[0_0_0_1px_rgba(124,58,237,0.09),0_8px_32px_rgba(124,58,237,0.09),0_2px_8px_rgba(0,0,0,0.04)]">
                <SidebarContent />
            </div>
        </aside>
    );
}

// ──────────────────────────────────────────
//  QUICK ADD DROPDOWN
// ──────────────────────────────────────────
const QUICK_ADD_ITEMS = [
    {
        group: "Ingresos",
        items: [
            { icon: FileText, label: "Nueva Factura", href: "/dashboard/invoices/new", color: "text-purple-600 bg-purple-500/10" },
            { icon: ClipboardList, label: "Nueva Cotización", href: "/dashboard/ingresos/cotizaciones", color: "text-cyan-600 bg-cyan-500/10" },
            { icon: Truck, label: "Nuevo Conduce", href: "/dashboard/ingresos/conduces", color: "text-indigo-600 bg-indigo-500/10" },
            { icon: ArrowDownLeft, label: "Nota de Crédito", href: "/dashboard/invoices/nota/new", color: "text-emerald-600 bg-emerald-500/10" },
        ],
    },
    {
        group: "Gastos",
        items: [
            { icon: Receipt, label: "Factura de Proveedor", href: "/dashboard/gastos/proveedores", color: "text-rose-600 bg-rose-500/10" },
            { icon: ShoppingCart, label: "Gasto / Pago", href: "/dashboard/gastos", color: "text-amber-600 bg-amber-500/10" },
            { icon: ClipboardList, label: "Orden de Compra", href: "/dashboard/gastos/ordenes", color: "text-orange-600 bg-orange-500/10" },
        ],
    },
    {
        group: "Otros",
        items: [
            { icon: Users, label: "Nuevo Cliente", href: "/dashboard/clients", color: "text-teal-600 bg-teal-500/10" },
            { icon: Package, label: "Nuevo Producto", href: "/dashboard/products", color: "text-violet-600 bg-violet-500/10" },
        ],
    },
];

function QuickAddDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline"
                    className="h-9 w-9 rounded-xl border-purple-200/60 dark:border-purple-800/30 text-purple-600 bg-purple-50/60 hover:bg-purple-100/80 hover:border-purple-300/60 hover:text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 shrink-0 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8} className="w-56 shadow-xl shadow-purple-900/8 border border-purple-100/60 dark:border-purple-900/30 rounded-2xl">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Crear nuevo</DropdownMenuLabel>
                {QUICK_ADD_ITEMS.map((section, si) => (
                    <div key={si}>
                        {si > 0 && <DropdownMenuSeparator />}
                        <div className="px-2 py-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{section.group}</p>
                            {section.items.map((item) => (
                                <DropdownMenuItem key={item.href} asChild>
                                    <Link href={item.href} className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", item.color)}>
                                            <item.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ──────────────────────────────────────────
//  PROFILE DROPDOWN
// ──────────────────────────────────────────
function ProfileDropdown() {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-colors outline-none group">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-semibold leading-none">Juan Pérez</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Mi Empresa SRL</p>
                    </div>
                    <Avatar className="h-8 w-8 border-2 border-purple-200/60 dark:border-purple-700/40 group-hover:border-purple-400/60 transition-colors">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-700 dark:text-purple-300 font-bold text-xs">JP</AvatarFallback>
                    </Avatar>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-64 shadow-xl shadow-purple-900/8 border border-purple-100/60 dark:border-purple-900/30 rounded-2xl">
                <div className="px-3 pt-3 pb-2.5">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-purple-200/50 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-700 dark:text-purple-300 font-bold text-sm">JP</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="font-bold text-sm leading-tight truncate">Juan Pérez</p>
                            <p className="text-xs text-muted-foreground truncate">admin@lollipop.do</p>
                            <div className="flex items-center gap-1 mt-1">
                                <BadgeCheck className="w-3 h-3 text-purple-500" />
                                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">Administrador</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/10 rounded-xl px-2.5 py-2 border border-purple-100/60 dark:border-purple-800/30">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                            <Building className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-tight truncate">Mi Empresa SRL</p>
                            <p className="text-[10px] text-muted-foreground">RNC 1-31-23456-7</p>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator className="bg-purple-100/60 dark:bg-purple-800/20" />

                <DropdownMenuGroup>
                    {[
                        { Icon: User, label: "Mi Perfil", href: "/dashboard/settings/perfil" },
                        { Icon: Settings, label: "Configuración", href: "/dashboard/settings" },
                        { Icon: Users, label: "Usuarios y Roles", href: "/dashboard/settings/usuarios" },
                        { Icon: BellIcon, label: "Notificaciones", href: "/dashboard/settings/notificaciones" },
                    ].map(({ Icon, label, href }) => (
                        <DropdownMenuItem key={href} asChild>
                            <Link href={href} className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span>{label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-purple-100/60 dark:bg-purple-800/20" />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/ayuda" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                            <LifeBuoy className="w-4 h-4 text-muted-foreground" />
                            <span>Centro de Ayuda</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings/integraciones" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                            <KeyRound className="w-4 h-4 text-muted-foreground" />
                            <span>API &amp; Integraciones</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-purple-100/60 dark:bg-purple-800/20" />

                <DropdownMenuItem
                    onClick={() => router.push("/login")}
                    className="flex items-center gap-2.5 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/8 rounded-lg"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-semibold">Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ──────────────────────────────────────────
//  HEADER — glassmorphism bar
// ──────────────────────────────────────────
export function Header() {
    return (
        <header className="h-14 bg-white/80 dark:bg-[#09090f]/80 backdrop-blur-xl border-b border-purple-100/60 dark:border-purple-900/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0">
            {/* Mobile logo + hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-purple-600 hover:bg-purple-50 rounded-xl">
                            <Menu className="w-4 h-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 overflow-y-auto rounded-r-3xl border-r-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <span className="font-black text-base lg:hidden">Lolli<span className="text-gradient">pop</span></span>
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center max-w-xl mx-auto px-4">
                <div className="flex items-center gap-2 w-full max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-400" />
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            className="w-full bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/50 dark:border-purple-800/30 pl-10 h-9 rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-purple-500/30 placeholder:text-purple-400/60"
                        />
                    </div>
                    <QuickAddDropdown />
                </div>
            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-1.5 ml-auto">
                {/* Bell */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"
                            className="relative text-muted-foreground hover:text-purple-600 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 h-9 w-9 rounded-xl transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-xl shadow-purple-900/8 border border-purple-100/60 dark:border-purple-900/30">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span className="font-bold">Notificaciones</span>
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">3 nuevas</Badge>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                            { t: "Factura INV-0047 pagada", s: "CLARO DO pagó RD$ 605,800", dot: "bg-emerald-500", time: "hace 5 min" },
                            { t: "DGII: Formato 607 pendiente", s: "Vence en 3 días · Octubre 2024", dot: "bg-amber-500", time: "hace 1 h" },
                            { t: "Nuevo usuario registrado", s: "Ana García fue invitada al sistema", dot: "bg-purple-500", time: "hace 2 h" },
                        ].map((n, i) => (
                            <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer rounded-lg">
                                <div className="flex items-center gap-2 w-full">
                                    <span className={cn("w-2 h-2 rounded-full shrink-0", n.dot)} />
                                    <span className="font-semibold text-xs flex-1">{n.t}</span>
                                    <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground pl-4">{n.s}</p>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings/notificaciones" className="w-full justify-center text-xs text-purple-600 font-semibold py-2 hover:bg-purple-50/60 transition-colors rounded-lg">
                                Ver todas las notificaciones →
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-5 w-px bg-purple-200/50 dark:bg-purple-800/30 mx-0.5" />

                <ProfileDropdown />
            </div>
        </header>
    );
}
