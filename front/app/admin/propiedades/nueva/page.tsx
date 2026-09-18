"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const inputClass = "mt-2 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15";
const labelClass = "block text-sm font-semibold text-[#171717]";

export default function NuevaPropiedadPage() {
  const [saved, setSaved] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#fafafa] py-10">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <Link href="/admin" className="text-sm font-semibold text-[#B71C1C]">← Volver a administración</Link>
        <header className="mt-6 border-b border-black/10 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B71C1C]">Administración</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">Publicar propiedad</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">Completá la información de la propiedad. Por ahora esta pantalla funciona como maqueta y quedará lista para conectar al backend.</p>
        </header>

        {saved && <div role="status" className="mt-6 rounded-md border border-[#B71C1C]/20 bg-[#B71C1C]/8 px-4 py-3 text-sm text-[#741111]">Datos preparados correctamente. Al conectar el backend, este botón creará el borrador de la propiedad.</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">Información principal</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>Título<input required name="title" placeholder="Ej. Casa con jardín y piscina" className={inputClass} /></label>
              <label className={labelClass}>Operación<select required name="operation" className={inputClass}><option value="sale">Venta</option><option value="rent">Alquiler</option></select></label>
              <label className={labelClass}>Tipo de propiedad<select required name="propertyType" className={inputClass}><option>Casa</option><option>Departamento</option><option>Terreno</option><option>Local</option><option>Oficina</option></select></label>
              <label className={labelClass}>Precio<input required name="price" type="number" min="0" placeholder="185000" className={inputClass} /></label>
              <label className={labelClass}>Moneda<select name="currency" className={inputClass}><option>USD</option><option>ARS</option></select></label>
              <label className={labelClass}>Expensas (opcional)<input name="expenses" type="number" min="0" placeholder="0" className={inputClass} /></label>
              <label className={labelClass}>Estado<select name="status" className={inputClass}><option value="draft">Borrador</option><option value="published">Publicada</option><option value="reserved">Reservada</option></select></label>
            </div>
          </section>

          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">Ubicación y superficies</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>Dirección<input name="street" placeholder="Calle y número" className={inputClass} /></label><label className={labelClass}>Barrio<input name="neighborhood" className={inputClass} /></label>
              <label className={labelClass}>Ciudad<input required name="city" placeholder="San Miguel de Tucumán" className={inputClass} /></label><label className={labelClass}>Provincia<input required name="province" placeholder="Tucumán" className={inputClass} /></label>
              <label className={labelClass}>Superficie total (m²)<input name="totalArea" type="number" min="0" className={inputClass} /></label><label className={labelClass}>Superficie cubierta (m²)<input name="coveredArea" type="number" min="0" className={inputClass} /></label>
            </div>
          </section>

          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-semibold text-[#171717]">Características y descripción</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3"><label className={labelClass}>Dormitorios<input name="bedrooms" type="number" min="0" className={inputClass} /></label><label className={labelClass}>Baños<input name="bathrooms" type="number" min="0" className={inputClass} /></label><label className={labelClass}>Cocheras<input name="parkingSpaces" type="number" min="0" className={inputClass} /></label></div>
            <label className={`${labelClass} mt-5`}>Descripción<textarea required name="description" rows={6} placeholder="Describí la propiedad, sus ambientes y puntos destacados." className="mt-2 w-full rounded-md border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" /></label>
            <label className={`${labelClass} mt-5`}>Comodidades<input name="amenities" placeholder="Ej. Piscina, jardín, parrilla, balcón" className={inputClass} /><span className="mt-1 block text-xs font-normal text-black/50">Separalas con comas.</span></label>
          </section>

          <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm sm:p-7"><h2 className="text-xl font-semibold text-[#171717]">Fotos</h2><p className="mt-2 text-sm text-black/60">La primera foto será la portada. Podrás ordenarlas cuando se conecte el backend.</p><label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#B71C1C]/35 bg-[#B71C1C]/5 px-6 py-10 text-center text-sm text-[#B71C1C]"><span className="font-semibold">Seleccionar fotos</span><span className="mt-1 text-black/55">JPG, PNG o WEBP</span><input name="images" type="file" accept="image/*" multiple className="sr-only" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>{files.length > 0 && <p className="mt-3 text-sm text-black/65">{files.length} foto(s) seleccionada(s): {files.map((file) => file.name).join(", ")}</p>}</section>

          <div className="flex flex-wrap justify-end gap-3"><button type="button" className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black/70">Guardar borrador</button><button type="submit" className="rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/20">Publicar propiedad</button></div>
        </form>
      </div>
    </main>
  );
}
