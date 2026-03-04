import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Features } from "@/components/landing/Features";
import { AdvancedFeatures } from "@/components/landing/AdvancedFeatures";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

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
