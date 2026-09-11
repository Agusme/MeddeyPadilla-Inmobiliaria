"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export type NavbarItem = {
  label: string;
  href: string;
};

export type NavbarProps = {
  logo?: string;
  items?: NavbarItem[];
};

const defaultItems: NavbarItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Propiedades", href: "/propiedades" },
  { label: "Servicios", href: "/servicios" },
  { label: "Conocénos", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar({
  logo = "Medde Paddilla",
  items = defaultItems,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 bg-white shadow-sm">
      <nav
        aria-label="Navegacion principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <Link
          href="/"
          className="px-0 py-1 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/logo/logoHorizontal.png"
            alt={logo}
            width={220}
            height={38}
            className="h-auto w-45 sm:w-55"
            priority
          />
        </Link>

        <button
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          className="rounded-md p-2 text-black transition hover:bg-black/5 hover:text-[#B71C1C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div
          id="main-navigation"
          className={`${isOpen ? "flex" : "hidden"} absolute left-0 right-0 top-18.25 z-10 flex-col gap-1 border-b border-black/10 bg-white px-6 py-4 shadow-sm lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
              className={`rounded px-3 py-2 text-base font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] ${item.href === pathname ? "text-[#B71C1C]" : "text-black hover:text-[#B71C1C]"}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
