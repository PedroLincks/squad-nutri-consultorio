/**
 * GET /api/r?v={vendedora}&o={oferta}
 * O vercel.json reescreve /{vendedora}/{oferta} para cá.
 * Redireciona (302) para o checkout da oferta com as UTMs da vendedora e registra o clique.
 */
import { inserirSemRetorno, selecionar } from '../src/server/db'
import { SLUG_RE, montarDestino } from '../src/shared/links'
import type { Oferta, Vendedora } from '../src/shared/tipos'

export const config = { runtime: 'edge' }

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp|telegrambot|twitterbot|linkedinbot|headless|lighthouse|preview|vercel/i

function paginaNaoEncontrada(): Response {
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Link não encontrado</title>
<style>body{margin:0;font-family:Montserrat,system-ui,sans-serif;background:#f9fafb;color:#111827;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}main{max-width:420px;text-align:center}h1{font-size:20px;margin:0 0 8px}p{color:#6b7280;margin:0;line-height:1.5}</style></head>
<body><main><h1>Esse link não está mais ativo</h1><p>Fale com a consultora que te enviou para receber o link atualizado.</p></main></body></html>`
  return new Response(html, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}

export default async function handler(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const v = (params.get('v') ?? '').toLowerCase()
  const o = (params.get('o') ?? '').toLowerCase()
  if (!SLUG_RE.test(v) || !SLUG_RE.test(o)) return paginaNaoEncontrada()

  try {
    const [vendedoras, ofertas] = await Promise.all([
      selecionar<Pick<Vendedora, 'slug' | 'nome'>>('vendedoras', { select: 'slug,nome', slug: `eq.${v}`, ativa: 'eq.true', limit: '1' }),
      selecionar<Pick<Oferta, 'slug' | 'destino' | 'utm_campaign' | 'utm_content'>>('ofertas', {
        select: 'slug,destino,utm_campaign,utm_content',
        slug: `eq.${o}`,
        ativa: 'eq.true',
        limit: '1',
      }),
    ])
    const vendedora = vendedoras[0]
    const oferta = ofertas[0]
    if (!vendedora || !oferta) return paginaNaoEncontrada()

    const destino = montarDestino(oferta, vendedora)
    const userAgent = req.headers.get('user-agent') ?? ''

    // O clique é gravado antes do redirect: a função edge não continua depois da resposta
    await inserirSemRetorno('cliques', {
      vendedora: vendedora.slug,
      oferta: oferta.slug,
      destino,
      user_agent: userAgent.slice(0, 400),
      referrer: req.headers.get('referer'),
      pais: req.headers.get('x-vercel-ip-country'),
      device: /Mobi|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop',
      is_bot: BOT_RE.test(userAgent),
    }).catch((error) => console.error('Error in registrar clique:', error))

    return new Response(null, { status: 302, headers: { Location: destino, 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error in redirect:', error)
    return paginaNaoEncontrada()
  }
}
