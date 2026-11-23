import { ApiError, authorizePropertyUploads, saveAuthorizedProperty, type SignedPropertyUpload } from "./api";
import { maxPropertyPhotoBytes, maxPropertyPhotos } from "./propertyPhotos";
import { UserMessageError } from "./userMessages";

export type PropertyUploadProgress = { total: number; uploaded: number; failed: number };
type Target = { propertyId?: string; revision?: string };

async function uploadFile(file: File, ticket: SignedPropertyUpload) {
  const data = new FormData();
  Object.entries(ticket.fields).forEach(([key, value]) => data.set(key, String(value)));
  data.set("file", file);
  // A lost response can be retried with the same signed public ID and overwrite=false.
  const response = await fetch(ticket.url, {
    method: "POST", body: data, credentials: "omit", signal: AbortSignal.timeout(300_000),
  });
  if (!response.ok) throw new Error("Cloudinary no recibió la foto.");
}

async function fileDigest(file: File) {
  if (!globalThis.crypto?.subtle) throw new UserMessageError("Volvé a abrir el administrador desde la dirección segura del sitio para subir fotos.");
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function createDirectPropertySaver({
  authorize = authorizePropertyUploads,
  upload = uploadFile,
  finalize = saveAuthorizedProperty,
  digestFile = fileDigest,
  newId = () => {
    if (!globalThis.crypto?.randomUUID) throw new UserMessageError("Volvé a abrir el administrador desde la dirección segura del sitio para guardar.");
    return crypto.randomUUID();
  },
} = {}) {
  const fileDigests = new WeakMap<File, string>();
  let current: { id: string; target: Target; authorized: boolean; uploaded: Set<string> } | undefined;

  return async (fields: Record<string, string>, files: File[], order: string[], target: Target,
    onProgress: (progress: PropertyUploadProgress) => void) => {
    if (order.length > maxPropertyPhotos || files.length > maxPropertyPhotos) {
      throw new UserMessageError(`Podés cargar hasta ${maxPropertyPhotos} fotos por propiedad.`);
    }
    if (!current || current.target.propertyId !== target.propertyId || current.target.revision !== target.revision) {
      current = { id: newId(), target, authorized: false, uploaded: new Set() };
    }
    const session = current;
    const entries: { file: File; digest: string }[] = [];
    for (const file of files) {
      if (file.size > maxPropertyPhotoBytes) throw new UserMessageError("La imagen supera el tamaño máximo permitido de 8 MB.");
      if (!file.type.startsWith("image/") || file.size < 1) throw new UserMessageError("Seleccioná un archivo de imagen válido.");
      const digest = fileDigests.get(file) ?? await digestFile(file).catch(error => {
        if (error instanceof UserMessageError) throw error;
        throw new UserMessageError("No pudimos leer una de las fotos. Quitala del listado y volvé a seleccionarla.", { cause: error });
      });
      fileDigests.set(file, digest);
      entries.push({ file, digest });
    }
    if (new Set(entries.map(entry => entry.digest)).size !== entries.length) {
      throw new UserMessageError("Hay fotos repetidas. Eliminá las copias antes de guardar.");
    }
    const pending = entries.filter(entry => !session.uploaded.has(entry.digest));
    let uploaded = entries.length - pending.length;
    let failed = 0;
    const publishProgress = () => onProgress({ total: entries.length, uploaded, failed });
    publishProgress();

    if (pending.length || !session.authorized) {
      const response = await authorize(session.id, {
        ...target,
        files: pending.map(({ digest, file }) => ({ digest, size: file.size, type: file.type })),
      });
      session.authorized = true;
      const tickets = new Map(response.uploads.map(ticket => [ticket.digest, ticket]));
      let index = 0;
      await Promise.all(Array.from({ length: Math.min(3, pending.length) }, async () => {
        while (index < pending.length) {
          const { file, digest } = pending[index++];
          try {
            const ticket = tickets.get(digest);
            if (!ticket) throw new Error("Falta la autorización de una foto.");
            await upload(file, ticket);
            session.uploaded.add(digest);
            uploaded++;
          } catch {
            failed++;
          }
          publishProgress();
        }
      }));
      if (failed) throw new UserMessageError(failed === 1
        ? "No pudimos subir una foto. Volvé a guardar para reintentar solo esa foto."
        : `No pudimos subir ${failed} fotos. Volvé a guardar para reintentar solo las pendientes.`);
    }
    const verifiedOrder = order.map(key => key.startsWith("new:")
      ? `new:${entries[Number(key.slice(4))]?.digest ?? ""}` : key);
    try {
      return await finalize(session.id, { fields, order: verifiedOrder });
    } catch (error) {
      if (error instanceof ApiError) {
        for (const digest of error.missingDigests) {
          if (session.uploaded.delete(digest)) {
            uploaded--;
            failed++;
          }
        }
        publishProgress();
      }
      throw error;
    }
  };
}
