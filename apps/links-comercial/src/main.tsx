import { lazy, StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Inicio from './paginas/Inicio'
import Vendedora from './paginas/Vendedora'
import './styles/index.css'

// O admin só é baixado por quem abre /admin
const Admin = lazy(() => import('./paginas/Admin'))

// Versões antigas guardavam a senha do admin no navegador: apaga o que tiver sobrado
try {
  localStorage.removeItem('admin_senha')
} catch {
  /* sem storage */
}

const caminho = location.pathname.replace(/\/+$/, '')

function Tela() {
  if (caminho === '/admin') {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }
  // /larissa — página da vendedora (pede a senha dela)
  const pagina = caminho.toLowerCase().match(/^\/([a-z0-9-]+)$/)
  if (pagina) return <Vendedora pagina={pagina[1]} />
  return <Inicio />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Tela />
  </StrictMode>,
)
