type StoredImage = { url: string; publicId?: string | null; position: number };

export function applyImageOrder(existing: StoredImage[], added: StoredImage[], rawOrder: unknown): StoredImage[] {
  const keyed = new Map<string, StoredImage>();
  existing.forEach((image, index) => keyed.set(`existing:${index}`, image));
  added.forEach((image, index) => keyed.set(`new:${index}`, image));
  if (rawOrder === undefined) {
    if (keyed.size > 12) throw new Error("Podés cargar hasta 12 imágenes.");
    return [...existing, ...added].map((image, position) => ({ ...image, position }));
  }
  let order: unknown;
  try { order = JSON.parse(String(rawOrder)); } catch { throw new Error("El orden de las imágenes no es válido."); }
  if (!Array.isArray(order) || order.some((key) => typeof key !== "string")) {
    throw new Error("El orden de las imágenes no es válido.");
  }
  if (order.length > 12) throw new Error("Podés cargar hasta 12 imágenes.");
  const reordered = (order as string[]).map((key, position) => {
    const image = keyed.get(key);
    if (!image) throw new Error("El orden de las imágenes no es válido.");
    keyed.delete(key);
    return { ...image, position };
  });
  // Saved images omitted from the order are removed only from the property on save.
  // Every uploaded file must be included, so no new upload is silently orphaned.
  if ([...keyed.keys()].some((key) => key.startsWith("new:"))) {
    throw new Error("El orden de las imágenes no es válido.");
  }
  return reordered;
}
