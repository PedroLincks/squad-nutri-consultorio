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

    const key = question.key

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

    // UTMs forwarded by Guru on the approved-purchase redirect
    utm_source: guruData.utm_source ?? '',
    utm_campaign: guruData.utm_campaign ?? '',
    utm_medium: guruData.utm_medium ?? '',
    utm_content: guruData.utm_content ?? '',
    utm_term: guruData.utm_term ?? '',

    // Quiz answers (human-readable)
    instagram: quizAnswers.instagram ?? '',
    momento_atual: quizAnswers.momento_atual ?? '',
    faturamento_medio: quizAnswers.faturamento_medio ?? '',
    pacientes_mes: quizAnswers.pacientes_mes ?? '',
    maior_dificuldade: quizAnswers.maior_dificuldade ?? '',

    // Metadata
    source: 'quizz-socialselling',
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
