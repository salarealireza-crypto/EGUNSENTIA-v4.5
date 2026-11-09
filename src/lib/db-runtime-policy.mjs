/**
 * Resolve the database backend before any database client is constructed.
 *
 * PostgreSQL is mandatory for production and the default for every deployed
 * Vercel environment. PGlite is an ephemeral local/offline aid; on a Vercel
 * non-production preview it is available only with an explicit opt-in.
 *
 * @param {{
 *   databaseUrl?: string | null,
 *   nodeEnv?: string | null,
 *   vercel?: string | null,
 *   vercelEnv?: string | null,
 *   allowEphemeralPglite?: string | null,
 * }} [environment]
 * @returns {{ source: 'neon' | 'pglite', databaseUrl?: string }}
 */
export function resolveDatabaseRuntime(environment = {}) {
  const rawUrl =
    typeof environment.databaseUrl === "string" ? environment.databaseUrl.trim() : "";

  if (rawUrl) {
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
    }
    if (
      !["postgres:", "postgresql:"].includes(parsed.protocol) ||
      !parsed.hostname
    ) {
      throw new Error("DATABASE_URL must use postgres:// or postgresql:// and include a host.");
    }
    return { source: "neon", databaseUrl: rawUrl };
  }

  const nodeEnv = typeof environment.nodeEnv === "string" ? environment.nodeEnv.trim() : "";
  const vercel = typeof environment.vercel === "string" ? environment.vercel.trim() : "";
  const vercelEnv =
    typeof environment.vercelEnv === "string" ? environment.vercelEnv.trim() : "";
  const allowEphemeral = environment.allowEphemeralPglite === "true";
  const onVercel = vercel === "1" || vercel.toLowerCase() === "true";

  if (onVercel) {
    if (vercelEnv === "production") {
      throw new Error(
        "DATABASE_URL is required for a Vercel production deployment; PGlite is never a production fallback.",
      );
    }
    if (allowEphemeral && ["preview", "development"].includes(vercelEnv)) {
      return { source: "pglite" };
    }
    throw new Error(
      "DATABASE_URL is required on Vercel. PGlite is available only in a non-production preview with PGLITE_ALLOW_EPHEMERAL=true.",
    );
  }

  if (nodeEnv === "production") {
    throw new Error(
      "DATABASE_URL is required when NODE_ENV=production; refusing to start with ephemeral PGlite storage.",
    );
  }

  // A non-production local process is the only default PGlite environment.
  // It is process-local and must never be mistaken for durable player storage.
  return { source: "pglite" };
}
