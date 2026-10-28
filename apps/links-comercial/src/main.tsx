import { lazy, StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Inicio from './paginas/Inicio'
import Vendedora from './paginas/Vendedora'
import './styles/index.css'

// O admin só é baixado por quem abre /admin
const Admin = lazy(() => import('./paginas/Admin'))

const caminho = location.pathname.replace(/\/+$/, '')

function Tela() {
  if (caminho === '/admin') {
    document.title = 'Admin · Links de venda'
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }
  const vendedora = caminho.match(/^\/([a-z0-9-]+)$/)
  if (vendedora) return <Vendedora slug={vendedora[1]} />
  return <Inicio />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Tela />
  </StrictMode>,
)
