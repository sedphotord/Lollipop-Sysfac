"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    PlusIcon, KeyIcon, ArrowPathIcon, CheckCircleIcon,
    LinkIcon, ServerIcon, EyeIcon, EyeSlashIcon, TrashIcon, ClipboardDocumentIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const LS_KEY = "lollipop_api_keys";

type ApiKey = { id: string; nombre: string; key: string; activa: boolean; creada: string; ultimoUso: string };

const genKey = () => `loll_sk_${Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")}`;

const INTEGRACIONES = [
    { id: "dgii", nombre: "DGII e-CF", desc: "Facturación electrónica oficial", status: "conectado", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    { id: "whatsapp", nombre: "WhatsApp Business", desc: "Notificaciones y facturas por WhatsApp", status: "no conectado", color: "text-muted-foreground bg-muted" },
    { id: "quickbooks", nombre: "QuickBooks", desc: "Sincronización contable", status: "no conectado", color: "text-muted-foreground bg-muted" },
    { id: "hubspot", nombre: "HubSpot CRM", desc: "Sincronización de clientes y cotizaciones", status: "no conectado", color: "text-muted-foreground bg-muted" },
];

export default function IntegracionesPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [open, setOpen] = useState(false);
    const [nombre, setNombre] = useState("");
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState("");

    useEffect(() => { try { const r = localStorage.getItem(LS_KEY); setKeys(r ? JSON.parse(r) : []); } catch { } }, []);
    const persist = (data: ApiKey[]) => { setKeys(data); try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { } };

    const handleCreate = () => {
        if (!nombre) return;
        const k: ApiKey = { id: Date.now().toString(), nombre, key: genKey(), activa: true, creada: new Date().toISOString().split("T")[0], ultimoUso: "Nunca" };
        persist([k, ...keys]);
        setNombre(""); setOpen(false);
    };

    const copy = (k: string) => { navigator.clipboard.writeText(k); setCopied(k); setTimeout(() => setCopied(""), 2000); };
    const toggleKey = (id: string) => persist(keys.map(k => k.id === id ? { ...k, activa: !k.activa } : k));
    const removeKey = (id: string) => persist(keys.filter(k => k.id !== id));
    const toggleVis = (id: string) => setShowKeys(p => ({ ...p, [id]: !p[id] }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Integraciones y API</h2>
                <p className="text-muted-foreground mt-1 text-sm">Conecta tu cuenta con servicios externos y gestiona las claves de la API.</p>
            </div>

            {/* Integrations */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-sm flex items-center gap-2 mb-4"><LinkIcon className="w-4 h-4 text-blue-500" /> Conexiones disponibles</h3>
                    {INTEGRACIONES.map(int => (
                        <div key={int.id} className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><ServerIcon className="w-5 h-5 text-muted-foreground" /></div>
                                <div>
                                    <p className="font-semibold text-sm">{int.nombre}</p>
                                    <p className="text-xs text-muted-foreground">{int.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={cn("text-xs", int.color)}>{int.status}</Badge>
                                <Button variant="outline" size="sm" className="text-xs" disabled={int.status === "conectado"}>{int.status === "conectado" ? "Configurar" : "Conectar"}</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm flex items-center gap-2"><KeyIcon className="w-4 h-4 text-blue-500" /> Claves de API</h3>
                        <Button size="sm" className="gap-2 bg-gradient-brand border-0 text-white text-xs" onClick={() => setOpen(true)}>
                            <PlusIcon className="w-4 h-4" /> Nueva clave
                        </Button>
                    </div>

                    {keys.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground rounded-xl border-2 border-dashed border-border/40">
                            No tienes claves de API creadas aún.
                        </div>
                    )}

                    <div className="space-y-3">
                        {keys.map(k => (
                            <div key={k.id} className={cn("rounded-xl border border-border/60 p-4 flex items-center gap-4 group", !k.activa && "opacity-50")}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-sm">{k.nombre}</p>
                                        <Badge variant="outline" className={cn("text-[10px]", k.activa ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-muted-foreground")}>{k.activa ? "Activa" : "Desactivada"}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                            {showKeys[k.id] ? k.key : k.key.substring(0, 12) + "..." + k.key.slice(-6)}
                                        </code>
                                        <button onClick={() => toggleVis(k.id)} className="text-muted-foreground hover:text-foreground">
                                            {showKeys[k.id] ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                                        </button>
                                        <button onClick={() => copy(k.key)} className="text-muted-foreground hover:text-blue-500">
                                            {copied === k.key ? <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Creada: {k.creada} · Último uso: {k.ultimoUso}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={k.activa} onCheckedChange={() => toggleKey(k.id)} />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100" onClick={() => removeKey(k.id)}>
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader><DialogTitle>Nueva Clave de API</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2"><Label>Nombre descriptivo</Label><Input placeholder="Integración producción" value={nombre} onChange={e => setNombre(e.target.value)} /></div>
                        <p className="text-xs text-muted-foreground">La clave se generará automáticamente. Guárdala en un lugar seguro, no podrás verla completa de nuevo.</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreate} className="bg-gradient-brand border-0 text-white" disabled={!nombre}>
                            <KeyIcon className="w-4 h-4 mr-2" /> Crear Clave
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
