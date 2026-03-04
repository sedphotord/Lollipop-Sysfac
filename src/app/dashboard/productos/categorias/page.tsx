"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Edit, List, Plus, Star, Tag } from "lucide-react";
import { useState } from "react";

const CATS = [
    { id: 1, nombre: "Hardware", color: "#3b82f6", productos: 5, descripcion: "Equipos y periféricos de cómputo" },
    { id: 2, nombre: "Software", color: "#8b5cf6", productos: 2, descripcion: "Licencias y aplicaciones" },
    { id: 3, nombre: "Servicios", color: "#10b981", productos: 3, descripcion: "Consultoría y soporte técnico" },
    { id: 4, nombre: "Papelería", color: "#f59e0b", productos: 1, descripcion: "Materiales de oficina" },
    { id: 5, nombre: "Mobiliario", color: "#ef4444", productos: 1, descripcion: "Muebles y accesorios de oficina" },
];

export default function CategoriasPage() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold tracking-tight">Categorías</h2><p className="text-muted-foreground mt-1 text-sm">Organiza tu catálogo de productos y servicios en categorías.</p></div>
                <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nueva Categoría</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {CATS.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase())).map(cat => (
                    <Card key={cat.id} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <CardContent className="p-5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}30` }}>
                                <Tag className="w-5 h-5" style={{ color: cat.color }} />
                            </div>
                            <p className="font-bold mb-1">{cat.nombre}</p>
                            <p className="text-xs text-muted-foreground mb-3 leading-snug">{cat.descripcion}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-xs"><List className="w-3 h-3 mr-1" />{cat.productos} productos</Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="w-3.5 h-3.5" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
