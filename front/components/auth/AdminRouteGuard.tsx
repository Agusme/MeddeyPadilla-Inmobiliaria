"use client";

import { useAdminAuthenticated } from "@/components/auth/useAdminAuthenticated";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useAdminAuthenticated();
  const authorized = pathname === "/admin" || authenticated === true;

  useEffect(() => {
    if (pathname !== "/admin" && authenticated === false) {
      router.replace("/admin");
    }
  }, [pathname, router, authenticated]);

  if (!authorized) {
    return <main className="min-h-screen bg-[#fafafa]" aria-busy="true" />;
  }

  return children;
}
