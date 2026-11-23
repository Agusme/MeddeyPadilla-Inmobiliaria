import { createHash } from "node:crypto";
import { isObjectIdOrHexString } from "mongoose";
import { Property } from "../models/Property";
import { PropertyUploadSession } from "../models/PropertyUploadSession";
import { destroyPropertyImage, propertyImageFormats, readPropertyImageAssets, signPropertyImage } from "./cloudinary";
import { applyImageOrder, maxPropertyPhotoBytes, maxPropertyPhotos, propertyPhotoLimitMessage } from "../utils/propertyImageOrder";

const hour = 60 * 60 * 1000;
const digestPattern = /^[a-f0-9]{64}$/;
const sessionPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const directImagePrefix = "medde-padilla/properties/direct/";

export class PropertyUploadRequestError extends Error {
  constructor(message: string, public readonly status = 400, options?: ErrorOptions & { missingDigests?: string[] }) {
    super(message, options);
    this.missingDigests = options?.missingDigests;
  }
  readonly missingDigests?: string[];
}

export function uploadSessionId(value: string) {
  if (!sessionPattern.test(value)) throw new PropertyUploadRequestError("La sesión de fotos no es válida.");
  return value;
}

export function propertyImagePublicId(sessionId: string, digest: string) {
  return `${directImagePrefix}${sessionId}/${digest}`;
}

export async function authorizePropertyUploads(id: string, owner: string, body: Record<string, unknown>) {
  const { propertyId = null, revision = null, files } = body;
  if ((propertyId !== null && (typeof propertyId !== "string" || !isObjectIdOrHexString(propertyId)))
    || (revision !== null && (typeof revision !== "string" || !Number.isFinite(Date.parse(revision))))
    || (propertyId === null && revision !== null)
    || !Array.isArray(files) || files.length > maxPropertyPhotos) {
    throw new PropertyUploadRequestError("La solicitud de fotos no es válida.");
  }
  const digests = new Set<string>();
  for (const file of files) {
    if (!file || typeof file.digest !== "string" || !digestPattern.test(file.digest)
      || typeof file.type !== "string" || !file.type.startsWith("image/")
      || !Number.isSafeInteger(file.size) || file.size < 1 || file.size > maxPropertyPhotoBytes) {
      throw new PropertyUploadRequestError("Seleccioná archivos de imagen de hasta 8 MB.");
    }
    if (digests.has(file.digest)) throw new PropertyUploadRequestError("Hay fotos repetidas. Eliminá las copias antes de guardar.");
    digests.add(file.digest);
  }
  if (propertyId !== null && !(await Property.exists({ _id: propertyId, updatedAt: revision === null ? null : new Date(revision as string) }))) {
    throw new PropertyUploadRequestError("La propiedad cambió. Volvé a abrir la edición para guardar sobre la versión actual.", 409);
  }

  const now = new Date();
  const publicIds = Array.from(digests, digest => propertyImagePublicId(id, digest));
  await PropertyUploadSession.updateOne({ _id: id }, { $setOnInsert: {
    owner, propertyId, revision, expiresAt: new Date(now.getTime() + 24 * hour),
    // Signatures remain valid for an hour. Leave time for in-flight uploads too.
    cleanupAt: new Date(now.getTime() + 26 * hour),
  } }, { upsert: true });
  const authorized = await PropertyUploadSession.updateOne({
    _id: id, owner, propertyId, revision, resultId: { $exists: false }, expiresAt: { $gt: now },
    $expr: { $lte: [{ $size: { $setUnion: ["$publicIds", publicIds] } }, 120] },
  }, { $addToSet: { publicIds: { $each: publicIds } } });
  if (!authorized.matchedCount) throw new PropertyUploadRequestError("La sesión de fotos ya se cerró, venció o alcanzó su límite. Revisá el listado de propiedades antes de empezar otra.", 409);

  const timestamp = Math.floor(now.getTime() / 1000);
  return Array.from(digests, digest => ({ digest, ...signPropertyImage(propertyImagePublicId(id, digest), timestamp) }));
}

