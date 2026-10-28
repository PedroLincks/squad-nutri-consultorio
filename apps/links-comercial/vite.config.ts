import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Em desenvolvimento:
 *  - /api/{nome}            → mesmo handler da Vercel (api/{nome}.ts)
 *  - /{vendedora}/{oferta}  → api/r.ts (o que o vercel.json faz em produção)
 *  - sem SUPABASE_URL       → banco simulado em .dev-data/db.json, a partir de supabase/seed.json
 */
function apiDev(): Plugin {
  return {
    name: 'api-dev',
    configureServer(server) {
      for (const [k, v] of Object.entries(process.env)) if (v === '') delete process.env[k]
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      // BANCO_SIMULADO=1 força o banco simulado mesmo com .env.local preenchido
      if (!process.env.SUPABASE_URL || process.env.BANCO_SIMULADO) bancoSimulado()
      // No banco simulado a senha do admin é sempre "dev" (nunca a de produção)
      if (!process.env.ADMIN_SENHA || process.env.BANCO_SIMULADO) process.env.ADMIN_SENHA = 'dev'

      const ROTA_CURTA = /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/
      const RESERVADOS = new Set(['src', 'api', 'node_modules', '@vite', '@react-refresh', '@fs', '@id', 'public', 'assets'])

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost')
        let arquivo: string | null = null
        let requestUrl = url

        const api = url.pathname.match(/^\/api\/([a-z-]+)$/)
        const curta = url.pathname.match(ROTA_CURTA)
        if (api) {
          arquivo = `/api/${api[1]}.ts`
        } else if (curta && !RESERVADOS.has(curta[1])) {
          arquivo = '/api/r.ts'
          requestUrl = new URL(`/api/r?v=${curta[1]}&o=${curta[2]}`, 'http://localhost')
        }
        if (!arquivo) return next()

        try {
          const resposta = await executarHandler(server, arquivo, req, requestUrl)
          res.statusCode = resposta.status
          resposta.headers.forEach((valor, nome) => res.setHeader(nome, valor))
          res.end(Buffer.from(await resposta.arrayBuffer()))
        } catch (error) {
          console.error('Error in api-dev:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ erro: String(error) }))
        }
      })
    },
  }
}

async function executarHandler(server: ViteDevServer, arquivo: string, req: import('node:http').IncomingMessage, url: URL) {
  const mod = await server.ssrLoadModule(arquivo)
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const body = chunks.length ? Buffer.concat(chunks) : undefined
  const request = new Request(url, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body: body && body.length ? body : undefined,
  })
  return (await mod.default(request)) as Response
}

/* ---------- Banco simulado (só dev, só sem SUPABASE_URL) ---------- */

type Linha = Record<string, unknown>
type Db = Record<string, Linha[]>

const MOCK_URL = 'http://supabase.simulado.local'

