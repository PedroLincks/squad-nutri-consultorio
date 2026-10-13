export interface Contagens {
  acessos: number
  iniciou: number
  vsl: number
}

export interface Stats {
  funil: Contagens & { perguntas: Record<string, number> }
  respostas: { pergunta: string; opcao: string; n: number }[]
  criativos: (Contagens & { criativo: string })[]
  diario: (Contagens & { dia: string })[]
  aparelhos: Record<string, number>
}
