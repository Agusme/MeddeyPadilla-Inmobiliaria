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
  const isLoginPage = pathname === "/admin";
  const authorized = isLoginPage ? authenticated === false : authenticated === true;

  useEffect(() => {
    if (isLoginPage && authenticated === true) {
      router.replace("/admin/propiedades");
    } else if (!isLoginPage && authenticated === false) {
      router.replace("/admin");
    }
  }, [isLoginPage, router, authenticated]);

  if (!authorized) {
    return <main className="min-h-screen bg-[#fafafa]" aria-busy="true" />;
  }

  return children;
}
