import Image from "next/image";
import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ContactCta from "@/components/ui/ContactCta";
import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCard, {
  type PropertyCardData,
} from "@/components/properties/PropertyCard";

const featuredProperties: PropertyCardData[] = [
  {
    title: "Casa con jardín y piscina",
    location: "Yerba Buena, Tucumán",
    type: "Casa",
    operation: "Venta",
    price: "USD 185.000",
    image: "/image1.webp",
  },
  {
    title: "Departamento luminoso",
    location: "San Miguel de Tucumán",
    type: "Departamento",
    operation: "Alquiler",
    price: "$ 650.000 / mes",
    image: "/image2.webp",
  },
  {
    title: "Terreno con excelente ubicación",
    location: "Lomas de Tafí, Tucumán",
    type: "Terreno",
    operation: "Venta",
    price: "USD 72.000",
    image: "/image.webp",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate min-h-[82dvh] overflow-hidden sm:min-h-[calc(100dvh-73px)]">
        <Image
          src="/home/herohom.jpg"
          alt="Casa con piscina y espacios exteriores"
          fill
          priority
          className="object-cover object-[42%_center] sm:scale-105 sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/20 sm:bg-black/45" />

        <div className="relative mx-auto flex min-h-[82dvh] max-w-7xl flex-col px-6 pb-6 pt-[14vh] sm:min-h-[calc(100dvh-73px)] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="max-w-xl text-white">
            <p className="mb-3 max-w-xs text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-[0.22em]">
              Medde &amp; Padilla Inmobiliaria
            </p>
            <h1 className="max-w-[20rem] text-3xl font-semibold leading-[1.12] sm:max-w-xl sm:text-5xl sm:leading-tight lg:text-6xl">
              Encontrá el lugar donde empieza tu próxima historia.
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/85 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-7">
              Propiedades seleccionadas y asesoramiento cercano para comprar,
              vender o alquilar con confianza.
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
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">
              Una selección para vos
            </p>
            <h2
              id="featured-properties-title"
              className="text-3xl font-semibold tracking-tight text-black sm:text-4xl"
            >
              Propiedades destacadas
            </h2>
          </div>
          <Link
            href="/propiedades#listado-propiedades"
            className="inline-flex shrink-0 self-end items-center text-sm font-semibold text-[#B71C1C] transition hover:translate-x-0.5 hover:text-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
          >
            Ver todas <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.title} property={property} />
          ))}
        </div>
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
