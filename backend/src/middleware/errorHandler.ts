import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HttpError } from "../utils/httpError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Sempre logar erros para debug
  console.error("=== ERROR ===");
  console.error("Route:", req.method, req.path);
  console.error("Error:", err);
  console.error("=============");

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error && err.message === "Only image uploads are allowed") {
    return res.status(400).json({ message: err.message });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ message });
}
