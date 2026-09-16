import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";

type ContactCtaProps = {
  title: string;
  description: string;
  ctaLabel: string;
  showWhatsApp?: boolean;
};

export default function ContactCta({
  title,
  description,
  ctaLabel,
  showWhatsApp = false,
}: ContactCtaProps) {
  return (
    <section className="bg-white py-12 sm:py-16" aria-labelledby="contact-cta-title">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden border border-black/10 bg-white text-[#171717] shadow-xl shadow-black/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-64 lg:min-h-full">
          <Image
            src="/cta.webp"
            alt="Entrega de llaves de una propiedad"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          </div>
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B71C1C]">
            Nuestro compromiso
          </p>
          <h2 id="contact-cta-title" className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-black/65">{description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contacto" className="justify-center px-7 py-3.5">
            {ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
            </ButtonLink>
            {showWhatsApp && (
              <a
                href="https://wa.me/5493816806570"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#B71C1C] px-7 py-3.5 text-sm font-semibold text-[#B71C1C] transition hover:bg-[#B71C1C] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
              >
                Escribinos por WhatsApp
              </a>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
