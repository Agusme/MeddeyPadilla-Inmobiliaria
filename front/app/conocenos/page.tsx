import type { Metadata } from "next";
import Link from "next/link";
import GoogleMap from "@/components/contact/GoogleMap";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Conocenos",
  description: "Conocé a Medde & Padilla: transparencia, respaldo profesional y acompañamiento inmobiliario en Tucumán.",
};

const commitments = [
  {
    icon: "transparency",
    title: "Transparencia en cada paso",
    description: "Te explicamos cada etapa con claridad para que puedas decidir con toda la información.",
  },
  {
    icon: "security",
    title: "Inversiones seguras",
    description: "Operá con la confianza y el respaldo de profesionales matriculados.",
  },
  {
    icon: "home",
    title: "La tranquilidad de elegir bien",
    description: "Te acompañamos para que encuentres el lugar indicado para tu próximo hogar.",
  },
];

function CommitmentIcon({ type }: { type: string }) {
  const props = { "aria-hidden": true, viewBox: "0 0 24 24", className: "h-12 w-12 fill-none stroke-current", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (type === "transparency") {
    return <svg {...props}><path d="M12 3 4.5 6v5.2c0 4.5 3 7.8 7.5 9.8 4.5-2 7.5-5.3 7.5-9.8V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></svg>;
  }
  if (type === "security") {
    return <svg {...props}><path d="M4 20h16" /><path d="M6 17v-4M11 17V9M16 17V5" /><path d="m5 9 5-4 4 2 5-4" /><path d="M16 3h3v3" /></svg>;
  }
  return <svg {...props}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></svg>;
}
function CredentialIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.7">
      <path d="M7 3.5h10v11H7z" />
      <path d="M9.5 7h5M9.5 10h5" />
      <circle cx="12" cy="17" r="3.2" />
      <path d="m10.3 19.7-1 2 2.7-1.1 2.7 1.1-1-2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.56 7.46L4 20l1.1-3.72A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M9.4 8.5c.2-.4.4-.42.7-.42h.45c.2 0 .4.08.5.38l.65 1.55c.1.23.08.42-.08.62l-.5.62c-.12.15-.1.3 0 .5.3.53 1.1 1.65 2.5 2.25.2.08.35.06.48-.1l.63-.76c.15-.18.32-.2.55-.1l1.5.7c.25.12.38.24.35.47-.06.48-.3 1.3-.88 1.55-.45.2-1.05.28-1.7.08-1.15-.35-2.48-1.2-3.48-2.2-.8-.8-1.7-2.1-1.9-3.1-.13-.64-.03-1.18.23-1.64Z" />
    </svg>
  );
}

export default function NosotrosPage() {
  return (
    <div className="bg-white text-[#171717]">
     
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-12 lg:pt-16 lg:pb-24">
          <div>
            <SectionHeading
              eyebrow="INMOBILIARIA Medde &amp; Padilla "
              title="Confianza que une. Espacios que inspiran."
              titleAs="h1"
              className="max-w-2xl"
            />
            <p className="mt-5 max-w-xl text-base leading-7 text-black/65 sm:text-lg">Somos una inmobiliaria ubicada en San Miguel de Tucumán. Acompañamos a quienes quieren comprar, vender o alquilar, con asesoramiento cercano, transparencia y respaldo profesional en cada etapa.</p>
           
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/propiedades#listado-propiedades" className="inline-flex items-center justify-center rounded-full bg-[#B71C1C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2">
                Encontrá tu próximo hogar <span aria-hidden="true" className="ml-2">→</span>
              </Link>
              <Link href="/contacto#contact-form" className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-[#B71C1C] hover:text-[#B71C1C]">
                Hablemos
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#B71C1C] p-7 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Tu inmobiliaria de confianza</p>
            <p className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Transparencia y acompañamiento para elegir con tranquilidad.</p>
            <p className="mt-5 max-w-md leading-7 text-white/80">Estamos cerca para ayudarte a avanzar con seguridad en cada paso de tu operación inmobiliaria.</p>
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"><CredentialIcon /></span>
                <p className="text-sm leading-5 text-white/80"><span className="block font-semibold text-white">Matrícula profesional</span><span className="mt-1 block">M.P. 666</span></p>
              </div>
            </div>
          </div>
        </div>
      

      <section className="relative isolate mx-auto max-w-7xl rounded-2xl bg-[#B71C1C]/[0.04] px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
        <SectionHeading
title="¿Por qué elegirnos?"
          titleClassName="text-[#B71C1C]"
          titleSize="compact"
          className="relative z-10 mb-10 sm:mb-12"
        />
        <div className="relative z-10 grid gap-5 md:grid-cols-3">
          {commitments.map((item) => (
            <article key={item.title} className="rounded-xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.28)] transition-shadow duration-200 hover:shadow-[0_18px_38px_-18px_rgba(0,0,0,0.32)] sm:p-8 lg:p-9">
              <div className="flex justify-center text-[#B71C1C]">
                <CommitmentIcon type={item.icon} />
              </div>
              <h2 className="mt-5 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/60 sm:text-base">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14 lg:px-12">
        <div>
          <SectionHeading
            eyebrow="Estamos cerca"
            title="Conocemos Tucumán y su gente."
          />
          <a href="https://www.google.com/maps/search/?api=1&query=Congreso%20603%2C%20piso%205%2C%20oficina%20C%2C%20San%20Miguel%20de%20Tucum%C3%A1n" target="_blank" rel="noreferrer" className="mt-6 flex w-fit items-start gap-3 text-sm leading-6 text-black/65 transition hover:text-[#B71C1C]">
            <span className="mt-0.5 text-[#B71C1C]"><LocationIcon /></span>
            <span>Congreso 603, piso 5, oficina C<br />San Miguel de Tucumán, Tucumán</span>
          </a>
          <div className="mt-7 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Seguinos</span>
            <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=61587494125747&mibextid=wwXIfr&rdid=F78yUKJ9Y8y1A3Tt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18DGxUozJ6%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><FacebookIcon /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/medde.padilla.inmob?igsh=eGI4ZXZ1bDd0dzh5&utm_source=qr" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><InstagramIcon /></a>
            <a aria-label="WhatsApp" href="https://wa.me/5493816806570" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><WhatsappIcon /></a>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-[#171717] shadow-[0_22px_50px_-25px_rgba(0,0,0,0.3)]">
          <GoogleMap />
        </div>
      </section>
    </div>
  );
}
