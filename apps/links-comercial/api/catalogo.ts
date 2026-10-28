/**
 * GET /api/catalogo?pagina=larissa — ofertas ativas para a vendedora logada.
 * Exige a sessão da própria vendedora (cookie). Não devolve checkout, UTMs nem outras vendedoras.
 */
import { respostaJson, selecionar } from '../src/server/db'
import { impressaoSenha, sessaoVendedora } from '../src/server/sessao'
import type { CatalogoVendedora, OfertaVendedora, Produto } from '../src/shared/tipos'

export const config = { runtime: 'edge' }

const PRIVADO = 'private, no-store'

export default async function handler(req: Request): Promise<Response> {
  const pagina = (new URL(req.url).searchParams.get('pagina') ?? '').toLowerCase()
  try {
    const sessao = await sessaoVendedora(req)
    if (!sessao) return respostaJson({ erro: 'Faça login.' }, 401, PRIVADO)

    const [v] = await selecionar<{ slug: string; nome: string; pagina: string; senha_hash: string | null }>('vendedoras', {
      select: 'slug,nome,pagina,senha_hash',
      slug: `eq.${sessao.codigo}`,
      ativa: 'eq.true',
      limit: '1',
    })
    // Sessão de outra vendedora, vendedora desativada ou senha trocada depois do login
    if (!v || !v.senha_hash || v.pagina !== pagina || (await impressaoSenha(v.senha_hash)) !== sessao.impressao) {
      return respostaJson({ erro: 'Faça login.' }, 401, PRIVADO)
    }

    const [produtos, ofertas] = await Promise.all([
      selecionar<Pick<Produto, 'sigla' | 'nome'>>('produtos', { select: 'sigla,nome', order: 'ordem.asc,nome.asc' }),
      selecionar<OfertaVendedora>('ofertas', {
        select: 'id,slug,produto,sigla,nome,tipo,ticket,orientacao',
        ativa: 'eq.true',
        order: 'ticket.desc.nullslast,nome.asc',
      }),
    ])
    const resposta: CatalogoVendedora = { vendedora: { nome: v.nome, codigo: v.slug }, produtos, ofertas }
    return respostaJson(resposta, 200, PRIVADO)
  } catch (error) {
    console.error('Error in catalogo:', error)
    return respostaJson({ erro: 'Falha ao carregar as ofertas.' }, 502, PRIVADO)
  }
}
