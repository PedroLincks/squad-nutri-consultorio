import { useCallback, useEffect, useMemo, useState } from 'react'
import { Aviso, Cabecalho, Pagina } from '../components/Cabecalho'
import { Login } from '../components/Login'
import { useToast } from '../components/Toast'
import { DOMINIO, ErroApi, carregarCatalogo, entrar, sair } from '../lib/api'
import { copiar } from '../lib/copiar'
import { formatarReais, linkCurto, linkParaCopiar } from '../shared/links'
import { TIPOS_OFERTA, ordemProduto, rotuloTipo } from '../shared/produtos'
import type { CatalogoVendedora, OfertaVendedora, Produto, TipoOferta } from '../shared/tipos'

type ProdutoBase = Pick<Produto, 'sigla' | 'nome'>

/** Agrupa as ofertas por produto, na ordem cadastrada dos produtos */
function agrupar(ofertas: OfertaVendedora[], produtos: ProdutoBase[]): { produto: string; ofertas: OfertaVendedora[] }[] {
  const grupos: { produto: string; ofertas: OfertaVendedora[] }[] = []
  for (const o of ofertas) {
    const g = grupos.find((x) => x.produto === o.produto)
    if (g) g.ofertas.push(o)
    else grupos.push({ produto: o.produto, ofertas: [o] })
  }
  return grupos.sort((a, b) => ordemProduto(produtos, a.produto) - ordemProduto(produtos, b.produto))
}

function normalizar(t: string) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * "/{pagina}" (ex.: /larissa) — a tela que a vendedora usa no ato da venda.
 * Sem sessão válida mostra só o campo de senha, igual para qualquer endereço (não revela quem existe).
 */
export default function Vendedora({ pagina }: { pagina: string }) {
  const [catalogo, setCatalogo] = useState<CatalogoVendedora | null>(null)
  const [pedirSenha, setPedirSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroProduto, setFiltroProduto] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'' | TipoOferta>('')
  const { mostrar, elemento: toast } = useToast()

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setCatalogo(await carregarCatalogo(pagina))
      setPedirSenha(false)
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) setPedirSenha(true)
      else setErro((e as Error).message)
    }
  }, [pagina])

  useEffect(() => {
    carregar()
  }, [carregar])

  useEffect(() => {
    document.title = catalogo ? `Links · ${catalogo.vendedora.nome}` : 'Nutri de Consultório'
  }, [catalogo])

  const grupos = useMemo(() => {
    if (!catalogo) return []
    const termo = normalizar(busca.trim())
    const lista = catalogo.ofertas.filter(
      (o) =>
        (!filtroProduto || o.produto === filtroProduto) &&
        (!filtroTipo || o.tipo === filtroTipo) &&
        (!termo || normalizar(`${o.produto} ${o.sigla} ${o.nome} ${rotuloTipo(o.tipo)} ${o.ticket ?? ''} ${o.orientacao ?? ''}`).includes(termo)),
    )
    return agrupar(lista, catalogo.produtos)
  }, [catalogo, busca, filtroProduto, filtroTipo])

  // Só aparecem nos filtros os produtos e tipos que têm oferta ativa
  const opcoes = useMemo(() => {
    if (!catalogo) return { produtos: [], tipos: [] }
    return {
      produtos: catalogo.produtos.filter((p) => catalogo.ofertas.some((o) => o.produto === p.nome)),
      tipos: TIPOS_OFERTA.filter((t) => catalogo.ofertas.some((o) => o.tipo === t.id)),
    }
  }, [catalogo])
  const filtrando = Boolean(busca || filtroProduto || filtroTipo)

  if (pedirSenha) {
    return (
      <Pagina>
        <Cabecalho titulo="Acesso restrito" subtitulo="Digite sua senha para ver seus links de venda." />
        <Login
          onEntrar={async (senha) => {
            await entrar('vendedora', senha, pagina)
            await carregar()
          }}
        />
      </Pagina>
    )
  }
  if (erro) {
    return (
      <Pagina>
        <Cabecalho titulo="Links de venda" />
        <Aviso tipo="erro">{erro}</Aviso>
      </Pagina>
    )
  }
  if (!catalogo) return <Pagina>{null}</Pagina>

  const codigo = catalogo.vendedora.codigo
  const copiarLink = async (o: OfertaVendedora) => {
    const ok = await copiar(linkParaCopiar(DOMINIO, codigo, o.slug))
    mostrar(ok ? 'Link copiado! Pode colar no WhatsApp.' : 'Não consegui copiar. Segure o link para copiar.', ok ? 'ok' : 'erro')
  }

  return (
    <Pagina>
      <Cabecalho
        titulo={`Links · ${catalogo.vendedora.nome}`}
        subtitulo="Toque em “Copiar link” e cole no WhatsApp. O link já vai com o seu nome e as UTMs."
        acao={
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-gray-600"
            onClick={async () => {
              await sair('vendedora')
              setCatalogo(null)
              setPedirSenha(true)
            }}
          >
            sair
          </button>
        }
      />

      <div className="mb-6 space-y-2">
        <input
          type="search"
          className="campo"
          placeholder="Buscar oferta (ex.: ANC, 1997, renovação)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <select className="campo" value={filtroProduto} onChange={(e) => setFiltroProduto(e.target.value)} aria-label="Filtrar por produto">
            <option value="">Produto: todos</option>
            {opcoes.produtos.map((p) => (
              <option key={p.sigla} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </select>
          <select className="campo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as '' | TipoOferta)} aria-label="Filtrar por tipo de oferta">
            <option value="">Tipo: todos</option>
            {opcoes.tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {grupos.length === 0 && (
        <Aviso>
          Nenhuma oferta encontrada.{' '}
          {filtrando && (
            <button
              type="button"
              className="font-bold text-brand-red underline"
              onClick={() => {
                setBusca('')
                setFiltroProduto('')
                setFiltroTipo('')
              }}
            >
              Limpar filtros
            </button>
          )}
        </Aviso>
      )}

      <div className="space-y-8">
        {grupos.map((g) => (
          <section key={g.produto}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">{g.produto}</h2>
            <div className="space-y-3">
              {g.ofertas.map((o) => {
                const link = linkCurto(DOMINIO, codigo, o.slug)
                return (
                  <article key={o.id} className="cartao">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">{o.nome}</h3>
                        {o.tipo && <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{rotuloTipo(o.tipo)}</span>}
                        {o.orientacao && <p className="mt-1 text-sm text-gray-500">{o.orientacao}</p>}
                      </div>
                      {o.ticket !== null && (
                        <div className="shrink-0 rounded-lg bg-brand-pink px-2.5 py-1 text-sm font-bold tabular-nums text-brand-red">
                          {formatarReais(o.ticket)}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 break-all rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-400" title={link}>
                      {DOMINIO.replace(/^https?:\/\//, '')}
                      <span className="font-bold text-gray-700">/{codigo}/{o.slug}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="btn-primario flex-1" onClick={() => copiarLink(o)}>
                        Copiar link
                      </button>
                      <a href={link} target="_blank" rel="noreferrer" className="btn-secundario">
                        Abrir
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      {toast}
    </Pagina>
  )
}
