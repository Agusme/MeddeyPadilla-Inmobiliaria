"use client";


import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import Link from "next/link";
import {
  listPublicProperties,
  type PublicProperty,
} from "@/components/properties/propertyRepository";
import SectionHeading from "@/components/ui/SectionHeading";
import { useEffect, useState } from "react";

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || undefined;
    const operation = params.get("operation") || undefined;

    void listPublicProperties({ type, operation })
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading || window.location.hash !== "#listado-propiedades") return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("listado-propiedades")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, properties]);

  return (
    <div className="overflow-hidden bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
          <header className="mb-10">
            <SectionHeading
              eyebrow="Encontrá tu próximo lugar"
              title="La propiedad indicada está más cerca."
            />
          </header>
          <div className="max-w-4xl">
            <PropertyFilter />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:px-8 lg:px-12">
          {properties.length > 0 && (
            <div className="pb-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fafafa] px-4 py-2 text-sm text-black/60">
                <span className="font-semibold text-[#171717]">{properties.length}</span>
                {properties.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
              </p>
            </div>
          )}
          <section
            id="listado-propiedades"
            className="grid scroll-mt-24 gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Listado de propiedades"
          >
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </section>
          {!isLoading && properties.length === 0 && (
            <div
              className="mx-auto flex max-w-2xl flex-col items-center px-6 py-4 text-center sm:px-10 sm:py-5"
              role="status"
            >
              <span className="flex h-14 w-14 items-center justify-center text-[#B71C1C]">
                <svg
                  aria-hidden="true"
                  className="h-9 w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2M8.5 10.8h4.6" />
                </svg>
              </span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">
                No encontramos propiedades con esa combinación
              </h2>
              <p className="mt-1 max-w-md text-sm leading-6 text-black/60 sm:text-base">
                Probá cambiar los filtros o explorá todas las propiedades disponibles.
              </p>
              <Link
                href="/propiedades#listado-propiedades"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2"
              >
                Ver todas las propiedades
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
