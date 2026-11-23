import { Router } from "express";
import bcrypt from "bcryptjs";
import { config } from "../config";
import { signAdminToken } from "../middleware/auth";
import { sendUserError } from "../utils/userError";

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const { username, password } = request.body ?? {};
  const validUsername = username === config.adminUsername;
  const validPassword = typeof password === "string" && await bcrypt.compare(password, config.adminPasswordHash);
  if (!validUsername || !validPassword) return sendUserError(response, 401, "El usuario o la contraseña son incorrectos.");
  response.json({ token: signAdminToken(), expiresIn: 28800 });
});
