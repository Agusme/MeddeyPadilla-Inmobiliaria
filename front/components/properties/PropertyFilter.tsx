type PropertyFilterProps = {
  overlay?: boolean;
};

export default function PropertyFilter({
  overlay = false,
}: PropertyFilterProps) {
  return (
    <section
      className={
        overlay
          ? "mx-0 w-full max-w-7xl sm:w-17/20"
          : "border-y border-black/10 py-5"
      }
      aria-label="Filtros de propiedades"
    >
      <div
        className={
          overlay
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            : "grid gap-3 sm:grid-cols-2 lg:flex lg:items-center"
        }
      >
        <label
          className={
            overlay
              ? "flex h-16 w-full flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-8 text-sm font-semibold text-black shadow-lg"
              : "flex h-12 w-full max-w-md flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:px-5 lg:max-w-lg"
          }
        >
          <span className="sr-only">Propiedad</span>
          <select className="w-full bg-transparent text-sm text-black outline-none">
            <option>Propiedad</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
            <option>Local</option>
          </select>
        </label>
        <label
          className={
            overlay
              ? "flex h-16 w-full flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-8 text-sm font-semibold text-black shadow-lg"
              : "flex h-12 w-full max-w-md flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:px-5 lg:max-w-lg"
          }
        >
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
          className={`flex items-center justify-center rounded-md bg-[#B71C1C] text-white shadow-lg transition hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] ${overlay ? "h-16 w-16" : "h-12 w-14 justify-self-start"}`}
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
