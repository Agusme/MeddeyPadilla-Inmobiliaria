"use client";

import { useId } from "react";
import Select from "@/components/ui/Select";
import { propertyTypeOptions } from "@/lib/propertyTypes";

type Props = { value: string; onChange: (value: string) => void; allowLegacy?: boolean; name?: string; variant?: "admin" | "public" | "hero"; clearable?: boolean };

export default function PropertyTypeSelect({ value, onChange, allowLegacy = false, name = "propertyType", variant = "admin", clearable = false }: Props) {
  const id = useId();
  return <div className="min-w-0">
    {variant === "admin" && <label htmlFor={id} className="block text-sm font-medium leading-5 text-[#171717]">Tipo de propiedad <span className="text-[#B71C1C]" aria-label="obligatorio">*</span></label>}
    <Select id={id} name={name} label="Tipo de propiedad" placeholder="Tipo de propiedad" value={value} onChange={onChange} variant={variant} required={variant === "admin"} searchable clearable={clearable}
      options={[...(allowLegacy ? [{ value: "Propiedad", label: "Propiedad (tipo anterior)" }] : []), ...propertyTypeOptions]} />
  </div>;
}
