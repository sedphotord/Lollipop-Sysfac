"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle, ArrowUpRight, DollarSign, Download, Filter,
    Grid3X3, List, Package, Plus, Search, ShoppingCart, Star, Tag, TrendingDown, TrendingUp, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const PRODUCTS = [
    {
        id: "1", code: "SRV-001", name: "Consultoría IT", description: "Asesoría técnica especializada",
        category: "Servicio", cost: 2500, price: 5000, itbis: 18,
        unit: "Unidad", unitType: "Unidad", brand: "Lollipop", supplier: "Interno",
        stock: null, status: "active", size: "N/A", warehouse: "Almacén Central"
    },
    {
        id: "2", code: "PRD-002", name: "Laptop Dell XPS 15", description: "Laptop profesional de alto rendimiento",
        category: "Hardware", cost: 65000, price: 85000, itbis: 18,
        unit: "Unidad", unitType: "Unidad", brand: "Dell", supplier: "Dell Latin America",
        stock: 8, status: "active", size: "15.6\"", warehouse: "Tienda Principal"
    },
    {
        id: "3", code: "PRD-003", name: "Libro de Contabilidad", description: "Manual práctico de contabilidad básica",
        category: "Papelería", cost: 900, price: 1500, itbis: 0,
        unit: "Unidad", unitType: "Unidad", brand: "Editora Nacional", supplier: "Papelería Herrera",
        stock: 24, status: "active", size: "A4", warehouse: "Depósito 1"
    },
    {
        id: "4", code: "SRV-004", name: "Soporte Técnico Mensual", description: "Mantenimiento preventivo mensual",
        category: "Servicio", cost: 6000, price: 12000, itbis: 18,
        unit: "Mes", unitType: "Unidad", brand: "Lollipop", supplier: "Interno",
        stock: null, status: "active", size: "N/A", warehouse: "Almacén Central"
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    "Servicio": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Hardware": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Software": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "Papelería": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const ITBIS_COLORS: Record<number, string> = {
    18: "bg-red-500/10 text-red-600 border-red-500/20",
    16: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    0: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

type ViewMode = "grid" | "list";

export default function ProductsPage() {
    const [view, setView] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const initialForm = {
        id: "",
        name: "",
        code: "",
        category: "Hardware",
        brand: "",
        supplier: "",
        warehouse: "Almacén Central",
        cost: "",
        price: "",
        itbis: "18",
        unitType: "Unidad",
        size: "",
        description: "",
        stock: "",
        attributes: [] as { key: string, value: string }[],
        status: "active" as "active" | "inactive"
    };

    const [form, setForm] = useState(initialForm);

    const [products, setProducts] = useState(PRODUCTS.map(p => ({ ...p, warehouse: "Almacén Central" })));

    const categories = Array.from(new Set(products.map(p => p.category)));

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === "all" || p.category === categoryFilter;
        return matchSearch && matchCat;
    });

    const openCreate = () => {
        setForm(initialForm);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEdit = (p: any) => {
        setForm({
            ...p,
            cost: p.cost.toString(),
            price: p.price.toString(),
            stock: (p.stock ?? "").toString(),
            itbis: p.itbis.toString(),
            attributes: p.attributes || [],
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const p = {
            ...form,
            id: isEditing ? form.id : Math.random().toString(),
            code: form.code || `PRD-${Math.floor(Math.random() * 1000)}`,
            cost: parseFloat(form.cost) || 0,
            price: parseFloat(form.price) || 0,
            itbis: parseInt(form.itbis),
            stock: form.category === 'Servicio' ? null : (parseInt(form.stock) || 0),
        };

        if (isEditing) {
            // @ts-ignore
            setProducts(products.map(item => item.id === p.id ? p : item));
        } else {
            // @ts-ignore
            setProducts([p, ...products]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            setProducts(products.filter(p => p.id !== id));
            setIsModalOpen(false);
        }
    };

    const toggleStatus = () => {
        setForm(prev => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active'
        }));
    };

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStock = products.filter(p => p.stock !== null && p.stock <= 3).length;

    const getMarginColor = (cost: number, price: number) => {
        const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
        if (margin >= 30) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
        if (margin >= 15) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
        return "text-red-600 bg-red-500/10 border-red-500/20";
    };

    const getMarginValue = (cost: number, price: number) => {
        return price > 0 ? (((price - cost) / price) * 100).toFixed(1) : "0.0";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Catálogo de Productos</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Productos y servicios con tasas ITBIS configuradas.</p>
                </div>
                <Button onClick={openCreate} className="bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Catálogo", value: totalProducts.toString(), icon: Package, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Activos", value: activeProducts.toString(), icon: Star, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Stock Bajo", value: lowStock.toString(), icon: AlertTriangle, color: lowStock > 0 ? "text-amber-600 bg-amber-500/10" : "text-muted-foreground bg-muted" },
                    { label: "Sin Stock", value: products.filter(p => p.stock === 0).length.toString(), icon: TrendingDown, color: "text-red-500 bg-red-500/10" },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", kpi.color)}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                                <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters + View Toggle */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Buscar por nombre o código..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-background" />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-1 border rounded-lg p-1 bg-background h-10 shrink-0">
                            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('grid')}><Grid3X3 className="w-4 h-4" /></Button>
                            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')}><List className="w-4 h-4" /></Button>
                        </div>
                        <Button variant="outline" className="shrink-0"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Grid View */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(product => (
                        <Card key={product.id}
                            onClick={() => openEdit(product)}
                            className={cn(
                                "bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group cursor-pointer",
                                product.status === 'inactive' && "opacity-60 grayscale-[0.5]"
                            )}>
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center text-primary">
                                        {product.category === 'Servicio' ? <Star className="w-6 h-6" /> :
                                            product.category === 'Software' ? <Tag className="w-6 h-6" /> :
                                                <Package className="w-6 h-6" />}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", CATEGORY_COLORS[product.category] || "bg-muted")}>
                                            {product.category}
                                        </Badge>
                                        {product.status === 'inactive' && <Badge variant="destructive" className="text-[8px] h-4 uppercase font-black">Agotado</Badge>}
                                    </div>
                                </div>

                                <p className="font-mono text-[10px] text-muted-foreground mb-1">{product.code} • {product.brand}</p>
                                <h3 className="font-bold text-sm leading-snug mb-0.5 group-hover:text-primary transition-colors">{product.name}</h3>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 h-7 mb-2">{product.description}</p>

                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 uppercase font-black", product.unitType === 'Peso' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600')}>
                                        {product.unitType}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground font-medium">{product.size}</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border border-border/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Costo</p>
                                        <p className="text-xs font-black text-foreground">RD$ {product.cost.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center bg-primary/5 p-2 rounded-lg border border-primary/10">
                                        <p className="text-[10px] font-bold text-primary uppercase">Precio</p>
                                        <p className="text-sm font-black text-primary">RD$ {product.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={cn("text-[10px] font-black", getMarginColor(product.cost, product.price))}>
                                        Margen {getMarginValue(product.cost, product.price)}%
                                    </Badge>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Almacén</p>
                                        <p className="text-[10px] font-black text-foreground truncate max-w-[80px]">{product.warehouse}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* List View */}
            {view === 'list' && (
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                    <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                        <Table>
                            <TableHeader className="bg-muted/50 text-[10px] uppercase font-black tracking-widest">
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Marca / Almacen</TableHead>
                                    <TableHead className="text-right">Costo</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead>Margen</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(product => (
                                    <TableRow key={product.id}
                                        onClick={() => openEdit(product)}
                                        className="hover:bg-muted/20 transition-colors group border-b border-border/40 cursor-pointer">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-foreground">{product.name}</span>
                                                <span className="font-mono text-[10px] text-muted-foreground">{product.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">{product.brand}</span>
                                                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{product.warehouse}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold tabular-nums text-xs">RD$ {product.cost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-black tabular-nums text-sm text-primary">RD$ {product.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px] font-black h-6", getMarginColor(product.cost, product.price))}>
                                                {getMarginValue(product.cost, product.price)}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {product.stock === null ? (
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">N/A</span>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <span className={cn(
                                                        "text-sm font-black tabular-nums",
                                                        product.stock === 0 ? "text-red-500" : product.stock <= 3 ? "text-amber-500" : "text-foreground"
                                                    )}>
                                                        {product.stock}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{product.unitType}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === 'active' ? 'outline' : 'destructive'} className={cn("text-[10px] font-black uppercase h-6", product.status === 'active' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' : 'font-black')}>
                                                {product.status === 'active' ? 'Activo' : 'Agotado'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* ── Unified Product Modal (Create & Edit) ────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[1050px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl bg-white">
                    <div className="p-6 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="w-5 h-5" />
                            </div>
                            <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">
                                {isEditing ? `Editar: ${form.name}` : 'Registrar Nuevo Producto'}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                {isEditing ? 'Editar los datos del producto seleccionado.' : 'Completa los datos para registrar un nuevo producto en el catálogo.'}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {isEditing && (
                                <>
                                    <Button onClick={toggleStatus} variant={form.status === 'active' ? 'outline' : 'destructive'} className="h-9 px-4 font-black text-[10px] uppercase rounded-lg border-gray-200 text-gray-700 hover:bg-gray-100">
                                        {form.status === 'active' ? 'Marcar como Agotado' : 'Activar Producto'}
                                    </Button>
                                    <Button onClick={() => handleDelete(form.id)} variant="ghost" className="h-9 px-4 font-black text-[10px] uppercase rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600">
                                        Eliminar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-5 gap-8">
                        {/* Left Column: Visuals & Stock Info */}
                        <div className="col-span-2 space-y-6">
                            <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden relative group">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Package className="w-20 h-20 text-gray-200" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <Button className="w-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-900 hover:bg-white font-bold gap-2">
                                        <Plus className="w-4 h-4" /> Cambiar Imagen
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-square bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>

                            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Control de Inventario</Label>
                                    <Badge className="bg-primary text-white text-[9px] font-black border-none uppercase h-5">{form.unitType}</Badge>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-3xl font-black text-primary">{form.stock || '0'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">En existencia</p>
                                    </div>
                                    {form.category !== 'Servicio' && (
                                        <div className="w-24">
                                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Ajustar</Label>
                                            <Input
                                                type="number"
                                                className="h-9 bg-white border-primary/20 text-gray-900 font-black text-center focus-visible:ring-primary"
                                                value={form.stock}
                                                onChange={e => setForm({ ...form, stock: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Columns: Data Form */}
                        <div className="col-span-3 space-y-6 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Nombre</Label>
                                    <Input className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Código / SKU</Label>
                                    <Input className="h-11 bg-gray-50 border-gray-200 text-gray-600 font-mono rounded-xl" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Categoría</Label>
                                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                        <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hardware">Hardware</SelectItem>
                                            <SelectItem value="Servicio">Servicio</SelectItem>
                                            <SelectItem value="Software">Software</SelectItem>
                                            <SelectItem value="Papelería">Papelería</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Almacén</Label>
                                    <Select value={form.warehouse} onValueChange={v => setForm({ ...form, warehouse: v })}>
                                        <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Almacén Central">Almacén Central</SelectItem>
                                            <SelectItem value="Tienda Principal">Tienda Principal</SelectItem>
                                            <SelectItem value="Depósito 1">Depósito 1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Marca</Label>
                                    <Input className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Proveedor</Label>
                                        <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-1 rounded">(Interno)</span>
                                    </div>
                                    <Input className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Costo (RD$)</Label>
                                    <Input type="number" className="h-11 bg-white border-gray-200 text-gray-900 font-black rounded-xl" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center h-4">
                                        <Label className="text-[10px] font-black uppercase text-primary tracking-wider">Precio de Venta (RD$)</Label>
                                        {parseFloat(form.price) > 0 && parseFloat(form.cost) > 0 && (
                                            <span className={cn(
                                                "text-[9px] font-black px-1.5 py-0.5 rounded-md",
                                                (((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price)) * 100) > 20 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                Ganancia: {(((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price)) * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                    <Input type="number" className="h-11 bg-primary/5 border-primary/20 text-gray-900 font-black rounded-xl focus-visible:ring-primary" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">ITBIS (%)</Label>
                                    <Select value={form.itbis} onValueChange={v => setForm({ ...form, itbis: v })}>
                                        <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="18">18%</SelectItem>
                                            <SelectItem value="16">16%</SelectItem>
                                            <SelectItem value="0">Exento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Unidad</Label>
                                    <Select value={form.unitType} onValueChange={v => setForm({ ...form, unitType: v })}>
                                        <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Unidad">Unidad</SelectItem>
                                            <SelectItem value="Peso">Peso</SelectItem>
                                            <SelectItem value="Servicio">Servicio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Tamaño / Equiv.</Label>
                                    <Input className="h-11 bg-white border-gray-200 text-gray-900 font-bold rounded-xl" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                                </div>
                            </div>

                            {/* Attributes Section */}
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase text-gray-700 tracking-wider">Atributos Adicionales</Label>
                                    <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold" onClick={() => setForm({ ...form, attributes: [...form.attributes, { key: '', value: '' }] })}>
                                        <Plus className="w-3 h-3 mr-1" /> Añadir
                                    </Button>
                                </div>
                                {form.attributes.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic text-center py-2">No hay atributos personalizados</p>
                                ) : (
                                    <div className="space-y-2">
                                        {form.attributes.map((attr, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input className="h-9 bg-white text-xs border-gray-200" placeholder="Ej. Color, Material" value={attr.key} onChange={e => {
                                                    const newAttrs = [...form.attributes];
                                                    newAttrs[idx].key = e.target.value;
                                                    setForm({ ...form, attributes: newAttrs });
                                                }} />
                                                <Input className="h-9 bg-white text-xs border-gray-200" placeholder="Valor" value={attr.value} onChange={e => {
                                                    const newAttrs = [...form.attributes];
                                                    newAttrs[idx].value = e.target.value;
                                                    setForm({ ...form, attributes: newAttrs });
                                                }} />
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 shrink-0" onClick={() => {
                                                    const newAttrs = form.attributes.filter((_, i) => i !== idx);
                                                    setForm({ ...form, attributes: newAttrs });
                                                }}>
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 pb-4">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Descripción</Label>
                                <textarea
                                    className="w-full h-20 bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 focus:ring-primary outline-none resize-none shadow-sm"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                        <Button variant="ghost" className="flex-1 h-12 font-black text-xs uppercase text-gray-500 hover:text-gray-900 hover:bg-gray-200" onClick={() => setIsModalOpen(false)}>Descartar</Button>
                        <Button
                            className="flex-1 h-12 bg-gradient-brand text-white font-black text-sm uppercase rounded-xl shadow-brand"
                            onClick={handleSave}
                        >
                            {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
