"use client";

import { useEffect, useId, useState } from "react";
import { getAdminProperties } from "@/lib/api";

type Props = {
  published: boolean;
  onPublishedChange: (published: boolean) => void;
  defaultFeatured?: boolean;
  propertyId?: string;
};

export default function PropertyPublicationFields({ published, onPublishedChange, defaultFeatured = false, propertyId }: Props) {
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
    <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-xl font-semibold text-[#171717]">Visibilidad en la web</h2>
      <fieldset className="mt-5">
        <legend className="sr-only">Estado de publicación</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { value: false, title: "Borrador", text: "Solo en administración" },
            { value: true, title: "Publicada", text: "Visible en la web" },
          ].map((option) => (
            <label key={String(option.value)} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${published === option.value ? "border-[#B71C1C] bg-[#B71C1C]/5" : "border-black/15"}`}>
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
      <div className="mt-6 border-t border-black/10 pt-5">
        <label className={`flex items-start gap-3 ${featuredDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
          <input type="checkbox" name="featured" checked={published && featured} disabled={featuredDisabled}
            onChange={(event) => setFeatured(event.target.checked)} aria-describedby={`${id}-featured-help`}
            className="mt-1 h-5 w-5 shrink-0 accent-[#B71C1C]" />
          <span><span className="block text-sm font-semibold">Destacar en el inicio</span>
            <span id={`${id}-featured-help`} className="mt-1 block text-sm leading-6 text-black/60">
              {!published ? "Publicá la propiedad para destacarla." : capacityError ? "No se pudo consultar el cupo. Recargá la página." : featuredCount === null ? "Consultando cupo…" : featuredCount >= 3 ? "Ya tenés 3 destacadas." : "Hasta 3 propiedades destacadas."}
            </span>
          </span>
        </label>
      </div>
    </section>
  );
}
