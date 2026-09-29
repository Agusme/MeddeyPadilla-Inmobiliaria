"use client";

import PropertyCard, {
  type PropertyCardData,
} from "@/components/properties/PropertyCard";
import { adminPropertyStorageChangeEvent } from "@/components/properties/adminPropertyStorage";
import { getPublicProperties, publicImageUrl, type ApiProperty } from "@/lib/api";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function toFeaturedCard(property: ApiProperty): PropertyCardData {
  return {
    title: property.title,
    location: [property.street, property.city].filter(Boolean).join(", ") || "Sin ubicación",
    type: property.propertyType,
    operation: property.operation,
    price: `${property.currency} ${Number(property.price).toLocaleString("es-AR")}`,
    image: publicImageUrl(property.images[0]?.url),
    slug: property.slug,
  };
}

export default function HomeFeaturedProperties() {
  const pathname = usePathname();
  const [featuredProperties, setFeaturedProperties] = useState<PropertyCardData[]>([]);

  useEffect(() => {
    let isActive = true;

    const refreshProperties = () => {
      void getPublicProperties()
        .then((properties) => {
          if (isActive) {
            setFeaturedProperties(
              properties.filter((property) => property.featured).map(toFeaturedCard),
            );
          }
        })
        .catch(() => {
          if (isActive) setFeaturedProperties([]);
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

  if (!featuredProperties.length)
    return (
      <p className="text-sm text-black/60">
        No hay propiedades destacadas por el momento.
      </p>
    );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredProperties.map((property) => (
        <PropertyCard key={property.slug} property={property} />
      ))}
    </div>
  );
}
