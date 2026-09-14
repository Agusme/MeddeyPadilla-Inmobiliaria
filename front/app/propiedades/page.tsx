import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCard from "@/components/properties/PropertyCard";
import SectionHeading from "@/components/ui/SectionHeading";

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
      <div className="relative z-10 bg-[#f7f6f3] shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <header className="mb-9 sm:mb-10">
          <SectionHeading eyebrow="Encontrá tu próximo lugar" title="La propiedad indicada está más cerca." description="Explorá nuestra selección de propiedades y encontrá una opción que se adapte a tu próxima etapa." />
        </header>

        <PropertyFilter />

        <div className="py-8">
          <p className="text-sm text-black/55">3 propiedades encontradas</p>
        </div>

        <section
          id="listado-propiedades"
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
