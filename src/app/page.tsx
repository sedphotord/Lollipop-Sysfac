import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Features } from "@/components/landing/Features";
import { AdvancedFeatures } from "@/components/landing/AdvancedFeatures";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Lollipop — Facturación Electrónica DGII para República Dominicana",
  description:
    "Factura electrónicamente con e-CF y NCF, gestiona tu POS, inventario y más. La solución más completa para empresas dominicanas.",
  openGraph: {
    title: "Lollipop — Facturación Electrónica DGII",
    description:
      "Factura electrónicamente, vende en el punto de venta, controla inventario y genera reportes. Todo en un solo lugar.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Lollipop — Facturación Electrónica para RD" }],
    type: "website",
    locale: "es_DO",
    url: "https://lollipop-sysfac.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lollipop — Facturación Electrónica DGII",
    description: "Facturación electrónica, POS e inventario para República Dominicana.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Features />
        <AdvancedFeatures />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
