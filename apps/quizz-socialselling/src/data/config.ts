/**
 * App configuration — edit URLs and contact info here.
 */
export const config = {
  /** URL to redirect after quiz completion (página de agendamento) */
  redirectUrl: 'https://www.lp.nutrideconsultorio.com/ssn-consultoria02',

  /** Make webhook URL — quiz sends all data here on completion */
  webhookUrl: 'https://hook.us1.make.com/5ppxyeapp1hledef15qgc1v8savn5fuk',

  /** WhatsApp number (international format, digits only) */
  whatsappNumber: '5511999999999',

  /** WhatsApp pre-filled message */
  whatsappMessage: 'Olá! Fiz o diagnóstico do consultório e quero atendimento prioritário.',

  /** Delay (ms) before redirecting after quiz completion */
  redirectDelayMs: 2500,

  /** Brand */
  brandName: 'Nutri de Consultório',
  brandOwner: 'Letícia Cruz',

  /**
   * URL params from Digital Manager Guru checkout redirect.
   * Guru passes these in the thank-you page URL.
   * Map: paramName → friendly label for the webhook payload.
   */
  guruParams: [
    'c_email', 'c_name', 'c_phone', 'c_product', 'c_tid',
    'utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term',
  ] as const,
} as const
