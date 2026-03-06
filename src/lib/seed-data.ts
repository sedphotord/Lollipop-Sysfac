// Seed data for 3 example companies — v7
// Runs once on first app load (guarded by lollipop_seeded_v7)
import { saveCompanies, setActiveCompanyId, Company } from './company-store';
import { saveUsers, setUserCompanyRole } from './auth-store';

const SEED_KEY = 'lollipop_seeded_v7';

export const SEED_COMPANIES: Company[] = [
    { id: 'comp-tech', name: 'TechSolutions RD SRL', role: 'Administrador', rnc: '1-31-23456-7', sector: 'Tecnología', color: '#2563eb', email: 'admin@techsolutionsrd.com', phone: '809-555-1000', address: 'Av. 27 de Febrero #251, Santo Domingo', createdAt: '2023-01-15' },
    { id: 'comp-cafe', name: 'Cafetería El Buen Sabor', role: 'Propietario', rnc: '1-01-87654-3', sector: 'Restaurante / Comida', color: '#d97706', email: 'cafe@buensabor.do', phone: '809-555-2000', address: 'Calle El Conde #18, Zona Colonial', createdAt: '2022-06-01' },
    { id: 'comp-pena', name: 'Peña & Asociados SRL', role: 'Contador', rnc: '1-30-99887-5', sector: 'Consultoría Financiera', color: '#059669', email: 'info@penaasociados.do', phone: '809-555-3000', address: 'Torre Empresarial, Piso 8, Santiago', createdAt: '2021-03-10' },
];

function set(companyId: string, key: string, value: any) {
    localStorage.setItem(`company_${companyId}_${key}`, JSON.stringify(value));
}

