/**
 * Sessão e senhas — só roda nas funções da Vercel (api/).
 *
 * - Sessão = cookie HttpOnly + Secure + SameSite=Strict com um token assinado (HMAC-SHA256, SESSAO_SEGREDO).
 *   O JavaScript da página nunca vê o token nem a senha.
 * - Senha das vendedoras = PBKDF2-SHA256 com sal aleatório; o banco guarda só o hash.
 * - Trocar a senha de uma vendedora derruba as sessões abertas dela (o token carrega uma impressão do hash).
 */

export type Sessao = { t: 'a'; exp: number } | { t: 'v'; s: string; h: string; exp: number }
type Tipo = Sessao['t']

const enc = new TextEncoder()

const DURACAO: Record<Tipo, number> = {
  a: 12 * 60 * 60, // admin: 12 horas
  v: 30 * 24 * 60 * 60, // vendedora: 30 dias (usa no celular todo dia)
}
const BASE_COOKIE: Record<Tipo, string> = { a: 'nc_adm', v: 'nc_vend' }

/* ---------- base64url e comparação em tempo constante ---------- */

function b64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function deB64url(s: string): Uint8Array<ArrayBuffer> {
  const base = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)
  return Uint8Array.from(atob(base), (c) => c.charCodeAt(0))
}

function iguais(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let dif = 0
  for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i]
  return dif === 0
}

async function sha256(texto: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(texto)))
}

/** Compara dois textos sem vazar, pelo tempo de resposta, quantos caracteres batem */
export async function textosIguais(a: string, b: string): Promise<boolean> {
  return iguais(await sha256(a), await sha256(b))
}

/* ---------- token assinado ---------- */

async function chaveHmac(): Promise<CryptoKey> {
  const segredo = process.env.SESSAO_SEGREDO
  if (!segredo || segredo.length < 32) throw new Error('SESSAO_SEGREDO ausente ou curto demais (mínimo 32 caracteres).')
  return crypto.subtle.importKey('raw', enc.encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

async function assinar(dados: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.sign('HMAC', await chaveHmac(), enc.encode(dados)))
}

async function criarToken(sessao: Sessao): Promise<string> {
  const corpo = b64url(enc.encode(JSON.stringify(sessao)))
  return `${corpo}.${b64url(await assinar(corpo))}`
}

async function lerToken(token: string): Promise<Sessao | null> {
  const [corpo, assinatura, ...resto] = token.split('.')
  if (!corpo || !assinatura || resto.length) return null
  try {
    // Compara o texto da assinatura (não os bytes): base64 aceita variações no último caractere
    if (!iguais(enc.encode(b64url(await assinar(corpo))), enc.encode(assinatura))) return null
    const sessao = JSON.parse(new TextDecoder().decode(deB64url(corpo))) as Sessao
    if (typeof sessao.exp !== 'number' || sessao.exp < Date.now() / 1000) return null
    return sessao
  } catch {
    return null
  }
}

/* ---------- cookies ---------- */

/** Em produção (https) usa o prefixo __Host-, que obriga Secure, Path=/ e nenhum Domain */
function nomeCookie(req: Request, tipo: Tipo): string {
  return new URL(req.url).protocol === 'https:' ? `__Host-${BASE_COOKIE[tipo]}` : BASE_COOKIE[tipo]
}

function montarCookie(req: Request, tipo: Tipo, valor: string, maxAge: number): string {
  const seguro = new URL(req.url).protocol === 'https:' ? '; Secure' : ''
  return `${nomeCookie(req, tipo)}=${valor}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${seguro}`
}

function lerCookie(req: Request, nome: string): string | null {
  for (const parte of (req.headers.get('cookie') ?? '').split(';')) {
    const i = parte.indexOf('=')
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim()
  }
  return null
}

/** Cria a sessão e devolve o valor do cabeçalho Set-Cookie */
export async function abrirSessao(req: Request, sessao: { t: 'a' } | { t: 'v'; s: string; h: string }): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + DURACAO[sessao.t]
  return montarCookie(req, sessao.t, await criarToken({ ...sessao, exp } as Sessao), DURACAO[sessao.t])
}

export function fecharSessao(req: Request, tipo: Tipo): string {
  return montarCookie(req, tipo, '', 0)
}

export async function sessaoAdmin(req: Request): Promise<boolean> {
  const token = lerCookie(req, nomeCookie(req, 'a'))
  const sessao = token ? await lerToken(token) : null
  return sessao?.t === 'a'
}

export async function sessaoVendedora(req: Request): Promise<{ codigo: string; impressao: string } | null> {
  const token = lerCookie(req, nomeCookie(req, 'v'))
  const sessao = token ? await lerToken(token) : null
  return sessao?.t === 'v' ? { codigo: sessao.s, impressao: sessao.h } : null
}

/* ---------- senhas ---------- */

const ITERACOES = 100_000
/** Hash de uma senha qualquer: usado quando a vendedora não existe, para o tempo de resposta não denunciar isso */
const HASH_FALSO = 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

async function derivar(senha: string, sal: Uint8Array<ArrayBuffer>, iteracoes: number): Promise<Uint8Array> {
  const base = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: iteracoes }, base, 256))
}

export async function gerarHashSenha(senha: string): Promise<string> {
  const sal = crypto.getRandomValues(new Uint8Array(16))
  return `pbkdf2$${ITERACOES}$${b64url(sal)}$${b64url(await derivar(senha, sal, ITERACOES))}`
}

export async function conferirSenha(senha: string, armazenado: string | null): Promise<boolean> {
  const [alg, iter, sal, hash] = (armazenado ?? HASH_FALSO).split('$')
  if (alg !== 'pbkdf2' || !iter || !sal || !hash) return false
  const ok = iguais(await derivar(senha, deB64url(sal), Number(iter)), deB64url(hash))
  return ok && armazenado !== null
}

/** Impressão curta do hash: vai no token; se a senha mudar, o token antigo deixa de valer */
export async function impressaoSenha(senhaHash: string): Promise<string> {
  return b64url(await sha256(senhaHash)).slice(0, 16)
}
