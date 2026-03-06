/**
 * companyStorage — auto-prefixed localStorage helper
 *
 * Every key is stored as `company_<activeCompanyId>_<key>` so that
 * all business data is automatically isolated per company. The helper
 * reads the active company ID from `lollipop_active_company` on every call,
 * meaning a page reload after a company switch instantly sees the right data.
 *
 * System keys (theme, template, sessions, seed flags) are in SYSTEM_KEYS and
 * are stored without a company prefix — they are shared across all companies.
 */

const SYSTEM_KEYS = new Set([
    'lollipop_active_company',
    'lollipop_companies',
    'lollipop_seeded_v5',
    'lollipop_theme_color',
    'lollipop_invoice_template_id',
    'lollipop_sidebar_collapsed',
]);

function activeCompanyId(): string {
    if (typeof window === 'undefined') return 'default';
    return localStorage.getItem('lollipop_active_company') || 'default';
}

function resolveKey(key: string): string {
    if (SYSTEM_KEYS.has(key)) return key;
    return `company_${activeCompanyId()}_${key}`;
}

export const companyStorage = {
    /** Returns the full resolved key (useful for debugging) */
    resolveKey,

    /** Get a string value */
    get(key: string): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(resolveKey(key));
    },

    /** Set a string value */
    set(key: string, value: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(resolveKey(key), value);
    },

    /** Remove a key */
    remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(resolveKey(key));
    },

    /** Get and JSON-parse, returning fallback on error/missing */
    getJSON<T>(key: string, fallback: T): T {
        try {
            const raw = companyStorage.get(key);
            if (raw === null) return fallback;
            return (JSON.parse(raw) as T) ?? fallback;
        } catch {
            return fallback;
        }
    },

    /** JSON-serialize and store */
    setJSON(key: string, value: unknown): void {
        companyStorage.set(key, JSON.stringify(value));
    },
};

export default companyStorage;
