import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { adminPropertiesRouter, propertiesRouter } from "./routes/properties";

async function start() {
  fs.mkdirSync(path.resolve("uploads"), { recursive: true });
  mongoose.connection.on("error", (error) => console.error("Error de MongoDB:", error));
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  console.log(`MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const app = express();
  app.use(cors({ origin: config.frontendOrigin, methods: ["GET", "POST", "PATCH", "DELETE"] }));
  app.use(express.json());
  app.use("/uploads", express.static(path.resolve("uploads")));
  app.get("/api/health", (_request, response) => response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));
  app.use("/api/auth", authRouter);
  app.use("/api/properties", propertiesRouter);
  app.use("/api/admin/properties", adminPropertiesRouter);
  app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({ message: "Ocurrió un error inesperado." });
  });
  app.listen(config.port, () => console.log(`API disponible en http://localhost:${config.port}`));
}

start().catch((error) => { console.error("No se pudo iniciar la API:", error); process.exit(1); });
