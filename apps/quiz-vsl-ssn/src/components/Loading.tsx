import { useEffect, useState } from 'react'
import { loading } from '../data/content'

const RAIO = 54
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export function Loading({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let frame: number
    const inicio = performance.now()
    const tick = (agora: number) => {
      const t = Math.min((agora - inicio) / loading.duracaoMs, 1)
      // Desacelera perto do fim, para parecer carregamento de verdade
      setPercent(Math.round((1 - Math.pow(1 - t, 2)) * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setTimeout(onDone, 300)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onDone])

  const indice = Math.min(Math.floor((percent / 100) * loading.status.length), loading.status.length - 1)

  return (
    <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      <h2 className="font-montserrat text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
        ⏳ {loading.titulo}
      </h2>

      <div className="relative h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={RAIO} fill="none" strokeWidth="10" className="stroke-brand-pink" />
          <circle
            cx="60"
            cy="60"
            r={RAIO}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className="stroke-brand-red"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={CIRCUNFERENCIA * (1 - percent / 100)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-montserrat text-3xl font-extrabold text-gray-900">
          {percent}%
        </span>
      </div>

      <p key={indice} className="animate-fade-in text-base font-semibold text-gray-500">
        {loading.status[indice]}
      </p>
    </div>
  )
}
