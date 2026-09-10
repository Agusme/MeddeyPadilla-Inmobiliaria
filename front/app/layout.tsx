import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Meddey & Padilla | Inmobiliaria",
    template: "%s | Meddey & Padilla",
  },
  description:
    "Meddey & Padilla Inmobiliaria: encontrá propiedades y servicios inmobiliarios para comprar, vender o alquilar.",
  authors: [{ name: "Agustina Mena" }],
  creator: "Agustina Mena",
  keywords: [
    "inmobiliaria",
    "propiedades",
    "venta de propiedades",
    "alquiler de propiedades",
    "Meddey & Padilla",
  ],
  icons: {
    icon: "/logo/favicon.png",
    shortcut: "/logo/favicon.png",
    apple: "/logo/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Meddey & Padilla Inmobiliaria",
    title: "Meddey & Padilla | Inmobiliaria",
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
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
