import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { sendUserError } from "../utils/userError";

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
  if (!token) return void sendUserError(response, 401, "Iniciá sesión para acceder al administrador.");
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
      issuer: "medde-padilla-api",
    });
    if (typeof decoded === "string" || decoded.role !== "admin" || decoded.sub !== config.adminUsername) throw new Error();
    response.locals.adminUsername = decoded.sub;
    next();
  } catch {
    sendUserError(response, 401, "Tu sesión venció. Iniciá sesión nuevamente.");
  }
}
