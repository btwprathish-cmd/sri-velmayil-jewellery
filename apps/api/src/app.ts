import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app = express();

// Removed local upload directory initialization in favor of Supabase

// Inline HTTP request logger — avoids pino-http ESM/CJS typing issues on Vercel
import type { Request, Response, NextFunction } from "express";

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      { method: req.method, url: req.url.split("?")[0], status: res.statusCode, ms: Date.now() - start },
      "request"
    );
  });
  next();
});


app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads are now handled via Supabase public URLs
app.use("/api", router);

export default app;
