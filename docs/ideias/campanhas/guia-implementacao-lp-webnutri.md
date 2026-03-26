# GUIA DE IMPLEMENTACAO — LP WEBNUTRI (Elementor)

**Campanha:** Marco Nutri de Consultorio 2026
**Pagina:** webnutri.com.br
**Deadline:** 16/03/2026
**Remocao:** 01/04/2026
**Criado por:** Jack (Estrategista)

---

> **REGRA GERAL:** Todos os elementos abaixo sao TEMPORARIOS. Adicionar a classe CSS `cashback-campaign` em cada widget/secao criada para facilitar a localizacao e remocao em 01/04.

---

## ALTERACAO 1 — STICKY BAR (Topo da pagina)

**Onde:** ACIMA do Hero (Secao 01). Primeira coisa que o lead ve.

### No Elementor

1. Criar nova **Secao** no topo absoluto da pagina (arrastar para cima do Hero)
2. Layout: **1 coluna**, largura total (Full Width)
3. Dentro da secao, widget **Heading** + widget **Button** lado a lado

### Configuracao da Secao

| Propriedade | Valor |
|---|---|
| **CSS Class** | `cashback-campaign sticky-bar` |
| **Background** | Cor solida: `#F5A623` (dourado) ou `#2ECC71` (verde) — USAR A MESMA COR da LP do GCN para manter identidade da campanha |
| **Padding** | 12px top / 12px bottom |
| **Position** | Fixed (sticky) ou secao normal no topo |
| **Z-index** | 9999 |

### Texto (widget Heading)

```
DE 15 A 31/03 — Webnutri por R$47 (cashback de R$250).
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H6 ou Paragraph |
| **Cor do texto** | `#FFFFFF` ou `#1A1A1A` — depende do fundo |
| **Tamanho** | 14-16px desktop / 12-13px mobile |
| **Peso** | Bold (700) |
| **Alinhamento** | Centro |

### Botao (widget Button)

| Propriedade | Valor |
|---|---|
| **Texto** | `QUERO SABER MAIS ↓` |
| **Link** | Ancora: `#oferta-cashback` |
| **Cor do botao** | `#1A1A1A` ou `#FFFFFF` — contraste com fundo |
| **Border radius** | 25px (pill) |
| **Tamanho** | Small |

### Responsivo (Mobile)

- Empilhar texto + botao verticalmente
- Padding 8px top/bottom
- Texto 12px

---

## ALTERACAO 2 — BLOCO DE OFERTA CASHBACK (Antes da Secao "Como funciona o P.A.V")

**Onde:** ANTES da Secao 02 (Como funciona o P.A.V). O lead ve o hero, rola, e a primeira coisa e a oferta.

### No Elementor

1. Criar nova **Secao** entre Hero e "Como funciona o P.A.V"
2. Layout: **1 coluna**, largura Boxed (max 800px)
3. Adicionar **CSS ID**: `oferta-cashback`

### Configuracao da Secao

