import type { ReactNode } from 'react'

export function Cabecalho({ titulo, subtitulo, acao }: { titulo: string; subtitulo?: string; acao?: ReactNode }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-red">Nutri de Consultório · Comercial</div>
        <h1 className="mt-1 text-2xl font-extrabold leading-tight text-gray-900">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-gray-500">{subtitulo}</p>}
      </div>
      {acao}
    </header>
  )
}

export function Pagina({ children, largura = 'max-w-xl' }: { children: ReactNode; largura?: string }) {
  return (
    <div className="flex min-h-screen justify-center px-4 py-6 sm:py-10">
      <div className={`w-full ${largura}`}>{children}</div>
    </div>
  )
}

export function Aviso({ children, tipo = 'info' }: { children: ReactNode; tipo?: 'info' | 'erro' }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        tipo === 'erro' ? 'border-red-200 bg-red-50 text-red-800' : 'border-gray-200 bg-white text-gray-600'
      }`}
    >
      {children}
    </div>
  )
}
