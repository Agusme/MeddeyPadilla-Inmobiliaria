import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ui/ContactCta";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Venta, alquiler, tasaciones y administración de propiedades en Tucumán.",
};

type Service = {
  title: string;
  description: string;
  icon: "key" | "home" | "search" | "scale" | "document" | "briefcase";
  href: string;
};

const services: Service[] = [
  { title: "Venta", description: "Te ayudamos a encontrar al comprador adecuado y a gestionar la publicación y cada paso del proceso.", icon: "home", href: "/contacto#contact-form" },
  { title: "Compra", description: "Te acompañamos a encontrar la propiedad ideal y a avanzar con seguridad en cada etapa de la compra.", icon: "search", href: "/propiedades#listado-propiedades" },
  { title: "Alquileres", description: "Encontramos oportunidades y te acompañamos durante todo el proceso.", icon: "key", href: "/contacto#contact-form" },
  { title: "Tasaciones", description: "Conocé el valor real de tu propiedad con un análisis profesional, actualizado y confiable.", icon: "scale", href: "/contacto#contact-form" },
  { title: "Administración", description: "Nos ocupamos de la gestión y el seguimiento de tu inmueble con orden y transparencia.", icon: "document", href: "/contacto#contact-form" },
  { title: "Asesoramiento", description: "Te brindamos orientación personalizada para tomar mejores decisiones en tu próxima operación.", icon: "briefcase", href: "/contacto#contact-form" },
];

function ServiceIcon({ type }: { type: Service["icon"] }) {
  const common = { className: "h-10 w-10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.55, "aria-hidden": true };
  if (type === "key") return <svg {...common}><circle cx="8" cy="15" r="3" /><path d="m10.2 12.8 7.3-7.3 2 2-1.5 1.5 1.2 1.2-2 2-1.2-1.2-4.6 4.6" /></svg>;
  if (type === "home") return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-6h6v6" /></svg>;
  if (type === "search") return <svg {...common}><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /><path d="M8.5 10.5h4M10.5 8.5v4" /></svg>;
  if (type === "scale") return <svg {...common}><path d="M12 3v18M7 6h10M5 21h14" /><path d="m7 6-4 8h8L7 6ZM17 6l-4 8h8l-4-8Z" /></svg>;
  if (type === "document") return <svg {...common}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></svg>;
  return <svg {...common}><rect x="4" y="7" width="16" height="12" rx="1" /><path d="M9 7V5a3 3 0 0 1 6 0v2M4 12h16M10 12v2h4v-2" /></svg>;
}

export default function ServiciosPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-20" aria-label="Introducción a los servicios">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">Servicios inmobiliarios</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[#171717] sm:text-5xl">Soluciones pensadas<br />para cada etapa.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">Te acompañamos con asesoramiento profesional, transparencia y atención personalizada para que tomes decisiones con seguridad.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-8 lg:px-12 lg:pb-16" aria-label="Listado de servicios">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link key={service.title} href={service.href} aria-label={`${service.title}: ${service.description}`} className="flex min-h-52 flex-col rounded-md border border-[#B71C1C]/10 bg-[#B71C1C]/8 p-5 shadow-[0_12px_28px_-22px_rgba(0,0,0,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]">
                <div className="text-[#B71C1C]">
                  <ServiceIcon type={service.icon} />
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-[1.08] tracking-tight text-[#171717]">{service.title}</h2>
                <p className="mt-3 text-sm leading-5 text-black/62">{service.description}</p>
                <span aria-hidden="true" className="mt-auto self-end pt-5 text-2xl leading-none text-[#B71C1C]">→</span>
            </Link>
          ))}
        </div>
      </section>

      <ContactCta title="¿Tenés una propiedad o buscás tu próximo lugar?" description="Contanos qué necesitás. Te asesoramos de forma personalizada y sin compromiso." ctaLabel="Quiero asesoramiento" />
    </div>
  );
}
