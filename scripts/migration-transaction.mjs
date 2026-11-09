/**
 * Serialize schema changes across concurrent deploy processes.
 * The transaction-scoped advisory lock is released automatically on COMMIT or
 * ROLLBACK, and is safe with transaction-pooled PostgreSQL connections.
 */
const LOCK_NAMESPACE = 1162309966; // ASCII "EGUN"
const LOCK_ID = 1397045844; // ASCII "SENT"

/**
 * @template T
 * @param {{ query: (text: string, values?: unknown[]) => Promise<unknown> }} client
 * @param {() => Promise<T>} action
 * @returns {Promise<T>}
 */
export async function withMigrationTransaction(client, action) {
  await client.query("BEGIN");
  try {
    await client.query("SELECT pg_advisory_xact_lock($1, $2)", [LOCK_NAMESPACE, LOCK_ID]);
    const result = await action();
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the migration/lock error if the connection is already gone.
    }
    throw error;
  }
}
