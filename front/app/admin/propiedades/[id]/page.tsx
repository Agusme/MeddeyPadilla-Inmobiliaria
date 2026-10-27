"use client";

import {
  toAdminProperty,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import { getAdminProperty, publicImageUrl } from "@/lib/api";
import PropertyGallery from "@/components/properties/PropertyGallery";
import { formatPropertyPrice } from "@/lib/formatPrice";
import ButtonLink from "@/components/ui/ButtonLink";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<AdminProperty | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getAdminProperty(params.id)
      .then((item) => setProperty(toAdminProperty(item)))
      .catch(() => setProperty(undefined))
      .finally(() => setLoaded(true));
  }, [params.id]);

  if (!loaded)
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
        <p className="text-sm text-black/60">Cargando propiedad…</p>
      </main>
    );
  if (!property)
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">

        <h1 className="mt-8 text-2xl font-semibold">Propiedad no encontrada</h1>
      </main>
    );

  const location = [property.street, property.city].filter(Boolean).join(", ");
  const price = formatPropertyPrice(property.price, property.currency);
  const features = ([
    ["Dormitorios", property.bedrooms],
    ["Baños", property.bathrooms],
    ["Superficie cubierta", property.coveredArea === "" ? "" : `${property.coveredArea} m²`],
    ["Superficie total", property.totalArea === "" ? "" : `${property.totalArea} m²`],
    ["Cochera", property.parkingSpaces],
    ["Plantas", property.floors],
    ["Expensas", property.expenses === "" ? "" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(property.expenses))],
    ["Estado", property.status],
  ] as [string, string | number][]).filter(([, value]) => value !== "" && value !== undefined && value !== null);
  const comforts = ([
    ["Balcón", property.balcony], ["Dependencia de servicio", property.serviceRoom], ["Fondo", property.backyard], ["Patio", property.patio],
    ["Lavadero", property.laundryRoom], ["Asador", property.grill], ["Quincho", property.quincho], ["Pileta", property.pool],
    ["Cocina", property.kitchen], ["Living", property.livingRoom], ["Comedor", property.diningRoom], ["Toilette", property.toilette], ["Amoblado", property.furnished],
  ] as [string, boolean | undefined][]).filter(([, value]) => value === true).map(([label]) => label);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">

      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <section className="min-w-0" aria-label="Fotos de la propiedad">
          {property.images.length > 0 ? (
            <PropertyGallery key={property.id} images={[...property.images].sort((a, b) => a.position - b.position).map((image) => publicImageUrl(image.url))} title={property.title} />
          ) : (
            <div className="flex aspect-4/3 items-center justify-center rounded-md border border-black/10 bg-[#fafafa] p-8 text-center text-sm text-black/55">
              Esta propiedad no tiene fotos cargadas.
            </div>
          )}
        </section>
        <aside className="h-fit border border-black/10 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B71C1C]">
            {property.operation} · {property.propertyType}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#171717]">
            {property.title}
          </h1>
          <p className="mt-3 text-sm text-black/60">{location}</p>
          <p className="mt-6 text-2xl font-semibold text-[#171717]">{price}</p>
          <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-semibold text-[#171717]">
              ¿Te interesa esta propiedad?
            </p>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Escribinos para recibir más información o coordinar una visita.
            </p>
            <ButtonLink
              href="/contacto#contact-form"
              className="mt-5 w-full"
            >
              Consultar propiedad
            </ButtonLink>
          </div>
        </aside>
      </div>
      <section className="mt-12 grid gap-10 border-t border-black/10 pt-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Descripción</h2>
          <p className="mt-4 max-w-2xl leading-7 text-black/65">
            {property.description}
          </p>
          <h2 className="mt-10 text-2xl font-semibold tracking-tight">
            Ubicación
          </h2>
          <p className="mt-4 flex items-center gap-2 text-black/65">
            <span className="text-[#B71C1C]">●</span>
            {location}
          </p>
          {property.amenities && (
            <>
              <h2 className="mt-10 text-2xl font-semibold tracking-tight">
                Comodidades
              </h2>
              <p className="mt-4 text-black/65">{property.amenities}</p>
            </>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Características
          </h2>
          <dl className="mt-5 grid grid-cols-2 border-l border-t border-black/10">
            {features.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-r border-black/10 p-4"
              >
                <dt className="text-xs uppercase tracking-wide text-black/50">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-[#171717]">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
          {comforts.length > 0 && <div className="mt-7">
            <h3 className="text-lg font-semibold">Ambientes y comodidades</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-black/70">{comforts.map((label) => <li key={label}>✓ {label}</li>)}</ul>
          </div>}
        </div>
      </section>
    </main>
  );
}
