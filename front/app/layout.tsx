import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsapp from "@/components/ui/FloatingWhatsapp";
import type { Metadata } from "next";

import { absoluteUrl, defaultDescription, pageMetadata, siteUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  ...pageMetadata("Inmobiliaria en Tucumán", defaultDescription, "/"),
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Medde & Padilla | Inmobiliaria en Tucumán", template: "%s | Medde & Padilla" },
  icons: { icon: "/logo/favicon.png", shortcut: "/logo/favicon.png", apple: "/logo/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <JsonLd data={{
          "@context": "https://schema.org", "@type": "RealEstateAgent",
          name: "Medde & Padilla", url: siteUrl, "@id": absoluteUrl("/#inmobiliaria"),
          image: absoluteUrl("/logo/logoHorizontal.png"), telephone: "+5493816806570",
          address: { "@type": "PostalAddress", streetAddress: "Congreso 603, piso 5, oficina C", addressLocality: "San Miguel de Tucumán", addressRegion: "Tucumán", addressCountry: "AR" },
          areaServed: "Tucumán", sameAs: ["https://www.instagram.com/medde.padilla.inmob"],
        }} />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingWhatsapp />
      </body>
    </html>
  );
}
