// Seed data for 3 example companies
// Runs once on first app load (guarded by lollipop_seeded_v4)
import { saveCompanies, setActiveCompanyId, prefixedKey, Company } from './company-store';

const SEED_KEY = 'lollipop_seeded_v4';

// ─────────────────────────────────────────────────────────────────────────────
//  COMPANY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_COMPANIES: Company[] = [
    {
        id: 'comp-tech',
        name: 'TechSolutions RD SRL',
        role: 'Administrador',
        rnc: '1-31-23456-7',
        sector: 'Tecnología',
        color: '#2563eb',
        email: 'admin@techsolutionsrd.com',
        phone: '809-555-1000',
        address: 'Av. 27 de Febrero #251, Santo Domingo',
        createdAt: '2023-01-15',
    },
    {
        id: 'comp-cafe',
        name: 'Cafetería El Buen Sabor',
        role: 'Propietario',
        rnc: '1-01-87654-3',
        sector: 'Restaurante / Comida',
        color: '#d97706',
        email: 'cafe@buensabor.do',
        phone: '809-555-2000',
        address: 'Calle El Conde #18, Zona Colonial',
        createdAt: '2022-06-01',
    },
    {
        id: 'comp-pena',
        name: 'Peña & Asociados SRL',
        role: 'Contador',
        rnc: '1-30-99887-5',
        sector: 'Consultoría Financiera',
        color: '#059669',
        email: 'info@penaasociados.do',
        phone: '809-555-3000',
        address: 'Torre Empresarial, Piso 8, Santiago',
        createdAt: '2021-03-10',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function set(companyId: string, key: string, value: any) {
    localStorage.setItem(`company_${companyId}_${key}`, JSON.stringify(value));
}

// ─────────────────────────────────────────────────────────────────────────────
//  TECH SOLUTIONS RD — Technology company
// ─────────────────────────────────────────────────────────────────────────────
function seedTech() {
    const cid = 'comp-tech';

    set(cid, 'lollipop_company_settings', {
        nombre: 'TechSolutions RD SRL',
        rnc: '1-31-23456-7',
        sector: 'Tecnología',
        email: 'admin@techsolutionsrd.com',
        telefono: '809-555-1000',
        direccion: 'Av. 27 de Febrero #251, Santo Domingo',
        sitioWeb: 'www.techsolutionsrd.com',
        logoColor: '#2563eb',
        moneda: 'DOP',
        tipoComprobante: 'B01',
    });

    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Marcos Perez', codigo: 'MKP', activo: true, creadoEn: '2024-01-10', totalVentas: 124800, totalFacturas: 47, auditLog: [{ accion: 'Creado', fecha: '2024-01-10', por: 'Admin' }] },
        { id: 'V002', nombre: 'Ana Rodriguez', codigo: 'ANR', activo: true, creadoEn: '2024-01-15', totalVentas: 98500, totalFacturas: 35, auditLog: [{ accion: 'Creado', fecha: '2024-01-15', por: 'Admin' }] },
        { id: 'V003', nombre: 'Jose Manuel', codigo: 'JSM', activo: true, creadoEn: '2024-02-01', totalVentas: 71200, totalFacturas: 28, auditLog: [{ accion: 'Creado', fecha: '2024-02-01', por: 'Admin' }] },
    ]);

    const invoices = [
        { id: 'TEC-0042', ecf: 'E3100000042', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'CLARO (CODETEL)', rnc: '101010101', date: '2025-02-20', vencimiento: '2025-03-22', total: 605800, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Marcos Perez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Servicios de Telecomunicaciones', ref: 'SRV-001', qty: 1, price: 513389.83, disc: 0, itbis: 18 }], totals: { subtotal: 513389.83, discount: 0, tax: 92410.17, total: 605800 } },
        { id: 'TEC-0041', ecf: 'E3200000041', tipo: 'B02', tipoName: 'Consumo', cliente: 'Juan Perez', rnc: '00114356789', date: '2025-02-18', vencimiento: '2025-02-18', total: 3500, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Mantenimiento Preventivo', ref: 'MNT-01', qty: 1, price: 2966.10, disc: 0, itbis: 18 }], totals: { subtotal: 2966.10, discount: 0, tax: 533.90, total: 3500 } },
        { id: 'TEC-0040', ecf: 'E3100000040', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'ALTICE DOMINICANA', rnc: '130819985', date: '2025-02-15', vencimiento: '2025-03-17', total: 125000, status: 'pending', paymentStatus: 'pendiente', vendedor: 'Jose Manuel', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Licencias de Software', ref: 'LIC-02', qty: 5, price: 21186.44, disc: 0, itbis: 18 }], totals: { subtotal: 105932.20, discount: 0, tax: 19067.80, total: 125000 } },
        { id: 'TEC-0039', ecf: 'E3100000039', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'GRUPO RAMOS', rnc: '101001010', date: '2025-02-10', vencimiento: '2025-03-12', total: 95000, status: 'accepted', paymentStatus: 'parcial', vendedor: 'Marcos Perez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Equipos de Oficina', ref: 'EQ-03', qty: 2, price: 40254.24, disc: 0, itbis: 18 }], totals: { subtotal: 80508.48, discount: 0, tax: 14491.52, total: 95000 } },
        { id: 'TEC-0038', ecf: 'E3200000038', tipo: 'B02', tipoName: 'Consumo', cliente: 'Maria Santos', rnc: '40212345678', date: '2025-02-08', vencimiento: '2025-02-08', total: 8750, status: 'rejected', paymentStatus: 'pendiente', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Consultoría Básica', ref: 'CNS-04', qty: 1, price: 7415.25, disc: 0, itbis: 18 }], totals: { subtotal: 7415.25, discount: 0, tax: 1334.75, total: 8750 } },
        { id: 'TEC-0037', ecf: 'E3100000037', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'BANRESERVAS', rnc: '101288345', date: '2025-01-28', vencimiento: '2025-02-27', total: 250000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Jose Manuel', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Desarrollo a Medida', ref: 'DEV-05', qty: 1, price: 211864.41, disc: 0, itbis: 18 }], totals: { subtotal: 211864.41, discount: 0, tax: 38135.59, total: 250000 } },
        { id: 'TEC-0036', ecf: 'E3200000036', tipo: 'B02', tipoName: 'Consumo', cliente: 'Pedro Almonte', rnc: '001555999', date: '2025-01-20', vencimiento: '2025-01-20', total: 12300, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Marcos Perez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Reparación de Hardware', ref: 'REP-06', qty: 2, price: 5211.86, disc: 0, itbis: 18 }], totals: { subtotal: 10423.72, discount: 0, tax: 1876.28, total: 12300 } },
        { id: 'TEC-0035', ecf: 'E3100000035', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'POPULAR DOMINICANO', rnc: '101000101', date: '2025-01-15', vencimiento: '2025-02-14', total: 185000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Infraestructura Cloud', ref: 'CLD-07', qty: 1, price: 156779.66, disc: 0, itbis: 18 }], totals: { subtotal: 156779.66, discount: 0, tax: 28220.34, total: 185000 } },
        { id: 'POS-T001', ecf: 'E3200000101', tipo: 'B02', tipoName: 'Consumo', cliente: 'Cliente General', rnc: '', date: '2025-02-20', vencimiento: '2025-02-20', total: 15000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Marcos Perez', invoiceMode: 'electronico', moneda: 'DOP', source: 'pos', items: [{ id: 1, name: 'Laptop Dell XPS', ref: 'PRD-001', qty: 1, price: 12711.86, disc: 0, itbis: 18 }], totals: { subtotal: 12711.86, discount: 0, tax: 2288.14, total: 15000 } },
        { id: 'POS-T002', ecf: 'E3200000102', tipo: 'B02', tipoName: 'Consumo', cliente: 'Cliente General', rnc: '', date: '2025-02-25', vencimiento: '2025-02-25', total: 8500, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', source: 'pos', items: [{ id: 1, name: 'Teclado + Mouse', ref: 'PRD-003', qty: 2, price: 3601.69, disc: 0, itbis: 18 }], totals: { subtotal: 7203.38, discount: 0, tax: 1296.62, total: 8500 } },
    ];
    set(cid, 'invoice_emitted', invoices);

    const shifts = [
        {
            id: 'SHF-T001', openTime: '08:00', closeTime: '14:00', closeDate: '25/02/2025',
            openingFloat: 5000, totalSales: 23500, cashCountTotal: 28100, salesCount: 4,
            openVendedor: 'Marcos Perez', closeVendedor: 'Ana Rodriguez',
            denomCounts: {},
            sales: [
                { id: 'POS-T001', method: 'Efectivo', time: '09:15', total: 15000 },
                { id: 'POS-T003', method: 'Tarjeta', time: '10:45', total: 3200 },
                { id: 'POS-T004', method: 'Efectivo', time: '12:00', total: 3800 },
                { id: 'POS-T005', method: 'Transferencia', time: '13:30', total: 1500 },
            ]
        },
        {
            id: 'SHF-T002', openTime: '14:00', closeTime: '20:00', closeDate: '25/02/2025',
            openingFloat: 5000, totalSales: 18700, cashCountTotal: 23200, salesCount: 3,
            openVendedor: 'Ana Rodriguez', closeVendedor: 'Ana Rodriguez',
            denomCounts: {},
            sales: [
                { id: 'POS-T002', method: 'Tarjeta', time: '15:20', total: 8500 },
                { id: 'POS-T006', method: 'Efectivo', time: '17:00', total: 6700 },
                { id: 'POS-T007', method: 'Efectivo', time: '18:45', total: 3500 },
            ]
        },
        {
            id: 'SHF-T003', openTime: '08:00', closeTime: '16:00', closeDate: '01/03/2025',
            openingFloat: 5000, totalSales: 31200, cashCountTotal: 35800, salesCount: 5,
            openVendedor: 'Jose Manuel', closeVendedor: 'Jose Manuel',
            denomCounts: {},
            sales: [
                { id: 'POS-T008', method: 'Efectivo', time: '08:30', total: 4500 },
                { id: 'POS-T009', method: 'Tarjeta', time: '10:00', total: 9800 },
                { id: 'POS-T010', method: 'Transferencia', time: '11:30', total: 7200 },
                { id: 'POS-T011', method: 'Efectivo', time: '13:00', total: 5400 },
                { id: 'POS-T012', method: 'Tarjeta', time: '14:45', total: 4300 },
            ]
        },
        {
            id: 'SHF-T004', openTime: '09:00', closeTime: '17:00', closeDate: '05/03/2025',
            openingFloat: 5000, totalSales: 28400, cashCountTotal: 33000, salesCount: 3,
            openVendedor: 'Marcos Perez', closeVendedor: 'Marcos Perez',
            denomCounts: {},
            sales: [
                { id: 'POS-T013', method: 'Tarjeta', time: '10:30', total: 12500 },
                { id: 'POS-T014', method: 'Efectivo', time: '12:00', total: 8400 },
                { id: 'POS-T015', method: 'Transferencia', time: '15:20', total: 7500 },
            ]
        },
    ];
    set(cid, 'pos_shift_history', shifts);
}

// ─────────────────────────────────────────────────────────────────────────────
//  CAFETERÍA EL BUEN SABOR — Restaurant, heavy POS
// ─────────────────────────────────────────────────────────────────────────────
function seedCafe() {
    const cid = 'comp-cafe';

    set(cid, 'lollipop_company_settings', {
        nombre: 'Cafetería El Buen Sabor',
        rnc: '1-01-87654-3',
        sector: 'Restaurante / Comida',
        email: 'cafe@buensabor.do',
        telefono: '809-555-2000',
        direccion: 'Calle El Conde #18, Zona Colonial, Santo Domingo',
        sitioWeb: 'www.buensabor.do',
        logoColor: '#d97706',
        moneda: 'DOP',
        tipoComprobante: 'B02',
    });

    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Carmen Diaz', codigo: 'CMD', activo: true, creadoEn: '2022-06-01', totalVentas: 384200, totalFacturas: 512, auditLog: [{ accion: 'Creado', fecha: '2022-06-01', por: 'Admin' }] },
        { id: 'V002', nombre: 'Luis Torres', codigo: 'LUT', activo: true, creadoEn: '2022-06-01', totalVentas: 298600, totalFacturas: 401, auditLog: [{ accion: 'Creado', fecha: '2022-06-01', por: 'Admin' }] },
        { id: 'V003', nombre: 'Rosa Peña', codigo: 'ROP', activo: true, creadoEn: '2023-02-10', totalVentas: 215100, totalFacturas: 289, auditLog: [{ accion: 'Creado', fecha: '2023-02-10', por: 'Admin' }] },
    ]);

    const invoices = [
        { id: 'CAF-0012', ecf: 'E3200000012', tipo: 'B02', tipoName: 'Consumo', cliente: 'Mesa #5 — Reunión Corporativa', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 8400, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Carmen Diaz', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Menú Corporativo x8', ref: 'MENU-CORP', qty: 8, price: 889.83, disc: 0, itbis: 18 }], totals: { subtotal: 7118.64, discount: 0, tax: 1281.36, total: 8400 } },
        { id: 'CAF-0011', ecf: 'E3200000011', tipo: 'B02', tipoName: 'Consumo', cliente: 'Eventos SRL', rnc: '101010102', date: '2025-03-04', vencimiento: '2025-03-04', total: 45000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Luis Torres', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Catering Empresarial', ref: 'CAT-001', qty: 1, price: 38135.59, disc: 0, itbis: 18 }], totals: { subtotal: 38135.59, discount: 0, tax: 6864.41, total: 45000 } },
        { id: 'CAF-0010', ecf: 'E3200000010', tipo: 'B02', tipoName: 'Consumo', cliente: 'Gobierno Central', rnc: '200000001', date: '2025-02-28', vencimiento: '2025-03-30', total: 120000, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Carmen Diaz', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Almuerzos Institucionales', ref: 'ALM-GOB', qty: 200, price: 508.47, disc: 0, itbis: 18 }], totals: { subtotal: 101694.00, discount: 0, tax: 18306.00, total: 120000 } },
        { id: 'POS-C001', ecf: 'E3200000201', tipo: 'B02', tipoName: 'Consumo', cliente: 'Consumidor Final', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 850, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Carmen Diaz', source: 'pos', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Desayuno Completo x2', ref: 'DES-001', qty: 2, price: 360.17, disc: 0, itbis: 18 }], totals: { subtotal: 720.34, discount: 0, tax: 129.66, total: 850 } },
        { id: 'POS-C002', ecf: 'E3200000202', tipo: 'B02', tipoName: 'Consumo', cliente: 'Consumidor Final', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 1200, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Luis Torres', source: 'pos', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Almuerzo Ejecutivo', ref: 'ALM-001', qty: 2, price: 508.47, disc: 0, itbis: 18 }], totals: { subtotal: 1016.94, discount: 0, tax: 183.06, total: 1200 } },
        { id: 'POS-C003', ecf: 'E3200000203', tipo: 'B02', tipoName: 'Consumo', cliente: 'Consumidor Final', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 450, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Rosa Peña', source: 'pos', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Café + Tostada', ref: 'CAF-001', qty: 1, price: 381.36, disc: 0, itbis: 18 }], totals: { subtotal: 381.36, discount: 0, tax: 68.64, total: 450 } },
    ];
    set(cid, 'invoice_emitted', invoices);

    const mkShift = (id: string, date: string, open: string, close: string, vendOpen: string, vendClose: string, sales: any[]) => ({
        id, openTime: open, closeTime: close, closeDate: date,
        openingFloat: 2000,
        totalSales: sales.reduce((a, s) => a + s.total, 0),
        cashCountTotal: sales.reduce((a, s) => a + s.total, 0) + 2000 - 150,
        salesCount: sales.length,
        openVendedor: vendOpen, closeVendedor: vendClose,
        denomCounts: {}, sales,
    });

    const shifts = [
        mkShift('SHF-C001', '04/03/2025', '06:00', '14:00', 'Carmen Diaz', 'Carmen Diaz', [
            { id: 'POS-C010', method: 'Efectivo', time: '06:30', total: 350 },
            { id: 'POS-C011', method: 'Efectivo', time: '07:15', total: 680 },
            { id: 'POS-C012', method: 'Tarjeta', time: '08:00', total: 1200 },
            { id: 'POS-C013', method: 'Efectivo', time: '09:30', total: 540 },
            { id: 'POS-C014', method: 'Efectivo', time: '11:00', total: 890 },
            { id: 'POS-C015', method: 'Tarjeta', time: '12:45', total: 2400 },
        ]),
        mkShift('SHF-C002', '04/03/2025', '14:00', '22:00', 'Luis Torres', 'Luis Torres', [
            { id: 'POS-C020', method: 'Efectivo', time: '14:30', total: 780 },
            { id: 'POS-C021', method: 'Tarjeta', time: '15:45', total: 3200 },
            { id: 'POS-C022', method: 'Efectivo', time: '17:00', total: 450 },
            { id: 'POS-C023', method: 'Efectivo', time: '18:30', total: 620 },
            { id: 'POS-C024', method: 'Tarjeta', time: '20:00', total: 4800 },
        ]),
        mkShift('SHF-C003', '05/03/2025', '06:00', '14:00', 'Rosa Peña', 'Rosa Peña', [
            { id: 'POS-C001', method: 'Efectivo', time: '07:00', total: 850 },
            { id: 'POS-C030', method: 'Efectivo', time: '08:20', total: 420 },
            { id: 'POS-C031', method: 'Tarjeta', time: '09:10', total: 1800 },
            { id: 'POS-C032', method: 'Efectivo', time: '10:30', total: 560 },
            { id: 'POS-C033', method: 'Efectivo', time: '11:45', total: 730 },
            { id: 'POS-C034', method: 'Transferencia', time: '13:00', total: 2500 },
            { id: 'POS-C035', method: 'Efectivo', time: '13:40', total: 380 },
        ]),
        mkShift('SHF-C004', '05/03/2025', '14:00', '22:00', 'Luis Torres', 'Carmen Diaz', [
            { id: 'POS-C002', method: 'Tarjeta', time: '14:00', total: 1200 },
            { id: 'POS-C003', method: 'Efectivo', time: '15:00', total: 450 },
            { id: 'POS-C040', method: 'Efectivo', time: '16:00', total: 680 },
            { id: 'POS-C041', method: 'Tarjeta', time: '17:30', total: 3600 },
            { id: 'POS-C042', method: 'Efectivo', time: '19:00', total: 920 },
            { id: 'POS-C043', method: 'Efectivo', time: '20:30', total: 540 },
        ]),
        mkShift('SHF-C005', '06/03/2025', '06:00', '14:00', 'Carmen Diaz', 'Carmen Diaz', [
            { id: 'POS-C050', method: 'Efectivo', time: '06:45', total: 280 },
            { id: 'POS-C051', method: 'Tarjeta', time: '07:30', total: 960 },
            { id: 'POS-C052', method: 'Efectivo', time: '08:45', total: 450 },
            { id: 'POS-C053', method: 'Efectivo', time: '10:00', total: 780 },
            { id: 'POS-C054', method: 'Tarjeta', time: '11:20', total: 2100 },
        ]),
        mkShift('SHF-C006', '06/03/2025', '14:00', '22:00', 'Rosa Peña', 'Rosa Peña', [
            { id: 'POS-C060', method: 'Efectivo', time: '14:20', total: 520 },
            { id: 'POS-C061', method: 'Tarjeta', time: '15:30', total: 1800 },
            { id: 'POS-C062', method: 'Efectivo', time: '17:00', total: 430 },
            { id: 'POS-C063', method: 'Transferencia', time: '19:40', total: 6500 },
            { id: 'POS-C064', method: 'Efectivo', time: '21:00', total: 690 },
        ]),
    ];
    set(cid, 'pos_shift_history', shifts);
}

