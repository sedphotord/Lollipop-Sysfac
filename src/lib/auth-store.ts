/**
 * auth-store.ts — User accounts, sessions, and per-company roles
 *
 * All keys are SYSTEM-level (not company-prefixed) so they are shared
 * across all companies and readable regardless of active company.
 */

export type GlobalRole = 'contador' | 'propietario' | 'empleado';

export type CompanyRole =
    | 'administrador'
    | 'contador'
    | 'gerente'
    | 'vendedor'
    | 'cajero'
    | 'solo_lectura';

export type AppUser = {
    id: string;
    name: string;
    email: string;
    pin: string;               // 4-digit PIN
    globalRole: GlobalRole;
    companiesAccess: string[]; // company IDs this user can access
    createdBy: string;         // user ID who created this account
    createdAt: string;
    color?: string;            // avatar color
};

export type Session = {
    userId: string;
    loginAt: string;
};

// ── Storage keys (all system-level, not company-scoped) ───────────────────────
const LS_USERS = 'lollipop_users';
const LS_COMPANY_ROLES = 'lollipop_user_company_roles';
const LS_SESSION = 'lollipop_current_session';

// ── Users CRUD ────────────────────────────────────────────────────────────────
export function getUsers(): AppUser[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch { return []; }
}

export function saveUsers(users: AppUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function getUserById(id: string): AppUser | null {
    return getUsers().find(u => u.id === id) ?? null;
}

export function upsertUser(user: AppUser): void {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    saveUsers(users);
}

export function deleteUser(id: string): void {
    saveUsers(getUsers().filter(u => u.id !== id));
    // Also remove all company roles for this user
    const roles = getCompanyRolesMap();
    Object.keys(roles).forEach(k => {
        if (k.startsWith(`${id}:`)) delete roles[k];
    });
    saveCompanyRolesMap(roles);
}

// ── Per-company roles ─────────────────────────────────────────────────────────
function getCompanyRolesMap(): Record<string, CompanyRole> {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(LS_COMPANY_ROLES) || '{}'); } catch { return {}; }
}

function saveCompanyRolesMap(map: Record<string, CompanyRole>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_COMPANY_ROLES, JSON.stringify(map));
}

export function getUserCompanyRole(userId: string, companyId: string): CompanyRole | null {
    return getCompanyRolesMap()[`${userId}:${companyId}`] ?? null;
}

export function setUserCompanyRole(userId: string, companyId: string, role: CompanyRole): void {
    const map = getCompanyRolesMap();
    map[`${userId}:${companyId}`] = role;
    saveCompanyRolesMap(map);
}

export function removeUserCompanyRole(userId: string, companyId: string): void {
    const map = getCompanyRolesMap();
    delete map[`${userId}:${companyId}`];
    saveCompanyRolesMap(map);
}

/**
 * Get the effective role for a user in the active company.
 * - `contador` global role → always 'administrador' in any company
 * - Others → read from company role map
 */
export function getEffectiveRole(userId: string, companyId: string): CompanyRole {
    const user = getUserById(userId);
    if (!user) return 'solo_lectura';
    if (user.globalRole === 'contador') return 'administrador';
    return getUserCompanyRole(userId, companyId) ?? 'solo_lectura';
}

// ── Session ───────────────────────────────────────────────────────────────────
export function getSession(): Session | null {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); } catch { return null; }
}

export function setSession(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_SESSION, JSON.stringify({ userId, loginAt: new Date().toISOString() }));
}

export function clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LS_SESSION);
}

// ── Role hierarchy (higher index = more permissions) ─────────────────────────
const ROLE_ORDER: CompanyRole[] = [
    'solo_lectura', 'cajero', 'vendedor', 'gerente', 'contador', 'administrador',
];

export function roleLevel(role: CompanyRole): number {
    return ROLE_ORDER.indexOf(role);
}

/** Returns true if `assignerRole` can assign `targetRole` to someone */
export function canAssignRole(assignerRole: CompanyRole, targetRole: CompanyRole): boolean {
    return roleLevel(assignerRole) >= roleLevel(targetRole);
}

/** Max role that can be created by the given global role */
export function maxAssignableRole(globalRole: GlobalRole): CompanyRole {
    if (globalRole === 'contador') return 'administrador';
    if (globalRole === 'propietario') return 'gerente';
    return 'solo_lectura';
}
