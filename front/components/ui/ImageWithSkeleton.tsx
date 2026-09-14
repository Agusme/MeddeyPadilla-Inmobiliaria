"use client";

import Image from "next/image";
import { useState } from "react";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
};

export default function ImageWithSkeleton({
  src,
  alt,
  sizes,
  priority = false,
  containerClassName = "",
  imageClassName = "",
  skeletonClassName = "",
}: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;
  const hasError = errorSrc === src;

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
      aria-busy={!isLoaded && !hasError}
    >
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse bg-linear-to-br from-black/10 via-black/5 to-black/10 ${skeletonClassName}`}
        />
      )}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setErrorSrc(src)}
          className={`object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
        />
      )}
    </div>
  );
}
