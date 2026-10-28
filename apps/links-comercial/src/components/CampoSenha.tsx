import { useState, type InputHTMLAttributes } from 'react'

/** Campo de senha com botão "mostrar / ocultar" */
export function CampoSenha(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visivel, setVisivel] = useState(false)
  return (
    <div className="relative">
      <input {...props} type={visivel ? 'text' : 'password'} className={`campo pr-20 ${props.className ?? ''}`} />
      <button
        type="button"
        className="absolute inset-y-0 right-0 px-3 text-xs font-bold text-gray-500 hover:text-gray-800"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {visivel ? 'ocultar' : 'mostrar'}
      </button>
    </div>
  )
}
