import { useCallback, useEffect, useState } from 'react'
import { Criativos } from './Criativos'
import { Diario } from './Diario'
import { Funil } from './Funil'
import { Respostas } from './Respostas'
import { PRESETS, fmtNum, fmtPct, formatarDia, hojeBrt, pct } from './periodo'
import type { Stats } from './types'
import { VERSAO_ATUAL, VERSOES, type Versao } from '../shared/versoes'

const CHAVE_SENHA = 'painel_senha'
const CHAVE_TEMA = 'painel_tema'

/** Tema: escolha salva, senão o tema do sistema */
function temaInicial(): 'claro' | 'escuro' {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA)
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch { /* sem storage */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

/** Só em desenvolvimento: /painel?demo=1 mostra dados fictícios, sem senha */
const DEMO = import.meta.env.DEV && new URLSearchParams(location.search).has('demo')

function lerSenha() {
  try {
    return localStorage.getItem(CHAVE_SENHA) ?? ''
  } catch {
    return ''
  }
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-gray-100">{titulo}</h2>
      {children}
    </section>
  )
}

function Card({ label, valor, sub, nota }: { label: string; valor: string; sub?: string; nota?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-extrabold tabular-nums text-gray-900 dark:text-gray-100">{valor}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</div>}
      {nota && <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{nota}</div>}
    </div>
  )
}

