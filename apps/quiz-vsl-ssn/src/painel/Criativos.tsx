import { useMemo, useState } from 'react'
import { fmtNum, fmtPct, pct } from './periodo'
import type { Contagens, Stats } from './types'

type Visao = 'campanhas' | 'criativos'
type Coluna = 'acessos' | 'inicio' | 'vsl'

const TODAS = '__todas__'
const SEM_CAMPANHA = '(sem utm_campaign)'

/** UTMs costumam vir como "<nome>|<id>" — mostra só o nome */
const nome = (c: string) => c.split('|')[0].trim() || c

function somar(linhas: Contagens[]): Contagens {
  return linhas.reduce((t, l) => ({ acessos: t.acessos + l.acessos, iniciou: t.iniciou + l.iniciou, vsl: t.vsl + l.vsl }), {
    acessos: 0,
    iniciou: 0,
    vsl: 0,
  })
}

/** Funil por campanha (utm_campaign) e por criativo (utm_content), com filtro de campanha. */
export function Criativos({ criativos }: { criativos: Stats['criativos'] }) {
  const [visao, setVisao] = useState<Visao>('campanhas')
  const [campanha, setCampanha] = useState(TODAS)
  const [ordem, setOrdem] = useState<Coluna>('acessos')

  const porCampanha = useMemo(() => {
    const grupos = new Map<string, Stats['criativos']>()
    for (const c of criativos) {
      const k = c.campanha ?? SEM_CAMPANHA
      grupos.set(k, [...(grupos.get(k) ?? []), c])
    }
    return [...grupos.entries()].map(([k, linhas]) => ({ chave: k, ...somar(linhas) }))
  }, [criativos])

  const linhas = useMemo(() => {
    const base =
      visao === 'campanhas'
        ? porCampanha
        : criativos
            .filter((c) => campanha === TODAS || (c.campanha ?? SEM_CAMPANHA) === campanha)
            // Com "todas", o mesmo criativo pode rodar em mais de uma campanha: soma por criativo
            .reduce<(Contagens & { chave: string })[]>((acc, c) => {
              const existente = acc.find((a) => a.chave === c.criativo)
              if (existente) Object.assign(existente, somar([existente, c]))
              else acc.push({ chave: c.criativo, acessos: c.acessos, iniciou: c.iniciou, vsl: c.vsl })
              return acc
            }, [])
    return base
      .map((l) => ({ ...l, inicio: pct(l.iniciou, l.acessos), taxaVsl: pct(l.vsl, l.acessos) }))
      .sort((a, b) => (ordem === 'acessos' ? b.acessos - a.acessos : ordem === 'inicio' ? b.inicio - a.inicio : b.taxaVsl - a.taxaVsl))
  }, [visao, campanha, ordem, criativos, porCampanha])

  const th = (col: Coluna, label: string) => (
    <th className="px-3 py-2 text-right">
      <button
        onClick={() => setOrdem(col)}
        className={ordem === col ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}
      >
        {label} {ordem === col && '↓'}
      </button>
    </th>
  )

  const aba = (v: Visao, label: string) => (
    <button
      onClick={() => setVisao(v)}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
        visao === v
          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
          : 'text-gray-600 ring-1 ring-gray-200 hover:ring-gray-400 dark:text-gray-400 dark:ring-gray-700 dark:hover:ring-gray-500'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {aba('campanhas', 'Por campanha')}
        {aba('criativos', 'Por criativo')}
        {visao === 'criativos' && (
          <select
            value={campanha}
            onChange={(e) => setCampanha(e.target.value)}
            className="ml-auto max-w-full rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700"
          >
            <option value={TODAS}>Todas as campanhas</option>
            {[...porCampanha]
              .sort((a, b) => b.acessos - a.acessos)
              .map((c) => (
                <option key={c.chave} value={c.chave}>
                  {nome(c.chave)} ({fmtNum(c.acessos)})
                </option>
              ))}
          </select>
        )}
      </div>

      {!linhas.length ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Sem acessos no período.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm text-gray-900 dark:text-gray-100">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide dark:bg-gray-950">
              <tr>
                <th className="px-3 py-2 text-left text-gray-500 dark:text-gray-400">
                  {visao === 'campanhas' ? 'Campanha (utm_campaign)' : 'Criativo (utm_content)'}
                </th>
                {th('acessos', 'Acessos')}
                {th('inicio', 'Iniciaram')}
                {th('vsl', 'Chegaram na VSL')}
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr
                  key={l.chave}
                  onClick={visao === 'campanhas' ? () => { setCampanha(l.chave); setVisao('criativos') } : undefined}
                  className={`border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60 ${visao === 'campanhas' ? 'cursor-pointer' : ''}`}
                  title={visao === 'campanhas' ? `${l.chave} — clique para ver os criativos` : l.chave}
                >
                  <td className="max-w-[360px] truncate px-3 py-2 text-gray-800 dark:text-gray-200">
                    {nome(l.chave)}
                    {visao === 'campanhas' && <span className="ml-1 text-gray-400 dark:text-gray-500">›</span>}
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
      )}
    </div>
  )
}
