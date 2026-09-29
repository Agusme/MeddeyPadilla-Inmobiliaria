"use client";

import { authenticateAdmin } from "@/components/auth/adminAuth";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    try {
      await authenticateAdmin(String(data.get("username") ?? ""), String(data.get("password") ?? ""));
      router.push("/admin/propiedades");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative flex min-h-[calc(100dvh-11rem)] items-center justify-center overflow-hidden bg-[#171717] bg-cover bg-center bg-no-repeat px-5 py-12 sm:px-8"
      style={{ backgroundImage: "url('/home/herohom.jpg')" }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
      <section
        aria-labelledby="admin-login-title"
        className="relative w-full max-w-md rounded-2xl border border-white/40 bg-white/95 p-7 shadow-[0_22px_50px_-25px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-9"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B71C1C]">
          Medde &amp; Padilla
        </p>
        <h1
          id="admin-login-title"
          className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]"
        >
          Administración
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/60">
          Ingresá tus datos para gestionar las propiedades.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-[#171717]">
            Usuario
            <input
              required
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresá tu usuario"
              className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/40 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
            />
          </label>

          <label className="block text-sm font-semibold text-[#171717]">
            Contraseña
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresá tu contraseña"
              className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/40 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm font-semibold text-[#B71C1C]">
              Usuario o contraseña incorrectos.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#B71C1C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F1616] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
}
