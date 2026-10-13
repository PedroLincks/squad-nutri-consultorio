import { questions } from '../data/questions'
import { fmtNum, fmtPct, pct } from './periodo'
import type { Stats } from './types'

/** Distribuição das respostas de cada pergunta (rótulos vêm do próprio quiz). */
export function Respostas({ respostas }: { respostas: Stats['respostas'] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {questions.map((q, i) => {
        const daPergunta = respostas.filter((r) => r.pergunta === q.key)
        const total = daPergunta.reduce((s, r) => s + r.n, 0)
        return (
          <div key={q.key} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
              P{i + 1} · {q.question} <span className="font-normal text-gray-500 dark:text-gray-400">({fmtNum(total)})</span>
            </h3>
            <div className="space-y-2.5">
              {q.options.map((o) => {
                const n = daPergunta.find((r) => r.opcao === o.id)?.n ?? 0
                const p = pct(n, total)
                return (
                  <div key={o.id} title={`${o.label}: ${fmtNum(n)} (${fmtPct(p)})`}>
                    <div className="mb-1 flex justify-between gap-3 text-[13px]">
                      <span className="text-gray-700 dark:text-gray-300">{o.label}</span>
                      <span className="shrink-0 tabular-nums text-gray-900 dark:text-gray-100">
                        <b>{fmtPct(p)}</b> <span className="text-gray-500 dark:text-gray-400">· {fmtNum(n)}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded bg-gray-100 dark:bg-gray-800">
                      <div className="h-2 rounded bg-brand-red" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
