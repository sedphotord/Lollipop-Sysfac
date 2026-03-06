"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    FileText,
    Users,
    ShoppingCart,
    PieChart,
    Truck,
    Building2,
    Store,
    BookOpen
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Acciones Rápidas">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/invoices/new"))}>
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Nueva Factura</span>
                        <CommandShortcut>⌘N</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/ingresos/cotizaciones/new"))}>
                        <FileText className="mr-2 h-4 w-4 text-sky-500" />
                        <span>Nueva Cotización</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/clients/new"))}>
                        <Users className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>Nuevo Cliente</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/gastos/new"))}>
                        <ShoppingCart className="mr-2 h-4 w-4 text-rose-500" />
                        <span>Registrar Gasto</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Navegación">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/invoices"))}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Facturas</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/reportes"))}>
                        <PieChart className="mr-2 h-4 w-4" />
                        <span>Reportes Financieros</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/contabilidad/catalogo"))}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Catálogo de Cuentas</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/pos"))}>
                        <Store className="mr-2 h-4 w-4" />
                        <span>Punto de Venta (POS)</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Configuración">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/perfil"))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Mi Perfil</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>Ajustes de Empresa</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/usuarios"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Usuarios y Roles</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
