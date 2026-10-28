// Gera supabase/seed.sql a partir de supabase/seed.json: `npm run seed:sql`
import fs from 'node:fs'
import path from 'node:path'

const raiz = path.resolve(import.meta.dirname, '..')
const seed = JSON.parse(fs.readFileSync(path.join(raiz, 'supabase/seed.json'), 'utf8'))

const sql = (v) => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return `'${String(v).replace(/'/g, "''")}'`
}

const linhas = ['-- Gerado por scripts/gerar-seed-sql.mjs a partir de supabase/seed.json. Rodar depois do schema.sql.', '']
linhas.push('insert into public.produtos (sigla, nome, ordem) values')
linhas.push(seed.produtos.map((p) => `  (${sql(p.sigla)}, ${sql(p.nome)}, ${sql(p.ordem ?? 0)})`).join(',\n') + '\non conflict (sigla) do nothing;')
linhas.push('')
linhas.push('insert into public.vendedoras (slug, nome, ativa) values')
linhas.push(seed.vendedoras.map((v) => `  (${sql(v.slug)}, ${sql(v.nome)}, ${sql(v.ativa ?? true)})`).join(',\n') + '\non conflict (slug) do update set nome = excluded.nome, ativa = excluded.ativa;')
linhas.push('')
if (seed.ofertas.length === 0) linhas.push('-- Sem ofertas no seed: elas são cadastradas na tela /admin.')
else {
linhas.push('insert into public.ofertas (slug, produto, sigla, nome, tipo, ticket, destino, utm_campaign, utm_content, orientacao, ativa, ordem) values')
linhas.push(
  seed.ofertas
    .map((o) =>
      `  (${[o.slug, o.produto, o.sigla, o.nome, o.tipo ?? null, o.ticket ?? null, o.destino, o.utm_campaign, o.utm_content, o.orientacao ?? null, o.ativa ?? true, o.ordem ?? 0].map(sql).join(', ')})`,
    )
    .join(',\n') + '\non conflict (slug) do nothing;',
)
}
fs.writeFileSync(path.join(raiz, 'supabase/seed.sql'), linhas.join('\n') + '\n')
console.log(`seed.sql: ${seed.produtos.length} produtos, ${seed.vendedoras.length} vendedoras, ${seed.ofertas.length} ofertas`)
