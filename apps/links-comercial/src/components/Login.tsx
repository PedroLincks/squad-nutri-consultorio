import { useState } from 'react'
import { Aviso } from './Cabecalho'
import { CampoSenha } from './CampoSenha'

/** Formulário de senha usado pela vendedora e pelo admin */
export function Login({ onEntrar }: { onEntrar: (senha: string) => Promise<void> }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  return (
    <form
      className="cartao space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        setErro('')
        setEnviando(true)
        try {
          await onEntrar(senha)
        } catch (err) {
          setErro((err as Error).message)
          setSenha('')
        } finally {
          setEnviando(false)
        }
      }}
    >
      <label className="rotulo" htmlFor="senha">
        Senha
      </label>
      <CampoSenha
        id="senha"
        autoComplete="current-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        autoFocus
        required
      />
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <button type="submit" className="btn-primario w-full" disabled={enviando || !senha}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
