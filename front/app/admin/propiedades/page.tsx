"use client";

import {
  getFeaturedBasePropertyIds,
  getHiddenBasePropertyIds,
  getStoredAdminProperties,
  hideBaseProperty,
  removeStoredAdminProperty,
  saveAdminProperty,
  toAdminProperty,
  type AdminProperty,
} from "@/components/properties/adminPropertyStorage";
import { deleteAdminProperty, getAdminProperties } from "@/lib/api";
import { formatPropertyPrice } from "@/lib/formatPrice";
import { properties } from "@/components/properties/propertyData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type TableProperty = AdminProperty & { isExample?: boolean };

const statusStyles: Record<string, string> = {
  Publicada: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "No publicada": "border border-amber-200 bg-amber-50 text-amber-700",
};

const exampleProperties: TableProperty[] = properties.map((property) => ({
  id: property.slug,
  title: property.title,
  operation: property.operation,
  propertyType: property.type,
  price: property.price,
  currency: "",
  status: "Publicada",
  street: "",
  city: property.location.split(",")[0] ?? "",
  totalArea:
    property.features.find((item) => item.label === "Superficie total")
      ?.value ?? "—",
  coveredArea:
    property.features.find((item) => item.label === "Superficie cubierta")
      ?.value ?? "—",
  bedrooms:
    property.features.find((item) => item.label === "Dormitorios")?.value ??
    "—",
  bathrooms:
    property.features.find((item) => item.label === "Baños")?.value ?? "—",
  parkingSpaces:
    property.features.find((item) => item.label === "Cochera")?.value ?? "—",
  description: property.description,
  imageCount: property.images.length,
  images: property.images.map((url, position) => ({ url, position })),
  createdAt: "",
  isExample: true,
}));

function formatPrice(property: TableProperty) {
  return property.currency
    ? formatPropertyPrice(property.price, property.currency)
    : property.price;
}

export default function AdminPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<AdminProperty[]>([]);
  const [featuredBaseIds, setFeaturedBaseIds] = useState<string[]>([]);
  const [hiddenBaseIds, setHiddenBaseIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    void getAdminProperties().then((properties) => {
      setSavedProperties(properties.map(toAdminProperty));
      setFeaturedBaseIds(getFeaturedBasePropertyIds());
      setHiddenBaseIds(getHiddenBasePropertyIds());
    }).catch(() => setSavedProperties(getStoredAdminProperties()));
  }, []);

  const listedProperties: TableProperty[] = [
    ...savedProperties,
    ...exampleProperties
      .filter((property) => !hiddenBaseIds.includes(property.id))
      .map((property) => ({
        ...property,
        featured: featuredBaseIds.includes(property.id),
      })),
  ];

  async function handleDelete(property: TableProperty) {
    const result = await Swal.fire({
      title: "¿Eliminar propiedad?",
      text: `“${property.title}” dejará de aparecer en el listado. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#B71C1C",
      cancelButtonColor: "#4B5563",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    if (property.isExample) {
      hideBaseProperty(property.id);
      setHiddenBaseIds(getHiddenBasePropertyIds());
      setFeaturedBaseIds(getFeaturedBasePropertyIds());
    } else {
      try {
        await deleteAdminProperty(property.id);
        removeStoredAdminProperty(property.id);
        setSavedProperties((current) => current.filter((item) => item.id !== property.id));
      } catch (error) {
        await Swal.fire({ title: "No se pudo eliminar", text: error instanceof Error ? error.message : "Intentá nuevamente.", icon: "error" });
        return;
      }
    }
    await Swal.fire({
      title: "Propiedad eliminada correctamente",
      icon: "success",
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  }

  function prepareExampleForEdit(property: TableProperty) {
    if (!property.isExample) return;
    const propertyToSave = { ...property, isExample: undefined };
    saveAdminProperty(propertyToSave);
    hideBaseProperty(property.id);
    setHiddenBaseIds(getHiddenBasePropertyIds());
  }

  return (
    <main className="min-h-screen bg-[#fafafa] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
              Propiedades cargadas
            </h1>
            <p className="mt-2 text-sm text-black/55">
              {listedProperties.length} {listedProperties.length === 1 ? "propiedad" : "propiedades"} en total
            </p>
          </div>
          <Link
            href="/admin/propiedades/nueva"
            className="inline-flex justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/20 transition hover:bg-[#8F1616]"
          >
            + Nueva propiedad
          </Link>
        </div>

        <div className="mt-8 rounded-md border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <caption className="sr-only">
                Listado de propiedades cargadas
              </caption>
              <thead className="bg-[#B71C1C] text-sm text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Propiedad</th>
                  <th className="px-5 py-4 font-semibold">Operación</th>
                  <th className="px-5 py-4 font-semibold">Ubicación</th>
                  <th className="px-5 py-4 font-semibold">Precio</th>
                  <th className="px-5 py-4 font-semibold">Detalles</th>
                  <th className="px-5 py-4 font-semibold">Estado</th>
                  <th className="px-5 py-4 text-start font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {listedProperties.map((property) => (
                  <tr
                    key={property.id}
                    className="cursor-pointer align-top transition hover:bg-[#fafafa]"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a, button")) {
                        return;
                      }
                      router.push(
                        property.isExample
                          ? `/propiedades/${property.id}`
                          : `/admin/propiedades/${property.id}`,
                      );
                    }}
                  >
                    <td className="px-5 py-5">
                      <div>
                        <Link
                          href={
                            property.isExample
                              ? `/propiedades/${property.id}`
                              : `/admin/propiedades/${property.id}`
                          }
                          className="font-semibold text-[#171717] transition hover:text-[#B71C1C]"
                        >
                          {property.title}
                        </Link>
                        <p className="mt-1 text-xs text-black/55">
                          {property.propertyType} · {property.imageCount} foto
                          {property.imageCount === 1 ? "" : "s"}
                        </p>
                        {property.featured && (
                          <span className="mt-2 inline-flex rounded-full bg-[#B71C1C]/10 px-2.5 py-1 text-xs font-semibold text-[#B71C1C]">
                            Destacada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-black/70">
                      {property.operation}
                    </td>
                    <td className="px-5 py-5 text-black/70">
                      {[property.street, property.city]
                        .filter(Boolean)
                        .join(", ") || "Sin ubicación"}
                    </td>
                    <td className="px-5 py-5 font-semibold text-[#171717]">
                      {formatPrice(property)}
                    </td>
                    <td className="px-5 py-5 text-black/70">
                      <p>
                        {property.bedrooms || "—"} dorm. ·{" "}
                        {property.bathrooms || "—"} baños
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        {property.totalArea || "—"} m² total ·{" "}
                        {property.coveredArea || "—"} m² cub.
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex min-w-28 justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-center text-xs font-semibold ${statusStyles[property.status] ?? "border border-black/10 bg-black/5 text-black/65"}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-start gap-3 whitespace-nowrap">
                        <Link
                          href={`/admin/propiedades/${property.id}/editar`}
                          onClick={() => prepareExampleForEdit(property)}
                          aria-label={`Editar ${property.title}`}
                          title="Editar propiedad"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-orange-700 transition hover:bg-orange-50 hover:text-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700"
                        >
                          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          aria-label={`Eliminar ${property.title}`}
                          title="Eliminar propiedad"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDelete(property);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-red-700 transition hover:bg-red-50 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
                        >
                          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
