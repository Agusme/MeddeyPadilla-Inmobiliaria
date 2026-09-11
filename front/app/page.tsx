import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";

export default function Home() {
  return (
    <>
      <section className="relative isolate -mx-6 min-h-[82dvh] overflow-hidden sm:-mx-8 sm:min-h-[calc(100dvh-73px)] lg:-mx-12">
        <Image
          src="/home/herohom.jpg"
          alt="Casa con piscina y espacios exteriores"
          fill
          priority
          className="object-cover object-[42%_center] sm:scale-105 sm:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/20 sm:bg-black/45" />

        <div className="relative mx-auto flex min-h-[82dvh] max-w-7xl items-start px-6 pt-[14vh] sm:min-h-[calc(100dvh-73px)] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
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
            <ButtonLink href="/propiedades" className="mt-8 sm:mt-6">
              Ver propiedades
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
