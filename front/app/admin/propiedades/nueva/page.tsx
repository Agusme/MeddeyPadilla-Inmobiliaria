"use client";

import { createAdminProperty } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

const inputClass =
  "mt-2 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block text-sm font-semibold text-[#171717]";

export default function NuevaPropiedadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [published, setPublished] = useState(false);
  const [hasFeaturedCapacity] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const featured = published && data.get("featured") === "on";
    if (featured) {
      const result = await Swal.fire({
        title: "¿Destacar propiedad?",
        text: "Se mostrará entre las propiedades destacadas del inicio.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, destacar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#B71C1C",
        cancelButtonColor: "#4B5563",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    }
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
            Publicar propiedad
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Completá la información de la propiedad para sumarla al listado
            administrativo.
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
                  placeholder="Ej. Casa con jardín y piscina"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Operación
                <select required name="operation" className={inputClass}>
                  <option>Venta</option>
                  <option>Alquiler</option>
                </select>
              </label>
              <label className={labelClass}>
                Tipo de propiedad
                <select name="propertyType" className={inputClass}>
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
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Moneda
                <select name="currency" className={inputClass}>
                  <option>USD</option>
                  <option>ARS</option>
                </select>
              </label>
            </div>
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">
              Ubicación y superficies
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Dirección
                <input name="street" className={inputClass} />
              </label>
              <label className={labelClass}>
                Ciudad / Provincia
                <input required name="city" className={inputClass} />
              </label>
              <label className={labelClass}>
                Superficie total (m²)
                <input
                  name="totalArea"
                  type="number"
                  min="0"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Superficie cubierta (m²)
                <input
                  name="coveredArea"
                  type="number"
                  min="0"
                  className={inputClass}
                />
              </label>
            </div>
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">
              Características y descripción
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Dormitorios
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Baños
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Cocheras
                <input
                  name="parkingSpaces"
                  type="number"
                  min="0"
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
                className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
              />
            </label>
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">Fotos</h2>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#B71C1C]/35 bg-[#B71C1C]/5 px-6 py-10 text-center text-sm text-[#B71C1C]">
              <span className="font-semibold">Seleccionar fotos</span>
              <span className="mt-1 text-black/55">JPG, PNG o WEBP</span>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) =>
                  setFiles(Array.from(event.target.files ?? []))
                }
              />
            </label>
            {files.length > 0 && (
              <p className="mt-3 text-sm text-black/65">
                {files.length} foto(s) seleccionada(s)
              </p>
            )}
          </section>
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#171717]">
              Publicación
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Estado
                <select
                  name="status"
                  value={published ? "published" : "unpublished"}
                  onChange={(event) =>
                    setPublished(event.target.value === "published")
                  }
                  className={inputClass}
                >
                  <option value="unpublished">No publicada</option>
                  <option value="published">Publicada</option>
                </select>
              </label>
              <label
                className={`flex items-start gap-3 ${!published || !hasFeaturedCapacity ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}
              >
                <input
                  name="featured"
                  type="checkbox"
                  disabled={!published || !hasFeaturedCapacity}
                  className="mt-1 h-4 w-4 accent-[#B71C1C]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#171717]">
                    Propiedad destacada
                  </span>
                  <span className="mt-1 block text-sm text-black/60">
                    {!published
                      ? "Primero publicá la propiedad."
                      : !hasFeaturedCapacity
                        ? "Ya hay 3 propiedades destacadas."
                        : "Se mostrará entre las destacadas del inicio."}
                  </span>
                </span>
              </label>
            </div>
          </section>
          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/admin/propiedades"
              className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black/70"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/20"
            >
              {saving ? "Guardando..." : "Guardar propiedad"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
