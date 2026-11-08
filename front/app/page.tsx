import Link from "next/link";
import ContactCta from "@/components/ui/ContactCta";
import PropertyFilter from "@/components/properties/PropertyFilter";
import HomeFeaturedProperties from "@/components/properties/HomeFeaturedProperties";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[380px] overflow-hidden max-md:min-h-[360px]! sm:min-h-[calc(100dvh-73px)] md:min-h-[min(54svh,500px)] xl:min-h-[calc(100dvh-73px)]">
        <Image
          src="/home/herohom.webp"
          alt="Casa con piscina y espacios exteriores"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[42%_center] sm:scale-105 sm:object-center max-md:scale-100! max-md:object-[60%_center]!"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/20 sm:bg-black/45 max-md:bg-transparent! max-md:bg-linear-to-t! max-md:from-black/50! max-md:via-black/20! max-md:to-black/10!" />

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-center px-4 pt-6 pb-10 sm:min-h-[calc(100dvh-73px)] sm:justify-start md:px-8 sm:py-14 md:min-h-[min(54svh,500px)] md:justify-center md:py-8 xl:min-h-[calc(100dvh-73px)] xl:justify-start lg:px-12 xl:pt-32 xl:pb-0 max-md:min-h-[360px]! max-md:justify-center! max-md:py-10!">
        <div className="max-w-2xl translate-y-3.5 text-white sm:translate-y-0 xl:max-w-4xl max-md:translate-y-0!">
            <h1 className="max-w-[18rem] text-[32px] font-semibold leading-[1.18] sm:max-w-xl sm:text-5xl sm:leading-tight xl:text-6xl xl:leading-[1.1] max-md:max-w-[20rem]! max-md:text-[28px]! max-md:leading-[1.15]!">
              Hacemos simple encontrar tu hogar
            </h1>
            <p className="mt-18 max-w-[19rem] text-[15px] leading-[1.55] text-white/85 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-7 lg:mt-6 xl:mt-4 max-md:mt-4! max-md:max-w-[19rem]! max-md:text-[15px]! max-md:leading-[1.65]!">
              <span className="md:hidden">Te acompañamos en cada etapa de compra, venta o alquiler, con transparencia y respaldo legal.</span>
              <span className="hidden md:inline">Te acompañamos en cada etapa de la compra, venta o alquiler de tu propiedad con total transparencia y respaldo legal</span>
            </p>
          </div>
          <div className="mt-10 hidden w-full xl:block">
            <div className="w-full max-w-6xl">
              <PropertyFilter overlay autoSearch />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 pt-4 pb-1 md:px-8 lg:px-12 sm:pt-6 sm:pb-2 md:pt-4 md:pb-0 xl:hidden max-md:pt-6! max-md:pb-0!" aria-label="Buscar propiedades">
        <div className="mx-auto flex w-full max-w-7xl justify-center max-md:flex-col! max-md:gap-3! max-md:[&>section]:w-full!">
          <h2 className="text-xl font-semibold leading-tight tracking-tight md:hidden">Encontrá tu próxima propiedad</h2>
          <PropertyFilter overlay autoSearch />
        </div>
      </section>
      <section
        className="mx-auto max-w-7xl px-4 py-8 md:px-8 sm:py-14 md:py-10 lg:py-14 lg:px-12 max-md:py-8!"
        aria-labelledby="featured-properties-title"
      >
        <div className="mb-8 flex flex-col items-start gap-5 md:mb-6 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="featured-properties-title"
              className="text-2xl font-medium tracking-tight text-black sm:text-3xl"
            >
              Propiedades destacadas
            </h2>
          </div>
          <Link
            href="/propiedades#listado-propiedades"
            className="inline-flex shrink-0 self-end items-center gap-2 text-sm font-medium tracking-wide text-black/70 transition-colors duration-250 hover:text-[#B71C1C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
          >
            Ver todas
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
        <HomeFeaturedProperties />
      </section>
      <ContactCta
        title="¿Buscás vender, comprar o alquilar?"
        description="Contanos qué necesitás. Te acompañamos con atención personalizada para que encuentres el próximo paso indicado."
        ctaLabel="Ir a contacto"
        showWhatsApp
      />
    </>
  );
}
