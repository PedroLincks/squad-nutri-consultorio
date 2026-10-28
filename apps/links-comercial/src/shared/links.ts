import type { Oferta, Vendedora } from './tipos'

/** Formato aceito para slugs de vendedora e oferta: letras minúsculas, números e hífens */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** "Método Dieta Ágil" → "metodo-dieta-agil" */
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "Oferta 697 - Renovação" → "Oferta697-Renovacao" (padrão histórico do utm_content) */
export function utmContentPadrao(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[\s]+/)
    .map((p) => p.replace(/[^A-Za-z0-9-]/g, ''))
    .filter(Boolean)
    .join('')
    .replace(/-+/g, '-')
}

/**
 * Slug sugerido para a oferta: sigla + números do nome, sem hífen ("ANC" + "R$ 3.500" → "anc3500").
 * Sem número no nome, usa o nome inteiro colado ("anc" + "Ascensão" → "ancascensao").
 */
export function slugOfertaSugerido(sigla: string, nome: string): string {
  const digitos = nome.replace(/\D/g, '')
  const base = digitos || slugify(nome.replace(/\boferta\b/gi, '')).replace(/-/g, '')
  return `${slugify(sigla)}${base}`
}

/** Endereços que não podem ser página de vendedora */
export const PAGINAS_RESERVADAS = new Set(['admin', 'api', 'assets', 'robots', 'favicon'])

/** Próximo código de vendedora: dois dígitos, sequencial ("00", "01", "02"…) */
export function proximoCodigoVendedora(codigos: string[]): string {
  const numeros = codigos.filter((c) => /^\d+$/.test(c)).map(Number)
  const proximo = numeros.length ? Math.max(...numeros) + 1 : 0
  return String(proximo).padStart(2, '0')
}

/** Link curto que a vendedora envia ao cliente (com https://, para o botão "Abrir") */
export function linkCurto(dominio: string, vendedora: string, oferta: string): string {
  return `${dominio.replace(/\/+$/, '')}/${vendedora}/${oferta}`
}

/**
 * Mesmo link sem o "https://": é o que vai para a área de transferência.
 * WhatsApp e Instagram reconhecem o domínio sozinho, e o http redireciona para https na Vercel.
 */
export function linkParaCopiar(dominio: string, vendedora: string, oferta: string): string {
  return linkCurto(dominio, vendedora, oferta).replace(/^https?:\/\//, '')
}

/**
 * Destino final com as UTMs do time comercial.
 * Padrão (igual ao que existia no Short.io):
 *   utm_source=Comercial · utm_medium={Vendedora} · utm_campaign={SIGLA}-Comercial · utm_content={Oferta} · utm_term=Comercial
 */
export function montarDestino(oferta: Pick<Oferta, 'destino' | 'utm_campaign' | 'utm_content'>, vendedora: Pick<Vendedora, 'nome'>): string {
  const url = new URL(oferta.destino)
  url.searchParams.set('utm_source', 'Comercial')
  url.searchParams.set('utm_medium', vendedora.nome)
  url.searchParams.set('utm_campaign', oferta.utm_campaign)
  url.searchParams.set('utm_content', oferta.utm_content)
  url.searchParams.set('utm_term', 'Comercial')
  return url.toString()
}

export function formatarReais(valor: number | null): string {
  if (valor === null || Number.isNaN(valor)) return ''
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
