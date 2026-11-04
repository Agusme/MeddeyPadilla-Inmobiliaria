// Legacy types remain supported without migrating stored documents.
export const propertyTypes = [
  "Casa", "Departamento", "Dúplex", "Monoambiente", "Oficina",
  "Depósito", "Galpón", "Fondo de comercio", "Cochera", "Finca",
  "Terreno", "Local comercial", "PH",
] as const;
export type PropertyType = (typeof propertyTypes)[number];
export type CompatiblePropertyType = PropertyType | "Propiedad" | "Local";
export const validPropertyTypes: readonly string[] = [...propertyTypes, "Propiedad", "Local"];
export const legacyPropertyTypeAliases: Readonly<Record<string, string>> = { Local: "Local comercial" };
