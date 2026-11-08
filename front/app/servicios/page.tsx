import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ui/ContactCta";
import SectionHeading from "@/components/ui/SectionHeading";
import { serviceIcons } from "@/components/services/serviceIcons";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Venta, alquiler, tasaciones y administración de propiedades en Tucumán.",
};

type Service = {
  title: string;
  description: string;
  icon: keyof typeof serviceIcons;
  href: string;
};

const services: Service[] = [
  { title: "Venta", description: "Te ayudamos a encontrar al comprador adecuado y a gestionar la publicación y cada paso del proceso.", icon: "sale", href: "/contacto#contact-form" },
  { title: "Compra", description: "Te acompañamos a encontrar la propiedad ideal y a avanzar con seguridad en cada etapa de la compra.", icon: "purchase", href: "/propiedades#listado-propiedades" },
  { title: "Alquileres", description: "Encontramos oportunidades y te acompañamos durante todo el proceso.", icon: "rental", href: "/contacto#contact-form" },
  { title: "Tasaciones", description: "Conocé el valor real de tu propiedad con un análisis profesional, actualizado y confiable.", icon: "appraisal", href: "/contacto#contact-form" },
  { title: "Administración", description: "Nos ocupamos de la gestión y el seguimiento de tu inmueble con orden y transparencia.", icon: "administration", href: "/contacto?servicio=administracion" },
  { title: "Asesoramiento", description: "Te brindamos orientación personalizada para tomar mejores decisiones en tu próxima operación.", icon: "advice", href: "/contacto#contact-form" },
];

function ServiceIcon({ type }: { type: Service["icon"] }) {
  const Icon = serviceIcons[type];
  return <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />;
}

export default function ServiciosPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="mx-auto mb-6 max-w-7xl px-4 pt-12 md:px-8 sm:pt-16 lg:mb-8 lg:px-12" aria-label="Introducción a los servicios">
        
        <header>
            <SectionHeading
              title="Nuestros Servicios"
           />
          </header>
      </section>
  
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 lg:px-12" aria-label="Listado de servicios">
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:auto-rows-fr lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              aria-label={`${service.title}: ${service.description}`}
              className="group relative isolate grid grid-cols-1 cursor-pointer max-md:min-h-30 max-md:content-center overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] px-3 py-5 md:p-5 text-center text-white shadow-[0_14px_34px_-20px_rgba(80,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,255,255,0.14),transparent_44%)]" />
              <div className="relative z-10 flex h-11 w-11 justify-self-center items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-transform duration-700 ease-out group-hover:scale-115 group-focus-visible:scale-115 motion-reduce:transition-none motion-reduce:transform-none">
                <ServiceIcon type={service.icon} />
              </div>
              <h2 className="relative z-10 mt-3 min-w-0 break-words text-sm md:mt-2 md:text-xl font-semibold leading-tight tracking-tight text-white">{service.title}</h2>
              <p className="relative z-10 mt-1 hidden text-sm leading-5 text-white/75 md:block">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <ContactCta title="¿Tenés una propiedad o buscás tu próximo lugar?" description="Contanos qué necesitás. Te asesoramos de forma personalizada y sin compromiso." ctaLabel="Quiero asesoramiento" />
    </div>
  );
}
