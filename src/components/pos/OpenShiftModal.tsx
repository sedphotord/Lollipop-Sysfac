"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Unlock, AlertCircle, CheckCircle2, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpenShiftModalProps {
    vendedores: string[];
    shiftOpenVendedor: string;
    setShiftOpenVendedor: (v: string) => void;
    openingFloat: string;
    setOpeningFloat: (v: string) => void;
    onClose: () => void;
    onOpen: () => void;
}

export function OpenShiftModal({
    vendedores,
    shiftOpenVendedor,
    setShiftOpenVendedor,
    openingFloat,
    setOpeningFloat,
    onClose,
    onOpen,
}: OpenShiftModalProps) {
    const [step, setStep] = useState<"vendor" | "pin">("vendor");
    const [pin, setPin] = useState("");
    const [pinError, setPinError] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the hidden input when entering PIN step
    useEffect(() => {
        if (step === "pin") {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [step]);

    const handlePinInput = (digit: string) => {
        if (pin.length >= 6) return;
        const next = pin + digit;
        setPin(next);
        setPinError(false);
        if (next.length === 6) {
            verifyPin(next);
        }
    };

    const handlePinDelete = () => {
        setPin(p => p.slice(0, -1));
        setPinError(false);
    };

    const verifyPin = (enteredPin: string) => {
        try {
            const raw = localStorage.getItem("pos_vendedores");
            if (raw) {
                const list: { nombre: string; pin?: string }[] = JSON.parse(raw);
                const match = list.find(v => v.nombre === shiftOpenVendedor);
                if (match && match.pin) {
                    if (match.pin === enteredPin) {
                        // Correct PIN
                        onOpen();
                        return;
                    }
                } else if (!match?.pin) {
                    // Vendedor has no PIN set — let them through (backwards compat)
                    onOpen();
                    return;
                }
            } else {
                // No vendedor data — let through
                onOpen();
                return;
            }
        } catch { }
        // Wrong PIN
        setShake(true);
        setPinError(true);
        setTimeout(() => {
            setShake(false);
            setPin("");
        }, 600);
    };

    const PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Unlock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Abrir Turno</h2>
                            <p className="text-xs text-muted-foreground">{new Date().toLocaleString("es-DO")}</p>
                        </div>
                    </div>
                    {/* Step dots */}
                    <div className="flex gap-2 mt-4">
                        <div className={cn("flex-1 h-1 rounded-full transition-all", step === "vendor" || step === "pin" ? "bg-emerald-500" : "bg-muted")} />
                        <div className={cn("flex-1 h-1 rounded-full transition-all", step === "pin" ? "bg-emerald-500" : "bg-muted")} />
                    </div>
                </div>

                {/* ── STEP 1: Vendor + Float ─────────────────────── */}
                {step === "vendor" && (
                    <div className="px-6 py-5 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold">Vendedor que abre el turno</Label>
                            <Select value={shiftOpenVendedor} onValueChange={setShiftOpenVendedor}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar vendedor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendedores.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold">Monto de apertura (efectivo en caja)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">RD$</span>
                                <Input
                                    value={openingFloat}
                                    onChange={e => setOpeningFloat(e.target.value)}
                                    className="pl-10 h-11 text-lg font-bold"
                                    placeholder="0.00"
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
                            <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                disabled={!shiftOpenVendedor}
                                onClick={() => { setPin(""); setPinError(false); setStep("pin"); }}
                            >
                                Continuar →
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: PIN ────────────────────────────────── */}
                {step === "pin" && (
                    <div className="px-6 py-5 space-y-5">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-black">{shiftOpenVendedor.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                            </div>
                            <p className="font-bold text-base">{shiftOpenVendedor}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Ingresa tu PIN de 6 dígitos</p>
                        </div>

                        {/* Hidden input for mobile keyboard support */}
                        <input
                            ref={inputRef}
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={pin}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                setPin(val);
                                setPinError(false);
                                if (val.length === 6) verifyPin(val);
                            }}
                            className="sr-only"
                        />

                        {/* PIN dots */}
                        <div className={cn("flex justify-center gap-3 my-2 transition-all", shake && "animate-[shake_0.4s_ease]")}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all",
                                        i < pin.length
                                            ? pinError
                                                ? "border-red-500 bg-red-500 text-white"
                                                : "border-primary bg-primary text-white"
                                            : "border-border text-muted-foreground"
                                    )}
                                >
                                    {i < pin.length ? "•" : ""}
                                </div>
                            ))}
                        </div>

                        {pinError && (
                            <p className="text-center text-xs text-red-500 flex items-center justify-center gap-1.5 -mt-1">
                                <AlertCircle className="w-3.5 h-3.5" /> PIN incorrecto. Intenta de nuevo.
                            </p>
                        )}

                        {/* Number pad */}
                        <div className="grid grid-cols-3 gap-2">
                            {PAD.map((key, i) => (
                                key === "" ? (
                                    <div key={i} />
                                ) : key === "⌫" ? (
                                    <button
                                        key={i}
                                        onClick={handlePinDelete}
                                        className="h-12 rounded-xl bg-muted hover:bg-muted/80 font-bold text-lg transition-colors flex items-center justify-center"
                                    >
                                        <Delete className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                ) : (
                                    <button
                                        key={i}
                                        onClick={() => handlePinInput(key)}
                                        className="h-12 rounded-xl bg-muted hover:bg-muted/60 active:scale-95 font-bold text-lg transition-all"
                                    >
                                        {key}
                                    </button>
                                )
                            ))}
                        </div>

                        <div className="flex gap-3 pt-1">
                            <Button variant="outline" className="flex-1" onClick={() => setStep("vendor")}>← Atrás</Button>
                            <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                disabled={pin.length < 6}
                                onClick={() => verifyPin(pin)}
                            >
                                <Unlock className="w-4 h-4" /> Abrir Turno
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Shake keyframe injected inline */}
            <style>{`
                @keyframes shake {
                    0%,100%{transform:translateX(0)}
                    15%{transform:translateX(-8px)}
                    30%{transform:translateX(8px)}
                    45%{transform:translateX(-6px)}
                    60%{transform:translateX(6px)}
                    75%{transform:translateX(-4px)}
                    90%{transform:translateX(4px)}
                }
            `}</style>
        </div>
    );
}
