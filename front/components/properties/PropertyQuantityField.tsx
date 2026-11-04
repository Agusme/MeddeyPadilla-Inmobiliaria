"use client";

import { useId } from "react";
import Select from "@/components/ui/Select";

type Props = { name: string; label: string; value: string; onChange: (value: string) => void; invalid?: boolean; min?: number };

const quantityOptions = Array.from({ length: 11 }, (_, value) => String(value));

export default function PropertyQuantityField({ name, label, value, onChange, invalid = false, min = 0 }: Props) {
  const id = useId();
  const hasExtraValue = value !== "" && !quantityOptions.includes(value);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium leading-5 text-[#171717]">
        {label} <span className="sr-only">(opcional)</span>
      </label>
      <Select id={id} name={name} label={label} value={value} onChange={onChange} placeholder="Elegir" clearable
        invalid={invalid} describedBy={invalid ? `error-${name}` : undefined}
        options={[
          ...quantityOptions.map(option => ({ value: option, label: option, disabled: Number(option) < min })),
          ...(hasExtraValue ? [{ value, label: value }] : []),
        ]} />
    </div>
  );
}
