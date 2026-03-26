import { useState, useCallback, useEffect } from 'react'
import { questions } from './data/questions'
import { config } from './data/config'
import { submitToWebhook } from './lib/webhook'
import { ProgressBar } from './components/ProgressBar'
import { QuizStep } from './components/QuizStep'
import { CompletionScreen } from './components/CompletionScreen'
import { WhatsAppButton } from './components/WhatsAppButton'

type Answers = Record<number, string>

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const totalSteps = questions.length
  const currentQuestion = questions[currentStep - 1]

  const handleSelect = useCallback((value: string) => {
    const updatedAnswers = { ...answers, [currentStep]: value }
    setAnswers(updatedAnswers)

    const isRadio = currentQuestion.type === 'radio'
    const delay = isRadio ? 400 : 0

    setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setIsCompleted(true)
        submitToWebhook(updatedAnswers)
      }
    }, delay)
  }, [currentStep, totalSteps, currentQuestion.type, answers])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        window.location.href = config.redirectUrl
      }, config.redirectDelayMs)
      return () => clearTimeout(timer)
    }
  }, [isCompleted])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#c9a96e] font-montserrat tracking-tight">
            Diagnóstico do Consultório
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-1">
            {config.brandOwner} | {config.brandName}
          </p>
        </div>

        {/* Glass card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {!isCompleted ? (
            <div className="space-y-8">
              {/* Progress */}
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

              {/* Step indicator text */}
              <p className="text-gray-400 text-xs font-inter text-center">
                Pergunta {currentStep} de {totalSteps}
              </p>

              {/* Question */}
              <QuizStep
                key={currentQuestion.id}
                question={currentQuestion}
                selectedAnswer={answers[currentStep] ?? null}
                onSelect={handleSelect}
                onBack={handleBack}
                isFirstStep={currentStep === 1}
              />
            </div>
          ) : (
            <CompletionScreen brandName={config.brandName} />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-4 font-inter">
          {config.brandName} &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </div>
  )
}
