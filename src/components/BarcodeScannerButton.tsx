"use client";

/**
 * BarcodeScannerButton
 *
 * A plug-and-play button that opens a barcode scanner UI.
 * Supports:
 *  - Camera scanning (BarcodeDetector API — Chrome/Edge)
 *  - Manual code entry (any browser)
 *  - Auto-detects hardware scanner via useBarcodeScanner hook (enabled by default in POS)
 *
 * Props:
 *  onScan(code: string) — called whenever a barcode/QR is detected
 *  disabled? — grey out the button
 *  className? — extra classes on the trigger button
 */

import { useRef, useState, useCallback } from "react";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { Barcode, Camera, CameraOff, X, ScanLine, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    onScan: (code: string) => void;
    disabled?: boolean;
    className?: string;
}

type Tab = "camera" | "manual";

export function BarcodeScannerButton({ onScan, disabled, className }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("camera");
    const [manualCode, setManualCode] = useState("");
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [flash, setFlash] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleScan = useCallback((code: string) => {
        setLastScanned(code);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
        onScan(code);
        // Auto-close after successful scan
        setTimeout(() => setOpen(false), 800);
    }, [onScan]);

    const { scanning, startCamera, stopCamera, cameraSupported } = useBarcodeScanner({
        onScan: handleScan,
        enabled: open, // only listens when the modal is open (HW scanner still works elsewhere too)
    });

    const openModal = () => {
        setOpen(true);
        setLastScanned(null);
        setManualCode("");
        setTab(cameraSupported ? "camera" : "manual");
    };

    const closeModal = () => {
        stopCamera();
        setOpen(false);
    };

    const handleVideoRef = (el: HTMLVideoElement | null) => {
        videoRef.current = el;
        if (el && tab === "camera" && !scanning) {
            startCamera(el);
        }
    };

    const handleTabChange = (t: Tab) => {
        if (t === "camera") {
            if (videoRef.current) startCamera(videoRef.current);
        } else {
            stopCamera();
        }
        setTab(t);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim().length >= 2) {
            handleScan(manualCode.trim());
            setManualCode("");
        }
    };

    return (
        <>
            {/* Trigger button */}
            <button
                type="button"
                disabled={disabled}
                onClick={openModal}
                title="Escanear código de barras"
                className={cn(
                    "flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-background hover:bg-muted text-sm font-medium transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            >
                <Barcode className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Escanear</span>
            </button>

            {/* Modal overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <ScanLine className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Lector de Códigos</h3>
                                    <p className="text-[10px] text-muted-foreground">Cámara · Pistola USB · Manual</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => handleTabChange("camera")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors",
                                    tab === "camera"
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Camera className="w-3.5 h-3.5" />
                                Cámara
                                {!cameraSupported && (
                                    <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded">No disponible</span>
                                )}
                            </button>
                            <button
                                onClick={() => handleTabChange("manual")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors",
                                    tab === "manual"
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Keyboard className="w-3.5 h-3.5" />
                                Manual / USB
                            </button>
                        </div>

                        {/* Camera view */}
                        {tab === "camera" && (
                            <div className="p-4 space-y-3">
                                {cameraSupported ? (
                                    <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
                                        <video
                                            ref={handleVideoRef}
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Scan overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className={cn(
                                                "w-48 h-32 border-2 rounded-xl transition-all duration-300",
                                                flash ? "border-emerald-400 bg-emerald-400/10" : "border-white/60"
                                            )}>
                                                {/* Corner marks */}
                                                {[["top-0 left-0 border-r-0 border-b-0", "border-t-4 border-l-4"],
                                                ["top-0 right-0 border-l-0 border-b-0", "border-t-4 border-r-4"],
                                                ["bottom-0 left-0 border-r-0 border-t-0", "border-b-4 border-l-4"],
                                                ["bottom-0 right-0 border-l-0 border-t-0", "border-b-4 border-r-4"]
                                                ].map(([pos, border], i) => (
                                                    <div key={i} className={cn("absolute w-5 h-5 rounded", pos, border,
                                                        flash ? "border-emerald-400" : "border-white"
                                                    )} />
                                                ))}
                                                {/* Scanning line */}
                                                {!flash && (
                                                    <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-red-400/80 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                        {!scanning && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <p className="text-white text-sm">Iniciando cámara…</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                                        <CameraOff className="w-10 h-10 text-muted-foreground/40" />
                                        <p className="text-sm text-muted-foreground font-medium">BarcodeDetector no disponible</p>
                                        <p className="text-xs text-muted-foreground/60">
                                            Usa Chrome o Edge (v83+), o cambia a la pestaña Manual.
                                        </p>
                                    </div>
                                )}
                                <p className="text-xs text-center text-muted-foreground">
                                    Apunta la cámara al código de barras o QR
                                </p>
                            </div>
                        )}

                        {/* Manual / USB tab */}
                        {tab === "manual" && (
                            <div className="p-4 space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                    <Barcode className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Pistola USB:</strong> Simplemente escanea el código — se detecta automáticamente aunque este modal esté cerrado.
                                    </span>
                                </div>
                                <form onSubmit={handleManualSubmit} className="space-y-3">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={manualCode}
                                        onChange={e => setManualCode(e.target.value)}
                                        placeholder="Código de barras o referencia..."
                                        className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={manualCode.trim().length < 2}
                                        className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <ScanLine className="w-4 h-4" />
                                        Buscar producto
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Last scanned result */}
                        {lastScanned && (
                            <div className={cn(
                                "mx-4 mb-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all",
                                flash
                                    ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                                    : "bg-muted border border-border text-muted-foreground"
                            )}>
                                <ScanLine className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{lastScanned}</span>
                            </div>
                        )}

                        {/* HW scanner always-on note */}
                        <div className="px-5 pb-4 text-center">
                            <p className="text-[10px] text-muted-foreground/50">
                                La pistola USB funciona en cualquier momento — no necesita este modal abierto.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
