export interface QuizOption {
  id: string
  label: string
}

export interface QuizQuestion {
  id: number
  /** Fixed key used in the webhook payload — keep stable, Make maps by this name */
  key: string
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
    key: 'instagram',
    question: 'Qual o seu @ do Instagram?',
    type: 'text',
    placeholder: '@seuinstagram',
  },
  {
    id: 2,
    key: 'momento_atual',
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
    key: 'faturamento_medio',
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
    key: 'pacientes_mes',
    question: 'Quantos pacientes você atende no mês?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de 10' },
      { id: 'b', label: 'Entre 10 e 20' },
      { id: 'c', label: 'Entre 20 e 30' },
      { id: 'd', label: 'Mais de 30' },
    ],
  },
  {
    id: 5,
    key: 'maior_dificuldade',
    question: 'Qual a sua MAIOR dificuldade hoje no seu consultório? O que te impede de faturar mais?',
    type: 'text',
    placeholder: 'Digite sua maior dificuldade...',
  },
]
