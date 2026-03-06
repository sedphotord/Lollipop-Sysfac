/**
 * company-store.ts — Company list & active company management
 *
 * With the new companyStorage helper, company switching is trivial:
 *   1. setActiveCompanyId(toId)
 *   2. window.location.reload()
 *
 * All pages auto-read from the new company's prefixed keys.
 * The mirror/snapshot pattern has been removed.
 */

export type Company = {
    id: string;
    name: string;
    role: string;
    rnc: string;
    sector: string;
    color: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt: string;
};

const LS_COMPANIES = 'lollipop_companies';
const LS_ACTIVE = 'lollipop_active_company';

export function getCompanies(): Company[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LS_COMPANIES) || '[]'); } catch { return []; }
}

export function saveCompanies(list: Company[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_COMPANIES, JSON.stringify(list));
}

export function getActiveCompanyId(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(LS_ACTIVE) || '';
}

export function setActiveCompanyId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_ACTIVE, id);
}

/** Build a company-prefixed key (for use in seed-data) */
export function prefixedKey(companyId: string, key: string): string {
    return `company_${companyId}_${key}`;
}
