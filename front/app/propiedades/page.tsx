"use client";


import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import Button from "@/components/ui/Button";
import {
  listPublicProperties,
  type PublicProperty,
} from "@/components/properties/propertyRepository";
import SectionHeading from "@/components/ui/SectionHeading";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";

const desktopPageSize = 9;
const tabletPageSize = 6;
const mobilePageSize = 4;

function pageFromUrl() {
  const value = Number(new URLSearchParams(window.location.search).get("page"));
  return Number.isInteger(value) && value > 1 ? value : 1;
}

function writePageToUrl(page: number, method: "pushState" | "replaceState") {
  const params = new URLSearchParams(window.location.search);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  const hash = window.location.hash || "#listado-propiedades";
  window.history[method](
    window.history.state,
    "",
    `/propiedades${query ? `?${query}` : ""}${hash}`,
  );
}

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [pageSize, setPageSize] = useState(desktopPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const searchVersion = useRef(0);
  // Reuse each filter combination during this visit, including pending requests.
  const searches = useRef(new Map<string, Promise<PublicProperty[]>>());
  const totalPages = Math.max(1, Math.ceil(properties.length / pageSize));
  const displayedPage = Math.min(currentPage, totalPages);
  const visibleProperties = properties.slice(
    (displayedPage - 1) * pageSize,
    displayedPage * pageSize,
  );

  const loadProperties = useCallback((filters: { type?: string; operation?: string }, page = 1) => {
    const version = ++searchVersion.current;
    setHasActiveFilter(Boolean(filters.type || filters.operation));
    setCurrentPage(page);
    setIsLoading(true);
    setHasLoadError(false);
    const key = JSON.stringify([filters.type ?? "", filters.operation ?? ""]);
    let search = searches.current.get(key);
    if (!search) {
      search = listPublicProperties(filters);
      searches.current.set(key, search);
    }
    void search
      .then((results) => {
        if (version === searchVersion.current) setProperties(results);
      })
      .catch(() => {
        searches.current.delete(key);
        if (version === searchVersion.current) {
          setProperties([]);
          setHasLoadError(true);
        }
      })
      .finally(() => {
        if (version === searchVersion.current) setIsLoading(false);
      });
  }, []);

  function searchProperties(filters: { type?: string; operation?: string }) {
    const current = new URLSearchParams(window.location.search);
    if ((current.get("type") || undefined) === filters.type &&
        (current.get("operation") || undefined) === filters.operation) return;
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
      loadProperties({ type, operation }, pageFromUrl());
    };
    loadFromUrl();
    window.addEventListener("popstate", loadFromUrl);
    return () => {
      window.removeEventListener("popstate", loadFromUrl);
    };
  }, [loadProperties]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 768px)");
    const updatePageSize = () => {
      setPageSize(desktop.matches ? desktopPageSize : tablet.matches ? tabletPageSize : mobilePageSize);
    };

    updatePageSize();
    desktop.addEventListener("change", updatePageSize);
    tablet.addEventListener("change", updatePageSize);
    return () => {
      desktop.removeEventListener("change", updatePageSize);
      tablet.removeEventListener("change", updatePageSize);
    };
  }, []);

  useEffect(() => {
    if (isLoading || currentPage <= totalPages) return;
    // displayedPage already clamps rendering; keep its shared URL in range too.
    writePageToUrl(totalPages, "replaceState");
  }, [currentPage, isLoading, totalPages]);

  function showAllProperties() {
    window.history.replaceState(window.history.state, "", "/propiedades#listado-propiedades");
    setFilterResetKey((current) => current + 1);
    loadProperties({});
  }

  function navigateToPage(page: number) {
    if (page < 1 || page > totalPages || page === displayedPage) return;
    writePageToUrl(page, "pushState");
    setCurrentPage(page);
  }

  useEffect(() => {
    if (isLoading || window.location.hash !== "#listado-propiedades") return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("listado-propiedades")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentPage, isLoading, properties]);

  const firstVisiblePage = Math.max(1, Math.min(displayedPage - 1, totalPages - 2));
  const pageNumbers = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <div className="overflow-hidden bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-5 md:px-8 sm:pt-6 lg:px-12">
          <header className="mb-6">
            <SectionHeading
              titleSize="compact"
              title="Encontrá tu próxima propiedad"
              titleClassName="max-[639px]:text-xl"
            />
          </header>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1">
            <div className="w-full min-w-0 max-w-5xl lg:flex-1">
              <PropertyFilter key={filterResetKey} onSearch={searchProperties} autoSearch />
            </div>
            {hasActiveFilter && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="self-end whitespace-nowrap rounded-full lg:self-auto"
                style={{ color: "#8B2635" }}
                onClick={showAllProperties}
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-5 pb-12 md:px-8 sm:pt-5 lg:px-12">
          <section id="listado-propiedades" className="scroll-mt-24" aria-label="Listado de propiedades">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-[#171717] sm:text-2xl">Propiedades</h2>
            </div>
            {hasActiveFilter && properties.length > 0 && (
              <Button
                type="button"
                variant="text"
                size="sm"
                onClick={showAllProperties}
              >
                Ver todas <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" strokeWidth={1.8} />
              </Button>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="mt-8 flex flex-nowrap items-center justify-center gap-2" aria-label="Paginación de propiedades">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="min-w-11 px-0"
                aria-label="Página anterior"
                title="Página anterior"
                disabled={displayedPage === 1}
                onClick={() => navigateToPage(displayedPage - 1)}
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </Button>
              {firstVisiblePage > 1 && (
                <span aria-hidden="true" className="px-1 text-sm text-black/45">…</span>
              )}
              {pageNumbers.map((page) => (
                <Fragment key={page}>
                  <Button
                    type="button"
                    variant={page === displayedPage ? "primary" : "secondary"}
                    size="md"
                    className="min-w-11 px-0"
                    aria-label={`Página ${page}`}
                    aria-current={page === displayedPage ? "page" : undefined}
                    onClick={() => navigateToPage(page)}
                  >
                    {page}
                  </Button>
                </Fragment>
              ))}
              {firstVisiblePage + pageNumbers.length - 1 < totalPages && (
                <span aria-hidden="true" className="px-1 text-sm text-black/45">…</span>
              )}
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="min-w-11 px-0"
                aria-label="Página siguiente"
                title="Página siguiente"
                disabled={displayedPage === totalPages}
                onClick={() => navigateToPage(displayedPage + 1)}
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </Button>
            </nav>
          )}
          {!isLoading && hasLoadError && (
            <p role="alert" className="py-3 text-center text-sm text-black/60">
              No pudimos cargar las propiedades. Intentá nuevamente en unos momentos.
            </p>
          )}
          {!isLoading && !hasLoadError && properties.length === 0 && (
            <div
              className="mx-auto flex max-w-lg flex-col items-center px-2 pt-1 pb-3 text-center sm:px-6 sm:pb-4"
              role="status"
            >
              <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center text-black/45">
                <Building2 className="h-10 w-10" strokeWidth={1.5} />
              </span>
              <h2 className="mt-2 text-base font-medium tracking-tight text-[#171717] sm:text-lg">
                No encontramos propiedades
              </h2>
             
            </div>
          )}
          </section>
        </div>
      </section>
    </div>
  );
}
