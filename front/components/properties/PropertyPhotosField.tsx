"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus } from "lucide-react";
import ImageOrderList from "./ImageOrderList";
import { maxPropertyPhotoBytes, maxPropertyPhotos, removePropertyPhoto, uniqueNewPropertyPhotos } from "@/lib/propertyPhotos";
import type { PropertyUploadProgress } from "@/lib/propertyDirectUpload";

export default function PropertyPhotosField({ files, imageOrder, existingImages = [], saving = false, progress, onChange }: {
  files: File[];
  imageOrder: string[];
  existingImages?: string[];
  saving?: boolean;
  progress?: PropertyUploadProgress;
  onChange: (files: File[], order: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [ignoredDuplicates, setIgnoredDuplicates] = useState(false);
  const hasPhotos = imageOrder.length > 0;
  const atLimit = imageOrder.length >= maxPropertyPhotos;

  function clearError() {
    setError("");
    setIgnoredDuplicates(false);
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
        {!hasPhotos && (
          <span className="mt-1 text-xs text-black/55">
            Agregá imágenes de la propiedad
            <span className="block">Por ejemplo, JPG, PNG o WebP</span>
          </span>
        )}
        <input
          ref={inputRef}
          name="images"
          type="file"
          accept="image/*"
          multiple
          disabled={atLimit || saving}
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "error-images" : "photos-help"}
          onChange={(event) => {
            const selected = Array.from(event.currentTarget.files ?? []);
            event.currentTarget.value = "";
            if (!selected.length) return;
            const added = uniqueNewPropertyPhotos(files, selected);
            let message = "";
            if (imageOrder.length + added.length > maxPropertyPhotos) {
              message = `Podés cargar hasta ${maxPropertyPhotos} imágenes por propiedad. Seleccioná menos fotos.`;
            } else if (added.some((file) => file.size > maxPropertyPhotoBytes)) {
              message = "La imagen supera el tamaño máximo permitido de 8 MB.";
            } else if (added.some((file) => !file.type.startsWith("image/"))) {
              message = "Seleccioná únicamente imágenes.";
            }
            event.currentTarget.setCustomValidity(message);
            setError(message);
            setIgnoredDuplicates(!message && added.length < selected.length);
            if (message || !added.length) return;
            onChange([...files, ...added], [...imageOrder, ...added.map((_, index) => `new:${files.length + index}`)]);
          }}
        />
      </label>
      </div>
      {error && <p id="error-images" role="alert" className="mt-1.5 text-sm text-red-700">{error}</p>}
      {ignoredDuplicates && <p role="status" className="mt-1.5 text-xs text-black/65">Se omitieron las fotos repetidas de esta selección.</p>}
      <p id="photos-help" className={hasPhotos ? "mt-3 text-xs leading-5 text-black/65" : "sr-only"}>
        {hasPhotos && "La primera foto será la portada. Arrastrá o usá las flechas para ordenarlas."}
        {hasPhotos && atLimit && <span className="mt-1 block">Máximo de {maxPropertyPhotos} fotos alcanzado. Eliminá una para agregar otra.</span>}
      </p>
      {hasPhotos && <>
        <p className="mt-2 text-right text-xs text-black/55" role="status">{imageOrder.length} de {maxPropertyPhotos} fotos</p>
      </>}
      {progress && progress.total > 0 && (
        <div className="mt-2 text-xs text-black/65">
          <progress className="block h-2 w-full accent-[#B71C1C]" value={progress.uploaded} max={progress.total} aria-label="Progreso de subida de fotos" />
          <p className="mt-1" role="status">
            {progress.uploaded} de {progress.total} {progress.total === 1 ? "foto nueva subida" : "fotos nuevas subidas"}.
            {progress.failed === 1 && " Quedó una foto pendiente."}
            {progress.failed > 1 && ` Quedaron ${progress.failed} fotos pendientes.`}
          </p>
        </div>
      )}
      <ImageOrderList compact disabled={saving} items={imageOrder.map((key) => {
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
