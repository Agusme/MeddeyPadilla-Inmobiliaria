import AdminRouteGuard from "@/components/auth/AdminRouteGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración",
  description: "Acceso al panel de administración de propiedades.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
