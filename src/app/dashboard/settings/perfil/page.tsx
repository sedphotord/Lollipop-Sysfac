"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Camera, KeyRound, Mail, Phone, Save, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
    const [name, setName] = useState("Juan Perez");
    const [email, setEmail] = useState("admin@lollipop.do");
    const [phone, setPhone] = useState("809-555-0123");
    const [role] = useState("Administrador");
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [saved, setSaved] = useState(false);

    const handleSaveProfile = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
    const handleSavePass = () => { if (newPass !== confirmPass) return; setCurrentPass(""); setNewPass(""); setConfirmPass(""); setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-3xl">
            <div><h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2><p className="text-muted-foreground mt-1 text-sm">Administra tu informacion personal y credenciales de acceso.</p></div>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-blue-200/50"><AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 text-blue-700 font-bold text-xl">JP</AvatarFallback></Avatar>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"><Camera className="w-3.5 h-3.5" /></button>
                    </div>
                    <div>
                        <p className="text-xl font-bold">{name}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                        <div className="flex items-center gap-1 mt-1"><BadgeCheck className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-semibold text-blue-600">{role}</span></div>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Nombre completo</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                        <div className="space-y-2"><Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Telefono</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                        <div className="space-y-2"><Label className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Rol</Label><Input value={role} readOnly className="bg-muted cursor-not-allowed" /></div>
                    </div>
                    <div className="flex justify-end"><Button onClick={handleSaveProfile} className="gap-2">{saved ? <BadgeCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}{saved ? "Guardado!" : "Guardar Cambios"}</Button></div>
                </div>
            </CardContent></Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-sm"><CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><KeyRound className="w-5 h-5 text-blue-500" />Cambiar Contrasena</h3>
                <div className="grid gap-4">
                    <div className="space-y-2"><Label>Contrasena actual</Label><Input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="********" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Nueva contrasena</Label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="********" /></div>
                        <div className="space-y-2"><Label>Confirmar</Label><Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="********" /></div>
                    </div>
                    <div className="flex justify-end"><Button variant="outline" onClick={handleSavePass} className="gap-2"><KeyRound className="w-4 h-4" />Actualizar Contrasena</Button></div>
                </div>
            </CardContent></Card>
        </div>
    );
}
