"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Lock, Building2, Receipt, KeySquare, CheckCircle2, Upload, Image, Save, BadgeCheck, Palette, FileText, Mail, Phone, MapPin, Globe, X, Eye } from "lucide-react";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedLogo = localStorage.getItem('lollipop_company_logo');
        if (savedLogo) setLogo(savedLogo);
        // Restore company info
        const raw = localStorage.getItem('lollipop_company_settings');
        if (raw) {
            try {
                const co = JSON.parse(raw);
                if (co.name) setRazon(co.name);
                if (co.comercialName) setNombreComercial(co.comercialName);
                if (co.rnc) setRnc(co.rnc);
                if (co.address) setDireccion(co.address);
                if (co.phone) setTelefono(co.phone);
                if (co.email) setEmail(co.email);
                if (co.web) setWeb(co.web);
            } catch { }
        }
    }, []);

    // Company info state
    const [razon, setRazon] = useState("Mi Empresa Dominicana SRL");
    const [nombreComercial, setNombreComercial] = useState("Mi Empresa");
    const [rnc, setRnc] = useState("130123456");
    const [direccion, setDireccion] = useState("Av. Winston Churchill Esq. Sarasota, Distrito Nacional");
    const [telefono, setTelefono] = useState("809-555-0000");
    const [email, setEmail] = useState("recepcion@miempresa.com");
    const [web, setWeb] = useState("www.miempresa.com.do");
    const [municipio, setMunicipio] = useState("Distrito Nacional");
    const [provincia, setProvincia] = useState("Santo Domingo");

    // Invoice/quote customization
    const [colorPrimario, setColorPrimario] = useState("#7c3aed");
    const [moneda, setMoneda] = useState("DOP");
    const [terminoPago, setTerminoPago] = useState("30");
    const [piePagina, setPiePagina] = useState("Gracias por su preferencia. Sujeto a ITBIS. Valido por 30 dias.");
    const [notaFactura, setNotaFactura] = useState("Los pagos deben realizarse dentro del plazo indicado. Mora de 2% mensual por atraso.");
    const [notaCotizacion, setNotaCotizacion] = useState("Esta cotizacion es valida por 15 dias habiles a partir de la fecha de emision.");
    const [mostrarLogo, setMostrarLogo] = useState(true);
    const [mostrarRnc, setMostrarRnc] = useState(true);
    const [mostrarTelefono, setMostrarTelefono] = useState(true);
    const [mostrarEmail, setMostrarEmail] = useState(true);
    const [mostrarWeb, setMostrarWeb] = useState(true);
    const [mostrarDireccion, setMostrarDireccion] = useState(true);

    const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogo(base64);
                localStorage.setItem('lollipop_company_logo', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogo(null);
        localStorage.removeItem('lollipop_company_logo');
    };

    const handleSave = () => {
        // Persist company info so invoices can read it
        localStorage.setItem('lollipop_company_settings', JSON.stringify({
            name: razon,
            comercialName: nombreComercial,
            rnc,
            address: direccion,
            phone: telefono,
            email,
            web,
        }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configuracion</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestiona la informacion de la empresa, facturacion DGII y permisos.</p>
                </div>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
                    {saved ? <BadgeCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Guardado!" : "Guardar Cambios"}
                </Button>
            </div>

            <Tabs defaultValue="empresa" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-[700px] h-auto p-1 bg-muted/50 backdrop-blur-md">
                    <TabsTrigger value="empresa" className="py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Building2 className="w-4 h-4 mr-2" /> Empresa</TabsTrigger>
                    <TabsTrigger value="documentos" className="py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><FileText className="w-4 h-4 mr-2" /> Documentos</TabsTrigger>
                    <TabsTrigger value="facturacion" className="py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Receipt className="w-4 h-4 mr-2" /> e-CF / DGII</TabsTrigger>
                    <TabsTrigger value="certificacion" className="py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><Lock className="w-4 h-4 mr-2" /> Certificado</TabsTrigger>
                    <TabsTrigger value="api" className="py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"><KeySquare className="w-4 h-4 mr-2" /> API</TabsTrigger>
                </TabsList>

                {/* ═══════════════════════════════════════ EMPRESA TAB ═══════════════════════════════════════ */}
                <TabsContent value="empresa" className="mt-6 space-y-6">
                    {/* Logo Upload */}
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Image className="w-5 h-5 text-purple-500" /> Logo de la Empresa</CardTitle>
                            <CardDescription>Este logo aparecera en tus facturas, cotizaciones, notas de credito y correos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="relative group shrink-0">
                                    {logo ? (
                                        <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 overflow-hidden bg-white">
                                            <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                            <button onClick={handleRemoveLogo} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => fileRef.current?.click()}
                                            className="w-28 h-28 rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
                                            <Upload className="w-6 h-6 text-purple-400" />
                                            <span className="text-[10px] text-purple-400 font-medium">Subir Logo</span>
                                        </button>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm font-medium">Formatos soportados: PNG, JPG, SVG</p>
                                    <p className="text-xs text-muted-foreground">Tamano recomendado: 400x150px o mayor. Fondo transparente recomendado.</p>
                                    <div className="flex gap-2 mt-3">
                                        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
                                            <Upload className="w-3.5 h-3.5" /> {logo ? "Cambiar" : "Subir Imagen"}
                                        </Button>
                                        {logo && <Button variant="outline" size="sm" onClick={handleRemoveLogo} className="text-red-500 hover:text-red-600 gap-1.5"><X className="w-3.5 h-3.5" /> Eliminar</Button>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Info */}
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-500" /> Informacion Legal</CardTitle>
                            <CardDescription>Estos datos aparecen en el encabezado de facturas, cotizaciones y notas de credito.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="razon">Razon Social *</Label><Input id="razon" value={razon} onChange={e => setRazon(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="nombreComercial">Nombre Comercial</Label><Input id="nombreComercial" value={nombreComercial} onChange={e => setNombreComercial(e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="rnc">RNC / Cedula *</Label><Input id="rnc" value={rnc} onChange={e => setRnc(e.target.value)} className="font-mono" /></div>
                                <div className="space-y-2"><Label htmlFor="telefono"><Phone className="w-3.5 h-3.5 inline mr-1" />Telefono</Label><Input id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="email"><Mail className="w-3.5 h-3.5 inline mr-1" />Email Recepcion e-CF</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="direccion"><MapPin className="w-3.5 h-3.5 inline mr-1" />Direccion Fiscal *</Label><Input id="direccion" value={direccion} onChange={e => setDireccion(e.target.value)} /></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="municipio">Municipio</Label><Input id="municipio" value={municipio} onChange={e => setMunicipio(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="provincia">Provincia</Label><Input id="provincia" value={provincia} onChange={e => setProvincia(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="web"><Globe className="w-3.5 h-3.5 inline mr-1" />Pagina Web</Label><Input id="web" value={web} onChange={e => setWeb(e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visibility toggles */}
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-purple-500" /> Visibilidad en Documentos</CardTitle>
                            <CardDescription>Elige que datos mostrar en el encabezado de facturas y cotizaciones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Logo", checked: mostrarLogo, onChange: setMostrarLogo },
                                    { label: "RNC / Cedula", checked: mostrarRnc, onChange: setMostrarRnc },
                                    { label: "Telefono", checked: mostrarTelefono, onChange: setMostrarTelefono },
                                    { label: "Email", checked: mostrarEmail, onChange: setMostrarEmail },
                                    { label: "Pagina Web", checked: mostrarWeb, onChange: setMostrarWeb },
                                    { label: "Direccion", checked: mostrarDireccion, onChange: setMostrarDireccion },
                                ].map(t => (
                                    <div key={t.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                                        <span className="text-sm font-medium">{t.label}</span>
                                        <Switch checked={t.checked} onCheckedChange={t.onChange} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ═══════════════════════════════════════ DOCUMENTOS TAB ═══════════════════════════════════════ */}
                <TabsContent value="documentos" className="mt-6 space-y-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-purple-500" /> Personalizacion de Documentos</CardTitle>
                            <CardDescription>Configura la apariencia y contenido por defecto de tus facturas y cotizaciones.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Color Primario</Label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" value={colorPrimario} onChange={e => setColorPrimario(e.target.value)} className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer" />
                                        <Input value={colorPrimario} onChange={e => setColorPrimario(e.target.value)} className="font-mono uppercase flex-1" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Moneda por Defecto</Label>
                                    <Select value={moneda} onValueChange={setMoneda}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DOP">DOP - Peso Dominicano</SelectItem>
                                            <SelectItem value="USD">USD - Dolar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Termino de Pago Default</Label>
                                    <Select value={terminoPago} onValueChange={setTerminoPago}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Contado</SelectItem>
                                            <SelectItem value="15">Credito 15 dias</SelectItem>
                                            <SelectItem value="30">Credito 30 dias</SelectItem>
                                            <SelectItem value="45">Credito 45 dias</SelectItem>
                                            <SelectItem value="60">Credito 60 dias</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-purple-500" /> Notas y Condiciones por Defecto</CardTitle>
                            <CardDescription>Textos que se insertan automaticamente al crear nuevos documentos. Puedes editarlos individualmente en cada factura.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Pie de pagina (facturas y cotizaciones)</Label>
                                <Textarea value={piePagina} onChange={e => setPiePagina(e.target.value)} className="min-h-[70px] resize-none bg-muted/10" placeholder="Texto que aparece al final de cada documento..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Nota de factura (condiciones de pago)</Label>
                                <Textarea value={notaFactura} onChange={e => setNotaFactura(e.target.value)} className="min-h-[70px] resize-none bg-muted/10" placeholder="Condiciones de pago, mora, etc..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Nota de cotizacion (validez)</Label>
                                <Textarea value={notaCotizacion} onChange={e => setNotaCotizacion(e.target.value)} className="min-h-[70px] resize-none bg-muted/10" placeholder="Validez de la cotizacion, condiciones, etc..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live Preview */}
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-purple-500" /> Vista Previa del Encabezado</CardTitle></CardHeader>
                        <CardContent>
                            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border/60 p-6">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        {mostrarLogo && (
                                            <div className="w-16 h-16 rounded-lg border flex items-center justify-center bg-muted/30 shrink-0 overflow-hidden">
                                                {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" /> :
                                                    <span className="text-2xl font-black bg-gradient-to-br from-purple-600 to-cyan-500 bg-clip-text text-transparent">L</span>}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-base" style={{ color: colorPrimario }}>{nombreComercial || razon}</p>
                                            {mostrarRnc && <p className="text-xs text-muted-foreground font-mono">RNC: {rnc}</p>}
                                            {mostrarDireccion && <p className="text-xs text-muted-foreground mt-1">{direccion}</p>}
                                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                                                {mostrarTelefono && <p className="text-xs text-muted-foreground">Tel: {telefono}</p>}
                                                {mostrarEmail && <p className="text-xs text-muted-foreground">{email}</p>}
                                                {mostrarWeb && <p className="text-xs text-muted-foreground">{web}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge style={{ backgroundColor: colorPrimario }} className="text-white text-xs border-0">FACTURA e-CF</Badge>
                                        <p className="text-xs text-muted-foreground mt-1 font-mono">E310000000001</p>
                                        <p className="text-xs text-muted-foreground">Credito {terminoPago} dias</p>
                                    </div>
                                </div>
                                {piePagina && (
                                    <div className="mt-4 pt-3 border-t border-dashed">
                                        <p className="text-[10px] text-muted-foreground italic">{piePagina}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ═══════════════════════════════════════ FACTURACION TAB ═══════════════════════════════════════ */}
                <TabsContent value="facturacion" className="mt-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle>Secuencias e-CF (Aprobado por DGII)</CardTitle>
                            <CardDescription>Control de proximas secuencias para garantizar la correcta continuidad.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {[
                                    { tipo: "B01", nombre: "Factura de Credito Fiscal (e-CF 31)", proximo: "E3100000006" },
                                    { tipo: "B02", nombre: "Factura de Consumo (e-CF 32)", proximo: "E3200000002" },
                                    { tipo: "B04", nombre: "Nota de Credito (e-CF 34)", proximo: "E3400000001" },
                                    { tipo: "B14", nombre: "Regimen Especial (e-CF 44)", proximo: "E4400000001" },
                                ].map((seq, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="font-mono text-xs">{seq.tipo}</Badge>
                                            <div>
                                                <p className="font-semibold text-sm">{seq.nombre}</p>
                                                <p className="text-xs text-muted-foreground font-mono">Proximo: {seq.proximo}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Actualizar</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ═══════════════════════════════════════ CERTIFICACION TAB ═══════════════════════════════════════ */}
                <TabsContent value="certificacion" className="mt-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle>Certificado Digital (Firma Electronica)</CardTitle>
                            <CardDescription>Gestion de tu certificado .p12 o .pfx utilizado para firmar tus facturas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-border p-6 flex items-start gap-4">
                                <div className="bg-green-500/10 p-3 rounded-full text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-semibold text-lg">Certificado Valido</h4>
                                    <p className="text-muted-foreground text-sm mt-1">El certificado digital de &quot;{razon}&quot; esta correctamente validado.</p>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-md">
                                        <div><span className="text-muted-foreground">Emitido a:</span><span className="font-medium block">{razon}</span></div>
                                        <div><span className="text-muted-foreground">Emitido por:</span><span className="font-medium block">Camara de Comercio (DigiFirma)</span></div>
                                        <div><span className="text-muted-foreground">Valido desde:</span><span className="font-medium block">15 Ago 2023</span></div>
                                        <div><span className="text-muted-foreground">Valido hasta:</span><span className="font-medium text-amber-600 block">15 Ago 2024</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">Renovar / Reemplazar (.p12)</Button>
                                <Button variant="outline">Probar Firma</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ═══════════════════════════════════════ API TAB ═══════════════════════════════════════ */}
                <TabsContent value="api" className="mt-6">
                    <Card className="bg-card/40 backdrop-blur-xl shadow-sm border-border/60">
                        <CardHeader>
                            <CardTitle>API Integrations</CardTitle>
                            <CardDescription>Conecta Lollipop con tus aplicaciones de terceros.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>API Key (Produccion)</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly type="password" value="api_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="font-mono bg-muted/30" />
                                        <Button variant="secondary">Revelar</Button>
                                        <Button variant="outline">Copiar</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">No compartas tu API Key en publico.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
