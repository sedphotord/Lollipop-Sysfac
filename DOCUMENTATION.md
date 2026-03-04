# Lollipop Sysfac - Documentación Oficial 📖

Bienvenido a la documentación oficial de **Lollipop Sysfac**, el sistema ERP y Facturación Electrónica en la nube diseñado para la República Dominicana. Este documento proporciona una guía profunda sobre la arquitectura, los módulos funcionales, el stack tecnológico y las instrucciones de uso del sistema.

---

## 📋 Índice

1. [Introducción y Objetivos](#1-introducción-y-objetivos)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Módulos Principales](#4-módulos-principales)
    * 4.1 Dashboard
    * 4.2 Ventas y Facturación (e-CF)
    * 4.3 Punto de Venta (POS)
    * 4.4 Compras y Gastos
    * 4.5 Catálogo e Inventario
    * 4.6 Finanzas y Contabilidad
5. [Almacenamiento y Persistencia Local](#5-almacenamiento-y-persistencia-local)
6. [Diseño y Sistema de Componentes](#6-diseño-y-sistema-de-componentes)
7. [Guía de Desarrollo y Puesta en Marcha](#7-guía-de-desarrollo-y-puesta-en-marcha)
8. [Próximos Pasos (Roadmap)](#8-próximos-pasos-roadmap)

---

## 1. Introducción y Objetivos

**Lollipop Sysfac** nació con la intención de modernizar la experiencia de facturación fiscal (DGII) en la República Dominicana. El objetivo es ofrecer una herramienta hermosa, ultra-rápida y fácil de usar, eliminando la fricción de los sistemas contables tradicionales.

Actualmente, el proyecto se encuentra en una fase MVP Centrada en el Frontend, es decir, toda la interfaz, flujos y cálculos operan en el navegador cliente simulando un backend real para facilitar pruebas de usabilidad y de campo de forma inmediata.

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

## 4. Módulos Principales

### 4.1 Dashboard

El centro de mando. Mueve datos consolidados de *Total Facturado*, comprobantes *Aceptados por la DGII*, y cuentas pendientes. Contiene gráficas de flujo de caja e ingresos mensuales.

### 4.2 Ventas y Facturación (e-CF)

Ubicado en `/dashboard/invoices`. Es el corazón del sistema:

* **Listado:** Muestra todas las facturas en estado (Borrador, Pendiente DGII, Aceptado). Permite edición y eliminación directa.
* **Editor (`[id]` y `new`):** Interfaz robusta para agregar items, elegir clientes, y cambiar el tipo de Comprobante Fiscal (Crédito Fiscal B01, Consumo B02, Gubernamental B15, etc.). Calcula automáticamente el porcentaje de ITBIS.
* **Preview:** Genera una visualización precisa (A4) en HTML, lista para ser convertida en PDF nativamente por el navegador (`window.print()`).

### 4.3 Punto de Venta (POS)

Ubicado en `/dashboard/pos`. Diseñado para tiendas minoristas:

* Navegación por categorías visuales.
* Facturación inmediata al cliente "Consumidor Final" o personalizado.
* **Multicobro:** Opción de separar el pago (Ej: Mitad Efectivo, Mitad Tarjeta).
* Diseño responsivo para tablets y generador de tickets térmicos.

### 4.4 Compras y Gastos

Incluye Órdenes de Compra a suplidores y Recepción de Mercancías. Cuenta con soporte para Cajas Chicas y Comprobantes de Compras (B11) para sustentación de informales.

### 4.5 Catálogo e Inventario

Administración de Productos con precios fijos, variaciones, código de barras (REF) y atributos de impuestos. El apartado de Inventario permitirá el seguimiento "Kardex" del movimiento de bodegas.

### 4.6 Finanzas y Contabilidad

Contiene el Árbol de cuentas financieras contables (Catálogo de Cuentas), panel de Entradas de Diario y la base lógica para generar los archivos 606 y 607 mensualmente.

---

## 5. Almacenamiento y Persistencia Local

Dado que esta es la versión Frontend interactiva, la base de datos es simulada utilizando la API de **`localStorage`** del navegador.
Esto significa que los datos persisten en la computadora de quien lo utiliza aunque recargue la pantalla, **pero no viajan a un servidor central**.

**Claves importantes en LocalStorage:**

* `invoice_emitted`: Array con todas las facturas consolidadas.
* `invoice_drafts`: Array con facturas guardadas a medias.
* `lollipop_company_settings` / `lollipop_company_logo`: Estructura JSON con el perfil de la empresa emisora para que se refleje en los PDFs.

---

## 6. Diseño y Sistema de Componentes

La interfaz utiliza una filosofía de diseño híbrida entre *MacOS* y los SaaS ultra-modernos:

* **Glassmorphism:** Amplio uso de la clase `backdrop-blur-md` junto con fondos translúcidos `bg-white/50` para la barra de navegación lateral.
* **Gradientes (Glows):** Los fondos del sistema usan orbes coloridos abstractos para dar una sensación de fluidez de marca.
* **Variables CSS:** Todo el sistema hereda los colores de `globals.css` (variables como `--primary`, `--border`, `--muted`), por lo que cambiar de Modo Claro a Modo Oscuro es orgánico y perfecto.

---

## 7. Guía de Desarrollo y Puesta en Marcha

Si eres desarrollador, esto es lo que necesitas para ejecutar el código:

### Pre-requisitos

* Node.js (versión 18+).
* Gestor de paquetes `npm`, `yarn` o `pnpm`.

### Instalación

1. **Clonar y acceder al proyecto:**

    ```bash
    git clone https://github.com/sedphotord/Lollipop-Sysfac.git
    cd Lollipop-Sysfac
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

3. **Ejecutar servidor de desarrollo:**

    ```bash
    npm run dev
    ```

4. Abre el navegador en `http://localhost:3000`. Todo el código se refrescará dinámicamente según guardes cambios (Hot Reload).

---

## 8. Próximos Pasos (Roadmap)

Para que Sysfac pueda procesar facturación real hacia la Dirección General de Impuestos Internos (DGII), el Software requiere ser acoplado al siguiente Roadmap:

1. **Migrar LocalStorage a PostgreSQL:** Unificar todo el entorno de datos a una DB relacional.
2. **Implementar Auth:** Un sistema de usuarios (Login) con roles definidos (SuperAdmin, Cajero).
3. **Core e-CF (SOAP):** Lograr que la plataforma encripte facturas con el archivo `.p12` de la empresa y transmita vía XML a los Endpoints Oficiales de DGII.
4. **Backend de Contabilidad:** Enlazar que cada venta asiente los débitos y créditos matemáticos pertinentes para auto-conformar los estados financieros en la nube.
