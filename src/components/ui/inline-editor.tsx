"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function InlineField({ value, onChange, placeholder, className = "", mono = false, large = false, right = false, multiline = false }:
    { value: string; onChange?: (v: string) => void; placeholder?: string; className?: string; mono?: boolean; large?: boolean; right?: boolean; multiline?: boolean }) {

    const [editing, setEditing] = useState(false);

    if (!onChange) {
        return <span className={cn(mono && "font-mono", large && "text-lg font-bold", right && "text-right", className)}>{value || placeholder}</span>;
    }

    if (multiline) {
        return editing ? (
            <textarea autoFocus rows={3} value={value} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)} placeholder={placeholder}
                className={cn("border-0 border-b-2 border-primary/40 outline-none bg-primary/5 rounded-sm px-1 py-0.5 transition-all w-full text-xs resize-none", className)} />
        ) : (
            <span onClick={() => setEditing(true)} className={cn("cursor-text whitespace-pre-wrap break-words hover:bg-primary/5 hover:outline hover:outline-1 hover:outline-primary/20 rounded-sm px-1 -mx-1 transition-all inline-block w-full text-xs", !value && "text-stone-300 italic", className)}>
                {value || placeholder || "Clic para editar"}
            </span>
        );
    }
    return editing ? (
        <input autoFocus value={value} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={e => e.key === 'Enter' && setEditing(false)} placeholder={placeholder}
            className={cn("border-0 border-b-2 border-primary/40 outline-none bg-primary/5 rounded-sm px-1 py-0.5 transition-all w-full", mono && "font-mono", large && "text-lg font-bold", right && "text-right", className)} />
    ) : (
        <span onClick={() => setEditing(true)} className={cn("cursor-text hover:bg-primary/5 hover:outline hover:outline-1 hover:outline-primary/20 rounded-sm px-1 -mx-1 transition-all inline-block w-full", !value && "text-stone-300 italic", mono && "font-mono", large && "text-lg font-bold", right && "text-right", className)}>
            {value || placeholder || "Clic para editar"}
        </span>
    );
}

export function InlineNumber({ value, onChange, className = "", format = true }: { value: number; onChange?: (v: number) => void; className?: string; format?: boolean }) {
    const [editing, setEditing] = useState(false);

    if (!onChange) {
        return <span className={className}>{format ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value}</span>;
    }

    return editing ? (
        <input autoFocus type="number" min="0" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} onBlur={() => setEditing(false)} onKeyDown={e => e.key === 'Enter' && setEditing(false)}
            className={cn("border-0 border-b-2 border-primary/40 outline-none bg-primary/5 rounded-sm px-1 text-right w-full", className)} />
    ) : (
        <span onClick={() => setEditing(true)} className={cn("cursor-text hover:bg-primary/5 hover:outline hover:outline-1 hover:outline-primary/20 rounded-sm px-1 -mx-1 transition-all inline-block w-full text-right tabular-nums", className)}>
            {format ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value}
        </span>
    );
}
