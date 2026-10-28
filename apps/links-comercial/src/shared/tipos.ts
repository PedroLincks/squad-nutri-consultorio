/** Tipos compartilhados entre a página (src/) e as funções da Vercel (api/). */

export type Produto = {
  /** "ANC" — base do utm_campaign ("ANC-Comercial") e do slug ("anc3500") */
  sigla: string
  nome: string
  /** Ordem dos blocos na tela (menor primeiro) */
  ordem: number
}

export type TipoOferta = 'avista' | 'downsell' | 'recorrencia'

export type Vendedora = {
  /** Código que vai no link enviado ao cliente: sales.../01/anc3500 */
  slug: string
  /** Vai no utm_medium: "Larissa" */
  nome: string
  /** Endereço da página dela: sales.../larissa (pede senha) */
  pagina: string
  ativa: boolean
}

/** Como o admin vê a vendedora: nunca recebe o hash, só se a senha existe */
export type VendedoraAdmin = Vendedora & { tem_senha: boolean }

export type Oferta = {
  id: number
  /** Vai na URL curta: comercial.../larissa/wn-297 */
  slug: string
  /** Nome do produto, usado para agrupar na tela: "Webnutri" */
  produto: string
  /** Sigla do produto: "WN" — base do utm_campaign */
  sigla: string
  /** Nome da oferta mostrado à vendedora: "Oferta 297" */
  nome: string
  /** À vista, downsell ou recorrência (null nas ofertas anteriores à migração 2) */
  tipo: TipoOferta | null
  /** Valor cobrado, em reais */
  ticket: number | null
  /** Link do checkout (Guru, Pagar.me…) sem UTMs */
  destino: string
  utm_campaign: string
  utm_content: string
  /** Quando usar este link (texto livre para a vendedora) */
  orientacao: string | null
  ativa: boolean
  /** Sem uso na tela desde 28/10/2026 (ofertas ordenadas por ticket); coluna mantida no banco */
  ordem: number
}

export type OfertaEntrada = Omit<Oferta, 'id'> & { id?: number }

/** Oferta como a vendedora recebe: sem o checkout nem as UTMs (isso só existe no servidor) */
export type OfertaVendedora = Pick<Oferta, 'id' | 'slug' | 'produto' | 'sigla' | 'nome' | 'tipo' | 'ticket' | 'orientacao'>

/** O que a página da vendedora recebe depois do login: só os dados dela */
export type CatalogoVendedora = {
  vendedora: { nome: string; codigo: string }
  produtos: Pick<Produto, 'sigla' | 'nome'>[]
  ofertas: OfertaVendedora[]
}

export type Clique = {
  created_at: string
  vendedora: string
  oferta: string
  is_bot: boolean
}

export type DadosAdmin = {
  produtos: Produto[]
  vendedoras: VendedoraAdmin[]
  ofertas: Oferta[]
  cliques: Clique[]
}
