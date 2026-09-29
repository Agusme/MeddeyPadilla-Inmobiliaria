import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  titleAs?: "h1" | "h2";
  titleSize?: "default" | "compact";
  className?: string;
  titleId?: string;
  titleClassName?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  titleAs: Title = "h2",
  titleSize = "default",
  className = "",
  titleId,
  titleClassName = "",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B71C1C] sm:text-sm">
          {eyebrow}
        </p>
      )}
      <Title id={titleId} className={`${eyebrow ? "mt-3" : "mt-0"} ${titleSize === "compact" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-semibold leading-tight tracking-tight text-[#171717] ${titleClassName}`}>
        {title}
      </Title>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
          {description}
        </p>
      )}
    </div>
  );
}
