"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ShieldCheck, Users, Building2, Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import {
    AppUser, CompanyRole, GlobalRole,
    getUsers, upsertUser, deleteUser,
    getUserCompanyRole, setUserCompanyRole, removeUserCompanyRole,
    canAssignRole, maxAssignableRole, roleLevel,
} from "@/lib/auth-store";
import { getCompanies } from "@/lib/company-store";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";
import type { Company } from "@/lib/company-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GLOBAL_ROLE_LABELS: Record<GlobalRole, string> = {
    contador: "Contador",
    propietario: "Propietario",
    empleado: "Empleado",
};

const GLOBAL_ROLE_COLORS: Record<GlobalRole, string> = {
    contador: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    propietario: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    empleado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const AVATAR_COLORS = ["#2563eb", "#d97706", "#7c3aed", "#0ea5e9", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

const ALL_COMPANY_ROLES: CompanyRole[] = ["administrador", "contador", "gerente", "vendedor", "cajero", "solo_lectura"];

function initials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Empty form ───────────────────────────────────────────────────────────────
function emptyUser(createdBy: string): Omit<AppUser, "id"> & { companyRoles: Record<string, CompanyRole> } {
    return {
        name: "", email: "", pin: "", globalRole: "empleado",
        companiesAccess: [], createdBy,
        createdAt: new Date().toLocaleDateString("es-DO"),
        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        companyRoles: {},
    };
}

// ─── User Form Dialog ─────────────────────────────────────────────────────────
function UserDialog({
    open, onOpenChange, editUser, onSave, currentUserRole, availableCompanies, currentUserId,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    editUser: (AppUser & { companyRoles: Record<string, CompanyRole> }) | null;
    onSave: (user: AppUser, companyRoles: Record<string, CompanyRole>) => void;
    currentUserRole: CompanyRole;
    availableCompanies: Company[];
    currentUserId: string;
}) {
    const [form, setForm] = useState(emptyUser(currentUserId));
    const [showPin, setShowPin] = useState(false);

    useEffect(() => {
        if (editUser) {
            setForm({
                name: editUser.name,
                email: editUser.email,
                pin: editUser.pin,
                globalRole: editUser.globalRole,
                companiesAccess: editUser.companiesAccess,
                createdBy: editUser.createdBy,
                createdAt: editUser.createdAt,
                color: editUser.color ?? AVATAR_COLORS[0],
                companyRoles: editUser.companyRoles,
            });
        } else {
            setForm(emptyUser(currentUserId));
        }
    }, [editUser, currentUserId, open]);

    const maxRole = maxAssignableRole(
        form.globalRole === "propietario" ? "propietario" :
            currentUserRole === "administrador" ? "propietario" : "empleado"
    );

    const handleSave = () => {
        if (!form.name || !form.pin) return;
        const user: AppUser = {
            id: editUser?.id ?? `usr-${Date.now()}`,
            name: form.name,
            email: form.email,
            pin: form.pin,
            globalRole: form.globalRole,
            companiesAccess: form.companiesAccess,
            createdBy: form.createdBy,
            createdAt: form.createdAt,
            color: form.color,
        };
        onSave(user, form.companyRoles);
        onOpenChange(false);
    };

    const toggleCompany = (companyId: string) => {
        setForm(f => {
            const has = f.companiesAccess.includes(companyId);
            const next = has ? f.companiesAccess.filter(c => c !== companyId) : [...f.companiesAccess, companyId];
            const roles = { ...f.companyRoles };
            if (has) delete roles[companyId];
            return { ...f, companiesAccess: next, companyRoles: roles };
        });
    };

    const assignableRoles = ALL_COMPANY_ROLES.filter(r =>
        canAssignRole(currentUserRole, r) && roleLevel(r) <= roleLevel(maxRole)
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                {/* Header gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-6 pb-5 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">
                            {editUser ? "Editar Usuario" : "Nuevo Usuario"}
                        </DialogTitle>
                        <p className="text-blue-100 text-sm mt-1">
                            {editUser ? "Actualiza los datos y permisos" : "Crea una cuenta y asigna accesos"}
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Nombre Completo *</Label>
                            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej. María García" className="h-10 rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Correo</Label>
                            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@empresa.do" className="h-10 rounded-lg" type="email" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">PIN de Acceso * (4 dígitos)</Label>
                            <div className="relative">
                                <Input
                                    value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.slice(0, 4) }))}
                                    type={showPin ? "text" : "password"} maxLength={4} placeholder="••••"
                                    className="h-10 rounded-lg font-mono pr-10"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPin(s => !s)}>
                                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Global role (only contador can set propietario) */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Rol Global</Label>
                        <Select value={form.globalRole} onValueChange={v => setForm(f => ({ ...f, globalRole: v as GlobalRole }))}>
                            <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="empleado">Empleado</SelectItem>
                                <SelectItem value="propietario">Propietario</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Avatar color */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Color de Avatar</Label>
                        <div className="flex gap-2">
                            {AVATAR_COLORS.map(c => (
                                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                                    className={cn("w-8 h-8 rounded-full transition-all", form.color === c && "ring-2 ring-offset-2 ring-blue-500 scale-110")}
                                    style={{ background: c }} />
                            ))}
                        </div>
                    </div>

                    {/* Company access + per-company roles */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Acceso a Empresas</Label>
                        <div className="space-y-2">
                            {availableCompanies.map(company => {
                                const hasAccess = form.companiesAccess.includes(company.id);
                                return (
                                    <div key={company.id} className={cn(
                                        "border rounded-xl p-3 transition-all",
                                        hasAccess ? "border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/10" : "border-border/60"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={hasAccess} onChange={() => toggleCompany(company.id)}
                                                className="w-4 h-4 accent-blue-600 cursor-pointer" />
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                style={{ background: company.color }}>
                                                {initials(company.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{company.name}</p>
                                                <p className="text-[10px] text-muted-foreground">RNC {company.rnc}</p>
                                            </div>
                                            {hasAccess && (
                                                <Select
                                                    value={form.companyRoles[company.id] ?? "vendedor"}
                                                    onValueChange={v => setForm(f => ({ ...f, companyRoles: { ...f.companyRoles, [company.id]: v as CompanyRole } }))}
                                                >
                                                    <SelectTrigger className="h-8 w-36 text-xs rounded-lg">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {assignableRoles.map(r => (
                                                            <SelectItem key={r} value={r} className="text-xs">{ROLE_LABELS[r]}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-muted/30 border-t flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        onClick={handleSave}
                        disabled={!form.name || form.pin.length !== 4}
                    >
                        {editUser ? "Guardar Cambios" : "Crear Usuario"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsuariosPage() {
    const { currentUser, activeRole } = useAuth();
    const { companies } = useCompany();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<(AppUser & { companyRoles: Record<string, CompanyRole> }) | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<AppUser | null>(null);

    const isContador = currentUser?.globalRole === "contador";

    useEffect(() => {
        setUsers(getUsers());
        setAllCompanies(getCompanies());
    }, []);

    // Visible companies: contador sees all, propietario sees only their own
    const visibleCompanies = isContador
        ? allCompanies
        : allCompanies.filter(c => currentUser?.companiesAccess.includes(c.id));

    // Visible users: contador sees all, propietario sees only users in their companies
    const visibleUsers = users.filter(u => {
        if (u.id === currentUser?.id) return false; // don't show yourself
        if (isContador) return true;
        return u.companiesAccess.some(cid => currentUser?.companiesAccess.includes(cid));
    }).filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    const handleSave = (user: AppUser, companyRoles: Record<string, CompanyRole>) => {
        upsertUser(user);
        Object.entries(companyRoles).forEach(([companyId, role]) => {
            setUserCompanyRole(user.id, companyId, role);
        });
        // Remove roles for unassigned companies
        allCompanies.forEach(c => {
            if (!user.companiesAccess.includes(c.id)) {
                removeUserCompanyRole(user.id, c.id);
            }
        });
        setUsers(getUsers());
    };

    const handleEdit = (user: AppUser) => {
        // Build existing company roles map
        const companyRoles: Record<string, CompanyRole> = {};
        allCompanies.forEach(c => {
            const role = getUserCompanyRole(user.id, c.id);
            if (role) companyRoles[c.id] = role;
        });
        setEditingUser({ ...user, companyRoles });
        setDialogOpen(true);
    };

    const handleDelete = (user: AppUser) => {
        deleteUser(user.id);
        setUsers(getUsers());
        setDeleteConfirm(null);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Usuarios y Roles</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isContador ? "Gestiona cuentas de propietarios y empleados en todas las empresas." : "Gestiona el equipo de tu empresa."}
                    </p>
                </div>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Usuario
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Usuarios", value: visibleUsers.length, icon: Users, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Propietarios", value: visibleUsers.filter(u => u.globalRole === "propietario").length, icon: ShieldCheck, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Empresas", value: visibleCompanies.length, icon: Building2, color: "text-violet-600 bg-violet-500/10" },
                ].map((s, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.color)}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                                <p className="text-2xl font-bold">{s.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-background" />
            </div>

            {/* User cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visibleUsers.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-semibold">No hay usuarios todavía</p>
                        <p className="text-sm">Crea el primer usuario con el botón de arriba</p>
                    </div>
                ) : visibleUsers.map(user => {
                    // Get this user's role in the current visible companies
                    const companyRolesDisplay = visibleCompanies
                        .filter(c => user.companiesAccess.includes(c.id))
                        .map(c => ({ company: c, role: getUserCompanyRole(user.id, c.id) }))
                        .filter(x => x.role);

                    return (
                        <Card key={user.id} className="bg-card/50 backdrop-blur-xl border-border/60 hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                {/* User header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                            style={{ background: user.color ?? "#2563eb" }}>
                                            {initials(user.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">{user.name}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{user.email || "sin correo"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50" onClick={() => handleEdit(user)}>
                                            <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => setDeleteConfirm(user)}>
                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Global role badge */}
                                <Badge variant="outline" className={cn("text-[10px] mb-3", GLOBAL_ROLE_COLORS[user.globalRole])}>
                                    {GLOBAL_ROLE_LABELS[user.globalRole]}
                                </Badge>

                                {/* Company roles */}
                                {companyRolesDisplay.length > 0 && (
                                    <div className="space-y-1.5 mt-2">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Acceso</p>
                                        {companyRolesDisplay.map(({ company, role }) => (
                                            <div key={company.id} className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded flex items-center justify-center text-[8px] text-white font-bold shrink-0"
                                                    style={{ background: company.color }}>
                                                    {initials(company.name)}
                                                </div>
                                                <span className="text-[11px] text-muted-foreground truncate flex-1">{company.name}</span>
                                                {role && (
                                                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4", ROLE_COLORS[role])}>
                                                        {ROLE_LABELS[role]}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="text-[10px] text-muted-foreground mt-3">Creado {user.createdAt}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Create/Edit dialog */}
            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editUser={editingUser}
                onSave={handleSave}
                currentUserRole={activeRole}
                availableCompanies={visibleCompanies}
                currentUserId={currentUser?.id ?? ""}
            />

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de eliminar a <strong>{deleteConfirm?.name}</strong>?
                            Esta acción no se puede deshacer y el usuario perderá acceso a todas las empresas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            className="bg-red-500 hover:bg-red-600 text-white">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
