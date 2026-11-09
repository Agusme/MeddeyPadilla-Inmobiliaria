import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ApiProperty } from "@/lib/api";

async function publicRequest(path: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const origin = process.env.API_SERVER_URL
    || (process.env.NODE_ENV === "development" ? "http://localhost:4000"
      : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://${host}`);
  const response = await fetch(new URL(path, origin), { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`La API pública de propiedades respondió ${response.status}`);
  return response.json();
}

export const serverProperty = cache(async (slug: string): Promise<ApiProperty> => {
  const property: ApiProperty = await publicRequest(`/api/properties/${encodeURIComponent(slug)}`);
  if (property.status !== "published") notFound();
  return property;
});

export async function serverProperties(): Promise<ApiProperty[]> {
  const properties: ApiProperty[] = await publicRequest("/api/properties");
  return properties.filter(property => property.status === "published");
}
