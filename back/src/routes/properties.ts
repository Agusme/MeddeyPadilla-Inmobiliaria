import { applyImageOrder, maxPropertyPhotoBytes, maxPropertyPhotos, propertyPhotoLimitMessage } from "../utils/propertyImageOrder";
import { createHash, randomUUID } from "node:crypto";
import { Router, type RequestHandler, type Response } from "express";
import mongoose, { type ClientSession } from "mongoose";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { Property } from "../models/Property";
import { PropertyUploadSession } from "../models/PropertyUploadSession";
import { deletePropertyImage, uploadPropertyImage } from "../services/cloudinary";
import {
  authorizePropertyUploads, orderDirectImages, PropertyUploadRequestError, readDirectPropertySave,
  uploadSessionId, verifyDirectPropertyImages,
} from "../services/propertyUploads";
import { createSlug, optionalNumber } from "../utils/property";
import { parsePropertyAdditionalData } from "../utils/propertyAdditionalData";
import { validPropertyTypes, legacyPropertyTypeAliases } from "../utils/propertyTypes";
import { sendUserError } from "../utils/userError";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: maxPropertyPhotos, fileSize: maxPropertyPhotoBytes },
  fileFilter: (_request, file, done) => done(null, file.mimetype.startsWith("image/")),
});

const parseImages = upload.array("images", maxPropertyPhotos);
const receiveImages: RequestHandler = (request, response, next) => {
  parseImages(request, response, (error: unknown) => {
    if (!(error instanceof multer.MulterError)) return next(error);
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "La imagen supera el tamaño máximo permitido de 8 MB."
      : error.code === "LIMIT_FILE_COUNT" || (error.code === "LIMIT_UNEXPECTED_FILE" && error.field === "images")
        ? propertyPhotoLimitMessage
        : "No se pudieron recibir las imágenes.";
    sendUserError(response, 400, message);
  });
};

type StoredImage = { url: string; publicId?: string | null; position: number };

class PropertyInputError extends Error {}
class PropertyUploadError extends Error {}

function validatePropertyInput<T>(validate: () => T): T {
  try {
    return validate();
  } catch (error) {
    if (!(error instanceof Error) || error instanceof TypeError) throw error;
    throw new PropertyInputError(error.message, { cause: error });
  }
}

function sendPropertySaveError(response: Response, error: unknown) {
  if (error instanceof PropertyUploadRequestError) {
    if (error.status >= 500) console.error("Error en la sesión de fotos:", error);
    return sendUserError(response, error.status, error.message, { missingDigests: error.missingDigests });
  }
  if (error instanceof PropertyInputError) {
    return sendUserError(response, 400, error.message);
  }
  if (error instanceof mongoose.Error.ValidationError) {
    console.error("Validación de propiedad:", error);
    const labels: Record<string, string> = {
      title: "título", operation: "operación", propertyType: "tipo de propiedad", price: "precio",
      currency: "moneda", city: "localidad", description: "descripción", totalArea: "superficie total",
      coveredArea: "superficie cubierta", bedrooms: "dormitorios", bathrooms: "baños",
      parkingSpaces: "cocheras", floors: "plantas", expenses: "expensas", images: "fotografías",
    };
    const fields = [...new Set(Object.keys(error.errors).flatMap(path => {
      const label = labels[path.split(".")[0]];
      return label ? [label] : [];
    }))];
    return sendUserError(response, 400, fields.length ? `Revisá estos campos antes de guardar: ${fields.join(", ")}.` : "Revisá los datos ingresados antes de guardar.");
  }
  if (error instanceof mongoose.Error.CastError && error.path === "_id") {
    return sendUserError(response, 400, "No pudimos encontrar la propiedad. Volvé al listado y abrila desde allí.");
  }

  console.error("Error al guardar la propiedad:", error);
  if (error instanceof PropertyUploadError) {
    return sendUserError(response, 502, error.message);
  }
  return sendUserError(response, 500, "No pudimos confirmar el guardado. Revisá si la propiedad se guardó antes de reintentar.", { outcomeUncertain: true });
}

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
  const hashes = new Set(files.map(({ buffer }) => createHash("sha256").update(buffer).digest("hex")));
  if (hashes.size !== files.length) throw new PropertyInputError("Hay imágenes repetidas en la carga. Eliminá las copias antes de guardar.");
  const images: StoredImage[] = [];

  try {
    for (const [position, file] of files.entries()) {
      const image = await uploadPropertyImage(file);
      images.push({ ...image, position });
    }
    return images;
  } catch (error) {
    await deleteUploadedImages(images);
    throw new PropertyUploadError("No pudimos subir las fotos. Revisá los archivos e intentá nuevamente.", { cause: error });
  }
}

