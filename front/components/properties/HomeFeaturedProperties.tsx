"use client";

import PropertyCard, {
  type PropertyCardData,
} from "@/components/properties/PropertyCard";
import { adminPropertyStorageChangeEvent } from "@/components/properties/adminPropertyStorage";
import { getPublicProperties, publicImageUrl, type ApiProperty } from "@/lib/api";
import { hasPositiveValue } from "@/lib/propertyVisibility";
import { formatPropertyPrice } from "@/lib/formatPrice";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function toFeaturedCard(property: ApiProperty): PropertyCardData {
  return {
    title: property.title,
    location: [property.street, property.city].filter(Boolean).join(", ") || "Sin ubicación",
    type: property.propertyType,
    operation: property.operation,
    price: formatPropertyPrice(property.price, property.currency),
    image: publicImageUrl(property.images[0]?.url),
    slug: property.slug,
    details: [
      hasPositiveValue(property.bedrooms) ? `${property.bedrooms} ${property.bedrooms === 1 ? "dormitorio" : "dormitorios"}` : undefined,
      hasPositiveValue(property.bathrooms) ? `${property.bathrooms} ${property.bathrooms === 1 ? "baño" : "baños"}` : undefined,
      hasPositiveValue(property.coveredArea) ? `${property.coveredArea} m²` : undefined,
    ].filter((detail): detail is string => Boolean(detail)),
  };
}

export default function HomeFeaturedProperties() {
  const pathname = usePathname();
  const [featuredProperties, setFeaturedProperties] = useState<PropertyCardData[] | null>(null);

  useEffect(() => {
    let isActive = true;
    let latestRequest = 0;

    const refreshProperties = () => {
      const request = ++latestRequest;
      void getPublicProperties()
        .then((properties) => {
          if (isActive && request === latestRequest) {
            setFeaturedProperties(
              properties.filter((property) => property.featured).map(toFeaturedCard),
            );
          }
        })
        .catch(() => {
          if (isActive && request === latestRequest) setFeaturedProperties([]);
        });
    };

    refreshProperties();
    window.addEventListener(adminPropertyStorageChangeEvent, refreshProperties);
    window.addEventListener("storage", refreshProperties);

    return () => {
      isActive = false;
      window.removeEventListener(adminPropertyStorageChangeEvent, refreshProperties);
      window.removeEventListener("storage", refreshProperties);
    };
  }, [pathname]);

  if (!featuredProperties?.length) return null;

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-8 md:px-8 sm:py-14 md:py-10 lg:py-14 lg:px-12 max-md:pt-10! max-md:pb-8!"
      aria-labelledby="featured-properties-title"
    >
      <div className="mb-8 flex flex-col items-start gap-5 md:mb-6 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="featured-properties-title"
            className="text-2xl font-medium tracking-tight text-black sm:text-3xl"
          >
            Propiedades destacadas
          </h2>
        </div>
        <Link
          href="/propiedades#listado-propiedades"
          className="inline-flex shrink-0 self-end items-center gap-2 text-sm font-medium tracking-wide text-black/70 transition-colors duration-250 hover:text-[#B71C1C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
        >
          Ver todas
          <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
      <div className="grid w-full max-w-[69rem] grid-cols-1 gap-5 md:w-[96%] md:grid-cols-2 md:gap-6 lg:w-full lg:grid-cols-3">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
    </section>
  );
}
