"use client";

import {
  canFeatureProperty,
  getStoredAdminProperties,
  type AdminProperty,
  updateStoredAdminProperty,
} from "@/components/properties/adminPropertyStorage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block text-sm font-semibold text-[#171717]";

export default function EditarPropiedadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setProperty(
        getStoredAdminProperties().find((item) => item.id === params.id) ??
          null,
      ),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property) return;
    const data = new FormData(event.currentTarget);
    const published = data.get("status") === "published";
    const featured = published && data.get("featured") === "on";
    if (featured && !canFeatureProperty(property.id)) {
      setFeaturedError(true);
      return;
    }
    const statuses: Record<string, string> = {
      unpublished: "No publicada",
      published: "Publicada",
    };
    updateStoredAdminProperty({
      ...property,
      title: String(data.get("title") ?? ""),
      operation: String(data.get("operation") ?? ""),
      propertyType: String(data.get("propertyType") ?? ""),
      price: String(data.get("price") ?? ""),
      currency: String(data.get("currency") ?? ""),
      status: statuses[String(data.get("status"))] ?? "No publicada",
      street: String(data.get("street") ?? ""),
      city: String(data.get("city") ?? ""),
      totalArea: String(data.get("totalArea") ?? ""),
      coveredArea: String(data.get("coveredArea") ?? ""),
      bedrooms: String(data.get("bedrooms") ?? ""),
      bathrooms: String(data.get("bathrooms") ?? ""),
      parkingSpaces: String(data.get("parkingSpaces") ?? ""),
      description: String(data.get("description") ?? ""),
      featured,
    });
    await Swal.fire({
      title: "Propiedad editada correctamente",
      icon: "success",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
    router.push("/admin/propiedades");
  }

  if (!property)
    return (
      <main className="min-h-screen bg-[#fafafa] py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <Link
            href="/admin/propiedades"
            className="text-sm font-semibold text-[#B71C1C]"
          >
            ← Volver a propiedades
          </Link>
          <p className="mt-8 text-sm text-black/60">Buscando la propiedad…</p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#fafafa] py-10">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <Link
          href="/admin/propiedades"
          className="text-sm font-semibold text-[#B71C1C]"
        >
          ← Volver a propiedades
        </Link>
        <header className="mt-6 border-b border-black/10 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B71C1C]">
            Administración
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
            Editar propiedad
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Modificá la información y guardá los cambios.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">
              Información principal
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Título
                <input
                  required
                  name="title"
                  defaultValue={property.title}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Operación
                <select
                  name="operation"
                  defaultValue={property.operation}
                  className={inputClass}
                >
                  <option>Venta</option>
                  <option>Alquiler</option>
                </select>
              </label>
              <label className={labelClass}>
                Tipo de propiedad
                <select
                  name="propertyType"
                  defaultValue={property.propertyType}
                  className={inputClass}
                >
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Terreno</option>
                  <option>Local</option>
                  <option>Oficina</option>
                </select>
              </label>
              <label className={labelClass}>
                Precio
                <input
                  required
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={property.price}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Moneda
                <select
                  name="currency"
                  defaultValue={property.currency}
                  className={inputClass}
                >
                  <option>USD</option>
                  <option>ARS</option>
                </select>
              </label>
              <label className={labelClass}>
                Estado
                <select
                  name="status"
                  defaultValue={
                    property.status === "Publicada"
                      ? "published"
                      : "unpublished"
                  }
                  className={inputClass}
                >
                  <option value="unpublished">No publicada</option>
                  <option value="published">Publicada</option>
                </select>
              </label>
            </div>
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">
              Ubicación y características
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Dirección
                <input
                  name="street"
                  defaultValue={property.street}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Ciudad / Provincia
                <input
                  required
                  name="city"
                  defaultValue={property.city}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Superficie total (m²)
                <input
                  name="totalArea"
                  type="number"
                  min="0"
                  defaultValue={property.totalArea}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Superficie cubierta (m²)
                <input
                  name="coveredArea"
                  type="number"
                  min="0"
                  defaultValue={property.coveredArea}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Dormitorios
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  defaultValue={property.bedrooms}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Baños
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  defaultValue={property.bathrooms}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Cocheras
                <input
                  name="parkingSpaces"
                  type="number"
                  min="0"
                  defaultValue={property.parkingSpaces}
                  className={inputClass}
                />
              </label>
            </div>
            <label className={`${labelClass} mt-5`}>
              Descripción
              <textarea
                required
                name="description"
                rows={6}
                defaultValue={property.description}
                className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
              />
            </label>
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={property.featured}
                className="mt-1 h-4 w-4 accent-[#B71C1C]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#171717]">
                  Propiedad destacada
                </span>
                <span className="mt-1 block text-sm text-black/60">
                  Mostrala entre las propiedades destacadas. Podés seleccionar
                  hasta 3.
                </span>
              </span>
            </label>
            {featuredError && (
              <p
                role="alert"
                className="mt-4 text-sm font-semibold text-[#B71C1C]"
              >
                Ya hay 3 propiedades destacadas. Quitá una antes de seleccionar
                otra.
              </p>
            )}
          </section>
          <div className="flex justify-end gap-3">
            <Link
              href="/admin/propiedades"
              className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black/70"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/20"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
