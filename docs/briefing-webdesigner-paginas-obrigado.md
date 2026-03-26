# BRIEFING WEBDESIGNER — Páginas de Obrigado (Funil Pós-Compra)

**Projeto:** Nutri de Consultório
**Elaborado por:** Jack (Estrategista) + Uma (UX Design)
**Data:** 25/03/2026
**Status:** Pronto para execução

---

## 1. VISÃO GERAL

Criar 3 páginas de obrigado para o funil pós-compra da Nutri de Consultório. O lead compra um produto front-end (Webnutri, GCN ou Dieta Ágil) e cai nesse funil de 3 páginas que qualifica e agenda uma call de diagnóstico (Anamnese do Consultório).

**Referência de estrutura:** [Full Sales System — Diagnóstico Comercial](https://diagnostico-comercial-theta.vercel.app/) (ver screenshots anexos ou acessar diretamente)

**Identidade visual:** [NC Design System](https://docs-lac-kappa.vercel.app/design-system/)

**Plataforma:** Elementor (WordPress) — as páginas serão montadas no Elementor. O quiz (página 1) será embedado via iframe/HTML.

---

## 2. REFERÊNCIA VISUAL (Full Sales System)

A referência usa um layout escuro, limpo e focado em conversão. A adaptação para a NC deve manter essa mesma energia, porém com as cores e tipografia da marca.

### O que copiar da referência:
- Layout single-column centralizado (max-width ~600-700px)
- Background escuro com gradiente sutil
- Faixa de progresso no topo (PASSO X DE 4) com dots conectados
- Cards com efeito glassmorphism (vidro fosco)
- Hierarquia clara: headline grande → subtítulo → conteúdo → CTA
- Botão flutuante de WhatsApp no canto inferior direito
- Espaçamento generoso entre seções
- CTAs repetidos estrategicamente ao longo da página

### O que NÃO copiar:
- Cores vermelhas da FSS (substituir pela paleta NC)
- Tipografia da FSS (usar tipografia NC)

---

## 3. DESIGN SYSTEM NC — Especificações para o Webdesigner

### 3.1 Cores

| Elemento | Cor | HEX |
|----------|-----|-----|
| Background principal | Navy 950 | `#0a1233` |
| Background gradiente | Navy 950 → Navy 900 → Navy 800 | `#0a1233` → `#101c3f` → `#152952` |
| Cor de destaque primária | Gold 300 | `#c9a96e` |
| Cor de destaque secundária | Copper | `#c8874a` |
| Headlines | Gold 300 | `#c9a96e` |
| Texto principal | Branco | `#ffffff` (opacity 90%) |
| Texto secundário | Branco | `#ffffff` (opacity 50-60%) |
| Bordas de cards | Gold sutil | `rgba(201,169,110,0.3)` |
| Botão CTA (fundo) | Gradiente Gold | `linear-gradient(135deg, #c9a96e, #a07a35, #c9a96e)` |
| Botão CTA (texto) | Navy 950 | `#0a1233` |
| Botão CTA (hover) | Gold mais brilhante | brightness 110% |
| Checkmarks (✔️) | Gold 300 | `#c9a96e` |
| Faixa de progresso (ativo) | Copper | `#c8874a` com glow |
| Faixa de progresso (completo) | Gold 300 | `#c9a96e` |
| Faixa de progresso (pendente) | Navy 800 | `#152952` |
| WhatsApp button | Verde WhatsApp | `#25D366` |

### 3.2 Tipografia

| Elemento | Fonte | Peso | Tamanho |
|----------|-------|------|---------|
| Headline principal (H1) | Einer Grotesk | 700 (Bold) | 36-48px (mobile: 28-36px) |
| Subtítulos (H2) | Einer Grotesk | 700 | 24-30px (mobile: 20-24px) |
| Títulos de seção (H3) | Einer Grotesk | 700 | 20-24px (mobile: 18-20px) |
| Texto de corpo | Einer Grotesk | 400 | 16-18px (mobile: 14-16px) |
| Texto auxiliar | Einer Grotesk | 300 (Light) | 14px |
| Botão CTA | Einer Grotesk | 700 | 16-18px |
| Badge/faixa de progresso | Einer Grotesk | 450 | 12-14px |

> **IMPORTANTE:** NÃO usar fontes serifadas. A Parisian (fonte display da marca) pode ser usada apenas no logo se necessário, mas NÃO em headlines ou corpo de texto das páginas.

### 3.3 Espaçamentos

| Contexto | Espaçamento |
|----------|-------------|
| Padding do container principal | 48px lateral desktop / 24px mobile |
| Entre seções | 64-80px |
| Entre headline e subtítulo | 16-24px |
| Entre subtítulo e conteúdo | 24-32px |
| Entre itens de benefício | 24px |
| Padding interno de cards | 24-32px |
| Padding de botão CTA | 16px vertical, 32px horizontal |

### 3.4 Componentes

#### Cards (Glassmorphism)
```
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(20px)
border: 1px solid rgba(201, 169, 110, 0.2)
border-radius: 16px
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
padding: 24-32px
```

#### Botão CTA Principal
```
background: linear-gradient(135deg, #c9a96e, #a07a35, #c9a96e)
color: #0a1233
font-weight: 700
padding: 16px 32px
border-radius: 12px
width: 100%
font-size: 16-18px
hover: brightness(1.1) + shadow gold
transition: 250ms ease
```

#### Botão WhatsApp (Flutuante)
```
position: fixed
bottom: 24px
right: 24px
background: #25D366
border-radius: 50px (pill)
padding: 12px 20px
color: white
z-index: 1000
box-shadow: 0 4px 12px rgba(0,0,0,0.3)
```

#### Faixa de Progresso (Topo)
```
- Dots de 36px conectados por linhas
- Completo: fundo gold #c9a96e + glow dourado
- Ativo: fundo copper #c8874a + glow copper
- Pendente: fundo navy #1e2a4a + borda white/10
- Linhas entre dots seguem a mesma lógica de cor
- Checkmark SVG dentro dos dots completos
```

#### Seção de Benefícios (Checkmarks)
```
- Ícone ✔️ em gold #c9a96e
- Título do benefício em branco, bold
- Descrição em branco 60% opacity
- Separação de 24px entre itens
```

### 3.5 Sombras e Efeitos

| Efeito | Valor |
|--------|-------|
| Shadow padrão em cards | `0 8px 32px rgba(0,0,0,0.4)` |
| Shadow gold (hover/destaque) | `0 4px 24px rgba(201,169,110,0.2)` |
| Glow nos dots ativos | `0 0 16px rgba(200,135,74,0.6)` |
| Glow nos dots completos | `0 0 12px rgba(201,169,110,0.5)` |

---

## 4. ESTRUTURA DAS PÁGINAS (Wireframe em Texto)

### PÁGINA 1 — Diagnóstico do Consultório
**Objetivo estratégico:** Qualificar o lead com 6 perguntas rápidas antes de oferecer o agendamento.

```
┌─────────────────────────────────────────┐
│ [FAIXA TOPO] PASSO 2 DE 4              │
│ ● ─── ● ─── ○ ─── ○                    │
│      (gold) (copper) (navy) (navy)      │
├─────────────────────────────────────────┤
│                                         │
│  Parabéns por ter adquirido o           │
│  {NOME_PRODUTO}                         │
│  (headline gold, grande)                │
│                                         │
│  Acabamos de enviar o acesso do         │
│  {NOME_PRODUTO} no seu E-mail.          │
│  (texto branco 90%)                     │
│                                         │
│  Mas antes de acessar o seu produto,    │
│  identifique o que está travando o      │
│  faturamento do seu consultório         │
│  através do teste abaixo:              │
│  (texto branco, bold nas palavras-chave)│
│                                         │
│  Diagnóstico completo em 30 segundos…   │
│  (texto auxiliar, branco 50%)           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     [QUIZ EMBED - iframe]           │ │
│ │     React app do quiz               │ │
│ │     (já desenvolvido)               │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ @nutrideconsultorio | Todos os direitos │
│ Termos de Uso | Política de Privacidade │
└─────────────────────────────────────────┘

                        [WPP] ← flutuante canto inferior direito
                        "Quero pular a fila"
```

**Notas para o webdesigner:**
- O quiz é uma aplicação React separada, será embedada via iframe
- A página em si é simples — hero + embed + footer
- O foco visual deve estar no quiz, sem distrações
- Background: gradiente navy escuro, sem imagens

---

### PÁGINA 2 — Agendamento
**Objetivo estratégico:** Esta é a página mais importante do funil. O lead precisa agendar a call. Cada seção reforça a decisão. CTAs repetidos para capturar em diferentes momentos de decisão.

```
┌─────────────────────────────────────────┐
│ [FAIXA TOPO] PASSO 3 DE 4              │
│ ● ─── ● ─── ● ─── ○                    │
│     (gold) (gold) (copper) (navy)       │
├─────────────────────────────────────────┤
│                                         │
│  Parabéns! Você está quase lá!          │
│  (headline gold, grande)                │
│                                         │
├── SEÇÃO 1: HEADLINE + AGENDAMENTO ──────┤
│                                         │
│  Você quer receber o diagnóstico        │
│  completo do seu consultório com um     │
│  plano personalizado para aumentar o    │
│  seu faturamento nos próximos 30 dias?  │
│  (texto branco, 20-24px, destaque)      │
│                                         │
│  Agende um horário abaixo para realizar │
│  o seu plano personalizado com uma      │
│  consultora do nosso time:              │
│  (texto branco 70%)                     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     [CALENDÁRIO EMBED]              │ │
│ │     (Calendly ou similar)           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     [VÍDEO - Letícia]               │ │
│ │     (16:9, border-radius 16px)      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│  [ ★ QUERO AGENDAR AGORA ]             │
│  (botão CTA gold, full-width)          │
│                                         │
│  ⚠️ Atenção! Em breve nosso time       │
│  entrará em contato pelo telefone       │
│  cadastrado para confirmar presença.    │
│  (callout box, borda gold sutil)        │
│                                         │
├── SEÇÃO 2: BENEFÍCIOS ──────────────────┤
│                                         │
│  O que esse diagnóstico fornece?        │
│  (H2, gold)                             │
│                                         │
│  ✔️ Anamnese do consultório             │
│  A gente analisa como está o seu        │
│  negócio hoje...                        │
│                                         │
│  ✔️ Direcionamento prático              │
│  Nós vamos olhar para a sua realidade...│
│                                         │
│  ✔️ Previsibilidade                     │
│  Saber exatamente quanto vai entrar...  │
│                                         │
│  ✔️ Faturamento maior                   │
│  Estruturar uma oferta de               │
│  acompanhamento...                      │
│                                         │
│  ✔️ Parar de viver na consulta avulsa   │
│  Sair do modelo de "consulta padrão"... │
│                                         │
│  ✔️ Pacientes que ficam                 │
│  Um processo de atendimento             │
│  estruturado...                         │
│                                         │
│  [ ★ QUERO AGENDAR AGORA ]             │
│                                         │
├── SEÇÃO 3: PROVA SOCIAL ────────────────┤
│                                         │
│  Veja o que as nutricionistas de        │
│  diferentes nichos dizem sobre nós      │
│  (H2, gold)                             │
│                                         │
│  [CARROSSEL DE DEPOIMENTOS]             │
│  (3+ depoimentos com foto, nome,       │
│   especialidade, texto)                 │
│                                         │
│  [ ★ QUERO AGENDAR AGORA ]             │
│                                         │
├── SEÇÃO 4: SOBRE ───────────────────────┤
│                                         │
│  Sobre a Nutri de Consultório           │
│  (H2, gold)                             │
│                                         │
│  [FOTO da Letícia e Bárbara]            │
│                                         │
│  A Nutri de Consultório é a maior       │
│  escola de educação e negócios para     │
│  nutricionistas do Brasil...            │
│                                         │
│  Já são mais de 15 mil nutricionistas   │
│  atendidas e centenas de consultórios   │
│  faturando mais de R$10k/mês...         │
│                                         │
│  [ ★ QUERO AGENDAR AGORA ]             │
│                                         │
├─────────────────────────────────────────┤
│ @nutrideconsultorio | Todos os direitos │
│ Termos de Uso | Política de Privacidade │
└─────────────────────────────────────────┘
```

**Notas estratégicas para o webdesigner:**
- **4 CTAs na página** — cada um após uma seção que reforça a decisão. O lead pode converter em qualquer ponto.
- **Calendário acima do vídeo** — a ação principal vem primeiro. O vídeo complementa para quem precisa de mais convencimento.
- **Benefícios em lista vertical** — cada item com ícone gold ✔️ + título bold + descrição. Não usar grid 2x3, manter lista vertical para leitura linear no mobile.
- **Carrossel de depoimentos** — prints de WhatsApp ou depoimentos com foto + nome + nicho da nutri. Formato de cards com borda gold sutil.
- **Seção Sobre** — incluir foto das fundadoras. Reforça autoridade.
- **Aviso de confirmação** — usar um callout box com borda gold sutil e fundo rgba(201,169,110,0.08). Não pode parecer um erro, tem que parecer informação importante.

---

### PÁGINA 3 — Confirmação
**Objetivo estratégico:** Confirmar o agendamento e direcionar para o WhatsApp. Página curta, celebratória.

```
┌─────────────────────────────────────────┐
│ [FAIXA TOPO] PASSO 4 DE 4              │
│ ● ─── ● ─── ● ─── ●                    │
│    (gold) (gold) (gold) (copper)        │
├─────────────────────────────────────────┤
│                                         │
│  Parabéns! Pré-agendamento confirmado!  │
│  (headline gold, grande)                │
│                                         │
│  Em breve nosso time entrará em contato │
│  para confirmar o horário na reunião de │
│  diagnóstico do seu consultório.        │
│  (texto branco 90%)                     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     [VÍDEO - Letícia]               │ │
│ │     (agradecimento/boas-vindas)     │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ @nutrideconsultorio | Todos os direitos │
│ Termos de Uso | Política de Privacidade │
└─────────────────────────────────────────┘
```

**Notas para o webdesigner:**
- Página mais simples do funil — não precisa convencer mais ninguém
- Foco na celebração (headline comemorativa) + próximo passo claro
- Vídeo da Letícia é opcional mas recomendado para gerar conexão

---

## 5. RESPONSIVIDADE

| Breakpoint | Comportamento |
|------------|---------------|
| Desktop (≥1367px) | Container max 700px centralizado, espaçamento generoso |
| Tablet (≤1024px) | Container 90% width, reduzir espaçamentos em 20% |
| Mobile (≤767px) | Container 100% width com padding 24px, headlines reduzem 1 nível, botões full-width, carrossel swipeable |

**Mobile-first:** 80%+ do tráfego vem de mobile (Instagram/Meta Ads). O design mobile é prioridade absoluta.

---

## 6. ASSETS NECESSÁRIOS

- [ ] Foto da Letícia e Bárbara (seção Sobre — página 2)
- [ ] 3+ depoimentos reais com foto, nome e especialidade (carrossel — página 2)
- [ ] Vídeo da Letícia para página 2 (explicando o diagnóstico)
- [ ] Vídeo da Letícia para página 3 (agradecimento — opcional)
- [ ] Logo Nutri de Consultório (formato SVG se possível)
- [ ] Ícone WhatsApp (SVG)
- [ ] Link do calendário de agendamento (Calendly ou similar)
- [ ] URL do quiz React para embed (já desenvolvido, será hospedado no Vercel)

---

## 7. ENTREGÁVEIS ESPERADOS

1. **3 páginas no Elementor** seguindo este briefing
2. **Versão mobile** como prioridade
3. **Embed do quiz** (iframe) na página 1
4. **Embed do calendário** na página 2
5. **Botão flutuante WhatsApp** nas páginas 1 e 2
6. **Carrossel de depoimentos** funcional na página 2

---

## 8. REFERÊNCIAS

| Referência | Link | O que observar |
|------------|------|----------------|
| FSS Diagnóstico | https://diagnostico-comercial-theta.vercel.app/ | Layout, progresso, estrutura |
| NC Design System | https://docs-lac-kappa.vercel.app/design-system/ | Cores, tipografia, componentes |
| Copy aprovada | Google Docs (link com Pedro) | Textos finais das 3 páginas |
