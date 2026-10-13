import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// O painel só é baixado por quem abre /painel — o quiz não carrega esse código
const Painel = lazy(() => import('./painel/Painel'))

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (location.pathname.startsWith('/painel')) {
  document.title = 'Painel · Quiz SSN'
  root.render(
    <Suspense fallback={null}>
      <Painel />
    </Suspense>,
  )
} else {
  root.render(<App />)
}
