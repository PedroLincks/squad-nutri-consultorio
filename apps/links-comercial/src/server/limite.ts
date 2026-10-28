/**
 * Limite de tentativas de login (contra adivinhação de senha).
 * Cada senha errada grava uma linha em `tentativas_login`; com 10 erros do mesmo IP em 15 minutos, o login trava.
 */
import { excluir, inserirSemRetorno, selecionar } from './db'

const JANELA_MIN = 15
const MAX_POR_IP = 10
const MAX_POR_ALVO = 30

export function ipDe(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'desconhecido'
  ).slice(0, 64)
}

function minutosAtras(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString()
}

export async function loginTravado(ip: string, alvo: string): Promise<boolean> {
  const desde = minutosAtras(JANELA_MIN)
  const [porIp, porAlvo] = await Promise.all([
    selecionar<{ id: number }>('tentativas_login', { select: 'id', ip: `eq.${ip}`, created_at: `gte.${desde}`, limit: String(MAX_POR_IP) }),
    selecionar<{ id: number }>('tentativas_login', { select: 'id', alvo: `eq.${alvo}`, created_at: `gte.${desde}`, limit: String(MAX_POR_ALVO) }),
  ])
  return porIp.length >= MAX_POR_IP || porAlvo.length >= MAX_POR_ALVO
}

export async function registrarFalha(ip: string, alvo: string): Promise<void> {
  await inserirSemRetorno('tentativas_login', { ip, alvo })
  // Faxina: tentativas com mais de 1 dia não servem para nada
  await excluir('tentativas_login', { created_at: `lt.${minutosAtras(24 * 60)}` }).catch(() => {})
}
