import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { cloudinaryConfigured, config } from "../config";

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
