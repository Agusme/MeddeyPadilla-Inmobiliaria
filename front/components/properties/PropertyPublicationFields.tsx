"use client";

import { useEffect, useId, useState } from "react";
import { getAdminProperties } from "@/lib/api";

type Props = {
  published: boolean;
  onPublishedChange: (published: boolean) => void;
  defaultFeatured?: boolean;
  propertyId?: string;
  embedded?: boolean;
  title?: string;
  compact?: boolean;
};

export default function PropertyPublicationFields({ published, onPublishedChange, defaultFeatured = false, propertyId, embedded = false, title = "Visibilidad en la web", compact = false }: Props) {
  const [featured, setFeatured] = useState(defaultFeatured);
  const [featuredCount, setFeaturedCount] = useState<number | null>(null);
  const [capacityError, setCapacityError] = useState(false);
  const id = useId();
  const featuredDisabled = !published || (!featured && (featuredCount === null || featuredCount >= 3));

  useEffect(() => {
    let active = true;
    void getAdminProperties().then((properties) => {
      if (active) setFeaturedCount(properties.filter((property) => property._id !== propertyId && property.status === "published" && property.featured).length);
    }).catch(() => {
      if (active) setCapacityError(true);
    });
    return () => { active = false; };
  }, [propertyId]);

  return (
    <section className={embedded ? (compact ? "" : "mt-6") : "rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7"}>
      <h2 className={compact ? "text-xl font-semibold tracking-tight text-[#B71C1C]" : "text-xl font-semibold text-[#171717]"}>{title}</h2>
      <fieldset className={compact ? "mt-4" : "mt-5"}>
        <legend className="sr-only">Estado de publicación</legend>
        <div className={compact ? "grid gap-2 sm:max-w-xl sm:grid-cols-2" : "mt-3 grid gap-3 sm:grid-cols-2"}>
          {[
            { value: true, title: "Publicada", text: "Visible en la web" },
            { value: false, title: "Borrador", text: "Solo en administración" },
          ].map((option) => (
            <label key={String(option.value)} className={`flex cursor-pointer items-start gap-3 rounded-lg border ${compact ? "p-3 focus-within:ring-2 focus-within:ring-[#B71C1C]/20" : "p-4"} ${published === option.value ? "border-[#B71C1C] bg-[#B71C1C]/5" : "border-black/15"}`}>
              <input type="radio" name="status" value={option.value ? "published" : "draft"} checked={published === option.value}
                onChange={() => {
                  onPublishedChange(option.value);
                  if (!option.value) setFeatured(false);
                }} className="mt-1 h-4 w-4 shrink-0 accent-[#B71C1C]" />
              <span><span className="block text-sm font-semibold">{option.title}</span><span className="mt-1 block text-sm leading-6 text-black/60">{option.text}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      {(published || !compact) && <div className={compact ? "mt-4" : "mt-6 border-t border-black/10 pt-5"}>
        <label className={`group flex items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${featuredDisabled ? "cursor-not-allowed border-black/10 bg-black/[0.02]" : "cursor-pointer border-black/10 bg-white hover:border-[#B71C1C]/35 hover:bg-[#B71C1C]/[0.02]"} ${featured && published ? "border-[#B71C1C]/35 bg-[#B71C1C]/[0.03]" : ""}`}>
          <input type="checkbox" name="featured" checked={published && featured} disabled={featuredDisabled}
            onChange={(event) => setFeatured(event.target.checked)} aria-describedby={`${id}-featured-help`}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#B71C1C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B71C1C]" />
          <span className="min-w-0">
            <span className={`block text-sm font-medium leading-5 ${featuredDisabled ? "text-black/55" : "text-[#171717]"}`}>Destacar en el inicio</span>
            <span id={`${id}-featured-help`} className="mt-1 block text-xs leading-5 text-black/55">
              {!published ? "Publicá la propiedad para destacarla." : capacityError ? "No se pudo consultar el cupo. Recargá la página." : featuredCount === null ? "Consultando cupo…" : featuredCount >= 3 ? "Ya tenés 3 destacadas." : "Hasta 3 propiedades destacadas."}
            </span>
          </span>
        </label>
      </div>}
    </section>
  );
}
