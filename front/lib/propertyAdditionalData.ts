type AdditionalData = {
  hasExpenses?: boolean;
  expenses?: string | number;
  hasAmenities?: boolean;
  amenities?: string;
};

export function resolveHasExpenses(property: AdditionalData): boolean | undefined {
  if (property.hasExpenses !== undefined) return property.hasExpenses;
  return property.expenses !== undefined && property.expenses !== "" ? true : undefined;
}

export function resolveHasAmenities(property: AdditionalData): boolean | undefined {
  if (property.hasAmenities !== undefined) return property.hasAmenities;
  return property.amenities?.trim() ? true : undefined;
}

export function formatExpenses(property: AdditionalData): string | undefined {
  const hasExpenses = resolveHasExpenses(property);
  if (hasExpenses === undefined) return undefined;
  if (!hasExpenses) return "No";
  if (property.expenses === undefined || property.expenses === "") return "Sí";
  return new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(Number(property.expenses));
}

export function formatAmenities(property: AdditionalData): string | undefined {
  return resolveHasAmenities(property) === true ? property.amenities?.trim() || "Sí" : undefined;
}
