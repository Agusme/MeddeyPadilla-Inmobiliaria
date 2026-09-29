"use client";


import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilter from "@/components/properties/PropertyFilter";
import {
  listPublicProperties,
  type PublicProperty,
} from "@/components/properties/propertyRepository";
import SectionHeading from "@/components/ui/SectionHeading";
import { useEffect, useState } from "react";

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);

  useEffect(() => {
    void listPublicProperties().then(setProperties).catch(() => setProperties([]));
  }, []);

  return (
    <div className="overflow-hidden bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
          <header className="mb-10">
            <SectionHeading
              eyebrow="Encontrá tu próximo lugar"
              title="La propiedad indicada está más cerca."
            />
          </header>
          <div className="max-w-4xl">
            <PropertyFilter />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:px-8 lg:px-12">
          <div className="pb-6">
            <p className="text-sm text-black/55">
              {properties.length} propiedades encontradas
            </p>
          </div>
          <section
            id="listado-propiedades"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Listado de propiedades"
          >
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </section>
        </div>
      </section>
    </div>
  );
}
