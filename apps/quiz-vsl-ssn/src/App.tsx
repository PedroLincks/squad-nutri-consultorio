import { useCallback, useEffect, useState } from 'react'
import { ProgressBar } from './components/ProgressBar'
import { QuizStep } from './components/QuizStep'
import { Highlight } from './components/Highlight'
import { Loading } from './components/Loading'
import { Vsl } from './components/Vsl'
import { abertura } from './data/content'
import { questions } from './data/questions'
import { quandoVisivel, track } from './lib/track'

// A capa saiu em 22/10/2026: o funil abre direto na pergunta 1
type Stage = 'quiz' | 'loading' | 'vsl'

/** Só em desenvolvimento: ?etapa=vsl abre direto numa etapa, para testar */
function etapaInicial(): Stage {
  const etapa = new URLSearchParams(location.search).get('etapa')
  if (import.meta.env.DEV && (etapa === 'loading' || etapa === 'vsl')) return etapa
  return 'quiz'
}

export default function App() {
  const [stage, setStage] = useState<Stage>(etapaInicial)
  const [step, setStep] = useState(0)
  // Respostas guardadas para o analytics (próxima fase)
  const [, setAnswers] = useState<Record<string, string>>({})

  // Acesso só conta quando a pessoa realmente vê a página (não em pré-carregamento)
  useEffect(() => quandoVisivel(() => track('page_view')), [])

  const handleAnswer = (optionId: string) => {
    const question = questions[step]
    // Sem capa, "iniciou o quiz" = respondeu a primeira pergunta (mantém o funil do painel comparável)
    if (step === 0) track('quiz_start')
    track('answer', { step_key: question.key, answer: optionId })
    setAnswers((prev) => ({ ...prev, [question.key]: optionId }))
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
    } else {
      setStage('loading')
    }
  }

  const handleLoaded = useCallback(() => {
    track('vsl_view')
    setStage('vsl')
  }, [])

  // A barra não chega a 100% nas perguntas: o carregamento é o último trecho
  const progress = ((step + 1) / (questions.length + 1)) * 100

  return (
    <div className="flex min-h-screen justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-md sm:max-w-xl">
        {stage === 'quiz' && (
          <div className="space-y-8">
            <ProgressBar percent={progress} />
            {step === 0 && (
              <div className="animate-fade-in -mb-2 space-y-3 text-center">
                <h1 className="font-montserrat text-[17px] font-bold leading-snug text-gray-900 sm:text-[22px]">
                  <Highlight text={abertura.headline} />
                </h1>
                <p className="text-sm font-semibold text-gray-500">{abertura.cta.replace('{n}', String(questions.length))}</p>
                <hr className="mx-auto w-16 border-t-2 border-brand-pink" />
              </div>
            )}
            <QuizStep key={questions[step].key} question={questions[step]} onAnswer={handleAnswer} />
          </div>
        )}

        {stage === 'loading' && (
          <div className="space-y-8">
            <ProgressBar percent={100} />
            <Loading onDone={handleLoaded} />
          </div>
        )}

        {stage === 'vsl' && <Vsl />}
      </div>
    </div>
  )
}
