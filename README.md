# Documento de Requisitos del Producto (PRD) y Arquitectura Técnica

**Lollipop Sysfac (Facturación e-CF DGII)**

---

## 1. Visión General del Proyecto

**Lollipop / Sysfac** es un avanzado sistema ERP (Enterprise Resource Planning) en la nube, optimizado de forma nativa para empresas y profesionales en la República Dominicana.

El núcleo fundamental del producto es el **cumplimiento tributario inmediato (Facturación Electrónica e-CF de la DGII)** de forma transparente, combinándolo con un Point of Sale (POS) ágil, gestión de cotizaciones, cuentas por cobrar/pagar, control de inventario y contabilidad automatizada.

Esta versión base constituye el **Foco del MVP Frontend (Prototipo Estructural)**. Toda la Arquitectura de la Interfaz de Usuario (UI) y la Experiencia de Usuario (UX) tributaria han sido construidas. Se utiliza `localStorage` y "mocks" de datos para validar los flujos de negocio sin depender aún de la infraestructura física del servidor.

---

## 2. Pautas de Diseño, UI/UX y Tipografía (Design System)

La aplicación ha sido desarrollada bajo estándares de **diseño premium y ultra-moderno** simulando herramientas SaaS de clase mundial como Stripe o Linear.

### 2.1 Pila Tecnológica del Frontend

* **Framework Principal:** Next.js 15+ (App Router) con React 19.
* **Estilos:** Tailwind CSS con variables predefinidas en `globals.css` para el control de temas y variables CSS crudas que manejan los tonos de color.
* **Componentes UI:** Shadcn/ui (Radix Primitives) para accesibilidad (Selects, Modals, Popovers, Dropdowns).
* **Iconografía:** Lucide React (Íconos vectoriales escalables).

### 2.2 Estética Visual (Aesthetics)

* **Glassmorphism & Frosted Glass:** Uso extensivo de paneles semitransparentes con desenfoque de fondo (`backdrop-blur-xl`, `bg-white/70`, `bg-white/40`) para la barra lateral y los contenedores principales.
* **Micro-Interacciones:** Botones activos y tarjetas emplean transformaciones suaves (`hover:-translate-y-1`, `hover:scale-105`) y transiciones de sombra para feedback táctil.
* **Iluminación (Glow & Gradients):** Fondos vivos e inmersivos (ejemplo: fondo de Dashboard con mallas degradadas en tonos turquesa, púrpura y fucsia `bg-gradient-to-br from-indigo-50...`).

### 2.3 Tipografía

* **Fuente Principal (Sans-Serif Modern):** El proyecto asume fuentes modernas, idealmente interconectadas o del sistema (`Inter`, `Outfit` o `Geist`).
* **Jerarquía de Pesos:**
  * Títulos prominentes (Dashboard, Facturas) usan peso `font-medium` o `font-semibold` evitando el `font-black` pesado para mantener la elegancia de macOS.
  * Datos tabulares usan `tabular-nums` para alinear precios y métricas correctamente.

### 2.4 Paleta de Colores (Theme Variables)

* **Primario (Brand):** Púrpura/Violeta vibrante (Aprox. Purple-600 a Purple-700 en acentos, `bg-purple-600`).
* **Secundario/Dashboard:** Modos claros brillantes (Zinc/Slate) y un fondo animado con auras difuminadas (blur) en tonos turquesa/púrpura suave.
* **Estados y Semántica:**
  * *Éxito / DGII Aceptado:* Emerald/Green (`text-emerald-700`, `bg-emerald-100`).
  * *Alertas / Pendiente:* Amber/Yellow (`text-amber-700`, `bg-amber-100`).
  * *Peligro / Rechazado:* Red/Rose (`text-rose-700`, `bg-rose-100`).

---

## 3. Estructura de Carpetas del Proyecto (Folder Structure)

El sistema emplea el **App Router de Next.js** para el enrutamiento y carga segregada de módulos. El código principal vive dentro de `src/app/dashboard`.

