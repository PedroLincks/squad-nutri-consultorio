/**
 * Registro de eventos do funil no Supabase (tabela quiz_events).
 * Sem VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY configuradas, não faz nada.
 */
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

/** UTMs da URL; se a URL não tiver nenhuma (ex.: refresh após navegar), usa as guardadas na sessão */
function readUtms(): Record<string, string | null> {
  const params = new URLSearchParams(location.search)
  const fromUrl = Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k)]))
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
      session_id: sessionId,
      event,
      ...extra,
      ...utms,
      device,
      referrer: document.referrer || null,
    }),
  }).catch((error) => console.error('Error in track:', error))
}
