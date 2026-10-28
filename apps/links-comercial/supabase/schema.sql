-- Links de venda do time comercial (projeto Supabase exclusivo deste app)
-- Rodar uma vez no SQL Editor do projeto novo. Depois, rodar supabase/seed.sql.

create table public.vendedoras (
  slug        text primary key,                 -- código no link do cliente: sales.../01/anc3500
  nome        text not null,                    -- vai no utm_medium: "Larissa"
  pagina      text unique,                      -- página de acesso: sales.../larissa
  senha_hash  text,                             -- PBKDF2; nunca sai do servidor
  senha_cifrada text,                           -- AES-GCM (SENHAS_CHAVE); só o "Ver senha" do admin decifra
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

create table public.tentativas_login (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  ip          text not null,
  alvo        text not null                     -- 'admin' ou 'v:{pagina}'
);
create index tentativas_login_ip_idx   on public.tentativas_login (ip, created_at);
create index tentativas_login_alvo_idx on public.tentativas_login (alvo, created_at);

-- Só a service_role (usada nas funções da Vercel) acessa as tabelas. Nenhuma policy para anon.
alter table public.produtos   enable row level security;
alter table public.vendedoras enable row level security;
alter table public.ofertas    enable row level security;
alter table public.cliques    enable row level security;
alter table public.tentativas_login enable row level security;
