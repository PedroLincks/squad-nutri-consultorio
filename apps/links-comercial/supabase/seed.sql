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
