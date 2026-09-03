/**
 * App configuration — edit URLs and contact info here.
 */
export const config = {
  /** URL to redirect after quiz completion (grupo WhatsApp da imersão) */
  redirectUrl: 'https://sndflw.com/i/ZBQabnPZo7Y9yMlDsbe0',

  /** Make webhook URL — quiz sends all data here on completion */
  webhookUrl: 'https://hook.us1.make.com/rhrpo9fa204sgxarna77uzefe093vov4',

  /** WhatsApp number (international format, digits only) */
  whatsappNumber: '5511999999999',

  /** WhatsApp pre-filled message */
  whatsappMessage: 'Olá! Fiz a anamnese da imersão e quero atendimento prioritário.',

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
  guruParams: ['c_email', 'c_name', 'c_phone', 'c_product', 'c_tid'] as const,
} as const
