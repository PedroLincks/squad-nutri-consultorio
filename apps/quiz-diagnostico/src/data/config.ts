/**
 * App configuration — edit URLs and contact info here.
 */
export const config = {
  /** URL to redirect after quiz completion (página de agendamento) */
  redirectUrl: 'https://PLACEHOLDER-AGENDAMENTO.com',

  /** Make webhook URL — quiz sends all data here on completion */
  webhookUrl: 'https://hook.us1.make.com/PLACEHOLDER',

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
  guruParams: ['email', 'name', 'phone', 'product', 'transaction_id'] as const,
} as const
