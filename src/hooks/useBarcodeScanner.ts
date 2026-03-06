/**
 * useBarcodeScanner — Universal barcode / QR scanner hook
 *
 * Supports THREE modes simultaneously:
 * 1. Hardware scanner (USB pistol): fast keystroke sequences ending with Enter
 * 2. Camera (BarcodeDetector Web API) — Chrome/Edge 83+
 * 3. Manual code input via the returned `manualScan` function
 *
 * Usage:
 *   const { scanning, startCamera, stopCamera, manualScan, cameraSupported } = useBarcodeScanner({
 *     onScan: (code) => { ... }
 *   });
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface UseBarcodeOptions {
    onScan: (code: string) => void;
    /** Minimum ms between keystrokes to be considered a hardware scan (default 80) */
    hwThreshold?: number;
    /** Minimum code length to accept (default 3) */
    minLength?: number;
    /** Whether to activate the hw listener (default true) */
    enabled?: boolean;
}

export function useBarcodeScanner({
    onScan,
    hwThreshold = 80,
    minLength = 3,
    enabled = true,
}: UseBarcodeOptions) {
    const bufRef = useRef("");
    const lastKeyRef = useRef<number>(0);
    const [scanning, setScanning] = useState(false);          // camera active
    const [cameraSupported, setCameraSupported] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const detectorRef = useRef<any>(null);
    const rafRef = useRef<number>(0);
    const onScanRef = useRef(onScan);

    // Keep ref in sync so callbacks don't need the dep
    useEffect(() => { onScanRef.current = onScan; }, [onScan]);

    // ── Hardware scanner listener ─────────────────────────────────────────────
    useEffect(() => {
        if (!enabled || typeof window === "undefined") return;

        const handleKey = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea/select (except we DO want to listen
            // even then because a barcode scanner fires at the OS level — but skip if we're
            // in a multi-char field that already has focus and a real user is typing slowly)
            const tag = (document.activeElement?.tagName ?? "").toLowerCase();
            const isEditable =
                tag === "textarea" ||
                (tag === "input" && (document.activeElement as HTMLInputElement).type !== "hidden") ||
                (document.activeElement as HTMLElement)?.isContentEditable;

            const now = Date.now();
            const gap = now - lastKeyRef.current;
            lastKeyRef.current = now;

            if (e.key === "Enter") {
                const code = bufRef.current.trim();
                bufRef.current = "";
                if (code.length >= minLength) {
                    // Only fire if the gap from the previous char was small (hw scanner speed)
                    // OR the whole thing came in within a tight window
                    onScanRef.current(code);
                    e.preventDefault();
                }
                return;
            }

            // If gap is too long this is a human typing → reset buffer
            if (gap > hwThreshold && bufRef.current.length > 0) {
                bufRef.current = "";
            }

            // Accumulate printable chars
            if (e.key.length === 1) {
                bufRef.current += e.key;
            }
        };

        window.addEventListener("keydown", handleKey, { capture: true });
        return () => window.removeEventListener("keydown", handleKey, { capture: true });
    }, [enabled, hwThreshold, minLength]);

    // ── Camera setup ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === "undefined") return;
        setCameraSupported("BarcodeDetector" in window);
    }, []);

    const startCamera = useCallback(async (videoEl: HTMLVideoElement) => {
        if (!("BarcodeDetector" in window)) return;
        videoRef.current = videoEl;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            videoEl.srcObject = stream;
            await videoEl.play();

            // @ts-ignore
            const bd = new (window as any).BarcodeDetector({
                formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e", "itf", "codabar"],
            });
            detectorRef.current = bd;
            setScanning(true);

            const detect = async () => {
                if (!videoEl || videoEl.paused || videoEl.ended) return;
                try {
                    const codes = await bd.detect(videoEl);
                    if (codes.length > 0) {
                        const val = codes[0].rawValue;
                        if (val && val.length >= 3) {
                            onScanRef.current(val);
                        }
                    }
                } catch { }
                rafRef.current = requestAnimationFrame(detect);
            };
            rafRef.current = requestAnimationFrame(detect);
        } catch (err) {
            console.error("Camera error:", err);
        }
    }, []);

    const stopCamera = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setScanning(false);
    }, []);

    // Clean up on unmount
    useEffect(() => () => stopCamera(), [stopCamera]);

    const manualScan = useCallback((code: string) => {
        if (code.trim().length >= minLength) onScanRef.current(code.trim());
    }, [minLength]);

    return { scanning, startCamera, stopCamera, manualScan, cameraSupported };
}
