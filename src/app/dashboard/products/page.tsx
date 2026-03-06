"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle, Box, Briefcase, Camera, Clock, DollarSign,
    Download, Filter, Grid3X3, Image as ImageIcon, List, Package, Plus, Search, Sparkles,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────
type ItemType = "producto" | "servicio";

type CatalogItem = {
    id: string; type: ItemType; code: string; name: string; description: string;
    category: string; cost: number; price: number; itbis: number;
    status: "active" | "inactive"; attributes: { key: string; value: string }[];
    image?: string; // base64 data URL or URL path
    // Producto-specific
    brand?: string; supplier?: string; warehouse?: string;
    unitType?: string; size?: string; stock?: number | null;
    // Servicio-specific
    serviceType?: string; billingMode?: string; duration?: string;
    sla?: string; coverage?: string; deliverable?: string;
};

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_ITEMS: CatalogItem[] = [
    {
        id: "1", type: "servicio", code: "SRV-001", name: "Consultoría IT",
        description: "Asesoría técnica especializada en infraestructura y Cloud.",
        category: "Consultoría", cost: 2500, price: 5000, itbis: 18,
        status: "active", attributes: [],
        serviceType: "Técnico", billingMode: "Por hora", duration: "40 horas",
        sla: "24 horas", coverage: "L-V 8am-6pm", deliverable: "Informe ejecutivo"
    },
    {
        id: "2", type: "producto", code: "PRD-002", name: "Laptop Dell XPS 15",
        description: "Laptop profesional de alto rendimiento con pantalla OLED.",
        category: "Hardware", cost: 65000, price: 85000, itbis: 18,
        status: "active", attributes: [{ key: "RAM", value: "32GB" }, { key: "Almacenamiento", value: "1TB SSD" }],
        brand: "Dell", supplier: "Dell Latin America", warehouse: "Tienda Principal",
        unitType: "Unidad", size: "15.6\"", stock: 8
    },
    {
        id: "3", type: "producto", code: "PRD-003", name: "Libro de Contabilidad",
        description: "Manual práctico de contabilidad básica para PYMES.",
        category: "Papelería", cost: 900, price: 1500, itbis: 0,
        status: "active", attributes: [],
        brand: "Editora Nacional", supplier: "Papelería Herrera", warehouse: "Depósito 1",
        unitType: "Unidad", size: "A4", stock: 24
    },
    {
        id: "4", type: "servicio", code: "SRV-004", name: "Soporte Técnico Mensual",
        description: "Plan de mantenimiento preventivo y correctivo mensual.",
        category: "Soporte", cost: 6000, price: 12000, itbis: 18,
        status: "active", attributes: [],
        serviceType: "Soporte", billingMode: "Mensual", duration: "1 mes",
        sla: "4 horas", coverage: "7/24", deliverable: "Ticket de cierre"
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    "Servicio": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Consultoría": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Soporte": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    "Diseño": "bg-pink-500/10 text-pink-600 border-pink-500/20",
    "Hardware": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Software": "bg-sky-500/10 text-sky-600 border-sky-500/20",
    "Papelería": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Electrónica": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

type ViewMode = "grid" | "list";

// ─── Empty forms ──────────────────────────────────────────────────────────────
const emptyProduct = (): CatalogItem => ({
    id: "", type: "producto", code: "", name: "", description: "",
    category: "Hardware", cost: 0, price: 0, itbis: 18,
    status: "active", attributes: [],
    brand: "", supplier: "", warehouse: "Almacén Central",
    unitType: "Unidad", size: "", stock: 0
});

const emptyService = (): CatalogItem => ({
    id: "", type: "servicio", code: "", name: "", description: "",
    category: "Consultoría", cost: 0, price: 0, itbis: 18,
    status: "active", attributes: [],
    serviceType: "Técnico", billingMode: "Por hora", duration: "",
    sla: "", coverage: "L-V 8am-6pm", deliverable: ""
});

const CATALOG_KEY = "sysfac_catalog";

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value?: string; onChange: (b64: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => { if (ev.target?.result) onChange(ev.target.result as string); };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <div className={cn(
                "aspect-square rounded-2xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center",
                value ? "border-primary/30" : "border-border/40 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
            )}>
                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="preview" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-2xl">
                            <div className="text-white text-center">
                                <Camera className="w-6 h-6 mx-auto mb-1" />
                                <p className="text-xs font-bold">Cambiar foto</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="w-9 h-9 mx-auto mb-2 opacity-25" />
                        <p className="text-xs font-bold">Subir imagen</p>
                        <p className="text-[10px] opacity-60 mt-0.5">JPG, PNG, WEBP</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
    return <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">{children}</Label>;
}

function FieldInput({ value, onChange, placeholder, type = "text", className = "" }: {
    value: string | number; onChange: (v: string) => void;
    placeholder?: string; type?: string; className?: string;
}) {
    return (
        <Input
            type={type}
            className={cn("h-10 bg-background border-border/60 rounded-lg font-medium", className)}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}

function FieldSelect({ value, onChange, options, className = "" }: {
    value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[]; className?: string;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={cn("h-10 bg-background border-border/60 rounded-lg font-medium", className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
        </Select>
    );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
function ProductForm({ form, setForm }: { form: CatalogItem; setForm: (f: CatalogItem) => void }) {
    const F = (key: keyof CatalogItem) => (v: string) => setForm({ ...form, [key]: v });
    return (
        <div className="space-y-5">
            {/* Image + Identification */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="space-y-1.5">
                    <FieldLabel>Foto</FieldLabel>
                    <ImageUpload value={form.image} onChange={img => setForm({ ...form, image: img })} />
                </div>
                <div>
                    <p className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5" /> Identificación
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 col-span-2">
                            <FieldLabel>Nombre del Producto *</FieldLabel>
                            <FieldInput value={form.name} onChange={F("name")} placeholder="Ej. Laptop Dell XPS 15" />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Código / SKU</FieldLabel>
                            <FieldInput value={form.code} onChange={F("code")} placeholder="PRD-001" />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Categoría</FieldLabel>
                            <FieldSelect value={form.category} onChange={F("category")} options={[
                                { value: "Hardware", label: "Hardware" },
                                { value: "Software", label: "Software" },
                                { value: "Papelería", label: "Papelería" },
                                { value: "Electrónica", label: "Electrónica" },
                                { value: "Otro", label: "Otro" },
                            ]} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock & Logistics */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Logística e Inventario
                </p>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <FieldLabel>Almacén</FieldLabel>
                        <FieldSelect value={form.warehouse || "Almacén Central"} onChange={F("warehouse")} options={[
                            { value: "Almacén Central", label: "Almacén Central" },
                            { value: "Tienda Principal", label: "Tienda Principal" },
                            { value: "Depósito 1", label: "Depósito 1" },
                        ]} />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Unidad</FieldLabel>
                        <FieldSelect value={form.unitType || "Unidad"} onChange={F("unitType")} options={[
                            { value: "Unidad", label: "Unidad" },
                            { value: "Caja", label: "Caja" },
                            { value: "Kg", label: "Kilogramo" },
                            { value: "Litro", label: "Litro" },
                            { value: "Metro", label: "Metro" },
                        ]} />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Stock Inicial</FieldLabel>
                        <FieldInput type="number" value={form.stock ?? 0} onChange={v => setForm({ ...form, stock: parseInt(v) || 0 })} placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Marca</FieldLabel>
                        <FieldInput value={form.brand || ""} onChange={F("brand")} placeholder="Dell, HP, Apple..." />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Proveedor</FieldLabel>
                        <FieldInput value={form.supplier || ""} onChange={F("supplier")} placeholder="Nombre del suplidor" />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Talla / Tamaño</FieldLabel>
                        <FieldInput value={form.size || ""} onChange={F("size")} placeholder={'15.6", A4, XL...'} />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Precios y Fiscalidad
                </p>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <FieldLabel>Costo (RD$)</FieldLabel>
                        <FieldInput type="number" value={form.cost} onChange={v => setForm({ ...form, cost: parseFloat(v) || 0 })} placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <FieldLabel>Precio Venta (RD$)</FieldLabel>
                            {form.price > 0 && form.cost > 0 && (
                                <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", (((form.price - form.cost) / form.price) * 100) > 20 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                                    {(((form.price - form.cost) / form.price) * 100).toFixed(0)}% margen
                                </span>
                            )}
                        </div>
                        <FieldInput type="number" value={form.price} onChange={v => setForm({ ...form, price: parseFloat(v) || 0 })} placeholder="0.00" className="border-primary/30 bg-primary/5" />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>ITBIS (%)</FieldLabel>
                        <FieldSelect value={String(form.itbis)} onChange={v => setForm({ ...form, itbis: parseInt(v) })} options={[
                            { value: "18", label: "18% — ITBIS Estándar" },
                            { value: "16", label: "16% — ITBIS Reducido" },
                            { value: "0", label: "0% — Exento" },
                        ]} />
                    </div>
                </div>
            </div>

            {/* Attributes */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FieldLabel>Atributos personalizados</FieldLabel>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold"
                        onClick={() => setForm({ ...form, attributes: [...form.attributes, { key: '', value: '' }] })}>
                        <Plus className="w-3 h-3 mr-1" /> Añadir
                    </Button>
                </div>
                {form.attributes.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-3 bg-muted/30 rounded-lg">No hay atributos — Ej. Color, Material, Garantía</p>
                ) : (
                    <div className="space-y-2">
                        {form.attributes.map((attr, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input className="h-8 text-xs" placeholder="Atributo" value={attr.key} onChange={e => {
                                    const a = [...form.attributes]; a[idx].key = e.target.value; setForm({ ...form, attributes: a });
                                }} />
                                <Input className="h-8 text-xs" placeholder="Valor" value={attr.value} onChange={e => {
                                    const a = [...form.attributes]; a[idx].value = e.target.value; setForm({ ...form, attributes: a });
                                }} />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 shrink-0" onClick={() => {
                                    setForm({ ...form, attributes: form.attributes.filter((_, i) => i !== idx) });
                                }}><XCircle className="w-3.5 h-3.5" /></Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                    className="w-full h-20 bg-background border border-border/60 rounded-lg p-3 text-sm font-medium focus:ring-primary focus:outline-none resize-none"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Descripción detallada del producto..."
                />
            </div>
        </div>
    );
}

// ─── Service Form ─────────────────────────────────────────────────────────────
function ServiceForm({ form, setForm }: { form: CatalogItem; setForm: (f: CatalogItem) => void }) {
    const F = (key: keyof CatalogItem) => (v: string) => setForm({ ...form, [key]: v });
    return (
        <div className="space-y-5">
            {/* Image + Identity */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="space-y-1.5">
                    <FieldLabel>Imagen</FieldLabel>
                    <ImageUpload value={form.image} onChange={img => setForm({ ...form, image: img })} />
                </div>
                <div>
                    <p className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Identificación del Servicio
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 col-span-2">
                            <FieldLabel>Nombre del Servicio *</FieldLabel>
                            <FieldInput value={form.name} onChange={F("name")} placeholder="Ej. Soporte Técnico Mensual" />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Código</FieldLabel>
                            <FieldInput value={form.code} onChange={F("code")} placeholder="SRV-001" />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>Categoría de Servicio</FieldLabel>
                            <FieldSelect value={form.category} onChange={F("category")} options={[
                                { value: "Consultoría", label: "Consultoría" },
                                { value: "Soporte", label: "Soporte Técnico" },
                                { value: "Diseño", label: "Diseño y Creatividad" },
                                { value: "Desarrollo", label: "Desarrollo de Software" },
                                { value: "Capacitación", label: "Capacitación y Training" },
                                { value: "Legal", label: "Legal y Compliance" },
                                { value: "Contabilidad", label: "Contabilidad" },
                                { value: "Marketing", label: "Marketing" },
                            ]} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tipo Servicio + Modalidad */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <FieldLabel>Tipo de Servicio</FieldLabel>
                    <FieldSelect value={form.serviceType || "Técnico"} onChange={F("serviceType")} options={[
                        { value: "Técnico", label: "🔧 Técnico" },
                        { value: "Profesional", label: "💼 Profesional" },
                        { value: "Creativo", label: "🎨 Creativo" },
                        { value: "Administrativo", label: "📋 Administrativo" },
                        { value: "Formativo", label: "📚 Formativo" },
                    ]} />
                </div>
                <div className="space-y-1.5">
                    <FieldLabel>Modalidad de Cobro</FieldLabel>
                    <FieldSelect value={form.billingMode || "Por hora"} onChange={F("billingMode")} options={[
                        { value: "Por hora", label: "⏱ Por hora" },
                        { value: "Por proyecto", label: "📁 Por proyecto (fijo)" },
                        { value: "Mensual", label: "📆 Mensual (recurrente)" },
                        { value: "Anual", label: "📅 Anual (recurrente)" },
                        { value: "Por sesión", label: "🎯 Por sesión" },
                        { value: "Por entregable", label: "📦 Por entregable" },
                    ]} />
                </div>
            </div>

            {/* SLA & Coverage */}
            <div className="bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-600 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Cobertura y Entregables
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <FieldLabel>Duración Estimada</FieldLabel>
                        <FieldInput value={form.duration || ""} onChange={F("duration")} placeholder="Ej. 40 horas, 1 mes..." />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>SLA / Tiempo de Respuesta</FieldLabel>
                        <FieldSelect value={form.sla || ""} onChange={F("sla")} options={[
                            { value: "1 hora", label: "1 hora" },
                            { value: "4 horas", label: "4 horas" },
                            { value: "8 horas", label: "8 horas" },
                            { value: "24 horas", label: "24 horas" },
                            { value: "48 horas", label: "48 horas" },
                            { value: "N/A", label: "No aplica" },
                        ]} />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Horario de Cobertura</FieldLabel>
                        <FieldSelect value={form.coverage || "L-V 8am-6pm"} onChange={F("coverage")} options={[
                            { value: "L-V 8am-5pm", label: "L-V 8am–5pm" },
                            { value: "L-V 8am-6pm", label: "L-V 8am–6pm" },
                            { value: "L-S 8am-6pm", label: "L-S 8am–6pm" },
                            { value: "7/24", label: "7/24 — Todo el tiempo" },
                            { value: "A convenir", label: "A convenir" },
                        ]} />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>Entregable Principal</FieldLabel>
                        <FieldInput value={form.deliverable || ""} onChange={F("deliverable")} placeholder="Informe, código, diseño..." />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Precios y Fiscalidad
                </p>
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <FieldLabel>Costo Interno (RD$)</FieldLabel>
                        <FieldInput type="number" value={form.cost} onChange={v => setForm({ ...form, cost: parseFloat(v) || 0 })} placeholder="0.00" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <FieldLabel>Precio de Venta (RD$)</FieldLabel>
                            {form.price > 0 && form.cost > 0 && (
                                <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", (((form.price - form.cost) / form.price) * 100) > 30 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                                    {(((form.price - form.cost) / form.price) * 100).toFixed(0)}% margen
                                </span>
                            )}
                        </div>
                        <FieldInput type="number" value={form.price} onChange={v => setForm({ ...form, price: parseFloat(v) || 0 })} placeholder="0.00" className="border-primary/30 bg-primary/5" />
                    </div>
                    <div className="space-y-1.5">
                        <FieldLabel>ITBIS (%)</FieldLabel>
                        <FieldSelect value={String(form.itbis)} onChange={v => setForm({ ...form, itbis: parseInt(v) })} options={[
                            { value: "18", label: "18% — ITBIS Estándar" },
                            { value: "16", label: "16% — ITBIS Reducido" },
                            { value: "0", label: "0% — Exento" },
                        ]} />
                    </div>
                </div>
            </div>

            {/* Attributes */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FieldLabel>Características adicionales</FieldLabel>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold"
                        onClick={() => setForm({ ...form, attributes: [...form.attributes, { key: '', value: '' }] })}>
                        <Plus className="w-3 h-3 mr-1" /> Añadir
                    </Button>
                </div>
                {form.attributes.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-3 bg-muted/30 rounded-lg">Sin características — Ej. Número de usuarios, Idioma, Plataforma</p>
                ) : (
                    <div className="space-y-2">
                        {form.attributes.map((attr, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input className="h-8 text-xs" placeholder="Característica" value={attr.key} onChange={e => {
                                    const a = [...form.attributes]; a[idx].key = e.target.value; setForm({ ...form, attributes: a });
                                }} />
                                <Input className="h-8 text-xs" placeholder="Valor" value={attr.value} onChange={e => {
                                    const a = [...form.attributes]; a[idx].value = e.target.value; setForm({ ...form, attributes: a });
                                }} />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 shrink-0" onClick={() => {
                                    setForm({ ...form, attributes: form.attributes.filter((_, i) => i !== idx) });
                                }}><XCircle className="w-3.5 h-3.5" /></Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <FieldLabel>Descripción del Servicio</FieldLabel>
                <textarea
                    className="w-full h-20 bg-background border border-border/60 rounded-lg p-3 text-sm font-medium focus:ring-primary focus:outline-none resize-none"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Descripción detallada: alcance, limitaciones, condiciones..."
                />
            </div>
        </div>
    );
}

// ─── Catalog Modal ─────────────────────────────────────────────────────────────
function CatalogModal({
    open, onOpenChange, itemType, isEditing, form, setForm, onSave, onDelete, onToggleStatus
}: {
    open: boolean; onOpenChange: (v: boolean) => void;
    itemType: ItemType; isEditing: boolean;
    form: CatalogItem; setForm: (f: CatalogItem) => void;
    onSave: () => void; onDelete: () => void; onToggleStatus: () => void;
}) {
    const isProduct = itemType === "producto";
    const accentColor = isProduct ? "text-blue-600" : "text-violet-600";
    const accentBg = isProduct ? "from-blue-500/20 to-blue-500/5 border-blue-500/20" : "from-violet-500/20 to-violet-500/5 border-violet-500/20";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
                {/* Header */}
                <div className={cn("relative overflow-hidden px-6 pt-6 pb-5", isProduct ? "bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20" : "bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/20")}>
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: isProduct ? '#3b82f6' : '#8b5cf6' }} />
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-tr border flex items-center justify-center shrink-0", accentBg)}>
                                    {isProduct
                                        ? <Package className="w-6 h-6 text-blue-600" />
                                        : <Briefcase className="w-6 h-6 text-violet-600" />
                                    }
                                </div>
                                <div>
                                    <DialogTitle className={cn("text-xl font-black tracking-tight", accentColor)}>
                                        {isEditing
                                            ? `Editar ${isProduct ? 'Producto' : 'Servicio'}`
                                            : `Nuevo ${isProduct ? 'Producto' : 'Servicio'}`
                                        }
                                    </DialogTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {isEditing ? form.name : (isProduct ? 'Completa los datos del producto físico' : 'Define las características del servicio')}
                                    </p>
                                    <DialogDescription className="sr-only">Modal de creación/edición</DialogDescription>
                                </div>
                            </div>
                            {isEditing && (
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button onClick={onToggleStatus} variant="outline" size="sm" className="h-8 text-xs">
                                        {form.status === 'active' ? '⏸ Desactivar' : '▶ Activar'}
                                    </Button>
                                    <Button onClick={onDelete} variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:bg-red-50">
                                        Eliminar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                </div>

                {/* Scrollable form */}
                <div className="overflow-y-auto max-h-[60vh] px-6 py-5">
                    {isProduct
                        ? <ProductForm form={form} setForm={setForm} />
                        : <ServiceForm form={form} setForm={setForm} />
                    }
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border/60 flex gap-3">
                    <Button variant="ghost" className="flex-1 h-11" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button
                        className={cn("flex-1 h-11 font-bold text-white", isProduct ? "bg-blue-600 hover:bg-blue-700" : "bg-violet-600 hover:bg-violet-700")}
                        onClick={onSave}
                        disabled={!form.name}
                    >
                        {isEditing
                            ? `Guardar ${isProduct ? 'Producto' : 'Servicio'}`
                            : `Crear ${isProduct ? 'Producto' : 'Servicio'}`
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const [view, setView] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "producto" | "servicio">("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentType, setCurrentType] = useState<ItemType>("producto");
    const [form, setForm] = useState<CatalogItem>(emptyProduct());
    const [items, setItems] = useState<CatalogItem[]>(INITIAL_ITEMS);

    // Load from / save to localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(CATALOG_KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch { }
    }, []);

    const persistItems = (next: CatalogItem[]) => {
        setItems(next);
        try { localStorage.setItem(CATALOG_KEY, JSON.stringify(next)); } catch { }
    };

    const categories = Array.from(new Set(items.map(p => p.category)));

    const filtered = items.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || p.type === typeFilter;
        const matchCat = categoryFilter === "all" || p.category === categoryFilter;
        return matchSearch && matchType && matchCat;
    });

    const openCreate = (type: ItemType) => {
        setCurrentType(type);
        setForm(type === "producto" ? emptyProduct() : emptyService());
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEdit = (item: CatalogItem) => {
        setCurrentType(item.type);
        setForm({ ...item });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const prefix = currentType === "producto" ? "PRD" : "SRV";
        const saved = {
            ...form,
            id: isEditing ? form.id : Math.random().toString(),
            code: form.code || `${prefix}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        };
        const next = isEditing ? items.map(i => i.id === saved.id ? saved : i) : [saved, ...items];
        persistItems(next);
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (confirm("¿Eliminar este elemento del catálogo?")) {
            persistItems(items.filter(i => i.id !== form.id));
            setIsModalOpen(false);
        }
    };

    const handleToggleStatus = () => {
        setForm(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }));
    };

    const getMarginColor = (cost: number, price: number) => {
        const m = price > 0 ? ((price - cost) / price) * 100 : 0;
        if (m >= 30) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
        if (m >= 15) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
        return "text-red-600 bg-red-500/10 border-red-500/20";
    };

    const getMarginValue = (cost: number, price: number) =>
        price > 0 ? (((price - cost) / price) * 100).toFixed(1) : "0.0";

    const totalItems = items.length;
    const activeItems = items.filter(p => p.status === 'active').length;
    const products = items.filter(p => p.type === 'producto');
    const services = items.filter(p => p.type === 'servicio');
    const lowStock = products.filter(p => (p.stock ?? 99) <= 3).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Catálogo</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Productos físicos y servicios con ITBIS configurado.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => openCreate("producto")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                        <Package className="w-4 h-4 mr-2" /> Nuevo Producto
                    </Button>
                    <Button onClick={() => openCreate("servicio")} className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
                        <Briefcase className="w-4 h-4 mr-2" /> Nuevo Servicio
                    </Button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Catálogo", value: totalItems, icon: Package, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Productos", value: products.length, icon: Box, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Servicios", value: services.length, icon: Briefcase, color: "text-violet-600 bg-violet-500/10" },
                    { label: "Stock Bajo", value: lowStock, icon: AlertTriangle, color: lowStock > 0 ? "text-amber-600 bg-amber-500/10" : "text-muted-foreground bg-muted" },
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
                        {/* Type filter tabs */}
                        <div className="flex gap-1 border rounded-lg p-1 bg-background h-10 shrink-0">
                            {(["all", "producto", "servicio"] as const).map(t => (
                                <button key={t}
                                    onClick={() => setTypeFilter(t)}
                                    className={cn("px-3 h-8 rounded-md text-xs font-bold transition-colors", typeFilter === t ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                >
                                    {t === "all" ? "Todos" : t === "producto" ? "Productos" : "Servicios"}
                                </button>
                            ))}
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[160px] bg-background">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
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
                    {filtered.map(item => (
                        <Card key={item.id}
                            onClick={() => openEdit(item)}
                            className={cn(
                                "bg-card/50 backdrop-blur-xl border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 group cursor-pointer",
                                item.status === 'inactive' && "opacity-60 grayscale-[0.5]"
                            )}>
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    {item.image ? (
                                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/20 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.type === 'producto' ? "bg-blue-500/10 text-blue-600" : "bg-violet-500/10 text-violet-600")}>
                                            {item.type === 'producto' ? <Package className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                                        </div>
                                    )}
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", CATEGORY_COLORS[item.category] || "bg-muted")}>
                                            {item.category}
                                        </Badge>
                                        <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 font-bold uppercase", item.type === 'producto' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-violet-50 text-violet-600 border-violet-200")}>
                                            {item.type === 'producto' ? '📦 Producto' : '⚡ Servicio'}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="font-mono text-[10px] text-muted-foreground mb-1">{item.code}{item.brand ? ` • ${item.brand}` : ''}</p>
                                <h3 className="font-bold text-sm leading-snug mb-0.5 group-hover:text-primary transition-colors">{item.name}</h3>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 h-7 mb-3">{item.description}</p>

                                {item.type === 'servicio' && item.billingMode && (
                                    <div className="flex items-center gap-1 mb-3">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground">{item.billingMode}</span>
                                        {item.sla && <><span className="text-muted-foreground/40 mx-1">•</span><span className="text-[10px] text-muted-foreground">SLA {item.sla}</span></>}
                                    </div>
                                )}
                                {item.type === 'producto' && item.stock !== undefined && item.stock !== null && (
                                    <div className="flex items-center gap-1 mb-3">
                                        <Package className="w-3 h-3 text-muted-foreground" />
                                        <span className={cn("text-[10px] font-bold", (item.stock ?? 0) <= 3 ? "text-amber-600" : "text-foreground")}>{item.stock} en stock</span>
                                        {item.unitType && <><span className="text-muted-foreground/40 mx-1">•</span><span className="text-[10px] text-muted-foreground">{item.unitType}</span></>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-muted-foreground uppercase font-bold">Precio</p>
                                        <p className="text-sm font-black text-primary">RD$ {item.price.toLocaleString()}</p>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[10px] font-black", getMarginColor(item.cost, item.price))}>
                                        {getMarginValue(item.cost, item.price)}% margen
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Sin resultados para los filtros actuales.</p>
                        </div>
                    )}
                </div>
            )}

            {/* List View */}
            {view === 'list' && (
                <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm overflow-hidden">
                    <div className="border rounded-lg overflow-hidden mx-4 mb-4 mt-4">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead className="text-right">Costo</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead>Margen</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map(item => (
                                    <TableRow key={item.id} onClick={() => openEdit(item)}
                                        className="hover:bg-muted/20 transition-colors cursor-pointer border-b border-border/40">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.type === 'producto' ? "bg-blue-500/10 text-blue-600" : "bg-violet-500/10 text-violet-600")}>
                                                    {item.type === 'producto' ? <Package className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{item.name}</p>
                                                    <p className="font-mono text-[10px] text-muted-foreground">{item.code}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase", item.type === 'producto' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-violet-50 text-violet-600 border-violet-200")}>
                                                {item.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px]", CATEGORY_COLORS[item.category] || "bg-muted")}>
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold tabular-nums text-xs">RD$ {item.cost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-black tabular-nums text-sm text-primary">RD$ {item.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px] font-black h-6", getMarginColor(item.cost, item.price))}>
                                                {getMarginValue(item.cost, item.price)}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.type === 'servicio' ? (
                                                <span className="text-[10px] font-bold text-violet-500 uppercase">N/A</span>
                                            ) : (
                                                <span className={cn("text-sm font-black tabular-nums", (item.stock ?? 0) === 0 ? "text-red-500" : (item.stock ?? 99) <= 3 ? "text-amber-500" : "text-foreground")}>
                                                    {item.stock ?? 0}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px] font-black uppercase h-6", item.status === 'active' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' : '')}>
                                                {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Unified Modal */}
            <CatalogModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                itemType={currentType}
                isEditing={isEditing}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
}
