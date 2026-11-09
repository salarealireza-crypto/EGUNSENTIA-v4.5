/**
 * Validate the non-secret shape of this app's dedicated deployed OAuth setup.
 * The actual credential values remain server-only and are never returned.
 *
 * @param {Record<string, string | undefined>} [environment]
 * @returns {{ deployed: boolean, baseURL?: string }}
 */
export function validateDeployedAuthConfig(environment = {}) {
  const deployed = environment.VERCEL?.trim() === "1";
  if (!deployed) return { deployed: false };

  if (environment.VITE_AUTH_ENABLED?.trim().toLowerCase() === "false") {
    throw new Error("VITE_AUTH_ENABLED=false is not allowed for a deployed private EGUNSENTIA instance.");
  }

  const baseURL = environment.BETTER_AUTH_URL?.trim() ?? "";
  const secret = environment.BETTER_AUTH_SECRET?.trim() ?? "";
  const clientId = environment.GROK_AUTH_CLIENT_ID?.trim() ?? "";
  const clientSecret = environment.GROK_AUTH_CLIENT_SECRET?.trim() ?? "";

  if (!baseURL) {
    throw new Error("BETTER_AUTH_URL must be set to this deployment's canonical HTTPS origin.");
  }
  let parsed;
  try {
    parsed = new URL(baseURL);
  } catch {
    throw new Error("BETTER_AUTH_URL must be a valid HTTPS origin.");
  }
  if (
    parsed.protocol !== "https:" ||
    !parsed.hostname ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  ) {
    throw new Error("BETTER_AUTH_URL must be a canonical HTTPS origin without credentials, path, query, or fragment.");
  }

  if (new TextEncoder().encode(secret).length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 bytes for a deployed app.");
  }
  // Vercel does not receive Grok App Builder's per-app broker credentials.
  // This game can instead use its own owner-only Better Auth email/password
  // account, backed by the configured Postgres database and signing secret.
  const ownerPasswordMode =
    environment.EGUNSENTIA_AUTH_MODE?.trim() === "owner-password";

  if (clientId === "grok_preview") {
    throw new Error("The shared preview OAuth client cannot be used by a deployed EGUNSENTIA app.");
  }
  if ((!clientId || !clientSecret) && !ownerPasswordMode) {
    throw new Error(
      "Configure dedicated GROK_AUTH_CLIENT_ID/GROK_AUTH_CLIENT_SECRET or set EGUNSENTIA_AUTH_MODE=owner-password for a self-hosted owner login.",
    );
  }

  return { deployed: true, baseURL: parsed.origin };
}
