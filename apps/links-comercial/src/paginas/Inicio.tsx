import { Pagina } from '../components/Cabecalho'

/** "/" — página neutra: não lista vendedoras nem aponta para o admin */
export default function Inicio() {
  return (
    <Pagina>
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-400">Nutri de Consultório</p>
      </div>
    </Pagina>
  )
}
