import { useEffect, useState } from 'react'
import { Aviso, Cabecalho, Pagina } from '../components/Cabecalho'
import { carregarCatalogo } from '../lib/api'
import type { Vendedora } from '../shared/tipos'

/** "/" — cada vendedora escolhe a própria página (e pode salvar o link dela nos favoritos) */
export default function Inicio() {
  const [vendedoras, setVendedoras] = useState<Vendedora[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarCatalogo()
      .then((c) => setVendedoras(c.vendedoras))
      .catch((e: Error) => setErro(e.message))
  }, [])

  return (
    <Pagina>
      <Cabecalho titulo="Links de venda" subtitulo="Escolha o seu nome para ver os seus links." />
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {vendedoras && vendedoras.length === 0 && <Aviso>Nenhuma vendedora cadastrada ainda.</Aviso>}
      <div className="grid gap-3">
        {vendedoras?.map((v) => (
          <a
            key={v.slug}
            href={`/${v.slug}`}
            className="cartao flex items-center justify-between text-lg font-bold text-gray-900 transition hover:border-brand-red hover:shadow-md"
          >
            <span>
              <span className="mr-3 rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-gray-500">{v.slug}</span>
              {v.nome}
            </span>
            <span aria-hidden className="text-gray-300">
              ›
            </span>
          </a>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-gray-400">
        <a href="/admin" className="hover:text-gray-600">
          Administrar ofertas
        </a>
      </p>
    </Pagina>
  )
}
