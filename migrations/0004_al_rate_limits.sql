-- Shared AL turn quota across serverless instances and concurrent deploys.
-- One bounded row per account; the window is reset atomically on the next claim.
CREATE TABLE IF NOT EXISTS al_rate_limits (
  user_id TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0)
);

CREATE INDEX IF NOT EXISTS al_rate_limits_window_started_at_idx
  ON al_rate_limits (window_started_at);
