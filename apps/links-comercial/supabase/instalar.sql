-- Links de venda do time comercial (projeto Supabase exclusivo deste app)
-- Rodar uma vez no SQL Editor do projeto novo. Depois, rodar supabase/seed.sql.

create table public.vendedoras (
  slug        text primary key,                 -- vai na URL: comercial.../larissa/...
  nome        text not null,                    -- vai no utm_medium: "Larissa"
  ativa       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.produtos (
  sigla       text primary key,                 -- "ANC" — base do utm_campaign e do slug
  nome        text not null unique,             -- "Aceleração Nutri de Consultório"
  ordem       integer not null default 0,       -- ordem dos blocos na tela
  created_at  timestamptz not null default now()
);

create table public.ofertas (
  id            bigint generated always as identity primary key,
  slug          text not null unique,           -- vai na URL: comercial.../larissa/wn-297
  produto       text not null,                  -- "Webnutri" (agrupa na tela)
  sigla         text not null,                  -- "WN"
  nome          text not null,                  -- "Oferta 297"
  tipo          text check (tipo in ('avista', 'downsell', 'recorrencia')),
  ticket        numeric(10,2),                  -- valor em reais
  destino       text not null,                  -- checkout (Guru, Pagar.me…) sem UTMs
  utm_campaign  text not null,                  -- "WN-Comercial"
  utm_content   text not null,                  -- "Oferta297"
  orientacao    text,                           -- quando usar este link
  ativa         boolean not null default true,
  ordem         integer not null default 0,     -- ordem de exibição (menor primeiro)
  created_at    timestamptz not null default now()
);

create table public.cliques (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  vendedora   text not null,                    -- slug da vendedora
  oferta      text not null,                    -- slug da oferta
  destino     text,                             -- URL final com UTMs
  user_agent  text,
  referrer    text,
  pais        text,
  device      text,                             -- 'mobile' | 'desktop'
  is_bot      boolean not null default false
);

create index cliques_created_at_idx on public.cliques (created_at);
create index cliques_vendedora_idx  on public.cliques (vendedora, oferta);

-- Só a service_role (usada nas funções da Vercel) acessa as tabelas. Nenhuma policy para anon.
alter table public.produtos   enable row level security;
alter table public.vendedoras enable row level security;
alter table public.ofertas    enable row level security;
alter table public.cliques    enable row level security;
-- Gerado por scripts/gerar-seed-sql.mjs a partir de supabase/seed.json. Rodar depois do schema.sql.

insert into public.produtos (sigla, nome, ordem) values
  ('ANC', 'Aceleração Nutri de Consultório', 0),
  ('NS', 'Nutri Sales', 1),
  ('SSN', 'Social Selling Nutris', 2)
on conflict (sigla) do nothing;

insert into public.vendedoras (slug, nome, ativa) values
  ('00', 'Pedro', true),
  ('01', 'Larissa', true),
  ('02', 'Andressa', true),
  ('03', 'Gabriela', true)
on conflict (slug) do update set nome = excluded.nome, ativa = excluded.ativa;

-- Sem ofertas no seed: elas são cadastradas na tela /admin.
