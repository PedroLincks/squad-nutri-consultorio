import type { Catalogo, DadosAdmin } from '../shared/tipos'

export class ErroApi extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function ler<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => ({}))) as { erro?: string }
  if (!res.ok) throw new ErroApi(body.erro ?? `Erro ${res.status}`, res.status)
  return body as T
}

export async function carregarCatalogo(): Promise<Catalogo> {
  return ler<Catalogo>(await fetch('/api/catalogo'))
}

export async function adminListar(senha: string): Promise<DadosAdmin> {
  return ler<DadosAdmin>(await fetch('/api/admin', { headers: { 'x-admin-senha': senha } }))
}

export async function adminExecutar(senha: string, acao: string, dados: unknown): Promise<DadosAdmin> {
  return ler<DadosAdmin>(
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'x-admin-senha': senha, 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao, dados }),
    }),
  )
}

/** Domínio público dos links curtos */
export const DOMINIO = (import.meta.env.VITE_DOMINIO as string | undefined) || 'https://sales.nutrideconsultorio.com'
