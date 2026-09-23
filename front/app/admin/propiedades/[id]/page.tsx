"use client";

import {
  toAdminProperty,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import { getAdminProperty, publicImageUrl } from "@/lib/api";
import Link from "next/link";
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
        <Link
          href="/admin/propiedades"
          className="inline-flex text-sm font-semibold text-[#B71C1C]"
        >
          ← Volver a propiedades
        </Link>
        <h1 className="mt-8 text-2xl font-semibold">Propiedad no encontrada</h1>
      </main>
    );

  const location = [property.street, property.city].filter(Boolean).join(", ");
  const price = `${property.currency} ${Number(property.price).toLocaleString("es-AR")}`;
  const features = [
    ["Dormitorios", property.bedrooms],
    ["Baños", property.bathrooms],
    [
      "Superficie cubierta",
      property.coveredArea ? `${property.coveredArea} m²` : "",
    ],
    ["Superficie total", property.totalArea ? `${property.totalArea} m²` : ""],
    ["Cochera", property.parkingSpaces],
    ["Estado", property.status],
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
      <Link
        href="/admin/propiedades"
        className="inline-flex text-sm font-semibold text-[#B71C1C]"
      >
        ← Volver a propiedades
      </Link>
      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <section>
          <div className="flex aspect-4/3 items-center justify-center border border-dashed border-[#B71C1C]/35 bg-[#B71C1C]/5 p-8 text-center">
            <div>
              <p className="font-semibold text-[#B71C1C]">
                {property.imageCount} foto{property.imageCount === 1 ? "" : "s"}{" "}
                cargada{property.imageCount === 1 ? "" : "s"}
              </p>
              <p className="mt-2 text-sm text-black/55">
                Las imágenes aparecerán aquí al conectar el almacenamiento de
                archivos.
              </p>
            </div>
          </div>
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
            <Link
              href="/contacto#contact-form"
              className="mt-5 inline-flex w-full justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white"
            >
              Consultar propiedad
            </Link>
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
                  {value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
