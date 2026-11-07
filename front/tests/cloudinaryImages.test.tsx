import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cloudinaryImageVariants } from "../lib/cloudinaryImages";
import ImageWithSkeleton from "../components/ui/ImageWithSkeleton";
import PropertyGallery from "../components/properties/PropertyGallery";

const src = "https://res.cloudinary.com/example/image/upload/v123/properties/photo.jpg";

test("delivery variants preserve the original path and use distinct responsive widths", () => {
  const thumbnail = cloudinaryImageVariants(src, "thumbnail")!;
  const card = cloudinaryImageVariants(src, "card")!;
  const detail = cloudinaryImageVariants(src, "detail")!;
  assert.match(thumbnail.src, /f_auto,q_auto,c_limit,w_224\/v123\/properties\/photo.jpg$/);
  assert.match(thumbnail.srcSet, /w_112\/.* 112w/);
  assert.match(card.srcSet, /w_960\/.* 960w/);
  assert.match(detail.srcSet, /w_2400\/.* 2400w/);
  assert.doesNotMatch(thumbnail.srcSet, /2400w/);
  assert.equal(src, "https://res.cloudinary.com/example/image/upload/v123/properties/photo.jpg");
});

test("local, unrelated, signed and non-image URLs are left alone", () => {
  for (const value of [
    "/image1.webp", "blob:local", "invalid", "https://example.com/photo.jpg",
    "https://res.cloudinary.com.example.com/example/image/upload/photo.jpg",
    "https://res.cloudinary.com/example/video/upload/video.mp4",
    "https://res.cloudinary.com/example/image/upload/s--signature--/photo.jpg",
  ]) assert.equal(cloudinaryImageVariants(value, "card"), null);
});

test("Cloudinary picture bypasses the Next optimizer while retaining lazy loading and skeleton", () => {
  const html = renderToStaticMarkup(createElement(ImageWithSkeleton, {
    src, alt: "Propiedad", sizes: "112px", propertyImageUse: "thumbnail",
  }));
  assert.match(html, /<picture><source[^>]*srcSet=/);
  assert.match(html, /sizes="112px"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /animate-pulse/);
  assert.doesNotMatch(html, /\/_next\/image/);
  assert.doesNotMatch(html, /rel="preload"/);
});

test("priority image preloads the same responsive variants as the picture", () => {
  const html = renderToStaticMarkup(createElement(ImageWithSkeleton, {
    src, alt: "Propiedad", sizes: "58vw", propertyImageUse: "detail", priority: true,
  }));
  assert.equal((html.match(/rel="preload"/g) ?? []).length, 1);
  assert.match(html, /imageSrcSet=/);
  assert.match(html, /imageSizes="58vw"/);
  assert.match(html, /loading="eager"/);
  assert.match(html, /fetchPriority="high"/);
});

test("local images keep their existing Next.js path even when optimization is requested", () => {
  const html = renderToStaticMarkup(createElement(ImageWithSkeleton, {
    src: "/image1.webp", alt: "Local", sizes: "100vw", propertyImageUse: "card",
  }));
  assert.doesNotMatch(html, /<picture>|f_auto|res.cloudinary.com/);
  assert.match(html, /loading="lazy"/);
});

test("public cards are visible without a load event while their skeleton stays behind the image", () => {
  const html = renderToStaticMarkup(createElement(ImageWithSkeleton, {
    src, alt: "Tarjeta", sizes: "33vw", propertyImageUse: "card", revealImmediately: true,
  }));
  const img = html.match(/<img\b[^>]*>/)![0];
  assert.doesNotMatch(img, /opacity-0|transition-opacity/);
  assert.match(img, /loading="lazy"/);
  assert.match(html, /animate-pulse/);
});

test("public gallery prioritizes only the initial photo and does not prefetch the whole gallery", () => {
  const html = renderToStaticMarkup(createElement(PropertyGallery, {
    images: [src, src.replace("photo.jpg", "other.jpg")], title: "Propiedad", optimizeImages: true,
  }));
  const images = html.match(/<img\b[^>]*>/g)!;
  assert.equal(images.length, 3);
  assert.match(images[0], /loading="eager"/);
  assert.match(images[0], /fetchPriority="high"/);
  assert.doesNotMatch(images[0], /opacity-0|transition-opacity/);
  assert.match(images[1], /loading="lazy"/);
  assert.match(images[2], /loading="lazy"/);
  assert.equal((html.match(/rel="preload"/g) ?? []).length, 1);
  const preloadTag = html.match(/<link[^>]*rel="preload"[^>]*>/)![0];
  const source = html.match(/<source[^>]*>/)![0];
  assert.equal(preloadTag.match(/imageSrcSet="([^"]+)"/)![1], source.match(/srcSet="([^"]+)"/)![1]);
  assert.equal(preloadTag.match(/imageSizes="([^"]+)"/)![1], source.match(/sizes="([^"]+)"/)![1]);
});

test("admin gallery retains its existing loading presentation", () => {
  const html = renderToStaticMarkup(createElement(PropertyGallery, {
    images: ["/image1.webp"], title: "Administración",
  }));
  assert.match(html, /animate-pulse/);
  assert.match(html, /opacity-0/);
  assert.match(html, /transition-opacity duration-300/);
});
