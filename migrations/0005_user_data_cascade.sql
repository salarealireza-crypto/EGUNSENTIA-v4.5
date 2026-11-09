-- Remove orphaned per-account data before adding delete cascades.
-- Campaign saves and AL quota records must not outlive the account that owns them.
DELETE FROM game_saves AS saved
 WHERE NOT EXISTS (SELECT 1 FROM "user" AS account WHERE account."id" = saved.user_id);

DELETE FROM al_rate_limits AS quota
 WHERE NOT EXISTS (SELECT 1 FROM "user" AS account WHERE account."id" = quota.user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'game_saves_user_id_fkey'
       AND conrelid = 'game_saves'::regclass
  ) THEN
    ALTER TABLE game_saves
      ADD CONSTRAINT game_saves_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user" ("id") ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'al_rate_limits_user_id_fkey'
       AND conrelid = 'al_rate_limits'::regclass
  ) THEN
    ALTER TABLE al_rate_limits
      ADD CONSTRAINT al_rate_limits_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user" ("id") ON DELETE CASCADE;
  END IF;
END $$;
