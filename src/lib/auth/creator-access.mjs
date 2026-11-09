/** Parse a comma-separated allowlist without accepting wildcards or substrings. */
function parseList(value, normalize = (item) => item) {
  if (typeof value !== "string") return new Set();
  return new Set(
    value
      .split(",")
      .map((item) => normalize(item.trim()))
      .filter(Boolean),
  );
}

/**
 * Creator-only access policy.
 * In deployed/production environments an empty allowlist denies everyone.
 * In a local non-production environment, existing developer behavior remains.
 *
 * @param {{id?: string | null, email?: string | null} | null} user
 * @param {Record<string, string | undefined>} [environment]
 * @returns {{allowed: boolean, reason: 'local' | 'matched' | 'not_configured' | 'unauthenticated' | 'not_allowlisted'}}
 */
export function evaluateCreatorAccess(user, environment = {}) {
  const deployed =
    environment.VERCEL?.trim() === "1" ||
    environment.NODE_ENV?.trim() === "production";
  const emails = parseList(environment.EGUNSENTIA_OWNER_EMAILS, (value) => value.toLowerCase());
  const ids = parseList(environment.EGUNSENTIA_OWNER_IDS);

  if (emails.size === 0 && ids.size === 0) {
    return deployed
      ? { allowed: false, reason: "not_configured" }
      : { allowed: true, reason: "local" };
  }
  if (!user || typeof user.id !== "string" || !user.id.trim()) {
    return { allowed: false, reason: "unauthenticated" };
  }

  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
  if (ids.has(user.id) || (email && emails.has(email))) {
    return { allowed: true, reason: "matched" };
  }
  return { allowed: false, reason: "not_allowlisted" };
}
