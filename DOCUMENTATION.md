# Lollipop Sysfac - Documentación Oficial 📖

Bienvenido a la documentación oficial de **Lollipop Sysfac**, el sistema ERP y Facturación Electrónica en la nube diseñado para la República Dominicana. Este documento proporciona una guía profunda sobre la arquitectura, los módulos funcionales, el stack tecnológico y las instrucciones de uso del sistema.

---

## 📋 Índice

1. [Introducción y Objetivos](#1-introducción-y-objetivos)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Análisis Detallado de Módulos (Frontend Actual vs Roadmap Backend)](#4-análisis-detallado-de-módulos-frontend-actual-vs-roadmap-backend)
    * 4.1 Dashboard
    * 4.2 Punto de Venta (POS)
    * 4.3 Ventas y Facturación (El Editor de Facturas)
    * 4.4 Compras y Gastos
    * 4.5 Catálogo e Inventario
    * 4.6 Finanzas y Contabilidad
5. [Almacenamiento y Persistencia Local](#5-almacenamiento-y-persistencia-local)
6. [Diseño y Sistema de Componentes](#6-diseño-y-sistema-de-componentes)
7. [Guía de Desarrollo y Puesta en Marcha](#7-guía-de-desarrollo-y-puesta-en-marcha)

---

## 1. Introducción y Objetivos

**Lollipop Sysfac** nació con la intención de modernizar la experiencia de facturación fiscal (DGII) en la República Dominicana. El objetivo es ofrecer una herramienta hermosa, ultra-rápida y fácil de usar, eliminando la fricción de los sistemas contables tradicionales.

Actualmente, el proyecto se encuentra en una fase **MVP Centrada en el Frontend**, es decir, toda la interfaz, flujos y cálculos operan en el navegador cliente simulando un backend real para facilitar pruebas de usabilidad y de campo de forma inmediata.

---

## 2. Stack Tecnológico

El proyecto se sustenta en tecnologías de vanguardia para garantizar velocidad, SEO, y una Interfaz de Usuario (UI) reactiva:

* **Framework:** [Next.js 15+](https://nextjs.org/) utilizando el moderno *App Router*.
* **Librería Principal:** [React 19](https://react.dev/).
* **Lenguaje:** TypeScript, para tipado estricto y prevención de errores.
* **Estilado:** [Tailwind CSS](https://tailwindcss.com/) (Clases de utilidad atómicas).
* **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/) (Componentes accesibles construidos sobre Radix UI).
* **Iconos:** [Lucide React](https://lucide.dev/).
* **Formato de Fechas:** `date-fns`.
* **Notificaciones (Toasts):** `Sonner`.

---

## 3. Arquitectura del Proyecto

El proyecto sigue la convención del App Router de Next.js, agrupando rutas y lógicas por dominio.

```text
sysfac/
├── src/
│   ├── app/
│   │   ├── (public)/          # Rutas públicas (Landing, Login, Register)
│   │   ├── dashboard/         # RUTA PRINCIPAL PROTEGIDA DEL ERP
│   │   │   ├── bancos/        # Finanzas e integraciones bancarias
│   │   │   ├── clients/       # CRM y Directorio de contactos
│   │   │   ├── contabilidad/  # Catálogo de Cuentas y Entradas de Diario
│   │   │   ├── gastos/        # Órdenes de compra, recepción y nómina menor
│   │   │   ├── ingresos/      # Cotizaciones, conduces y cobros
│   │   │   ├── invoices/      # Módulo Core: Facturación Electrónica
│   │   │   ├── nomina/        # Gestión de empleados y salarios
│   │   │   ├── pos/           # Terminal de Punto de Venta Rápido (TPV)
│   │   │   ├── productos/     # Inventario, Bodegas y Categorías
│   │   │   ├── reportes/      # B.I. e Impuestos DGII
│   │   │   ├── settings/      # Configuraciones de la Empresa
│   │   │   ├── layout.tsx     # Contenedor (Sidebar + Navegación Superior)
│   │   │   └── page.tsx       # Tablero resumen (Métricas)
│   │   ├── globals.css        # Variables globales de Tailwind/Shadcn
│   │   └── layout.tsx         # HTML Raíz
│   ├── components/
│   │   ├── dashboard/         # Componentes específicos del layout interno
│   │   ├── landing/           # Componentes de la pág web promocional
│   │   └── ui/                # Componentes puros Shadcn (Botones, Modales, Tablas)
│   └── lib/
│       └── utils.ts           # Funciones helper (cn merge)
├── public/                    # Assets estáticos e imágenes renderizadas
└── package.json               # Dependencias y Scripts
```

---

## 4. Análisis Detallado de Módulos (Frontend Actual vs Roadmap Backend)

A continuación se detalla exhaustivamente cómo funciona actualmente cada módulo a nivel de interfaz de usuario (UI/Frontend) y qué lógica de servidor (Backend) debe construirse para completar su funcionamiento en producción.

### 4.1 Dashboard

* **Función Actual (UI):** Es el centro de mando y resumen analítico. Muestra componentes visuales simulados como Total Facturado, Aceptadas DGII, Pendientes de Cobro y gráficos de ingresos/gastos mensuales. Incluye botones de acceso rápido (Crear Factura, ir a POS).
* **Falta en Backend:**
  * Consultas reales a la base de datos (SQL `SUM()`, `GROUP BY`) para calcular el total de facturas emitidas en el mes actual y compararlas con el mes anterior.
  * Generar los datos de las "Series" (`data`) de los gráficos leyendo desde la tabla de de asientos contables (Ingresos vs Gastos).

### 4.2 Punto de Venta (POS) `/dashboard/pos`

* **Función Actual (UI):** Diseñado para ventas ultra-rápidas en caja (supermercados, tiendas).
  * Grid de productos clickeables que se agregan al "Ticket" lateral.
  * Motor de cálculo dinámico para el total a pagar + el vuelto a entregar al cliente.
  * Modal de **"Cobro Dividido" o "Pago Combinado"** funcional en la vista: Perimite declarar que el cliente pagó un porcentaje en Efectivo y el resto con Tarjeta.
  * Sección de impresión térmica en HTML lista para enviar a impresoras de 80mm de ancho.
* **Falta en Backend:**
  * Al cobrar, no se descuenta el stock real del `Kardex` (Base de datos).
  * Al cobrar con Pago Combinado, el sistema debe crear un "Asiento Contable" múltiple en el fondo (Ej: Débito a Caja Fuerte $500, Débito a Cuenta de Banco BHD $500, y Crédito a Ventas Generales $1,000).
  * Actualmente el POS es un entorno aislado, las facturas generadas ahí **no** se están guardando en la lista genérica de facturas emitidas ni enviando su XML a la DGII en segundo plano.

### 4.3 Ventas y Facturación (Editor e-CF) `/dashboard/invoices/new` y `/[id]`

Este es el motor principal del sistema, y el módulo más robusto actualmente.

* **Función Actual del Editor (UI):**
  * **Diseño de Factura:** Es una vista que emula un papel (WYSWYG). Permite agregar ítems a una tabla, cambiar cantidades, precios individuales, y establecer descuentos por línea o totales.
  * **Motor Lógico Matemático:** Calcula dinámicamente el Subtotal, aplica el 18% de ITBIS (o el porcentaje configurado) y devuelve el Total Neto. Todo con formato monetario.
  * **RNC y Comprobantes:** Tiene electores para elegir al Cliente de la lista y el NCF (Válido para Crédito Fiscal B01, Consumo B02, Gubernamental B15, etc.). Carga automáticamente el RNC del cliente.
  * **Persistencia (Borradores vs Emitidos):** El botón "Guardar Borrador" almacena la cotización usando `localStorage` en modo editable continuo. El botón "Emitir Factura" simula el cierre final, la envía a la tabla general de *Facturas*, y cambia su estado visual.
  * **Flujo de Edición Real:** Si se visita una factura previamente creada (`/invoices/[id]`), la vista carga el JSON y rellena todas las cajas de texto y filas dinámicas para que pueda ser re-editada de forma fluida.
* **Falta en Backend (El Core Engine e-CF):**
    1. **Motor Criptográfico XM:** Cuando se presiona "Emitir", el NodeJS backend debe armar la estructura XML estricta exigida por la DGII. Extraer de un almacén seguro el archivo digital `.p12` de la empresa y firmar criptográficamente el archivo para darle validez jurídica.
    2. **Solicitud de Aprobación SOAP DGII:** Una vez firmado el XML, se debe hacer una petición a la API del gobierno para recibir un `track_id` síncrono.
    3. **Encadenamiento de Eventos:** Guardar en la base de datos la respuesta de la DGII (`ACEPTADO` o `RECHAZADO`). Si es aceptado, generar el Código de Seguridad (String Hash) y convertirlo en el código QR que va impreso en el PDF, como dicta la norma técnica obligatoria de Facturación Electrónica en R.D.
    4. Cargar y relacionar la factura en la BD a la tabla de `clientes` por su ID real.

### 4.4 Compras y Gastos `/dashboard/gastos`

* **Función Actual (UI):** Pantallas diseñadas para el control del egreso. Cuenta con módulos como "Órdenes de Compra", "Pago a Proveedores", y "Gastos Menores/Caja Chica". Las tablas y formularios visuales muestran cómo el usuario retiene impuestos en la compra.
* **Falta en Backend:**
  * Al aprobar un gasto, no se refleja como obligación crediticia en "Cuentas por Pagar" (Accounts Payable).
  * Relacionar la generación de esta compra para que viaje directamente al formato base del archivo TXT del 606 (Compras a proveedores).
  * Sumar el inventario al Kardex cuando el almacén "Recepciona" una Orden de Compra.

### 4.5 Catálogo e Inventario `/dashboard/productos`

* **Función Actual (UI):** Listado estilizado de artículos y servicios. Formularios para catalogar SKU/Código de barras, imágenes y configuración de ITBIS aplicable a cada línea.
* **Falta en Backend (Kardex Engine):**
  * Todo el control de "Movimientos". Cada vez que un componente del sistema afecte un producto (Facturación resta, Devolución o Nota de Crédito suma, Orden de Compra suma, Transferencia inter-bodegas), el `Kardex` en BD debe instanciar un nuevo registro `+2` o `-5` para tener trazabilidad estricta de quién hizo qué con cada clavo de la empresa.
  * Calcular el Costo Promedio Ponderado para fines contables.

### 4.6 Finanzas y Contabilidad `/dashboard/contabilidad`

* **Función Actual (UI):** Interfaces listas para que un Contador (CPA) acceda. Incluye la estructura arbórea jerárquica del "Catálogo de Cuentas" (Activos, Pasivos, Capital, Ingresos, Gastos) de 6 dígitos base (Ej 100-01-001). Pantalla lista para realizar *Entradas de Diario* (Asientos manuales con suma en Debit y Credit). Visores para simular un Estado de Resultados y Balance General.
* **Falta en Backend:**
  * **Double-Entry Automático:** Este es el bloque contable que falta al 100%. Un usuario del sistema (cajero) no sabe de contabilidad. Cada vez que hace una  Factura, un Pago, o un POS ticket, el backend debe secretamente invocar una función `crearAsientoGeneral()` que afecte las cuentas correctas configuradas para Impuestos por Pagar, Cuentas por Cobrar e Ingresos netos, para garantizar que la pantalla de "Balance General" cuadre y no sea ficticia.

---

## 5. Almacenamiento y Persistencia Local

Dado que esta es la versión Frontend interactiva, la base de datos es simulada utilizando la API de **`localStorage`** del navegador.
Esto significa que los datos persisten en la computadora de quien lo utiliza aunque recargue la pantalla, **pero no viajan a un servidor central**.

**Claves importantes en Uso Directo (`localStorage`):**

* `invoice_emitted`: Lista o Array global con todas las facturas oficializadas.
* `invoice_drafts`: Lista separada para la bandeja de Borradores.
* `lollipop_company_settings` / `lollipop_company_logo`: Estructura JSON fundamental que atrapa el RNC, Nombre Empresarial y Logo del Emisor configurado en Ajustes. Estos datos hidratan todas las vistas de impresión PDF y Tickets del POS.

---

## 6. Diseño y Sistema de Componentes

La interfaz utiliza una filosofía de diseño híbrida entre *MacOS* y los SaaS ultra-modernos:

* **Glassmorphism:** Amplio uso de la clase `backdrop-blur-xl` junto con fondos translúcidos `bg-white/40` o `bg-black/40` para la barra de navegación lateral y las tarjetas base.
* **Gradientes Vivos (Glows):** Los fondos del sistema usan orbes coloridos subyacentes e iterativos inspirados en la marca (Lollipop) para no ser un software contable aburrido o gris.
* **Variables CSS Centrales:** Todo es controlado desde `globals.css` (variables CSS nativas como `--primary`, `--ring`). Por tanto cambiar el "tono" del Púrpura base a Verde o cambiar al Dark Mode es soportado instantáneamente sin refactorización.

---

## 7. Guía de Desarrollo y Puesta en Marcha

Si eres desarrollador y tomas este proyecto para implementar el mapa de Backend (Node o PHP/Python con Postgres), esto es lo que necesitas para correr el front actual:

1. **Clonar Repo y Acceder:**

    ```bash
    git clone https://github.com/sedphotord/Lollipop-Sysfac.git
    cd Lollipop-Sysfac
    ```

2. **Instalar dependendencias completas (NPM):**

    ```bash
    npm install
    ```

3. **Ejecutar Servidor en Turbopack:**

    ```bash
    npm run dev
    ```

4. Inicia el servidor en `http://localhost:3000`. Cualquier alteración a la lógica de `/dashboard` se reflejará instantáneamente sin necesidad de recargar la pestaña.

---

## 8. Próximos Pasos (Roadmap del Backend Core)

Para que Sysfac pueda procesar facturación legal hacia la Dirección General de Impuestos Internos (DGII) y funcionar como un negocio real, se debe desarrollar la siguiente arquitectura paralela de Backend:

1. **Migración a DB Relacional (PostgreSQL):** Modelado riguroso de tablas para Empresas, Usuarios, Clientes, Facturas, Compras, Asientos Contables e Inventario, desplazando permanentemente el uso de `localStorage`.
2. **Sistema Auth & Tenants:** Implementación de Login, seguridad por tokens JWT y un modelo Multi-Tenant para que un mismo despliegue de software pueda alojar a cientos de empresas de manera aislada.
3. **Firmado y Transmisión e-CF:** El bloque de software más crítico. Construcción de scripts (Node/Python) para leer los certificados fiscales `.p12`, encriptar/firmar el XML de la factura y realizar la transmisión `SOAP` a los ambientes de certificación de la DGII.
4. **Colas de Trabajos (Job Queues):** Adoptar herramientas como Redis/BullMQ para procesar en segundo plano las respuestas asíncronas de la DGII (aceptaciones comerciales) y generar reportes contables pesados.
5. **Motor Contable Activo:** Funciones tipo *Triggers* que vigilen las ventas de la UI y automáticamente asienten los movimientos financieros en Débito y Crédito para cuadrar la empresa sin intervención humana.
