"use client";

import { useId } from "react";

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
      <select id={id} name={name} value={value}
        aria-invalid={invalid} aria-describedby={invalid ? `error-${name}` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1.5 h-11 min-w-0 w-full rounded-lg border bg-white px-3 text-base outline-none transition sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15 ${invalid ? "border-red-600" : "border-black/15"}`}>
        <option value="">{"\u2014"}</option>
        {quantityOptions.map((option) => <option key={option} value={option} disabled={Number(option) < min}>{option}</option>)}
        {hasExtraValue && <option value={value}>{value}</option>}
      </select>
    </div>
  );
}
