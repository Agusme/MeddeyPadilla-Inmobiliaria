import type { MetadataRoute } from "next";
import { absoluteUrl, indexingEnabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, ...(indexingEnabled ? { sitemap: absoluteUrl("/sitemap.xml") } : {}) };
}
