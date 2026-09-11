type PropertyFilterProps = {
  overlay?: boolean;
};

export default function PropertyFilter({
  overlay = false,
}: PropertyFilterProps) {
  return (
    <section
      className={overlay ? "mx-0 max-w-5xl" : "border-y border-black/10 py-5"}
      aria-label="Filtros de propiedades"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
        <label className="flex h-12 flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:h-16 sm:px-5">
          <span className="sr-only">Propiedad</span>
          <select className="w-full bg-transparent text-sm text-black outline-none">
            <option>Propiedad</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
            <option>Local</option>
          </select>
        </label>
        <label className="flex h-12 flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:h-16 sm:px-5">
          <span className="sr-only">Tipo de operación</span>
          <select className="w-full bg-transparent text-sm text-black outline-none">
            <option>Tipo de operación</option>
            <option>Venta</option>
            <option>Alquiler</option>
          </select>
        </label>
        <button
          type="button"
          aria-label="Buscar propiedades"
          className="flex h-12 items-center justify-center rounded-md bg-[#B71C1C] px-6 text-white shadow-sm transition hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] sm:col-span-2 sm:h-14 lg:col-span-1 lg:h-16 lg:w-16"
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
      </div>
    </section>
  );
}
