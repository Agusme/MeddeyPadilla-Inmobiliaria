"use client";

import { isAdminAuthenticated } from "@/components/auth/adminAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const authorized = pathname === "/admin" || isAdminAuthenticated();

  useEffect(() => {
    if (pathname !== "/admin" && !isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [pathname, router]);

  if (!authorized) {
    return <main className="min-h-screen bg-[#fafafa]" aria-busy="true" />;
  }

  return children;
}
