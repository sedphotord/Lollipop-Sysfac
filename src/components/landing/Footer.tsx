import Link from "next/link";
import { FileText, ShoppingCart, Calculator, Boxes, PieChart, Users, Store, Globe, Mail, Phone, MapPin } from "lucide-react";

const PRODUCT = [
    { label: "Facturacion e-CF", href: "/soluciones/facturacion-electronica" },
    { label: "Punto de Venta", href: "/soluciones/punto-de-venta" },
    { label: "Contabilidad", href: "/soluciones/contabilidad" },
    { label: "Inventario", href: "/soluciones/inventario" },
    { label: "Reportes", href: "/dashboard/reportes" },
];

const COMPANY = [
    { label: "Sobre Nosotros", href: "#" },
    { label: "Precios", href: "#pricing" },
    { label: "Blog", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Trabaja con Nosotros", href: "#" },
];

const LEGAL = [
    { label: "Terminos de Servicio", href: "#" },
    { label: "Politica de Privacidad", href: "#" },
    { label: "SLA", href: "#" },
];

export function Footer() {
    return (
        <footer className="border-t border-blue-100/30 dark:border-blue-900/20 bg-white dark:bg-neutral-950 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                            <span className="text-xl font-black tracking-tight">Lolli<span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">pop</span></span>
                        </Link>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 max-w-xs">Plataforma de facturacion electronica, contabilidad y gestion comercial para Republica Dominicana.</p>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> soporte@lollipop.do</p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 809-555-LOLI (5654)</p>
                            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Santo Domingo, RD</p>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-xs font-bold text-blue-400 tracking-[0.15em] uppercase mb-4">Producto</h4>
                        <ul className="space-y-2.5">
                            {PRODUCT.map(p => (
                                <li key={p.label}><Link href={p.href} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">{p.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-bold text-blue-400 tracking-[0.15em] uppercase mb-4">Empresa</h4>
                        <ul className="space-y-2.5">
                            {COMPANY.map(c => (
                                <li key={c.label}><Link href={c.href} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">{c.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-bold text-blue-400 tracking-[0.15em] uppercase mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {LEGAL.map(l => (
                                <li key={l.label}><Link href={l.href} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">{l.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-100/30 dark:border-blue-900/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">&copy; 2024 Lollipop. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">Certificado por</span>
                        <span className="px-2 py-0.5 bg-blue-100/80 dark:bg-blue-900/30 rounded text-[10px] font-bold text-blue-600">DGII</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