function bodyToProperty(body: Record<string, unknown>) {
  const required = ["title", "operation", "propertyType", "price", "currency", "city", "description"];
  if (required.some((key) => !body[key])) throw new Error("Completá todos los campos obligatorios.");
  const propertyType = String(body.propertyType);
  if (!validPropertyTypes.includes(propertyType)) throw new Error("Seleccioná un tipo de propiedad válido.");
  const price = optionalNumber(body.price);
  if (price === undefined) throw new Error("Ingresá un precio válido.");
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
    if (!Number.isFinite(value) || value < 0 || (field === "floors" && (!Number.isInteger(value)))) {
      throw new Error(field === "floors" ? "La cantidad de plantas debe ser un entero igual o mayor a 0." : "Las expensas deben ser un número igual o mayor a 0.");
    }
    data[field] = value;
  }
  const booleanFields = ["balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished"] as const;
  for (const field of booleanFields) {
    if (!(field in body)) continue;
    if (body[field] === "true" || body[field] === true) data[field] = true;
    else if (body[field] === "false" || body[field] === false) data[field] = false;
    else throw new Error("Revisá las opciones de ambientes y comodidades antes de guardar.");
  }
  Object.assign(data, parsePropertyAdditionalData(body));
  return data;
}

async function validateFeatured(featured: boolean, status: string, exceptId?: string, session?: ClientSession) {
  if (!featured || status !== "published") return false;
  const filter = { status: "published", featured: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) };
  const count = Property.countDocuments(filter);
  if (await (session ? count.session(session) : count) >= 3) throw new PropertyInputError("Ya hay 3 propiedades destacadas. Quitá otra de destacados para agregar esta.");
  return true;
}

function editPropertyUpdate(data: Record<string, unknown>, body: Record<string, unknown>, images?: StoredImage[]) {
  const update = { ...data };
  const optionalFields = ["bedrooms", "bathrooms", "parkingSpaces", "floors", "hasExpenses", "expenses", "balcony", "serviceRoom", "backyard", "patio", "laundryRoom", "grill", "quincho", "pool", "kitchen", "livingRoom", "diningRoom", "toilette", "furnished", "hasAmenities", "amenities"];
  const unset: Record<string, ""> = {};
  for (const field of optionalFields) {
    if (["bedrooms", "bathrooms", "parkingSpaces"].includes(field) && !(field in body)) { delete update[field]; continue; }
    if ((field in body || field in data) && update[field] === undefined) { delete update[field]; unset[field] = ""; }
    else if (!(field in body)) delete update[field];
  }
  if (images) update.images = images;
  return Object.keys(unset).length ? { $set: update, $unset: unset } : update;
}

export const propertiesRouter = Router();
propertiesRouter.get("/", async (request, response) => {
  const filter: Record<string, unknown> = { status: "published" };

  const operation = typeof request.query.operation === "string" ? request.query.operation.trim() : "";
  const type = typeof request.query.type === "string" ? request.query.type.trim() : "";
  const validOperations = ["Venta", "Alquiler"];

  if (operation && !validOperations.includes(operation)) {
    return sendUserError(response, 400, "Seleccioná un tipo de operación válido.");
  }
  if (type && !validPropertyTypes.includes(type)) {
    return sendUserError(response, 400, "Seleccioná un tipo de propiedad válido.");
  }

  if (operation) filter.operation = operation;
  if (type) {
    const legacyTypes = type === "Local comercial" ? ["Local"] : [];
    filter.propertyType = { $in: [type, ...legacyTypes] };
  }
  const properties = await Property.find(filter).sort({ featured: -1, createdAt: -1 });
  response.json(properties.map(serializeProperty));
});
propertiesRouter.get("/:slug", async (request, response) => {
  const property = await Property.findOne({ slug: request.params.slug, status: "published" });
  if (!property) return sendUserError(response, 404, "No encontramos la propiedad.");
  response.json(serializeProperty(property));
});

export const adminPropertiesRouter = Router();
adminPropertiesRouter.use(requireAdmin);
adminPropertiesRouter.post("/upload-sessions/:id", async (request, response) => {
  try {
    const id = uploadSessionId(request.params.id);
    const uploads = await authorizePropertyUploads(id, response.locals.adminUsername, request.body ?? {});
    response.json({ uploads });
  } catch (error) {
    sendPropertySaveError(response, error);
  }
});

