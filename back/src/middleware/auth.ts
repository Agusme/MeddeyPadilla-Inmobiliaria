import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: "8h",
    issuer: "medde-padilla-api",
    subject: config.adminUsername,
  });
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return void response.status(401).json({ message: "Autenticación requerida." });
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
      issuer: "medde-padilla-api",
    });
    if (typeof decoded === "string" || decoded.role !== "admin") throw new Error();
    next();
  } catch {
    response.status(401).json({ message: "Sesión inválida o vencida." });
  }
}
