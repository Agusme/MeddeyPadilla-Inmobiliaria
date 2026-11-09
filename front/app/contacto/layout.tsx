import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contacto", "Contactá a Medde & Padilla en San Miguel de Tucumán para comprar, vender o alquilar.", "/contacto");

export default function ContactoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
