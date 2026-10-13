import { useCallback, useEffect, useState } from 'react'
import { Capa } from './components/Capa'
import { ProgressBar } from './components/ProgressBar'
import { QuizStep } from './components/QuizStep'
import { Loading } from './components/Loading'
import { Vsl } from './components/Vsl'
import { questions } from './data/questions'
import { track } from './lib/track'

type Stage = 'capa' | 'quiz' | 'loading' | 'vsl'

/** Só em desenvolvimento: ?etapa=vsl abre direto numa etapa, para testar */
function etapaInicial(): Stage {
  const etapa = new URLSearchParams(location.search).get('etapa')
  if (import.meta.env.DEV && (etapa === 'quiz' || etapa === 'loading' || etapa === 'vsl')) return etapa
  return 'capa'
}

export default function App() {
  const [stage, setStage] = useState<Stage>(etapaInicial)
  const [step, setStep] = useState(0)
  // Respostas guardadas para o analytics (próxima fase)
  const [, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    track('page_view')
  }, [])

  const handleStart = () => {
    track('quiz_start')
    setStage('quiz')
  }

  const handleAnswer = (optionId: string) => {
    const question = questions[step]
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
        {stage === 'capa' && <Capa onStart={handleStart} />}

        {stage === 'quiz' && (
          <div className="space-y-8">
            <ProgressBar percent={progress} />
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
