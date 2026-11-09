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
  if (!clientId || !clientSecret) {
    throw new Error("A dedicated GROK_AUTH_CLIENT_ID and GROK_AUTH_CLIENT_SECRET are required for deployment.");
  }
  if (clientId === "grok_preview") {
    throw new Error("The shared preview OAuth client cannot be used by a deployed EGUNSENTIA app.");
  }

  return { deployed: true, baseURL: parsed.origin };
}
