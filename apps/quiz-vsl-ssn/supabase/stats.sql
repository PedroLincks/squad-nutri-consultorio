-- Agregações do painel (/painel). Rodar uma vez no SQL Editor do projeto do quiz.
-- Só a service_role (usada pela API do painel, no servidor) pode executar.
-- Todas as contagens são de SESSÕES distintas, não de eventos.

create or replace function public.quiz_stats(p_from timestamptz, p_to timestamptz, p_funnel text default 'quiz-vsl-ssn')
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with ev as (
    select *
    from quiz_events
    where funnel = p_funnel
      and created_at >= p_from
      and created_at <  p_to
  ),
  -- Origem da sessão = UTM / aparelho do primeiro evento dela
  sess as (
    select distinct on (session_id)
      session_id,
      coalesce(nullif(utm_campaign, ''), '(sem utm_campaign)') as campanha,
      coalesce(nullif(utm_content, ''), '(sem utm_content)') as criativo,
      device,
      (created_at at time zone 'America/Sao_Paulo')::date as dia
    from ev
    order by session_id, created_at
  ),
  marcos as (
    select
      s.session_id, s.campanha, s.criativo, s.device, s.dia,
      bool_or(e.event = 'page_view')  as acessou,
      bool_or(e.event = 'quiz_start') as iniciou,
      bool_or(e.event = 'vsl_view')   as vsl
    from sess s
    join ev e using (session_id)
    group by 1, 2, 3, 4, 5
  )
  select jsonb_build_object(
    'funil', jsonb_build_object(
      'acessos',  (select count(*) from marcos where acessou),
      'iniciou',  (select count(*) from marcos where iniciou),
      'vsl',      (select count(*) from marcos where vsl),
      'perguntas', coalesce((
        select jsonb_object_agg(step_key, n)
        from (select step_key, count(distinct session_id) as n from ev where event = 'answer' group by step_key) q
      ), '{}'::jsonb)
    ),
    'respostas', coalesce((
      select jsonb_agg(jsonb_build_object('pergunta', step_key, 'opcao', answer, 'n', n))
      from (
        select step_key, answer, count(distinct session_id) as n
        from ev where event = 'answer'
        group by step_key, answer
      ) r
    ), '[]'::jsonb),
    'criativos', coalesce((
      select jsonb_agg(jsonb_build_object(
        'campanha', campanha, 'criativo', criativo, 'acessos', acessos, 'iniciou', iniciou, 'vsl', vsl
      ) order by acessos desc)
      from (
        select campanha, criativo,
          count(*) filter (where acessou) as acessos,
          count(*) filter (where iniciou) as iniciou,
          count(*) filter (where vsl)     as vsl
        from marcos group by campanha, criativo
      ) c
    ), '[]'::jsonb),
    'diario', coalesce((
      select jsonb_agg(jsonb_build_object(
        'dia', dia, 'acessos', acessos, 'iniciou', iniciou, 'vsl', vsl
      ) order by dia)
      from (
        select dia,
          count(*) filter (where acessou) as acessos,
          count(*) filter (where iniciou) as iniciou,
          count(*) filter (where vsl)     as vsl
        from marcos group by dia
      ) d
    ), '[]'::jsonb),
    'aparelhos', coalesce((
      select jsonb_object_agg(coalesce(device, 'desconhecido'), n)
      from (select device, count(*) as n from marcos where acessou group by device) a
    ), '{}'::jsonb)
  );
$$;

revoke all on function public.quiz_stats(timestamptz, timestamptz, text) from public, anon, authenticated;
grant execute on function public.quiz_stats(timestamptz, timestamptz, text) to service_role;
