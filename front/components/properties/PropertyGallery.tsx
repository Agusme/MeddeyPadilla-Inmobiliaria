"use client";

import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const move = (step: number) => setActive((current) => (current + step + images.length) % images.length);

  return <div><div className="relative aspect-[4/3] overflow-hidden rounded-md bg-black/5 sm:aspect-[16/10]"><Image src={images[active]} alt={`${title} — foto ${active + 1}`} fill priority sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" /><button type="button" onClick={() => move(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm">←</button><button type="button" onClick={() => move(1)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl shadow-sm">→</button><span className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 text-xs text-white">{active + 1} / {images.length}</span></div><div className="mt-3 grid grid-cols-3 gap-3">{images.map((image, index) => <button key={image} type="button" onClick={() => setActive(index)} aria-label={`Ver foto ${index + 1}`} className={`relative aspect-[4/3] overflow-hidden rounded-sm ${index === active ? "ring-2 ring-[#B71C1C]" : "opacity-70"}`}><Image src={image} alt="" fill sizes="(min-width: 1024px) 22vw, 33vw" className="object-cover" /></button>)}</div></div>;
}
