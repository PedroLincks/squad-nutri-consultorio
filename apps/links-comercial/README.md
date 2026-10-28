# Links de venda · Comercial

Substitui a planilha "[NC] Links de Venda" e o Short.io. Cada oferta é cadastrada **uma vez** na tela `/admin`;
cada vendedora tem a própria página com o link curto dela, já com as UTMs do time comercial.

Produtos ficam na tabela `produtos` e são cadastrados no admin (botão "+ Novo produto"); o seed traz ANC, NS e SSN.
Cada oferta tem um tipo: à vista, downsell ou recorrência (filtros no admin, badge na página da vendedora).
O seed só cadastra as vendedoras com código numérico (00 Pedro, 01 Larissa, 02 Andressa, 03 Gabriela); as ofertas são cadastradas no admin.
Slug de oferta = sigla + valor, sem hífen (`anc3500`, `ns7500`).

| URL | O que é |
|---|---|
| `/` | Lista de vendedoras |
| `/01` | Página da vendedora (código 00, 01, 02…): busca, "Copiar link", "Abrir" |
| `/admin` | Cadastro de ofertas e vendedoras + cliques dos últimos 30 dias (senha `ADMIN_SENHA`) |
| `/01/anc3500` | Link curto enviado ao cliente → 302 para o checkout com UTMs (e grava o clique) |

UTMs no destino: `utm_source=Comercial` · `utm_medium={Vendedora}` · `utm_campaign={SIGLA}-Comercial` · `utm_content={Oferta}` · `utm_term=Comercial`.

## Rodar local

```bash
npm install
npm run dev        # http://localhost:5192
```

Sem `SUPABASE_URL` no `.env.local`, o dev usa um banco simulado em `.dev-data/db.json` (carregado de
`supabase/seed.json`) e a senha do admin é `dev`.

## Subir em produção (uma vez)

1. Criar um projeto Supabase exclusivo e rodar, no SQL Editor, `supabase/instalar.sql` (= `schema.sql` + `seed.sql`,
   este gerado por `npm run seed:sql` a partir de `supabase/seed.json`). Projetos criados antes da migração 2 rodam
   `supabase/002-produtos-e-tipo.sql`.
2. Na Vercel, criar o projeto apontando para `apps/links-comercial` (framework Vite) com as variáveis de `.env.example`:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SENHA`, `VITE_DOMINIO`.
3. Adicionar o domínio `sales.nutrideconsultorio.com` ao projeto na Vercel e criar o CNAME `sales` → `cname.vercel-dns.com`.
4. Cancelar o Short.io.

## Estrutura

- `api/r.ts` — redirect + registro do clique (edge)
- `api/catalogo.ts` — vendedoras e ofertas ativas (público, cache de 30 s na borda)
- `api/admin.ts` — CRUD protegido por senha
- `src/shared/links.ts` — regra única de montagem do link curto e das UTMs (usada no servidor e na tela)
- `src/server/db.ts` — acesso ao Supabase via REST com a service_role
- `vercel.json` — reescreve `/{vendedora}/{oferta}` para `api/r`
