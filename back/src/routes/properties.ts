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

async function validateFeatured(featured: boolean, status: string, exceptId?: string) {
  if (!featured || status !== "published") return false;
  const filter = { status: "published", featured: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) };
  if (await Property.countDocuments(filter) >= 3) throw new Error("Ya hay 3 propiedades destacadas.");
  return true;
}

export const propertiesRouter = Router();
propertiesRouter.get("/", async (request, response) => {
  const filter: Record<string, unknown> = { status: "published" };
  if (request.query.operation) filter.operation = request.query.operation;
  if (request.query.type) filter.propertyType = request.query.type;
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
  try {
    const data = bodyToProperty(request.body);
    data.featured = await validateFeatured(data.featured, data.status);
    const images = ((request.files as Express.Multer.File[]) ?? []).map((file, position) => ({ url: `/uploads/${file.filename}`, position }));
    const slug = `${createSlug(data.title) || "propiedad"}-${randomUUID().slice(0, 8)}`;
    response.status(201).json(await Property.create({ ...data, slug, images }));
  } catch (error) { response.status(400).json({ message: error instanceof Error ? error.message : "Datos inválidos." }); }
});
adminPropertiesRouter.patch("/:id", upload.array("images", 12), async (request, response) => {
  try {
    const data = bodyToProperty(request.body);
    const id = String(request.params.id);
    data.featured = await validateFeatured(data.featured, data.status, id);
    const newImages = ((request.files as Express.Multer.File[]) ?? []).map((file, position) => ({ url: `/uploads/${file.filename}`, position }));
    const update: Record<string, unknown> = { ...data };
    if (newImages.length) update.$push = { images: { $each: newImages } };
    const property = await Property.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
    response.json(property);
  } catch (error) { response.status(400).json({ message: error instanceof Error ? error.message : "Datos inválidos." }); }
});
adminPropertiesRouter.delete("/:id", async (request, response) => {
  const property = await Property.findByIdAndDelete(String(request.params.id));
  if (!property) return response.status(404).json({ message: "Propiedad no encontrada." });
  response.status(204).send();
});
