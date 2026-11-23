"use client";

import Button from "@/components/ui/Button";

export default function PageError() {
  return (
    <section className="mx-auto flex min-h-[60svh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center" role="alert">
      <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">No pudimos cargar esta página</h1>
      <p className="mt-3 text-sm text-black/65">Revisá tu conexión o volvé a intentarlo en unos minutos.</p>
      <Button className="mt-7" onClick={() => window.location.reload()}>Volver a intentar</Button>
    </section>
  );
}
