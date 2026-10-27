"use client";

import { useState, type ReactNode } from "react";
import PropertyFormAccordion from "@/components/properties/PropertyFormAccordion";
import { hasResidentialFeatures } from "@/lib/propertyTypes";
import { resolveHasExpenses, resolveHasAmenities } from "@/lib/propertyAdditionalData";
import PropertyQuantityField from "@/components/properties/PropertyQuantityField";

export type NewPropertyFeatures = {
  totalArea?: string | number;
  coveredArea?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  parkingSpaces?: string | number;
  floors?: string | number;
  hasExpenses?: boolean;
  expenses?: string | number;
  balcony?: boolean;
  serviceRoom?: boolean;
  backyard?: boolean;
  patio?: boolean;
  laundryRoom?: boolean;
  grill?: boolean;
  quincho?: boolean;
  pool?: boolean;
  kitchen?: boolean;
  livingRoom?: boolean;
  diningRoom?: boolean;
  toilette?: boolean;
  furnished?: boolean;
  hasAmenities?: boolean;
  amenities?: string;
};

type Props = { propertyType: string; initial?: NewPropertyFeatures; children?: ReactNode };

const groups = [
  { title: "Ambientes", fields: [["kitchen", "Cocina"], ["livingRoom", "Living"], ["diningRoom", "Comedor"], ["toilette", "Toilette"], ["laundryRoom", "Lavadero"]] },
  { title: "Espacios exteriores y comodidades", fields: [["balcony", "Balcón"], ["backyard", "Fondo"], ["patio", "Patio"], ["grill", "Asador"], ["quincho", "Quincho"], ["pool", "Pileta"], ["furnished", "Amoblado"], ["serviceRoom", "Dependencia de servicio"]] },
] as const;
const boolFields = ["balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished"] as const;
type BoolField = typeof boolFields[number];
const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";

export default function PropertyFeaturesFields({ propertyType, initial, children }: Props) {
  const [booleans, setBooleans] = useState<Partial<Record<BoolField, boolean>>>(() => Object.fromEntries(boolFields.filter((field) => initial?.[field] !== undefined).map((field) => [field, initial?.[field]])));
  const residential = hasResidentialFeatures(propertyType);
  const [hasExpenses, setHasExpenses] = useState(() => resolveHasExpenses(initial ?? {}) ?? false);
  const [hasAmenities, setHasAmenities] = useState(() => resolveHasAmenities(initial ?? {}) ?? false);
  const [expenses, setExpenses] = useState(() => String(initial?.expenses ?? ""));
  const [amenities, setAmenities] = useState(initial?.amenities ?? "");
  const [floors, setFloors] = useState(() => String(initial?.floors ?? ""));
  const boolControl = (name: BoolField, label: string) => (
    <label key={name} className={`flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-[#171717] lg:min-h-10 ${residential ? "" : "hidden"}`}>
      {booleans[name] !== undefined && <input type="hidden" name={name} value={String(booleans[name])} />}
      <input type="checkbox" checked={booleans[name] === true} onChange={(event) => setBooleans((current) => ({ ...current, [name]: event.target.checked }))} className="h-4 w-4 shrink-0 accent-[#B71C1C]" />
      {label}
    </label>
  );

  return <div className="divide-y divide-black/10">
    <PropertyFormAccordion title="Superficies y cantidades" defaultOpen={Boolean(initial && [initial.totalArea, initial.coveredArea, ...(residential ? [initial.bedrooms, initial.floors] : []), ...(propertyType !== "Terreno" ? [initial.bathrooms, initial.parkingSpaces] : [])].some((value) => value !== undefined && value !== ""))}>
      <div className="grid grid-cols-2 items-end gap-x-4 gap-y-3 sm:grid-cols-3 xl:grid-cols-6">
        {children}
        <div className={residential ? "min-w-0" : "hidden"}>
          <PropertyQuantityField name="floors" label="Plantas" value={floors} onChange={setFloors} min={1} />
        </div>
      </div>
    </PropertyFormAccordion>
    <PropertyFormAccordion title="Ambientes y comodidades" defaultOpen={Boolean(residential && initial && boolFields.some((field) => initial[field] === true))}>
      <div className="space-y-3">
    {groups.map((group) => <section key={group.title} aria-label={group.title} hidden={!residential} className="border-t border-black/10 pt-3">
      <h3 className="text-sm font-semibold text-[#171717]">{group.title}</h3>
      <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {group.fields.map(([name, label]) => boolControl(name, label))}
      </div>
    </section>)}
      </div>
    </PropertyFormAccordion>
    <PropertyFormAccordion title="Expensas y amenities" defaultOpen={Boolean(initial && ((residential && resolveHasExpenses(initial) === true) || resolveHasAmenities(initial) === true))}>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <fieldset className={`w-full min-w-0 max-w-full lg:w-auto ${residential ? "" : "hidden"}`}>
          <legend className="text-sm font-medium text-[#171717]">Expensas</legend>
          <div className="flex flex-wrap items-start gap-x-2">
            <div className="w-30 shrink-0">
            <select aria-label="Expensas" name="hasExpenses" value={String(hasExpenses)} onChange={(event) => setHasExpenses(event.target.value === "true")} className={inputClass}>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
            </div>
          {hasExpenses === true ? (
            <div className="w-40 max-w-full">
              <input aria-label="Monto (ARS)" placeholder="Monto (ARS)" name="expenses" type="number" min="0" step="any" value={expenses} onChange={(event) => setExpenses(event.target.value)} className={inputClass} />
            </div>
          ) : <input type="hidden" name="expenses" value="" />}
          </div>
        </fieldset>
        <fieldset className="w-full min-w-0 max-w-full lg:w-auto">
          <legend className="text-sm font-medium text-[#171717]">Amenities</legend>
          <div className="flex flex-wrap items-start gap-x-2">
            <div className="w-30 shrink-0">
            <select aria-label="Amenities" name="hasAmenities" value={String(hasAmenities)} onChange={(event) => setHasAmenities(event.target.value === "true")} className={inputClass}>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
            </div>
          {hasAmenities === true ? (
            <div className="w-64 max-w-full">
              <input aria-label="Detalle de amenities" name="amenities" type="text" value={amenities} onChange={(event) => setAmenities(event.target.value)} placeholder="Ej. Seguridad, SUM, gimnasio" className={inputClass} />
            </div>
          ) : <input type="hidden" name="amenities" value="" />}
          </div>
        </fieldset>
      </div>
    </PropertyFormAccordion>
  </div>;
}
