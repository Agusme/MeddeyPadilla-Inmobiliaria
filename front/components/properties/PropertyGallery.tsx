"use client";

import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const move = (step: number) =>
    setActive((current) => (current + step + images.length) % images.length);

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#f4f4f4] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(38vw,32rem)]">
        <Image
          src={images[active]}
          alt={`${title} — foto ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm"
            >
              →
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
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm sm:w-28 ${index === active ? "ring-2 ring-[#B71C1C]" : "opacity-70"}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
