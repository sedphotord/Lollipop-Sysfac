export const MOCK_INVOICES = [
    { 
        id: "0042", ecf: "E3100000006", tipo: "B01", tipoName: "Credito Fiscal", cliente: "CLARO (CODETEL)", rnc: "101010101", 
        date: "2024-10-20", vencimiento: "2024-11-19", total: 605800, status: "accepted", paymentStatus: "pendiente",
        vendedor: "Admin", plantilla: "InvoiceStandard", paymentTerms: "30 dias", moneda: "DOP", invoiceMode: "electronico",
        items: [{ id: 1, name: "Servicios de Telecomunicaciones", ref: "SRV-001", qty: 1, price: 513389.83, disc: 0, itbis: 18, desc: "Octubre 2024" }],
        totals: { subtotal: 513389.83, discount: 0, tax: 92410.17, total: 605800 }
    },
    { 
        id: "0041", ecf: "E3200000010", tipo: "B02", tipoName: "Consumo", cliente: "Juan Perez", rnc: "00114356789", 
        date: "2024-10-18", vencimiento: "2024-10-18", total: 3500, status: "accepted", paymentStatus: "pagada",
        vendedor: "Maria Lopez", plantilla: "InvoiceModern", paymentTerms: "Al contado", moneda: "DOP", invoiceMode: "electronico",
        items: [{ id: 1, name: "Mantenimiento Preventivo", ref: "MNT-01", qty: 1, price: 2966.10, disc: 0, itbis: 18, desc: "Revision general" }],
        totals: { subtotal: 2966.10, discount: 0, tax: 533.90, total: 3500 }
    },
    { 
        id: "0040", ecf: "E3100000005", tipo: "B01", tipoName: "Credito Fiscal", cliente: "ALTICE DOMINICANA", rnc: "130819985", 
        date: "2024-10-15", vencimiento: "2024-11-14", total: 125000, status: "pending", paymentStatus: "pendiente",
        vendedor: "Carlos Perez", plantilla: "InvoiceCorporate", paymentTerms: "30 dias", moneda: "DOP", invoiceMode: "electronico",
        items: [{ id: 1, name: "Licencias de Software", ref: "LIC-02", qty: 5, price: 21186.44, disc: 0, itbis: 18, desc: "Renovacion Anual" }],
        totals: { subtotal: 105932.20, discount: 0, tax: 19067.80, total: 125000 }
    },
    { 
        id: "0039", ecf: "E3100000004", tipo: "B01", tipoName: "Credito Fiscal", cliente: "GRUPO RAMOS", rnc: "101001010", 
        date: "2024-10-10", vencimiento: "2024-11-09", total: 95000, status: "accepted", paymentStatus: "parcial",
        vendedor: "Admin", plantilla: "InvoiceElegant", paymentTerms: "30 dias", moneda: "DOP", invoiceMode: "electronico",
        items: [{ id: 1, name: "Equipos de Oficina", ref: "EQ-03", qty: 2, price: 40254.24, disc: 0, itbis: 18, desc: "Impresoras laser" }],
        totals: { subtotal: 80508.48, discount: 0, tax: 14491.52, total: 95000 }
    },
    { 
        id: "0038", ecf: "E3200000009", tipo: "B02", tipoName: "Consumo", cliente: "Maria Santos", rnc: "40212345678", 
        date: "2024-10-08", vencimiento: "2024-10-08", total: 8750, status: "rejected", paymentStatus: "pendiente",
        vendedor: "Maria Lopez", plantilla: "InvoiceStandard", paymentTerms: "Al contado", moneda: "DOP", invoiceMode: "electronico",
        items: [{ id: 1, name: "Consultoria Basica", ref: "CNS-04", qty: 1, price: 7415.25, disc: 0, itbis: 18, desc: "" }],
        totals: { subtotal: 7415.25, discount: 0, tax: 1334.75, total: 8750 }
    },
    { 
        id: "0037", ncf: "B0100000003", tipo: "B01", tipoName: "Credito Fiscal", cliente: "BANRESERVAS", rnc: "101288345", 
        date: "2024-10-01", vencimiento: "2024-10-31", total: 250000, status: "accepted", paymentStatus: "pagada",
        vendedor: "Carlos Perez", plantilla: "InvoiceMinimal", paymentTerms: "30 dias", invoiceMode: "tradicional", moneda: "USD",
        items: [{ id: 1, name: "Desarrollo a Medida", ref: "DEV-05", qty: 1, price: 211864.41, disc: 0, itbis: 18, desc: "Modulo interno" }],
        totals: { subtotal: 211864.41, discount: 0, tax: 38135.59, total: 250000 }
    },
    { 
        id: "0036", ncf: "B0200000008", tipo: "B02", tipoName: "Consumo", cliente: "Pedro Almonte", rnc: "001555999", 
        date: "2024-09-28", vencimiento: "2024-09-28", total: 12300, status: "accepted", paymentStatus: "pagada",
        vendedor: "Admin", plantilla: "InvoiceStandard", paymentTerms: "Al contado", invoiceMode: "tradicional", moneda: "DOP",
        items: [{ id: 1, name: "Reparacion de Hardware", ref: "REP-06", qty: 2, price: 5211.86, disc: 0, itbis: 18, desc: "" }],
        totals: { subtotal: 10423.72, discount: 0, tax: 1876.28, total: 12300 }
    },
];