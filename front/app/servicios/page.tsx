import type { Metadata } from "next";
import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Venta, alquiler, tasaciones y administración de propiedades en Tucumán.",
};

type Service = {
  title: string;
  description: string;
  icon: "key" | "home" | "scale" | "document" | "briefcase";
  image: string;
};

const services: Service[] = [
  { title: "Venta de propiedades", description: "Te ayudamos a encontrar al comprador adecuado y a gestionar la publicación y cada paso del proceso.", icon: "home", image: "/servicios/venta.webp" },
  { title: "Alquileres", description: "Encontramos oportunidades y acompañamos tanto a propietarios como a inquilinos durante todo el proceso.", icon: "key", image: "/servicios/alquiler.webp" },
  { title: "Tasaciones", description: "Conocé el valor real de tu propiedad con un análisis profesional, actualizado y confiable.", icon: "scale", image: "/servicios/tasaciones.webp" },
  { title: "Administración de propiedades", description: "Nos ocupamos de la gestión y el seguimiento de tu inmueble con orden y transparencia.", icon: "document", image: "/servicios/administracion.webp" },
  { title: "Asesoramiento inmobiliario", description: "Te brindamos orientación personalizada para tomar mejores decisiones en tu próxima operación.", icon: "briefcase", image: "/servicios/asesoramiento.jpg" },
];

function ServiceIcon({ type }: { type: Service["icon"] }) {
  const common = { className: "h-7 w-7", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.55, "aria-hidden": true };
  if (type === "key") return <svg {...common}><circle cx="8" cy="15" r="3" /><path d="m10.2 12.8 7.3-7.3 2 2-1.5 1.5 1.2 1.2-2 2-1.2-1.2-4.6 4.6" /></svg>;
  if (type === "home") return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-6h6v6" /></svg>;
  if (type === "scale") return <svg {...common}><path d="M12 3v18M7 6h10M5 21h14" /><path d="m7 6-4 8h8L7 6ZM17 6l-4 8h8l-4-8Z" /></svg>;
  if (type === "document") return <svg {...common}><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></svg>;
  return <svg {...common}><rect x="4" y="7" width="16" height="12" rx="1" /><path d="M9 7V5a3 3 0 0 1 6 0v2M4 12h16M10 12v2h4v-2" /></svg>;
}

export default function ServiciosPage() {
  return (
    <div className="-mx-6 overflow-hidden bg-white sm:-mx-8 lg:-mx-12">
      <section className="relative isolate overflow-hidden border-b border-black/10 bg-[#171717] py-18 text-white">
        <Image src="/home/herohom.jpg" alt="" fill priority className="absolute z-0 object-cover object-center opacity-25" sizes="100vw" />
        <div className="absolute inset-0 z-0 bg-black/65" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"><p className="text-xs font-bold uppercase tracking-[.28em] text-[#e16a62]">Medde &amp; Padilla</p><h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Nuestros servicios</h1></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-12" aria-label="Introducción a los servicios"><h2 className="max-w-3xl border-l-4 border-[#B71C1C] pl-5 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">Soluciones inmobiliarias pensadas para cada etapa</h2><p className="mt-3 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">Te acompañamos con asesoramiento profesional, transparencia y atención personalizada para que tomes decisiones con seguridad.</p></section>

      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-8 lg:px-12 lg:pb-16" aria-label="Listado de servicios">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, index) => (
            <article key={service.title} className={`group relative isolate min-h-[260px] overflow-hidden rounded-md bg-[#171717] text-white lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}>
              <Image src={service.image} alt="" fill className="-z-10 object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/78 via-black/55 to-black/18" />
              <div className="flex h-full min-h-[260px] max-w-[290px] flex-col p-5 sm:p-6"><div className="flex items-center gap-3 text-[#d73b35]"><ServiceIcon type={service.icon} /><span className="h-7 w-px bg-[#d73b35]" /></div><div className="mt-auto"><h3 className="text-2xl font-medium leading-[1.08] tracking-tight">{service.title}</h3><p className="mt-3 text-sm leading-5 text-white/78">{service.description}</p></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12"><div className="mx-auto grid max-w-7xl gap-8 bg-white px-6 py-10 text-[#171717] shadow-xl shadow-black/10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#B71C1C]">Hablemos</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">¿Tenés una propiedad o buscás tu próximo lugar?</h2><p className="mt-4 leading-7 text-black/65">Contanos qué necesitás. Te asesoramos de forma personalizada y sin compromiso.</p></div><ButtonLink href="/contacto" className="w-fit shrink-0 px-8 py-4 text-base">Quiero asesoramiento <span aria-hidden="true" className="ml-2">→</span></ButtonLink></div></section>
    </div>
  );
}
