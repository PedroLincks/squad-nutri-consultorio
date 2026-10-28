import { useCallback, useEffect, useMemo, useState } from 'react'
import { Aviso, Cabecalho, Pagina } from '../components/Cabecalho'
import { useToast } from '../components/Toast'
import { DOMINIO, ErroApi, adminExecutar, adminListar } from '../lib/api'
import { formatarReais, linkCurto, montarDestino, proximoCodigoVendedora, slugOfertaSugerido, utmContentPadrao } from '../shared/links'
import { TIPOS_OFERTA, ordemProduto, rotuloTipo } from '../shared/produtos'
import type { Clique, DadosAdmin, Oferta, OfertaEntrada, Produto, TipoOferta, Vendedora } from '../shared/tipos'

const CHAVE_SENHA = 'admin_senha'
type Aba = 'ofertas' | 'vendedoras' | 'cliques'
type Mostrar = (t: string, tipo?: 'ok' | 'erro') => void
type PropsAba = { dados: DadosAdmin; senha: string; atualizar: (d: DadosAdmin) => void; mostrar: Mostrar }

function lerSenha() {
  try {
    return localStorage.getItem(CHAVE_SENHA) ?? ''
  } catch {
    return ''
  }
}

const OFERTA_VAZIA: OfertaEntrada = {
  slug: '',
  produto: '',
  sigla: '',
  nome: '',
  tipo: null,
  ticket: null,
  destino: '',
  utm_campaign: '',
  utm_content: '',
  orientacao: null,
  ativa: true,
  ordem: 0,
}

/** Chama o admin, atualiza a tela e avisa; devolve true se deu certo */
function useExecutar(senha: string, atualizar: (d: DadosAdmin) => void, mostrar: Mostrar) {
  const [salvando, setSalvando] = useState(false)
  const executar = useCallback(
    async (acao: string, payload: unknown, ok: string) => {
      setSalvando(true)
      try {
        atualizar(await adminExecutar(senha, acao, payload))
        mostrar(ok)
        return true
      } catch (e) {
        mostrar((e as Error).message, 'erro')
        return false
      } finally {
        setSalvando(false)
      }
    },
    [senha, atualizar, mostrar],
  )
  return { executar, salvando }
}

/* ---------------- Formulário de oferta ---------------- */

