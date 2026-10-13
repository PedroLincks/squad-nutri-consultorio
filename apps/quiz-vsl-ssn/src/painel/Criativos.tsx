import { useState } from 'react'
import { fmtNum, fmtPct, pct } from './periodo'
import type { Stats } from './types'

type Coluna = 'acessos' | 'inicio' | 'vsl'

/** utm_content vem como "<nome do criativo>|<ad_id>" — mostra só o nome */
const nomeCriativo = (c: string) => c.split('|')[0].trim() || c

export function Criativos({ criativos }: { criativos: Stats['criativos'] }) {
  const [ordem, setOrdem] = useState<Coluna>('acessos')

  const linhas = criativos
    .map((c) => ({ ...c, inicio: pct(c.iniciou, c.acessos), taxaVsl: pct(c.vsl, c.acessos) }))
    .sort((a, b) => (ordem === 'acessos' ? b.acessos - a.acessos : ordem === 'inicio' ? b.inicio - a.inicio : b.taxaVsl - a.taxaVsl))

  const th = (col: Coluna, label: string) => (
    <th className="px-3 py-2 text-right">
      <button onClick={() => setOrdem(col)} className={ordem === col ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}>
        {label} {ordem === col && '↓'}
      </button>
    </th>
  )

  if (!linhas.length) return <p className="text-sm text-gray-500 dark:text-gray-400">Sem acessos no período.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm text-gray-900 dark:text-gray-100">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide dark:bg-gray-950">
          <tr>
            <th className="px-3 py-2 text-left text-gray-500 dark:text-gray-400">Criativo (utm_content)</th>
            {th('acessos', 'Acessos')}
            {th('inicio', 'Iniciaram')}
            {th('vsl', 'Chegaram na VSL')}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.criativo} className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60">
              <td className="max-w-[320px] truncate px-3 py-2 text-gray-800 dark:text-gray-200" title={l.criativo}>
                {nomeCriativo(l.criativo)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtNum(l.acessos)}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {fmtPct(l.inicio)} <span className="text-gray-400 dark:text-gray-500">({fmtNum(l.iniciou)})</span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                <b>{fmtPct(l.taxaVsl)}</b> <span className="text-gray-400 dark:text-gray-500">({fmtNum(l.vsl)})</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
