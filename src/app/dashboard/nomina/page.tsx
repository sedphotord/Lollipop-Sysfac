"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertTriangle, Calendar, CheckCircle, DollarSign, Download, FileText,
    Plus, Search, TrendingUp, User, Users2
} from "lucide-react";
import { cn } from "@/lib/utils";

const EMPLOYEES = [
    { id: "E001", name: "Ana García Torres", dept: "Tecnología", role: "Senior Developer", salary: 85000, status: "activo", startDate: "01 Feb 2022" },
    { id: "E002", name: "Roberto Méndez", dept: "Contabilidad", role: "Contador Senior", salary: 75000, status: "activo", startDate: "15 Mar 2021" },
    { id: "E003", name: "María Castillo", dept: "Ventas", role: "Ejecutiva de Cuentas", salary: 42000, status: "activo", startDate: "10 Ago 2023" },
    { id: "E004", name: "Luis Fernández", dept: "Logística", role: "Coordinador", salary: 38000, status: "activo", startDate: "01 Jan 2024" },
    { id: "E005", name: "Carmen Reyes", dept: "RRHH", role: "Gerente RRHH", salary: 62000, status: "activo", startDate: "20 May 2020" },
    { id: "E006", name: "Javier Ortiz", dept: "Ventas", role: "Vendedor", salary: 30000, status: "inactivo", startDate: "01 Sep 2023" },
];

const PAYROLL_HISTORY = [
    { period: "Octubre 2024", date: "31 Oct 2024", employees: 5, gross: 302000, deductions: 37750, net: 264250, status: "procesado" },
    { period: "Septiembre 2024", date: "30 Sep 2024", employees: 5, gross: 302000, deductions: 37750, net: 264250, status: "procesado" },
    { period: "Agosto 2024", date: "31 Aug 2024", employees: 6, gross: 332000, deductions: 41500, net: 290500, status: "procesado" },
];

const DEPT_COLORS: Record<string, string> = {
    "Tecnología": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Contabilidad": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Ventas": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Logística": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "RRHH": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export default function NominaPage() {
    const [search, setSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const active = EMPLOYEES.filter(e => e.status === 'activo');
    const totalSalary = active.reduce((a, e) => a + e.salary, 0);
    const deductions = totalSalary * 0.1255; // TSS + ISR approx
    const netPayroll = totalSalary - deductions;

    const filtered = EMPLOYEES.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.dept.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nómina</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestión de empleados, sueldos y retenciones TSS/ISR.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> TSS 606</Button>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Nuevo Empleado</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[520px]">
                            <DialogHeader><DialogTitle>Registrar Empleado</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Nombre Completo</Label><Input placeholder="Juan Pérez..." /></div>
                                    <div className="space-y-2"><Label>Cédula</Label><Input placeholder="001-1234567-8" className="font-mono" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Departamento</Label>
                                        <Select><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(DEPT_COLORS).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                <SelectItem value="Otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label>Cargo</Label><Input placeholder="Título del puesto..." /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Salario Bruto (RD$)</Label><Input type="number" placeholder="0.00" /></div>
                                    <div className="space-y-2"><Label>Fecha de Ingreso</Label><Input type="date" /></div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                                <Button onClick={() => setOpenDialog(false)}>Guardar</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Empleados Activos", value: active.length.toString(), icon: Users2, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Costo Bruto (Nov)", value: `RD$ ${totalSalary.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
                    { label: "Deducciones TSS/ISR", value: `RD$ ${Math.round(deductions).toLocaleString()}`, icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10" },
                    { label: "Neto a Pagar", value: `RD$ ${Math.round(netPayroll).toLocaleString()}`, icon: TrendingUp, color: "text-violet-600 bg-violet-500/10" },
                ].map((k, i) => (
                    <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", k.color)}><k.icon className="w-5 h-5" /></div>
                            <div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="text-lg font-bold leading-snug">{k.value}</p></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="empleados">
                <TabsList className="bg-muted/50 backdrop-blur-md">
                    <TabsTrigger value="empleados"><Users2 className="w-4 h-4 mr-2" /> Empleados</TabsTrigger>
                    <TabsTrigger value="historial"><Calendar className="w-4 h-4 mr-2" /> Historial Nómina</TabsTrigger>
                </TabsList>

                <TabsContent value="empleados" className="mt-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex gap-3 mb-4">
                                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar empleado..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-background" /></div>
                                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Empleado</TableHead>
                                            <TableHead>Departamento</TableHead>
                                            <TableHead>Cargo</TableHead>
                                            <TableHead className="text-right">Salario Bruto</TableHead>
                                            <TableHead className="text-right">Deducción TSS</TableHead>
                                            <TableHead className="text-right">Neto</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map(emp => {
                                            const deduc = emp.salary * 0.1255;
                                            const neto = emp.salary - deduc;
                                            return (
                                                <TableRow key={emp.id} className={cn("hover:bg-muted/20 transition-colors", emp.status === 'inactivo' && "opacity-60")}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                                {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{emp.name}</p>
                                                                <p className="text-xs text-muted-foreground">Desde {emp.startDate}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline" className={cn("text-xs", DEPT_COLORS[emp.dept])}>{emp.dept}</Badge></TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{emp.role}</TableCell>
                                                    <TableCell className="text-right tabular-nums font-medium">RD$ {emp.salary.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right tabular-nums text-muted-foreground">-RD$ {Math.round(deduc).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {Math.round(neto).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={emp.status === 'activo' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs' : 'text-muted-foreground text-xs'}>
                                                            {emp.status === 'activo' ? <><CheckCircle className="w-3 h-3 mr-1 inline" /> Activo</> : 'Inactivo'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="historial" className="mt-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm">
                        <CardContent className="p-4">
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Período</TableHead>
                                            <TableHead>Fecha Proceso</TableHead>
                                            <TableHead className="text-right">Empleados</TableHead>
                                            <TableHead className="text-right">Bruto</TableHead>
                                            <TableHead className="text-right">Deducciones</TableHead>
                                            <TableHead className="text-right">Neto Pagado</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="w-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {PAYROLL_HISTORY.map((p, i) => (
                                            <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-semibold">{p.period}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                                                <TableCell className="text-right">{p.employees}</TableCell>
                                                <TableCell className="text-right tabular-nums">RD$ {p.gross.toLocaleString()}</TableCell>
                                                <TableCell className="text-right tabular-nums text-red-500">-RD$ {p.deductions.toLocaleString()}</TableCell>
                                                <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {p.net.toLocaleString()}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs"><CheckCircle className="w-3 h-3 mr-1 inline" /> Procesado</Badge></TableCell>
                                                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