// ─────────────────────────────────────────────────────────────────────────────
//  PEÑA & ASOCIADOS — Financial consulting
// ─────────────────────────────────────────────────────────────────────────────
function seedPena() {
    const cid = 'comp-pena';

    set(cid, 'lollipop_company_settings', {
        nombre: 'Peña & Asociados SRL',
        rnc: '1-30-99887-5',
        sector: 'Consultoría Financiera',
        email: 'info@penaasociados.do',
        telefono: '809-555-3000',
        direccion: 'Torre Empresarial, Piso 8, Av. Las Carreras #22, Santiago',
        sitioWeb: 'www.penaasociados.do',
        logoColor: '#059669',
        moneda: 'DOP',
        tipoComprobante: 'B01',
    });

    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Roberto Peña', codigo: 'RBP', activo: true, creadoEn: '2021-03-10', totalVentas: 3400000, totalFacturas: 28, auditLog: [{ accion: 'Creado', fecha: '2021-03-10', por: 'Admin' }] },
        { id: 'V002', nombre: 'Sandra Gomez', codigo: 'SGM', activo: true, creadoEn: '2022-01-15', totalVentas: 1850000, totalFacturas: 14, auditLog: [{ accion: 'Creado', fecha: '2022-01-15', por: 'Admin' }] },
    ]);

    const invoices = [
        { id: 'PEN-0028', ecf: 'E3100000028', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Constructora Dominicana SA', rnc: '101999100', date: '2025-03-01', vencimiento: '2025-03-31', total: 450000, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Auditoría Fiscal Anual 2024', ref: 'AUD-001', qty: 1, price: 381356, disc: 0, itbis: 18 }], totals: { subtotal: 381356, discount: 0, tax: 68644, total: 450000 } },
        { id: 'PEN-0027', ecf: 'E3100000027', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Impartaciones Del Caribe', rnc: '101500200', date: '2025-02-20', vencimiento: '2025-03-22', total: 280000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Sandra Gomez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Consultoría NIIF Q1 2025', ref: 'CNS-002', qty: 1, price: 237288, disc: 0, itbis: 18 }], totals: { subtotal: 237288, discount: 0, tax: 42712, total: 280000 } },
        { id: 'PEN-0026', ecf: 'E3100000026', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Grupo Industrial SRL', rnc: '101300010', date: '2025-02-10', vencimiento: '2025-03-12', total: 750000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Due Diligence Financiero', ref: 'DDL-003', qty: 1, price: 635593, disc: 0, itbis: 18 }], totals: { subtotal: 635593, discount: 0, tax: 114407, total: 750000 } },
        { id: 'PEN-0025', ecf: 'E3100000025', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Banco Nacional RD', rnc: '101000500', date: '2025-01-30', vencimiento: '2025-02-28', total: 1200000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Plan Estratégico Financiero', ref: 'EST-004', qty: 1, price: 1016949, disc: 0, itbis: 18 }], totals: { subtotal: 1016949, discount: 0, tax: 183051, total: 1200000 } },
        { id: 'PEN-0024', ecf: 'E3100000024', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Ministerio de Hacienda', rnc: '200000002', date: '2025-01-15', vencimiento: '2025-02-14', total: 900000, status: 'pending', paymentStatus: 'pendiente', vendedor: 'Sandra Gomez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Implementación SIGEF', ref: 'SIG-005', qty: 1, price: 762712, disc: 0, itbis: 18 }], totals: { subtotal: 762712, discount: 0, tax: 137288, total: 900000 } },
        { id: 'PEN-0023', ecf: 'E3100000023', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Zona Franca Industrial', rnc: '101800800', date: '2024-12-20', vencimiento: '2025-01-19', total: 380000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Restructuración Empresarial', ref: 'RST-006', qty: 1, price: 322034, disc: 0, itbis: 18 }], totals: { subtotal: 322034, discount: 0, tax: 57966, total: 380000 } },
        { id: 'PEN-0022', ecf: 'E3100000022', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Aeropuerto Internacional', rnc: '200000010', date: '2024-12-10', vencimiento: '2025-01-09', total: 620000, status: 'accepted', paymentStatus: 'parcial', vendedor: 'Sandra Gomez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Auditoría de Operaciones', ref: 'AUD-007', qty: 1, price: 525424, disc: 0, itbis: 18 }], totals: { subtotal: 525424, discount: 0, tax: 94576, total: 620000 } },
        { id: 'PEN-0021', ecf: 'E3100000021', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'AFP Reservas', rnc: '101200600', date: '2024-11-30', vencimiento: '2024-12-30', total: 540000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Valuación Actuarial Q4 2024', ref: 'VAL-008', qty: 1, price: 457627, disc: 0, itbis: 18 }], totals: { subtotal: 457627, discount: 0, tax: 82373, total: 540000 } },
    ];
    set(cid, 'invoice_emitted', invoices);

    const shifts = [
        {
            id: 'SHF-P001', openTime: '08:30', closeTime: '17:00', closeDate: '20/02/2025',
            openingFloat: 10000, totalSales: 45000, cashCountTotal: 54800, salesCount: 3,
            openVendedor: 'Roberto Peña', closeVendedor: 'Roberto Peña', denomCounts: {},
            sales: [
                { id: 'POS-P001', method: 'Transferencia', time: '09:00', total: 20000 },
                { id: 'POS-P002', method: 'Transferencia', time: '12:30', total: 15000 },
                { id: 'POS-P003', method: 'Efectivo', time: '15:00', total: 10000 },
            ]
        },
        {
            id: 'SHF-P002', openTime: '08:30', closeTime: '17:00', closeDate: '05/03/2025',
            openingFloat: 10000, totalSales: 68000, cashCountTotal: 76500, salesCount: 4,
            openVendedor: 'Sandra Gomez', closeVendedor: 'Sandra Gomez', denomCounts: {},
            sales: [
                { id: 'POS-P004', method: 'Transferencia', time: '09:30', total: 25000 },
                { id: 'POS-P005', method: 'Cheque', time: '11:00', total: 18000 },
                { id: 'POS-P006', method: 'Transferencia', time: '14:00', total: 15000 },
                { id: 'POS-P007', method: 'Efectivo', time: '16:00', total: 10000 },
            ]
        },
    ];
    set(cid, 'pos_shift_history', shifts);
}

// ─────────────────────────────────────────────────────────────────────────────
//  ENTRY POINT — call once on app mount
// ─────────────────────────────────────────────────────────────────────────────
export function seedAllCompaniesData(): void {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(SEED_KEY)) return; // already seeded

    saveCompanies(SEED_COMPANIES);
    seedTech();
    seedCafe();
    seedPena();

    // Default active company: TechSolutions
    setActiveCompanyId('comp-tech');

    // Mirror TechSolutions data into generic keys so all pages see it immediately
    const MIRROR_KEYS = ['invoice_emitted', 'invoice_drafts', 'pagos_recibidos', 'pos_shift_history', 'pos_vendedores', 'lollipop_company_settings'];
    MIRROR_KEYS.forEach(key => {
        const val = localStorage.getItem(`company_comp-tech_${key}`);
        if (val !== null) localStorage.setItem(key, val);
    });

    localStorage.setItem(SEED_KEY, '1');
}
