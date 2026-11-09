import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { ApiProperty } from "@/lib/api";

async function publicRequest(path: string, propertyCanBeMissing = false) {
  // Service bindings reach Express directly, without public routing or Deployment Protection.
  // API_SERVER_URL remains available for local development or a separate backend.
  const origin = process.env.BACKEND_INTERNAL_URL || process.env.API_SERVER_URL
    || (process.env.NODE_ENV === "development" ? "http://localhost:4000" : undefined);
  if (!origin) {
    throw new Error("Falta el binding BACKEND_INTERNAL_URL o la configuración API_SERVER_URL para consultar propiedades.");
  }
  const url = new URL(path.replace(/^\//, ""), `${origin.replace(/\/+$/, "")}/`);
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch (cause) {
    throw new Error("No se pudo conectar con la API de propiedades.", { cause });
  }
  // An HTML 404 from a gateway or frontend is not a missing property in Express.
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (response.status === 404 && propertyCanBeMissing && isJson) notFound();
  if (!response.ok) throw new Error(`La API de propiedades respondió HTTP ${response.status}.`);
  if (!isJson) throw new Error("La API de propiedades no devolvió JSON. Revisar el origen del backend.");
  return response.json();
}

export const serverProperty = cache(async (slug: string): Promise<ApiProperty> => {
  const property: ApiProperty = await publicRequest(`/api/properties/${encodeURIComponent(slug)}`, true);
  if (property.status !== "published") notFound();
  return property;
});

export async function serverProperties(): Promise<ApiProperty[]> {
  const properties: ApiProperty[] = await publicRequest("/api/properties");
  return properties.filter(property => property.status === "published");
}
