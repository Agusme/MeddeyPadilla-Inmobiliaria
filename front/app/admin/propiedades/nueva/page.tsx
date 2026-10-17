"use client";

import { createAdminProperty } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";
import PropertyQuantityField from "@/components/properties/PropertyQuantityField";
import ImageOrderList from "@/components/properties/ImageOrderList";
import PropertyPublicationFields from "@/components/properties/PropertyPublicationFields";

const inputClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1.5 h-11 min-w-0 w-full rounded-lg aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600 border border-black/15 bg-white px-3 text-base font-normal outline-none transition sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block min-w-0 text-sm font-medium leading-5 text-[#171717]";
const sectionClass = "p-5 sm:p-6";
const headingClass = "text-xl font-semibold tracking-tight text-[#B71C1C]";

export default function NuevaPropiedadPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [quantities, setQuantities] = useState({ bedrooms: "", bathrooms: "", parkingSpaces: "" });
  const [propertyType, setPropertyType] = useState("Casa");
  const hasBedrooms = propertyType === "Casa" || propertyType === "Departamento";
  const hasBuilding = propertyType !== "Terreno";
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    data.delete("images");
    files.forEach((file) => data.append("images", file));
    data.set("imageOrder", JSON.stringify(imageOrder));
    const featured = published && data.get("featured") === "on";
    data.set("status", published ? "published" : "draft");
    data.set("featured", String(featured));
    setSaving(true);
    try {
      await createAdminProperty(data);
      await Swal.fire({ title: "Propiedad creada correctamente", icon: "success", showConfirmButton: false, timer: 1800, timerProgressBar: true });
      router.push("/admin/propiedades");
    } catch (error) {
      await Swal.fire({ title: "No se pudo guardar", text: error instanceof Error ? error.message : "Intentá nuevamente.", icon: "error" });
    } finally {
      setSaving(false);
    }
  }

  function reorderImages(from: number, to: number) {
    setImageOrder((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function updateQuantity(name: keyof typeof quantities, value: string) {
    setQuantities((current) => ({ ...current, [name]: value }));
    if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={`error-${name}`} role="alert" className="mt-1.5 block text-sm font-normal text-red-700">{errors[name]}</span> : null;
  }

  function updateFieldError(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, message: string) {
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (message) field.setAttribute("aria-describedby", `error-${field.name}`);
    else field.removeAttribute("aria-describedby");
    setErrors((current) => ({ ...current, [field.name]: message }));
  }

  return (
    <main className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">

        <header className="pb-5">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-[#171717]">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 shrink-0 text-[#B71C1C]">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            Crear propiedad
          </h1>
        </header>
        <form onSubmit={handleSubmit}
          onInvalidCapture={(event) => {
            const field = event.target;
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
              const message = field.validity.valueMissing ? "Completá este campo." : field.validity.rangeUnderflow ? "Ingresá un valor igual o mayor a 0." : field.validity.stepMismatch ? "Ingresá un número entero." : field.validationMessage;
              updateFieldError(field, message);
            }
          }}
          onInputCapture={(event) => {
            const field = event.target;
            if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) && field.validity.valid && errors[field.name]) updateFieldError(field, "");
          }} className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="divide-y divide-black/10">
          <section className={sectionClass} aria-labelledby="main-information-heading">
            <h2 id="main-information-heading" className={headingClass}>Información principal</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <label className={`${labelClass} col-span-2`}>
                Título <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input
                  required
                  name="title"
                  placeholder="Ej. Casa con jardín y piscina"
                  className={inputClass}
                />
                {fieldError("title")}
              </label>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Operación <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="operation" className={inputClass}>
                  <option>Venta</option>
                  <option>Alquiler</option>
                </select>
              </label>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Tipo de propiedad <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="propertyType" value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className={inputClass}>
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Terreno</option>
                  <option>Local</option>
                  <option>Oficina</option>
                  <option>Galpón</option>
                </select>
              </label>
              <div className="col-span-2 grid min-w-0 grid-cols-[minmax(0,2fr)_minmax(5.5rem,1fr)] items-start gap-3 sm:gap-4">
              <label className={labelClass}>
                Precio <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <span className="relative block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-black/50">{currency === "ARS" ? "$" : "US$"}</span>
                  <input required name="price" placeholder="0" type="number" min="0" className={`${inputClass} pl-12`} />
                </span>
                {fieldError("price")}
              </label>
              <label className={labelClass}>
                Moneda <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="currency" value={currency} onChange={(event) => setCurrency(event.target.value)} className={inputClass}>
                  <option>USD</option>
                  <option>ARS</option>
                </select>
              </label>
              </div>
            </div>
          </section>
          <section className={sectionClass} aria-labelledby="location-heading">
            <h2 id="location-heading" className={headingClass}>Ubicación</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Dirección <span className="font-normal text-black/45">(opcional)</span>
                <input placeholder="Ej. Rivadavia 200" name="street" className={inputClass} />
                {fieldError("street")}
              </label>
              <label className={labelClass}>
                Ciudad / Provincia <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input placeholder="Ej. San Miguel de Tucumán, Tucumán" required name="city" className={inputClass} />
                {fieldError("city")}
              </label>
            </div>
          </section>
          <section className={sectionClass} aria-labelledby="features-heading">
            <h2 id="features-heading" className={headingClass}>Características</h2>
            <div className={`mt-4 grid grid-cols-2 items-end gap-4 ${hasBuilding ? (hasBedrooms ? "xl:grid-cols-[1.25fr_1.25fr_1fr_1fr_1fr]" : "lg:grid-cols-4") : "lg:max-w-xl"}`}>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Sup. total (m²) <span className="font-normal text-black/45">(opcional)</span>
                <input
                  name="totalArea"
                  aria-label="Superficie total en metros cuadrados"
                  type="number"
                  min="0"
                  className={inputClass}
                />
                {fieldError("totalArea")}
              </label>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Sup. cubierta (m²) <span className="font-normal text-black/45">(opcional)</span>
                <input
                  name="coveredArea"
                  aria-label="Superficie cubierta en metros cuadrados"
                  type="number"
                  min="0"
                  className={inputClass}
                />
                {fieldError("coveredArea")}
              </label>
            {hasBuilding && (
            <>
              {hasBedrooms && (
              <div className="min-w-0"><PropertyQuantityField name="bedrooms" label="Dormitorios" value={quantities.bedrooms} invalid={Boolean(errors.bedrooms)} onChange={(value) => updateQuantity("bedrooms", value)} />{fieldError("bedrooms")}</div>
              )}
              <div className="min-w-0"><PropertyQuantityField name="bathrooms" label="Baños" value={quantities.bathrooms} invalid={Boolean(errors.bathrooms)} onChange={(value) => updateQuantity("bathrooms", value)} />{fieldError("bathrooms")}</div>
              <div className="min-w-0"><PropertyQuantityField name="parkingSpaces" label="Cocheras" value={quantities.parkingSpaces} invalid={Boolean(errors.parkingSpaces)} onChange={(value) => updateQuantity("parkingSpaces", value)} />{fieldError("parkingSpaces")}</div>
            </>
            )}
            </div>

          </section>
          <section className={sectionClass} aria-labelledby="media-heading">
            <h2 id="media-heading" className={headingClass}>Descripción y fotografías</h2>
          <div className="mt-4 grid items-start gap-5 lg:grid-cols-2">
            <section className="min-w-0">
            <label className={labelClass}>
              Descripción <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
              <textarea
                required
                name="description"
                placeholder="Describí los ambientes, el estado y los principales atractivos."
                rows={7}
                className="mt-1.5 block h-44 w-full rounded-lg aria-[invalid=true]:border-red-600 border border-black/15 bg-white px-3 py-3 text-base font-normal outline-none sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
              />
              {fieldError("description")}
            </label>
            </section>
          <section className="min-w-0">
            <h3 className={labelClass}>Fotos</h3>

            <label className={`mt-1.5 flex h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center text-sm transition focus-within:ring-2 focus-within:ring-[#B71C1C]/30 ${errors.images ? "border-red-600 bg-red-50" : "border-black/30 bg-[#f7f7f7] hover:border-black/45 hover:bg-black/5"}`}>
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black/55 shadow-sm">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </span>
              <span className="font-semibold text-[#171717]">Seleccionar fotos</span><span className="mt-1 text-xs text-black/55">Opcional · Hasta 12 imágenes de 8 MB</span>
              <span className="mt-1 text-black/55">Podés seleccionar varias imágenes.</span>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? []);
                  const message = selected.length > 12 ? "Podés cargar hasta 12 imágenes." : selected.some((file) => file.size > 8 * 1024 * 1024) ? "Cada imagen debe pesar hasta 8 MB." : selected.some((file) => !file.type.startsWith("image/")) ? "Seleccioná únicamente imágenes." : "";
                  event.currentTarget.setCustomValidity(message);
                  updateFieldError(event.currentTarget, message);
                  if (message) return;
                  setFiles(selected);
                  setImageOrder(selected.map((_, index) => `new:${index}`));
                }}
              />
            </label>
            {fieldError("images")}
            {files.length > 0 && <p className="mt-3 text-sm text-black/65">Arrastrá las fotos para ordenarlas. La primera será la portada.</p>}
            <ImageOrderList compact items={imageOrder.map((key) => { const file = files[Number(key.split(":")[1])]; return { key, label: file?.name ?? "", file }; })} onReorder={reorderImages} />

          </section>
          </div>
          </section>
          <section className={sectionClass}>
            <PropertyPublicationFields embedded compact title="Estado de publicación" published={published} onPublishedChange={setPublished} />
          </section>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-black/10 bg-[#fafafa] p-5 sm:flex-row sm:justify-end sm:p-6">
            <Link
              href="/admin/propiedades"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black/70 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#B71C1C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8F1616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? "Guardando..." : published ? "Guardar y publicar" : "Guardar borrador"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
