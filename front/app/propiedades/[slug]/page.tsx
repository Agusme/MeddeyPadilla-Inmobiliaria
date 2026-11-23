import PropertyGallery from "@/components/properties/PropertyGallery";
import ButtonLink from "@/components/ui/ButtonLink";
import { Check } from "lucide-react";
import { toPublicProperty } from "@/components/properties/propertyRepository";
import { serverProperty } from "@/lib/serverProperties";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const raw = await serverProperty((await params).slug);
  const property = toPublicProperty(raw);
  return pageMetadata(property.title, [property.operation, property.type, property.location, property.description].join(". ").replace(/\s+/g, " ").slice(0, 160), "/propiedades/" + encodeURIComponent(raw.slug), property.images);
}

export default async function PropertyDetailPage({ params }: Props) {
  const raw = await serverProperty((await params).slug);
  const property = toPublicProperty(raw);
  const hasCharacteristics = property.features.length > 0;
  const hasComforts = property.comforts.length > 0 || Boolean(property.amenities);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 sm:py-12 lg:px-12">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "RealEstateListing",
        name: property.title, description: property.description,
        url: absoluteUrl("/propiedades/" + encodeURIComponent(raw.slug)),
        image: property.images.map(image => /^https?:\/\//.test(image) ? image : absoluteUrl(image)).filter(Boolean),
        mainEntity: { "@type": "Place", name: property.title, address: { "@type": "PostalAddress", streetAddress: raw.street, addressLocality: raw.city, addressCountry: "AR" } },
      }} />

      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <PropertyGallery images={property.images} title={property.title} optimizeImages />
        <aside className="h-fit border border-black/10 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B71C1C]">
            {property.operation} · {property.type}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#171717]">
            {property.title}
          </h1>
          <p className="mt-3 text-sm text-black/60">{property.location}</p>
          <p className="mt-6 text-2xl font-semibold text-[#171717]">
            {property.price}
          </p>
          <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-semibold text-[#171717]">
              ¿Te interesa esta propiedad?
            </p>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Escribinos para recibir más información o coordinar una visita.
            </p>
            <ButtonLink
              href="/contacto#contact-form"
              className="mt-5 w-full"
            >
              Consultar propiedad
            </ButtonLink>
          </div>
        </aside>
      </div>
      <section className="mt-12 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className={hasCharacteristics ? undefined : "lg:col-span-2"}>
          <h2 className="text-2xl font-semibold tracking-tight">Descripción</h2>
          <p className="mt-4 max-w-2xl leading-7 wrap-anywhere text-black/65">
            {property.description}
          </p>
        </div>
        {hasCharacteristics && <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Características
          </h2>
          <dl className="mt-5 grid grid-cols-2 text-center">
            {property.features.map((feature) => (
              <div
                key={feature.label}
                className="border-b border-r border-black/10 px-4 py-3 odd:border-l [&:nth-child(-n+2)]:border-t"
              >
                <dt className="text-xs uppercase tracking-wide text-black/50">
                  {feature.label}
                </dt>
                <dd className="mt-0.5 text-[15px]/[22px] font-semibold text-[#171717]">
                  {feature.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>}
        <div className={hasComforts ? undefined : "lg:col-span-2"}>
          <h2 className="text-2xl font-semibold tracking-tight">Ubicación</h2>
          <p className="mt-4 flex items-center gap-2 wrap-anywhere text-black/65">
            <span className="text-[#B71C1C]">●</span>
            {property.address}
          </p>
        </div>
        {hasComforts && <div>
          <h2 className="text-lg font-semibold tracking-tight">Ambientes y comodidades</h2>
          {property.comforts.length > 0 && <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
            {property.comforts.map((comfort) => <li key={comfort} className="flex items-center gap-2 text-sm text-black/70"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#B71C1C]" strokeWidth={2} />{comfort}</li>)}
          </ul>}
          {property.amenities && <p className="mt-4 whitespace-pre-line text-sm leading-6 wrap-anywhere text-black/65"><span className="font-semibold text-[#171717]">Comodidades adicionales: </span>{property.amenities}</p>}
        </div>}
      </section>
      <div className="mt-10 flex justify-end">
      <ButtonLink href="/propiedades">
        Ver todas las propiedades
      </ButtonLink>
      </div>
    </main>
  );
}