adminPropertiesRouter.post("/upload-sessions/:id/save", async (request, response) => {
  try {
    const id = uploadSessionId(request.params.id);
    const owner = response.locals.adminUsername as string;
    const { fields, order, digests, hash } = readDirectPropertySave(request.body ?? {});
    const registered = await PropertyUploadSession.findOne({ _id: id, owner }).lean();
    if (!registered) throw new PropertyUploadRequestError("No encontramos esta carga de fotos. Volvé a abrir el formulario.", 404);

    async function replay(receipt: { requestHash?: string | null; resultId?: string | null }) {
      if (receipt.requestHash !== hash) throw new PropertyUploadRequestError("Este guardado ya se completó con otros datos. Revisá el listado antes de volver a guardar.", 409);
      const property = await Property.findById(receipt.resultId);
      if (!property) throw new PropertyUploadRequestError("La propiedad guardada ya no está disponible.", 410);
      return serializeProperty(property);
    }

    if (registered.resultId) return response.json(await replay(registered));
    if (registered.expiresAt <= new Date()) throw new PropertyUploadRequestError("La sesión de fotos venció. Volvé a abrir el formulario.", 409);
    const validatedData = validatePropertyInput(() => bodyToProperty(fields));
    const added = await verifyDirectPropertyImages(id, digests, registered.publicIds);
    const outcome = await Property.db.transaction(async session => {
      const current = await PropertyUploadSession.findOne({ _id: id, owner }).session(session);
      if (!current) throw new PropertyUploadRequestError("No encontramos esta carga de fotos. Volvé a abrir el formulario.", 404);
      if (current.resultId) return { receipt: current };
      if (current.expiresAt <= new Date()) throw new PropertyUploadRequestError("La sesión de fotos venció. Volvé a abrir el formulario.", 409);

      const propertyId = current.propertyId;
      const existing = propertyId ? await Property.findById(propertyId).session(session).lean() : null;
      if (propertyId && !existing) throw new PropertyUploadRequestError("Propiedad no encontrada.", 404);
      if (existing && (existing.updatedAt?.toISOString() ?? null) !== current.revision) {
        throw new PropertyUploadRequestError("La propiedad cambió. Volvé a abrir la edición.", 409);
      }
      const images = validatePropertyInput(() => orderDirectImages(existing?.images ?? [], added, order));
      const data = { ...validatedData };
      data.featured = await validateFeatured(data.featured === true, String(data.status ?? "draft"), propertyId ?? undefined, session);
      const updatedAt = new Date(Math.max(Date.now(), (existing?.updatedAt?.getTime() ?? 0) + 1));
      const saved = propertyId
        ? await Property.findByIdAndUpdate(propertyId, editPropertyUpdate({ ...data, updatedAt }, fields, images), {
          session, new: true, runValidators: true, timestamps: false,
        })
        : await new Property({ ...data, slug: `${createSlug(String(data.title)) || "propiedad"}-${id}`, images }).save({ session });
      if (!saved) throw new PropertyUploadRequestError("Propiedad no encontrada.", 404);

      const kept = new Set(images.map(image => image.publicId));
      current.retiredIds = (existing?.images ?? []).flatMap(image => image.publicId && !kept.has(image.publicId) ? [image.publicId] : []);
      current.requestHash = hash;
      current.resultId = saved.id;
      await current.save({ session });
      return { property: serializeProperty(saved) };
    });
    response.status(outcome.receipt || registered.propertyId ? 200 : 201)
      .json(outcome.receipt ? await replay(outcome.receipt) : outcome.property);
  } catch (error) {
    sendPropertySaveError(response, error);
  }
});
adminPropertiesRouter.get("/", async (_request, response) => {
  const properties = await Property.find().sort({ createdAt: -1 });
  response.json(properties.map(serializeProperty));
});
adminPropertiesRouter.get("/:id", async (request, response) => {
  const property = await Property.findById(String(request.params.id));
  if (!property) return sendUserError(response, 404, "No encontramos la propiedad.");
  response.json(serializeProperty(property));
});
adminPropertiesRouter.post("/", receiveImages, async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = validatePropertyInput(() => bodyToProperty(request.body));
    data.featured = await validateFeatured(data.featured === true, String(data.status ?? "draft"));
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    const slug = `${createSlug(String(data.title)) || "propiedad"}-${randomUUID().slice(0, 8)}`;
    const orderedImages = validatePropertyInput(() => applyImageOrder([], images, request.body.imageOrder));
    response.status(201).json(serializeProperty(await Property.create({ ...data, slug, images: orderedImages })));
  } catch (error) {
    await deleteUploadedImages(images);
    sendPropertySaveError(response, error);
  }
});
adminPropertiesRouter.patch("/:id", receiveImages, async (request, response) => {
  let images: StoredImage[] = [];
  try {
    const data = validatePropertyInput(() => bodyToProperty(request.body));
    const id = String(request.params.id);
    data.featured = await validateFeatured(data.featured === true, String(data.status ?? "draft"), id);
    images = await uploadImages((request.files as Express.Multer.File[]) ?? []);
    const existingImages: StoredImage[] = (await Property.findById(id).select("images").lean())?.images ?? [];
    const orderedImages = images.length || request.body.imageOrder !== undefined
      ? validatePropertyInput(() => applyImageOrder(existingImages, images, request.body.imageOrder))
      : undefined;
    const update = editPropertyUpdate(data, request.body, orderedImages);
    const property = await Property.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!property) {
      await deleteUploadedImages(images);
      return sendUserError(response, 404, "No encontramos la propiedad.");
    }
    response.json(serializeProperty(property));
  } catch (error) {
    await deleteUploadedImages(images);
    sendPropertySaveError(response, error);
  }
});
adminPropertiesRouter.delete("/:id", async (request, response) => {
  const property = await Property.findByIdAndDelete(String(request.params.id));
  if (!property) return sendUserError(response, 404, "No encontramos la propiedad.");
  const images: StoredImage[] = property.images.flatMap((image, position) =>
    image.publicId ? [{ url: image.url, publicId: image.publicId, position }] : [],
  );
  await deleteUploadedImages(images);
  response.status(204).send();
});
