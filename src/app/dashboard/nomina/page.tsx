"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    AlertTriangle, Calendar, CheckCircle, DollarSign, Download, FileText,
    MoreVertical, Plus, Search, TrendingUp, Trash2, Edit2, Users2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { companyStorage } from "@/lib/company-storage";
import { toast } from "sonner";

const LS_EMP = "nomina_empleados";
const LS_PAYROLL = "nomina_historial";

const DEPT_COLORS: Record<string, string> = {
    "Tecnología": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Contabilidad": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "Ventas": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "Logística": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "RRHH": "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const EMPTY_EMP = {
    id: "", name: "", cedula: "", dept: "Tecnología", role: "",
    salary: 0, status: "activo", startDate: new Date().toISOString().split("T")[0],
};

type Employee = typeof EMPTY_EMP;

export default function NominaPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_EMP });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Employee | null>(null);

    useEffect(() => {
        try { setEmployees(JSON.parse(companyStorage.get(LS_EMP) || "[]")); } catch { }
        try { setPayrollHistory(JSON.parse(companyStorage.get(LS_PAYROLL) || "[]")); } catch { }
    }, []);

    function saveEmp(list: Employee[]) {
        setEmployees(list);
        companyStorage.set(LS_EMP, JSON.stringify(list));
    }

    function savePayroll(list: any[]) {
        setPayrollHistory(list);
        companyStorage.set(LS_PAYROLL, JSON.stringify(list));
    }

    const active = employees.filter(e => e.status === "activo");
    const totalSalary = active.reduce((a, e) => a + (e.salary || 0), 0);
    const deductions = totalSalary * 0.1255;
    const netPayroll = totalSalary - deductions;

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.dept || "").toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() { setFormData({ ...EMPTY_EMP, id: Date.now().toString() }); setIsEditing(false); setFormOpen(true); }
    function openEdit(e: Employee) { setFormData({ ...e }); setIsEditing(true); setFormOpen(true); }
    function openDelete(e: Employee) { setToDelete(e); setDeleteOpen(true); }

    function handleSave() {
        const emp = { ...formData, salary: parseFloat(String(formData.salary)) || 0 };
        const list = isEditing ? employees.map(e => e.id === emp.id ? emp : e) : [...employees, emp];
        saveEmp(list);
        setFormOpen(false);
        toast.success(isEditing ? "Empleado actualizado" : "Empleado registrado", { description: emp.name });
    }

    function handleDelete() {
        if (!toDelete) return;
        saveEmp(employees.filter(e => e.id !== toDelete.id));
        setDeleteOpen(false); setToDelete(null);
        toast.success("Empleado eliminado");
    }

    function procesarNomina() {
        const record = {
            id: Date.now().toString(),
            period: new Date().toLocaleString("es-DO", { month: "long", year: "numeric" }),
            date: new Date().toISOString().split("T")[0],
            employees: active.length,
            gross: totalSalary,
            deductions: Math.round(deductions),
            net: Math.round(netPayroll),
            status: "procesado",
        };
        savePayroll([record, ...payrollHistory]);
        toast.success("Nómina procesada correctamente", { description: `RD$ ${Math.round(netPayroll).toLocaleString()} neto` });
    }

    function exportCSV() {
        const headers = ["ID", "Nombre", "Cédula", "Departamento", "Cargo", "Salario", "Deducción TSS", "Neto", "Estado"];
        const rows = employees.map(e => {
            const deduc = (e.salary || 0) * 0.1255;
            return [e.id, e.name, e.cedula || "—", e.dept, e.role, e.salary, Math.round(deduc), Math.round((e.salary || 0) - deduc), e.status];
        });
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "nomina.csv"; a.click(); URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nómina</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Gestión de empleados, sueldos y retenciones TSS/ISR.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={exportCSV}><FileText className="w-4 h-4" /> Exportar CSV</Button>
                    <Button className="bg-primary shadow-lg shadow-primary/20" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nuevo Empleado</Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Empleados Activos", value: active.length.toString(), icon: Users2, color: "text-blue-600 bg-blue-500/10" },
                    { label: "Costo Bruto", value: `RD$ ${totalSalary.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
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
                                <Button variant="outline" size="sm" onClick={procesarNomina} disabled={employees.length === 0}><DollarSign className="w-4 h-4 mr-2" /> Procesar Nómina</Button>
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
                                            <TableHead className="w-10" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.length === 0 && (
                                            <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">{employees.length === 0 ? "Agrega el primer empleado para comenzar." : "Sin resultados."}</TableCell></TableRow>
                                        )}
                                        {filtered.map(emp => {
                                            const deduc = (emp.salary || 0) * 0.1255;
                                            const neto = (emp.salary || 0) - deduc;
                                            return (
                                                <TableRow key={emp.id} className={cn("hover:bg-muted/20 transition-colors group", emp.status === "inactivo" && "opacity-60")}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                                {emp.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                                            </div>
                                                            <div><p className="font-semibold text-sm">{emp.name}</p><p className="text-xs text-muted-foreground">{emp.cedula || "Sin cédula"}</p></div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline" className={cn("text-xs", DEPT_COLORS[emp.dept] || "bg-muted")}>{emp.dept}</Badge></TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{emp.role}</TableCell>
                                                    <TableCell className="text-right tabular-nums font-medium">RD$ {(emp.salary || 0).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right tabular-nums text-muted-foreground">-RD$ {Math.round(deduc).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {Math.round(neto).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={emp.status === "activo" ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-xs" : "text-muted-foreground text-xs"}>
                                                            {emp.status === "activo" ? <><CheckCircle className="w-3 h-3 mr-1 inline" /> Activo</> : "Inactivo"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEdit(emp)}><Edit2 className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => openDelete(emp)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Eliminar</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
                                        {payrollHistory.length === 0 && (
                                            <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Aún no has procesado ninguna nómina. Usa el botón "Procesar Nómina".</TableCell></TableRow>
                                        )}
                                        {payrollHistory.map((p, i) => (
                                            <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                                                <TableCell className="font-semibold capitalize">{p.period}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                                                <TableCell className="text-right">{p.employees}</TableCell>
                                                <TableCell className="text-right tabular-nums">RD$ {(p.gross || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right tabular-nums text-red-500">-RD$ {(p.deductions || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right tabular-nums font-bold text-emerald-600">RD$ {(p.net || 0).toLocaleString()}</TableCell>
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

            {/* Create/Edit Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader><DialogTitle>{isEditing ? "Editar Empleado" : "Registrar Empleado"}</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Nombre Completo *</Label><Input placeholder="Juan Pérez..." value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
                            <div className="space-y-2"><Label>Cédula</Label><Input placeholder="001-1234567-8" className="font-mono" value={formData.cedula || ""} onChange={e => setFormData(p => ({ ...p, cedula: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Departamento</Label>
                                <Select value={formData.dept} onValueChange={v => setFormData(p => ({ ...p, dept: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{[...Object.keys(DEPT_COLORS), "Otro"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Cargo</Label><Input placeholder="Título del puesto..." value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Salario Bruto (RD$) *</Label><Input type="number" placeholder="0.00" value={formData.salary || ""} onChange={e => setFormData(p => ({ ...p, salary: parseFloat(e.target.value) || 0 }))} /></div>
                            <div className="space-y-2"><Label>Fecha de Ingreso</Label><Input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="activo">Activo</SelectItem><SelectItem value="inactivo">Inactivo</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!formData.name || !formData.salary}>{isEditing ? "Guardar cambios" : "Registrar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle><AlertDialogDescription>Se eliminará permanentemente a <strong>{toDelete?.name}</strong>.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
