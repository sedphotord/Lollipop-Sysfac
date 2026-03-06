"use client";
import dynamic from "next/dynamic";
const TurnosPageInner = dynamic(() => import("./TurnosPageInner"), { ssr: false });
export default function TurnosPage() { return <TurnosPageInner />; }
