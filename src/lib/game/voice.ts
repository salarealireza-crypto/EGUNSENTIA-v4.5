import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/middleware";
import { archiveLinked } from "./xai";

export const grokStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => ({ linked: archiveLinked() }));
