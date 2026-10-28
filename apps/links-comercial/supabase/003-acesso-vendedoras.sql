-- Migração 3 (28/10/2026): página de acesso (/larissa) e senha de cada vendedora + limite de tentativas de login.
-- Rodar no SQL Editor do projeto. Idempotente.

alter table public.vendedoras add column if not exists pagina text unique;   -- sales.../larissa
alter table public.vendedoras add column if not exists senha_hash text;      -- PBKDF2; nunca sai do servidor

update public.vendedoras set pagina = case slug
  when '00' then 'pedro'
  when '01' then 'larissa'
  when '02' then 'andressa'
  when '03' then 'gabriela'
end
where pagina is null;

create table if not exists public.tentativas_login (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ip          text not null,
  alvo        text not null                      -- 'admin' ou 'v:{pagina}'
);
create index if not exists tentativas_login_ip_idx   on public.tentativas_login (ip, created_at);
create index if not exists tentativas_login_alvo_idx on public.tentativas_login (alvo, created_at);
alter table public.tentativas_login enable row level security;
