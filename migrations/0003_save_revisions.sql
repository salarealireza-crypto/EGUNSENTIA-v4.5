-- Optimistic concurrency for one campaign per account.
-- A client may update a save only when it still has the revision it loaded.
ALTER TABLE game_saves
  ADD COLUMN IF NOT EXISTS revision BIGINT NOT NULL DEFAULT 1;
