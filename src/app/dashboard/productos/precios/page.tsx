"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, RefreshCw, Search, Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LISTAS = [
    { id: "LP-001", nombre: "Precio Estándar", descripcion: "Lista de precios base para todos los clientes", moneda: "DOP", productos: 8, status: "activa" },
    { id: "LP-002", nombre: "Precio Mayorista", descripcion: "Descuento del 15% sobre el precio estándar", moneda: "DOP", productos: 8, status: "activa" },
    { id: "LP-003", nombre: "Precio Export USD", descripcion: "Precios en dólares para clientes internacionales", moneda: "USD", productos: 5, status: "activa" },
];

export default function ListasPreciosPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Listas de Precios</h2><p className="text-muted-foreground mt-1 text-sm">Crea listas de precios diferenciadas por segmento de cliente o moneda.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Lista</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {LISTAS.map(lista => (
                    <Card key={lista.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Tag className="w-5 h-5" /></div>
                                <Badge variant="outline" className="text-xs">{lista.moneda}</Badge>
                            </div>
                            <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{lista.nombre}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{lista.descripcion}</p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{lista.productos} productos</span>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs">{lista.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