function FormOferta({
  inicial,
  produtos,
  vendedoraExemplo,
  salvando,
  onSalvar,
  onExcluir,
  onCancelar,
}: {
  inicial: OfertaEntrada
  produtos: Produto[]
  vendedoraExemplo: Vendedora | undefined
  salvando: boolean
  onSalvar: (o: OfertaEntrada) => void
  onExcluir?: () => void
  onCancelar: () => void
}) {
  const nova = inicial.id === undefined
  const [f, setF] = useState<OfertaEntrada>(inicial)
  // Campos derivados (slug, UTMs) são sugeridos até a pessoa mexer neles
  const [tocados, setTocados] = useState<Set<string>>(new Set(nova ? [] : ['slug', 'utm_campaign', 'utm_content']))

  const tocar = (campo: string) => setTocados((t) => new Set(t).add(campo))
  const mudar = <K extends keyof OfertaEntrada>(campo: K, valor: OfertaEntrada[K]) => setF((x) => ({ ...x, [campo]: valor }))

  // Produto escolhido define a sigla
  const escolherProduto = (nome: string) => {
    const p = produtos.find((x) => x.nome === nome)
    setF((x) => ({ ...x, produto: nome, sigla: p?.sigla ?? x.sigla }))
  }


  useEffect(() => {
    if (!tocados.has('utm_campaign')) mudar('utm_campaign', f.sigla ? `${f.sigla}-Comercial` : '')
  }, [f.sigla, tocados])

  useEffect(() => {
    if (!tocados.has('utm_content')) mudar('utm_content', utmContentPadrao(f.nome))
  }, [f.nome, tocados])

  useEffect(() => {
    if (!tocados.has('slug')) mudar('slug', slugOfertaSugerido(f.sigla, f.nome))
  }, [f.sigla, f.nome, tocados])

  const previa = useMemo(() => {
    const v = vendedoraExemplo ?? { slug: '00', nome: 'Vendedora', ativa: true }
    try {
      return { curto: linkCurto(DOMINIO, v.slug, f.slug || '…'), destino: f.destino ? montarDestino(f, v) : '' }
    } catch {
      return { curto: linkCurto(DOMINIO, v.slug, f.slug || '…'), destino: '' }
    }
  }, [f, vendedoraExemplo])

  return (
    <form
      className="cartao space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSalvar(f)
      }}
    >
      <h2 className="text-lg font-extrabold text-gray-900">{nova ? 'Nova oferta' : 'Editar oferta'}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="rotulo" htmlFor="produto">Produto</label>
          <select id="produto" className="campo" value={f.produto} onChange={(e) => escolherProduto(e.target.value)} required>
            <option value="">Escolha o produto…</option>
            {produtos.map((p) => (
              <option key={p.sigla} value={p.nome}>
                {p.nome} ({p.sigla})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="tipo">Tipo de oferta</label>
          <select id="tipo" className="campo" value={f.tipo ?? ''} onChange={(e) => mudar('tipo', (e.target.value || null) as TipoOferta | null)} required>
            <option value="">Escolha o tipo…</option>
            {TIPOS_OFERTA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.rotulo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="rotulo" htmlFor="nome">Nome da oferta</label>
          <input id="nome" className="campo" value={f.nome} onChange={(e) => mudar('nome', e.target.value)} placeholder="Oferta 3.500" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="ticket">Ticket (R$)</label>
          <input id="ticket" type="number" step="0.01" min="0" className="campo" value={f.ticket ?? ''} onChange={(e) => mudar('ticket', e.target.value === '' ? null : Number(e.target.value))} placeholder="3500" />
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor="destino">Link do checkout (sem UTMs)</label>
        <input id="destino" type="url" className="campo font-mono text-xs" value={f.destino} onChange={(e) => mudar('destino', e.target.value)} placeholder="https://go.nutrideconsultorio.com.br/campaign/..." required />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="rotulo" htmlFor="slug">Slug (vai na URL curta, ex.: anc3500)</label>
          <input id="slug" className="campo font-mono text-xs" value={f.slug} onChange={(e) => { tocar('slug'); mudar('slug', e.target.value) }} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="utm_campaign">utm_campaign</label>
          <input id="utm_campaign" className="campo font-mono text-xs" value={f.utm_campaign} onChange={(e) => { tocar('utm_campaign'); mudar('utm_campaign', e.target.value) }} required />
        </div>
        <div>
          <label className="rotulo" htmlFor="utm_content">utm_content</label>
          <input id="utm_content" className="campo font-mono text-xs" value={f.utm_content} onChange={(e) => { tocar('utm_content'); mudar('utm_content', e.target.value) }} required />
        </div>
      </div>

      <div>
        <label className="rotulo" htmlFor="orientacao">Orientação para a vendedora (quando usar)</label>
        <textarea id="orientacao" className="campo" rows={2} value={f.orientacao ?? ''} onChange={(e) => mudar('orientacao', e.target.value || null)} placeholder="Exclusivo para renovação de acesso." />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <input type="checkbox" checked={f.ativa} onChange={(e) => mudar('ativa', e.target.checked)} className="h-4 w-4 accent-brand-green" />
        Ativa (aparece para as vendedoras)
      </label>

      <div className="rounded-xl bg-gray-50 p-3 text-xs">
        <div className="rotulo">Prévia ({vendedoraExemplo?.nome ?? 'vendedora'})</div>
        <div className="font-mono text-gray-800">{previa.curto}</div>
        <div className="mt-1 break-all font-mono text-gray-500">{previa.destino || '→ preencha o link do checkout'}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primario" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
        <button type="button" className="btn-secundario" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </button>
        {onExcluir && (
          <button type="button" className="btn-perigo ml-auto" onClick={onExcluir} disabled={salvando}>
            Excluir
          </button>
        )}
      </div>
    </form>
  )
}

/* ---------------- Produtos ---------------- */

function PainelProdutos({ dados, senha, atualizar, mostrar, onFechar }: PropsAba & { onFechar: () => void }) {
  const { executar, salvando } = useExecutar(senha, atualizar, mostrar)
  const [nome, setNome] = useState('')
  const [sigla, setSigla] = useState('')
  const [siglaTocada, setSiglaTocada] = useState(false)

  // Sigla sugerida = iniciais das palavras com mais de 2 letras ("Nutri Sales" → "NS")
  useEffect(() => {
    if (siglaTocada) return
    setSigla(
      nome
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .split(/\s+/)
        .filter((p) => p.length > 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase(),
    )
  }, [nome, siglaTocada])

  const emUso = (p: Produto) => dados.ofertas.filter((o) => o.sigla === p.sigla).length

  return (
    <div className="cartao space-y-4">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-extrabold text-gray-900">Produtos</h2>
        <button type="button" className="text-xs text-gray-400 hover:text-gray-600" onClick={onFechar}>
          fechar
        </button>
      </div>

      <form
        className="grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault()
          const ordem = dados.produtos.length ? Math.max(...dados.produtos.map((p) => p.ordem)) + 1 : 0
          if (await executar('produto.salvar', { nome, sigla, ordem }, 'Produto adicionado.')) {
            setNome('')
            setSigla('')
            setSiglaTocada(false)
          }
        }}
      >
        <div>
          <label className="rotulo" htmlFor="p-nome">Nome do produto</label>
          <input id="p-nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Mentoria Nutri Premium" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="p-sigla">Sigla</label>
          <input id="p-sigla" className="campo uppercase" value={sigla} onChange={(e) => { setSiglaTocada(true); setSigla(e.target.value.toUpperCase()) }} pattern="[A-Za-z0-9]+" placeholder="MNP" required />
        </div>
        <button type="submit" className="btn-primario" disabled={salvando}>
          Adicionar
        </button>
      </form>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {dados.produtos.map((p) => {
          const n = emUso(p)
          return (
            <div key={p.sigla} className="flex items-center gap-3 px-4 py-3">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500">{p.sigla}</span>
              <div className="min-w-0 flex-1 font-bold text-gray-900">{p.nome}</div>
              <div className="text-xs text-gray-400">{n === 1 ? '1 oferta' : `${n} ofertas`}</div>
              <button
                type="button"
                className="btn-perigo !px-3 !py-1.5 !text-xs"
                disabled={salvando || n > 0}
                title={n > 0 ? 'Exclua ou mova as ofertas deste produto antes' : undefined}
                onClick={() => {
                  if (confirm(`Excluir o produto ${p.nome}?`)) executar('produto.excluir', { sigla: p.sigla }, 'Produto excluído.')
                }}
              >
                Excluir
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- Abas ---------------- */

function AbaOfertas({ dados, senha, atualizar, mostrar }: PropsAba) {
  const [editando, setEditando] = useState<OfertaEntrada | null>(null)
  const [painelProdutos, setPainelProdutos] = useState(false)
  const [filtroProduto, setFiltroProduto] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'' | TipoOferta | 'sem'>('')
  const { executar, salvando } = useExecutar(senha, atualizar, mostrar)

  const grupos = useMemo(() => {
    const lista = dados.ofertas.filter(
      (o) =>
        (!filtroProduto || o.produto === filtroProduto) &&
        (!filtroTipo || (filtroTipo === 'sem' ? o.tipo === null : o.tipo === filtroTipo)),
    )
    const g: { produto: string; ofertas: Oferta[] }[] = []
    for (const o of lista) {
      const x = g.find((y) => y.produto === o.produto)
      if (x) x.ofertas.push(o)
      else g.push({ produto: o.produto, ofertas: [o] })
    }
    return g.sort((a, b) => ordemProduto(dados.produtos, a.produto) - ordemProduto(dados.produtos, b.produto))
  }, [dados.ofertas, dados.produtos, filtroProduto, filtroTipo])

  const semTipo = dados.ofertas.filter((o) => o.tipo === null).length

  if (editando) {
    return (
      <FormOferta
        inicial={editando}
        produtos={dados.produtos}
        vendedoraExemplo={dados.vendedoras[0]}
        salvando={salvando}
        onSalvar={async (o) => {
          if (await executar('oferta.salvar', o, 'Oferta salva.')) setEditando(null)
        }}
        onCancelar={() => setEditando(null)}
        onExcluir={
          editando.id !== undefined
            ? async () => {
                if (confirm(`Excluir "${editando.nome}"? Os links já enviados com ela vão parar de funcionar.`)) {
                  if (await executar('oferta.excluir', { id: editando.id }, 'Oferta excluída.')) setEditando(null)
                }
              }
            : undefined
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primario" onClick={() => setEditando({ ...OFERTA_VAZIA, produto: filtroProduto, sigla: dados.produtos.find((p) => p.nome === filtroProduto)?.sigla ?? '', tipo: filtroTipo && filtroTipo !== 'sem' ? filtroTipo : null })}>
          + Nova oferta
        </button>
        <button type="button" className="btn-secundario" onClick={() => setPainelProdutos((v) => !v)}>
          + Novo produto
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          <select className="campo !w-auto" value={filtroProduto} onChange={(e) => setFiltroProduto(e.target.value)} aria-label="Filtrar por produto">
            <option value="">Todos os produtos</option>
            {dados.produtos.map((p) => (
              <option key={p.sigla} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </select>
          <select className="campo !w-auto" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as '' | TipoOferta | 'sem')} aria-label="Filtrar por tipo">
            <option value="">Todos os tipos</option>
            {TIPOS_OFERTA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.rotulo}
              </option>
            ))}
            {semTipo > 0 && <option value="sem">Sem tipo ({semTipo})</option>}
          </select>
        </div>
      </div>

      {painelProdutos && <PainelProdutos dados={dados} senha={senha} atualizar={atualizar} mostrar={mostrar} onFechar={() => setPainelProdutos(false)} />}

      {semTipo > 0 && !filtroTipo && (
        <Aviso>
          {semTipo === 1 ? '1 oferta ainda está sem tipo' : `${semTipo} ofertas ainda estão sem tipo`}. Abra cada uma e escolha À vista, Downsell ou Recorrência.
        </Aviso>
      )}

      {grupos.length === 0 && <Aviso>{dados.ofertas.length === 0 ? 'Nenhuma oferta cadastrada.' : 'Nenhuma oferta com esse filtro.'}</Aviso>}
      {grupos.map((g) => (
        <section key={g.produto}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">{g.produto}</h2>
          <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {g.ofertas.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setEditando(o)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold ${o.ativa ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{o.nome}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${o.tipo ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-brand-red'}`}>{rotuloTipo(o.tipo)}</span>
                    {!o.ativa && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">inativa</span>}
                  </div>
                  <div className="truncate font-mono text-xs text-gray-400">
                    /{o.slug} · {o.utm_campaign} · {o.utm_content}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold tabular-nums text-gray-700">{formatarReais(o.ticket)}</div>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function AbaVendedoras({ dados, senha, atualizar, mostrar }: PropsAba) {
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTocado, setSlugTocado] = useState(false)
  const { executar, salvando } = useExecutar(senha, atualizar, mostrar)

  // Código da vendedora é sequencial (00, 01, 02…), não o nome: o link fica curto e neutro
  useEffect(() => {
    if (!slugTocado) setSlug(proximoCodigoVendedora(dados.vendedoras.map((v) => v.slug)))
  }, [dados.vendedoras, slugTocado])

  return (
    <div className="space-y-6">
      <form
        className="cartao grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault()
          if (await executar('vendedora.salvar', { nome, slug, ativa: true }, 'Vendedora adicionada.')) {
            setNome('')
            setSlug('')
            setSlugTocado(false)
          }
        }}
      >
        <div>
          <label className="rotulo" htmlFor="v-nome">Nome (vai no utm_medium)</label>
          <input id="v-nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Larissa" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="v-slug">Código (vai na URL)</label>
          <input id="v-slug" className="campo font-mono text-xs" value={slug} onChange={(e) => { setSlugTocado(true); setSlug(e.target.value) }} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
        </div>
        <button type="submit" className="btn-primario" disabled={salvando}>
          Adicionar
        </button>
      </form>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {dados.vendedoras.map((v) => (
          <div key={v.slug} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className={`font-bold ${v.ativa ? 'text-gray-900' : 'text-gray-400'}`}>
                <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500">{v.slug}</span>
                {v.nome}
              </div>
              <div className="font-mono text-xs text-gray-400">{linkCurto(DOMINIO, v.slug, '…').replace(/^https?:\/\//, '')}</div>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-green"
                checked={v.ativa}
                disabled={salvando}
                onChange={(e) => executar('vendedora.salvar', { ...v, ativa: e.target.checked }, e.target.checked ? 'Vendedora ativada.' : 'Vendedora desativada: os links dela param de redirecionar.')}
              />
              ativa
            </label>
            <button
              type="button"
              className="btn-perigo !px-3 !py-1.5 !text-xs"
              disabled={salvando}
              onClick={() => {
                if (confirm(`Excluir ${v.nome}? Todos os links dela vão parar de funcionar. Se for temporário, prefira desativar.`)) {
                  executar('vendedora.excluir', { slug: v.slug }, 'Vendedora excluída.')
                }
              }}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AbaCliques({ dados }: { dados: DadosAdmin }) {
  const resumo = useMemo(() => {
    const reais = dados.cliques.filter((c) => !c.is_bot)
    const porChave = new Map<string, { vendedora: string; oferta: string; total: number }>()
    const porVendedora = new Map<string, number>()
    for (const c of reais) {
      const k = `${c.vendedora}|${c.oferta}`
      porChave.set(k, { vendedora: c.vendedora, oferta: c.oferta, total: (porChave.get(k)?.total ?? 0) + 1 })
      porVendedora.set(c.vendedora, (porVendedora.get(c.vendedora) ?? 0) + 1)
    }
    const nomeV = (slug: string) => dados.vendedoras.find((v) => v.slug === slug)?.nome ?? slug
    const nomeO = (slug: string) => {
      const o = dados.ofertas.find((x) => x.slug === slug)
      return o ? `${o.sigla} · ${o.nome}` : slug
    }
    return {
      total: reais.length,
      bots: dados.cliques.length - reais.length,
      vendedoras: [...porVendedora].map(([slug, total]) => ({ nome: nomeV(slug), total })).sort((a, b) => b.total - a.total),
      linhas: [...porChave.values()].map((l) => ({ ...l, vendedora: nomeV(l.vendedora), oferta: nomeO(l.oferta) })).sort((a, b) => b.total - a.total),
      ultimo: dados.cliques[0] as Clique | undefined,
    }
  }, [dados])

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Últimos 30 dias · {resumo.total} cliques reais
        {resumo.bots > 0 && ` (+${resumo.bots} de robôs e pré-visualizações, fora da conta)`}
        {resumo.ultimo && ` · último em ${new Date(resumo.ultimo.created_at).toLocaleString('pt-BR')}`}
      </p>
      {resumo.total === 0 ? (
        <Aviso>Nenhum clique ainda. Assim que um link for aberto, ele aparece aqui.</Aviso>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {resumo.vendedoras.map((v) => (
              <div key={v.nome} className="cartao">
                <div className="rotulo">{v.nome}</div>
                <div className="text-2xl font-extrabold tabular-nums">{v.total}</div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2">Vendedora</th>
                  <th className="px-4 py-2">Oferta</th>
                  <th className="px-4 py-2 text-right">Cliques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resumo.linhas.map((l) => (
                  <tr key={`${l.vendedora}|${l.oferta}`}>
                    <td className="px-4 py-2 font-semibold">{l.vendedora}</td>
                    <td className="px-4 py-2 text-gray-600">{l.oferta}</td>
                    <td className="px-4 py-2 text-right font-bold tabular-nums">{l.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------- Página ---------------- */

export default function Admin() {
  const [senha, setSenha] = useState(lerSenha)
  const [digitada, setDigitada] = useState('')
  const [dados, setDados] = useState<DadosAdmin | null>(null)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState<Aba>('ofertas')
  const { mostrar, elemento: toast } = useToast()

  const carregar = useCallback(async (s: string) => {
    if (!s) return
    setErro('')
    try {
      setDados(await adminListar(s))
      try { localStorage.setItem(CHAVE_SENHA, s) } catch { /* sem storage */ }
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) {
        setSenha('')
        try { localStorage.removeItem(CHAVE_SENHA) } catch { /* sem storage */ }
      }
      setErro((e as Error).message)
    }
  }, [])

  useEffect(() => {
    carregar(senha)
  }, [senha, carregar])

  if (!senha || !dados) {
    return (
      <Pagina>
        <Cabecalho titulo="Administração" subtitulo="Ofertas, vendedoras e cliques dos links de venda." />
        {!senha ? (
          <form
            className="cartao space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              setSenha(digitada)
            }}
          >
            <label className="rotulo" htmlFor="senha">Senha</label>
            <input id="senha" type="password" className="campo" value={digitada} onChange={(e) => setDigitada(e.target.value)} autoFocus />
            {erro && <Aviso tipo="erro">{erro}</Aviso>}
            <button type="submit" className="btn-primario w-full">
              Entrar
            </button>
          </form>
        ) : erro ? (
          <Aviso tipo="erro">{erro}</Aviso>
        ) : null}
      </Pagina>
    )
  }

  const abas: { id: Aba; rotulo: string }[] = [
    { id: 'ofertas', rotulo: `Ofertas (${dados.ofertas.length})` },
    { id: 'vendedoras', rotulo: `Vendedoras (${dados.vendedoras.length})` },
    { id: 'cliques', rotulo: 'Cliques' },
  ]

  return (
    <Pagina largura="max-w-3xl">
      <Cabecalho
        titulo="Administração"
        subtitulo="Cadastre uma oferta uma vez: todas as vendedoras recebem o link delas na hora."
        acao={
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ver como vendedora
          </a>
        }
      />
      <nav className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        {abas.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
              aba === a.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {a.rotulo}
          </button>
        ))}
      </nav>
      {erro && <div className="mb-4"><Aviso tipo="erro">{erro}</Aviso></div>}
      {aba === 'ofertas' && <AbaOfertas dados={dados} senha={senha} atualizar={setDados} mostrar={mostrar} />}
      {aba === 'vendedoras' && <AbaVendedoras dados={dados} senha={senha} atualizar={setDados} mostrar={mostrar} />}
      {aba === 'cliques' && <AbaCliques dados={dados} />}
      {toast}
    </Pagina>
  )
}