| Propriedade | Valor |
|---|---|
| **CSS Class** | `cashback-campaign` |
| **CSS ID** | `oferta-cashback` |
| **Background** | Gradiente suave (#F8F9FA para #FFFFFF) ou fundo branco com borda lateral |
| **Padding** | 60px top / 60px bottom |

### Estrutura de widgets (de cima para baixo)

#### Widget 1 — Badge (widget Image ou Icon Box)

- Badge "85% CASHBACK" ou "INVESTIMENTO REAL: R$47/ANO"
- Cores: fundo `#F5A623` (dourado), texto branco, bold
- Tamanho: ~150px largura
- Alinhamento: centro

#### Widget 2 — Titulo (widget Heading)

```
De 15 a 31/03, Webnutri por R$47
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H2 |
| **Tamanho** | 32-36px desktop / 24-28px mobile |
| **Peso** | Bold (700) |
| **Cor** | `#1A1A1A` |
| **Alinhamento** | Centro |
| **Margin bottom** | 30px |

#### Widget 3 — Subtitulo (widget Heading)

```
Como funciona:
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H4 |
| **Tamanho** | 18-20px |
| **Peso** | Semi-bold (600) |
| **Alinhamento** | Centro |

#### Widget 4 — Os 3 passos (widget Icon List ou 3x Icon Box)

**Opcao A — Icon List:**

| # | Icone | Texto |
|---|---|---|
| 1 | 🛒 (ou fa-shopping-cart) | **Passo 1:** Assine a Webnutri normalmente pelo site (R$297/ano) |
| 2 | 📱 (ou fa-mobile-alt) | **Passo 2:** Cadastre seu CPF |
| 3 | 💰 (ou fa-money-bill-wave) | **Passo 3:** Receba R$250 de volta na hora para gastar em mais de 2.000 lojas no Brasil |

**Opcao B — 3 colunas Icon Box:**

| Coluna | Icone | Titulo | Texto |
|---|---|---|---|
| 1 | fa-shopping-cart | Assine normal | Assine a Webnutri normalmente pelo site (R$297/ano) |
| 2 | fa-mobile-alt | Baixe o app | Cadastre seu CPF |
| 3 | fa-money-bill-wave | Receba de volta | Receba R$250 de volta na hora para gastar em mais de 2.000 lojas |

#### Widget 5 — Texto de reforco + Ancora de preco (widget Text Editor)

```html
Voce paga R$297 e recebe R$250 de volta.
<strong style="font-size: 24px; color: #1A1A1A;">Investimento real: R$47 por 1 ano inteiro de acesso.</strong>

<strong style="color: #E74C3C;">Oferta valida de 15 a 31 de marco.</strong>
```

| Propriedade | Valor |
|---|---|
| **Tamanho base** | 16-18px |
| **Cor base** | `#555555` |
| **Alinhamento** | Centro |
| **Linha "Investimento real"** | 24px, bold, preto — DESTAQUE MAXIMO |
| **Linha "Oferta valida"** | Bold, vermelho `#E74C3C` |

#### Widget 6 — Ancora visual de preco (widget Text Editor)

```html
<span style="text-decoration: line-through; color: #999; font-size: 20px;">R$297</span>
<span style="color: #2ECC71; font-size: 36px; font-weight: 700;"> R$47</span>
<span style="color: #666; font-size: 14px;">/ano com cashback</span>
```

> **IMPORTANTE:** Essa ancora visual (preco riscado vs preco percebido) e um dos elementos de maior impacto na conversao. Dar destaque maximo.

#### Widget 7 — CTA (widget Button)

```
QUERO MINHA WEBNUTRI POR R$47
```

| Propriedade | Valor |
|---|---|
| **Link** | Ancora `#checkout` ou link direto do checkout |
| **Cor do botao** | `#2ECC71` (verde) ou cor primaria de CTA da pagina |
| **Cor do texto** | `#FFFFFF` |
| **Tamanho** | Large |
| **Border radius** | 8px |
| **Peso do texto** | Bold (700) |
| **Tamanho do texto** | 18-20px |
| **Padding** | 18px top/bottom, 40px left/right |

---

## ALTERACAO 3 — REFORCO NO PRICING COMPARATIVO (Secao 13)

**Onde:** Secao 13 (Pricing comparativo) — onde mostra que tudo separado custaria R$1.532 e oferece por R$297.

### No Elementor

Adicionar widget **Text Editor** ou **Heading** ao FINAL da secao existente. NAO remover nada.

### Texto a adicionar

```
De 15 a 31/03, voce ainda recebe R$250 de cashback. Investimento real: R$47.
```

| Propriedade | Valor |
|---|---|
| **Tag** | H3 ou Text Editor com estilo forte |
| **Tamanho** | 22-26px |
| **Peso** | Bold (700) |
| **Cor** | `#2ECC71` (verde) ou cor de destaque da pagina |
| **Alinhamento** | Centro |
| **Margin top** | 20px |
| **CSS Class** | `cashback-campaign` |

> **LOGICA ESTRATEGICA:** Isso cria a **tripla ancora de preco** — R$1.532 → R$297 → R$47. Impacto maximo na percepcao de valor. E o momento de conversao mais poderoso da pagina.

---

## ALTERACAO 4 — BADGE DE CASHBACK NA OFERTA ESPECIAL (Secao 14)

**Onde:** Secao 14 (Oferta especial) — onde mostra "12x R$29,90 ou R$297 a vista"

### No Elementor

Adicionar 4 widgets acima ou ao lado do preco existente. NAO remover nada.

#### Widget 1 — Badge (widget Text Editor com estilo)

```
85% CASHBACK — Receba R$250 de volta
```

| Propriedade | Valor |
|---|---|
| **Background** | `#F5A623` (dourado) — usar CSS inline ou classe |
| **Cor do texto** | `#FFFFFF` |
| **Padding** | 8px 24px |
| **Border radius** | 20px (pill) |
| **Tamanho** | 14-16px |
| **Peso** | Bold |
| **Alinhamento** | Centro |
| **CSS Class** | `cashback-campaign cashback-badge` |

#### Widget 2 — Ancora de preco riscado (widget Text Editor)

```html
<span style="text-decoration: line-through; color: #999; font-size: 18px;">R$297</span>
→ Voce paga R$297, recebe R$250 de cashback
```

| Propriedade | Valor |
|---|---|
| **Tamanho** | 16px |
| **Cor** | `#555555` |
| **Alinhamento** | Centro |
| **CSS Class** | `cashback-campaign` |

#### Widget 3 — Destaque do investimento real (widget Heading)

```
Investimento real: R$47/ano
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H3 |
| **Tamanho** | 28-32px — FONTE GRANDE |
| **Peso** | Bold (700) |
| **Cor** | `#2ECC71` (verde) ou cor contrastante forte |
| **Alinhamento** | Centro |
| **CSS Class** | `cashback-campaign` |

#### Widget 4 — Data limite (widget Text Editor)

```
Cashback valido de 15 a 31 de marco
```

| Propriedade | Valor |
|---|---|
| **Tamanho** | 13px |
| **Cor** | `#E74C3C` (vermelho) |
| **Peso** | Semi-bold |
| **Alinhamento** | Centro |
| **CSS Class** | `cashback-campaign` |

---

## ALTERACAO 5 — FAQ CASHBACK (Secao 17)

**Onde:** Secao 17 (FAQ) — inserir no INICIO do accordion, ANTES das perguntas existentes.

### No Elementor

Localizar o widget **Accordion** ou **Toggle** existente. Adicionar 5 novos itens NO INICIO.

### Novos itens do FAQ

**Item 1:**

| Campo | Conteudo |
|---|---|
| **Titulo** | O que e o cashback? |
| **Conteudo** | Voce assina a Webnutri pelo preco normal (R$297/ano) e recebe R$250 de volta pelo app Vale Bonus para gastar em mais de 2.000 lojas parceiras no Brasil. Seu investimento real fica R$47 pelo ano inteiro. |

**Item 2:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Como recebo o cashback? |
| **Conteudo** | Apos a compra, baixe o app Vale Bonus (disponivel na App Store e Google Play), faca seu cadastro gratuito e o valor de R$250 cai na hora. |

**Item 3:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Onde posso usar o cashback? |
| **Conteudo** | Em mais de 2.000 lojas parceiras no Brasil pelo app Vale Bonus. Voce pode usar em compras do dia a dia. |

**Item 4:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Ate quando vale o cashback? |
| **Conteudo** | De 15 a 31 de marco de 2026. Apos essa data, a Webnutri volta ao valor normal sem cashback. |

**Item 5:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Preciso fazer alguma coisa alem de assinar? |
| **Conteudo** | So baixar o app Vale Bonus e se cadastrar. O cashback cai automaticamente. |

### CSS Class

Adicionar `cashback-campaign` nos itens ou na secao.

---

## ALTERACAO 6 — CTA FINAL COM BADGE (Secao 18)

**Onde:** Secao 18 (CTA final) — mesma logica da Alteracao 4.

### No Elementor

Replicar os mesmos 4 widgets da Alteracao 4 nesta secao:

1. Badge "85% CASHBACK — Receba R$250 de volta"
2. Ancora de preco riscado
3. "Investimento real: R$47/ano" em destaque
4. Data limite

- Mesmos textos, mesmas specs visuais
- Classe CSS `cashback-campaign` em todos

---

## CSS CUSTOMIZADO (adicionar no Elementor > Custom CSS ou Customizer do tema)

```css
/* === CAMPANHA MARCO 2026 — CASHBACK === */
/* Remover TODO este bloco em 01/04/2026 */

/* Sticky bar animation */
.cashback-campaign.sticky-bar {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

/* Badge pill style */
.cashback-badge {
  display: inline-block;
  background: #F5A623;
  color: #FFFFFF;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
}

/* Preco riscado → preco real */
.cashback-price-anchor .price-old {
  text-decoration: line-through;
  color: #999999;
  font-size: 18px;
}

.cashback-price-anchor .price-real {
  color: #2ECC71;
  font-size: 36px;
  font-weight: 700;
}

/* Urgencia — data limite */
.cashback-deadline {
  color: #E74C3C;
  font-weight: 600;
}

/* Tripla ancora visual */
.triple-anchor {
  font-size: 26px;
  font-weight: 700;
  color: #2ECC71;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .cashback-campaign .elementor-heading-title {
    font-size: 85% !important;
  }

  .cashback-price-anchor .price-real {
    font-size: 28px;
  }
}
```

---

## CHECKLIST DE IMPLEMENTACAO — WEBNUTRI

- [ ] Sticky bar criada no topo com texto e botao
- [ ] Bloco de oferta cashback inserido antes de "Como funciona o P.A.V"
- [ ] Ancora `#oferta-cashback` configurada
- [ ] Ancora visual de preco (R$297 riscado → R$47) no bloco de oferta
- [ ] Reforco de cashback adicionado ao final do Pricing Comparativo (Secao 13)
- [ ] Tripla ancora funcionando: R$1.532 → R$297 → R$47
- [ ] Badge de cashback adicionado na Oferta Especial (Secao 14)
- [ ] "Investimento real: R$47/ano" em destaque na Secao 14
- [ ] 5 perguntas de FAQ adicionadas no inicio do accordion
- [ ] Badge replicado no CTA final (Secao 18)
- [ ] CSS customizado adicionado
- [ ] Classe `cashback-campaign` em todos os elementos novos
- [ ] Testado em desktop
- [ ] Testado em mobile
- [ ] Links de CTA apontando para checkout correto
- [ ] Revisao visual final

---

*Guia criado por Jack (Estrategista) | Squad Nutri de Consultorio*
*Data: 15/03/2026*
