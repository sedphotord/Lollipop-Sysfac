"use client";
import dynamic from "next/dynamic";

const UsuariosPageInner = dynamic(() => import("./UsuariosPageInner"), { ssr: false });

export default function UsuariosPage() {
    return <UsuariosPageInner />;
}
