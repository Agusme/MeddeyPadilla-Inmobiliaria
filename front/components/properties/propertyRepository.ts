import {
  getHiddenBasePropertyIds,
  getStoredAdminProperties,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import {
  properties as baseProperties,
  propertyBySlug as basePropertyBySlug,
  type Property,
} from "@/components/properties/propertyData";

export type PublicProperty = Pick<
  Property,
  "slug" | "title" | "location" | "type" | "operation" | "price" | "image"
> & {
  isStored?: boolean;
};

export type PublicPropertyDetail = PublicProperty &
  Pick<Property, "images" | "description" | "features" | "address">;

function formatPrice(property: AdminProperty) {
  return `${property.currency} ${Number(property.price).toLocaleString("es-AR")}`;
}

function toPublicProperty(property: AdminProperty): PublicPropertyDetail {
  const location = [property.street, property.city].filter(Boolean).join(", ");

  return {
    slug: property.id,
    title: property.title,
    location: location || "Sin ubicación",
    type: property.propertyType,
    operation: property.operation,
    price: formatPrice(property),
    image: "/image1.webp",
    images: ["/image1.webp"],
    description: property.description,
    address: location || "Sin ubicación",
    features: [
      { label: "Dormitorios", value: property.bedrooms || "—" },
      { label: "Baños", value: property.bathrooms || "—" },
      {
        label: "Superficie cubierta",
        value: property.coveredArea ? `${property.coveredArea} m²` : "—",
      },
      {
        label: "Superficie total",
        value: property.totalArea ? `${property.totalArea} m²` : "—",
      },
      { label: "Cochera", value: property.parkingSpaces || "—" },
    ],
    isStored: true,
  };
}

/**
 * Adaptador temporal de datos. Cuando exista el backend, estas funciones se
 * reemplazan por llamadas HTTP sin cambiar las páginas que las consumen.
 */
export function listPublicProperties(): PublicProperty[] {
  const hiddenBaseIds = getHiddenBasePropertyIds();
  const publishedStoredProperties = getStoredAdminProperties()
    .filter((property) => property.status === "Publicada")
    .map(toPublicProperty);

  return [
    ...baseProperties.filter((property) => !hiddenBaseIds.includes(property.slug)),
    ...publishedStoredProperties,
  ];
}

export function getPublicPropertyBySlug(
  slug: string,
): PublicPropertyDetail | undefined {
  const baseProperty = basePropertyBySlug[slug];
  if (baseProperty && !getHiddenBasePropertyIds().includes(slug)) {
    return baseProperty;
  }

  const storedProperty = getStoredAdminProperties().find(
    (property) => property.id === slug && property.status === "Publicada",
  );

  return storedProperty ? toPublicProperty(storedProperty) : undefined;
}
