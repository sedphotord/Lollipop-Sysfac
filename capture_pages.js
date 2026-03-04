const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3000';
const screenshotsDir = path.join(__dirname, 'screenshots');

const pagesToCapture = [
    { name: '01_Dashboard', path: '/dashboard' },
    { name: '02_POS', path: '/dashboard/pos' },
    { name: '03_Invoices_List', path: '/dashboard/invoices' },
    { name: '04_Invoices_New', path: '/dashboard/invoices/new' },
    { name: '05_Cotizaciones', path: '/dashboard/ingresos/cotizaciones' },
    { name: '06_Conduces', path: '/dashboard/ingresos/conduces' },
    { name: '07_Pagos_Recibidos', path: '/dashboard/ingresos/pagos' },
    { name: '08_Gastos_Generales', path: '/dashboard/gastos' },
    { name: '09_Proveedores', path: '/dashboard/gastos/proveedores' },
    { name: '10_Ordenes_Compra', path: '/dashboard/gastos/ordenes' },
    { name: '11_Recepcion', path: '/dashboard/gastos/recepcion' },
    { name: '12_Productos', path: '/dashboard/productos' },
    { name: '13_Inventario', path: '/dashboard/productos/inventario' },
    { name: '14_Clientes', path: '/dashboard/clients' },
    { name: '15_Bancos', path: '/dashboard/bancos' },
    { name: '16_Contabilidad_Entradas', path: '/dashboard/contabilidad' },
    { name: '17_Catalogo_Cuentas', path: '/dashboard/contabilidad/catalogo' },
    { name: '18_Nomina', path: '/dashboard/nomina' },
    { name: '19_Reportes_Generales', path: '/dashboard/reportes' },
    { name: '20_Settings_Perfil', path: '/dashboard/settings/perfil' },
    { name: '21_Settings_Integraciones', path: '/dashboard/settings/integraciones' },
    { name: '22_Settings_Plantillas', path: '/dashboard/settings/plantillas' }
];

async function run() {
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set viewport to 1080p for good quality screenshots
    await page.setViewport({ width: 1920, height: 1080 });

    for (const item of pagesToCapture) {
        console.log(`Capturing ${item.name}...`);
        try {
            await page.goto(`${baseUrl}${item.path}`, { waitUntil: 'networkidle0', timeout: 30000 });
            // Wait an extra second for animations to settle
            await new Promise(r => setTimeout(r, 1000));

            const filePath = path.join(screenshotsDir, `${item.name}.png`);
            await page.screenshot({ path: filePath, fullPage: true });
            console.log(`✅ Saved ${item.name}.png`);
        } catch (error) {
            console.error(`❌ Failed to capture ${item.name}: ${error.message}`);
        }
    }

    console.log('Finished capturing all pages!');
    await browser.close();
}

run();
