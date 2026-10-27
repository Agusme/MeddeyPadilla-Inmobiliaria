"use client";

import { useState } from "react";
import { hasResidentialFeatures } from "@/lib/propertyTypes";

export type NewPropertyFeatures = {
  floors?: string | number;
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
  amenities?: string;
};

type Props = { propertyType: string; initial?: NewPropertyFeatures };

const groups = [
  { title: "Características generales", fields: [["balcony", "Balcón"], ["floors", "Plantas"], ["expenses", "Expensas"], ["serviceRoom", "Dependencia de servicio"], ["amenities", "Amenities"], ["furnished", "Amoblado"]] },
  { title: "Ambientes", fields: [["kitchen", "Cocina"], ["livingRoom", "Living"], ["diningRoom", "Comedor"], ["toilette", "Toilette"], ["laundryRoom", "Lavadero"]] },
  { title: "Espacios exteriores y comodidades", fields: [["backyard", "Fondo"], ["patio", "Patio"], ["grill", "Asador"], ["quincho", "Quincho"], ["pool", "Pileta"]] },
] as const;
const boolFields = ["balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished"] as const;
type BoolField = typeof boolFields[number];
const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";

export default function PropertyFeaturesFields({ propertyType, initial }: Props) {
  const [booleans, setBooleans] = useState<Partial<Record<BoolField, boolean>>>(() => Object.fromEntries(boolFields.filter((field) => initial?.[field] !== undefined).map((field) => [field, initial?.[field]])));
  const residential = hasResidentialFeatures(propertyType);
  const boolControl = (name: BoolField, label: string) => (
    <label key={name} className={`flex min-h-11 items-center gap-2.5 rounded-lg border border-black/10 px-3 text-sm text-[#171717] ${residential ? "" : "hidden"}`}>
      {booleans[name] !== undefined && <input type="hidden" name={name} value={String(booleans[name])} />}
      <input type="checkbox" checked={booleans[name] === true} onChange={(event) => setBooleans((current) => ({ ...current, [name]: event.target.checked }))} className="h-4 w-4 accent-[#B71C1C]" />
      {label}
    </label>
  );

  return <div className="mt-5 space-y-6">
    {groups.map((group) => <section key={group.title} aria-label={group.title} hidden={!residential && group.title !== "Características generales"}>
      <h3 className="text-sm font-semibold text-[#171717]">{group.title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.fields.map(([name, label]) => {
          if (name === "amenities") return <label key={name} className="sm:col-span-2 lg:col-span-3 text-sm font-medium text-[#171717]">{label}<textarea name="amenities" defaultValue={initial?.amenities ?? ""} rows={2} placeholder="Ej. Seguridad, SUM, gimnasio" className={`${inputClass} h-auto py-3`} /></label>;
          if (name === "floors" || name === "expenses") return <label key={name} className={`text-sm font-medium text-[#171717] ${residential ? "" : "hidden"}`}>{label}<input name={name} type="number" min={name === "floors" ? "1" : "0"} step={name === "floors" ? "1" : "any"} defaultValue={initial?.[name] ?? ""} className={inputClass} /></label>;
          return boolControl(name as BoolField, label);
        })}
      </div>
    </section>)}
  </div>;
}
