export type AdminProperty = {
  id: string;
  title: string;
  operation: string;
  propertyType: string;
  price: string;
  currency: string;
  status: string;
  street: string;
  city: string;
  totalArea: string;
  coveredArea: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  description: string;
  imageCount: number;
  createdAt: string;
  featured?: boolean;
};

export const adminPropertiesStorageKey = "medde-padilla-admin-properties";
const featuredBasePropertiesStorageKey =
  "medde-padilla-featured-base-properties";
const hiddenBasePropertiesStorageKey = "medde-padilla-hidden-base-properties";
const defaultFeaturedBaseProperties = [
  "casa-con-jardin-y-piscina",
  "departamento-luminoso",
  "terreno-con-excelente-ubicacion",
];

export function getStoredAdminProperties(): AdminProperty[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(adminPropertiesStorageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function saveAdminProperty(property: AdminProperty) {
  window.localStorage.setItem(
    adminPropertiesStorageKey,
    JSON.stringify([property, ...getStoredAdminProperties()]),
  );
}

export function removeStoredAdminProperty(id: string) {
  window.localStorage.setItem(
    adminPropertiesStorageKey,
    JSON.stringify(
      getStoredAdminProperties().filter((property) => property.id !== id),
    ),
  );
}

export function updateStoredAdminProperty(property: AdminProperty) {
  window.localStorage.setItem(
    adminPropertiesStorageKey,
    JSON.stringify(
      getStoredAdminProperties().map((currentProperty) =>
        currentProperty.id === property.id ? property : currentProperty,
      ),
    ),
  );
}

export function setAdminPropertyFeatured(id: string, featured: boolean) {
  const property = getStoredAdminProperties().find((item) => item.id === id);
  if (!property || (featured && !canFeatureProperty(id))) return false;

  updateStoredAdminProperty({ ...property, featured });
  return true;
}

export function canFeatureProperty(excludeId?: string) {
  return (
    getFeaturedBasePropertyIds().length +
      getStoredAdminProperties().filter(
        (property) => property.featured && property.id !== excludeId,
      ).length <
    3
  );
}

export function getFeaturedBasePropertyIds() {
  if (typeof window === "undefined") return defaultFeaturedBaseProperties;
  try {
    const value = window.localStorage.getItem(featuredBasePropertiesStorageKey);
    return value ? JSON.parse(value) : defaultFeaturedBaseProperties;
  } catch {
    return defaultFeaturedBaseProperties;
  }
}

export function setBasePropertyFeatured(id: string, featured: boolean) {
  const currentIds: string[] = getFeaturedBasePropertyIds();
  const nextIds = featured
    ? [...new Set([...currentIds, id])]
    : currentIds.filter((currentId) => currentId !== id);
  window.localStorage.setItem(
    featuredBasePropertiesStorageKey,
    JSON.stringify(nextIds),
  );
}

export function getHiddenBasePropertyIds() {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(hiddenBasePropertiesStorageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function hideBaseProperty(id: string) {
  const ids = getHiddenBasePropertyIds();
  window.localStorage.setItem(
    hiddenBasePropertiesStorageKey,
    JSON.stringify([...new Set([...ids, id])]),
  );
  setBasePropertyFeatured(id, false);
}
