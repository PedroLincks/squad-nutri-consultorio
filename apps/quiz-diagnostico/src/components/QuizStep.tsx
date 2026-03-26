import { useState } from 'react'
import { QuizQuestion } from '../data/questions'

interface QuizStepProps {
  question: QuizQuestion
  selectedAnswer: string | null
  onSelect: (value: string) => void
  onBack: () => void
  isFirstStep: boolean
}

export function QuizStep({ question, selectedAnswer, onSelect, onBack, isFirstStep }: QuizStepProps) {
  const [textValue, setTextValue] = useState(selectedAnswer ?? '')

  const handleTextSubmit = () => {
    const trimmed = textValue.trim()
    if (trimmed) {
      onSelect(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit()
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-semibold text-white font-montserrat leading-tight text-center">
        {question.question}
      </h2>

      {/* Text input */}
      {question.type === 'text' && (
        <div className="space-y-4">
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder ?? ''}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-inter text-base focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/40 focus:border-[#c9a96e]/40 transition-all duration-200"
            autoFocus
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textValue.trim()}
            className="w-full py-3 rounded-xl font-semibold font-montserrat text-sm transition-all duration-200 text-[#0a1233] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #c9a96e, #a07a35, #c9a96e)' }}
          >
            Continuar
          </button>
        </div>
      )}

      {/* Radio options */}
      {question.type === 'radio' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id

            return (
              <label
                key={option.id}
                className={`quiz-option-label ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(option.id)}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onSelect(option.id)}
                  className="hidden"
                />
                <span className={`radio-circle ${isSelected ? 'selected' : ''}`} />
                <span className="text-sm sm:text-base text-gray-200 font-inter">
                  {option.label}
                </span>
              </label>
            )
          })}
        </div>
      )}

      {/* Back button */}
      {!isFirstStep && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors duration-200 mt-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      )}
    </div>
  )
}
