"use client";
// APP NAME: Lollipop
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { clearSession } from "@/lib/auth-store";
import { canAccess, HREF_MODULE_MAP, ROLE_LABELS, type AppModule } from "@/lib/permissions";


// ── Heroicons (outline) ──
import {
    Squares2X2Icon,
    ChevronDownIcon,
    Cog6ToothIcon,
    BellIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    QuestionMarkCircleIcon,
    ArrowTrendingUpIcon,
    ShoppingCartIcon,
    ArchiveBoxIcon,
    BuildingLibraryIcon,
    CalculatorIcon,
    ChartPieIcon,
    ReceiptPercentIcon,
    DocumentTextIcon,
    UsersIcon,
    CreditCardIcon,
    BookOpenIcon,
    TagIcon,
    BuildingStorefrontIcon,
    StarIcon,
    AdjustmentsHorizontalIcon,
    ListBulletIcon,
    ArrowPathIcon,
    ClipboardDocumentListIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    ArrowsRightLeftIcon,
    ChatBubbleLeftRightIcon,
    TruckIcon,
    ChartBarIcon,
    BookmarkIcon,
    CubeIcon,
    PlusCircleIcon,
    CheckCircleIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon,
    GlobeAltIcon,
    LinkIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    ArrowRightOnRectangleIcon,
    UserIcon,
    KeyIcon,
    LifebuoyIcon,
    ChevronUpDownIcon,
    BuildingOffice2Icon,
    PlusIcon,
    ChartBarSquareIcon,
    ShieldCheckIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";

import { CheckBadgeIcon } from "@heroicons/react/24/solid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useCompany } from "@/contexts/CompanyContext";

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
    { icon: Squares2X2Icon, label: "Dashboard", href: "/dashboard" },
    {
        icon: ArrowTrendingUpIcon, label: "Ingresos",
        children: [
            { icon: DocumentTextIcon, label: "Facturas de Venta", href: "/dashboard/invoices" },
            { icon: ArrowPathIcon, label: "Facturas Recurrentes", href: "/dashboard/invoices/recurrentes" },
            { icon: CurrencyDollarIcon, label: "Pagos Recibidos", href: "/dashboard/ingresos/pagos" },
            { icon: ArrowDownLeftIcon, label: "Notas de Crédito", href: "/dashboard/invoices/notas" },
            { icon: ClipboardDocumentListIcon, label: "Cotizaciones", href: "/dashboard/ingresos/cotizaciones" },
            { icon: TruckIcon, label: "Conduces", href: "/dashboard/ingresos/conduces" },
        ],
    },
    {
        icon: ReceiptPercentIcon, label: "Gastos",
        children: [
            { icon: DocumentTextIcon, label: "Facturas de Proveedores", href: "/dashboard/gastos/proveedores" },
            { icon: ShoppingCartIcon, label: "Pagos / Gastos", href: "/dashboard/gastos" },
            { icon: CurrencyDollarIcon, label: "Gastos Menores", href: "/dashboard/gastos/menores" },
            { icon: ArrowPathIcon, label: "Pagos Recurrentes", href: "/dashboard/gastos/recurrentes" },
            { icon: ArrowUpRightIcon, label: "Notas de Crédito Compras", href: "/dashboard/gastos/nc" },
            { icon: ClipboardDocumentListIcon, label: "Órdenes de Compra", href: "/dashboard/gastos/ordenes" },
            { icon: CheckCircleIcon, label: "Recepción de Comprobantes", href: "/dashboard/gastos/recepcion" },
        ],
    },
    {
        icon: ArchiveBoxIcon, label: "Productos",
        children: [
            { icon: StarIcon, label: "Productos y Servicios", href: "/dashboard/products" },
            { icon: ChartBarIcon, label: "Valor de Inventario", href: "/dashboard/productos/inventario" },
            { icon: AdjustmentsHorizontalIcon, label: "Ajustes de Inventario", href: "/dashboard/productos/ajustes" },
            { icon: WrenchScrewdriverIcon, label: "Gestión de Productos", href: "/dashboard/productos/gestion" },
            { icon: TagIcon, label: "Listas de Precios", href: "/dashboard/productos/precios" },
            { icon: BuildingStorefrontIcon, label: "Almacenes", href: "/dashboard/productos/almacenes" },
            { icon: ArrowsRightLeftIcon, label: "Transferencias", href: "/dashboard/productos/transferencias" },
            { icon: ListBulletIcon, label: "Categorías", href: "/dashboard/productos/categorias" },
            { icon: AdjustmentsHorizontalIcon, label: "Atributos", href: "/dashboard/productos/atributos" },
        ],
    },
    {
        icon: BuildingLibraryIcon, label: "Bancos y Cajas",
        children: [
            { icon: CreditCardIcon, label: "Cuentas Bancarias", href: "/dashboard/bancos" },
            { icon: ArrowPathIcon, label: "Conciliaciones", href: "/dashboard/bancos/conciliacion" },
        ],
    },
    {
        icon: CalculatorIcon, label: "Contabilidad",
        children: [
            { icon: BookOpenIcon, label: "Catálogo de Cuentas", href: "/dashboard/contabilidad/catalogo" },
            { icon: PlusCircleIcon, label: "Entrada de Diario", href: "/dashboard/contabilidad/diario" },
            { icon: CubeIcon, label: "Activos", href: "/dashboard/contabilidad/activos" },
            { icon: BookmarkIcon, label: "Libro Diario", href: "/dashboard/contabilidad" },
        ],
    },
    { icon: UsersIcon, label: "Clientes", href: "/dashboard/clients" },
    { icon: TruckIcon, label: "Proveedores", href: "/dashboard/suppliers" },
    {
        icon: BuildingStorefrontIcon, label: "POS",
        children: [
            { icon: ShoppingCartIcon, label: "Terminal POS", href: "/dashboard/pos" },
            { icon: ReceiptPercentIcon, label: "Historial de Turnos", href: "/dashboard/pos/turnos" },
            { icon: DocumentTextIcon, label: "Ver Facturas POS", href: "/dashboard/pos/facturas" },
            { icon: UserGroupIcon, label: "Vendedores", href: "/dashboard/pos/vendedores" },
        ],
    },
    { icon: ChartPieIcon, label: "Reportes", href: "/dashboard/reportes" },
    { icon: QuestionMarkCircleIcon, label: "Ayuda", href: "/dashboard/ayuda" },
    {
        icon: Cog6ToothIcon, label: "Configuración",
        children: [
            { icon: BuildingOffice2Icon, label: "Empresa", href: "/dashboard/settings" },
            { icon: ShieldCheckIcon, label: "Usuarios y Roles", href: "/dashboard/settings/usuarios" },
            { icon: UserCircleIcon, label: "Mi Perfil", href: "/dashboard/settings/perfil" },
            { icon: GlobeAltIcon, label: "Monedas", href: "/dashboard/settings/monedas" },
            { icon: DocumentTextIcon, label: "Numeraciones e-CF", href: "/dashboard/settings/numeraciones" },
            { icon: ReceiptPercentIcon, label: "Términos de Pago", href: "/dashboard/settings/terminos" },
            { icon: ChatBubbleLeftRightIcon, label: "Plantillas", href: "/dashboard/settings/plantillas" },
            { icon: TagIcon, label: "Impuestos y Retenciones", href: "/dashboard/settings/impuestos" },
            { icon: CalculatorIcon, label: "Config. Contable", href: "/dashboard/settings/contabilidad" },
            { icon: BellIcon, label: "Notificaciones", href: "/dashboard/settings/notificaciones" },
            { icon: LinkIcon, label: "Integraciones", href: "/dashboard/settings/integraciones" },
            { icon: ChartBarSquareIcon, label: "Auditoría", href: "/dashboard/settings/auditoria" },
        ],
    },
];

