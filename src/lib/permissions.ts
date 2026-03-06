/**
 * permissions.ts — Module access matrix per company role
 *
 * Each module maps to which roles can access it.
 * The sidebar and route guards use this to show/hide navigation items.
 */

import { CompanyRole } from './auth-store';

export type AppModule =
    | 'dashboard'
    | 'facturas'
    | 'pos'
    | 'cotizaciones'
    | 'conduces'
    | 'facturas_recurrentes'
    | 'pagos_recibidos'
    | 'gastos'
    | 'bancos'
    | 'productos'
    | 'clientes'
    | 'proveedores'
    | 'reportes'
    | 'contabilidad'
    | 'settings_empresa'
    | 'settings_usuarios'
    | 'settings_general';

type PermissionMatrix = Record<AppModule, CompanyRole[]>;

/** Roles that can access each module */
const PERMISSIONS: PermissionMatrix = {
    dashboard: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    facturas: ['administrador', 'contador', 'gerente', 'vendedor', 'solo_lectura'],
    pos: ['administrador', 'contador', 'gerente', 'vendedor', 'cajero'],
    cotizaciones: ['administrador', 'contador', 'gerente', 'vendedor', 'solo_lectura'],
    conduces: ['administrador', 'contador', 'gerente', 'vendedor', 'solo_lectura'],
    facturas_recurrentes: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    pagos_recibidos: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    gastos: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    bancos: ['administrador', 'contador', 'solo_lectura'],
    productos: ['administrador', 'contador', 'gerente', 'vendedor', 'cajero', 'solo_lectura'],
    clientes: ['administrador', 'contador', 'gerente', 'vendedor', 'solo_lectura'],
    proveedores: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    reportes: ['administrador', 'contador', 'gerente', 'solo_lectura'],
    contabilidad: ['administrador', 'contador', 'solo_lectura'],
    settings_empresa: ['administrador', 'contador'],
    settings_usuarios: ['administrador', 'contador'],
    settings_general: ['administrador', 'contador', 'gerente'],
};

export function canAccess(role: CompanyRole, module: AppModule): boolean {
    return PERMISSIONS[module]?.includes(role) ?? false;
}

export function isReadOnly(role: CompanyRole): boolean {
    return role === 'solo_lectura';
}

/** Maps sidebar nav hrefs to modules for permission filtering */
export const HREF_MODULE_MAP: Record<string, AppModule> = {
    '/dashboard': 'dashboard',
    '/dashboard/invoices': 'facturas',
    '/dashboard/invoices/new': 'facturas',
    '/dashboard/invoices/recurrentes': 'facturas_recurrentes',
    '/dashboard/pos': 'pos',
    '/dashboard/ingresos/cotizaciones': 'cotizaciones',
    '/dashboard/ingresos/conduces': 'conduces',
    '/dashboard/ingresos/pagos': 'pagos_recibidos',
    '/dashboard/gastos': 'gastos',
    '/dashboard/gastos/pagos': 'gastos',
    '/dashboard/gastos/recepcion': 'gastos',
    '/dashboard/gastos/menores': 'gastos',
    '/dashboard/bancos': 'bancos',
    '/dashboard/products': 'productos',
    '/dashboard/clients': 'clientes',
    '/dashboard/suppliers': 'proveedores',
    '/dashboard/reportes': 'reportes',
    '/dashboard/contabilidad': 'contabilidad',
    '/dashboard/settings': 'settings_general',
    '/dashboard/settings/empresa': 'settings_empresa',
    '/dashboard/settings/usuarios': 'settings_usuarios',
    '/dashboard/settings/notificaciones': 'settings_general',
    '/dashboard/settings/integraciones': 'settings_general',
};

/** Human-readable role labels */
export const ROLE_LABELS: Record<CompanyRole, string> = {
    administrador: 'Administrador',
    contador: 'Contador',
    gerente: 'Gerente',
    vendedor: 'Vendedor',
    cajero: 'Cajero',
    solo_lectura: 'Solo Lectura',
};

/** Role badge colors */
export const ROLE_COLORS: Record<CompanyRole, string> = {
    administrador: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    contador: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    gerente: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    vendedor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    cajero: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    solo_lectura: 'bg-muted text-muted-foreground border-border',
};
