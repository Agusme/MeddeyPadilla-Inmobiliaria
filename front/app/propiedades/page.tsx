"use client";


import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import Button from "@/components/ui/Button";
import {
  listPublicProperties,
  type PublicProperty,
} from "@/components/properties/propertyRepository";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCallback, useEffect, useState } from "react";

const propertiesPerPage = 9;

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [visibleCount, setVisibleCount] = useState(propertiesPerPage);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const visibleProperties = properties.slice(0, visibleCount);

  const loadProperties = useCallback((filters: { type?: string; operation?: string }) => {
    setHasActiveFilter(Boolean(filters.type || filters.operation));
    setVisibleCount(propertiesPerPage);
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
        <div className="mx-auto max-w-7xl px-6 pt-4 pb-5 sm:px-8 sm:pt-6 lg:px-12">
          <header className="mb-6">
            <SectionHeading
              titleSize="compact"
              title="Encontrá tu próxima propiedad"
            />
          </header>
          <div className="max-w-5xl">
            <PropertyFilter key={filterResetKey} onSearch={searchProperties} />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-5 pb-12 sm:px-8 sm:pt-5 lg:px-12">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">Propiedades</h2>
              {!isLoading && properties.length > 0 && (
                <span className="text-sm text-black/50">
                  {properties.length} {properties.length === 1 ? "propiedad" : "propiedades"}
                </span>
              )}
            </div>
            {hasActiveFilter && properties.length > 0 && (
              <Button
                type="button"
                variant="text"
                size="sm"
                onClick={showAllProperties}
              >
                Ver todas <span aria-hidden="true" className="ml-2">→</span>
              </Button>
            )}
          </div>
          <section
            id="listado-propiedades"
            className="scroll-mt-24"
            aria-label="Listado de propiedades"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleProperties.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          </section>
          {properties.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setVisibleCount((count) => Math.min(count + propertiesPerPage, properties.length))}
                aria-controls="listado-propiedades"
              >
                Cargar más
              </Button>
            </div>
          )}
          {!isLoading && properties.length === 0 && (
            <div
              className="mx-auto flex max-w-2xl flex-col items-center px-6 py-3 text-center sm:px-10 sm:py-4"
              role="status"
            >
              <span className="flex h-10 w-10 items-center justify-center text-black/45">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="10.8" cy="10.8" r="6.3" />
                  <path d="m15.5 15.5 4.2 4.2M8.5 10.8h4.6" />
                </svg>
              </span>
              <h2 className="mt-2 text-base font-medium tracking-tight text-[#171717] sm:text-lg">
                No encontramos propiedades con esos filtros
              </h2>
              <Button
                type="button"
                variant="secondary"
                onClick={showAllProperties}
                className="mt-3"
              >
                Ver todas las propiedades
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
