import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as pinoHttpModule from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// pino-http exports the factory as both default and the module itself;
// use the named reference to satisfy strict moduleResolution: bundler typing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoHttp = (pinoHttpModule as any).default ?? pinoHttpModule;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Record<string, unknown>) {
        return {
          id: req["id"],
          method: req["method"],
          url: typeof req["url"] === "string" ? req["url"].split("?")[0] : req["url"],
        };
      },
      res(res: Record<string, unknown>) {
        return {
          statusCode: res["statusCode"],
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
