import type { Response } from "express";

export function sendUserError(response: Response, status: number, userMessage: string, details?: Record<string, unknown>) {
  return response.status(status).json({ message: userMessage, userMessage, ...details });
}
