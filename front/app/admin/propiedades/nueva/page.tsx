"use client";

import { createAdminProperty } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";
import PropertyQuantityField from "@/components/properties/PropertyQuantityField";
import PropertyFeaturesFields from "@/components/properties/PropertyFeaturesFields";
import { hasResidentialFeatures } from "@/lib/propertyTypes";
import PropertyPhotosField from "@/components/properties/PropertyPhotosField";
import PropertyPublicationFields from "@/components/properties/PropertyPublicationFields";
import { propertyTypeOptions } from "@/lib/propertyTypes";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { House } from "lucide-react";

const inputClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1.5 h-11 min-w-0 w-full rounded-lg aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600 border border-black/15 bg-white px-3 text-base font-normal outline-none transition sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block min-w-0 text-sm font-medium leading-5 text-[#171717]";
const sectionClass = "p-5 sm:p-6";
const headingClass = "text-xl font-semibold tracking-tight text-[#B71C1C]";

export default function NuevaPropiedadPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  const [quantities, setQuantities] = useState({ bedrooms: "", bathrooms: "", parkingSpaces: "" });
  const [propertyType, setPropertyType] = useState("Propiedad");
  const hasBedrooms = hasResidentialFeatures(propertyType);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">

        <header className="pb-5">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-[#171717]">
            <House aria-hidden="true" className="h-7 w-7 shrink-0 text-[#B71C1C]" strokeWidth={1.8} />
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
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className={`${labelClass} sm:col-span-2`}>
                Título <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input
                  required
                  name="title"
                  placeholder="Ej. Casa con jardín y piscina"
                  className={inputClass}
                />
                {fieldError("title")}
              </label>
              <label className={labelClass}>
                Operación <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="operation" className={inputClass}>
                  <option>Venta</option>
                  <option>Alquiler</option>
                </select>
              </label>
              <label className={labelClass}>
                Tipo de propiedad <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <select required name="propertyType" value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className={inputClass}>
                  {propertyTypeOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
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
            <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:grid-rows-[auto_minmax(9rem,auto)_auto] lg:items-stretch lg:gap-y-0">
              <div className="min-w-0 lg:row-span-3 lg:grid lg:grid-rows-subgrid">
                <label className={`${labelClass} lg:row-span-3 lg:grid lg:grid-rows-subgrid`}>
                  <span>Descripción <span className="text-[#B71C1C]" aria-label="obligatorio">*</span></span>
                  <textarea
                    required
                    name="description"
                    placeholder="Describí los ambientes, el estado y los principales atractivos."
                    rows={4}
                    className="mt-1.5 block h-36 min-h-36 w-full resize-y lg:h-auto rounded-lg aria-[invalid=true]:border-red-600 border border-black/15 bg-white px-3 py-3 text-base font-normal outline-none sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
                  />
                  {fieldError("description")}
                </label>
              </div>
              <PropertyPhotosField
                files={files}
                imageOrder={imageOrder}
                onChange={(nextFiles, nextOrder) => {
                  setFiles(nextFiles);
                  setImageOrder(nextOrder);
                }}
              />
            </div>
          </section>
          <section className={sectionClass} aria-label="Detalles opcionales">
            <PropertyFeaturesFields propertyType={propertyType}>
              <label className={labelClass}>
                Sup. total (m²) <span className="sr-only">(opcional)</span>
                <input
                  name="totalArea"
                  aria-label="Superficie total en metros cuadrados"
                  type="number"
                  min="0"
                  className={inputClass}
                />
                {fieldError("totalArea")}
              </label>
              <label className={labelClass}>
                Sup. cubierta (m²) <span className="sr-only">(opcional)</span>
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
            </PropertyFeaturesFields>

          </section>
          <section className={sectionClass}>
            <PropertyPublicationFields embedded compact title="Estado de publicación" published={published} onPublishedChange={setPublished} />
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
              {saving ? "Guardando..." : published ? "Guardar y publicar" : "Guardar borrador"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
