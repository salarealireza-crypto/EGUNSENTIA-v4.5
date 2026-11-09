/** Pure Fetch-Metadata policy shared by the server guard and regression tests. */
export function isAllowedRequestMetadata({ site, mode, dest, method }) {
  // Non-browser/server-to-server requests, same-origin fetches, and direct
  // address-bar navigations are allowed. Credentialed cross-site browser
  // requests are rejected unless they are top-level GET navigations.
  if (!site || site === "same-origin" || site === "none") return true;
  const isTopLevelGet =
    mode === "navigate" &&
    method === "GET" &&
    dest !== "object" &&
    dest !== "embed";
  return isTopLevelGet;
}
