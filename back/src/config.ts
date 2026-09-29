import "dotenv/config";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error("PORT debe ser un nÃºmero de puerto vÃ¡lido.");
  }
  return parsed;
}

export const config = {
  port: positiveInteger(process.env.PORT, 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  adminUsername: required("ADMIN_USERNAME"),
  adminPasswordHash: required("ADMIN_PASSWORD_HASH"),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

if (config.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 caracteres.");
}

if (!config.mongoUri.startsWith("mongodb://") && !config.mongoUri.startsWith("mongodb+srv://")) {
  throw new Error("MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://.");
}

const cloudinaryValues = Object.values(config.cloudinary);
if (cloudinaryValues.some(Boolean) && cloudinaryValues.some((value) => !value)) {
  throw new Error("Completá CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.");
}

export const cloudinaryConfigured = cloudinaryValues.every(Boolean);
