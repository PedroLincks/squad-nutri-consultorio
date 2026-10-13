/**
 * GET /api/stats?from=AAAA-MM-DD&to=AAAA-MM-DD  (datas inclusivas, fuso de Brasília)
 * Header obrigatório: x-painel-senha
 * Lê os agregados do Supabase com a service_role — a chave nunca vai para o navegador.
 */
export const config = { runtime: 'edge' }

const DATA = /^\d{4}-\d{2}-\d{2}$/

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function diaSeguinte(data: string) {
  const d = new Date(`${data}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default async function handler(req: Request): Promise<Response> {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAINEL_SENHA } = process.env
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !PAINEL_SENHA) {
    return json({ erro: 'Painel sem configuração no servidor (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAINEL_SENHA).' }, 500)
  }
  if (req.headers.get('x-painel-senha') !== PAINEL_SENHA) {
    return json({ erro: 'Senha incorreta.' }, 401)
  }

  const params = new URL(req.url).searchParams
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  if (!DATA.test(from) || !DATA.test(to) || from > to) {
    return json({ erro: 'Período inválido.' }, 400)
  }

  try {
    // Brasil não tem horário de verão desde 2019: -03:00 fixo
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/quiz_stats`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_from: `${from}T00:00:00-03:00`, p_to: `${diaSeguinte(to)}T00:00:00-03:00` }),
    })
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`)
    return json(await res.json())
  } catch (error) {
    console.error('Error in stats:', error)
    return json({ erro: 'Falha ao consultar o Supabase.' }, 502)
  }
}
