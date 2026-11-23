export const propertyTypeOptions = [
  { value: "Casa", label: "Casa" },
  { value: "Departamento", label: "Departamento" },
  { value: "Dúplex", label: "Dúplex" },
  { value: "Monoambiente", label: "Monoambiente" },
  { value: "Oficina", label: "Oficina" },
  { value: "Depósito", label: "Depósito" },
  { value: "Galpón", label: "Galpón" },
  { value: "Fondo de comercio", label: "Fondo de comercio" },
  { value: "Cochera", label: "Cochera" },
  { value: "Finca", label: "Finca" },
  { value: "Terreno", label: "Terreno" },
  { value: "Local comercial", label: "Local comercial" },
  { value: "PH", label: "PH" },
] as const;

export type PropertyType = (typeof propertyTypeOptions)[number]["value"];
export type CompatiblePropertyType = PropertyType | "Propiedad";

export const propertyTypesWithResidentialFeatures = ["Propiedad", "Casa", "Departamento", "Dúplex", "Monoambiente", "Finca", "PH"] as const;
export function hasResidentialFeatures(propertyType: string) {
  return (propertyTypesWithResidentialFeatures as readonly string[]).includes(propertyType);
}
