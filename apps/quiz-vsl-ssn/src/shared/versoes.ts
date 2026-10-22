/**
 * Versões do funil. Cada uma grava os eventos com o próprio `funnel` no banco,
 * e o painel mostra uma aba por versão. Nova versão = nova entrada aqui (a última é a que está no ar).
 */
export const VERSOES = [
  {
    funnel: 'quiz-vsl-ssn',
    label: 'Versão 01 · com capa',
    inicio: '2026-10-12',
    fim: '2026-10-22', // saiu do ar em 22/10 às 10:29 (Brasília)
  },
  {
    funnel: 'quiz-vsl-ssn-v2',
    label: 'Versão 02 · sem capa',
    inicio: '2026-10-22',
    fim: null,
    /** Sem capa, "iniciou o quiz" é o mesmo que responder a P1 — o painel não repete a etapa */
    semCapa: true,
  },
] as const

export type Versao = (typeof VERSOES)[number]
export const VERSAO_ATUAL = VERSOES[VERSOES.length - 1]
