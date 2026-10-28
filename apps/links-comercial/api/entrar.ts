/**
 * POST /api/entrar — login.
 *   { tipo: 'vendedora', pagina: 'larissa', senha }  → cookie de sessão da vendedora (30 dias)
 *   { tipo: 'admin', senha }                         → cookie de sessão do admin (12 horas)
 * A resposta de erro é sempre a mesma, exista ou não a vendedora.
 */
import { respostaJson, selecionar } from '../src/server/db'
import { ipDe, loginTravado, registrarFalha } from '../src/server/limite'
import { abrirSessao, conferirSenha, impressaoSenha, textosIguais } from '../src/server/sessao'
import { SLUG_RE } from '../src/shared/links'

export const config = { runtime: 'edge' }

const ERRO_SENHA = 'Senha incorreta.'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return respostaJson({ erro: 'Método não suportado.' }, 405)
  if (!req.headers.get('content-type')?.includes('application/json')) return respostaJson({ erro: 'Requisição inválida.' }, 415)

  const body = (await req.json().catch(() => null)) as { tipo?: unknown; pagina?: unknown; senha?: unknown } | null
  const senha = typeof body?.senha === 'string' ? body.senha.slice(0, 200) : ''
  const tipo = body?.tipo === 'admin' ? 'admin' : 'vendedora'
  const pagina = typeof body?.pagina === 'string' ? body.pagina.toLowerCase().slice(0, 60) : ''
  if (!senha || (tipo === 'vendedora' && !SLUG_RE.test(pagina))) return respostaJson({ erro: ERRO_SENHA }, 401)

  const ip = ipDe(req)
  const alvo = tipo === 'admin' ? 'admin' : `v:${pagina}`

  try {
    if (await loginTravado(ip, alvo)) {
      return respostaJson({ erro: 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.' }, 429)
    }

    let cookie: string | null = null
    if (tipo === 'admin') {
      const { ADMIN_SENHA } = process.env
      if (!ADMIN_SENHA) throw new Error('ADMIN_SENHA ausente')
      if (await textosIguais(senha, ADMIN_SENHA)) cookie = await abrirSessao(req, { t: 'a' })
    } else {
      const [v] = await selecionar<{ slug: string; senha_hash: string | null }>('vendedoras', {
        select: 'slug,senha_hash',
        pagina: `eq.${pagina}`,
        ativa: 'eq.true',
        limit: '1',
      })
      // Roda o PBKDF2 mesmo sem vendedora, para o tempo de resposta não revelar se o nome existe
      const ok = await conferirSenha(senha, v?.senha_hash ?? null)
      if (ok && v?.senha_hash) cookie = await abrirSessao(req, { t: 'v', s: v.slug, h: await impressaoSenha(v.senha_hash) })
    }

    if (!cookie) {
      await registrarFalha(ip, alvo)
      return respostaJson({ erro: ERRO_SENHA }, 401)
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Set-Cookie': cookie },
    })
  } catch (error) {
    console.error('Error in entrar:', error)
    return respostaJson({ erro: 'Não foi possível entrar agora. Tente de novo.' }, 502)
  }
}
