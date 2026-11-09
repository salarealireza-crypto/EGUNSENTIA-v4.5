// Lets plain `node --test` import project .ts files: resolves "@/..." and extensionless relative specifiers.
import { register } from "node:module";
register("./ts-resolve-hook.mjs", import.meta.url);
