import { useCallback, useEffect, useMemo, useState } from 'react'
import { Aviso, Cabecalho, Pagina } from '../components/Cabecalho'
import { useToast } from '../components/Toast'
import { CampoSenha } from '../components/CampoSenha'
import { Login } from '../components/Login'
import { DOMINIO, ErroApi, adminExecutar, adminListar, adminVerSenha, entrar, sair } from '../lib/api'
import { copiar } from '../lib/copiar'
import { formatarReais, linkCurto, montarDestino, proximoCodigoVendedora, slugOfertaSugerido, slugify, utmContentPadrao } from '../shared/links'
import { TIPOS_OFERTA, ordemProduto, rotuloTipo } from '../shared/produtos'
import type { Clique, DadosAdmin, Oferta, OfertaEntrada, Produto, TipoOferta, Vendedora, VendedoraAdmin } from '../shared/tipos'

type Aba = 'ofertas' | 'vendedoras' | 'cliques'
type Mostrar = (t: string, tipo?: 'ok' | 'erro') => void
type PropsAba = { dados: DadosAdmin; atualizar: (d: DadosAdmin) => void; mostrar: Mostrar }

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
function useExecutar(atualizar: (d: DadosAdmin) => void, mostrar: Mostrar) {
  const [salvando, setSalvando] = useState(false)
  const executar = useCallback(
    async (acao: string, payload: unknown, ok: string) => {
      setSalvando(true)
      try {
        atualizar(await adminExecutar(acao, payload))
        mostrar(ok)
        return true
      } catch (e) {
        // Sessão expirou no meio do uso: recarrega e cai no login
        if (e instanceof ErroApi && e.status === 401) window.location.reload()
        mostrar((e as Error).message, 'erro')
        return false
      } finally {
        setSalvando(false)
      }
    },
    [atualizar, mostrar],
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
        <input id="destino" type="url" className="campo font-mono text-xs" value={f.destino} onChange={(e) => mudar('destino', e.target.value)} placeholder="https://…" required />
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

function PainelProdutos({ dados, atualizar, mostrar, onFechar }: PropsAba & { onFechar: () => void }) {
  const { executar, salvando } = useExecutar(atualizar, mostrar)
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

function AbaOfertas({ dados, atualizar, mostrar }: PropsAba) {
  const [editando, setEditando] = useState<OfertaEntrada | null>(null)
  const [painelProdutos, setPainelProdutos] = useState(false)
  const [filtroProduto, setFiltroProduto] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'' | TipoOferta | 'sem'>('')
  const { executar, salvando } = useExecutar(atualizar, mostrar)

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

      {painelProdutos && <PainelProdutos dados={dados} atualizar={atualizar} mostrar={mostrar} onFechar={() => setPainelProdutos(false)} />}

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

/** Linha de uma vendedora: dados, link de acesso, troca de senha, ativar e excluir */
function LinhaVendedora({ v, salvando, executar, mostrar }: { v: VendedoraAdmin; salvando: boolean; executar: (acao: string, payload: unknown, ok: string) => Promise<boolean>; mostrar: Mostrar }) {
  const [trocandoSenha, setTrocandoSenha] = useState(false)
  const [senha, setSenha] = useState('')
  const [senhaAtual, setSenhaAtual] = useState<string | null>(null)
  const [buscando, setBuscando] = useState(false)
  const acesso = linkCurto(DOMINIO, v.pagina, '').replace(/\/$/, '')

  // A senha decifrada some sozinha depois de 30 s e quando ela muda
  useEffect(() => {
    if (senhaAtual === null) return
    const t = window.setTimeout(() => setSenhaAtual(null), 30_000)
    return () => window.clearTimeout(t)
  }, [senhaAtual])

  const verSenha = async () => {
    if (senhaAtual !== null) return setSenhaAtual(null)
    setBuscando(true)
    try {
      setSenhaAtual(await adminVerSenha(v.slug))
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) window.location.reload()
      mostrar((e as Error).message, 'erro')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="space-y-3 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className={`font-bold ${v.ativa ? 'text-gray-900' : 'text-gray-400'}`}>
            <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500">{v.slug}</span>
            {v.nome}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${v.tem_senha ? 'bg-green-50 text-brand-green' : 'bg-red-50 text-brand-red'}`}>
              {v.tem_senha ? 'com senha' : 'sem senha'}
            </span>
          </div>
          <button
            type="button"
            className="mt-0.5 font-mono text-xs text-gray-400 hover:text-gray-700"
            title="Copiar o endereço de acesso"
            onClick={async () => mostrar((await copiar(acesso)) ? 'Endereço de acesso copiado.' : 'Não consegui copiar.', 'ok')}
          >
            {acesso.replace(/^https?:\/\//, '')}
          </button>
        </div>
        {v.tem_senha && (
          <button type="button" className="btn-secundario !px-3 !py-1.5 !text-xs" disabled={salvando || buscando} onClick={verSenha}>
            {senhaAtual !== null ? 'Ocultar senha' : buscando ? 'Buscando…' : 'Ver senha'}
          </button>
        )}
        <button type="button" className="btn-secundario !px-3 !py-1.5 !text-xs" disabled={salvando} onClick={() => setTrocandoSenha((x) => !x)}>
          {v.tem_senha ? 'Trocar senha' : 'Definir senha'}
        </button>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-green"
            checked={v.ativa}
            disabled={salvando}
            onChange={(e) =>
              executar(
                'vendedora.salvar',
                { slug: v.slug, nome: v.nome, pagina: v.pagina, ativa: e.target.checked },
                e.target.checked ? 'Vendedora ativada.' : 'Vendedora desativada: os links e a página dela param de funcionar.',
              )
            }
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

      {senhaAtual !== null && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-3">
          <span className="rotulo !mb-0">Senha de {v.nome}</span>
          <span className="select-all rounded-lg bg-white px-3 py-1.5 font-mono text-sm text-gray-900 ring-1 ring-gray-200">{senhaAtual}</span>
          <button
            type="button"
            className="btn-secundario !px-3 !py-1.5 !text-xs"
            onClick={async () => mostrar((await copiar(senhaAtual)) ? 'Senha copiada.' : 'Não consegui copiar.', 'ok')}
          >
            Copiar
          </button>
          <span className="text-xs text-gray-400">some em 30 segundos</span>
        </div>
      )}

      {trocandoSenha && (
        <form
          className="flex flex-wrap items-end gap-2 rounded-xl bg-gray-50 p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const ok = await executar(
              'vendedora.salvar',
              { slug: v.slug, nome: v.nome, pagina: v.pagina, ativa: v.ativa, senha },
              v.tem_senha ? 'Senha trocada. Ela vai precisar entrar de novo.' : 'Senha definida.',
            )
            if (ok) {
              setSenha('')
              setSenhaAtual(null)
              setTrocandoSenha(false)
            }
          }}
        >
          <div className="min-w-[200px] flex-1">
            <label className="rotulo" htmlFor={`senha-${v.slug}`}>Nova senha de {v.nome} (mínimo 8 caracteres)</label>
            <CampoSenha id={`senha-${v.slug}`} autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={8} required autoFocus />
          </div>
          <button type="submit" className="btn-primario" disabled={salvando || senha.length < 8}>
            Salvar senha
          </button>
          <button type="button" className="btn-secundario" onClick={() => { setSenha(''); setTrocandoSenha(false) }}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  )
}

function AbaVendedoras({ dados, atualizar, mostrar }: PropsAba) {
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [pagina, setPagina] = useState('')
  const [senha, setSenha] = useState('')
  const [tocados, setTocados] = useState<Set<string>>(new Set())
  const { executar, salvando } = useExecutar(atualizar, mostrar)

  // Código sequencial (00, 01…) vai no link do cliente; a página (/larissa) é o endereço de acesso dela
  useEffect(() => {
    if (!tocados.has('codigo')) setCodigo(proximoCodigoVendedora(dados.vendedoras.map((v) => v.slug)))
  }, [dados.vendedoras, tocados])
  useEffect(() => {
    if (!tocados.has('pagina')) setPagina(slugify(nome.split(/\s+/)[0] ?? ''))
  }, [nome, tocados])
  const tocar = (campo: string) => setTocados((t) => new Set(t).add(campo))
  const semSenha = dados.vendedoras.filter((v) => v.ativa && !v.tem_senha).length

  return (
    <div className="space-y-6">
      <form
        className="cartao grid gap-3 sm:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault()
          if (await executar('vendedora.salvar', { nome, slug: codigo, pagina, senha, ativa: true }, 'Vendedora adicionada.')) {
            setNome('')
            setSenha('')
            setTocados(new Set())
          }
        }}
      >
        <div>
          <label className="rotulo" htmlFor="v-nome">Nome (vai no utm_medium)</label>
          <input id="v-nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da vendedora" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="v-senha">Senha de acesso (mínimo 8 caracteres)</label>
          <CampoSenha id="v-senha" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={8} required />
        </div>
        <div>
          <label className="rotulo" htmlFor="v-pagina">Página de acesso</label>
          <input id="v-pagina" className="campo font-mono text-xs" value={pagina} onChange={(e) => { tocar('pagina'); setPagina(e.target.value) }} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="v-codigo">Código (vai no link do cliente)</label>
          <input id="v-codigo" className="campo font-mono text-xs" value={codigo} onChange={(e) => { tocar('codigo'); setCodigo(e.target.value) }} pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
        </div>
        <div className="text-xs text-gray-500 sm:col-span-2">
          Acesso: <span className="font-mono">{linkCurto(DOMINIO, pagina || '…', '').replace(/\/$/, '').replace(/^https?:\/\//, '')}</span> · Link do cliente:{' '}
          <span className="font-mono">{linkCurto(DOMINIO, codigo || '…', 'anc3500').replace(/^https?:\/\//, '')}</span>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primario" disabled={salvando}>
            Adicionar vendedora
          </button>
        </div>
      </form>

      {semSenha > 0 && (
        <Aviso tipo="erro">
          {semSenha === 1 ? '1 vendedora ativa está sem senha e não consegue entrar' : `${semSenha} vendedoras ativas estão sem senha e não conseguem entrar`}. Use “Definir senha”.
        </Aviso>
      )}

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {dados.vendedoras.map((v) => (
          <LinhaVendedora key={v.slug} v={v} salvando={salvando} executar={executar} mostrar={mostrar} />
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
  const [dados, setDados] = useState<DadosAdmin | null>(null)
  const [pedirSenha, setPedirSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState<Aba>('ofertas')
  const { mostrar, elemento: toast } = useToast()

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setDados(await adminListar())
      setPedirSenha(false)
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) setPedirSenha(true)
      else setErro((e as Error).message)
    }
  }, [])

  useEffect(() => {
    document.title = 'Nutri de Consultório'
    carregar()
  }, [carregar])

  if (pedirSenha || !dados) {
    return (
      <Pagina>
        <Cabecalho titulo="Administração" subtitulo="Acesso restrito." />
        {pedirSenha ? (
          <Login
            onEntrar={async (senha) => {
              await entrar('admin', senha)
              await carregar()
            }}
          />
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
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-gray-600"
            onClick={async () => {
              await sair('admin')
              setDados(null)
              setPedirSenha(true)
            }}
          >
            sair
          </button>
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
      {aba === 'ofertas' && <AbaOfertas dados={dados} atualizar={setDados} mostrar={mostrar} />}
      {aba === 'vendedoras' && <AbaVendedoras dados={dados} atualizar={setDados} mostrar={mostrar} />}
      {aba === 'cliques' && <AbaCliques dados={dados} />}
      {toast}
    </Pagina>
  )
}
