// Company Store — helpers for company-prefixed localStorage keys
// Strategy: "mirror" approach — active company data lives in generic keys so
// all existing pages work unchanged. On company switch we swap the data.

export const COMPANY_KEYS = [
    // Invoicing & billing
    'invoice_emitted',
    'invoice_drafts',
    // Payments
    'pagos_recibidos',
    'lollipop_pagos_recibidos',
    // Quotations
    'lollipop_cotizaciones',
    // Conduces
    'lollipop_conduces',
    // Recurring invoices
    'lollipop_facturas_recurrentes',
    // POS
    'pos_shift_history',
    'pos_vendedores',
    'pos_current_shift',
    'lollipop_pos_products',
    'lollipop_pos_services',
    // Banks
    'lollipop_bancos',
    // Clients & products
    'lollipop_clientes',
    'lollipop_products',
    // Expenses
    'lollipop_606_recibidos',
    'lollipop_gastos_menores',
    'lollipop_gastos_proveedores',
    // Company settings (name, address, RNC, logo, etc.)
    'lollipop_company_settings',
    // Accounting
    'lollipop_activos',
    'lollipop_diario',
] as const;

export type CompanyKey = typeof COMPANY_KEYS[number];

export type Company = {
    id: string;
    name: string;
    role: string;
    rnc: string;
    sector: string;
    color: string;   // hex or tailwind color name for avatar
    email?: string;
    phone?: string;
    address?: string;
    createdAt: string;
};

const LS_COMPANIES = 'lollipop_companies';
const LS_ACTIVE = 'lollipop_active_company';

// ── Company list CRUD ─────────────────────────────────────────────────────────
export function getCompanies(): Company[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LS_COMPANIES) || '[]'); } catch { return []; }
}

export function saveCompanies(list: Company[]): void {
    localStorage.setItem(LS_COMPANIES, JSON.stringify(list));
}

export function getActiveCompanyId(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(LS_ACTIVE) || '';
}

export function setActiveCompanyId(id: string): void {
    localStorage.setItem(LS_ACTIVE, id);
}

// ── Prefixed key for company-scoped data ──────────────────────────────────────
export function prefixedKey(companyId: string, key: CompanyKey): string {
    return `company_${companyId}_${key}`;
}

// ── Save current mirror data back to company-scoped keys ─────────────────────
export function snapshotCurrentToCompany(companyId: string): void {
    if (!companyId) return;
    COMPANY_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) {
            localStorage.setItem(prefixedKey(companyId, key), val);
        }
    });
}

// ── Load a company's data into the generic "mirror" keys ─────────────────────
export function loadCompanyIntoMirror(companyId: string): void {
    if (!companyId) return;
    COMPANY_KEYS.forEach(key => {
        const val = localStorage.getItem(prefixedKey(companyId, key));
        if (val !== null) {
            localStorage.setItem(key, val);
        } else {
            // Clear if company has no data for this key
            localStorage.removeItem(key);
        }
    });
}

// ── Switch company (snapshot old, load new) ───────────────────────────────────
export function switchCompanyData(fromId: string, toId: string): void {
    if (fromId) snapshotCurrentToCompany(fromId);
    setActiveCompanyId(toId);
    loadCompanyIntoMirror(toId);
    // Signal all components to re-read localStorage
    window.dispatchEvent(new CustomEvent('company-changed', { detail: { companyId: toId } }));
}
