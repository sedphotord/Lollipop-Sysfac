"use client";

import { useState } from "react";
import {
    Bell, Search, Filter, CheckCircle2, AlertCircle, Info,
    MoreVertical, Trash2, Check, ArrowRight, Settings, ExternalLink,
    FileText, UserPlus, CreditCard, ShieldCheck, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
    {
        id: "1",
        title: "Factura 0047 pagada",
        description: "CLARO DO completó el pago de su factura por un monto de RD$ 605,800.00 a través de transferencia bancaria.",
        type: "payment",
        category: "billing",
        status: "unread",
        date: "hace 5 min",
        icon: CreditCard,
        iconColor: "text-emerald-500 bg-emerald-500/10",
        action: { label: "Ver Factura", href: "/dashboard/invoices/0047" }
    },
    {
        id: "2",
        title: "DGII: Formato 607 pendiente",
        description: "El envío del formato 607 correspondiente al periodo Octubre 2024 vence en 3 días. Asegúrate de revisar tus comprobantes.",
        type: "warning",
        category: "dgii",
        status: "unread",
        date: "hace 1 h",
        icon: AlertCircle,
        iconColor: "text-amber-500 bg-amber-500/10",
        action: { label: "Ir a Reportes", href: "/dashboard/reportes/dgii" }
    },
    {
        id: "3",
        title: "Nuevo usuario registrado",
        description: "Ana García ha aceptado la invitación y ahora tiene acceso como 'Editor' en tu organización.",
        type: "success",
        category: "system",
        status: "unread",
        date: "hace 2 h",
        icon: UserPlus,
        iconColor: "text-blue-500 bg-blue-500/10",
        action: { label: "Gestionar Usuarios", href: "/dashboard/settings/usuarios" }
    },
    {
        id: "4",
        title: "Copia de seguridad completada",
        description: "Se ha generado exitosamente el respaldo diario de tu base de datos y archivos maestros.",
        type: "info",
        category: "system",
        status: "read",
        date: "Hoy, 4:00 AM",
        icon: ShieldCheck,
        iconColor: "text-slate-500 bg-slate-500/10"
    },
    {
        id: "5",
        title: "Recordatorio: Renovación de Certificado",
        description: "Tu certificado de firma digital (P12) vence en 15 días. Es necesario renovarlo para continuar emitiendo e-CF.",
        type: "error",
        category: "dgii",
        status: "read",
        date: "Ayer, 3:45 PM",
        icon: FileText,
        iconColor: "text-red-500 bg-red-500/10",
        action: { label: "Renovar Ahora", href: "/dashboard/settings/numeraciones" }
    },
    {
        id: "6",
        title: "Mensaje de soporte técnico",
        description: "Hemos respondido a tu consulta sobre la integración de la API. Revisa el ticket #8841.",
        type: "info",
        category: "system",
        status: "read",
        date: "28 Oct, 2024",
        icon: Mail,
        iconColor: "text-indigo-500 bg-indigo-500/10",
        action: { label: "Ver Ticket", href: "/dashboard/ayuda/tickets" }
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [searchQuery, setSearchQuery] = useState("");

    const unreadCount = notifications.filter(n => n.status === "unread").length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, status: "read" })));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, status: "read" } : n));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-white">
                        <Bell className="w-7 h-7 text-primary" />
                        Centro de Notificaciones
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gestiona tus alertas del sistema, avisos de la DGII y actividad de tu negocio.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-9 gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Marcar todas como leídas
                    </Button>
                    <Link href="/dashboard/settings/notificaciones">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                        <p className="text-xl font-black">{notifications.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-amber-500" />
                            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">No leídas</p>
                        <p className="text-xl font-black">{unreadCount}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 shadow-sm text-emerald-600">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">Estado del Sistema</p>
                        <p className="text-sm font-bold truncate">Todos los servicios activos</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <Tabs defaultValue="all" className="w-full">
                    <div className="px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-0">
                        <TabsList className="bg-transparent h-12 p-0 gap-6">
                            <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 h-12 text-sm font-bold">
                                Todas
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 h-12 text-sm font-bold">
                                Facturación
                            </TabsTrigger>
                            <TabsTrigger value="dgii" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 h-12 text-sm font-bold">
                                DGII Alertas
                            </TabsTrigger>
                            <TabsTrigger value="system" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 h-12 text-sm font-bold">
                                Sistema
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative pb-4 sm:pb-0 sm:mb-2 max-w-[240px] w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar alertas..."
                                className="pl-9 h-9 bg-muted/30 border-none rounded-full text-xs focus-visible:ring-1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {["all", "billing", "dgii", "system"].map((tab) => (
                            <TabsContent key={tab} value={tab} className="m-0 focus-visible:outline-none">
                                {filteredNotifications
                                    .filter(n => tab === "all" || n.category === tab)
                                    .length > 0 ? (
                                    filteredNotifications
                                        .filter(n => tab === "all" || n.category === tab)
                                        .map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "group flex items-start gap-4 p-5 sm:p-6 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/30",
                                                    notification.status === "unread" && "bg-blue-500/[0.02] border-l-4 border-l-primary"
                                                )}
                                            >
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", notification.iconColor)}>
                                                    <notification.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className={cn("text-sm font-bold leading-none truncate", notification.status === "unread" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                                                                {notification.title}
                                                            </h3>
                                                            {notification.status === "unread" && (
                                                                <Badge className="bg-primary text-[9px] h-3.5 px-1 font-bold uppercase tracking-wider">Nueva</Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{notification.date}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                                        {notification.description}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {notification.action && (
                                                                <Button asChild variant="default" size="sm" className="h-8 rounded-lg px-3 text-[11px] font-bold">
                                                                    <Link href={notification.action.href}>
                                                                        {notification.action.label} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            {notification.status === "unread" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/5"
                                                                    onClick={() => markAsRead(notification.id)}
                                                                >
                                                                    <Check className="w-3.5 h-3.5 mr-1.5" /> Marcar como leída
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-44">
                                                                    {notification.status === "unread" ? (
                                                                        <DropdownMenuItem onClick={() => markAsRead(notification.id)} className="gap-2 text-xs font-medium">
                                                                            <Check className="w-3.5 h-3.5" /> Marcar como leída
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem className="gap-2 text-xs font-medium">
                                                                            <Bell className="w-3.5 h-3.5" /> Volver a marcar no leída
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem className="gap-2 text-xs font-medium">
                                                                        <ExternalLink className="w-3.5 h-3.5" /> Compartir alerta
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                        className="gap-2 text-xs font-medium text-red-500 focus:text-red-500 focus:bg-red-500/5 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" /> Eliminar notificación
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                                            <Bell className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">No hay notificaciones</h4>
                                        <p className="text-xs text-muted-foreground max-w-[200px]">
                                            Todo está bajo control por aquí. Te avisaremos cuando ocurra algo importante.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>

            {/* Context Help */}
            <div className="bg-gradient-to-br from-primary/5 to-indigo-500/5 rounded-3xl p-6 border border-primary/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg shadow-primary/5 shrink-0">
                    <Info className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">¿Necesitas personalizar tus alertas?</h4>
                    <p className="text-xs text-muted-foreground">
                        Puedes configurar qué tipos de notificaciones deseas recibir y a través de qué canales (Email, Push, SMS) en la configuración de tu perfil.
                    </p>
                </div>
                <Button asChild variant="outline" className="shrink-0 h-10 px-6 rounded-xl font-bold bg-white dark:bg-slate-900">
                    <Link href="/dashboard/settings/notificaciones">Ir a Configuración</Link>
                </Button>
            </div>
        </div>
    );
}
