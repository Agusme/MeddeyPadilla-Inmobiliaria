import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export default function ButtonLink({
  children,
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center rounded-full bg-[#B71C1C] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#8F1616] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    >
      {children}
    </Link>
  );
}
