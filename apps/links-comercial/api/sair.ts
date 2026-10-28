/** POST /api/sair { tipo: 'admin' | 'vendedora' } — apaga o cookie de sessão */
import { respostaJson } from '../src/server/db'
import { fecharSessao } from '../src/server/sessao'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return respostaJson({ erro: 'Método não suportado.' }, 405)
  const body = (await req.json().catch(() => null)) as { tipo?: unknown } | null
  const tipo = body?.tipo === 'admin' ? 'a' : 'v'
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Set-Cookie': fecharSessao(req, tipo) },
  })
}
