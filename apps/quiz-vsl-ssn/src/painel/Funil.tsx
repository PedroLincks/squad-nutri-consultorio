import { questions } from '../data/questions'
import { fmtNum, fmtPct, pct } from './periodo'
import type { Stats } from './types'

/** Funil etapa a etapa: barras horizontais, uma cor só, com a perda entre etapas. */
export function Funil({ funil, semCapa = false }: { funil: Stats['funil']; semCapa?: boolean }) {
  const etapas = [
    { label: 'Acessaram a página', n: funil.acessos },
    // Sem capa, "iniciou" = respondeu a P1: a etapa não se repete
    ...(semCapa ? [] : [{ label: 'Iniciaram o quiz', n: funil.iniciou }]),
    ...questions.map((q, i) => ({ label: `P${i + 1} · ${q.question}`, n: funil.perguntas[q.key] ?? 0 })),
    { label: 'Chegaram na VSL', n: funil.vsl },
  ]

  const perdas = etapas.map((e, i) => (i === 0 ? 0 : pct(etapas[i - 1].n - e.n, etapas[i - 1].n)))
  const maiorPerda = perdas.indexOf(Math.max(...perdas))

  return (
    <div className="space-y-2">
      {etapas.map((e, i) => {
        const largura = pct(e.n, funil.acessos)
        const destaque = i === maiorPerda && perdas[i] > 0
        return (
          <div key={e.label}>
            {i > 0 && (
              <div className={`py-0.5 pl-1 text-xs ${destaque ? 'font-bold text-brand-red dark:text-red-400' : 'text-gray-400'}`}>
                ↓ perdeu {fmtPct(perdas[i])}
                {destaque && ' · maior abandono'}
              </div>
            )}
            <div className="group relative" title={`${e.label}: ${fmtNum(e.n)} sessões (${fmtPct(largura)} dos acessos)`}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-gray-700 dark:text-gray-300">{e.label}</span>
                <span className="shrink-0 tabular-nums text-gray-900 dark:text-gray-100">
                  <b>{fmtNum(e.n)}</b> <span className="text-gray-500 dark:text-gray-400">· {fmtPct(largura)}</span>
                </span>
              </div>
              <div className="h-3 rounded bg-gray-100 dark:bg-gray-800">
                <div className="h-3 rounded bg-brand-red transition-all group-hover:brightness-110" style={{ width: `${largura}%` }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
