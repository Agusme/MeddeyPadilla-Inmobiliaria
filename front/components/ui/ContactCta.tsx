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
    <section className="bg-[#f7f6f3] py-12 sm:py-16" aria-labelledby="contact-cta-title">
      <div className="mx-auto grid max-w-7xl gap-8 bg-white px-6 py-10 text-[#171717] shadow-xl shadow-black/10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">
            Hablemos
          </p>
          <h2 id="contact-cta-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 leading-7 text-black/65">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
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
    </section>
  );
}