// ── TECH SOLUTIONS RD ────────────────────────────────────────────────────────
function seedTech() {
    const cid = 'comp-tech';
    set(cid, 'lollipop_company_settings', { nombre: 'TechSolutions RD SRL', rnc: '1-31-23456-7', sector: 'Tecnología', email: 'admin@techsolutionsrd.com', telefono: '809-555-1000', direccion: 'Av. 27 de Febrero #251, Santo Domingo', sitioWeb: 'www.techsolutionsrd.com', logoColor: '#2563eb', moneda: 'DOP', tipoComprobante: 'B01' });
    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Marcos Perez', codigo: 'MKP', activo: true, creadoEn: '2024-01-10', totalVentas: 124800, totalFacturas: 47, auditLog: [{ accion: 'Creado', fecha: '2024-01-10', por: 'Admin' }] },
        { id: 'V002', nombre: 'Ana Rodriguez', codigo: 'ANR', activo: true, creadoEn: '2024-01-15', totalVentas: 98500, totalFacturas: 35, auditLog: [{ accion: 'Creado', fecha: '2024-01-15', por: 'Admin' }] },
        { id: 'V003', nombre: 'Jose Manuel', codigo: 'JSM', activo: true, creadoEn: '2024-02-01', totalVentas: 71200, totalFacturas: 28, auditLog: [{ accion: 'Creado', fecha: '2024-02-01', por: 'Admin' }] },
    ]);
    set(cid, 'clientes', [
        { id: 'CLI-T01', nombre: 'CLARO (CODETEL)', rnc: '101010101', tipo: 'Empresa', email: 'compras@claro.com.do', telefono: '809-200-1000', direccion: 'Av. John F. Kennedy, Santo Domingo', credito: 500000, saldo: 605800 },
        { id: 'CLI-T02', nombre: 'ALTICE DOMINICANA', rnc: '130819985', tipo: 'Empresa', email: 'cxp@altice.do', telefono: '809-200-2000', direccion: 'Av. 27 de Febrero 450', credito: 300000, saldo: 125000 },
        { id: 'CLI-T03', nombre: 'BANRESERVAS', rnc: '101288345', tipo: 'Empresa', email: 'proveedores@banreservas.com', telefono: '809-960-2121', direccion: 'Isabel la Católica #100', credito: 800000, saldo: 0 },
        { id: 'CLI-T04', nombre: 'GRUPO RAMOS', rnc: '101001010', tipo: 'Empresa', email: 'compras@gruporamos.do', telefono: '809-566-5000', direccion: 'Av. Tiradentes #44', credito: 200000, saldo: 47500 },
        { id: 'CLI-T05', nombre: 'POPULAR DOMINICANO', rnc: '101000101', tipo: 'Empresa', email: 'cxp@bpd.com.do', telefono: '809-544-5000', direccion: 'Av. John F. Kennedy 20', credito: 500000, saldo: 0 },
    ]);
    set(cid, 'productos', [
        { id: 'PRD-T01', nombre: 'Laptop Dell XPS 15', ref: 'LTP-001', categoria: 'Hardware', precio: 89500, itbis: 18, stock: 12, unidad: 'Unidad', activo: true },
        { id: 'PRD-T02', nombre: 'Router Cisco Meraki MX68', ref: 'NET-002', categoria: 'Redes', precio: 42000, itbis: 18, stock: 8, unidad: 'Unidad', activo: true },
        { id: 'PRD-T03', nombre: 'Licencia Microsoft 365 Business', ref: 'LIC-003', categoria: 'Software', precio: 4200, itbis: 18, stock: 999, unidad: 'Licencia/año', activo: true },
        { id: 'PRD-T04', nombre: 'Servicio de Mantenimiento Preventivo', ref: 'SRV-004', categoria: 'Servicios', precio: 8500, itbis: 18, stock: 999, unidad: 'Visita', activo: true },
        { id: 'PRD-T05', nombre: 'Desarrollo de App Web', ref: 'DEV-005', categoria: 'Desarrollo', precio: 150000, itbis: 18, stock: 999, unidad: 'Proyecto', activo: true },
        { id: 'PRD-T06', nombre: 'Servidor HP ProLiant DL380', ref: 'SRV-006', categoria: 'Hardware', precio: 185000, itbis: 18, stock: 3, unidad: 'Unidad', activo: true },
        { id: 'PRD-T07', nombre: 'Cámara IP Hikvision 4MP', ref: 'SEC-007', categoria: 'Seguridad', precio: 7800, itbis: 18, stock: 25, unidad: 'Unidad', activo: true },
        { id: 'PRD-T08', nombre: 'UPS APC 1500VA', ref: 'UPS-008', categoria: 'Hardware', precio: 12500, itbis: 18, stock: 15, unidad: 'Unidad', activo: true },
    ]);
    set(cid, 'gastos', [
        { id: 'GAS-T01', proveedor: 'AWS Amazon', descripcion: 'Servidores Cloud — Marzo 2025', monto: 45000, fecha: '2025-03-01', categoria: 'Tecnología', status: 'pagado', ncf: 'B0100000201' },
        { id: 'GAS-T02', proveedor: 'Oficina Nacional de Renta (ONE)', descripcion: 'IT-1 Trimestre 1 2025', monto: 38500, fecha: '2025-03-05', categoria: 'Impuestos', status: 'pagado', ncf: 'B1400000050' },
        { id: 'GAS-T03', proveedor: 'Propietario Local Comercial', descripcion: 'Alquiler Oficina Q1 2025', monto: 85000, fecha: '2025-01-04', categoria: 'Alquiler', status: 'pagado', ncf: 'B0200000015' },
        { id: 'GAS-T04', proveedor: 'Edeeste', descripcion: 'Electricidad — Febrero 2025', monto: 12400, fecha: '2025-02-25', categoria: 'Servicios Básicos', status: 'pagado', ncf: 'B0100000305' },
        { id: 'GAS-T05', proveedor: 'Telam SRL', descripcion: 'Internet Fibra 500Mbps — Marzo', monto: 9800, fecha: '2025-03-01', categoria: 'Comunicaciones', status: 'pagado', ncf: 'B0100000412' },
    ]);
    set(cid, 'bancos', [
        { id: 'BNK-T01', banco: 'Banco Popular Dominicano', cuenta: '###-###-12345', tipo: 'Corriente', moneda: 'DOP', saldo: 1850000, ultimoMovimiento: '2025-03-05' },
        { id: 'BNK-T02', banco: 'BanReservas', cuenta: '###-###-98765', tipo: 'Ahorros', moneda: 'DOP', saldo: 320000, ultimoMovimiento: '2025-03-01' },
        { id: 'BNK-T03', banco: 'Scotiabank', cuenta: '###-###-11223', tipo: 'Corriente', moneda: 'USD', saldo: 8500, ultimoMovimiento: '2025-02-28' },
    ]);
    set(cid, 'invoice_emitted', [
        { id: 'TEC-0042', ecf: 'E3100000042', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'CLARO (CODETEL)', rnc: '101010101', date: '2025-02-20', vencimiento: '2025-03-22', total: 605800, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Marcos Perez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Servicios de Telecomunicaciones', ref: 'SRV-001', qty: 1, price: 513389.83, disc: 0, itbis: 18 }], totals: { subtotal: 513389.83, discount: 0, tax: 92410.17, total: 605800 } },
        { id: 'TEC-0041', ecf: 'E3200000041', tipo: 'B02', tipoName: 'Consumo', cliente: 'Juan Perez', rnc: '00114356789', date: '2025-02-18', vencimiento: '2025-02-18', total: 3500, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Mantenimiento Preventivo', ref: 'MNT-01', qty: 1, price: 2966.10, disc: 0, itbis: 18 }], totals: { subtotal: 2966.10, discount: 0, tax: 533.90, total: 3500 } },
        { id: 'TEC-0040', ecf: 'E3100000040', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'ALTICE DOMINICANA', rnc: '130819985', date: '2025-02-15', vencimiento: '2025-03-17', total: 125000, status: 'pending', paymentStatus: 'pendiente', vendedor: 'Jose Manuel', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Licencias de Software', ref: 'LIC-02', qty: 5, price: 21186.44, disc: 0, itbis: 18 }], totals: { subtotal: 105932.20, discount: 0, tax: 19067.80, total: 125000 } },
        { id: 'TEC-0037', ecf: 'E3100000037', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'BANRESERVAS', rnc: '101288345', date: '2025-01-28', vencimiento: '2025-02-27', total: 250000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Jose Manuel', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Desarrollo a Medida', ref: 'DEV-05', qty: 1, price: 211864.41, disc: 0, itbis: 18 }], totals: { subtotal: 211864.41, discount: 0, tax: 38135.59, total: 250000 } },
        { id: 'TEC-0035', ecf: 'E3100000035', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'POPULAR DOMINICANO', rnc: '101000101', date: '2025-01-15', vencimiento: '2025-02-14', total: 185000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Ana Rodriguez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Infraestructura Cloud', ref: 'CLD-07', qty: 1, price: 156779.66, disc: 0, itbis: 18 }], totals: { subtotal: 156779.66, discount: 0, tax: 28220.34, total: 185000 } },
    ]);
    set(cid, 'pos_shift_history', [
        { id: 'SHF-T001', openTime: '08:00', closeTime: '14:00', closeDate: '25/02/2025', openingFloat: 5000, totalSales: 23500, cashCountTotal: 28100, salesCount: 4, openVendedor: 'Marcos Perez', closeVendedor: 'Ana Rodriguez', denomCounts: {}, sales: [{ id: 'POS-T001', method: 'Efectivo', time: '09:15', total: 15000 }, { id: 'POS-T003', method: 'Tarjeta', time: '10:45', total: 3200 }, { id: 'POS-T004', method: 'Efectivo', time: '12:00', total: 3800 }, { id: 'POS-T005', method: 'Transferencia', time: '13:30', total: 1500 }] },
        { id: 'SHF-T002', openTime: '14:00', closeTime: '20:00', closeDate: '25/02/2025', openingFloat: 5000, totalSales: 18700, cashCountTotal: 23200, salesCount: 3, openVendedor: 'Ana Rodriguez', closeVendedor: 'Ana Rodriguez', denomCounts: {}, sales: [{ id: 'POS-T002', method: 'Tarjeta', time: '15:20', total: 8500 }, { id: 'POS-T006', method: 'Efectivo', time: '17:00', total: 6700 }, { id: 'POS-T007', method: 'Efectivo', time: '18:45', total: 3500 }] },
    ]);
}

// ── CAFETERÍA EL BUEN SABOR ──────────────────────────────────────────────────
function seedCafe() {
    const cid = 'comp-cafe';
    set(cid, 'lollipop_company_settings', { nombre: 'Cafetería El Buen Sabor', rnc: '1-01-87654-3', sector: 'Restaurante / Comida', email: 'cafe@buensabor.do', telefono: '809-555-2000', direccion: 'Calle El Conde #18, Zona Colonial, Santo Domingo', sitioWeb: 'www.buensabor.do', logoColor: '#d97706', moneda: 'DOP', tipoComprobante: 'B02' });
    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Carmen Diaz', codigo: 'CMD', activo: true, creadoEn: '2022-06-01', totalVentas: 384200, totalFacturas: 512, auditLog: [{ accion: 'Creado', fecha: '2022-06-01', por: 'Admin' }] },
        { id: 'V002', nombre: 'Luis Torres', codigo: 'LUT', activo: true, creadoEn: '2022-06-01', totalVentas: 298600, totalFacturas: 401, auditLog: [{ accion: 'Creado', fecha: '2022-06-01', por: 'Admin' }] },
        { id: 'V003', nombre: 'Rosa Peña', codigo: 'ROP', activo: true, creadoEn: '2023-02-10', totalVentas: 215100, totalFacturas: 289, auditLog: [{ accion: 'Creado', fecha: '2023-02-10', por: 'Admin' }] },
    ]);
    set(cid, 'clientes', [
        { id: 'CLI-C01', nombre: 'Gobierno Central — MINERD', rnc: '200000001', tipo: 'Gobierno', email: 'compras@minerd.gob.do', telefono: '809-688-4000', direccion: 'Av. Máximo Gómez #31', credito: 150000, saldo: 120000 },
        { id: 'CLI-C02', nombre: 'Eventos Feliz SRL', rnc: '101010102', tipo: 'Empresa', email: 'info@eventosfeliz.do', telefono: '809-476-5555', direccion: 'Av. Luperón km 9', credito: 50000, saldo: 0 },
        { id: 'CLI-C03', nombre: 'Hotel Embajador', rnc: '101400100', tipo: 'Empresa', email: 'compras@embajador.do', telefono: '809-221-2131', direccion: 'Av. Sarasota #65', credito: 80000, saldo: 35000 },
        { id: 'CLI-C04', nombre: 'Consumidor Final', rnc: '', tipo: 'Persona', email: '', telefono: '', direccion: '', credito: 0, saldo: 0 },
    ]);
    set(cid, 'productos', [
        { id: 'PRD-C01', nombre: 'Desayuno Completo', ref: 'DES-001', categoria: 'Desayunos', precio: 425, itbis: 18, stock: 999, unidad: 'Plato', activo: true },
        { id: 'PRD-C02', nombre: 'Almuerzo Ejecutivo', ref: 'ALM-001', categoria: 'Almuerzos', precio: 595, itbis: 18, stock: 999, unidad: 'Plato', activo: true },
        { id: 'PRD-C03', nombre: 'Café Americano', ref: 'CAF-001', categoria: 'Bebidas', precio: 120, itbis: 18, stock: 999, unidad: 'Taza', activo: true },
        { id: 'PRD-C04', nombre: 'Jugo Natural (Chinola/Lechoza)', ref: 'JUG-001', categoria: 'Bebidas', precio: 180, itbis: 18, stock: 999, unidad: 'Vaso', activo: true },
        { id: 'PRD-C05', nombre: 'Menú Corporativo x8 personas', ref: 'MENU-CORP', categoria: 'Catering', precio: 8400, itbis: 18, stock: 999, unidad: 'Pedido', activo: true },
        { id: 'PRD-C06', nombre: 'Tostada con Mantequilla', ref: 'TOS-001', categoria: 'Desayunos', precio: 95, itbis: 18, stock: 999, unidad: 'Unidad', activo: true },
        { id: 'PRD-C07', nombre: 'Refresco (Lata)', ref: 'REF-001', categoria: 'Bebidas', precio: 85, itbis: 18, stock: 80, unidad: 'Unidad', activo: true },
        { id: 'PRD-C08', nombre: 'Postre del Día', ref: 'POS-001', categoria: 'Postres', precio: 250, itbis: 18, stock: 999, unidad: 'Porción', activo: true },
    ]);
    set(cid, 'gastos', [
        { id: 'GAS-C01', proveedor: 'Supermercado Nacional', descripcion: 'Ingredientes y Víveres — Semana 9', monto: 28500, fecha: '2025-03-03', categoria: 'Insumos', status: 'pagado', ncf: 'B0100000510' },
        { id: 'GAS-C02', proveedor: 'Distribuidora de Gas Caribe', descripcion: 'Gas LP — 4 Tanques', monto: 12800, fecha: '2025-03-01', categoria: 'Gas/Combustible', status: 'pagado', ncf: 'B0100000220' },
        { id: 'GAS-C03', proveedor: 'Propietario Local El Conde', descripcion: 'Alquiler Local Marzo 2025', monto: 55000, fecha: '2025-03-01', categoria: 'Alquiler', status: 'pagado', ncf: 'B0200000090' },
        { id: 'GAS-C04', proveedor: 'Edeeste', descripcion: 'Electricidad — Febrero 2025', monto: 18700, fecha: '2025-02-26', categoria: 'Servicios Básicos', status: 'pagado', ncf: 'B0100000601' },
        { id: 'GAS-C05', proveedor: 'Lavandería Ropa de Mesa', descripcion: 'Lavado mantelería y uniformes', monto: 3500, fecha: '2025-03-05', categoria: 'Limpieza', status: 'pendiente', ncf: '' },
    ]);
    set(cid, 'bancos', [
        { id: 'BNK-C01', banco: 'Banco BHD León', cuenta: '###-###-45678', tipo: 'Corriente', moneda: 'DOP', saldo: 285000, ultimoMovimiento: '2025-03-05' },
        { id: 'BNK-C02', banco: 'Asociación Popular de Ahorros', cuenta: '###-###-32109', tipo: 'Ahorros', moneda: 'DOP', saldo: 120000, ultimoMovimiento: '2025-02-28' },
    ]);
    set(cid, 'invoice_emitted', [
        { id: 'CAF-0012', ecf: 'E3200000012', tipo: 'B02', tipoName: 'Consumo', cliente: 'Mesa #5 — Reunión Corporativa', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 8400, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Carmen Diaz', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Menú Corporativo x8', ref: 'MENU-CORP', qty: 8, price: 889.83, disc: 0, itbis: 18 }], totals: { subtotal: 7118.64, discount: 0, tax: 1281.36, total: 8400 } },
        { id: 'CAF-0011', ecf: 'E3200000011', tipo: 'B02', tipoName: 'Consumo', cliente: 'Eventos SRL', rnc: '101010102', date: '2025-03-04', vencimiento: '2025-03-04', total: 45000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Luis Torres', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Catering Empresarial', ref: 'CAT-001', qty: 1, price: 38135.59, disc: 0, itbis: 18 }], totals: { subtotal: 38135.59, discount: 0, tax: 6864.41, total: 45000 } },
        { id: 'CAF-0010', ecf: 'E3200000010', tipo: 'B02', tipoName: 'Consumo', cliente: 'Gobierno Central', rnc: '200000001', date: '2025-02-28', vencimiento: '2025-03-30', total: 120000, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Carmen Diaz', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Almuerzos Institucionales', ref: 'ALM-GOB', qty: 200, price: 508.47, disc: 0, itbis: 18 }], totals: { subtotal: 101694.00, discount: 0, tax: 18306.00, total: 120000 } },
        { id: 'POS-C001', ecf: 'E3200000201', tipo: 'B02', tipoName: 'Consumo', cliente: 'Consumidor Final', rnc: '', date: '2025-03-05', vencimiento: '2025-03-05', total: 850, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Carmen Diaz', source: 'pos', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Desayuno Completo x2', ref: 'DES-001', qty: 2, price: 360.17, disc: 0, itbis: 18 }], totals: { subtotal: 720.34, discount: 0, tax: 129.66, total: 850 } },
    ]);
    const mkS = (id: string, date: string, open: string, close: string, oV: string, cV: string, sales: any[]) => ({ id, openTime: open, closeTime: close, closeDate: date, openingFloat: 2000, totalSales: sales.reduce((a, s) => a + s.total, 0), cashCountTotal: sales.reduce((a, s) => a + s.total, 0) + 1850, salesCount: sales.length, openVendedor: oV, closeVendedor: cV, denomCounts: {}, sales });
    set(cid, 'pos_shift_history', [
        mkS('SHF-C001', '04/03/2025', '06:00', '14:00', 'Carmen Diaz', 'Carmen Diaz', [{ id: 'POS-C010', method: 'Efectivo', time: '06:30', total: 350 }, { id: 'POS-C011', method: 'Efectivo', time: '07:15', total: 680 }, { id: 'POS-C012', method: 'Tarjeta', time: '08:00', total: 1200 }, { id: 'POS-C013', method: 'Efectivo', time: '09:30', total: 540 }, { id: 'POS-C015', method: 'Tarjeta', time: '12:45', total: 2400 }]),
        mkS('SHF-C002', '05/03/2025', '06:00', '14:00', 'Rosa Peña', 'Rosa Peña', [{ id: 'POS-C001', method: 'Efectivo', time: '07:00', total: 850 }, { id: 'POS-C030', method: 'Efectivo', time: '08:20', total: 420 }, { id: 'POS-C031', method: 'Tarjeta', time: '09:10', total: 1800 }, { id: 'POS-C034', method: 'Transferencia', time: '13:00', total: 2500 }]),
    ]);
}

