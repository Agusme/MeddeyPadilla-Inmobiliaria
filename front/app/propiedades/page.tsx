import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCard from "@/components/properties/PropertyCard";
import PageHero from "@/components/ui/PageHero";

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
    <div className="overflow-hidden bg-white">
      <PageHero title="Propiedades" />
      <div className="relative z-10 bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">
            Encontrá tu próximo lugar
          </p>
          <p className="mt-4 text-base leading-7 text-black/60">
            Explorá nuestra selección de propiedades y encontrá una opción que
            se adapte a tu próxima etapa.
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
            <PropertyCard key={property.title} property={property} />
          ))}
        </section>
        </div>
      </div>
    </div>
  );
}
