import type { CatalogoVendedora, DadosAdmin } from '../shared/tipos'

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

function postJson(url: string, dados: unknown): Promise<Response> {
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) })
}

/** A sessão fica num cookie HttpOnly: o JavaScript nunca guarda a senha nem o token */
export async function entrar(tipo: 'admin' | 'vendedora', senha: string, pagina?: string): Promise<void> {
  await ler(await postJson('/api/entrar', { tipo, senha, pagina }))
}

export async function sair(tipo: 'admin' | 'vendedora'): Promise<void> {
  await postJson('/api/sair', { tipo }).catch(() => {})
}

export async function carregarCatalogo(pagina: string): Promise<CatalogoVendedora> {
  return ler<CatalogoVendedora>(await fetch(`/api/catalogo?pagina=${encodeURIComponent(pagina)}`))
}

export async function adminListar(): Promise<DadosAdmin> {
  return ler<DadosAdmin>(await fetch('/api/admin'))
}

export async function adminExecutar(acao: string, dados: unknown): Promise<DadosAdmin> {
  return ler<DadosAdmin>(await postJson('/api/admin', { acao, dados }))
}

/** Decifra a senha de uma vendedora (só o admin, sob clique) */
export async function adminVerSenha(slug: string): Promise<string> {
  return (await ler<{ senha: string }>(await postJson('/api/admin', { acao: 'vendedora.verSenha', dados: { slug } }))).senha
}

/** Domínio público dos links curtos */
export const DOMINIO = (import.meta.env.VITE_DOMINIO as string | undefined) || 'https://sales.nutrideconsultorio.com'