function bancoSimulado() {
  process.env.SUPABASE_URL = MOCK_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'simulado'
  const arquivo = path.resolve('.dev-data/db.json')
  const seed = path.resolve('supabase/seed.json')
  console.info(`[banco simulado] sem SUPABASE_URL — usando ${arquivo}`)

  const salvar = (db: Db) => {
    fs.mkdirSync(path.dirname(arquivo), { recursive: true })
    fs.writeFileSync(arquivo, JSON.stringify(db, null, 2))
  }
  const ler = (): Db => {
    if (!fs.existsSync(arquivo)) {
      const s = JSON.parse(fs.readFileSync(seed, 'utf8')) as { produtos: Linha[]; vendedoras: Linha[]; ofertas: Linha[] }
      const agora = new Date().toISOString()
      salvar({
        produtos: s.produtos.map((p) => ({ ordem: 0, created_at: agora, ...p })),
        vendedoras: s.vendedoras.map((v) => ({ ativa: true, created_at: agora, ...v })),
        ofertas: s.ofertas.map((o, i) => ({ id: i + 1, ativa: true, ordem: 0, orientacao: null, created_at: agora, ...o })),
        cliques: [],
      })
    }
    return JSON.parse(fs.readFileSync(arquivo, 'utf8')) as Db
  }

  const filtrar = (linhas: Linha[], params: URLSearchParams) => {
    for (const [coluna, valor] of params) {
      if (['select', 'order', 'limit', 'on_conflict'].includes(coluna)) continue
      const [op, ...resto] = valor.split('.')
      const v = resto.join('.')
      if (op === 'eq') linhas = linhas.filter((l) => String(l[coluna]) === v)
      else if (op === 'gte') linhas = linhas.filter((l) => String(l[coluna]) >= v)
      else if (op === 'in') {
        const valores = v.replace(/^\(|\)$/g, '').split(',').map((x) => x.replace(/^"|"$/g, ''))
        linhas = linhas.filter((l) => valores.includes(String(l[coluna])))
      }
    }
    return linhas
  }
  const ordenar = (linhas: Linha[], order: string | null) => {
    if (!order) return linhas
    const regras = order.split(',').map((r) => r.split('.'))
    return [...linhas].sort((a, b) => {
      for (const [col, dir] of regras) {
        const x = a[col] as number | string | null
        const y = b[col] as number | string | null
        if (x === y) continue
        if (x === null || x === undefined) return 1
        if (y === null || y === undefined) return -1
        return (x > y ? 1 : -1) * (dir === 'desc' ? -1 : 1)
      }
      return 0
    })
  }
  const json = (b: unknown, status = 200) =>
    new Response(b === undefined ? null : JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } })

  const original = globalThis.fetch
  globalThis.fetch = async (entrada, init) => {
    const href = typeof entrada === 'string' ? entrada : entrada instanceof URL ? entrada.href : entrada.url
    if (!href.startsWith(MOCK_URL)) return original(entrada, init)

    const url = new URL(href)
    const tabela = url.pathname.split('/').pop() ?? ''
    const metodo = (init?.method ?? 'GET').toUpperCase()
    const prefer = new Headers(init?.headers).get('prefer') ?? ''
    const db = ler()
    const linhas = db[tabela] ?? (db[tabela] = [])

    if (metodo === 'GET') {
      let r = ordenar(filtrar(linhas, url.searchParams), url.searchParams.get('order'))
      const limit = url.searchParams.get('limit')
      if (limit) r = r.slice(0, Number(limit))
      return json(r)
    }
    if (metodo === 'POST') {
      const corpo = JSON.parse(String(init?.body)) as Linha | Linha[]
      const itens = Array.isArray(corpo) ? corpo : [corpo]
      const chave = url.searchParams.get('on_conflict') ?? 'id'
      const gravados: Linha[] = []
      for (const item of itens) {
        const existente = prefer.includes('merge-duplicates') ? linhas.find((l) => l[chave] === item[chave]) : undefined
        if (existente) {
          Object.assign(existente, item)
          gravados.push(existente)
          continue
        }
        const unica = tabela === 'produtos' ? 'sigla' : 'slug'
        if (item[unica] !== undefined && linhas.some((l) => l[unica] === item[unica])) {
          return json({ message: 'duplicate key value violates unique constraint' }, 409)
        }
        const novo: Linha = { ...item }
        if (tabela !== 'vendedoras' && tabela !== 'produtos') novo.id = linhas.reduce((m, l) => Math.max(m, Number(l.id ?? 0)), 0) + 1
        novo.created_at = new Date().toISOString()
        linhas.push(novo)
        gravados.push(novo)
      }
      salvar(db)
      return prefer.includes('return=minimal') ? json(undefined, 201) : json(gravados, 201)
    }
    if (metodo === 'PATCH') {
      const corpo = JSON.parse(String(init?.body)) as Linha
      const alvo = filtrar(linhas, url.searchParams)
      if (
        corpo.slug !== undefined &&
        linhas.some((l) => !alvo.includes(l) && l.slug === corpo.slug)
      ) {
        return json({ message: 'duplicate key value violates unique constraint' }, 409)
      }
      for (const l of alvo) Object.assign(l, corpo)
      salvar(db)
      return json(alvo)
    }
    if (metodo === 'DELETE') {
      const alvo = new Set(filtrar(linhas, url.searchParams))
      db[tabela] = linhas.filter((l) => !alvo.has(l))
      salvar(db)
      return json(undefined, 204)
    }
    return json({ message: 'método não simulado' }, 405)
  }
}

export default defineConfig({
  plugins: [react(), apiDev()],
})
