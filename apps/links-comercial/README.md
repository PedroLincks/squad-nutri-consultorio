# Links de venda · Comercial

Substitui a planilha "[NC] Links de Venda" e o Short.io. Cada oferta é cadastrada **uma vez** na tela `/admin`;
cada vendedora tem a própria página com o link curto dela, já com as UTMs do time comercial.

Produtos ficam na tabela `produtos` e são cadastrados no admin (botão "+ Novo produto"); o seed traz ANC, NS e SSN.
Cada oferta tem um tipo: à vista, downsell ou recorrência (filtros no admin, badge na página da vendedora).
O seed só cadastra as vendedoras com código numérico (00 Pedro, 01 Larissa, 02 Andressa, 03 Gabriela); as ofertas são cadastradas no admin.
Slug de oferta = sigla + valor, sem hífen (`anc3500`, `ns7500`).

| URL | O que é |
|---|---|
| `/` | Página neutra (não lista vendedoras nem aponta para o admin) |
| `/larissa` | Página da vendedora: pede a senha dela; depois busca, filtros, "Copiar link" |
| `/admin` | Ofertas, produtos, vendedoras (página + senha) e cliques. Pede a senha do admin |
| `/01/anc3500` | Link enviado ao cliente (código da vendedora + oferta) → 302 pro checkout com UTMs |

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

## Segurança

- **Fora dos buscadores:** todas as respostas levam `X-Robots-Tag: noindex, nofollow…` (e a meta tag). O `robots.txt` não bloqueia
  de propósito: o Google só obedece ao `noindex` se puder ler a página.
- **Login:** senha por vendedora (PBKDF2-SHA256, só o hash fica no banco) e senha do admin (`ADMIN_SENHA`). A sessão é um cookie
  `HttpOnly` + `Secure` + `SameSite=Strict` assinado com `SESSAO_SEGREDO`; o JavaScript nunca vê senha nem token.
  Sessão de vendedora dura 30 dias, a do admin 12 horas. Trocar a senha de uma vendedora derruba as sessões dela.
- **Ver senha:** o banco guarda também uma cópia da senha cifrada com AES-GCM (`SENHAS_CHAVE`, só no servidor). Ela nunca vem na
  listagem; só é decifrada quando o admin clica em "Ver senha", e some da tela em 30 segundos.
- **Força bruta:** 10 senhas erradas do mesmo IP (ou 30 no mesmo alvo) em 15 minutos travam o login (`tentativas_login`).
- **Rede:** a vendedora só recebe as ofertas ativas, sem checkout nem UTMs, e nenhum dado de outra vendedora. O hash da senha nunca
  sai do servidor. O Supabase só é acessado pelas funções da Vercel (service_role).
- **Cabeçalhos:** CSP restrita, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, HSTS, `nosniff` (ver `vercel.json`).
- Projetos criados antes das migrações 3 e 4 rodam `supabase/003-acesso-vendedoras.sql` e `supabase/004-senha-cifrada.sql`.