```text
src/
├── app/
│   ├── dashboard/           # (Layout principal y Navbar/Sidebar)
│   │   ├── page.tsx         # Dashboard Principal (Resumen, Gráficos)
│   │   ├── invoices/        # FACTURACIÓN Y EMISIÓN
│   │   │   ├── [id]         # -> Editor y Visualizador de Factura
│   │   │   ├── new          # -> Creador de nueva factura
│   │   │   └── preview      # -> Pantalla final de impresión (A4) y PDF
│   │   ├── ingresos/        # GESTIÓN DE COBROS Y VENTAS
│   │   │   ├── cotizaciones
│   │   │   ├── conduces
│   │   │   ├── recurrentes
│   │   │   └── pagos        # -> Pagos Recibidos y Recibos de Ingreso
│   │   ├── gastos/          # GESTIÓN DE COMPRAS Y PAGOS
│   │   │   ├── page.tsx     # -> Gastos Generales y Caja Chica
│   │   │   ├── proveedores 
│   │   │   ├── ordenes      # -> Órdenes de Compra
│   │   │   ├── menores      # -> Gastos Menores / Comprobante de Compras (B11)
│   │   │   ├── pagos        # -> Pagos Emitidos a suplidores
│   │   │   └── recepcion
│   │   ├── pos/             # PUNTO DE VENTA (Terminal TPV)
│   │   ├── productos/       # CATÁLOGO E INVENTARIO
│   │   │   ├── page.tsx     # -> Listado General de Productos
│   │   │   ├── inventario   # -> Movimientos y Kardex
│   │   │   └── categorias
│   │   ├── clients/         # DIRECTORIO
│   │   ├── bancos/          # CUESTIONES FINANCIERAS
│   │   │   ├── page.tsx     # -> Cuentas bancarias y efectivo
│   │   │   └── conciliacion
│   │   ├── contabilidad/    # MOTOR FISCAL Y LEDGER
│   │   │   ├── page.tsx     # -> Entrada de Diario
│   │   │   ├── catalogo     # -> Árbol de cuentas (Activos, Pasivos, Capital)
│   │   │   └── reportes     # -> Balance General, Estado de Resultados, Libro Mayor
│   │   ├── nomina/          # RECURSOS HUMANOS
│   │   ├── reportes/        # INTELIGENCIA DE NEGOCIOS (DGII 606/607/608)
│   │   └── settings/        # CONFIGURACIÓN DEL SISTEMA
│   │       ├── perfil       # -> Logo de la empresa, RNC, Dirección
│   │       ├── integraciones# -> DGII Token P12, Pasarelas de Pago
│   │       ├── plantillas   # -> Editor visual de la plantilla PDF
│   │       └── usuarios     # -> Roles y Permisos
│   ├── layout.tsx           # Entry layout (HTML/Body)
│   ├── page.tsx             # Landing Page (Pública)
│   └── globals.css          # Estilos Taildwind y Variables Globales
├── components/
│   └── ui/                  # Componentes base de diseño (Shadcn/UI pre-fabricados)
├── lib/                     # Utilidades matemáticas, numéricas, formateadores
└── public/                  # Assets, Mockups de productos e imágenes estáticas
```

---

## 4. Estado Actual (Lo que ya está construido y funcional en la UI)

### 4.1 Ventas y Facturación (Invoicing)

* Formulario dinámico de creación/edición de facturas con cálculo en vivo de totales e ITBIS.
* Integración modal para elegir clientes, NCF (B01, B02, B14, etc.) y términos de pago.
* Estados dinámicos en lista de facturas (Pendiente, Pagado, Aceptado por DGII).
* Acciones de tabla integradas: Ver/Editar, Imprimir y Eliminar (que limpia el JSON en localStorage).

### 4.2 Punto de Venta (POS)

* Búsqueda de productos rápida.
* Cálculo de cambio, modal de cobro fraccionado (Pago Mixto).
* Renderizado en formato térmico (Ticket 80mm).

### 4.3 Generación Visual de Documentos (PDF/Print)

* Vista previa (`/preview`) de tamaño Carta (A4) que usa HTML nativo de impresión para emular una hoja membretada, cargando el Logo comercial guardado, datos fiscales y un diseño moderno limpio, listo para el Ctrl+P.

### 4.4 Ajustes y Persistencia

* Las configuraciones de Identidad (Logo, Nombre, RNC Empresa) se mantienen mediante `localStorage` y nutren todos los documentos del sistema.

---

## 5. REQUISITOS FALTANTES (Roadmap de Producción - Lo que Falta Exactamente)

