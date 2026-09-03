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
    question: 'Qual é o seu momento atual?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Sou estudante' },
      { id: 'b', label: 'Sou estudante e estou no último semestre' },
      { id: 'c', label: 'Sou recém formada(o)' },
      { id: 'd', label: 'Sou nutricionista com mais de 2 anos de experiência' },
    ],
  },
  {
    id: 3,
    question: 'Qual a sua média de faturamento atual?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Ainda não faturo' },
      { id: 'b', label: 'Entre R$ 1.000 a R$ 2.000' },
      { id: 'c', label: 'Entre R$ 2.000 a R$ 4.000' },
      { id: 'd', label: 'Entre R$ 4.000 e R$ 6.000' },
      { id: 'e', label: 'Entre R$ 6.000 e R$ 10.000' },
      { id: 'f', label: 'Acima de R$ 10.000' },
    ],
  },
  {
    id: 4,
    question: 'Qual ticket médio você cobra por atendimento?',
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
    question: 'Qual é a sua MAIOR dificuldade hoje? Se você pudesse nos pedir ajuda em algo, o que pediria?',
    type: 'text',
    placeholder: 'Digite sua maior dificuldade...',
  },
]