export default function Painel() {
  const hoje = hojeBrt()
  const [senha, setSenha] = useState(lerSenha)
  const [digitada, setDigitada] = useState('')
  // Cada aba é uma versão do funil; ao trocar, o período vai para a vida inteira daquela versão
  const [versao, setVersao] = useState<Versao>(VERSAO_ATUAL)
  const [preset, setPreset] = useState<string>('')
  const [from, setFrom] = useState<string>(VERSAO_ATUAL.inicio)
  const [to, setTo] = useState<string>(VERSAO_ATUAL.fim ?? hoje)
  const [stats, setStats] = useState<Stats | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', tema === 'escuro')
    html.style.colorScheme = tema === 'escuro' ? 'dark' : 'light'
    document.body.style.background = tema === 'escuro' ? '#030712' : '#f9fafb'
  }, [tema])

  const alternarTema = () => {
    const novo = tema === 'escuro' ? 'claro' : 'escuro'
    setTema(novo)
    try { localStorage.setItem(CHAVE_TEMA, novo) } catch { /* sem storage */ }
  }

  const carregar = useCallback(async () => {
    if (DEMO) {
      const { statsDemo } = await import('./demo')
      setStats(statsDemo(from, to))
      return
    }
    if (!senha) return
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch(`/api/stats?from=${from}&to=${to}&funnel=${versao.funnel}`, { headers: { 'x-painel-senha': senha } })
      const body = await res.json()
      if (res.status === 401) {
        try { localStorage.removeItem(CHAVE_SENHA) } catch { /* sem storage */ }
        setSenha('')
        setErro('Senha incorreta.')
        return
      }
      if (!res.ok) throw new Error(body.erro ?? `HTTP ${res.status}`)
      setStats(body as Stats)
    } catch (error) {
      console.error('Error in carregar:', error)
      setErro(`Não foi possível carregar: ${(error as Error).message}`)
    } finally {
      setCarregando(false)
    }
  }, [senha, from, to, versao])

  useEffect(() => {
    carregar()
  }, [carregar])

  const escolherVersao = (v: Versao) => {
    setVersao(v)
    setPreset('')
    setStats(null)
    setFrom(v.inicio)
    setTo(v.fim ?? hoje)
  }

  const escolherPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    const [f, t] = p.range(hoje)
    setPreset(id)
    setFrom(f)
    setTo(t)
  }

  if (!senha && !DEMO) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <form
          className="w-full max-w-xs space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          onSubmit={(e) => {
            e.preventDefault()
            try { localStorage.setItem(CHAVE_SENHA, digitada) } catch { /* sem storage */ }
            setSenha(digitada)
          }}
        >
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Painel · Quiz SSN</h1>
          {erro && <p className="text-sm text-brand-red dark:text-red-400">{erro}</p>}
          <input
            type="password"
            autoFocus
            value={digitada}
            onChange={(e) => setDigitada(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:bg-gray-950 dark:text-gray-100 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:focus:border-gray-300"
          />
          <button className="w-full rounded-lg bg-gray-900 py-2 text-sm font-bold text-white hover:bg-gray-700 dark:hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900">Entrar</button>
        </form>
      </div>
    )
  }

  const f = stats?.funil
  const mobile = stats?.aparelhos?.mobile ?? 0

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Painel · Quiz SSN</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pessoas que abriram a página (robôs e pré-carregamentos fora). Fuso de Brasília.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => escolherPreset(p.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  preset === p.id ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-400 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700 dark:hover:ring-gray-500'
                }`}
              >
                {p.label}
              </button>
            ))}
            <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-sm text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
              <input type="date" value={from} max={to} onChange={(e) => { setPreset(''); setFrom(e.target.value) }} className="bg-transparent outline-none" />
              <span className="text-gray-400 dark:text-gray-500">→</span>
              <input type="date" value={to} min={from} max={hoje} onChange={(e) => { setPreset(''); setTo(e.target.value) }} className="bg-transparent outline-none" />
            </span>
            <button
              onClick={alternarTema}
              className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-gray-200 hover:ring-gray-400 dark:bg-gray-900 dark:ring-gray-700 dark:hover:ring-gray-500"
              title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            >
              {tema === 'escuro' ? '☀️' : '🌙'}
            </button>
            <button onClick={carregar} className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 hover:ring-gray-400 dark:bg-gray-900 dark:ring-gray-700 dark:hover:ring-gray-500" title="Atualizar">
              {carregando ? '…' : '↻'}
            </button>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
          {VERSOES.map((v) => {
            const ativa = v.funnel === versao.funnel
            return (
              <button
                key={v.funnel}
                onClick={() => escolherVersao(v)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-bold ${
                  ativa
                    ? 'border-brand-red text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {v.label}
                <span className="ml-1.5 font-normal text-gray-400 dark:text-gray-500">
                  {formatarDia(v.inicio)} → {v.fim ? formatarDia(v.fim) : 'hoje'}
                </span>
              </button>
            )
          })}
        </nav>

        {erro && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red dark:bg-red-950/40 dark:text-red-400">{erro}</p>}

        {f && stats && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Card
                label="Acessos (pessoas)"
                valor={fmtNum(f.acessos)}
                sub={`${fmtPct(pct(mobile, f.acessos))} no celular`}
                nota={stats.descartados ? `+ ${fmtNum(stats.descartados)} descartados (robôs/prévias)` : undefined}
              />
              <Card
                label={'semCapa' in versao ? 'Responderam a P1' : 'Iniciaram o quiz'}
                valor={fmtPct(pct(f.iniciou, f.acessos))}
                sub={`${fmtNum(f.iniciou)} sessões`}
              />
              <Card label="Concluíram o quiz" valor={fmtPct(pct(f.vsl, f.iniciou))} sub="dos que iniciaram" />
              <Card label="Chegaram na VSL" valor={fmtPct(pct(f.vsl, f.acessos))} sub={`${fmtNum(f.vsl)} sessões`} />
            </div>

            <Secao titulo="Funil etapa a etapa">
              <Funil funil={f} semCapa={'semCapa' in versao} />
            </Secao>

            <Secao titulo="Evolução diária">
              <Diario diario={stats.diario} from={from} to={to} escuro={tema === 'escuro'} />
            </Secao>

            <Secao titulo="Funil por campanha e criativo">
              <Criativos criativos={stats.criativos} />
            </Secao>

            <Secao titulo="Respostas por pergunta">
              <Respostas respostas={stats.respostas} />
            </Secao>
          </>
        )}
      </div>
    </div>
  )
}
