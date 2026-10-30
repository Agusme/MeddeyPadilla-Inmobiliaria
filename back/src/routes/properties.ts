import { applyImageOrder } from "../utils/propertyImageOrder";
import { randomUUID } from "node:crypto";
import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { Property } from "../models/Property";
import { deletePropertyImage, uploadPropertyImage } from "../services/cloudinary";
import { createSlug, optionalNumber } from "../utils/property";
import { parsePropertyAdditionalData } from "../utils/propertyAdditionalData";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 12, fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, done) => done(null, file.mimetype.startsWith("image/")),
});

type StoredImage = { url: string; publicId?: string | null; position: number };

const validPropertyTypes = [
  "Propiedad", "Depósito", "Galpón", "Fondo de comercio", "Cochera", "Finca",
  "Terreno", "Local comercial", "PH",
];
const legacyPropertyTypeAliases: Record<string, string> = {
  Casa: "Propiedad",
  Departamento: "Propiedad",
  Local: "Local comercial",
  Oficina: "Local comercial",
};

function serializeProperty(property: unknown) {
  const document = property as { toObject?: () => Record<string, unknown> } & Record<string, unknown>;
  const data = typeof document.toObject === "function" ? document.toObject() : document;
  const storedType = String(data.propertyType ?? "");
  const propertyType = legacyPropertyTypeAliases[storedType] ?? storedType;
  return { ...data, propertyType };
}

async function deleteUploadedImages(images: StoredImage[]) {
  await Promise.all(
    images.map(async (image) => {
      try {
        await deletePropertyImage(image.publicId ?? undefined);
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
  const propertyType = String(body.propertyType);
  if (!validPropertyTypes.includes(propertyType)) throw new Error("Tipo de propiedad no válido.");
  const price = optionalNumber(body.price);
  if (price === undefined) throw new Error("El precio debe ser válido.");
  const data: Record<string, unknown> = {
    title: String(body.title), operation: String(body.operation), propertyType, price,
    currency: String(body.currency), status: body.status === "published" ? "published" : "draft",
    street: String(body.street ?? ""), city: String(body.city), description: String(body.description),
    totalArea: optionalNumber(body.totalArea), coveredArea: optionalNumber(body.coveredArea),
    bedrooms: optionalNumber(body.bedrooms), bathrooms: optionalNumber(body.bathrooms), parkingSpaces: optionalNumber(body.parkingSpaces),
    featured: body.featured === true || body.featured === "true",
  };
  const optionalFields = ["floors"] as const;
  for (const field of optionalFields) {
    if (!(field in body)) continue;
    const raw = body[field];
    if (raw === "" || raw === null || raw === undefined) { data[field] = undefined; continue; }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0 || (field === "floors" && (!Number.isInteger(value) || value < 1))) {
      throw new Error(field === "floors" ? "La cantidad de plantas debe ser un entero positivo." : "Las expensas deben ser un número igual o mayor a 0.");
    }
    data[field] = value;
  }
  const booleanFields = ["balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished"] as const;
  for (const field of booleanFields) {
    if (!(field in body)) continue;
    if (body[field] === "true" || body[field] === true) data[field] = true;
    else if (body[field] === "false" || body[field] === false) data[field] = false;
    else throw new Error(`El valor de ${field} no es válido.`);
  }
  Object.assign(data, parsePropertyAdditionalData(body));
  return data;
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

  if (operation && !validOperations.includes(operation)) {
    return response.status(400).json({ message: "Tipo de operación no válido." });
  }
  if (type && !validPropertyTypes.includes(type)) {
    return response.status(400).json({ message: "Tipo de propiedad no válido." });
  }

  if (operation) filter.operation = operation;
  if (type) {
    const legacyTypes = type === "Propiedad"
      ? ["Casa", "Departamento"]
      : type === "Local comercial"
        ? ["Local", "Oficina"]
        : [];
    filter.propertyType = { $in: [type, ...legacyTypes] };
  }
  const properties = await Property.find(filter).sort({ featured: -1, createdAt: -1 });
  response.json(properties.map(serializeProperty));
});
propertiesRouter.get("/:slug", async (request, response) => {
  const property = await Property.findOne({ slug: request.params.slug, status: "published" });
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  response.json(serializeProperty(property));
});

export const adminPropertiesRouter = Router();
adminPropertiesRouter.use(requireAdmin);
adminPropertiesRouter.get("/", async (_request, response) => {
  const properties = await Property.find().sort({ createdAt: -1 });
  response.json(properties.map(serializeProperty));
});
adminPropertiesRouter.get("/:id", async (request, response) => {
  const property = await Property.findById(String(request.params.id));
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  response.json(serializeProperty(property));
});
adminPropertiesRouter.post("/", upload.array("images", 12), async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = bodyToProperty(request.body);
    data.featured = await validateFeatured(data.featured === true, String(data.status ?? "draft"));
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    const slug = `${createSlug(String(data.title)) || "propiedad"}-${randomUUID().slice(0, 8)}`;
    const orderedImages = applyImageOrder([], images, request.body.imageOrder);
    response.status(201).json(serializeProperty(await Property.create({ ...data, slug, images: orderedImages })));
  } catch (error) { await deleteUploadedImages(images); response.status(400).json({ message: error instanceof Error ? error.message : "Datos inválidos." }); }
});
adminPropertiesRouter.patch("/:id", upload.array("images", 12), async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = bodyToProperty(request.body);
    const id = String(request.params.id);
    data.featured = await validateFeatured(data.featured === true, String(data.status ?? "draft"), id);
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    let update: Record<string, unknown> = { ...data };
    const optionalFields = ["floors", "hasExpenses", "expenses", "balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished", "hasAmenities", "amenities"];
    const unset: Record<string, ""> = {};
    for (const field of optionalFields) {
      if ((field in request.body || field in data) && update[field] === undefined) { delete update[field]; unset[field] = ""; }
      else if (!(field in request.body)) delete update[field];
    }
    if (Object.keys(unset).length) update.$unset = unset;
    const existingImages: StoredImage[] = (await Property.findById(id).select("images").lean())?.images ?? [];
    if (images.length || request.body.imageOrder !== undefined) {
      update.images = applyImageOrder(existingImages, images, request.body.imageOrder);
    }
    if (Object.keys(unset).length) {
      const set = Object.fromEntries(Object.entries(update).filter(([key]) => !key.startsWith("$")));
      update = { $set: set, $unset: unset };
    }
    const property = await Property.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!property) {
      await deleteUploadedImages(images);
      return response.status(404).json({ message: "Propiedad no encontrada." });
    }
    response.json(serializeProperty(property));
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
