-- One campaign save per authenticated player.
create table if not exists game_saves (
  user_id    text not null primary key,
  payload    text not null,
  updated_at timestamptz not null default now()
);
create index if not exists game_saves_updated_at_idx on game_saves (updated_at);
