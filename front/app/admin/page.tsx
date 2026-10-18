"use client";

import { authenticateAdmin } from "@/components/auth/adminAuth";
import Button from "@/components/ui/Button";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    try {
      await authenticateAdmin(String(data.get("username") ?? ""), String(data.get("password") ?? ""));
      router.replace("/admin/propiedades");
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
          <label className="relative block text-sm font-semibold text-[#171717]">
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

          <label className="relative block text-sm font-semibold text-[#171717]">
            Contraseña
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Ingresá tu contraseña"
              className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-black/40 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center text-black/50 transition-colors hover:text-[#B71C1C] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B71C1C]"
            >
              {showPassword
                ? <EyeOff aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                : <Eye aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
            </button>
          </label>

          {error && (
            <p role="alert" className="text-sm font-semibold text-[#B71C1C]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </section>
    </div>
  );
}