Para convertir este MVP en un producto final certificable por la DGII y operable, **se requiere desarrollar toda la capa de Backend, Base de Datos y Motor de Autenticación**.

### 5.1 Rediseño hacia una Base de Datos Real (Relacional)

* **Falta absoluta:** Reemplazar `localStorage` (`JSON.parse` y `setItem`) por llamadas asíncronas (`fetch` / Mutaciones GraphQL / Server Actions) hacia un backend en Node.js, Python o dentro del mismo Next.js.
* **Schema SQL:** Crear tablas interconectadas: `Compania`, `Usuarios`, `Productos`, `Invoices` (Facturas), `Invoice_Lines` (Detalles), `Payments`, `Journal_Entries` (Asientos Contables).

### 5.2 Hub de Certificación e-CF DGII (Módulo Core Faltante)

1. **Criptografía y Firma XML:** Al pulsar "Emitir", el sistema debe ensamblar el archivo estándar XML de la DGII, firmarlo usando la llave privada (Certificado Digital `.p12`) de la empresa.
2. **Solicitud de Autorización SOAP/REST DGII:** Conectar con los endpoints oficiales de recepción de comprobantes de la DGII.
3. **Track ID & Webhooks:** Recibir de forma síncrona el Track ID. Montar un trabajador asíncrono (Cron/Queue) que interrogue periódicamente el estatus (Aprobado / Rechazado por validación de montos o RNC inactivo).
4. **Generación de Representación Impresa:** Incrustar el algoritmo criptográfico y el código QR oficial de la DGII en las vistas de PDF de la factura, para que el cliente final pueda escanear y validar el e-CF.

### 5.3 Motor de Contabilidad Automática (Double-Entry Ledger)

* **Falta absoluta:** Toda factura de venta generada en el frontend de Invoices o POS debe obligatoriamente cruzar un registro asíncrono (Doble Partida) en el back-end.
  * Ejemplo: Facturar $100 + 18 ITBIS a crédito = *Débito* a Cuentas x Cobrar ($118), *Crédito* a Ingresos por Ventas ($100), *Crédito* a ITBIS Facturado ($18).
* Idem para pagos aplicados, compras y cuadre de caja del POS. NADA sucede aún en la vista de *Entradas de Diario*, solo es UI.

### 5.4 Control Real de Inventario (Kardex)

* **Falta absoluta:** Los productos actuales no descuentan stock real. Se necesita una lógica en backend que impida facturar si la configuración "Permitir ventas en negativo" está apagada y evalúe la cantidad "On Hand" disponible de la tabla `Productos_Bodega`.
* El cálculo del costo de los bienes vendidos (COGS) para el Estado de Resultados.

### 5.5 Seguridad de Acceso, Tenant y Multi-Empresa

* **Rol y Autenticación (RBAC):** Integrar un sistema tipo NextAuth.js o Supabase Auth.
* Roles faltantes de implementar: `SuperAdmin` (Agencia), `Dueño de Empresa`, `Gerente` (Ve financieros), `Cajero` (Solo POS y cuadre de caja propia).
* **Tenancy (Aislamiento de Datos):** Si el software es un SaaS (Software as a Service), los datos de la Empresa A jamás deben cruzarse con la Empresa B. Se debe inyectar el `company_id` en todas las consultas de la base de datos.
* Auditoría técnica: Tabla de `Logs` para registrar "Quién borró una factura, a qué hora, y desde qué IP".

### 5.6 Hardware Directo (Web API)

* Lograr imprimir silenciosamente (Raw printing en red LAN) los tickets del POS usando comandos ESC/POS para no depender del "diálogo de impresión del navegador" y conectar con impresoras genéricas térmicas automáticas.
* Enlace con las cajas registradoras (gavetas de dinero) para apertura automática vía impulso telefónico.
* VeriFone API: Conectar físicamente vía COM/Network con el VeriFone de AZUL/CardNet para no tener que digitar el monto en el aparato.

---

## Conclusión de la Fase de Producto

Lollipop Sysfac exhibe hoy un frontend exquisito, cubriendo la UX íntegra de la operación empresarial dominicana moderna. El reto exclusivo y definitorio es el desarrollo paralelo del **Backend DGII / Contable**, que convertirá esta interface de alta calidad de en una obra maestra transaccional (El MVP completo SaaS v1.0).
#   L o l l i p o p - S y s f a c  
 