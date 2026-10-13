/** Datas sempre no fuso de Brasília, no formato AAAA-MM-DD */
export function hojeBrt(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

export function somarDias(data: string, dias: number): string {
  const d = new Date(`${data}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

export const PRESETS = [
  { id: 'hoje', label: 'Hoje', range: (h: string) => [h, h] },
  { id: 'ontem', label: 'Ontem', range: (h: string) => [somarDias(h, -1), somarDias(h, -1)] },
  { id: '7d', label: '7 dias', range: (h: string) => [somarDias(h, -6), h] },
  { id: '30d', label: '30 dias', range: (h: string) => [somarDias(h, -29), h] },
] as const

export function formatarDia(data: string): string {
  const [, m, d] = data.split('-')
  return `${d}/${m}`
}

export const pct = (parte: number, total: number) => (total > 0 ? (parte / total) * 100 : 0)
export const fmtPct = (v: number) => `${v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
export const fmtNum = (v: number) => v.toLocaleString('pt-BR')
