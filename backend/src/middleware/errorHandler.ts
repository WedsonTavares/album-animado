import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HttpError } from "../utils/httpError";

function getRequestId(req: Request) {
  const headerValue = req.headers["x-request-id"];
  return typeof headerValue === "string" && headerValue.trim()
    ? headerValue.trim()
    : undefined;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestId = getRequestId(req);

  // Sempre logar erros (Railway/produção) para debug
  console.error("=== ERROR ===");
  console.error("Route:", req.method, req.path);
  if (requestId) console.error("RequestId:", requestId);
  console.error(err);
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

  return res.status(500).json({
    message: "Internal server error",
    ...(requestId ? { requestId } : {}),
  });
}
