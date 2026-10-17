import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/buttonVariants";

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function ButtonLink({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
    </Link>
  );
}
