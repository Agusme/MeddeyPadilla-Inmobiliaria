import type { Property } from "@/components/properties/propertyData";
import { getPublicProperties, getPublicProperty, publicImageUrl, type ApiProperty } from "@/lib/api";

export type PublicProperty = Pick<
  Property,
  "slug" | "title" | "location" | "type" | "operation" | "price" | "image"
> & {
  isStored?: boolean;
};

export type PublicPropertyDetail = PublicProperty &
  Pick<Property, "images" | "description" | "features" | "address">;

function formatPrice(property: ApiProperty) {
  return `${property.currency} ${Number(property.price).toLocaleString("es-AR")}`;
}

function toPublicProperty(property: ApiProperty): PublicPropertyDetail {
  const location = [property.street, property.city].filter(Boolean).join(", ");

  return {
    slug: property.slug,
    title: property.title,
    location: location || "Sin ubicación",
    type: property.propertyType,
    operation: property.operation,
    price: formatPrice(property),
    image: publicImageUrl(property.images[0]?.url),
    images: property.images.length ? property.images.map((image) => publicImageUrl(image.url)) : ["/image1.webp"],
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
  };
}

/**
 * Adaptador temporal de datos. Cuando exista el backend, estas funciones se
 * reemplazan por llamadas HTTP sin cambiar las páginas que las consumen.
 */
export async function listPublicProperties(): Promise<PublicProperty[]> {
  return (await getPublicProperties()).map(toPublicProperty);
}

export async function getPublicPropertyBySlug(
  slug: string,
): Promise<PublicPropertyDetail | undefined> {
  try {
    return toPublicProperty(await getPublicProperty(slug));
  } catch {
    return undefined;
  }
}
