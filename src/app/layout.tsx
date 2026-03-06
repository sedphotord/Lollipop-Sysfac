import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const APP_URL = "https://lollipop-sysfac.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Lollipop — Sistema de Facturación Electrónica DGII RD",
    template: "%s · Lollipop",
  },
  description:
    "Sistema de facturación electrónica, POS e inventario para República Dominicana. Compatible con e-CF y NCF de la DGII.",
  keywords: [
    "facturación electrónica",
    "DGII",
    "e-CF",
    "NCF",
    "República Dominicana",
    "POS",
    "inventario",
    "cotizaciones",
    "Lollipop",
  ],
  authors: [{ name: "Lollipop" }],
  creator: "Lollipop",
  publisher: "Lollipop",
  metadataBase: new URL(APP_URL),

  // ── Open Graph (WhatsApp, Facebook, LinkedIn, Slack, etc.) ──
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: APP_URL,
    siteName: "Lollipop",
    title: "Lollipop — Sistema de Facturación Electrónica DGII RD",
    description:
      "Factura electrónicamente, gestiona tu POS e inventario. Compatible con e-CF y NCF de la DGII. Prueba gratis hoy.",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Lollipop — Sistema de Facturación Electrónica para República Dominicana",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    title: "Lollipop — Sistema de Facturación Electrónica DGII RD",
    description:
      "Factura electrónicamente, gestiona tu POS e inventario. Compatible con e-CF y NCF de la DGII. Prueba gratis hoy.",
    images: [`${APP_URL}/og-image.png`],
    creator: "@lollipopapp",
  },

  // ── Icons ──
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
