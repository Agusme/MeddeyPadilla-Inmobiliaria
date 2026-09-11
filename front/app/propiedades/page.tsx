import Image from "next/image";
import PropertyFilter from "@/components/properties/PropertyFilter";

const properties = [
  {
    title: "Casa con jardín y piscina",
    location: "Yerba Buena, Tucumán",
    type: "Casa",
    operation: "Venta",
    price: "USD 185.000",
    image: "/home/homehero.jpg",
  },
  {
    title: "Departamento luminoso",
    location: "San Miguel de Tucumán",
    type: "Departamento",
    operation: "Alquiler",
    price: "$ 650.000 / mes",
    image: "/home/hom.jpg",
  },
  {
    title: "Terreno con excelente ubicación",
    location: "Lomas de Tafí, Tucumán",
    type: "Terreno",
    operation: "Venta",
    price: "USD 72.000",
    image: "/home/herohomee.jpg",
  },
];

export default function PropiedadesPage() {
  return (
    <div className="mx-auto max-w-7xl py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">
          Encontrá tu próximo lugar
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
          Propiedades
        </h1>
        <p className="mt-4 text-base leading-7 text-black/60">
          Explorá nuestra selección de propiedades y encontrá una opción que se
          adapte a tu próxima etapa.
        </p>
      </header>

      <PropertyFilter />

      <div className="flex items-center justify-between py-8">
        <p className="text-sm text-black/55">3 propiedades encontradas</p>
        <select className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#B71C1C]">
          <option>Más recientes</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
        </select>
      </div>

      <section
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Listado de propiedades"
      >
        {properties.map((property) => (
          <article
            key={property.title}
            className="overflow-hidden border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-4/3 bg-black/5">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <span className="absolute left-4 top-4 bg-[#B71C1C] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {property.operation}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B71C1C]">
                  {property.type}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-black">
                  {property.title}
                </h2>
                <p className="mt-1 text-sm text-black/55">
                  {property.location}
                </p>
              </div>
              <p className="text-lg font-semibold text-black">
                {property.price}
              </p>
              <button
                type="button"
                className="w-full rounded-full border border-[#B71C1C] px-4 py-2.5 text-sm font-semibold text-[#B71C1C] transition hover:bg-[#B71C1C] hover:text-white"
              >
                Ver propiedad
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
