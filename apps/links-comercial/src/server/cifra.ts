/**
 * Cópia cifrada da senha da vendedora, para o admin poder ver depois ("Ver senha").
 * AES-256-GCM com chave derivada de SENHAS_CHAVE (só no servidor). O login continua usando o hash PBKDF2.
 * Formato guardado: "v1.{iv}.{cifrado}" em base64url.
 */

const enc = new TextEncoder()

function b64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function deB64url(s: string): Uint8Array<ArrayBuffer> {
  const base = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)
  return Uint8Array.from(atob(base), (c) => c.charCodeAt(0))
}

async function chave(): Promise<CryptoKey> {
  const segredo = process.env.SENHAS_CHAVE
  if (!segredo || segredo.length < 32) throw new Error('SENHAS_CHAVE ausente ou curta demais (mínimo 32 caracteres).')
  const bruta = await crypto.subtle.digest('SHA-256', enc.encode(segredo))
  return crypto.subtle.importKey('raw', bruta, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

export async function cifrar(texto: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await chave(), enc.encode(texto)))
  return `v1.${b64url(iv)}.${b64url(cifrado)}`
}

export async function decifrar(guardado: string): Promise<string> {
  const [versao, iv, cifrado] = guardado.split('.')
  if (versao !== 'v1' || !iv || !cifrado) throw new Error('Formato de senha cifrada desconhecido.')
  const texto = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: deB64url(iv) }, await chave(), deB64url(cifrado))
  return new TextDecoder().decode(texto)
}
