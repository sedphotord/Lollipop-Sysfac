import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lollipop - Facturación Electrónica DGII",
  description: "Sistema de facturación electrónica y gestión comercial para República Dominicana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
