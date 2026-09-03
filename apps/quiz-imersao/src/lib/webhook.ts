import { questions } from '../data/questions'
import { config } from '../data/config'

type Answers = Record<number, string>

/**
 * Reads URL search params passed by Digital Manager Guru on redirect.
 * Example URL: https://quiz.vercel.app/?c_email=fulana@email.com&c_name=Maria&c_phone=11999...&c_product=webnutri
 */
export function getGuruParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const data: Record<string, string> = {}

  for (const key of config.guruParams) {
    const value = params.get(key)
    if (value) {
      data[key] = value
    }
  }

  return data
}

/**
 * Resolves radio answer IDs to their human-readable labels.
 * Text answers are returned as-is.
 */
function resolveAnswers(answers: Answers): Record<string, string> {
  const resolved: Record<string, string> = {}

  for (const question of questions) {
    const answer = answers[question.id]
    if (!answer) continue

    // Use question text as key (cleaned)
    const key = question.question
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')

    if (question.type === 'text') {
      resolved[key] = answer
    } else {
      const option = question.options?.find((o) => o.id === answer)
      resolved[key] = option?.label ?? answer
    }
  }

  return resolved
}

/**
 * Sends all data (Guru params + quiz answers) to the Make webhook.
 */
export async function submitToWebhook(answers: Answers): Promise<boolean> {
  const guruData = getGuruParams()
  const quizAnswers = resolveAnswers(answers)

  const payload = {
    // Purchase data from Guru (renamed from c_ prefixed params)
    name: guruData.c_name ?? '',
    email: guruData.c_email ?? '',
    phone: guruData.c_phone ?? '',
    product: guruData.c_product ?? '',
    transaction_id: guruData.c_tid ?? '',

    // Quiz answers (human-readable)
    instagram: quizAnswers.qual_o_seu_do_instagram ?? '',
    momento_atual: quizAnswers.qual_e_o_seu_momento_atual ?? '',
    faturamento_medio: quizAnswers.qual_a_sua_media_de_faturamento_atual ?? '',
    ticket_medio: quizAnswers.qual_ticket_medio_voce_cobra_por_atendimento ?? '',
    maior_dificuldade: quizAnswers.qual_e_a_sua_maior_dificuldade_hoje_se_voce_pudesse_nos_pedir_ajuda_em_algo_o_que_pediria ?? '',

    // Metadata
    source: 'quiz-imersao-consultorio-5x',
    submitted_at: new Date().toISOString(),
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch {
    console.error('Webhook submission failed')
    return false
  }
}
