type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B71C1C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
