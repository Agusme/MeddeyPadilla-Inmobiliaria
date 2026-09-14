import Image from "next/image";

type PageHeroProps = {
  title: string;
};

export default function PageHero({ title }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/10 bg-[#171717] py-18 text-white">
      <Image src="/home/herohom.jpg" alt="" fill priority className="absolute z-0 object-cover object-center opacity-30" sizes="100vw" />
      <div className="absolute inset-0 z-0 bg-black/55" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
      </div>
    </section>
  );
}
