"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Plus, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

const ALMACENES = [
    { id: "ALM-001", nombre: "Almacén Principal", ubicacion: "Santo Domingo, D.N.", responsable: "Luis Fernández", productos: 12, capacidad: 85, status: "activo" },
    { id: "ALM-002", nombre: "Sucursal Santiago", ubicacion: "Santiago de los Caballeros", responsable: "Pedro Torres", productos: 6, capacidad: 40, status: "activo" },
    { id: "ALM-003", nombre: "Depósito La Romana", ubicacion: "La Romana", responsable: "María Santos", productos: 3, capacidad: 20, status: "inactivo" },
];

export default function AlmacenesPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Almacenes</h2><p className="text-muted-foreground mt-1 text-sm">Gestiona tus ubicaciones de inventario y controla el stock por almacén.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Almacén</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ALMACENES.map(alm => (
                    <Card key={alm.id} className={cn("bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group cursor-pointer", alm.status === 'inactivo' && 'opacity-60')}>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600"><Warehouse className="w-6 h-6" /></div>
                                <Badge variant="outline" className={cn("text-xs self-start", alm.status === 'activo' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10' : 'text-muted-foreground')}>{alm.status}</Badge>
                            </div>
                            <div>
                                <h3 className="font-bold text-base">{alm.nombre}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" />{alm.ubicacion}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Uso de capacidad</span><span className="font-semibold">{alm.capacidad}%</span></div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={cn("h-full rounded-full", alm.capacidad > 80 ? 'bg-amber-500' : alm.capacidad > 50 ? 'bg-blue-500' : 'bg-emerald-500')} style={{ width: `${alm.capacidad}%` }} /></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                                <span><Package className="inline w-3.5 h-3.5 mr-1" />{alm.productos} productos</span>
                                <span>Resp: {alm.responsable.split(' ')[0]}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
