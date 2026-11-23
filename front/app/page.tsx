import ButtonLink from "@/components/ui/ButtonLink";
import ContactCta from "@/components/ui/ContactCta";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyFilter from "@/components/properties/PropertyFilter";
import HomeFeaturedProperties from "@/components/properties/HomeFeaturedProperties";
import Image from "next/image";
import { ArrowRight, BadgeCheck, House, ShieldCheck } from "lucide-react";

const commitments = [
  {
    Icon: BadgeCheck,
    title: "Transparencia en cada paso",
    description: "Te explicamos cada etapa con claridad para que tomes decisiones informadas.",
  },
  {
    Icon: ShieldCheck,
    title: "Inversiones seguras",
    description: "Operá con la confianza y el respaldo de profesionales matriculados.",
  },
  {
    Icon: House,
    title: "Acompañamiento personalizado",
    description: "Te asesoramos de forma cercana para que encuentres el lugar ideal.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[380px] overflow-hidden max-md:min-h-[360px]! sm:min-h-[calc(100dvh-73px)] md:min-h-[min(54svh,500px)] lg:min-h-[calc(100dvh-73px)]">
        <Image
          src="/home/herohom.webp"
          alt="Casa con piscina y espacios exteriores"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[42%_center] brightness-120 sm:scale-105 sm:object-center max-md:scale-100! max-md:object-[60%_center]!"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-105 from-black/60 via-black/25 to-black/5 sm:bg-black/25 max-md:bg-transparent! max-md:bg-linear-350! max-md:from-black/45! max-md:via-black/5! max-md:via-30%! max-md:to-transparent! max-md:to-65%!" />

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-center px-4 pt-6 pb-10 sm:min-h-[calc(100dvh-73px)] sm:justify-start md:px-8 sm:py-14 md:min-h-[min(54svh,500px)] md:justify-center md:py-8 lg:min-h-[calc(100dvh-73px)] lg:px-12 xl:justify-start xl:pt-32 xl:pb-10 max-md:min-h-[360px]! max-md:justify-end! max-md:pt-10! max-md:pb-9!">
        <div className="max-w-2xl translate-y-3.5 text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.55)] sm:translate-y-0 xl:max-w-4xl max-md:translate-y-0!">
            <h1 className="max-w-[18rem] text-[32px] font-semibold leading-[1.18] sm:max-w-xl sm:text-5xl sm:leading-tight xl:text-6xl xl:leading-[1.1] max-md:max-w-[19rem]! max-md:text-[32px]! max-md:leading-[1.12]!">
              Hacemos simple encontrar tu hogar
            </h1>
            <p className="hidden md:block mt-18 max-w-[19rem] text-[15px] leading-[1.55] text-white/85 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-7 lg:mt-6 xl:mt-4 max-md:mt-4! max-md:max-w-[19rem]! max-md:text-[15px]! max-md:leading-[1.65]!">
              <span className="hidden md:inline">Te acompañamos en cada etapa de la compra, venta o alquiler de tu propiedad con total transparencia y respaldo legal</span>
            </p>
          </div>
          <div className="mt-6 hidden w-full lg:block xl:mt-10">
            <div className="w-full max-w-6xl">
              <PropertyFilter overlay autoSearch />
            </div>
          </div>
        </div>
      </section>
      <section id="home-property-search" className="bg-white px-4 pt-4 pb-1 md:px-8 sm:pt-6 sm:pb-2 md:pt-4 md:pb-0 lg:hidden max-md:relative max-md:z-[51] max-md:pt-6! max-md:pb-0!" aria-label="Buscar propiedades">
        <div className="mx-auto flex w-full max-w-7xl justify-center max-md:flex-col! max-md:gap-3! max-md:[&>section]:w-full!">
          <h2 className="text-xl font-semibold leading-tight tracking-tight md:hidden">Encontrá tu próxima propiedad</h2>
          <PropertyFilter overlay autoSearch />
        </div>
      </section>
      <div className="flow-root">
        <HomeFeaturedProperties />
        <section
          className="mx-auto max-w-7xl px-4 first:mt-6 md:px-8 lg:px-12"
          aria-labelledby="home-commitments-title"
        >
          <div className="rounded-xl bg-[#B71C1C]/[0.04] px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-5 flex items-center justify-between gap-2 sm:mb-6">
              <SectionHeading
                title="¿Por qué elegirnos?"
                titleId="home-commitments-title"
                titleClassName="text-[#B71C1C]"
                titleSize="compact"
              />
              <ButtonLink href="/conocenos" variant="text" size="sm" className="text-[#B71C1C]! hover:text-black!">
                Conocénos <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              </ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
              {commitments.map(({ Icon, title, description }) => (
                <article key={title} className="rounded-xl border border-black/5 bg-white p-4 text-center shadow-[0_12px_32px_-18px_rgba(0,0,0,0.28)] md:row-span-3 md:grid md:grid-rows-subgrid md:gap-y-0">
                  <Icon aria-hidden="true" className="mx-auto h-9 w-9 text-[#B71C1C]" strokeWidth={1.8} />
                  <h3 className="mt-3 text-base leading-snug font-semibold tracking-tight text-balance xl:text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-5 text-black/60">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ContactCta
        title="¿Buscás vender, comprar o alquilar?"
        description="Contanos qué necesitás. Te acompañamos con atención personalizada para que encuentres el próximo paso indicado."
        ctaLabel="Ir a contacto"
        showWhatsApp
      />
    </>
  );
}
