import { useCallback, useEffect, useRef, useState } from 'react'

type Tipo = 'ok' | 'erro'

/** Aviso rápido no rodapé da tela ("Link copiado!") */
export function useToast() {
  const [toast, setToast] = useState<{ texto: string; tipo: Tipo } | null>(null)
  const timer = useRef<number>()

  const mostrar = useCallback((texto: string, tipo: Tipo = 'ok') => {
    window.clearTimeout(timer.current)
    setToast({ texto, tipo })
    timer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const elemento = toast ? (
    <div
      role="status"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 ${toast ? 'animate-[fadeIn_.2s_ease-out]' : ''}`}
    >
      <div
        className={`rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg ${
          toast.tipo === 'ok' ? 'bg-gray-900' : 'bg-brand-red'
        }`}
      >
        {toast.texto}
      </div>
    </div>
  ) : null

  return { mostrar, elemento }
}
