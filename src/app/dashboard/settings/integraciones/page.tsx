"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, ExternalLink, Key, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
    { id: "dgii", name: "DGII — API e-CF", desc: "Envío y recepción de comprobantes electrónicos oficiales.", status: "conectado", category: "Fiscal", logo: "🏛️" },
    { id: "n8n", name: "n8n / Zapier", desc: "Automatiza flujos de trabajo con herramientas externas.", status: "disponible", category: "Automatización", logo: "⚡" },
    { id: "quickbooks", name: "QuickBooks", desc: "Sincroniza facturas y pagos con QuickBooks Online.", status: "disponible", category: "Contabilidad", logo: "📊" },
    { id: "paypal", name: "PayPal", desc: "Recibe pagos internacionales con PayPal.", status: "disponible", category: "Pagos", logo: "💳" },
    { id: "stripe", name: "Stripe", desc: "Pagos con tarjeta y suscripciones recurrentes.", status: "disponible", category: "Pagos", logo: "💳" },
    { id: "whatsapp", name: "WhatsApp Business", desc: "Envía facturas y cobros por WhatsApp automáticamente.", status: "beta", category: "Comunicación", logo: "💬" },
];

const STATUS_STYLE: Record<string, string> = {
    conectado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    disponible: "bg-muted text-muted-foreground border-border",
    beta: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const API_KEY = "lp_live_sk_3a7f8c2d1e9b4a5f6c8d0e2f3a4b5c6d";

export default function IntegracionesPage() {
    const [copied, setCopied] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(API_KEY);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">API &amp; Integraciones</h2>
                <p className="text-muted-foreground mt-1 text-sm">Conecta Lollipop con otras herramientas y servicios externos.</p>
            </div>

            {/* API Key */}
            <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/10 border-purple-200/50 dark:border-purple-800/30">
                <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                            <Key className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold">Clave API</p>
                            <p className="text-xs text-muted-foreground">Usa esta clave para conectar aplicaciones externas con tu cuenta.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Input value={API_KEY} readOnly className="font-mono text-xs bg-white/60 dark:bg-black/20" />
                        <Button variant="outline" className="shrink-0 gap-2" onClick={handleCopy}>
                            <Copy className="w-4 h-4" />
                            {copied ? "¡Copiado!" : "Copiar"}
                        </Button>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Integrations grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INTEGRATIONS.map(intg => (
                    <Card key={intg.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer"
                        onClick={() => setSelected(intg.id)}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">{intg.logo}</div>
                                <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLE[intg.status])}>
                                    {intg.status === "conectado" ? "● Conectado" : intg.status === "beta" ? "Beta" : "Disponible"}
                                </Badge>
                            </div>
                            <p className="font-bold text-sm mb-1">{intg.name}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{intg.desc}</p>
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-[10px]">{intg.category}</Badge>
                                <Button size="sm" variant={intg.status === "conectado" ? "outline" : "default"}
                                    className={cn("h-7 text-xs", intg.status !== "conectado" && "bg-primary")}>
                                    {intg.status === "conectado" ? "Configurar" : "Conectar"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurar Integración</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Ingresa las credenciales o clave de API para conectar esta integración con tu cuenta de Lollipop.</p>
                        <div className="space-y-2"><Label>Clave de API / Token</Label><Input placeholder="sk_live_..." className="font-mono" /></div>
                        <div className="space-y-2"><Label>Secret (si aplica)</Label><Input placeholder="sk_secret_..." className="font-mono" /></div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelected(null)}>Cancelar</Button>
                        <Button onClick={() => setSelected(null)}>Guardar y Conectar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
