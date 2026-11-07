"use client";

import { useState } from "react";
import { preload } from "react-dom";
import { cloudinaryImageVariants } from "@/lib/cloudinaryImages";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const detailSizes = "(min-width: 1024px) 58vw, 100vw";

export default function PropertyGallery({ images, title, optimizeImages = false }: { images: string[]; title: string; optimizeImages?: boolean }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const move = (step: number) =>
    setActive((current) => (current + step + images.length) % images.length);

  const preparePhoto = (index: number) => {
    if (!optimizeImages || index === active) return;
    // Respect data-saving preferences and don't prefetch local/unsupported sources.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;
    const variants = cloudinaryImageVariants(images[index], "detail");
    if (variants) preload(variants.src, {
      as: "image", imageSrcSet: variants.srcSet, imageSizes: detailSizes, fetchPriority: "low",
    });
  };

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#f4f4f4] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(38vw,32rem)]">
        <ImageWithSkeleton
          src={images[active]}
          propertyImageUse={optimizeImages ? "detail" : undefined}
          revealImmediately={optimizeImages}
          eager={optimizeImages}
          alt={`${title} — foto ${active + 1}`}
          priority={active === 0}
          sizes={detailSizes}
          fit="contain"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              onPointerEnter={() => preparePhoto((active - 1 + images.length) % images.length)}
              onFocus={() => preparePhoto((active - 1 + images.length) % images.length)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              onPointerEnter={() => preparePhoto((active + 1) % images.length)}
              onFocus={() => preparePhoto((active + 1) % images.length)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <span className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 text-xs text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              onPointerEnter={() => preparePhoto(index)}
              onFocus={() => preparePhoto(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm sm:w-28 ${index === active ? "ring-2 ring-[#B71C1C]" : "opacity-70"}`}
            >
              <ImageWithSkeleton
                src={image}
                propertyImageUse={optimizeImages ? "thumbnail" : undefined}
                revealImmediately={optimizeImages}
                alt=""
                sizes="112px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
