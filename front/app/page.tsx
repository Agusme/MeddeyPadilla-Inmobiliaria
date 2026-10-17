import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ContactCta from "@/components/ui/ContactCta";
import PropertyFilter from "@/components/properties/PropertyFilter";
import HomeFeaturedProperties from "@/components/properties/HomeFeaturedProperties";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[82dvh] overflow-hidden sm:min-h-[calc(100dvh-73px)]">
        <ImageWithSkeleton
          src="/home/herohom.jpg"
          alt="Casa con piscina y espacios exteriores"
          priority
          imageClassName="object-[42%_center] sm:scale-105 sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/20 sm:bg-black/45" />

        <div className="relative mx-auto flex min-h-[82dvh] max-w-7xl flex-col px-6 pb-6 pt-[14vh] sm:min-h-[calc(100dvh-73px)] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-2xl text-white lg:max-w-4xl">
            <p className="mb-3 max-w-xs text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-[0.22em]">
              Medde &amp; Padilla Inmobiliaria
            </p>
            <h1 className="max-w-[20rem] text-3xl font-semibold leading-[1.12] sm:max-w-xl sm:text-5xl sm:leading-tight lg:text-6xl">
Hacemos simple encontrar tu hogar       </h1>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/85 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-7">
           Te acompañamos en cada etapa de la compra, venta o alquiler de tu propiedad con total transparencia y respaldo legal
            </p>
            <ButtonLink href="/propiedades#listado-propiedades" className="mt-8 sm:mt-6">
              Ver propiedades 
            </ButtonLink>
          </div>
          <div className="mt-auto w-full pt-12">
            <PropertyFilter overlay />
          </div>
        </div>
      </section>
      <section
        className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-14 lg:px-12"
        aria-labelledby="featured-properties-title"
      >
        <div className="mb-8 flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between">
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
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
