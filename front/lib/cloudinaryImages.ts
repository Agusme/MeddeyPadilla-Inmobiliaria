export type PropertyImageUse = "thumbnail" | "card" | "detail";

const widthsByUse: Record<PropertyImageUse, number[]> = {
  thumbnail: [96, 112, 192, 224, 336],
  card: [320, 480, 640, 750, 960, 1200, 1600],
  detail: [480, 640, 750, 960, 1200, 1600, 1920, 2400],
};

// Only unsigned Cloudinary image uploads support these delivery transformations.
// Other URLs keep their existing Next.js delivery path, including local assets.
export function cloudinaryImageVariants(src: string, use: PropertyImageUse) {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "res.cloudinary.com" ||
    url.port || url.username || url.password ||
    !/^\/[^/]+\/image\/upload\/(?!s--)[^/]/.test(url.pathname)
  ) return null;

  const widths = widthsByUse[use];
  const transformed = (width: number) => {
    const variant = new URL(url.href);
    // Keep the original aspect ratio and never upscale the source image.
    variant.pathname = variant.pathname.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,c_limit,w_${width}/`,
    );
    return variant.href;
  };

  return {
    src: transformed(use === "thumbnail" ? 224 : use === "card" ? 960 : 1600),
    srcSet: widths.map((width) => `${transformed(width)} ${width}w`).join(", "),
  };
}
