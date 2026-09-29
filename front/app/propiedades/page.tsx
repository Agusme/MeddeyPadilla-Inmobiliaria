"use client";


import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import {
  listPublicProperties,
  type PublicProperty,
} from "@/components/properties/propertyRepository";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCallback, useEffect, useState } from "react";

const propertyTypeLabels: Record<string, string> = {
  casa: "Casas",
  departamento: "Departamentos",
  terreno: "Terrenos",
  local: "Locales",
  oficina: "Oficinas",
};

const propertyTypeOrder = ["casa", "departamento", "terreno", "local", "oficina"];

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const groupedProperties = Array.from(
    properties.reduce((groups, property) => {
      const key = property.type.trim().toLocaleLowerCase("es");
      groups.set(key, [...(groups.get(key) ?? []), property]);
      return groups;
    }, new Map<string, PublicProperty[]>()).entries(),
  )
    .sort(([first], [second]) => {
      const firstOrder = propertyTypeOrder.indexOf(first);
      const secondOrder = propertyTypeOrder.indexOf(second);
      if (firstOrder === -1 && secondOrder === -1) return first.localeCompare(second, "es");
      if (firstOrder === -1) return 1;
      if (secondOrder === -1) return -1;
      return firstOrder - secondOrder;
    })
    .map(([key, items]) => ({
      key,
      title: propertyTypeLabels[key] ?? `${items[0]?.type ?? key}s`,
      items,
    }));

  const loadProperties = useCallback((filters: { type?: string; operation?: string }) => {
    setHasActiveFilter(Boolean(filters.type || filters.operation));
    setIsLoading(true);
    void listPublicProperties(filters)
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  function searchProperties(filters: { type?: string; operation?: string }) {
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.operation) params.set("operation", filters.operation);
    const query = params.toString();
    const nextUrl = `/propiedades${query ? `?${query}` : ""}#listado-propiedades`;
    window.history.pushState(window.history.state, "", nextUrl);
    loadProperties(filters);
  }

  useEffect(() => {
    const loadFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type") || undefined;
      const operation = params.get("operation") || undefined;
      setFilterResetKey((current) => current + 1);
      loadProperties({ type, operation });
    };
    loadFromUrl();
    window.addEventListener("popstate", loadFromUrl);
    return () => window.removeEventListener("popstate", loadFromUrl);
  }, [loadProperties]);

  function showAllProperties() {
    window.history.replaceState(window.history.state, "", "/propiedades#listado-propiedades");
    setFilterResetKey((current) => current + 1);
    loadProperties({});
  }

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
            <PropertyFilter key={filterResetKey} onSearch={searchProperties} />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:px-8 lg:px-12">
          {hasActiveFilter && properties.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fafafa] px-4 py-2 text-sm text-black/60">
                <span className="font-semibold text-[#171717]">{properties.length}</span>
                {properties.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
              </p>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={showAllProperties}
                  className="inline-flex shrink-0 items-center text-sm font-semibold text-[#B71C1C] transition hover:text-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
                >
                  Ver todas <span aria-hidden="true" className="ml-2">→</span>
                </button>
              )}
            </div>
          )}
          <section
            id="listado-propiedades"
            className="scroll-mt-24 space-y-12"
            aria-label="Listado de propiedades"
          >
            {groupedProperties.map((group) => (
              <section key={group.key} aria-labelledby={`property-type-${group.key}`}>
                <h2 id={`property-type-${group.key}`} className="mb-5 text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">
                  {group.title}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((property) => (
                    <PropertyCard key={property.slug} property={property} />
                  ))}
                </div>
              </section>
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
              <button
                type="button"
                onClick={showAllProperties}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2"
              >
                Ver todas las propiedades
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
