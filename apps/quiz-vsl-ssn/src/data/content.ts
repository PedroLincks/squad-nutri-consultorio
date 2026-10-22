/**
 * Textos do funil — edite aqui.
 * Trechos entre ** ** aparecem em destaque (vermelho).
 */
export const capa = {
  tag: 'EXCLUSIVO PARA NUTRICIONISTAS',
  headline:
    '**AULA GRATUITA:** Como captar pacientes no Instagram usando um funil simples de 3 etapas nos stories, mesmo que você tenha um perfil com poucos seguidores',
  /** Caminho da imagem em /public. Vazio = placeholder. */
  imagem: '/capa/capa.webp',
  botao: 'SIM! QUERO ASSISTIR AGORA',
}

/**
 * Faixa acima da pergunta 1 (desde 22/10/2026 o funil abre direto nas perguntas, sem a capa).
 * {n} vira o número de perguntas do quiz.
 */
export const abertura = {
  /** Trechos entre ** ** aparecem em vermelho */
  headline:
    '**AULA GRATUITA:** Como captar pacientes no Instagram usando um funil simples de 3 etapas nos stories, mesmo que você tenha um perfil pequeno',
  cta: 'Responda às {n} perguntas abaixo para assistir 👇',
}

export const loading = {
  titulo: 'Um momento… estamos preparando a sua aula',
  /** Duração total do carregamento (ms) */
  duracaoMs: 5000,
  /** Frases que se alternam embaixo do círculo, em ordem */
  status: ['Analisando suas respostas…', 'Preparando a aula…', 'Liberando o seu acesso…'],
}

export const vsl = {
  /** A headline da VSL fica dentro do próprio player (configurada no painel do vTurb) */
  /** Player vTurb da VSL do SSN */
  vturb: {
    playerId: '6acd13e92c9f70133a450b52',
    scriptUrl:
      'https://scripts.converteai.net/de9f0fff-7d49-41c3-9231-9f795c12e369/players/6acd13e92c9f70133a450b52/v4/player.js',
  },
}
