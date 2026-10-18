import SectionHeading from "@/components/ui/SectionHeading";
import GoogleMap from "@/components/contact/GoogleMap";
import ContactForm from "@/components/contact/ContactForm";
import { ArrowRight, MapPin, Phone } from "lucide-react";

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

export default function ContactoPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <header className="mb-8">
          <SectionHeading
            title="Estamos para acompañarte"
            description="Contanos qué necesitás y te ayudamos a dar el próximo paso con la atención personalizada que buscás."
          />
        </header>

        <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_22px_50px_-25px_rgba(0,0,0,0.35)] sm:rounded-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section
            className="overflow-hidden bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] p-6 text-white sm:p-8"
            aria-labelledby="contact-details-title"
          >
            <h2
              id="contact-details-title"
              className="text-3xl font-semibold tracking-tight"
            >
              Dónde encontrarnos
            </h2>
            <p className="mt-3 max-w-md leading-7 text-white/70">
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
            className="p-6 sm:p-8 lg:p-10"
            aria-labelledby="contact-form-title"
          >
            <h2
              id="contact-form-title"
              className="text-3xl font-semibold tracking-tight text-[#171717]"
            >
              Dejanos tu mensaje
            </h2>
            <p className="mt-3 leading-7 text-black/60">
              Completá el formulario y nos comunicaremos con vos a la brevedad.
            </p>
            <ContactForm />
          </section>
        </div>
      </section>
    </div>
  );
}
