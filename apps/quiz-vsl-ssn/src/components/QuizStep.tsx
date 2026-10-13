import { useState } from 'react'
import type { QuizQuestion } from '../data/questions'
import { Highlight } from './Highlight'

interface QuizStepProps {
  question: QuizQuestion
  onAnswer: (optionId: string) => void
}

export function QuizStep({ question, onAnswer }: QuizStepProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    if (selected) return
    setSelected(id)
    // Pequena pausa para a marcação aparecer antes de avançar
    setTimeout(() => onAnswer(id), 350)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-center font-montserrat text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`quiz-option ${isSelected ? 'selected' : ''}`}
            >
              <span className="text-3xl leading-none">{option.emoji}</span>
              <span className={`radio ${isSelected ? 'selected' : ''}`}>
                {isSelected && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-left text-[15px] font-semibold leading-snug text-gray-900">
                <Highlight text={option.label} bold />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
