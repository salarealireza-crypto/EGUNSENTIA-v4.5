/**
 * Resolve the Better Auth signing secret without allowing ephemeral secrets on
 * Vercel. A process-local fallback is useful for disposable local/preview
 * sessions, but serverless instances and cold starts do not share memory.
 *
 * @param {{ configuredSecret?: string | null, isVercel?: boolean, previewSecret: () => string }} options
 */
export function resolveBetterAuthSecret({
  configuredSecret,
  isVercel = false,
  previewSecret,
}) {
  const configured = typeof configuredSecret === "string" ? configuredSecret.trim() : "";
  if (configured) return configured;
  if (isVercel) {
    throw new Error(
      "BETTER_AUTH_SECRET must be configured in Vercel. A process-local signing secret would invalidate sessions across serverless instances and restarts.",
    );
  }
  const fallback = previewSecret();
  if (typeof fallback !== "string" || fallback.length < 32) {
    throw new Error("A valid preview authentication secret could not be created.");
  }
  return fallback;
}
