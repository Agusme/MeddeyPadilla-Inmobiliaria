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
  details?: string[];
  href?: string;
};

type PropertyCardProps = {
  property: PropertyCardData;
};

function FeatureIcon({ detail }: { detail: string }) {
  const paths = detail.includes("dormitorio")
    ? "M3 15V6m0 6h14v3M5 12V9h4a2 2 0 0 1 2 2v1m0 0V8h4a2 2 0 0 1 2 2v2M3 17v-2m14 2v-2"
    : detail.includes("baño")
      ? "M3 10h14v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Zm2 0V5a2 2 0 0 1 4 0v1m-6 10-.8 1.5M15 16l.8 1.5"
      : "M4 4h12v12H4zM4 9h12M9 4v12";

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
      <path d={paths} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-black/55 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5">
              <path d="M7 13 14 6M7 6h7v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
