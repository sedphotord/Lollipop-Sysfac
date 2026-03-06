"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, Clock, Mail, MoreVertical, Plus, Search, Shield, Trash2, UserCheck, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const USERS = [
    { id: 1, name: "Juan Perez", email: "admin@lollipop.do", role: "admin", status: "activo", lastLogin: "Hace 5 min" },
    { id: 2, name: "Ana Garcia", email: "ana@lollipop.do", role: "contador", status: "activo", lastLogin: "Hace 2 horas" },
    { id: 3, name: "Roberto Mendez", email: "roberto@lollipop.do", role: "vendedor", status: "activo", lastLogin: "Ayer" },
    { id: 4, name: "Maria Castillo", email: "maria@lollipop.do", role: "viewer", status: "pendiente", lastLogin: "Nunca" },
];

const ROLES: Record<string, { label: string; color: string; perms: string }> = {
    admin: { label: "Administrador", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", perms: "Acceso total al sistema" },
    contador: { label: "Contador", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", perms: "Facturacion, reportes, contabilidad" },
    vendedor: { label: "Vendedor", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", perms: "Facturas, cotizaciones, POS, clientes" },
    viewer: { label: "Solo lectura", color: "bg-muted text-muted-foreground", perms: "Ver reportes y documentos" },
};

export default function UsuariosPage() {
    const [users, setUsers] = useState(USERS);
    const [open, setOpen] = useState(false);
    const [fn, setFn] = useState(""); const [fe, setFe] = useState(""); const [fr, setFr] = useState("vendedor");
    const [search, setSearch] = useState("");

    const add = () => { if (!fn || !fe) return; setUsers(p => [...p, { id: Date.now(), name: fn, email: fe, role: fr, status: "pendiente", lastLogin: "Nunca" }]); setOpen(false); setFn(""); setFe(""); };
    const remove = (id: number) => setUsers(p => p.filter(u => u.id !== id));
    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-3xl font-bold tracking-tight">Usuarios y Roles</h2><p className="text-muted-foreground mt-1 text-sm">Administra el acceso de tu equipo al sistema.</p></div>
                <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-primary shadow-lg shadow-primary/20 gap-2"><Plus className="w-4 h-4" />Invitar Usuario</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Invitar Usuario</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2"><Label>Nombre completo</Label><Input placeholder="Ana Garcia" value={fn} onChange={e => setFn(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Correo electronico</Label><Input type="email" placeholder="ana@empresa.com" value={fe} onChange={e => setFe(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Rol</Label><Select value={fr} onValueChange={setFr}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(ROLES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select><p className="text-[10px] text-muted-foreground mt-1">{ROLES[fr]?.perms}</p></div>
                        </div><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={add}><Mail className="w-4 h-4 mr-2" />Enviar Invitacion</Button></div>
                    </DialogContent></Dialog>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ l: "Total Usuarios", v: users.length, i: Users, c: "text-blue-600 bg-blue-500/10" }, { l: "Activos", v: users.filter(u => u.status === "activo").length, i: UserCheck, c: "text-emerald-600 bg-emerald-500/10" }, { l: "Pendientes", v: users.filter(u => u.status === "pendiente").length, i: Clock, c: "text-amber-600 bg-amber-500/10" }, { l: "Roles", v: Object.keys(ROLES).length, i: Shield, c: "text-blue-600 bg-blue-500/10" }].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><k.i className="w-5 h-5" /></div><div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div></CardContent></Card>
                ))}
            </div>

            <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..." className="pl-9 bg-muted/50" /></div>

            <div className="grid gap-3">{filtered.map(u => (
                <Card key={u.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-4"><div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border-2 border-blue-200/50"><AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 text-blue-700 font-bold text-xs">{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1"><div className="flex items-center gap-2"><p className="font-bold text-sm">{u.name}</p>{u.role === "admin" && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}</div><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    <Badge variant="outline" className={cn("text-[10px]", ROLES[u.role]?.color)}>{ROLES[u.role]?.label}</Badge>
                    <div className="text-right hidden sm:block"><p className="text-[10px] text-muted-foreground">Ultimo acceso</p><p className="text-xs font-medium">{u.lastLogin}</p></div>
                    <Badge variant="outline" className={cn("text-[10px]", u.status === "activo" ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-amber-600 bg-amber-500/10 border-amber-500/20")}>{u.status}</Badge>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem>Editar rol</DropdownMenuItem><DropdownMenuItem>Reenviar invitacion</DropdownMenuItem><DropdownMenuItem className="text-red-500" onClick={() => remove(u.id)}>Eliminar</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                </div></CardContent></Card>
            ))}</div>
        </div>
    );
}
