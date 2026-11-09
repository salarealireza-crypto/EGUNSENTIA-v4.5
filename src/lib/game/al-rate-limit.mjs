export const AL_RATE_LIMIT_PER_HOUR = 36;

/**
 * Atomically claim an AL request slot in the shared database.
 * The single-row upsert makes the per-account hourly quota consistent across
 * Vercel instances and concurrent requests; no process-local state is used.
 * @param {{ query: (text: string, params?: unknown[]) => Promise<unknown[]> }} sql
 * @param {string} userId Verified server-side account id.
 */
export async function claimAlTurnSlot(sql, userId) {
  if (typeof userId !== "string" || !userId.trim()) {
    throw new TypeError("A verified user id is required for the AL rate limit.");
  }
  const rows = await sql.query(
    `
      INSERT INTO al_rate_limits (user_id, window_started_at, request_count)
      VALUES ($1, now(), 1)
      ON CONFLICT (user_id) DO UPDATE
      SET window_started_at = CASE
            WHEN al_rate_limits.window_started_at <= now() - interval '1 hour' THEN now()
            ELSE al_rate_limits.window_started_at
          END,
          request_count = CASE
            WHEN al_rate_limits.window_started_at <= now() - interval '1 hour' THEN 1
            ELSE al_rate_limits.request_count + 1
          END
      WHERE al_rate_limits.window_started_at <= now() - interval '1 hour'
         OR al_rate_limits.request_count < $2
      RETURNING request_count
    `,
    [userId, AL_RATE_LIMIT_PER_HOUR],
  );
  return rows.length > 0;
}

/**
 * Refund a reserved AL slot after a failed provider operation. The active
 * window guard prevents a late failure from decrementing a newer hour.
 * @param {{ query: (text: string, params?: unknown[]) => Promise<unknown[]> }} sql
 * @param {string} userId Verified server-side account id.
 */
export async function releaseAlTurnSlot(sql, userId) {
  if (typeof userId !== "string" || !userId.trim()) {
    throw new TypeError("A verified user id is required for the AL rate limit.");
  }
  const params = [userId];
  const decremented = await sql.query(
    `
      UPDATE al_rate_limits
         SET request_count = request_count - 1
       WHERE user_id = $1
         AND window_started_at > now() - interval '1 hour'
         AND request_count > 1
      RETURNING request_count
    `,
    params,
  );
  if (decremented.length > 0) return true;
  const deleted = await sql.query(
    `
      DELETE FROM al_rate_limits
       WHERE user_id = $1
         AND window_started_at > now() - interval '1 hour'
         AND request_count = 1
      RETURNING user_id
    `,
    params,
  );
  return deleted.length > 0;
}
