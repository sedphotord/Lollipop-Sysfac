"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    MagnifyingGlassIcon, ClockIcon, UserIcon, DocumentTextIcon,
    PencilSquareIcon, TrashIcon, EyeIcon, PlusCircleIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type AuditEntry = {
    id: string; fecha: string; hora: string; usuario: string; accion: string;
    modulo: string; detalle: string; ip: string;
};

const SAMPLE: AuditEntry[] = [
    { id: "1", fecha: "2025-03-07", hora: "09:34:21", usuario: "Juan Pérez", accion: "crear", modulo: "Facturas", detalle: "Factura E310000000049 creada para CLARO", ip: "192.168.1.5" },
    { id: "2", fecha: "2025-03-07", hora: "09:12:05", usuario: "Ana García", accion: "editar", modulo: "Clientes", detalle: "Teléfono cliente ALTICE actualizado", ip: "192.168.1.8" },
    { id: "3", fecha: "2025-03-07", hora: "08:58:44", usuario: "Juan Pérez", accion: "eliminar", modulo: "Cotizaciones", detalle: "Cotización COT-022 eliminada", ip: "192.168.1.5" },
    { id: "4", fecha: "2025-03-06", hora: "17:45:00", usuario: "Roberto Méndez", accion: "login", modulo: "Sistema", detalle: "Inicio de sesión exitoso", ip: "192.168.1.12" },
    { id: "5", fecha: "2025-03-06", hora: "17:32:18", usuario: "Administrador", accion: "configurar", modulo: "Configuración", detalle: "Moneda base cambiada de USD a DOP", ip: "192.168.1.1" },
    { id: "6", fecha: "2025-03-06", hora: "14:20:33", usuario: "Ana García", accion: "crear", modulo: "Gastos", detalle: "Gasto de RD$ 4,500 en Transportación registrado", ip: "192.168.1.8" },
    { id: "7", fecha: "2025-03-06", hora: "13:00:00", usuario: "Roberto Méndez", accion: "ver", modulo: "Reportes", detalle: "Reporte 606 generado para período marzo 2025", ip: "192.168.1.12" },
    { id: "8", fecha: "2025-03-05", hora: "10:05:12", usuario: "Juan Pérez", accion: "logout", modulo: "Sistema", detalle: "Cierre de sesión", ip: "192.168.1.5" },
];

const ACCION_STYLES: Record<string, string> = {
    crear: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    editar: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    eliminar: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    login: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    logout: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    configurar: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    ver: "text-muted-foreground bg-muted",
};

const ACCION_ICON: Record<string, typeof DocumentTextIcon> = {
    crear: PlusCircleIcon, editar: PencilSquareIcon, eliminar: TrashIcon,
    ver: EyeIcon, login: UserIcon, logout: UserIcon, configurar: ClockIcon,
};

export default function AuditoriaPage() {
    const [list] = useState<AuditEntry[]>(SAMPLE);
    const [search, setSearch] = useState("");
    const [filterAccion, setFilterAccion] = useState("todos");
    const [filterModulo, setFilterModulo] = useState("todos");

    const modulos = [...new Set(list.map(l => l.modulo))];
    const acciones = [...new Set(list.map(l => l.accion))];

    const filtered = list.filter(e =>
        (filterAccion === "todos" || e.accion === filterAccion) &&
        (filterModulo === "todos" || e.modulo === filterModulo) &&
        (e.usuario.toLowerCase().includes(search.toLowerCase()) ||
            e.detalle.toLowerCase().includes(search.toLowerCase()) ||
            e.modulo.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Registro de Auditoría</h2>
                <p className="text-muted-foreground mt-1 text-sm">Historial completo de acciones realizadas por los usuarios en el sistema.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { l: "Acciones hoy", v: list.filter(e => e.fecha === new Date().toISOString().split("T")[0]).length || list.filter(e => e.fecha === "2025-03-07").length, c: "text-blue-600 bg-blue-500/10", i: ClockIcon },
                    { l: "Usuarios activos", v: new Set(list.map(e => e.usuario)).size, c: "text-emerald-600 bg-emerald-500/10", i: UserIcon },
                    { l: "Total registros", v: list.length, c: "text-violet-600 bg-violet-500/10", i: DocumentTextIcon },
                    { l: "Módulos", v: modulos.length, c: "text-amber-600 bg-amber-500/10", i: DocumentTextIcon },
                ].map((k, i) => {
                    const Ic = k.i; return (
                        <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.c)}><Ic className="w-5 h-5" /></div>
                                <div><p className="text-xs font-medium text-muted-foreground">{k.l}</p><p className="text-lg font-bold">{k.v}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-[180px]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar por usuario, módulo o acción..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" />
                        </div>
                        <Select value={filterAccion} onValueChange={setFilterAccion}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="Acción" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas</SelectItem>
                                {acciones.map(a => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterModulo} onValueChange={setFilterModulo}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Módulo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                {modulos.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Fecha/Hora</TableHead>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Acción</TableHead>
                                    <TableHead>Módulo</TableHead>
                                    <TableHead>Detalle</TableHead>
                                    <TableHead>IP</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(e => {
                                    const Ic = ACCION_ICON[e.accion] || DocumentTextIcon;
                                    return (
                                        <TableRow key={e.id} className="hover:bg-muted/20">
                                            <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">{e.fecha} {e.hora}</TableCell>
                                            <TableCell className="font-semibold text-sm">{e.usuario}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("text-xs gap-1 capitalize", ACCION_STYLES[e.accion] || "bg-muted")}>
                                                    <Ic className="w-3 h-3" /> {e.accion}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className="text-xs">{e.modulo}</Badge></TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[280px] truncate">{e.detalle}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{e.ip}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No hay registros.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
