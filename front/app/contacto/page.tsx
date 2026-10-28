import SectionHeading from "@/components/ui/SectionHeading";
import GoogleMap from "@/components/contact/GoogleMap";
import ContactForm from "@/components/contact/ContactForm";
import Image from "next/image";
import { ArrowRight, Building2, Check, House, MapPin, Phone, Store, Warehouse } from "lucide-react";

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
      <section className={`mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 ${isAdministration ? "pb-12 pt-8 sm:pb-16 sm:pt-10" : "py-12 sm:py-16"}`}>
        <header className="mb-8">
          {isAdministration ? (
            <AdministrationPresentation />
          ) : (
            <SectionHeading
              title="Estamos para acompañarte"
              description="Contanos qué necesitás y te ayudamos a dar el próximo paso con la atención personalizada que buscás."
            />
          )}
        </header>

        <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_22px_50px_-25px_rgba(0,0,0,0.35)] sm:rounded-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section
            className="overflow-hidden bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] p-6 text-white sm:p-8"
            aria-label="Datos de contacto"
          >
            <p className="max-w-md leading-7 text-white/70">
              Acercate a nuestra oficina en el centro de San Miguel de Tucumán o
              contactanos por teléfono y WhatsApp.
            </p>
            <address className="mt-7 space-y-4 text-sm not-italic text-white/85">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Congreso%20603%2C%20piso%205%2C%20oficina%20C%2C%20San%20Miguel%20de%20Tucum%C3%A1n"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-[#e16a62]"
              >
                <MapPin aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                <span>Congreso 603, piso 5</span>
              </a>
              <div className="flex items-start gap-3">
                <Phone aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />

                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
                  <a
                    href="tel:+5493816806570"
                    className="transition hover:text-[#e16a62]"
                  >
                    +54 9 381 680-6570
                  </a>

                  <span className="hidden text-white/50 sm:inline">|</span>

                  <a
                    href="tel:+5493814544929"
                    className="transition hover:text-[#e16a62]"
                  >
                    +54 9 381 454-4929
                  </a>

                  <span className="hidden text-white/50 sm:inline">|</span>

                  <a
                    href="tel:+5493814410232"
                    className="transition hover:text-[#e16a62]"
                  >
                    +54 9 381 441-0232
                  </a>
                </div>
              </div>
            </address>
            <a
              href="https://wa.me/5493816806570"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#B71C1C] shadow-lg shadow-black/30 transition  hover:bg-white/90 sm:w-fit"
            >
              Escribinos por WhatsApp{" "}
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" strokeWidth={1.8} />
            </a>
            <div className="mt-8 overflow-hidden rounded-xl border border-white/15">
              <GoogleMap />
            </div>
            <div className="mt-7 border-t border-white/15 pt-6">
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

          <section
            className="p-6 sm:p-8 lg:px-10 lg:pb-10"
            aria-label="Formulario de contacto"
          >
            <p className="leading-7">
              Completá el formulario y nos comunicaremos con vos a la brevedad.
            </p>
            <ContactForm key={isAdministration ? "administracion" : "general"} initialMessage={initialMessage} />
          </section>
        </div>
      </section>
    </div>
  );
}
