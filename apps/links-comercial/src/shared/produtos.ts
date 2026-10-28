import type { Produto, TipoOferta } from './tipos'

/** Rótulos dos tipos de oferta, na ordem do seletor */
export const TIPOS_OFERTA: { id: TipoOferta; rotulo: string }[] = [
  { id: 'avista', rotulo: 'À vista' },
  { id: 'downsell', rotulo: 'Downsell' },
  { id: 'recorrencia', rotulo: 'Recorrência' },
]

export function rotuloTipo(tipo: TipoOferta | null): string {
  return TIPOS_OFERTA.find((t) => t.id === tipo)?.rotulo ?? 'Sem tipo'
}

/** Posição do produto na lista cadastrada (produtos desconhecidos vão para o fim) */
export function ordemProduto(produtos: Produto[], nomeOuSigla: string): number {
  const i = produtos.findIndex((p) => p.nome === nomeOuSigla || p.sigla === nomeOuSigla)
  return i === -1 ? produtos.length : i
}
