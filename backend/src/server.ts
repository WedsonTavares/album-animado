import express from "express";
import cors from "cors";
import env from "./config/env";
import authRoutes from "./routes/authRoutes";
import albumRoutes from "./routes/albumRoutes";
import photoRoutes from "./routes/photoRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { asyncHandler } from "./utils/asyncHandler";
import { prisma } from "./prisma";

const app = express();

const allowedOrigins = env.clientUrl.split(",").map((url) => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get(
  "/health/db",
  asyncHandler(async (_req, res) => {
    const databaseUrl = process.env.DATABASE_URL;
    let dbHost: string | undefined;
    let sslMode: string | undefined;

    if (databaseUrl) {
      try {
        const parsed = new URL(databaseUrl);
        dbHost = parsed.hostname || undefined;
        sslMode = parsed.searchParams.get("sslmode") || undefined;
      } catch {
        // ignore parsing errors; not all DATABASE_URL values are URL-parseable
      }
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      return res.json({ status: "ok" });
    } catch (err) {
      console.error("DB healthcheck failed", {
        dbHost,
        sslMode,
        hasDatabaseUrl: Boolean(databaseUrl),
      });

      return res.status(500).json({
        status: "error",
        message: "db_unreachable",
        dbHost,
        sslMode,
        hasDatabaseUrl: Boolean(databaseUrl),
      });
    }
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});
