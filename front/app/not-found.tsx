import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto flex min-h-[60svh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[65svh] sm:py-24 md:px-8 lg:px-12"
    >
      <p className="text-sm font-medium tracking-[0.18em] text-black/40">404</p>
      <h1
        id="not-found-title"
        className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-4xl"
      >
        No encontramos la página que buscás
      </h1>
     
      <div className="mt-9 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
        <ButtonLink href="/propiedades" size="lg">
          Ver propiedades
        </ButtonLink>
        <ButtonLink href="/" variant="text" size="lg">
          Volver al inicio
        </ButtonLink>
      </div>
    </section>
  );
}
