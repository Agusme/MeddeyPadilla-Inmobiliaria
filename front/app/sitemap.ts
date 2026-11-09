import type { MetadataRoute } from "next";
import { absoluteUrl, indexingEnabled } from "@/lib/seo";
import { serverProperties } from "@/lib/serverProperties";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexingEnabled) return [];
  const properties = await serverProperties();
  return ["/", "/propiedades", "/servicios", "/conocenos", "/contacto", ...properties.map(property => `/propiedades/${encodeURIComponent(property.slug)}`)].map(path => ({ url: absoluteUrl(path)! }));
}
