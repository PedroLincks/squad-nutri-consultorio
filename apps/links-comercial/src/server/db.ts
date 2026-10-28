/**
 * Acesso ao Supabase pela REST (PostgREST) com a service_role.
 * Só roda nas funções da Vercel (api/) — a chave nunca vai para o navegador.
 */

function config() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Banco sem configuração no servidor (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).')
  }
  return { url: `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1`, key: SUPABASE_SERVICE_ROLE_KEY }
}

export class ErroBanco extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function chamar<T>(metodo: string, tabela: string, params: Record<string, string>, body?: unknown, prefer?: string): Promise<T> {
  const { url, key } = config()
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${url}/${tabela}${qs ? `?${qs}` : ''}`, {
    method: metodo,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    const texto = await res.text()
    throw new ErroBanco(`Supabase ${res.status}: ${texto}`, res.status)
  }
  if (res.status === 204 || prefer?.includes('return=minimal')) return undefined as T
  return (await res.json()) as T
}

/** SELECT com filtros no formato do PostgREST: { slug: 'eq.larissa', order: 'nome.asc' } */
export function selecionar<T>(tabela: string, params: Record<string, string> = {}): Promise<T[]> {
  return chamar<T[]>('GET', tabela, params)
}

export function inserir<T>(tabela: string, dados: unknown): Promise<T[]> {
  return chamar<T[]>('POST', tabela, {}, dados, 'return=representation')
}

/** INSERT sem esperar resposta (registro de clique) */
export function inserirSemRetorno(tabela: string, dados: unknown): Promise<void> {
  return chamar<void>('POST', tabela, {}, dados, 'return=minimal')
}

/** INSERT ou UPDATE pela chave primária / unique */
export function gravar<T>(tabela: string, dados: unknown, conflito?: string): Promise<T[]> {
  const params: Record<string, string> = conflito ? { on_conflict: conflito } : {}
  return chamar<T[]>('POST', tabela, params, dados, 'resolution=merge-duplicates,return=representation')
}

export function atualizar<T>(tabela: string, filtro: Record<string, string>, dados: unknown): Promise<T[]> {
  return chamar<T[]>('PATCH', tabela, filtro, dados, 'return=representation')
}

export function excluir(tabela: string, filtro: Record<string, string>): Promise<void> {
  return chamar<void>('DELETE', tabela, filtro)
}

export function respostaJson(body: unknown, status = 200, cache = 'no-store'): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
  })
}
