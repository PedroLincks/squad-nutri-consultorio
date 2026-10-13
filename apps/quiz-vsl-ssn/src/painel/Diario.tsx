import { useState } from 'react'
import { fmtNum, fmtPct, formatarDia, pct, somarDias } from './periodo'
import type { Stats } from './types'

// Slots 1 e 2 da paleta categórica validada (azul / laranja), com os passos próprios do tema escuro
const SERIES = [
  { key: 'acessos', label: 'Acessos', claro: '#2a78d6', escuro: '#3987e5' },
  { key: 'vsl', label: 'Chegaram na VSL', claro: '#eb6834', escuro: '#d95926' },
] as const

const W = 720
const H = 240
const M = { top: 12, right: 12, bottom: 28, left: 40 }

/** Evolução diária: duas linhas no mesmo eixo, crosshair + tooltip no hover. */
export function Diario({ diario, from, to, escuro }: { diario: Stats['diario']; from: string; to: string; escuro: boolean }) {
  const [hover, setHover] = useState<number | null>(null)

  // Preenche os dias sem dado com zero, para a linha não "pular" dias
  const dias: Stats['diario'] = []
  for (let d = from; d <= to; d = somarDias(d, 1)) {
    dias.push(diario.find((x) => x.dia === d) ?? { dia: d, acessos: 0, iniciou: 0, vsl: 0 })
  }

  if (dias.length < 2) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Escolha um período de 2 dias ou mais para ver a evolução.</p>
  }

  const max = Math.max(1, ...dias.map((d) => d.acessos))
  const passo = Math.pow(10, Math.floor(Math.log10(max)))
  const topo = Math.ceil(max / passo) * passo
  const ticks = [0, topo / 2, topo]

  const iw = W - M.left - M.right
  const ih = H - M.top - M.bottom
  const x = (i: number) => M.left + (i / (dias.length - 1)) * iw
  const y = (v: number) => M.top + ih - (v / topo) * ih
  const cadaRotulo = Math.ceil(dias.length / 8)

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const rel = ((e.clientX - box.left) / box.width) * iw
    setHover(Math.max(0, Math.min(dias.length - 1, Math.round((rel / iw) * (dias.length - 1)))))
  }

  const h = hover !== null ? dias[hover] : null

  return (
    <div>
      <div className="mb-2 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: escuro ? s.escuro : s.claro }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Acessos e chegadas na VSL por dia">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className="stroke-gray-200 dark:stroke-gray-800" />
              <text x={M.left - 6} y={y(t) + 4} textAnchor="end" className="fill-gray-400 text-[11px] dark:fill-gray-500">
                {fmtNum(t)}
              </text>
            </g>
          ))}
          {dias.map((d, i) =>
            i % cadaRotulo === 0 ? (
              <text key={d.dia} x={x(i)} y={H - 8} textAnchor="middle" className="fill-gray-400 text-[11px] dark:fill-gray-500">
                {formatarDia(d.dia)}
              </text>
            ) : null,
          )}

          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + ih} className="stroke-gray-400 dark:stroke-gray-500" strokeDasharray="3 3" />}

          {SERIES.map((s) => (
            <g key={s.key}>
              <polyline
                fill="none"
                stroke={escuro ? s.escuro : s.claro}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={dias.map((d, i) => `${x(i)},${y(d[s.key])}`).join(' ')}
              />
              {hover !== null && <circle cx={x(hover)} cy={y(dias[hover][s.key])} r={4.5} fill={escuro ? s.escuro : s.claro} stroke={escuro ? '#111827' : '#fff'} strokeWidth={2} />}
            </g>
          ))}

          <rect
            x={M.left}
            y={M.top}
            width={iw}
            height={ih}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>

        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-800 dark:bg-gray-900"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > dias.length / 2 ? '-105%' : '5%'})` }}
          >
            <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">{formatarDia(h.dia)}</div>
            <div className="text-gray-700 dark:text-gray-300">Acessos: <b>{fmtNum(h.acessos)}</b></div>
            <div className="text-gray-700 dark:text-gray-300">Iniciaram: <b>{fmtNum(h.iniciou)}</b></div>
            <div className="text-gray-700 dark:text-gray-300">
              Chegaram na VSL: <b>{fmtNum(h.vsl)}</b> ({fmtPct(pct(h.vsl, h.acessos))})
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
