-- Gerado por scripts/gerar-seed-sql.mjs a partir de supabase/seed.json. Rodar depois do schema.sql.

insert into public.produtos (sigla, nome, ordem) values
  ('ANC', 'Aceleração Nutri de Consultório', 0),
  ('NS', 'Nutri Sales', 1),
  ('SSN', 'Social Selling Nutris', 2)
on conflict (sigla) do nothing;

-- Vendedoras entram sem senha: defina a de cada uma na aba Vendedoras do /admin.
insert into public.vendedoras (slug, nome, pagina, ativa) values
  ('00', 'Pedro', 'pedro', true),
  ('01', 'Larissa', 'larissa', true),
  ('02', 'Andressa', 'andressa', true),
  ('03', 'Gabriela', 'gabriela', true)
on conflict (slug) do update set nome = excluded.nome, pagina = excluded.pagina, ativa = excluded.ativa;

-- Sem ofertas no seed: elas são cadastradas na tela /admin.
