export type ButtonVariant = "primary" | "secondary" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[11px] font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#B71C1C] text-white hover:bg-[#8F1616]",
  secondary:
    "border border-black/15 bg-white text-[#303030] hover:border-black/25 hover:bg-black/[0.03]",
  ghost: "bg-transparent text-[#303030] hover:bg-black/[0.04] hover:text-[#8F1616]",
  text: "bg-transparent text-black/70 hover:text-[#B71C1C]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonVariantOptions = {}) {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
}
