-- 002 · Acessos reais: separa pessoas de robôs/pré-carregamentos.
-- Rodar UMA vez no SQL Editor, ANTES de rodar o stats.sql atualizado.

-- 1) Novas colunas (a página nova já envia as duas)
alter table public.quiz_events add column if not exists user_agent text;
alter table public.quiz_events add column if not exists is_bot boolean not null default false;

-- 2) Histórico: marca como robô/prévia as sessões gravadas antes da correção que
--    só carregaram a página (1 evento) e NÃO vieram de um clique normal no anúncio:
--    a) UTM codificada duas vezes (%5B...) — robô da Meta revisando/pré-carregando o link
--    b) sem nenhuma UTM — pré-visualização de link, robôs e aberturas de teste
update public.quiz_events e
set is_bot = true
where e.session_id in (
  select session_id
  from public.quiz_events
  where user_agent is null                -- só dados antigos
  group by session_id
  having count(*) = 1
     and bool_and(event = 'page_view')
     and bool_and(
           coalesce(utm_campaign, '') = ''
        or position('%5B' in utm_campaign) > 0
        or position('%5B' in coalesce(utm_medium, '')) > 0
        or position('%5B' in coalesce(utm_content, '')) > 0
     )
);

create index if not exists quiz_events_bot_idx on public.quiz_events (is_bot) where is_bot;
