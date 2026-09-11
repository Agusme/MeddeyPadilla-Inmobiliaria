import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { label: "Inicio", href: "/" },
  { label: "Propiedades", href: "/propiedades" },
  { label: "Servicios", href: "/servicios" },
  { label: "Conocénos", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

const propertyLinks = [
  { label: "Casa", href: "/propiedades?tipo=casa" },
  { label: "Departamento", href: "/propiedades?tipo=departamento" },
  { label: "Terreno", href: "/propiedades?tipo=terreno" },
  { label: "Locales", href: "/propiedades?tipo=locales" },
];

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.56 7.46L4 20l1.1-3.72A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M9.4 8.5c.2-.4.4-.42.7-.42h.45c.2 0 .4.08.5.38l.65 1.55c.1.23.08.42-.08.62l-.5.62c-.12.15-.1.3 0 .5.3.53 1.1 1.65 2.5 2.25.2.08.35.06.48-.1l.63-.76c.15-.18.32-.2.55-.1l1.5.7c.25.12.38.24.35.47-.06.48-.3 1.3-.88 1.55-.45.2-1.05.28-1.7.08-1.15-.35-2.48-1.2-3.48-2.2-.8-.8-1.7-2.1-1.9-3.1-.13-.64-.03-1.18.23-1.64Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M7.5 4.5 10 4l1.5 4-2 1.5a13 13 0 0 0 5 5L16 12.5l4 1.5-.5 2.5a2 2 0 0 1-2.1 1.5A14.5 14.5 0 0 1 6 6.6 2 2 0 0 1 7.5 4.5Z" />
    </svg>
  );
}

function ProfessionalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="7" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <rect x="14" y="12" width="7" height="8" rx="1" />
      <path d="M16 15h3M16 17.5h2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#151515] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="mx-auto mb-8 block w-fit"
          >
            <Image
              src="/logo/logoFooter1.png"
              alt="Medde & Padilla"
              width={200}
              height={68}
              className="h-auto w-36 sm:w-40"
            />
          </Link>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
            Navegación
          </h2>
          <ul className="space-y-3 text-sm text-white/75">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="transition hover:text-[#B71C1C]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
            Propiedades
          </h2>
          <ul className="space-y-3 text-sm text-white/75">
            {propertyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="transition hover:text-[#B71C1C]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">
            Seguinos
          </h2>
          <div className="flex gap-3">
            <a
              aria-label="Facebook"
              href="https://www.facebook.com/profile.php?id=61587494125747&mibextid=wwXIfr&rdid=F78yUKJ9Y8y1A3Tt&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18DGxUozJ6%2F%3Fmibextid%3DwwXIfr#"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#B71C1C] hover:text-[#B71C1C]"
            >
              <FacebookIcon />
            </a>
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/medde.padilla.inmob?igsh=eGI4ZXZ1bDd0dzh5&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#B71C1C] hover:text-[#B71C1C]"
            >
              <InstagramIcon />
            </a>
            <a
              aria-label="WhatsApp"
              href="https://wa.me/5493816806570"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 p-3 text-white transition hover:border-[#B71C1C] hover:text-[#B71C1C]"
            >
              <WhatsappIcon />
            </a>
          </div>
          <address className="mt-7 space-y-3 text-sm not-italic leading-6 text-white/75">
            <a
              href="https://maps.app.goo.gl/7s2iLpzWy1XDuCMPA"
              target="_blank"
              rel="noreferrer"
              aria-label="Ver ubicación en Google Maps"
              className="flex items-center gap-3 transition hover:text-[#B71C1C]"
            >
              <LocationIcon />
              <span>Congreso 603, piso 5, oficina C</span>
            </a>
            <a
              href="tel:+5493816806570"
              aria-label="Llamar al +54 9 3816 80-6570"
              className="flex items-center gap-3 transition hover:text-[#B71C1C]"
            >
              <PhoneIcon />
              <span>+54 9 3816 80-6570</span>
            </a>
            <p className="flex items-center gap-3">
              <ProfessionalIcon />
              <span>M.P. 666</span>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Medde & Padilla. Todos los derechos
        reservados.
        <p className="mt-2">
          Desarrollado por{" "}
          <a
            href="https://wa.me/543815633405"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[#B71C1C]"
          >
            Agustina Mena | Desarrollo web
          </a>
        </p>
      </div>
    </footer>
  );
}
