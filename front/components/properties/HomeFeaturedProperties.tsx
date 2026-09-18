"use client";

import { getFeaturedBasePropertyIds, getHiddenBasePropertyIds, getStoredAdminProperties, type AdminProperty } from "@/components/properties/adminPropertyStorage";
import PropertyCard, { type PropertyCardData } from "@/components/properties/PropertyCard";
import { useEffect, useState } from "react";

type HomeFeaturedPropertiesProps = {
  properties: PropertyCardData[];
};

export default function HomeFeaturedProperties({ properties }: HomeFeaturedPropertiesProps) {
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [adminProperties, setAdminProperties] = useState<AdminProperty[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setFeaturedIds(getFeaturedBasePropertyIds());
      setHiddenIds(getHiddenBasePropertyIds());
      setAdminProperties(getStoredAdminProperties());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const featuredProperties = properties.filter((property) => featuredIds.includes(property.slug) && !hiddenIds.includes(property.slug));
  const featuredAdminProperties: PropertyCardData[] = adminProperties
    .filter((property) => property.featured && property.status === "Publicada")
    .map((property) => ({
      title: property.title,
      location: [property.city, property.province].filter(Boolean).join(", "),
      type: property.propertyType,
      operation: property.operation,
      price: `${property.currency} ${Number(property.price).toLocaleString("es-AR")}`,
      image: "/image1.webp",
      slug: property.id,
      href: `/admin/propiedades/${property.id}`,
    }));
  const allFeaturedProperties = [...featuredProperties, ...featuredAdminProperties];

  if (!allFeaturedProperties.length) return <p className="text-sm text-black/60">No hay propiedades destacadas por el momento.</p>;

  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{allFeaturedProperties.map((property) => <PropertyCard key={property.slug} property={property} />)}</div>;
}
