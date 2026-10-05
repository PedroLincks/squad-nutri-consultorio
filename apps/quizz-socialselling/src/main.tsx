import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Quando embutido em iframe (ex.: página da Atomicat), o fundo fica por conta da página hospedeira
if (window.self !== window.top) document.documentElement.classList.add('embedded')

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
