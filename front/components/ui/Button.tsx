import type { ButtonHTMLAttributes } from "react";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/buttonVariants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClassName({ variant, size, className })}
    />
  );
}
