/**
 * /api/admin — cadastro de ofertas e vendedoras + cliques dos últimos 30 dias.
 * Header obrigatório: x-admin-senha (ADMIN_SENHA no servidor).
 *
 * GET  → { vendedoras, ofertas, cliques }
 * POST → { acao: 'oferta.salvar' | 'oferta.excluir' | 'vendedora.salvar' | 'vendedora.excluir' | 'produto.salvar' | 'produto.excluir', dados }
 */
import { ErroBanco, atualizar, excluir, gravar, inserir, respostaJson, selecionar } from '../src/server/db'
import { SLUG_RE } from '../src/shared/links'
import type { Clique, Oferta, OfertaEntrada, Produto, TipoOferta, Vendedora } from '../src/shared/tipos'

export const config = { runtime: 'edge' }

class ErroValidacao extends Error {}

function texto(valor: unknown, campo: string, max = 200): string {
  if (typeof valor !== 'string' || !valor.trim()) throw new ErroValidacao(`Preencha o campo "${campo}".`)
  if (valor.length > max) throw new ErroValidacao(`O campo "${campo}" é longo demais.`)
  return valor.trim()
}

function slug(valor: unknown, campo: string): string {
  const s = texto(valor, campo, 60).toLowerCase()
  if (!SLUG_RE.test(s)) throw new ErroValidacao(`O campo "${campo}" só aceita letras minúsculas, números e hífens.`)
  return s
}

function validarOferta(d: Record<string, unknown>): OfertaEntrada {
  const destino = texto(d.destino, 'link do checkout', 2000)
  let url: URL
  try {
    url = new URL(destino)
  } catch {
    throw new ErroValidacao('O link do checkout precisa ser uma URL completa, começando com https://')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new ErroValidacao('O link do checkout precisa começar com https://')

  const ticketBruto = d.ticket
  const ticket =
    ticketBruto === null || ticketBruto === undefined || ticketBruto === '' ? null : Number(ticketBruto)
  if (ticket !== null && (Number.isNaN(ticket) || ticket < 0)) throw new ErroValidacao('Ticket inválido.')

  const TIPOS: TipoOferta[] = ['avista', 'downsell', 'recorrencia']
  if (!TIPOS.includes(d.tipo as TipoOferta)) throw new ErroValidacao('Escolha o tipo da oferta (à vista, downsell ou recorrência).')

  return {
    ...(typeof d.id === 'number' ? { id: d.id } : {}),
    slug: slug(d.slug, 'slug'),
    produto: texto(d.produto, 'produto', 80),
    sigla: texto(d.sigla, 'sigla', 20).toUpperCase(),
    nome: texto(d.nome, 'nome da oferta', 80),
    tipo: d.tipo as TipoOferta,
    ticket,
    destino: url.toString(),
    utm_campaign: texto(d.utm_campaign, 'utm_campaign', 80),
    utm_content: texto(d.utm_content, 'utm_content', 80),
    orientacao: typeof d.orientacao === 'string' && d.orientacao.trim() ? d.orientacao.trim().slice(0, 1000) : null,
    ativa: d.ativa !== false,
    ordem: Number.isFinite(Number(d.ordem)) ? Number(d.ordem) : 0,
  }
}

function validarProduto(d: Record<string, unknown>): Produto {
  const sigla = texto(d.sigla, 'sigla', 20).toUpperCase()
  if (!/^[A-Z0-9]+$/.test(sigla)) throw new ErroValidacao('A sigla só aceita letras e números (ex.: ANC).')
  return { sigla, nome: texto(d.nome, 'nome do produto', 80), ordem: Number.isFinite(Number(d.ordem)) ? Number(d.ordem) : 0 }
}

function validarVendedora(d: Record<string, unknown>): Vendedora {
  return { slug: slug(d.slug, 'slug'), nome: texto(d.nome, 'nome', 60), ativa: d.ativa !== false }
}

function diasAtras(dias: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - dias)
  return d.toISOString()
}

async function listar() {
  const [produtos, vendedoras, ofertas, cliques] = await Promise.all([
    selecionar<Produto>('produtos', { order: 'ordem.asc,nome.asc' }),
    selecionar<Vendedora>('vendedoras', { order: 'slug.asc' }),
    selecionar<Oferta>('ofertas', { order: 'ticket.desc.nullslast,nome.asc' }),
    selecionar<Clique>('cliques', {
      select: 'created_at,vendedora,oferta,is_bot',
      created_at: `gte.${diasAtras(30)}`,
      order: 'created_at.desc',
      limit: '5000',
    }),
  ])
  return { produtos, vendedoras, ofertas, cliques }
}

async function executar(acao: unknown, dados: unknown) {
  const d = (dados ?? {}) as Record<string, unknown>
  switch (acao) {
    case 'oferta.salvar': {
      const oferta = validarOferta(d)
      if (oferta.id !== undefined) {
        const { id, ...resto } = oferta
        return atualizar<Oferta>('ofertas', { id: `eq.${id}` }, resto)
      }
      return inserir<Oferta>('ofertas', oferta)
    }
    case 'oferta.excluir': {
      if (typeof d.id !== 'number') throw new ErroValidacao('Oferta inválida.')
      await excluir('ofertas', { id: `eq.${d.id}` })
      return null
    }
    case 'produto.salvar':
      return gravar<Produto>('produtos', validarProduto(d), 'sigla')
    case 'produto.excluir': {
      const sigla = texto(d.sigla, 'sigla', 20).toUpperCase()
      const emUso = await selecionar<{ id: number }>('ofertas', { select: 'id', sigla: `eq.${sigla}`, limit: '1' })
      if (emUso.length) throw new ErroValidacao('Esse produto tem ofertas cadastradas. Exclua ou mova as ofertas antes.')
      await excluir('produtos', { sigla: `eq.${sigla}` })
      return null
    }
    case 'vendedora.salvar':
      return gravar<Vendedora>('vendedoras', validarVendedora(d), 'slug')
    case 'vendedora.excluir':
      await excluir('vendedoras', { slug: `eq.${slug(d.slug, 'slug')}` })
      return null
    default:
      throw new ErroValidacao('Ação desconhecida.')
  }
}

export default async function handler(req: Request): Promise<Response> {
  const { ADMIN_SENHA } = process.env
  if (!ADMIN_SENHA) return respostaJson({ erro: 'Admin sem configuração no servidor (ADMIN_SENHA).' }, 500)
  if (req.headers.get('x-admin-senha') !== ADMIN_SENHA) return respostaJson({ erro: 'Senha incorreta.' }, 401)

  try {
    if (req.method === 'GET') return respostaJson(await listar())
    if (req.method !== 'POST') return respostaJson({ erro: 'Método não suportado.' }, 405)

    const body = (await req.json().catch(() => null)) as { acao?: unknown; dados?: unknown } | null
    if (!body) return respostaJson({ erro: 'Corpo inválido.' }, 400)
    const resultado = await executar(body.acao, body.dados)
    return respostaJson({ ok: true, resultado, ...(await listar()) })
  } catch (error) {
    if (error instanceof ErroValidacao) return respostaJson({ erro: error.message }, 400)
    if (error instanceof ErroBanco && error.status === 409) {
      return respostaJson({ erro: 'Já existe um cadastro com esse slug ou sigla. Escolha outro.' }, 409)
    }
    console.error('Error in admin:', error)
    return respostaJson({ erro: 'Falha ao acessar o banco.' }, 502)
  }
}
