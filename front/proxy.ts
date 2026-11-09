import { NextRequest, NextResponse } from "next/server";
import { indexingEnabled, siteUrl } from "@/lib/seo";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const isCanonicalHost = siteUrl && request.headers.get("host") === new URL(siteUrl).host;
  if (!indexingEnabled || !isCanonicalHost || /^\/admin(?:\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
