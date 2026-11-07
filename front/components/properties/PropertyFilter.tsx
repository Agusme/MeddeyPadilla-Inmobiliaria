"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import PropertyTypeSelect from "@/components/properties/PropertyTypeSelect";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const subscribeToUrl = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const operationFromUrl = () => new URLSearchParams(window.location.search).get("operation") ?? "";
const typeFromUrl = () => new URLSearchParams(window.location.search).get("type") ?? "";

type PropertyFilterProps = {
  overlay?: boolean;
  autoSearch?: boolean;
  onSearch?: (filters: { type?: string; operation?: string }) => void;
};

export default function PropertyFilter({
  overlay = false,
  autoSearch = false,
  onSearch,
}: PropertyFilterProps) {
  const router = useRouter();
  const urlType = useSyncExternalStore(subscribeToUrl, typeFromUrl, () => "");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const propertyType = selectedType ?? urlType;
  const urlOperation = useSyncExternalStore(subscribeToUrl, operationFromUrl, () => "");
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const operation = selectedOperation ?? urlOperation;
  const searchIcon = <Search aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.8} />;

  function searchAutomatically(filters: { type?: string; operation?: string }) {
    if (!autoSearch) return;
    if (onSearch) {
      onSearch(filters);
      return;
    }
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.operation) params.set("operation", filters.operation);
    const query = params.toString();
    router.push(`/propiedades${query ? `?${query}` : ""}#listado-propiedades`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onSearch && !autoSearch) return;
    event.preventDefault();
    if (autoSearch) return;
    const formData = new FormData(event.currentTarget);
    onSearch?.({
      type: String(formData.get("type") ?? "") || undefined,
      operation: String(formData.get("operation") ?? "") || undefined,
    });
  }

  return (
    <section
      className={
        overlay
          ? "mx-0 w-full max-w-7xl sm:w-17/20"
          : "rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_4px_14px_-12px_rgba(0,0,0,0.18)] sm:p-2 md:p-1.5 lg:p-2"
      }
      aria-label="Filtros de propiedades"
    >
      <form
        action="/propiedades#listado-propiedades"
        method="get"
        onSubmit={handleSubmit}
        className={
          overlay
            ? autoSearch
              ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:items-center md:gap-3"
              : "grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-3"
            : autoSearch
              ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:items-center lg:gap-1"
              : "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-1"
        }
      >
        <PropertyTypeSelect
          name="type" value={propertyType} clearable={autoSearch} onChange={(value) => {
            if (value === propertyType) return;
            setSelectedType(value);
            searchAutomatically({ type: value || undefined, operation: operation || undefined });
          }}
          variant={overlay ? "hero" : "public"}
        />
        <Select name="operation" label="Tipo de operación" placeholder="Tipo de operación"
          variant={overlay ? "hero" : "public"} value={operation} clearable={autoSearch} onChange={(value) => {
            if (value === operation) return;
            setSelectedOperation(value);
            searchAutomatically({ type: propertyType || undefined, operation: value || undefined });
          }}
          options={[{ value: "Venta", label: "Venta" }, { value: "Alquiler", label: "Alquiler" }]} />
        {overlay && !autoSearch ? (
          <Button
            type="submit"
            size="lg"
            aria-label="Buscar propiedades"
            className="h-12 w-full shadow-sm md:col-span-1 md:w-auto md:justify-self-auto lg:w-12 lg:px-0"
          >
            {searchIcon}
            <span className="lg:hidden">Buscar</span>
          </Button>
        ) : !autoSearch ? (
          <Button
            type="submit"
            className="w-full md:col-span-2 md:w-auto md:justify-self-end lg:col-span-1 lg:w-auto lg:min-w-28"
          >
            {searchIcon}
            <span>Buscar</span>
          </Button>
        ) : null}
      </form>
    </section>
  );
}
