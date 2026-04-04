export interface QuizOption {
  id: string
  label: string
}

export interface QuizQuestion {
  id: number
  question: string
  type: 'radio' | 'text'
  options?: QuizOption[]
  placeholder?: string
}

/**
 * Quiz questions — edit this array to change quiz content.
 * type: 'text' renders a text input field.
 * type: 'radio' renders radio button options.
 */
export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual o seu @ do Instagram?',
    type: 'text',
    placeholder: '@seuinstagram',
  },
  {
    id: 2,
    question: 'Quantos pacientes você atende por mês?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de 10 pacientes' },
      { id: 'b', label: 'Entre 10 e 20 pacientes' },
      { id: 'c', label: 'Entre 30 e 40 pacientes' },
      { id: 'd', label: 'Entre 40 e 50 pacientes' },
      { id: 'e', label: 'Entre 50 e 60 pacientes' },
      { id: 'f', label: 'Mais de 60 pacientes' },
    ],
  },
  {
    id: 3,
    question: 'Qual o faturamento médio mensal do seu consultório?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de R$ 2.000' },
      { id: 'b', label: 'Entre R$ 2.000 e R$ 4.000' },
      { id: 'c', label: 'Entre R$ 4.000 e R$ 6.000' },
      { id: 'd', label: 'Entre R$ 6.000 e R$ 8.000' },
      { id: 'e', label: 'Entre R$ 8.000 e R$ 10.000' },
      { id: 'f', label: 'Acima de R$ 10.000' },
    ],
  },
  {
    id: 4,
    question: 'Qual o ticket médio que você cobra por atendimento?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de R$ 150' },
      { id: 'b', label: 'Entre R$ 150 e R$ 300' },
      { id: 'c', label: 'Entre R$ 300 e R$ 500' },
      { id: 'd', label: 'Entre R$ 500 e R$ 1.000' },
      { id: 'e', label: 'Acima de R$ 1.000' },
    ],
  },
  {
    id: 5,
    question: 'Qual a sua maior dificuldade hoje? O que você precisa de ajuda?',
    type: 'text',
    placeholder: 'Digite sua maior dificuldade...',
  },
]
