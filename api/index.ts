import type { IncomingMessage, ServerResponse } from "http";

let appHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getApp() {
  if (!appHandler) {
    const mod = await import("../artifacts/api-server/src/app.js");
    appHandler = mod.default as (req: IncomingMessage, res: ServerResponse) => void;
  }
  return appHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp();
  app(req, res);
}
