import { randomUUID } from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { Property } from "../models/Property";
import { deletePropertyImage, uploadPropertyImage } from "../services/cloudinary";
import { createSlug, optionalNumber } from "../utils/property";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 12, fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, done) => done(null, file.mimetype.startsWith("image/")),
});

type StoredImage = { url: string; publicId?: string; position: number };

async function deleteUploadedImages(images: StoredImage[]) {
  await Promise.all(
    images.map(async (image) => {
      try {
        await deletePropertyImage(image.publicId);
      } catch (error) {
        console.error(`No se pudo limpiar la imagen ${image.publicId}:`, error);
      }
    }),
  );
}

async function uploadImages(files: Express.Multer.File[]): Promise<StoredImage[]> {
  const images: StoredImage[] = [];

  try {
    for (const [position, file] of files.entries()) {
      const image = await uploadPropertyImage(file);
      images.push({ ...image, position });
    }
    return images;
  } catch (error) {
    await deleteUploadedImages(images);
    throw error;
  }
}

function bodyToProperty(body: Record<string, unknown>) {
  const required = ["title", "operation", "propertyType", "price", "currency", "city", "description"];
  if (required.some((key) => !body[key])) throw new Error("Completá todos los campos obligatorios.");
  const price = optionalNumber(body.price);
  if (price === undefined) throw new Error("El precio debe ser válido.");
  return {
    title: String(body.title), operation: String(body.operation), propertyType: String(body.propertyType), price,
    currency: String(body.currency), status: body.status === "published" ? "published" : "draft",
    street: String(body.street ?? ""), city: String(body.city), description: String(body.description),
    totalArea: optionalNumber(body.totalArea), coveredArea: optionalNumber(body.coveredArea),
    bedrooms: optionalNumber(body.bedrooms), bathrooms: optionalNumber(body.bathrooms), parkingSpaces: optionalNumber(body.parkingSpaces),
    amenities: body.amenities ? String(body.amenities) : undefined,
    featured: body.featured === true || body.featured === "true",
  };
}

function applyImageOrder(existing: StoredImage[], added: StoredImage[], rawOrder: unknown): StoredImage[] {
  const keyed = new Map<string, StoredImage>();
  existing.forEach((image, index) => keyed.set(`existing:${index}`, image));
  added.forEach((image, index) => keyed.set(`new:${index}`, image));
  if (rawOrder === undefined) return [...existing, ...added].map((image, position) => ({ ...image, position }));
  let order: unknown;
  try { order = JSON.parse(String(rawOrder)); } catch { throw new Error("El orden de las imágenes no es válido."); }
  if (!Array.isArray(order) || order.length !== keyed.size || order.some((key) => typeof key !== "string")) {
    throw new Error("El orden de las imágenes no es válido.");
  }
  const reordered = (order as string[]).map((key) => {
    const image = keyed.get(key);
    if (!image) throw new Error("El orden de las imágenes no es válido.");
    keyed.delete(key);
    return { ...image, position: 0 };
  });
  if (keyed.size) throw new Error("El orden de las imágenes no es válido.");
  return reordered.map((image, position) => ({ ...image, position }));
}

async function validateFeatured(featured: boolean, status: string, exceptId?: string) {
  if (!featured || status !== "published") return false;
  const filter = { status: "published", featured: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) };
  if (await Property.countDocuments(filter) >= 3) throw new Error("Ya hay 3 propiedades destacadas.");
  return true;
}

export const propertiesRouter = Router();
propertiesRouter.get("/", async (request, response) => {
  const filter: Record<string, unknown> = { status: "published" };

  const operation = typeof request.query.operation === "string" ? request.query.operation.trim() : "";
  const type = typeof request.query.type === "string" ? request.query.type.trim() : "";
  const validOperations = ["Venta", "Alquiler"];
  const validTypes = ["Casa", "Departamento", "Terreno", "Local"];

  if (operation && !validOperations.includes(operation)) {
    return response.status(400).json({ message: "Tipo de operación no válido." });
  }
  if (type && !validTypes.includes(type)) {
    return response.status(400).json({ message: "Tipo de propiedad no válido." });
  }

  if (operation) filter.operation = operation;
  if (type) filter.propertyType = type;
  response.json(await Property.find(filter).sort({ featured: -1, createdAt: -1 }));
});
propertiesRouter.get("/:slug", async (request, response) => {
  const property = await Property.findOne({ slug: request.params.slug, status: "published" });
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  response.json(property);
});

export const adminPropertiesRouter = Router();
adminPropertiesRouter.use(requireAdmin);
adminPropertiesRouter.get("/", async (_request, response) => response.json(await Property.find().sort({ createdAt: -1 })));
adminPropertiesRouter.get("/:id", async (request, response) => {
  const property = await Property.findById(String(request.params.id));
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  response.json(property);
});
adminPropertiesRouter.post("/", upload.array("images", 12), async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = bodyToProperty(request.body);
    data.featured = await validateFeatured(data.featured, data.status);
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    const slug = `${createSlug(data.title) || "propiedad"}-${randomUUID().slice(0, 8)}`;
    const orderedImages = applyImageOrder([], images, request.body.imageOrder);
    response.status(201).json(await Property.create({ ...data, slug, images: orderedImages }));
  } catch (error) { await deleteUploadedImages(images); response.status(400).json({ message: error instanceof Error ? error.message : "Datos inválidos." }); }
});
adminPropertiesRouter.patch("/:id", upload.array("images", 12), async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = bodyToProperty(request.body);
    const id = String(request.params.id);
    data.featured = await validateFeatured(data.featured, data.status, id);
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    const update: Record<string, unknown> = { ...data };
    const existingImages: StoredImage[] = (await Property.findById(id).select("images").lean())?.images ?? [];
    if (images.length || request.body.imageOrder !== undefined) {
      update.images = applyImageOrder(existingImages, images, request.body.imageOrder);
    }
    const property = await Property.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!property) {
      await deleteUploadedImages(images);
      return response.status(404).json({ message: "Propiedad no encontrada." });
    }
    response.json(property);
  } catch (error) { await deleteUploadedImages(images); response.status(400).json({ message: error instanceof Error ? error.message : "Datos inválidos." }); }
});
adminPropertiesRouter.delete("/:id", async (request, response) => {
  const property = await Property.findByIdAndDelete(String(request.params.id));
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  const images: StoredImage[] = property.images.flatMap((image, position) =>
    image.publicId ? [{ url: image.url, publicId: image.publicId, position }] : [],
  );
  await deleteUploadedImages(images);
  response.status(204).send();
});
