import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Initialize upload directories on startup
const UPLOAD_BASE_DIR = path.resolve(process.env.UPLOAD_PATH || "./public/uploads");
try {
  fs.mkdirSync(path.join(UPLOAD_BASE_DIR, "collections"), { recursive: true });
  fs.mkdirSync(path.join(UPLOAD_BASE_DIR, "categories"), { recursive: true });
  fs.mkdirSync(path.join(UPLOAD_BASE_DIR, "products"), { recursive: true });
  logger.info({ uploadDir: UPLOAD_BASE_DIR }, "Upload directories initialized");
} catch (err) {
  logger.error({ err }, "Failed to initialize upload directories");
}

// Inline HTTP request logger — avoids pino-http ESM/CJS typing issues on Vercel
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

// Serve static uploads
app.use("/uploads", express.static(UPLOAD_BASE_DIR));

app.use("/api", router);

export default app;
