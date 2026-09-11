import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";

export default function Home() {
  return (
    <>
      <section className="relative isolate -mx-6 min-h-[calc(100dvh-73px)] overflow-hidden sm:-mx-8 lg:-mx-12">
        <Image
          src="/home/herohom.jpg"
          alt="Casa con piscina y espacios exteriores"
          fill
          priority
          className="scale-105 object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-73px)] max-w-7xl items-start px-6 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              Medde &amp; Padilla Inmobiliaria
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Encontrá el lugar donde empieza tu próxima historia.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
              Propiedades seleccionadas y asesoramiento cercano para comprar,
              vender o alquilar con confianza.
            </p>
            <ButtonLink href="/propiedades" className="mt-6">
              Ver propiedades
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
