import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { cloudinaryConfigured, config } from "../config";

export const propertyImageFormats = ["jpg", "jpeg", "png", "webp", "avif", "gif", "bmp", "tif", "tiff", "heic", "heif", "ico", "svg", "jxl"];

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

export async function uploadPropertyImage(file: Express.Multer.File) {
  if (!cloudinaryConfigured) throw new Error("Falta configurar Cloudinary en las variables de entorno.");

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "medde-padilla/properties", resource_type: "image" },
      (error, upload) => error || !upload ? reject(error ?? new Error("Cloudinary no devolvió una imagen.")) : resolve(upload),
    );
    stream.end(file.buffer);
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deletePropertyImage(publicId?: string) {
  if (cloudinaryConfigured && publicId) await cloudinary.uploader.destroy(publicId);
}

export function signPropertyImage(publicId: string, timestamp: number) {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Falta configurar Cloudinary.");
  const params = {
    public_id: publicId,
    timestamp,
    overwrite: false,
    allowed_formats: propertyImageFormats.join(","),
  };
  return {
    url: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    fields: { ...params, api_key: apiKey, signature: cloudinary.utils.api_sign_request(params, apiSecret) },
  };
}

export async function readPropertyImageAssets(publicIds: string[]) {
  if (!cloudinaryConfigured) throw new Error("Falta configurar Cloudinary.");
  const batches = Array.from({ length: Math.ceil(publicIds.length / 10) }, (_, index) => publicIds.slice(index * 10, index * 10 + 10));
  const responses = await Promise.all(batches.map(ids => cloudinary.api.resources_by_ids(ids, {
    resource_type: "image", type: "upload", fields: "secure_url,bytes,format,resource_type,type", timeout: 12_000,
  })));
  return responses.flatMap(response => response.resources) as Array<{
    public_id: string; secure_url: string; bytes: number; format: string; resource_type: string; type: string;
  }>;
}

export async function destroyPropertyImage(publicId: string) {
  if (!cloudinaryConfigured) throw new Error("Falta configurar Cloudinary.");
  const options = { resource_type: "image", type: "upload", invalidate: true, timeout: 8_000 } as const;
  const { result } = await cloudinary.uploader.destroy(publicId, options);
  if (result !== "ok" && result !== "not found") throw new Error("Cloudinary no confirmó el borrado.");
}
