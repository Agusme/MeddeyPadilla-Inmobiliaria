import type { Metadata } from "next";

function configuredOrigin(): string | undefined {
  const value = process.env.SITE_URL?.trim();
  if (!value) return undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("SITE_URL debe ser un origen absoluto sin ruta, credenciales, query ni hash.");
  }
  return url.origin;
}

export const siteUrl = configuredOrigin();
export const indexingEnabled = process.env.SEO_INDEXING_ENABLED === "true"
  && Boolean(siteUrl && new URL(siteUrl).protocol === "https:" && !new URL(siteUrl).hostname.endsWith(".vercel.app"))
  && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
export const siteName = "Medde & Padilla";
export const defaultDescription = "Medde & Padilla Inmobiliaria: propiedades, ventas, alquileres, tasaciones y administración en Tucumán.";
export const absoluteUrl = (path: string) => siteUrl ? new URL(path, siteUrl).href : undefined;

export function pageMetadata(title: string, description: string, path: string, images = ["/logo/logoHorizontal.png"]): Metadata {
  const url = absoluteUrl(path);
  const absoluteImages = images.map(image => /^https?:\/\//.test(image) ? image : absoluteUrl(image)).filter((image): image is string => Boolean(image));
  return {
    title: { absolute: `${title} | ${siteName}` }, description,
    ...(url ? { alternates: { canonical: url } } : {}),
    robots: { index: indexingEnabled, follow: true },
    openGraph: { type: "website", locale: "es_AR", siteName, title: `${title} | ${siteName}`, description, ...(url ? { url } : {}), images: absoluteImages },
    twitter: { card: "summary_large_image", title: `${title} | ${siteName}`, description, images: absoluteImages },
  };
}
