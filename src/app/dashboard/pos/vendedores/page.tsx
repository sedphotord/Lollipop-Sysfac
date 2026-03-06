"use client";
import dynamic from "next/dynamic";
const VendedoresPageInner = dynamic(() => import("./VendedoresPageInner"), { ssr: false });
export default function VendedoresPage() { return <VendedoresPageInner />; }
