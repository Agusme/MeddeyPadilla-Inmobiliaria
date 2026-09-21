"use client";

import PropertyGallery from "@/components/properties/PropertyGallery";
import { getPublicPropertyBySlug } from "@/components/properties/propertyRepository";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<ReturnType<
    typeof getPublicPropertyBySlug
  >>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProperty(getPublicPropertyBySlug(slug));
      setLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  if (!loaded) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
        <p className="text-sm text-black/60">Cargando propiedad…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
        <Link
          href="/propiedades"
          className="inline-flex text-sm font-semibold text-[#B71C1C]"
        >
          ← Volver a propiedades
        </Link>
        <h1 className="mt-8 text-2xl font-semibold">
          Propiedad no encontrada
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
      <Link
        href="/propiedades"
        className="inline-flex text-sm font-semibold text-[#B71C1C]"
      >
        ← Volver a propiedades
      </Link>
      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <PropertyGallery images={property.images} title={property.title} />
        <aside className="h-fit border border-black/10 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B71C1C]">
            {property.operation} · {property.type}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#171717]">
            {property.title}
          </h1>
          <p className="mt-3 text-sm text-black/60">{property.location}</p>
          <p className="mt-6 text-2xl font-semibold text-[#171717]">
            {property.price}
          </p>
          <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-semibold text-[#171717]">
              ¿Te interesa esta propiedad?
            </p>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Escribinos para recibir más información o coordinar una visita.
            </p>
            <Link
              href="/contacto#contact-form"
              className="mt-5 inline-flex w-full justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white"
            >
              Consultar propiedad
            </Link>
          </div>
        </aside>
      </div>
      <section className="mt-12 grid gap-10 border-t border-black/10 pt-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Descripción</h2>
          <p className="mt-4 max-w-2xl leading-7 text-black/65">
            {property.description}
          </p>
          <h2 className="mt-10 text-2xl font-semibold tracking-tight">
            Ubicación
          </h2>
          <p className="mt-4 flex items-center gap-2 text-black/65">
            <span className="text-[#B71C1C]">●</span>
            {property.address}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Características
          </h2>
          <dl className="mt-5 grid grid-cols-2 border-l border-t border-black/10">
            {property.features.map((feature) => (
              <div
                key={feature.label}
                className="border-b border-r border-black/10 p-4"
              >
                <dt className="text-xs uppercase tracking-wide text-black/50">
                  {feature.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#171717]">
                  {feature.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