// ──────────────────────────────────────────
//  NAV ITEM
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
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                    isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
            >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/20 text-white shadow-sm">
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
                    "group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                    isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
            >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                <ChevronDownIcon className={cn(
                    "w-4 h-4 transition-transform duration-200 shrink-0",
                    open ? "rotate-180" : ""
                )} />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-250 ease-in-out",
                open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="ml-6 pl-4 border-l border-slate-700/50 mt-1 space-y-0.5 pb-1.5">
                    {item.children.map(child => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                    "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                                    childActive
                                        ? "text-blue-400 bg-blue-500/10"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                                    childActive ? "bg-blue-400" : "bg-slate-600"
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
//  SIDEBAR WORDMARK (no emoji)
// ──────────────────────────────────────────
function SidebarLogo() {
    return (
        <Link href="/dashboard" className="flex items-center select-none">
            <span className="text-xl font-black tracking-tight text-white">
                Lolli<span className="text-blue-400">pop</span>
            </span>
        </Link>
    );
}

// ──────────────────────────────────────────
//  SIDEBAR CONTENT
// ──────────────────────────────────────────
function SidebarContent() {
    const { activeRole } = useAuth();

    // Filter nav items based on the user's active role
    const visibleNav = NAV.filter(item => {
        // Items with children: show if at least one child is accessible
        if (item.children) {
            const anyChild = item.children.some(child => {
                const mod = HREF_MODULE_MAP[child.href] as AppModule | undefined;
                if (!mod) return true; // unknown = show
                return canAccess(activeRole, mod);
            });
            return anyChild;
        }
        // Top-level item
        const mod = item.href ? HREF_MODULE_MAP[item.href] as AppModule | undefined : undefined;
        if (!mod) return true;
        return canAccess(activeRole, mod);
    }).map(item => {
        if (!item.children) return item;
        return {
            ...item,
            children: item.children.filter(child => {
                const mod = HREF_MODULE_MAP[child.href] as AppModule | undefined;
                if (!mod) return true;
                return canAccess(activeRole, mod);
            }),
        };
    });

    return (
        <div className="flex flex-col h-full bg-[#181C25] text-white">
            {/* Logo */}
            <div className="h-[72px] flex items-center px-5 shrink-0 border-b border-white/5">
                <SidebarLogo />
            </div>

            {/* Nav list */}
            <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                {visibleNav.map(item => (
                    <NavSection key={item.label} item={item} />
                ))}
            </div>

            {/* Profile Bottom */}
            <div className="p-3 shrink-0 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#222736] hover:bg-[#2A3143] transition-colors cursor-pointer border border-white/5">
                    <Avatar className="h-9 w-9 border-2 border-white/10 shrink-0">
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">AW</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[14px] leading-tight truncate text-white">Alan Wake</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">Administrador</p>
                    </div>
                    <ChevronUpDownIcon className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────
//  SIDEBAR — Floating dark layout
// ──────────────────────────────────────────
export function Sidebar() {
    return (
        <aside className="hidden lg:block shrink-0 pl-4 py-4 w-[272px] h-screen sticky top-0">
            <div className="h-full bg-[#181C25] rounded-3xl flex flex-col overflow-hidden shadow-xl border border-[#222736]">
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
            { icon: DocumentTextIcon, label: "Nueva Factura", href: "/dashboard/invoices/new", color: "text-blue-600 bg-blue-500/10" },
            { icon: ClipboardDocumentListIcon, label: "Nueva Cotización", href: "/dashboard/ingresos/cotizaciones", color: "text-sky-600 bg-sky-500/10" },
            { icon: TruckIcon, label: "Nuevo Conduce", href: "/dashboard/ingresos/conduces", color: "text-indigo-600 bg-indigo-500/10" },
            { icon: ArrowDownLeftIcon, label: "Nota de Crédito", href: "/dashboard/invoices/nota/new", color: "text-emerald-600 bg-emerald-500/10" },
        ],
    },
    {
        group: "Gastos",
        items: [
            { icon: ReceiptPercentIcon, label: "Factura de Proveedor", href: "/dashboard/gastos/proveedores", color: "text-rose-600 bg-rose-500/10" },
            { icon: ShoppingCartIcon, label: "Gasto / Pago", href: "/dashboard/gastos", color: "text-amber-600 bg-amber-500/10" },
            { icon: ClipboardDocumentListIcon, label: "Orden de Compra", href: "/dashboard/gastos/ordenes", color: "text-orange-600 bg-orange-500/10" },
        ],
    },
    {
        group: "Otros",
        items: [
            { icon: UsersIcon, label: "Nuevo Cliente", href: "/dashboard/clients", color: "text-teal-600 bg-teal-500/10" },
            { icon: ArchiveBoxIcon, label: "Nuevo Producto", href: "/dashboard/products", color: "text-violet-600 bg-violet-500/10" },
        ],
    },
];

function QuickAddDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline"
                    className="h-9 w-9 rounded-xl border-blue-200/60 dark:border-blue-800/30 text-blue-600 bg-blue-50/60 hover:bg-blue-100/80 hover:border-blue-300/60 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shrink-0 transition-colors shadow-sm"
                >
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8} className="w-56 shadow-xl shadow-blue-900/8 border border-blue-100/60 dark:border-blue-900/30 rounded-2xl">
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
//  COMPANY SWITCHER & PROFILE DROPDOWN
// ──────────────────────────────────────────
function ProfileDropdown() {
    const router = useRouter();
    const { companies, activeCompany, switchCompany } = useCompany();
    const { currentUser, activeRole, logout } = useAuth();
    const [showCompanyModal, setShowCompanyModal] = useState(false);

    const handleLogout = () => {
        logout();
        clearSession();
        router.push("/login");
    };

    const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const displayName = currentUser?.name ?? 'Usuario';
    const displayRole = ROLE_LABELS[activeRole] ?? activeRole;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors outline-none group">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-semibold leading-none">{displayName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{displayRole} · {activeCompany?.name ?? 'Cargando...'}</p>
                        </div>
                        <Avatar className="h-8 w-8 border-2 border-blue-200/60 dark:border-blue-700/40 group-hover:border-blue-400/60 transition-colors">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 text-blue-700 dark:text-blue-300 font-bold text-xs">JP</AvatarFallback>
                        </Avatar>
                        <ChevronUpDownIcon className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-72 shadow-xl shadow-blue-900/8 border border-blue-100/60 dark:border-blue-900/30 rounded-2xl">
                    <div className="px-3 pt-3 pb-2.5">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-blue-200/50 shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 text-blue-700 dark:text-blue-300 font-bold text-sm">{initials(displayName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="font-bold text-sm leading-tight truncate">{displayName}</p>
                                <p className="text-xs text-muted-foreground truncate">{displayRole}</p>
                            </div>
                        </div>

                        {/* Company Switcher */}
                        <div
                            onClick={() => setShowCompanyModal(true)}
                            className="mt-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/10 rounded-xl px-2.5 py-2 border border-blue-100/60 dark:border-blue-800/30 cursor-pointer hover:border-blue-300 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: activeCompany?.color ?? '#2563eb' }}>
                                {activeCompany ? initials(activeCompany.name) : '??'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold leading-tight truncate">{activeCompany?.name ?? '—'}</p>
                                <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400">{activeCompany?.role} • RNC {activeCompany?.rnc}</p>
                            </div>
                            <ArrowsRightLeftIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>

                    <DropdownMenuSeparator className="bg-blue-100/60 dark:bg-blue-800/20" />

                    <DropdownMenuGroup>
                        {[
                            { Icon: UserIcon, label: "Mi Perfil", href: "/dashboard/settings/perfil" },
                            { Icon: BuildingOffice2Icon, label: "Mis Empresas", href: "/dashboard/settings/empresa" },
                            { Icon: Cog6ToothIcon, label: "Configuración", href: "/dashboard/settings" },
                            { Icon: UsersIcon, label: "Usuarios y Roles", href: "/dashboard/settings/usuarios" },
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

                    <DropdownMenuSeparator className="bg-blue-100/60 dark:bg-blue-800/20" />

                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/ayuda" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                                <LifebuoyIcon className="w-4 h-4 text-muted-foreground" />
                                <span>Centro de Ayuda</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings/integraciones" className="flex items-center gap-2.5 cursor-pointer rounded-lg">
                                <KeyIcon className="w-4 h-4 text-muted-foreground" />
                                <span>API &amp; Integraciones</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-blue-100/60 dark:bg-blue-800/20" />

                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/8 rounded-lg"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span className="font-semibold">Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Switcher Modal */}
            <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-6 text-white relative flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 border border-white/30 shadow-inner">
                            <BuildingOffice2Icon className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Cambiar de Empresa</DialogTitle>
                        <p className="text-sm text-blue-100 mt-1 max-w-[280px]">Selecciona una empresa o crea una nueva.</p>
                    </div>

                    <div className="p-4 bg-background">
                        <div className="mb-2 px-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <span>Mis Empresas</span>
                            <span className="bg-muted px-2 py-0.5 rounded-md">{companies.length}</span>
                        </div>

                        <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                            {companies.map(comp => (
                                <button
                                    key={comp.id}
                                    onClick={() => { switchCompany(comp.id); setShowCompanyModal(false); }}
                                    className={cn(
                                        "w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border",
                                        activeCompany?.id === comp.id
                                            ? "border-blue-500/50 bg-blue-500/5"
                                            : "border-transparent hover:border-border hover:bg-muted/50"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 text-white" style={{ background: comp.color }}>
                                        {initials(comp.name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm truncate">{comp.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <CheckBadgeIcon className={cn("w-3 h-3", activeCompany?.id === comp.id ? "text-blue-500" : "text-muted-foreground")} />
                                            <span className="text-[10px] font-medium text-muted-foreground">{comp.role} · {comp.sector}</span>
                                        </div>
                                    </div>
                                    {activeCompany?.id === comp.id && (
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/60">
                            <Button
                                variant="outline"
                                onClick={() => { setShowCompanyModal(false); router.push("/dashboard/settings/empresa/nueva"); }}
                                className="w-full justify-start gap-2 h-11 border-dashed hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="font-semibold">Crear Nueva Compañía</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ──────────────────────────────────────────
//  HEADER
// ──────────────────────────────────────────
export function Header() {
    return (
        <>
            <header className="h-14 bg-white/80 dark:bg-[#09090f]/80 backdrop-blur-xl border-b border-blue-100/60 dark:border-blue-900/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0">
                {/* Mobile logo + hamburger */}
                <div className="flex items-center gap-3 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-xl">
                                <Bars3Icon className="w-4 h-4" />
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
                        <div className="relative flex-1 group cursor-pointer" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                            <div className="w-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 pl-10 pr-4 h-9 rounded-xl flex items-center justify-between group-hover:border-blue-300 transition-all">
                                <span className="text-sm text-blue-400/80 group-hover:text-blue-500/80">Buscar rápidos...</span>
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-blue-100/80 dark:bg-blue-800/30 px-1.5 font-mono text-[10px] font-medium text-blue-600 dark:text-blue-300">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                        <QuickAddDropdown />
                    </div>
                </div>

                {/* Right: notifications + profile */}
                <div className="flex items-center gap-1.5 ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"
                                className="relative text-muted-foreground hover:text-blue-600 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 h-9 w-9 rounded-xl transition-colors">
                                <BellIcon className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-xl shadow-blue-900/8 border border-blue-100/60 dark:border-blue-900/30">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                <span className="font-bold">Notificaciones</span>
                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">3 nuevas</Badge>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { t: "Factura 0047 pagada", s: "CLARO DO pagó RD$ 605,800", dot: "bg-emerald-500", time: "hace 5 min" },
                                { t: "DGII: Formato 607 pendiente", s: "Vence en 3 días · Octubre 2024", dot: "bg-amber-500", time: "hace 1 h" },
                                { t: "Nuevo usuario registrado", s: "Ana García fue invitada al sistema", dot: "bg-blue-500", time: "hace 2 h" },
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
                                <Link href="/dashboard/settings/notificaciones" className="w-full justify-center text-xs text-blue-600 font-semibold py-2 hover:bg-blue-50/60 transition-colors rounded-lg">
                                    Ver todas las notificaciones →
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-5 w-px bg-blue-200/50 dark:bg-blue-800/30 mx-0.5" />

                    <ProfileDropdown />
                </div>
            </header>
            <CommandPalette />
        </>
    );
}
