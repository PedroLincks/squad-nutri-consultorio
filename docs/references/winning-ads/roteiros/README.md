# Roteiros de vídeos vencedores

A API do Meta entrega o texto e o visual do anúncio, mas **não** a narração falada dos vídeos.
Como os criativos vencedores da Letícia são vídeos narrados (storytelling 1ª pessoa), o Pedro
**fornece o roteiro uma vez** e ele fica salvo aqui para reuso pela Zoe.

## Convenção

- Um arquivo por criativo de vídeo, nomeado pelo **ad id do Meta** (o número após o `|` no `utm_content`):
  `docs/references/winning-ads/roteiros/<ad_id>.md`
  Ex: `120243822994850633.md`
- No topo, deixe o nome do criativo pra facilitar: `# [WN] CRTV01 E ASSIM QUE HK01 ...`
- Cole o roteiro como foi narrado (com marcações de cena se quiser).

## Como o fluxo usa

1. Max identifica um vídeo vencedor → procura o roteiro em `roteiros/<ad_id>.md`.
2. **Se existe:** inclui o roteiro no pacote de produção pra Zoe modelar.
3. **Se não existe:** o pacote traz um aviso claro — *"PENDENTE: roteiro do vídeo [nome | ad_id]"* —
   e o Pedro cola o roteiro (que é salvo aqui). A partir daí, reuso automático.

> Anúncios de imagem/carrossel não precisam disso — o texto e o visual o Max já puxa da API.
