import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ui/ContactCta";
import SectionHeading from "@/components/ui/SectionHeading";

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
  const common = { className: "h-9 w-9", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.55, "aria-hidden": true };
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
      <section className="mx-auto mb-8 max-w-7xl px-6 pb-4 pt-12 sm:mb-10 sm:px-8 sm:pb-6 sm:pt-16 lg:px-12" aria-label="Introducción a los servicios">
        
        <header>
            <SectionHeading
              eyebrow="Servicios inmobiliarios"
              title="Soluciones pensadas para cada etapa."
              description="Te acompañamos con asesoramiento profesional, transparencia y atención personalizada para que tomes decisiones con seguridad."
           
           />
          </header>
      </section>
  
      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-8 lg:px-12" aria-label="Listado de servicios">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              aria-label={`${service.title}: ${service.description}`}
              className="group relative isolate flex min-h-64 flex-col overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] p-6 text-white shadow-[0_14px_34px_-20px_rgba(80,0,0,0.55)] transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-[0_20px_42px_-20px_rgba(80,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,255,255,0.14),transparent_44%)]" />
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
                <ServiceIcon type={service.icon} />
              </div>
              <h2 className="relative z-10 mt-6 text-xl font-semibold leading-tight tracking-tight text-white">{service.title}</h2>
              <p className="relative z-10 mt-3 text-sm leading-6 text-white/75">{service.description}</p>
              <span className="relative z-10 mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-white">
                Consultanos
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-lg transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#8F1616]">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ContactCta title="¿Tenés una propiedad o buscás tu próximo lugar?" description="Contanos qué necesitás. Te asesoramos de forma personalizada y sin compromiso." ctaLabel="Quiero asesoramiento" />
    </div>
  );
}
