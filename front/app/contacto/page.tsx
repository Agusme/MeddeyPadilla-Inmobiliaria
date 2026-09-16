import SectionHeading from "@/components/ui/SectionHeading";
import GoogleMap from "@/components/contact/GoogleMap";

function LocationIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></svg>;
}

function PhoneIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8"><path d="M7.5 4.5 10 4l1.5 4-2 1.5a13 13 0 0 0 5 5L16 12.5l4 1.5-.5 2.5a2 2 0 0 1-2.1 1.5A14.5 14.5 0 0 1 6 6.6 2 2 0 0 1 7.5 4.5Z" /></svg>;
}

function FacebookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" /></svg>;
}

function InstagramIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" /></svg>;
}

export default function ContactoPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="mx-auto max-w-7xl px-0 py-12 sm:px-8 sm:py-16 lg:px-12">
        <header className="mb-9 px-6 sm:mb-10 sm:px-0">
          <SectionHeading eyebrow="Hablemos" title="Estamos para acompañarte" description="Contanos qué necesitás y te ayudamos a dar el próximo paso con la atención personalizada que buscás." />
        </header>

        <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_22px_50px_-25px_rgba(0,0,0,0.35)] sm:rounded-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section className="overflow-hidden bg-[#171717] p-6 text-white sm:p-8" aria-labelledby="contact-details-title">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e16a62]">Nuestra oficina</p>
            <h2 id="contact-details-title" className="mt-3 text-3xl font-semibold tracking-tight">Dónde encontrarnos</h2>
            <p className="mt-3 max-w-md leading-7 text-white/70">Acercate a nuestra oficina en el centro de San Miguel de Tucumán o contactanos por teléfono y WhatsApp.</p>
            <address className="mt-7 space-y-4 text-sm not-italic text-white/85">
              <a href="https://www.google.com/maps/search/?api=1&query=Congreso%20603%2C%20piso%205%2C%20oficina%20C%2C%20San%20Miguel%20de%20Tucum%C3%A1n" target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-[#e16a62]"><LocationIcon /><span>Congreso 603, piso 5, oficina C<br />San Miguel de Tucumán, Tucumán</span></a>
              <a href="tel:+5493816806570" className="flex items-center gap-3 transition hover:text-[#e16a62]"><PhoneIcon /><span>+54 9 3816 80-6570</span></a>
            </address>
            <a href="https://wa.me/5493816806570" target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#B71C1C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-[#8F1616] sm:w-fit">Escribinos por WhatsApp <span aria-hidden="true" className="ml-2">→</span></a>
            <div className="mt-8 overflow-hidden rounded-xl border border-white/15">
              <GoogleMap />
            </div>
            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">Seguinos</p>
              <div className="mt-3 flex gap-3">
                <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=61587494125747&mibextid=wwXIfr&rdid=F78yUKJ9Y8y1A3Tt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18DGxUozJ6%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer" className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#e16a62] hover:text-[#e16a62]"><FacebookIcon /></a>
                <a aria-label="Instagram" href="https://www.instagram.com/medde.padilla.inmob?igsh=eGI4ZXZ1bDd0dzh5&utm_source=qr" target="_blank" rel="noreferrer" className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#e16a62] hover:text-[#e16a62]"><InstagramIcon /></a>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10" aria-labelledby="contact-form-title">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B71C1C]">Consulta personalizada</p>
            <h2 id="contact-form-title" className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">Dejanos tu mensaje</h2>
            <p className="mt-3 leading-7 text-black/60">Completá el formulario y nos comunicaremos con vos a la brevedad.</p>
            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-[#171717]">Nombre y apellido<input required name="name" type="text" autoComplete="name" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" /></label>
                <label className="block text-sm font-semibold text-[#171717]">Teléfono<input required name="phone" type="tel" autoComplete="tel" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" /></label>
              </div>
              <label className="block text-sm font-semibold text-[#171717]">Correo electrónico<input required name="email" type="email" autoComplete="email" className="mt-2 h-12 w-full rounded-md border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" /></label>
              <label className="block text-sm font-semibold text-[#171717]">Mensaje<textarea required name="message" rows={5} className="mt-2 w-full resize-y rounded-md border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/15" /></label>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-[#B71C1C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B71C1C]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F1616] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] sm:w-fit">Enviar consulta <span aria-hidden="true" className="ml-2">→</span></button>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}
