export interface QuizOption {
  id: string
  emoji: string
  label: string
}

export interface QuizQuestion {
  /** Chave fixa usada no analytics — não mudar depois que o funil estiver no ar */
  key: string
  question: string
  options: QuizOption[]
}

/**
 * Perguntas do quiz — edite aqui.
 * Trechos entre ** ** no label aparecem em negrito.
 */
export const questions: QuizQuestion[] = [
  {
    key: 'perfil',
    question: 'Você é?',
    options: [
      { id: 'formada', emoji: '👩‍⚕️', label: 'Nutricionista formada' },
      { id: 'estudante', emoji: '👩‍🎓', label: 'Estudante' },
    ],
  },
  {
    key: 'tempo_atendimento',
    question: 'Você atende há quanto tempo?',
    options: [
      { id: 'recem_formada', emoji: '🗓️', label: 'Recém formada, vou começar agora' },
      { id: '1_2_anos', emoji: '🗓️', label: 'Entre 1-2 anos' },
      { id: '2_4_anos', emoji: '🗓️', label: 'Entre 2-4 anos' },
      { id: '5_mais', emoji: '🗓️', label: 'Mais de 05 anos' },
    ],
  },
  {
    key: 'seguidores',
    question: 'Quantos seguidores você tem no Instagram?',
    options: [
      { id: 'ate_1k', emoji: '👥', label: 'Menos de 1.000' },
      { id: '1k_3k', emoji: '👥', label: 'Entre 1.000 e 3.000' },
      { id: '3k_6k', emoji: '👥', label: 'Entre 3.000 e 6.000' },
      { id: '6k_10k', emoji: '👥', label: 'Entre 6.000 e 10.000' },
      { id: '10k_mais', emoji: '👥', label: 'Mais de 10.000' },
    ],
  },
  {
    key: 'dificuldade',
    question: 'Qual a sua maior dificuldade para captar pacientes no Instagram?',
    options: [
      { id: 'poucas_views', emoji: '👀', label: 'Tenho poucas views nos stories' },
      { id: 'sem_interacao', emoji: '😶', label: 'Ninguém interage comigo' },
      { id: 'nao_sei_postar', emoji: '🤷‍♀️', label: 'Não sei o que postar' },
      { id: 'vergonha', emoji: '🙈', label: 'Tenho vergonha de me expor' },
    ],
  },
]
