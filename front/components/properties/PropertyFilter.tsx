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
          : "rounded-2xl border border-[#8F1616] bg-[#B71C1C] p-4 shadow-[0_22px_50px_-20px_rgba(0,0,0,0.45)] sm:p-5"
      }
      aria-label="Filtros de propiedades"
    >
      <div
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
              : "flex h-12 w-full flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:px-5"
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
              ? "flex h-12 w-full flex-col justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-semibold text-black shadow-lg"
              : "flex h-12 w-full flex-col justify-center gap-1 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-black shadow-sm sm:px-5"
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
          className={`flex items-center justify-center rounded-md shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] ${overlay ? "h-12 w-full bg-[#B71C1C] text-white shadow-[#B71C1C]/25 hover:bg-[#8F1616] sm:w-12" : "h-12 w-full border border-black/10 bg-white text-[#B71C1C] shadow-black/15 hover:bg-[#f3d5d5] sm:w-14 sm:justify-self-start lg:justify-self-end"}`}
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
