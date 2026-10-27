"use client";

import {
  toAdminProperty,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import { getAdminProperty, publicImageUrl, updateAdminProperty } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropertyQuantityField from "@/components/properties/PropertyQuantityField";
import PropertyFeaturesFields from "@/components/properties/PropertyFeaturesFields";
import { hasResidentialFeatures } from "@/lib/propertyTypes";
import ImageOrderList from "@/components/properties/ImageOrderList";
import PropertyPublicationFields from "@/components/properties/PropertyPublicationFields";
import { propertyTypeOptions } from "@/lib/propertyTypes";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { House, ImagePlus } from "lucide-react";

const inputClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1.5 h-11 min-w-0 w-full rounded-lg aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600 border border-black/15 bg-white px-3 text-base font-normal outline-none transition sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block min-w-0 text-sm font-medium leading-5 text-[#171717]";
const sectionClass = "p-5 sm:p-6";
const headingClass = "text-xl font-semibold tracking-tight text-[#B71C1C]";

export default function EditarPropiedadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState({ bedrooms: "", bathrooms: "", parkingSpaces: "" });
  const [propertyType, setPropertyType] = useState("Propiedad");
  const hasBedrooms = hasResidentialFeatures(propertyType);
  const hasBuilding = propertyType !== "Terreno";

  useEffect(() => {
    void getAdminProperty(params.id)
      .then((item) => {
        const mapped = toAdminProperty(item);
        setProperty(mapped);
        setPublished(mapped.status === "Publicada");
        setCurrency(mapped.currency);
        setPropertyType(mapped.propertyType);
        setQuantities({ bedrooms: String(mapped.bedrooms), bathrooms: String(mapped.bathrooms), parkingSpaces: String(mapped.parkingSpaces) });
        setImageOrder(mapped.images.map((_, index) => `existing:${index}`));
      })
      .catch(() => setProperty(null));
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property || saving) return;
    const data = new FormData(event.currentTarget);
    data.delete("images");
    files.forEach((file) => data.append("images", file));
    data.set("imageOrder", JSON.stringify(imageOrder));
    const featured = published && data.get("featured") === "on";
    data.set("status", published ? "published" : "draft");
    data.set("featured", String(featured));
    setSaving(true);
    try {
      await updateAdminProperty(property.id, data);
      await Swal.fire({ title: "Propiedad editada correctamente", icon: "success", showConfirmButton: false, timer: 1800, timerProgressBar: true });
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

  if (!property) return <main className="min-h-screen bg-[#fafafa] px-6 py-10"><p className="text-sm text-black/60">Buscando la propiedad…</p></main>;

  return (
    <main className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">

        <header className="pb-5">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-[#171717]">
            <House aria-hidden="true" className="h-7 w-7 shrink-0 text-[#B71C1C]" strokeWidth={1.8} />
            Editar propiedad
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
          {!hasBedrooms && <input type="hidden" name="bedrooms" value={quantities.bedrooms} />}
          {!hasBuilding && <><input type="hidden" name="bathrooms" value={quantities.bathrooms} /><input type="hidden" name="parkingSpaces" value={quantities.parkingSpaces} /></>}
          <div className="divide-y divide-black/10">
          <section className={sectionClass} aria-labelledby="main-information-heading">
            <h2 id="main-information-heading" className={headingClass}>Información principal</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <label className={`${labelClass} col-span-2`}>
                Título <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input
                  required
                  name="title" defaultValue={property.title}
                  placeholder="Ej. Casa con jardín y piscina"
                  className={inputClass}
                />
                {fieldError("title")}
              </label>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Operación <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required defaultValue={property.operation} name="operation" className={inputClass}>
                  <option>Venta</option>
                  <option>Alquiler</option>
                </select>
              </label>
              <label className={`${labelClass} col-span-2 sm:col-span-1`}>
                Tipo de propiedad <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="propertyType" value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className={inputClass}>
                  {propertyTypeOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <div className="col-span-2 grid min-w-0 grid-cols-[minmax(0,2fr)_minmax(5.5rem,1fr)] items-start gap-3 sm:gap-4">
              <label className={labelClass}>
                Precio <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <span className="relative block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-black/50">{currency === "ARS" ? "$" : "US$"}</span>
                  <input required name="price" defaultValue={property.price} placeholder="0" type="number" min="0" className={`${inputClass} pl-12`} />
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
                <input placeholder="Ej. Rivadavia 200" name="street" defaultValue={property.street} className={inputClass} />
                {fieldError("street")}
              </label>
              <label className={labelClass}>
                Ciudad / Provincia <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input placeholder="Ej. San Miguel de Tucumán, Tucumán" required name="city" defaultValue={property.city} className={inputClass} />
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
                  name="totalArea" defaultValue={property.totalArea}
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
                  name="coveredArea" defaultValue={property.coveredArea}
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
            <PropertyFeaturesFields key={property.id} propertyType={propertyType} initial={property} />

          </section>
          <section className={sectionClass} aria-labelledby="media-heading">
            <h2 id="media-heading" className={headingClass}>Descripción y fotografías</h2>
          <div className="mt-4 grid items-start gap-5 lg:grid-cols-2">
            <section className="min-w-0">
            <label className={labelClass}>
              Descripción <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
              <textarea
                required
                name="description" defaultValue={property.description}
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
                <ImagePlus aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <span className="font-semibold text-[#171717]">Agregar fotos</span><span className="mt-1 text-xs text-black/55">Opcional · Hasta 12 imágenes de 8 MB</span>
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
                  setImageOrder((current) => [...current.filter((key) => key.startsWith("existing:")), ...selected.map((_, index) => `new:${index}`)]);
                }}
              />
            </label>
            {fieldError("images")}
            {files.length > 0 && <p className="mt-3 text-sm text-black/65">Arrastrá las fotos para ordenarlas. La primera será la portada.</p>}
            <ImageOrderList compact items={imageOrder.map((key) => {
              const [kind, rawIndex] = key.split(":");
              const index = Number(rawIndex);
              if (kind === "existing") return { key, label: "Foto guardada", src: publicImageUrl(property.images[index]?.url) };
              return { key, label: files[index]?.name ?? "", file: files[index] };
            })} onReorder={reorderImages} />

          </section>
          </div>
          </section>
          <section className={sectionClass}>
            <PropertyPublicationFields key={property.id} propertyId={property.id} defaultFeatured={property.featured} embedded compact title="Estado de publicación" published={published} onPublishedChange={setPublished} />
          </section>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-black/10 bg-[#fafafa] p-5 sm:flex-row sm:justify-end sm:p-6">
            <ButtonLink
              href="/admin/propiedades"
              variant="secondary"
            >
              Cancelar
            </ButtonLink>
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Guardando..." : published ? "Guardar cambios y publicar" : "Guardar cambios como borrador"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