// ── PEÑA & ASOCIADOS ─────────────────────────────────────────────────────────
function seedPena() {
    const cid = 'comp-pena';
    set(cid, 'lollipop_company_settings', { nombre: 'Peña & Asociados SRL', rnc: '1-30-99887-5', sector: 'Consultoría Financiera', email: 'info@penaasociados.do', telefono: '809-555-3000', direccion: 'Torre Empresarial, Piso 8, Av. Las Carreras #22, Santiago', sitioWeb: 'www.penaasociados.do', logoColor: '#059669', moneda: 'DOP', tipoComprobante: 'B01' });
    set(cid, 'pos_vendedores', [
        { id: 'V001', nombre: 'Roberto Peña', codigo: 'RBP', activo: true, creadoEn: '2021-03-10', totalVentas: 3400000, totalFacturas: 28, auditLog: [{ accion: 'Creado', fecha: '2021-03-10', por: 'Admin' }] },
        { id: 'V002', nombre: 'Sandra Gomez', codigo: 'SGM', activo: true, creadoEn: '2022-01-15', totalVentas: 1850000, totalFacturas: 14, auditLog: [{ accion: 'Creado', fecha: '2022-01-15', por: 'Admin' }] },
    ]);
    set(cid, 'clientes', [
        { id: 'CLI-P01', nombre: 'Constructora Dominicana SA', rnc: '101999100', tipo: 'Empresa', email: 'cxp@constructoradom.do', telefono: '809-920-1500', direccion: 'Av. Independencia 1255, Santiago', credito: 600000, saldo: 450000 },
        { id: 'CLI-P02', nombre: 'Importaciones Del Caribe SRL', rnc: '101500200', tipo: 'Empresa', email: 'admin@importcaribe.do', telefono: '809-580-3000', direccion: 'Zona Franca Santiago', credito: 400000, saldo: 0 },
        { id: 'CLI-P03', nombre: 'Banco Nacional RD', rnc: '101000500', tipo: 'Institución Bancaria', email: 'auditoria@banconal.do', telefono: '809-544-1212', direccion: 'Av. Pedro Henríquez Ureña 127', credito: 2000000, saldo: 0 },
        { id: 'CLI-P04', nombre: 'Grupo Industrial SRL', rnc: '101300010', tipo: 'Empresa', email: 'finanzas@grupoindustrial.do', telefono: '809-582-8800', direccion: 'Polígono Industrial, Santiago', credito: 1000000, saldo: 0 },
        { id: 'CLI-P05', nombre: 'Ministerio de Hacienda', rnc: '200000002', tipo: 'Gobierno', email: 'lic@hacienda.gob.do', telefono: '809-687-5131', direccion: 'México esquina Leopoldo Navarro', credito: 0, saldo: 900000 },
    ]);
    set(cid, 'productos', [
        { id: 'PRD-P01', nombre: 'Auditoría Fiscal Anual', ref: 'AUD-001', categoria: 'Auditoría', precio: 450000, itbis: 18, stock: 999, unidad: 'Contrato', activo: true },
        { id: 'PRD-P02', nombre: 'Consultoría NIIF (trimestral)', ref: 'CNS-002', categoria: 'Consultoría', precio: 280000, itbis: 18, stock: 999, unidad: 'Trimestre', activo: true },
        { id: 'PRD-P03', nombre: 'Due Diligence Financiero', ref: 'DDL-003', categoria: 'Due Diligence', precio: 750000, itbis: 18, stock: 999, unidad: 'Proyecto', activo: true },
        { id: 'PRD-P04', nombre: 'Plan Estratégico Financiero', ref: 'EST-004', categoria: 'Planificación', precio: 1200000, itbis: 18, stock: 999, unidad: 'Proyecto', activo: true },
        { id: 'PRD-P05', nombre: 'IT-1 Declaración de Renta', ref: 'IT1-005', categoria: 'Impuestos', precio: 35000, itbis: 18, stock: 999, unidad: 'Declaración', activo: true },
        { id: 'PRD-P06', nombre: 'Valuación Actuarial', ref: 'VAL-006', categoria: 'Valuación', precio: 540000, itbis: 18, stock: 999, unidad: 'Informe', activo: true },
    ]);
    set(cid, 'gastos', [
        { id: 'GAS-P01', proveedor: 'Alquiler Torre Empresarial', descripcion: 'Renta Piso 8 — Marzo 2025', monto: 120000, fecha: '2025-03-01', categoria: 'Alquiler', status: 'pagado', ncf: 'B0100000801' },
        { id: 'GAS-P02', proveedor: 'Lexis Nexis RD', descripcion: 'Suscripción Base Legal 2025', monto: 65000, fecha: '2025-01-05', categoria: 'Suscripciones', status: 'pagado', ncf: 'B0100000055' },
        { id: 'GAS-P03', proveedor: 'Instituto de Contadores CPA', descripcion: 'Cuotas Colegiatura Q1 2025', monto: 18000, fecha: '2025-01-10', categoria: 'Asociaciones', status: 'pagado', ncf: 'B1500000012' },
        { id: 'GAS-P04', proveedor: 'TechSolutions RD SRL', descripcion: 'Soporte IT y Mantenimiento Anual', monto: 85000, fecha: '2025-01-20', categoria: 'Tecnología', status: 'pagado', ncf: 'B0100000041' },
        { id: 'GAS-P05', proveedor: 'Edenorte', descripcion: 'Electricidad Oficina — Febrero 2025', monto: 8900, fecha: '2025-02-24', categoria: 'Servicios Básicos', status: 'pagado', ncf: 'B0100000700' },
    ]);
    set(cid, 'bancos', [
        { id: 'BNK-P01', banco: 'Scotiabank', cuenta: '###-###-78901', tipo: 'Corriente', moneda: 'DOP', saldo: 4200000, ultimoMovimiento: '2025-03-04' },
        { id: 'BNK-P02', banco: 'Banco Popular Dominicano', cuenta: '###-###-11234', tipo: 'Corriente', moneda: 'DOP', saldo: 850000, ultimoMovimiento: '2025-03-01' },
        { id: 'BNK-P03', banco: 'Citibank NA', cuenta: '###-###-55667', tipo: 'Corriente', moneda: 'USD', saldo: 25000, ultimoMovimiento: '2025-02-20' },
    ]);
    set(cid, 'invoice_emitted', [
        { id: 'PEN-0028', ecf: 'E3100000028', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Constructora Dominicana SA', rnc: '101999100', date: '2025-03-01', vencimiento: '2025-03-31', total: 450000, status: 'accepted', paymentStatus: 'pendiente', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Auditoría Fiscal Anual 2024', ref: 'AUD-001', qty: 1, price: 381356, disc: 0, itbis: 18 }], totals: { subtotal: 381356, discount: 0, tax: 68644, total: 450000 } },
        { id: 'PEN-0027', ecf: 'E3100000027', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Impartaciones Del Caribe', rnc: '101500200', date: '2025-02-20', vencimiento: '2025-03-22', total: 280000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Sandra Gomez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Consultoría NIIF Q1 2025', ref: 'CNS-002', qty: 1, price: 237288, disc: 0, itbis: 18 }], totals: { subtotal: 237288, discount: 0, tax: 42712, total: 280000 } },
        { id: 'PEN-0026', ecf: 'E3100000026', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Grupo Industrial SRL', rnc: '101300010', date: '2025-02-10', vencimiento: '2025-03-12', total: 750000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Due Diligence Financiero', ref: 'DDL-003', qty: 1, price: 635593, disc: 0, itbis: 18 }], totals: { subtotal: 635593, discount: 0, tax: 114407, total: 750000 } },
        { id: 'PEN-0025', ecf: 'E3100000025', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Banco Nacional RD', rnc: '101000500', date: '2025-01-30', vencimiento: '2025-02-28', total: 1200000, status: 'accepted', paymentStatus: 'pagada', vendedor: 'Roberto Peña', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Plan Estratégico Financiero', ref: 'EST-004', qty: 1, price: 1016949, disc: 0, itbis: 18 }], totals: { subtotal: 1016949, discount: 0, tax: 183051, total: 1200000 } },
        { id: 'PEN-0024', ecf: 'E3100000024', tipo: 'B01', tipoName: 'Crédito Fiscal', cliente: 'Ministerio de Hacienda', rnc: '200000002', date: '2025-01-15', vencimiento: '2025-02-14', total: 900000, status: 'pending', paymentStatus: 'pendiente', vendedor: 'Sandra Gomez', invoiceMode: 'electronico', moneda: 'DOP', items: [{ id: 1, name: 'Implementación SIGEF', ref: 'SIG-005', qty: 1, price: 762712, disc: 0, itbis: 18 }], totals: { subtotal: 762712, discount: 0, tax: 137288, total: 900000 } },
    ]);
    set(cid, 'pos_shift_history', [
        { id: 'SHF-P001', openTime: '08:30', closeTime: '17:00', closeDate: '20/02/2025', openingFloat: 10000, totalSales: 45000, cashCountTotal: 54800, salesCount: 3, openVendedor: 'Roberto Peña', closeVendedor: 'Roberto Peña', denomCounts: {}, sales: [{ id: 'POS-P001', method: 'Transferencia', time: '09:00', total: 20000 }, { id: 'POS-P002', method: 'Transferencia', time: '12:30', total: 15000 }, { id: 'POS-P003', method: 'Efectivo', time: '15:00', total: 10000 }] },
        { id: 'SHF-P002', openTime: '08:30', closeTime: '17:00', closeDate: '05/03/2025', openingFloat: 10000, totalSales: 68000, cashCountTotal: 76500, salesCount: 4, openVendedor: 'Sandra Gomez', closeVendedor: 'Sandra Gomez', denomCounts: {}, sales: [{ id: 'POS-P004', method: 'Transferencia', time: '09:30', total: 25000 }, { id: 'POS-P005', method: 'Cheque', time: '11:00', total: 18000 }, { id: 'POS-P006', method: 'Transferencia', time: '14:00', total: 15000 }, { id: 'POS-P007', method: 'Efectivo', time: '16:00', total: 10000 }] },
    ]);
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function seedUsers(): void {
    saveUsers([
        { id: 'usr-contador', name: 'Juan Pérez', email: 'juan@lollipop.do', password: 'Lollipop2025!', pin: '1234', globalRole: 'contador', companiesAccess: ['comp-tech', 'comp-cafe', 'comp-pena'], createdBy: 'system', createdAt: '2024-01-01', color: '#2563eb' },
        { id: 'usr-tech', name: 'Carlos Méndez', email: 'carlos@techsolutionsrd.com', password: 'TechRD2025!', pin: '4321', globalRole: 'propietario', companiesAccess: ['comp-tech'], createdBy: 'usr-contador', createdAt: '2024-01-15', color: '#0ea5e9' },
        { id: 'usr-cafe', name: 'Pedro García', email: 'pedro@buensabor.do', password: 'BuenSabor25!', pin: '5678', globalRole: 'propietario', companiesAccess: ['comp-cafe'], createdBy: 'usr-contador', createdAt: '2024-02-01', color: '#d97706' },
        { id: 'usr-pena', name: 'Ana Peña', email: 'ana@penacpa.do', password: 'PenaAsoc25!', pin: '8765', globalRole: 'propietario', companiesAccess: ['comp-pena'], createdBy: 'usr-contador', createdAt: '2024-02-15', color: '#7c3aed' },
        { id: 'usr-cajera', name: 'María Sánchez', email: 'maria@buensabor.do', password: 'Cajera2025!', pin: '0000', globalRole: 'empleado', companiesAccess: ['comp-cafe'], createdBy: 'usr-cafe', createdAt: '2024-03-01', color: '#10b981' },
    ]);
    setUserCompanyRole('usr-contador', 'comp-tech', 'administrador');
    setUserCompanyRole('usr-contador', 'comp-cafe', 'administrador');
    setUserCompanyRole('usr-contador', 'comp-pena', 'administrador');
    setUserCompanyRole('usr-tech', 'comp-tech', 'administrador');
    setUserCompanyRole('usr-cafe', 'comp-cafe', 'administrador');
    setUserCompanyRole('usr-pena', 'comp-pena', 'administrador');
    setUserCompanyRole('usr-cajera', 'comp-cafe', 'cajero');
}

// ── ENTRY POINT ───────────────────────────────────────────────────────────────
export function seedAllCompaniesData(): void {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(SEED_KEY)) return;
    saveCompanies(SEED_COMPANIES);
    seedTech();
    seedCafe();
    seedPena();
    seedUsers();
    setActiveCompanyId('comp-tech');
    localStorage.setItem(SEED_KEY, '1');
}
