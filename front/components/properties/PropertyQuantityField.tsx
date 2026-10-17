"use client";

import { useId } from "react";

type Props = { name: string; label: string; value: string; onChange: (value: string) => void; invalid?: boolean };

export default function PropertyQuantityField({ name, label, value, onChange, invalid = false }: Props) {
  const id = useId();
  const number = Number(value || 0);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium leading-5 text-[#171717]">
        {label} <span className="font-normal text-black/45">(opcional)</span>
      </label>
      <div className={`mt-1.5 flex h-11 w-full max-w-48 overflow-hidden rounded-lg border bg-white focus-within:border-[#B71C1C] focus-within:ring-2 focus-within:ring-[#B71C1C]/15 ${invalid ? "border-red-600" : "border-black/15"}`}>
        <button type="button" aria-label={`Restar ${label.toLowerCase()}`} disabled={value === "" || number <= 0}
          onClick={() => onChange(String(Math.max(0, number - 1)))}
          className="w-11 shrink-0 text-lg hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C] disabled:opacity-30">−</button>
        <input id={id} name={name} type="number" min="0" step="1" inputMode="numeric" placeholder="—" value={value}
          aria-invalid={invalid} aria-describedby={invalid ? `error-${name}` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none min-w-0 flex-1 border-x border-black/10 bg-transparent px-1 text-center text-base outline-none sm:text-sm" />
        <button type="button" aria-label={`Sumar ${label.toLowerCase()}`} onClick={() => onChange(String(number + 1))}
          className="w-11 shrink-0 text-lg hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B71C1C]">+</button>
      </div>
    </div>
  );
}
