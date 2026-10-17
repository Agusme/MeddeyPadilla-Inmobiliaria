"use client";

import { FormEvent, useEffect, useRef } from "react";
import { propertyTypeOptions } from "@/lib/propertyTypes";
import Button from "@/components/ui/Button";

type PropertyFilterProps = {
  overlay?: boolean;
  onSearch?: (filters: { type?: string; operation?: string }) => void;
};

export default function PropertyFilter({
  overlay = false,
  onSearch,
}: PropertyFilterProps) {
  const typeSelect = useRef<HTMLSelectElement>(null);
  const operationSelect = useRef<HTMLSelectElement>(null);
  const searchIcon = (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (typeSelect.current) typeSelect.current.value = params.get("type") ?? "";
    if (operationSelect.current) {
      operationSelect.current.value = params.get("operation") ?? "";
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onSearch) return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSearch({
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
            ? "grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-3"
            : "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-1"
        }
      >
        <label
          className={
            overlay
              ? "flex h-12 w-full flex-col justify-center rounded-[11px] border border-black/10 bg-white px-4 text-sm font-normal text-black shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#B71C1C]/50"
              : "flex h-11 w-full items-center rounded-lg px-3 text-sm font-normal text-[#171717] transition-colors focus-within:bg-black/[0.02] focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#B71C1C]/35 sm:px-4 lg:rounded-none lg:border-r lg:border-black/10"
          }
        >
          <span className="sr-only">Tipo de propiedad</span>
          <select
            ref={typeSelect}
            name="type"
            defaultValue=""
            className="w-full cursor-pointer bg-transparent text-sm text-black outline-none"
          >
            <option value="" disabled>Tipo de propiedad</option>
            {propertyTypeOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label
          className={
            overlay
              ? "flex h-12 w-full flex-col justify-center rounded-[11px] border border-black/10 bg-white px-4 text-sm font-normal text-black shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#B71C1C]/50"
              : "flex h-11 w-full items-center rounded-lg px-3 text-sm font-normal text-[#171717] transition-colors focus-within:bg-black/[0.02] focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#B71C1C]/35 sm:px-4 lg:rounded-none"
          }
        >
          <span className="sr-only">Tipo de operación</span>
          <select
            ref={operationSelect}
            name="operation"
            defaultValue=""
            className="w-full cursor-pointer bg-transparent text-sm text-black outline-none"
          >
            <option value="" disabled>Tipo de operación</option>
            <option value="Venta">Venta</option>
            <option value="Alquiler">Alquiler</option>
          </select>
        </label>
        {overlay ? (
          <Button
            type="submit"
            size="lg"
            aria-label="Buscar propiedades"
            className="h-12 w-full shadow-sm md:col-span-1 md:w-auto md:justify-self-auto lg:w-12 lg:px-0"
          >
            {searchIcon}
            <span className="lg:hidden">Buscar</span>
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full md:col-span-2 md:w-auto md:justify-self-end lg:col-span-1 lg:w-auto lg:min-w-28"
          >
            {searchIcon}
            <span>Buscar</span>
          </Button>
        )}
      </form>
    </section>
  );
}
