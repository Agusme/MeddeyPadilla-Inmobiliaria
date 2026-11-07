"use client";

import Image from "next/image";
import { useState } from "react";
import { preload } from "react-dom";
import { cloudinaryImageVariants, type PropertyImageUse } from "@/lib/cloudinaryImages";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
  propertyImageUse?: PropertyImageUse;
};

export default function ImageWithSkeleton({
  src,
  alt,
  sizes,
  priority = false,
  fit = "cover",
  containerClassName = "",
  imageClassName = "",
  skeletonClassName = "",
  propertyImageUse,
}: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;
  const hasError = errorSrc === src;
  const hasSource = Boolean(src.trim());
  const variants = propertyImageUse ? cloudinaryImageVariants(src, propertyImageUse) : null;

  // Match the picture source when preloading, rather than fetching its fallback too.
  if (variants && priority && !hasError) {
    preload(variants.src, { as: "image", imageSrcSet: variants.srcSet, imageSizes: sizes });
  }

  const image = (
    <Image
      src={variants?.src ?? src}
      alt={alt}
      fill
      unoptimized={variants ? true : undefined}
      priority={variants ? false : priority}
      loading={variants && priority ? "eager" : undefined}
      fetchPriority={variants && priority ? "high" : undefined}
      sizes={sizes}
      onLoad={() => setLoadedSrc(src)}
      onError={() => setErrorSrc(src)}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
    />
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
      aria-busy={hasSource && !isLoaded && !hasError}
    >
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${hasError || !hasSource ? "" : "animate-pulse"} bg-linear-to-br from-black/10 via-black/5 to-black/10 ${skeletonClassName}`}
        />
      )}
      {hasSource && !hasError && (
        variants ? (
          <picture>
            <source srcSet={variants.srcSet} sizes={sizes} />
            {image}
          </picture>
        ) : image
      )}
    </div>
  );
}
