"use client";
import dynamic from "next/dynamic";
const FacturasPageInner = dynamic(() => import("./FacturasPageInner"), { ssr: false });
export default function FacturasPage() { return <FacturasPageInner />; }
