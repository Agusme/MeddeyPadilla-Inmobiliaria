import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Ruler } from "lucide-react";

export type PropertyCardData = {
  title: string;
  location: string;
  type: string;
  operation: string;
  price: string;
  image: string;
  slug: string;
  details?: string[];
  href?: string;
};

type PropertyCardProps = {
  property: PropertyCardData;
};

function FeatureIcon({ detail }: { detail: string }) {
  const Icon = detail.includes("dormitorio")
    ? BedDouble
    : detail.includes("baño")
      ? Bath
      : Ruler;
  return <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={property.href ?? `/propiedades/${property.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B71C1C]"
    >
      <div className="relative aspect-[3/2] bg-black/5">
        <ImageWithSkeleton
          src={property.image}
          alt={property.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 pb-5 sm:p-5 sm:pb-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8B2635]">
              {property.type} en {property.operation}
            </p>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-black/55 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-3 line-clamp-2 min-h-[2.75rem] text-lg font-medium leading-[1.3] tracking-tight text-black sm:text-xl">
            {property.title}
          </h2>
          <p className="mt-0.5 line-clamp-1 text-sm text-black/55">{property.location}</p>
        </div>
        {property.details?.length ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-black/60" aria-label="Características">
            {property.details.map((detail) => (
              <li key={detail} className="inline-flex items-center gap-1.5">
                <FeatureIcon detail={detail} />
                {detail.includes("dormitorio") || detail.includes("baño") ? (
                  <>
                    <span className="sr-only">{detail}</span>
                    <span aria-hidden="true">{detail.split(" ")[0]}</span>
                  </>
                ) : detail}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex items-end justify-end gap-3 pt-2">
          <p className="text-right text-[22px] font-semibold text-black">{property.price}</p>
        </div>
      </div>
    </Link>
  );
}
