"use client";

import { useEffect, useRef } from "react";

type PropertyFilterProps = {
  overlay?: boolean;
};

export default function PropertyFilter({
  overlay = false,
}: PropertyFilterProps) {
  const typeSelect = useRef<HTMLSelectElement>(null);
  const operationSelect = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (typeSelect.current) typeSelect.current.value = params.get("type") ?? "";
    if (operationSelect.current) {
      operationSelect.current.value = params.get("operation") ?? "";
    }
  }, []);

  return (
    <section
      className={
        overlay
          ? "mx-0 w-full max-w-7xl sm:w-17/20"
          : "rounded-2xl border border-white/25 bg-gradient-to-br from-[#C52A2A] via-[#A91E1E] to-[#791717] p-4 shadow-[0_18px_38px_-22px_rgba(0,0,0,0.38)] ring-1 ring-black/5 sm:p-5"
      }
      aria-label="Filtros de propiedades"
    >
      <form
        action="/propiedades#listado-propiedades"
        method="get"
        className={
          overlay
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center"
        }
      >
        <label
          className={
            overlay
              ? "flex h-12 w-full flex-col justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-semibold text-black shadow-lg"
              : "flex h-12 w-full flex-col justify-center gap-1 rounded-lg border border-white/80 bg-white px-3 text-sm font-semibold text-black shadow-[0_4px_12px_-8px_rgba(0,0,0,0.35)] transition-colors focus-within:border-white sm:px-5"
          }
        >
          <span className="sr-only">Propiedad</span>
          <select
            ref={typeSelect}
            name="type"
            defaultValue=""
            className="w-full cursor-pointer bg-transparent text-sm text-black outline-none"
          >
            <option value="" disabled>Propiedad</option>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Local">Local</option>
          </select>
        </label>
        <label
          className={
            overlay
              ? "flex h-12 w-full flex-col justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-semibold text-black shadow-lg"
              : "flex h-12 w-full flex-col justify-center gap-1 rounded-lg border border-white/80 bg-white px-3 text-sm font-semibold text-black shadow-[0_4px_12px_-8px_rgba(0,0,0,0.35)] transition-colors focus-within:border-white sm:px-5"
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
        <button
          type="submit"
          aria-label="Buscar propiedades"
          className={`flex items-center justify-center rounded-md shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] ${overlay ? "h-12 w-full bg-[#B71C1C] text-white shadow-[#B71C1C]/25 hover:bg-[#8F1616] sm:w-12" : "h-12 w-full border border-white/80 bg-white text-[#B71C1C] shadow-md hover:bg-[#fff7f7] sm:w-14 sm:justify-self-start lg:justify-self-end"}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </button>
      </form>
    </section>
  );
}
