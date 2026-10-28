/**
 * GET /api/catalogo — vendedoras e ofertas ativas, para a tela das vendedoras.
 * Público (não expõe nada além do que já vai no link enviado ao cliente).
 */
import { respostaJson, selecionar } from '../src/server/db'
import type { Oferta, Produto, Vendedora } from '../src/shared/tipos'

export const config = { runtime: 'edge' }

export default async function handler(): Promise<Response> {
  try {
    const [produtos, vendedoras, ofertas] = await Promise.all([
      selecionar<Produto>('produtos', { order: 'ordem.asc,nome.asc' }),
      selecionar<Vendedora>('vendedoras', { ativa: 'eq.true', order: 'slug.asc' }),
      selecionar<Oferta>('ofertas', { ativa: 'eq.true', order: 'ticket.desc.nullslast,nome.asc' }),
    ])
    // Cache curto na borda: uma oferta nova aparece para as vendedoras em até 30 s
    return respostaJson({ produtos, vendedoras, ofertas }, 200, 'public, max-age=0, s-maxage=30, stale-while-revalidate=300')
  } catch (error) {
    console.error('Error in catalogo:', error)
    return respostaJson({ erro: 'Falha ao carregar o catálogo.' }, 502)
  }
}
