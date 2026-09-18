import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import Link from "next/link";

export type PropertyCardData = {
  title: string;
  location: string;
  type: string;
  operation: string;
  price: string;
  image: string;
  slug: string;
};

type PropertyCardProps = {
  property: PropertyCardData;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${property.slug}`} className="block overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]">
      <div className="relative aspect-4/3 bg-black/5">
        <ImageWithSkeleton
          src={property.image}
          alt={property.title}
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
        <span className="inline-flex rounded-full border border-[#B71C1C] px-3 py-2 text-xs font-semibold text-[#B71C1C]">Ver propiedad</span>
      </div>
    </Link>
  );
}