export function readDirectPropertySave(body: Record<string, unknown>) {
  const { fields, order } = body;
  if (!fields || typeof fields !== "object" || Array.isArray(fields) || Object.values(fields).some(value => typeof value !== "string")
    || !Array.isArray(order) || order.some(key => typeof key !== "string" || !/^(existing:\d{1,2}|new:[a-f0-9]{64})$/.test(key))) {
    throw new PropertyUploadRequestError("Los datos o el orden de las fotos no son válidos.");
  }
  if (order.length > maxPropertyPhotos) throw new PropertyUploadRequestError(propertyPhotoLimitMessage);
  if (new Set(order).size !== order.length) throw new PropertyUploadRequestError("Hay fotos repetidas en la galería.");
  const digests = (order as string[]).filter(key => key.startsWith("new:")).map(key => key.slice(4));
  const sortedFields = Object.fromEntries(Object.entries(fields).sort(([a], [b]) => a.localeCompare(b)));
  const hash = createHash("sha256").update(JSON.stringify([sortedFields, order])).digest("hex");
  return { fields: fields as Record<string, string>, order: order as string[], digests, hash };
}

export async function verifyDirectPropertyImages(id: string, digests: string[], authorizedIds: string[]) {
  const ids = digests.map(digest => propertyImagePublicId(id, digest));
  const allowed = new Set(authorizedIds);
  if (ids.some(publicId => !allowed.has(publicId))) {
    throw new PropertyUploadRequestError("Una o más fotos no pertenecen a esta sesión.", 403);
  }
  if (!ids.length) return [];
  let resources: Awaited<ReturnType<typeof readPropertyImageAssets>>;
  try {
    resources = await readPropertyImageAssets(ids);
  } catch (error) {
    throw new PropertyUploadRequestError("No pudimos comprobar que las fotos estén disponibles. Intentá guardar nuevamente.", 502, { cause: error });
  }
  const assets = new Map(resources.map(asset => [asset.public_id, asset]));
  const missingDigests = digests.filter((_, index) => !assets.has(ids[index]));
  if (missingDigests.length) {
    throw new PropertyUploadRequestError("Quedaron fotos sin confirmar. Volvé a guardar para reintentar solo esas fotos.", 409, { missingDigests });
  }
  return ids.map((publicId, position) => {
    const asset = assets.get(publicId);
    if (asset && asset.bytes > maxPropertyPhotoBytes) {
      throw new PropertyUploadRequestError("Una de las fotos supera los 8 MB. Quitala y elegí una versión más liviana.");
    }
    if (!asset || asset.resource_type !== "image" || asset.type !== "upload" || !propertyImageFormats.includes(asset.format)
      || !Number.isSafeInteger(asset.bytes) || asset.bytes < 1
      || !asset.secure_url?.startsWith("https://")) {
      throw new PropertyUploadRequestError("Una de las fotos tiene un formato no admitido. Quitala y probá con un archivo JPG, PNG o WebP.");
    }
    return { url: asset.secure_url, publicId, position };
  });
}

type Image = { url: string; position: number; publicId?: string | null };

export function orderDirectImages(existing: Image[], added: Image[], order: string[]) {
  let newIndex = 0;
  const images = applyImageOrder(existing, added, JSON.stringify(order.map(key => key.startsWith("new:") ? `new:${newIndex++}` : key)));
  const digests = images.flatMap(({ publicId }) => publicId?.startsWith(directImagePrefix) ? [publicId.split("/").at(-1)] : []);
  if (new Set(digests).size !== digests.length) throw new Error("Hay fotos repetidas en la galería. Eliminá las copias antes de guardar.");
  return images;
}

export async function cleanPropertyUploads(now = new Date()) {
  const pending = await PropertyUploadSession.find({ cleanupAt: { $lte: now } })
    .select("publicIds retiredIds").sort({ cleanupAt: 1 }).limit(12).lean();
  let removed = 0;
  let failures = 0;
  for (const session of pending) {
    const ids = [...new Set([...session.publicIds, ...session.retiredIds])];
    if (!ids.length) {
      await PropertyUploadSession.updateOne({ _id: session._id }, { $unset: { cleanupAt: 1 } });
      continue;
    }
    // Expired sessions cannot attach assets. Retired assets cannot be added to another session.
    const outcomes = await Promise.allSettled(ids.slice(0, 30).map(async publicId => {
      if (!(await Property.exists({ "images.publicId": publicId }))) {
        await destroyPropertyImage(publicId);
        removed++;
      }
      return publicId;
    }));
    const completed = outcomes.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
    for (const outcome of outcomes) {
      if (outcome.status === "rejected") console.error("Error al limpiar una foto de propiedad:", outcome.reason);
    }
    failures += outcomes.length - completed.length;
    if (completed.length) await PropertyUploadSession.updateOne({ _id: session._id }, {
      $pullAll: { publicIds: completed, retiredIds: completed },
    });
    await PropertyUploadSession.updateOne(
      { _id: session._id, publicIds: { $size: 0 }, retiredIds: { $size: 0 } },
      { $unset: { cleanupAt: 1 } },
    );
  }
  return { removed, failures };
}
