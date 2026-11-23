import fs from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import express from "express";
import mongoose from "mongoose";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { adminPropertiesRouter, propertiesRouter } from "./routes/properties";
import { cleanPropertyUploads } from "./services/propertyUploads";
import { sendUserError } from "./utils/userError";

async function start() {
  // Vercel deployments must not create directories in the application bundle.
  // New images are uploaded to Cloudinary; keep this directory for local use.
  if (process.env.VERCEL !== "1") {
    fs.mkdirSync(path.resolve("uploads"), { recursive: true });
  }
  mongoose.connection.on("error", (error) => console.error("Error de MongoDB:", error));
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  console.log(`MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const app = express();
  // Production requests are same-origin through Vercel rewrites. Keep CORS
  // support for the separate local frontend and backend dev servers.
  if (process.env.NODE_ENV !== "production") {
    app.use((request, response, next) => {
      const origin = request.headers.origin;
      if (origin === config.frontendOrigin) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
        response.setHeader(
          "Access-Control-Allow-Headers",
          request.headers["access-control-request-headers"] ?? "Content-Type,Authorization",
        );
      }
      if (request.method === "OPTIONS") {
        response.sendStatus(204);
        return;
      }
      next();
    });
  }
  app.use(express.json());
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.get("/api/health", (_request, response) => response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
  app.get("/api/internal/property-upload-cleanup", async (request, response) => {
    const secret = process.env.CRON_SECRET;
    const bearer = request.header("authorization");
    if (!secret || !bearer) return response.sendStatus(401);
    const supplied = Buffer.from(bearer);
    const expected = Buffer.from(`Bearer ${secret}`);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return response.sendStatus(401);
    const result = await cleanPropertyUploads();
    return response.status(result.failures ? 503 : 200).json(result);
  });
  app.use("/api/auth", authRouter);
  app.use("/api/properties", propertiesRouter);
  app.use("/api/admin/properties", adminPropertiesRouter);
  app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    sendUserError(response, 500, "No pudimos completar la solicitud. Intentá nuevamente en unos minutos.", { outcomeUncertain: true });
  });
  app.listen(config.port, () => console.log(`API disponible en http://localhost:${config.port}`));
}

start().catch((error) => { console.error("No se pudo iniciar la API:", error); process.exit(1); });
