import type { Property } from "@/components/properties/propertyData";
import { getPublicProperties, getPublicProperty, publicImageUrl, type ApiProperty, type PublicPropertyFilters } from "@/lib/api";
import { hasPositiveValue } from "@/lib/propertyVisibility";
import { formatPropertyPrice } from "@/lib/formatPrice";
import { formatExpenses, formatAmenities } from "@/lib/propertyAdditionalData";

export type PublicProperty = Pick<
  Property,
  "slug" | "title" | "location" | "type" | "operation" | "price" | "image"
> & {
  details?: string[];
  isStored?: boolean;
};

export type PublicPropertyDetail = PublicProperty &
  Pick<Property, "images" | "description" | "features" | "address"> & { comforts: string[]; amenities?: string };

function formatPrice(property: ApiProperty) {
  return formatPropertyPrice(property.price, property.currency);
}

export function toPublicProperty(property: ApiProperty): PublicPropertyDetail {
  const location = [property.street, property.city].filter(Boolean).join(", ");
  const features: PublicPropertyDetail["features"] = [];

  if (hasPositiveValue(property.bedrooms)) features.push({ label: "Dormitorios", value: property.bedrooms });
  if (hasPositiveValue(property.bathrooms)) features.push({ label: "Baños", value: property.bathrooms });
  if (hasPositiveValue(property.coveredArea)) features.push({ label: "Superficie cubierta", value: `${property.coveredArea} m²` });
  if (hasPositiveValue(property.totalArea)) features.push({ label: "Superficie total", value: `${property.totalArea} m²` });
  if (hasPositiveValue(property.parkingSpaces)) features.push({ label: "Cochera", value: property.parkingSpaces });
  if (hasPositiveValue(property.floors)) features.push({ label: "Plantas", value: property.floors });
  const expenses = formatExpenses(property);
  if (expenses !== undefined) features.push({ label: "Expensas", value: expenses });

  const comfortLabels: [keyof ApiProperty, string][] = [
    ["balcony", "Balcón"], ["serviceRoom", "Dependencia de servicio"], ["furnished", "Amoblado"],
    ["kitchen", "Cocina"], ["livingRoom", "Living"], ["diningRoom", "Comedor"], ["toilette", "Toilette"],
    ["laundryRoom", "Lavadero"], ["backyard", "Fondo"], ["patio", "Patio"], ["grill", "Asador"], ["quincho", "Quincho"], ["pool", "Pileta"],
  ];
  const comforts = comfortLabels.filter(([field]) => property[field] === true).map(([, label]) => label);

  const details = [
    hasPositiveValue(property.bedrooms) ? `${property.bedrooms} ${property.bedrooms === 1 ? "dormitorio" : "dormitorios"}` : undefined,
    hasPositiveValue(property.bathrooms) ? `${property.bathrooms} ${property.bathrooms === 1 ? "baño" : "baños"}` : undefined,
    hasPositiveValue(property.coveredArea) ? `${property.coveredArea} m²` : undefined,
  ].filter((detail): detail is string => Boolean(detail));

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
    features,
    comforts,
    amenities: formatAmenities(property),
    details,
  };
}

/**
 * Adaptador temporal de datos. Cuando exista el backend, estas funciones se
 * reemplazan por llamadas HTTP sin cambiar las páginas que las consumen.
 */
export async function listPublicProperties(
  filters: PublicPropertyFilters = {},
): Promise<PublicProperty[]> {
  return (await getPublicProperties(filters)).map(toPublicProperty);
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
