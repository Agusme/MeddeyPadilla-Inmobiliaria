export const propertyTypeOptions = [
  { value: "Casa", label: "Casa", groupLabel: "Casas" },
  { value: "Departamento", label: "Departamento", groupLabel: "Departamentos" },
  { value: "Dúplex", label: "Dúplex", groupLabel: "Dúplex" },
  { value: "Monoambiente", label: "Monoambiente", groupLabel: "Monoambientes" },
  { value: "Oficina", label: "Oficina", groupLabel: "Oficinas" },
  { value: "Depósito", label: "Depósito", groupLabel: "Depósitos" },
  { value: "Galpón", label: "Galpón", groupLabel: "Galpones" },
  { value: "Fondo de comercio", label: "Fondo de comercio", groupLabel: "Fondos de comercio" },
  { value: "Cochera", label: "Cochera", groupLabel: "Cocheras" },
  { value: "Finca", label: "Finca", groupLabel: "Fincas" },
  { value: "Terreno", label: "Terreno", groupLabel: "Terrenos" },
  { value: "Local comercial", label: "Local comercial", groupLabel: "Locales comerciales" },
  { value: "PH", label: "PH", groupLabel: "PH" },
] as const;

export const propertyTypeGroupLabels = Object.fromEntries(
  propertyTypeOptions.map(({ value, groupLabel }) => [
    value.toLocaleLowerCase("es"),
    groupLabel,
  ]),
);

export const propertyTypeOrder = propertyTypeOptions.map(({ value }) =>
  value.toLocaleLowerCase("es"),
);

export type PropertyType = (typeof propertyTypeOptions)[number]["value"];
export type CompatiblePropertyType = PropertyType | "Propiedad";

export const propertyTypesWithResidentialFeatures = ["Propiedad", "Casa", "Departamento", "Dúplex", "Monoambiente", "Finca", "PH"] as const;
export function hasResidentialFeatures(propertyType: string) {
  return (propertyTypesWithResidentialFeatures as readonly string[]).includes(propertyType);
}
