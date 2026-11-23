"use client";

import {
  toAdminProperty,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import { getAdminProperty, publicImageUrl } from "@/lib/api";
import { usePropertySave } from "@/components/properties/usePropertySave";
import { clearLocalizedValidation, localizeFieldValidation, userErrorMessage } from "@/lib/userMessages";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import PropertyQuantityField from "@/components/properties/PropertyQuantityField";
import PropertyFeaturesFields from "@/components/properties/PropertyFeaturesFields";
import { hasResidentialFeatures } from "@/lib/propertyTypes";
import PropertyPhotosField from "@/components/properties/PropertyPhotosField";
import PropertyPublicationFields from "@/components/properties/PropertyPublicationFields";
import PropertyTypeSelect from "@/components/properties/PropertyTypeSelect";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { House } from "lucide-react";

const inputClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1.5 h-11 min-w-0 w-full rounded-lg aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600 border border-black/15 bg-white px-3 text-base font-normal outline-none transition sm:text-sm focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block min-w-0 text-sm font-medium leading-5 text-[#171717]";
const sectionClass = "p-5 sm:p-6";
const headingClass = "text-xl font-semibold tracking-tight text-[#B71C1C]";

export default function EditarPropiedadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [revision, setRevision] = useState<string>();
  const [published, setPublished] = useState(false);
  const { save, saving, progress, clearProgress } = usePropertySave();
  const [files, setFiles] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState({ bedrooms: "", bathrooms: "", parkingSpaces: "" });
  const [propertyType, setPropertyType] = useState("Casa");
  const hasBedrooms = hasResidentialFeatures(propertyType);
  const hasBuilding = propertyType !== "Terreno";

  useEffect(() => {
    void getAdminProperty(params.id)
      .then((item) => {
        setLoadError(undefined);
        const mapped = toAdminProperty(item);
        setProperty(mapped);
        setRevision(item.updatedAt);
        setPublished(mapped.status === "Publicada");
        setCurrency(mapped.currency);
        setPropertyType(mapped.propertyType);
        setQuantities({ bedrooms: String(mapped.bedrooms), bathrooms: String(mapped.bathrooms), parkingSpaces: String(mapped.parkingSpaces) });
        setImageOrder(mapped.images.map((_, index) => `existing:${index}`));
      })
      .catch(error => {
        setProperty(null);
        setLoadError(userErrorMessage(error, "No pudimos cargar la propiedad. Volvé al listado e intentá nuevamente."));
      });
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property || saving) return;
    const data = new FormData(event.currentTarget);
    const featured = published && data.get("featured") === "on";
    data.set("status", published ? "published" : "draft");
    data.set("featured", String(featured));
    if (await save(data, files, imageOrder, { id: property.id, revision })) router.push("/admin/propiedades");
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

  if (!property) return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-10">
      <p role={loadError ? "alert" : "status"} className="text-sm text-black/60">{loadError ?? "Cargando la propiedad…"}</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">

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
              const message = localizeFieldValidation(field);
              if (message) updateFieldError(field, message);
            }
          }}
          onInputCapture={(event) => {
            const field = event.target;
            clearLocalizedValidation(field);
            if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) && field.validity.valid && errors[field.name]) updateFieldError(field, "");
          }} className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          {!hasBedrooms && <input type="hidden" name="bedrooms" value={quantities.bedrooms} />}
          {!hasBuilding && <><input type="hidden" name="bathrooms" value={quantities.bathrooms} /><input type="hidden" name="parkingSpaces" value={quantities.parkingSpaces} /></>}
          <div className="divide-y divide-black/10">
          <section className={sectionClass} aria-labelledby="main-information-heading">
            <h2 id="main-information-heading" className={headingClass}>Información principal</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className={`${labelClass} sm:col-span-2`}>
                Título <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <input
                  required
                  name="title" defaultValue={property.title}
                  placeholder="Ej. Casa con jardín y piscina"
                  className={inputClass}
                />
                {fieldError("title")}
              </label>
              <div className={labelClass}>
                Operación <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <Select required name="operation" label="Operación" defaultValue={property.operation} options={[{ value: "Venta", label: "Venta" }, { value: "Alquiler", label: "Alquiler" }]} />
              </div>
              <PropertyTypeSelect value={propertyType} onChange={setPropertyType} allowLegacy={property.propertyType === "Propiedad"} />
              <label className={labelClass}>
                Precio <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <span className="relative block">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-black/50">{currency === "ARS" ? "$" : "US$"}</span>
                  <input required name="price" defaultValue={property.price} placeholder="0" type="number" min="0" className={`${inputClass} pl-12`} />
                </span>
                {fieldError("price")}
              </label>
              <div className={labelClass}>
                Moneda <span className="text-[#B71C1C]" aria-label="obligatorio">*</span>
                <Select required name="currency" label="Moneda" value={currency} onChange={setCurrency} options={[{ value: "USD", label: "USD" }, { value: "ARS", label: "ARS" }]} />
              </div>
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
            <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:grid-rows-[auto_minmax(9rem,auto)_auto] lg:items-stretch lg:gap-y-0">
              <div className="min-w-0 lg:row-span-3">
                <label className={labelClass}>
                  <span>Descripción <span className="text-[#B71C1C]" aria-label="obligatorio">*</span></span>
                  <textarea
                    required
                    name="description" defaultValue={property.description}
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
                saving={saving}
                progress={progress}
                existingImages={property.images.map((image) => publicImageUrl(image.url))}
                onChange={(nextFiles, nextOrder) => {
                  clearProgress();
                  setFiles(nextFiles);
                  setImageOrder(nextOrder);
                }}
              />
            </div>
          </section>
          <section className={sectionClass} aria-label="Detalles opcionales">
            <PropertyFeaturesFields key={property.id} propertyType={propertyType} initial={property}>
              <label className={labelClass}>
                Sup. total (m²) <span className="sr-only">(opcional)</span>
                <input
                  name="totalArea" defaultValue={property.totalArea}
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
            </PropertyFeaturesFields>

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
