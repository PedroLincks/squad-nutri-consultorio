/**
 * Registro de eventos do funil no Supabase (tabela quiz_events).
 * Sem VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY configuradas, não faz nada.
 */
import { VERSAO_ATUAL } from '../shared/versoes'

type FunnelEvent = 'page_view' | 'quiz_start' | 'answer' | 'vsl_view'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

function safeSession<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch {
    return fallback
  }
}

/** ID anônimo da visita — sobrevive a um refresh na mesma aba */
const sessionId = safeSession(() => {
  let id = sessionStorage.getItem('qvs_session')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('qvs_session', id)
  }
  return id
}, crypto.randomUUID())

/**
 * Alguns cliques chegam com a UTM codificada duas vezes ("%5BSSN%5D+Cont." em vez de "[SSN] Cont.").
 * Decodifica de novo para cair na mesma campanha/criativo dos demais.
 */
function normalizarUtm(valor: string | null): string | null {
  if (!valor || !/%[0-9A-Fa-f]{2}/.test(valor)) return valor
  try {
    return decodeURIComponent(valor.replace(/\+/g, ' '))
  } catch {
    return valor
  }
}

/** UTMs da URL; se a URL não tiver nenhuma (ex.: refresh após navegar), usa as guardadas na sessão */
function readUtms(): Record<string, string | null> {
  const params = new URLSearchParams(location.search)
  const fromUrl = Object.fromEntries(UTM_KEYS.map((k) => [k, normalizarUtm(params.get(k))]))
  if (Object.values(fromUrl).some(Boolean)) {
    safeSession(() => sessionStorage.setItem('qvs_utms', JSON.stringify(fromUrl)), undefined)
    return fromUrl
  }
  return safeSession(() => {
    const saved = sessionStorage.getItem('qvs_utms')
    return saved ? (JSON.parse(saved) as Record<string, string | null>) : fromUrl
  }, fromUrl)
}

const utms = readUtms()

const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'

/** Robôs e pré-visualizações conhecidas: ficam gravados, mas fora da contagem do painel */
const isBot =
  navigator.webdriver ||
  /bot|crawl|spider|slurp|facebookexternalhit|facebot|meta-externalagent|headless|lighthouse|pagespeed|preview|vercel/i.test(
    navigator.userAgent,
  )

/**
 * Chama `fn` uma única vez, quando a página estiver de fato na tela.
 * Pré-carregamentos (o app da Meta abre o link em segundo plano antes do clique) ficam invisíveis
 * e por isso não contam como acesso.
 */
export function quandoVisivel(fn: () => void): () => void {
  const doc = document as Document & { prerendering?: boolean }
  const pronto = () => document.visibilityState === 'visible' && !doc.prerendering
  if (pronto()) {
    fn()
    return () => {}
  }
  const onChange = () => {
    if (!pronto()) return
    limpar()
    fn()
  }
  const limpar = () => {
    document.removeEventListener('visibilitychange', onChange)
    document.removeEventListener('prerenderingchange', onChange)
  }
  document.addEventListener('visibilitychange', onChange)
  document.addEventListener('prerenderingchange', onChange)
  return limpar
}

export function track(event: FunnelEvent, extra: { step_key?: string; answer?: string } = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (import.meta.env.DEV) console.info('[track]', event, extra)
    return
  }

  fetch(`${SUPABASE_URL}/rest/v1/quiz_events`, {
    method: 'POST',
    keepalive: true, // garante o envio mesmo se a pessoa fechar a aba
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      funnel: VERSAO_ATUAL.funnel,
      session_id: sessionId,
      event,
      ...extra,
      ...utms,
      device,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 400),
      is_bot: isBot,
    }),
  }).catch((error) => console.error('Error in track:', error))
}
