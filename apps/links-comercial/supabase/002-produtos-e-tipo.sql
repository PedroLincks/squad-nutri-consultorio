-- Migração 2 (28/10/2026): tabela de produtos (cadastráveis no admin) e tipo da oferta.
-- Rodar no SQL Editor do projeto. Idempotente.

create table if not exists public.produtos (
  sigla       text primary key,                 -- "ANC" — base do utm_campaign e do slug
  nome        text not null unique,             -- "Aceleração Nutri de Consultório"
  ordem       integer not null default 0,       -- ordem dos blocos na tela
  created_at  timestamptz not null default now()
);
alter table public.produtos enable row level security;

insert into public.produtos (sigla, nome, ordem) values
  ('ANC', 'Aceleração Nutri de Consultório', 0),
  ('NS',  'Nutri Sales', 1),
  ('SSN', 'Social Selling Nutris', 2)
on conflict (sigla) do nothing;

-- 'avista' | 'downsell' | 'recorrencia'
alter table public.ofertas add column if not exists tipo text
  check (tipo in ('avista', 'downsell', 'recorrencia'));
