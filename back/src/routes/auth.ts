import { Router } from "express";
import bcrypt from "bcryptjs";
import { config } from "../config";
import { signAdminToken } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const { username, password } = request.body ?? {};
  const validUsername = username === config.adminUsername;
  const validPassword = typeof password === "string" && await bcrypt.compare(password, config.adminPasswordHash);
  if (!validUsername || !validPassword) return response.status(401).json({ message: "Usuario o contraseña incorrectos." });
  response.json({ token: signAdminToken(), expiresIn: 28800 });
});
