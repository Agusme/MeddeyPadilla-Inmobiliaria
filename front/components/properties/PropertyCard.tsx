import Image from "next/image";

export type PropertyCardData = {
  title: string;
  location: string;
  type: string;
  operation: string;
  price: string;
  image: string;
};

type PropertyCardProps = {
  property: PropertyCardData;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="overflow-hidden border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-4/3 bg-black/5">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <span className="absolute left-4 top-4 bg-[#B71C1C] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {property.operation}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B71C1C]">
            {property.type}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-black">
            {property.title}
          </h2>
          <p className="mt-1 text-sm text-black/55">{property.location}</p>
        </div>
        <p className="text-lg font-semibold text-black">{property.price}</p>
        <button
          type="button"
          className="rounded-full border border-[#B71C1C] px-3 py-2 text-xs font-semibold text-[#B71C1C] transition hover:bg-[#B71C1C] hover:text-white"
        >
          Ver propiedad
        </button>
      </div>
    </article>
  );
}
