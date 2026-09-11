import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsapp from "@/components/ui/FloatingWhatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Medde & Padilla | Inmobiliaria",
    template: "%s | Medde & Padilla",
  },
  description:
    "Medde & Padilla Inmobiliaria: encontrá propiedades y servicios inmobiliarios para comprar, vender o alquilar.",
  authors: [{ name: "Agustina Mena" }],
  creator: "Agustina Mena",
  keywords: [
    "inmobiliaria",
    "propiedades",
    "venta de propiedades",
    "alquiler de propiedades",
    "Medde & Padilla",
  ],
  icons: {
    icon: "/logo/favicon.png",
    shortcut: "/logo/favicon.png",
    apple: "/logo/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Medde & Padilla Inmobiliaria",
    title: "Medde & Padilla | Inmobiliaria",
    description:
      "Encontrá propiedades y servicios inmobiliarios para comprar, vender o alquilar.",
    images: ["/logo/logoHorizontal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-6 sm:px-8 lg:px-12">{children}</main>
        <Footer />
        <FloatingWhatsapp />
      </body>
    </html>
  );
}
