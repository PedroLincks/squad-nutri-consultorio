import { somarDias } from './periodo'
import type { Stats } from './types'

/** Dados fictícios só para conferir o layout em desenvolvimento (?demo=1). */
export function statsDemo(from: string, to: string): Stats {
  const diario: Stats['diario'] = []
  let i = 0
  for (let d = from; d <= to; d = somarDias(d, 1), i++) {
    const acessos = 180 + Math.round(60 * Math.sin(i / 2)) + i * 6
    const iniciou = Math.round(acessos * 0.62)
    diario.push({ dia: d, acessos, iniciou, vsl: Math.round(iniciou * 0.71) })
  }
  const soma = (k: 'acessos' | 'iniciou' | 'vsl') => diario.reduce((s, d) => s + d[k], 0)
  const acessos = soma('acessos')
  const iniciou = soma('iniciou')
  const vsl = soma('vsl')
  const p = (f: number) => Math.round(iniciou * f)
  return {
    diario,
    funil: { acessos, iniciou, vsl, perguntas: { perfil: p(0.97), tempo_atendimento: p(0.9), seguidores: p(0.84), dificuldade: p(0.74) } },
    aparelhos: { mobile: Math.round(acessos * 0.93), desktop: Math.round(acessos * 0.07) },
    criativos: [
      { campanha: '[SSN][VSL LEAD 01][MEIO]', criativo: '[NUTRI] React-01 | 120210000000001', acessos: Math.round(acessos * 0.41), iniciou: Math.round(acessos * 0.41 * 0.66), vsl: Math.round(acessos * 0.41 * 0.5) },
      { campanha: '[SSN][VSL LEAD 01][MEIO]', criativo: '[NUTRI] Caixinha-03 | 120210000000002', acessos: Math.round(acessos * 0.33), iniciou: Math.round(acessos * 0.33 * 0.58), vsl: Math.round(acessos * 0.33 * 0.39) },
      { campanha: '[SSN][VSL LEAD 02][FUNDO]', criativo: '[NUTRI] B-roll-07 | 120210000000003', acessos: Math.round(acessos * 0.2), iniciou: Math.round(acessos * 0.2 * 0.61), vsl: Math.round(acessos * 0.2 * 0.44) },
      { campanha: '(sem utm_campaign)', criativo: '(sem utm_content)', acessos: Math.round(acessos * 0.06), iniciou: Math.round(acessos * 0.06 * 0.4), vsl: Math.round(acessos * 0.06 * 0.25) },
    ],
    respostas: [
      ['perfil', 'formada', 0.82], ['perfil', 'estudante', 0.15],
      ['tempo_atendimento', 'recem_formada', 0.21], ['tempo_atendimento', '1_2_anos', 0.33], ['tempo_atendimento', '2_4_anos', 0.24], ['tempo_atendimento', '5_mais', 0.12],
      ['seguidores', 'ate_1k', 0.31], ['seguidores', '1k_3k', 0.28], ['seguidores', '3k_6k', 0.14], ['seguidores', '6k_10k', 0.07], ['seguidores', '10k_mais', 0.04],
      ['dificuldade', 'poucas_views', 0.22], ['dificuldade', 'sem_interacao', 0.27], ['dificuldade', 'nao_sei_postar', 0.16], ['dificuldade', 'vergonha', 0.09],
    ].map(([pergunta, opcao, f]) => ({ pergunta: pergunta as string, opcao: opcao as string, n: p(f as number) })),
  }
}
