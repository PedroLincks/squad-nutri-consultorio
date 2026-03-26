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
    question: 'Qual a sua modalidade de atendimento?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Presencial' },
      { id: 'b', label: 'Online' },
      { id: 'c', label: 'Ambas' },
    ],
  },
  {
    id: 3,
    question: 'Quantos pacientes você atende por mês?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de 10 pacientes' },
      { id: 'b', label: 'Entre 10 e 30 pacientes' },
      { id: 'c', label: 'Entre 30 e 60 pacientes' },
      { id: 'd', label: 'Entre 60 e 100 pacientes' },
      { id: 'e', label: 'Mais de 100 pacientes' },
    ],
  },
  {
    id: 4,
    question: 'Qual o faturamento médio mensal do seu consultório?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Menos de R$ 3.000' },
      { id: 'b', label: 'Entre R$ 3.000 e R$ 8.000' },
      { id: 'c', label: 'Entre R$ 8.000 e R$ 15.000' },
      { id: 'd', label: 'Entre R$ 15.000 e R$ 30.000' },
      { id: 'e', label: 'Acima de R$ 30.000' },
    ],
  },
  {
    id: 5,
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
    id: 6,
    question: 'Qual sua maior dificuldade hoje para melhorar o resultado do seu consultório?',
    type: 'radio',
    options: [
      { id: 'a', label: 'Atrair novos pacientes de forma consistente' },
      { id: 'b', label: 'Fazer os pacientes voltarem e continuarem o acompanhamento' },
      { id: 'c', label: 'Cobrar o que eu realmente mereço (aumentar meu ticket)' },
      { id: 'd', label: 'Organizar a rotina e os processos do consultório' },
      { id: 'e', label: 'Todas as anteriores' },
    ],
  },
]
