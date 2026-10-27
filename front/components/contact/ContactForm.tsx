"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Button from "@/components/ui/Button";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm({ initialMessage = "" }: { initialMessage?: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;

    const timeout = window.setTimeout(() => setStatus("idle"), 6000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const templateParams = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (!response.ok) throw new Error("EmailJS request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#171717]">
          Nombre y apellido
          <input required name="name" type="text" autoComplete="name" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" />
        </label>
        <label className="block text-sm font-semibold text-[#171717]">
          Teléfono
          <input required name="phone" type="tel" autoComplete="tel" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" />
        </label>
      </div>
      <label className="block text-sm font-semibold text-[#171717]">
        Correo electrónico
        <input required name="email" type="email" autoComplete="email" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" />
      </label>
      <label className="block text-sm font-semibold text-[#171717]">
        Mensaje
        <textarea required name="message" defaultValue={initialMessage} rows={5} className="mt-2 w-full resize-y rounded-md border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" />
      </label>
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-fit">
        {status === "sending" ? "Enviando…" : "Enviar consulta"}{" "}
        {status === "sending" ? <LoaderCircle aria-hidden="true" className="ml-2 h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" strokeWidth={1.8} />}
      </Button>
      <p aria-live="polite" role={status === "error" ? "alert" : "status"} className={`text-sm ${status === "error" ? "text-red-700" : "text-black/65"}`}>
        {status === "success" && "¡Gracias! Recibimos tu consulta y nos comunicaremos con vos pronto."}
        {status === "error" && "No pudimos enviar tu consulta. Intentá nuevamente en unos minutos o escribinos por WhatsApp."}
      </p>
    </form>
  );
}
