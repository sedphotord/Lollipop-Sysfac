"use client";
import { companyStorage } from "@/lib/company-storage";
import dynamic from "next/dynamic";

// POS page uses localStorage, window, document heavily — must never be SSR'd
const POSPageInner = dynamic(() => import("./POSPageInner"), { ssr: false });

export default function POSPage() {
    return <POSPageInner />;
}