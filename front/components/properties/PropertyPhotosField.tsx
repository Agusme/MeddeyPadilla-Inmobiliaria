"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus } from "lucide-react";
import ImageOrderList from "./ImageOrderList";
import { removePropertyPhoto } from "@/lib/propertyPhotos";

export default function PropertyPhotosField({ files, imageOrder, existingImages = [], onChange }: {
  files: File[];
  imageOrder: string[];
  existingImages?: string[];
  onChange: (files: File[], order: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const hasPhotos = imageOrder.length > 0;
  const atLimit = imageOrder.length >= 12;

  function clearError() {
    setError("");
    inputRef.current?.setCustomValidity("");
  }

  function removePhoto(key: string) {
    const next = removePropertyPhoto(files, imageOrder, key);
    onChange(next.files, next.imageOrder);
    clearError();
  }

  return (
    <section className={`min-w-0 lg:row-span-3 ${hasPhotos ? "rounded-2xl border border-black/10 bg-[#fcfcfc] p-3" : ""}`} aria-label="Fotografías">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5">
        <h3 className="text-sm font-semibold leading-5 text-[#171717]">Fotografías</h3>
      <label className={`flex rounded-lg border text-sm transition focus-within:ring-2 focus-within:ring-[#B71C1C]/30 ${hasPhotos ? "col-start-2 row-start-1 min-h-11 w-fit items-center gap-1.5 whitespace-nowrap px-2.5 py-2 sm:gap-2 sm:px-3" : "col-span-2 min-h-36 flex-col items-center justify-center border-dashed px-4 py-3 text-center"} ${atLimit ? "cursor-not-allowed border-black/10 bg-black/5 text-black/40" : error ? "cursor-pointer border-red-600 bg-red-50" : "cursor-pointer border-black/30 bg-[#f7f7f7] hover:border-black/45 hover:bg-black/5"}`}>
        {hasPhotos ? <Plus aria-hidden="true" className="h-4 w-4" /> : (
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black/55 shadow-sm">
            <ImagePlus aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
          </span>
        )}
        <span className={hasPhotos ? "font-medium" : "font-semibold"}>{hasPhotos ? "Agregar fotos" : "Seleccionar fotos"}</span>
        {!hasPhotos && <span className="mt-1 text-xs text-black/55">Opcional · Hasta 12 imágenes de 8 MB</span>}
        <input
          ref={inputRef}
          name="images"
          type="file"
          accept="image/*"
          multiple
          disabled={atLimit}
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "error-images" : "photos-help"}
          onChange={(event) => {
            const selected = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = "";
            if (!selected.length) return;
            const message = imageOrder.length + selected.length > 12 ? "Podés cargar hasta 12 imágenes." : selected.some((file) => file.size > 8 * 1024 * 1024) ? "Cada imagen debe pesar hasta 8 MB." : selected.some((file) => !file.type.startsWith("image/")) ? "Seleccioná únicamente imágenes." : "";
            event.currentTarget.setCustomValidity(message);
            setError(message);
            if (message) return;
            onChange([...files, ...selected], [...imageOrder, ...selected.map((_, index) => `new:${files.length + index}`)]);
          }}
        />
      </label>
      </div>
      {error && <p id="error-images" role="alert" className="mt-1.5 text-sm text-red-700">{error}</p>}
      <p id="photos-help" className={hasPhotos ? "mt-3 text-xs leading-5 text-black/65" : "sr-only"}>
        {hasPhotos && "La primera foto será la portada. Arrastrá o usá las flechas para ordenarlas."}
        {hasPhotos && atLimit && <span className="mt-1 block">Máximo de 12 fotos alcanzado. Eliminá una para agregar otra.</span>}
      </p>
      {hasPhotos && <>
        <p className="mt-2 text-right text-xs text-black/55" role="status">{imageOrder.length} de 12 fotos</p>
      </>}
      <ImageOrderList compact items={imageOrder.map((key) => {
        const [kind, rawIndex] = key.split(":");
        const index = Number(rawIndex);
        return kind === "existing" ? { key, label: "Foto guardada", src: existingImages[index] } : { key, label: files[index]?.name ?? "", file: files[index] };
      })} onRemove={removePhoto} onReorder={(from, to) => {
        const next = [...imageOrder];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(files, next);
      }} />
    </section>
  );
}
