import Link from "next/link";
import ContactCta from "@/components/ui/ContactCta";
import PropertyFilter from "@/components/properties/PropertyFilter";
import HomeFeaturedProperties from "@/components/properties/HomeFeaturedProperties";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[380px] overflow-hidden sm:min-h-[calc(100dvh-73px)] md:min-h-[min(54svh,500px)] xl:min-h-[calc(100dvh-73px)]">
        <ImageWithSkeleton
          src="/home/herohom.jpg"
          alt="Casa con piscina y espacios exteriores"
          priority
          imageClassName="object-[42%_center] sm:scale-105 sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/20 sm:bg-black/45" />

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-center px-5 pt-6 pb-10 sm:min-h-[calc(100dvh-73px)] sm:justify-start sm:px-8 sm:py-14 md:min-h-[min(54svh,500px)] md:justify-center md:py-8 xl:min-h-[calc(100dvh-73px)] xl:justify-start xl:px-12 xl:pt-32 xl:pb-0">
        <div className="max-w-2xl translate-y-3.5 text-white sm:translate-y-0 xl:max-w-4xl">
            <h1 className="max-w-[18rem] text-[32px] font-semibold leading-[1.18] sm:max-w-xl sm:text-5xl sm:leading-tight xl:text-6xl xl:leading-[1.1]">
              Hacemos simple encontrar tu hogar
            </h1>
            <p className="mt-18 max-w-[19rem] text-[15px] leading-[1.55] text-white/85 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-7 lg:mt-6 xl:mt-4">
              <span className="sm:hidden">Te acompañamos en cada etapa de compra, venta o alquiler, con transparencia y respaldo legal.</span>
              <span className="hidden sm:inline">Te acompañamos en cada etapa de la compra, venta o alquiler de tu propiedad con total transparencia y respaldo legal</span>
            </p>
          </div>
          <div className="mt-10 hidden w-full xl:block">
            <div className="w-full max-w-6xl">
              <PropertyFilter overlay />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-5 pt-4 pb-1 sm:px-8 sm:pt-6 sm:pb-2 md:pt-4 md:pb-0 xl:hidden" aria-label="Buscar propiedades">
        <div className="mx-auto flex w-full max-w-7xl justify-center">
          <PropertyFilter overlay />
        </div>
      </section>
      <section
        className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-14 md:py-10 lg:px-12 lg:py-14"
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
