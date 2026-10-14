export interface Contagens {
  acessos: number
  iniciou: number
  vsl: number
}

export interface Stats {
  /** Sessões de robôs/pré-carregamentos, fora de todas as contagens */
  descartados?: number
  funil: Contagens & { perguntas: Record<string, number> }
  respostas: { pergunta: string; opcao: string; n: number }[]
  /** Uma linha por par campanha × criativo (campanha ausente = função SQL antiga) */
  criativos: (Contagens & { campanha?: string; criativo: string })[]
  diario: (Contagens & { dia: string })[]
  aparelhos: Record<string, number>
}
