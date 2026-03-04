"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, SlidersHorizontal } from "lucide-react";

const ATTRS = [
    { nombre: "Color", valores: ["Negro", "Blanco", "Gris", "Plata"], productos: 4 },
    { nombre: "Tamaño", valores: ['13"', '15"', '17"', '24"', '27"'], productos: 3 },
    { nombre: "Garantía", valores: ["6 meses", "1 año", "2 años", "3 años"], productos: 6 },
    { nombre: "Voltaje", valores: ["110V", "220V", "Dual"], productos: 2 },
];

export default function AtributosPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Atributos</h2><p className="text-muted-foreground mt-1 text-sm">Define variantes de productos (color, tamaño, garantía, etc.).</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Atributo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ATTRS.map((attr, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600"><SlidersHorizontal className="w-4 h-4" /></div>
                                <Badge variant="outline" className="text-xs text-muted-foreground">{attr.productos} productos</Badge>
                            </div>
                            <p className="font-bold mb-3">{attr.nombre}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {attr.valores.map(v => <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
