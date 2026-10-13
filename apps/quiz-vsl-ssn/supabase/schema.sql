-- Eventos do funil quiz → VSL (projeto Supabase exclusivo deste funil)
-- Rodar uma vez no SQL Editor do projeto novo.

create table public.quiz_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  funnel      text not null default 'quiz-vsl-ssn',
  session_id  uuid not null,
  event       text not null check (event in ('page_view', 'quiz_start', 'answer', 'vsl_view')),
  step_key    text,   -- chave da pergunta (só em 'answer')
  answer      text,   -- id da opção escolhida (só em 'answer')
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  device      text,   -- 'mobile' | 'desktop'
  referrer    text
);

create index quiz_events_created_at_idx on public.quiz_events (created_at);
create index quiz_events_session_idx   on public.quiz_events (session_id);
create index quiz_events_event_idx     on public.quiz_events (funnel, event);

-- A página usa a chave pública (anon): ela só pode INSERIR, nunca ler.
alter table public.quiz_events enable row level security;

create policy "pagina insere eventos"
  on public.quiz_events for insert
  to anon
  with check (true);
