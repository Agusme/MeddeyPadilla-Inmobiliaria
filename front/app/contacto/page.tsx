import SectionHeading from "@/components/ui/SectionHeading";
import GoogleMap from "@/components/contact/GoogleMap";
import ContactForm from "@/components/contact/ContactForm";
import Image from "next/image";
import { Building2, Check, House, MapPin, Phone, Store, Warehouse } from "lucide-react";

const administrationBenefits = [
  "Administración de alquileres",
  "Seguimiento de pagos",
  "Coordinación de mantenimiento",
  "Atención personalizada",
];

const administrationPropertyTypes = [
  { label: "Departamentos", icon: Building2 },
  { label: "Casas", icon: House },
  { label: "Locales comerciales", icon: Store },
  { label: "Otros inmuebles", icon: Warehouse },
];

function AdministrationPresentation() {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
      <div className="flex min-w-0 flex-col gap-4">
        <SectionHeading
          titleAs="h1"
          title="Administramos tus propiedades"
          titleClassName="sm:text-[2rem]"
          className="[&>p]:mt-3"
          description="Nos ocupamos de la administración de tus inmuebles, ofreciendo una gestión clara, organizada y personalizada para que disfrutes de tu inversión con tranquilidad."
        />
        <ul aria-label="Tipos de propiedades que administramos" className="grid grid-cols-2 gap-y-3 px-2 py-2 sm:grid-cols-4 sm:gap-y-0">
          {administrationPropertyTypes.map(({ label, icon: Icon }, index) => (
            <li key={label} className={`flex min-w-0 flex-col items-center gap-1.5 px-2 text-center text-xs leading-4 text-black/70 ${index % 2 === 1 ? "border-l border-black/10" : ""} ${index === 2 ? "sm:border-l sm:border-black/10" : ""}`}>
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#B71C1C]" strokeWidth={1.5} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative isolate grid min-w-0 overflow-hidden">
        <Image
          src="/servicios/compra.webp"
          alt="Conjunto de viviendas modernas con balcones y jardines, iluminadas por luz natural"
          width={1284}
          height={816}
          sizes="(min-width: 1280px) 576px, (min-width: 1024px) calc((100vw - 128px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)"
          className="relative -z-20 aspect-[2/1] h-auto w-full object-cover object-[right_bottom] [grid-area:1/1] sm:aspect-[23/10]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, #000 55%), linear-gradient(to bottom, #000 80%, rgba(0,0,0,0.45) 100%)",
            maskComposite: "intersect",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 12%, #000 55%), linear-gradient(to bottom, #000 80%, rgba(0,0,0,0.45) 100%)",
            WebkitMaskComposite: "source-in",
          }}
        />
        <ul aria-label="Beneficios del servicio de administración" className="relative mt-3 grid grid-cols-2 gap-x-4 gap-y-2 bg-white/90 px-3 py-3 text-xs leading-4 text-black/85 sm:mt-0 sm:self-end sm:[grid-area:1/1]">
          {administrationBenefits.map((benefit) => (
            <li key={benefit} className="flex min-w-0 items-start gap-2">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#B71C1C]" strokeWidth={1.8} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const isAdministration = (await searchParams).servicio === "administracion";
  const initialMessage = isAdministration
    ? "Hola, quisiera recibir información sobre el servicio de administración de propiedades."
    : "";

  return (
    <div className="overflow-hidden bg-white">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-8 md:py-12 lg:px-12">
        {isAdministration && (
          <header className="mb-6 hidden md:mb-8 md:block">
            <AdministrationPresentation />
          </header>
        )}

        <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-y-0 lg:overflow-hidden lg:rounded-2xl lg:bg-gradient-to-br lg:from-[#C52A2A] lg:via-[#A91E1E] lg:to-[#791717] lg:shadow-[0_22px_50px_-25px_rgba(0,0,0,0.35)]">
          <div className="hidden min-w-0 lg:col-start-1 lg:row-start-1 lg:block lg:px-8 lg:pt-8">
            <h2 className="hidden text-2xl font-semibold tracking-tight text-white lg:block">
              Contactanos directamente
            </h2>
            <p className="mt-2 hidden leading-7 text-white/70 lg:block">
              Elegí cómo preferís comunicarte con nosotros
            </p>
          </div>

          <section
            className="min-w-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-6 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:rounded-none lg:border-0 lg:p-8 lg:shadow-none"
            aria-labelledby="contact-form-title"
          >
            <h2 id="contact-form-title" className="text-2xl font-semibold tracking-tight text-[#171717]">
              Envianos una consulta
            </h2>
            <p className="mt-2 leading-7">
              Completá el formulario y nos comunicaremos con vos a la brevedad.
            </p>
            <ContactForm key={isAdministration ? "administracion" : "general"} initialMessage={initialMessage} />
          </section>

          <section
            className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] p-4 text-white md:p-6 lg:col-start-1 lg:row-start-2 lg:rounded-none lg:bg-none lg:p-8 lg:pt-5"
            aria-label="Datos de contacto"
          >
            <h2 className="mb-4 text-2xl font-semibold tracking-tight lg:hidden">Datos de contacto</h2>
            <address className="flex flex-col gap-4 text-sm not-italic text-white/85">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Congreso%20603%2C%20piso%205%2C%20oficina%20C%2C%20San%20Miguel%20de%20Tucum%C3%A1n"
                target="_blank"
                rel="noreferrer"
                className="order-2 flex items-start gap-3 transition hover:text-[#e16a62]"
              >
                <MapPin aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                <span>Congreso 603, piso 5</span>
              </a>
              <div className="order-1 flex items-start gap-3">
                <Phone aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />

                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-sm lg:flex-nowrap">
                  <a
                    href="tel:+5493816806570"
                    className="whitespace-nowrap transition hover:text-[#e16a62]"
                  >
                    381 680-6570
                  </a>
                  <span aria-hidden="true" className="hidden text-white/40 lg:inline">|</span>
                  <a
                    href="tel:+5493814544929"
                    className="whitespace-nowrap transition hover:text-[#e16a62]"
                  >
                    381 454-4929
                  </a>
                  <span aria-hidden="true" className="hidden text-white/40 lg:inline">|</span>
                  <a
                    href="tel:+5493814410232"
                    className="whitespace-nowrap transition hover:text-[#e16a62]"
                  >
                    381 441-0232
                  </a>
                </div>
              </div>
            </address>
            <div className="mt-5 w-full overflow-hidden rounded-xl border border-white/15">
              <GoogleMap />
            </div>
            <div className="mt-4 border-t border-white/15 pt-4">
              <div className="flex gap-3">
                <a
                  aria-label="Facebook"
                  href="https://www.facebook.com/profile.php?id=61587494125747&mibextid=wwXIfr&rdid=F78yUKJ9Y8y1A3Tt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18DGxUozJ6%2F%3Fmibextid%3DwwXIfr#"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#e16a62] hover:text-[#e16a62]"
                >
                  <FacebookIcon />
                </a>
                <a
                  aria-label="Instagram"
                  href="https://www.instagram.com/medde.padilla.inmob?igsh=eGI4ZXZ1bDd0dzh5&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#e16a62] hover:text-[#e16a62]"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}
