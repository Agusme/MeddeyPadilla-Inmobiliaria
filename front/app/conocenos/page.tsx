import type { Metadata } from "next";
import Image from "next/image";
import GoogleMap from "@/components/contact/GoogleMap";

export const metadata: Metadata = {
  title: "Conocenos",
  description: "Conocé a Medde & Padilla Inmobiliaria.",
};

const reasons = [
  { title: "Confianza", description: "Construimos relaciones claras y cercanas en cada operación.", icon: "shield" },
  { title: "Conocimiento local", description: "Conocemos el mercado y las oportunidades de Tucumán.", icon: "home" },
  { title: "Atención personalizada", description: "Te acompañamos de principio a fin, a tu ritmo.", icon: "people" },
];

function ReasonIcon({ type }: { type: string }) {
  const props = { "aria-hidden": true, className: "h-10 w-10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7 };
  if (type === "shield") return <svg {...props}><path d="M12 3.5 19 6v5.2c0 4.4-2.8 7.7-7 9.3-4.2-1.6-7-4.9-7-9.3V6l7-2.5Z" /><path d="m8.7 12 2.1 2.1 4.6-4.6" /></svg>;
  if (type === "handshake") return <svg {...props}><path d="m8.5 12.5 2 2a2 2 0 0 0 2.8 0l1.2-1.2" /><path d="m13 8.5 1.2-1.2a2.8 2.8 0 0 1 4 0l2.3 2.3-4.2 4.2a2 2 0 0 1-2.8 0l-2-2" /><path d="m10 9.5-1.2-1.2a2.8 2.8 0 0 0-4 0l-2.3 2.3 4.2 4.2a2 2 0 0 0 2.8 0l1.1-1.1" /></svg>;
  if (type === "home") return <svg {...props}><path d="m3.5 10 8.5-7 8.5 7" /><path d="M5.5 9v11h13V9M9.5 20v-6h5v6" /></svg>;
  return <svg {...props}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a2.5 2.5 0 0 1 0 5M18.5 20a4.5 4.5 0 0 0-2.5-4" /></svg>;
}

function LocationIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-none stroke-current" strokeWidth="1.8"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></svg>;
}

function CredentialIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.7"><path d="M7 3.5h10v11H7z" /><path d="M9.5 7h5M9.5 10h5" /><circle cx="12" cy="17" r="3.2" /><path d="m10.3 19.7-1 2 2.7-1.1 2.7 1.1-1-2" /></svg>;
}

function FacebookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" /></svg>;
}

function InstagramIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" /></svg>;
}

function WhatsappIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.56 7.46L4 20l1.1-3.72A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="M9.4 8.5c.2-.4.4-.42.7-.42h.45c.2 0 .4.08.5.38l.65 1.55c.1.23.08.42-.08.62l-.5.62c-.12.15-.1.3 0 .5.3.53 1.1 1.65 2.5 2.25.2.08.35.06.48-.1l.63-.76c.15-.18.32-.2.55-.1l1.5.7c.25.12.38.24.35.47-.06.48-.3 1.3-.88 1.55-.45.2-1.05.28-1.7.08-1.15-.35-2.48-1.2-3.48-2.2-.8-.8-1.7-2.1-1.9-3.1-.13-.64-.03-1.18.23-1.64Z" /></svg>;
}

export default function NosotrosPage() {
  return (
    <div className="bg-white text-[#171717]">
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
        <section className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="flex flex-col justify-center py-3 sm:py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B71C1C]">Quiénes somos</p>
            <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Somos una inmobiliaria ubicada en San Miguel de Tucumán con más de <span className="text-[#B71C1C]">10 años de experiencia</span> en el mercado.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-black/60">Acompañamos a nuestros clientes en la compra, venta y alquiler de propiedades, con atención profesional, cercana y transparente.</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B71C1C]/10 text-[#B71C1C]"><CredentialIcon /></span>
              <p className="text-sm leading-5 text-black/65"><span className="block font-semibold text-[#171717]">Matrícula profesional</span><span className="mt-1 block">M.P. 666</span></p>
            </div>
          </div>
          <div className="relative min-h-72 sm:min-h-96">
            <Image src="/objetivos.webp" alt="Acompañamiento en una operación inmobiliaria" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </section>

        <section className="border-b border-black/10 py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B71C1C]">Por qué elegirnos</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">Experiencia, compromiso y un trato cercano.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-black/60">Buscamos que cada decisión inmobiliaria sea más simple y segura.</p>
            </div>
            <div className="grid gap-x-7 gap-y-8 sm:grid-cols-3">
              {reasons.map((reason) => (
                <article key={reason.title}>
                  <div className="w-fit text-[#B71C1C]"><ReasonIcon type={reason.icon} /></div>
                  <h3 className="mt-4 font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/60">{reason.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12" aria-labelledby="location-title">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B71C1C]">Dónde encontrarnos</p>
              <h2 id="location-title" className="mt-3 text-3xl font-semibold tracking-tight">Nuestra ubicación</h2>
              <a href="https://www.google.com/maps/search/?api=1&query=Congreso%20603%2C%20piso%205%2C%20oficina%20C%2C%20San%20Miguel%20de%20Tucum%C3%A1n" target="_blank" rel="noreferrer" className="mt-5 flex items-start gap-3 text-sm leading-6 text-black/65 transition hover:text-[#B71C1C]">
                <span className="mt-0.5 text-[#B71C1C]"><LocationIcon /></span>
                <span>Congreso 603, piso 5, oficina C<br />San Miguel de Tucumán, Tucumán</span>
              </a>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Seguinos</span>
                <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=61587494125747&mibextid=wwXIfr&rdid=F78yUKJ9Y8y1A3Tt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18DGxUozJ6%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><FacebookIcon /></a>
                <a aria-label="Instagram" href="https://www.instagram.com/medde.padilla.inmob?igsh=eGI4ZXZ1bDd0dzh5&utm_source=qr" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><InstagramIcon /></a>
                <a aria-label="WhatsApp" href="https://wa.me/5493816806570" target="_blank" rel="noreferrer" className="rounded-full border border-black/15 p-2.5 transition hover:border-[#B71C1C] hover:text-[#B71C1C]"><WhatsappIcon /></a>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-black/10 bg-[#171717] shadow-sm"><GoogleMap /></div>
          </div>
        </section>
      </main>
    </div>
  );
}
