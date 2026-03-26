# GUIA DE IMPLEMENTACAO — LP GCN (Elementor)

**Campanha:** Marco Nutri de Consultorio 2026
**Pagina:** guiadecondutasnutricionais.com.br
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
3. Dentro da secao, adicionar widget **Heading** + widget **Button** lado a lado (ou usar Inner Section com 2 colunas: 80% texto / 20% botao)

### Configuracao da Secao

| Propriedade | Valor |
|---|---|
| **CSS Class** | `cashback-campaign` |
| **Background** | Cor solida: `#F5A623` (dourado/amarelo) ou `#2ECC71` (verde) — testar qual contrasta melhor com o hero atual |
| **Padding** | 12px top / 12px bottom |
| **Position** | Fixed (sticky) — ou se o tema nao suportar bem, deixar como secao normal no topo |
| **Z-index** | 9999 |

### Texto (widget Heading)

```
DE 15 A 31/03 — GCN com 100% de Cashback. Voce compra e recebe R$147 de volta.
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H6 ou Paragraph |
| **Cor do texto** | `#FFFFFF` (branco) ou `#1A1A1A` (preto) — depende do fundo escolhido |
| **Tamanho** | 14-16px desktop / 12-13px mobile |
| **Peso** | Bold (700) |
| **Alinhamento** | Centro |

### Botao (widget Button)

| Propriedade | Valor |
|---|---|
| **Texto** | `QUERO SABER MAIS ↓` |
| **Link** | Ancora: `#oferta-cashback` (aponta para a Alteracao 2) |
| **Cor do botao** | `#1A1A1A` (preto) se fundo dourado / `#FFFFFF` (branco) se fundo verde |
| **Cor do texto** | Contraste com o botao |
| **Border radius** | 25px (pill shape) |
| **Tamanho** | Small |

### Responsivo (Mobile)

- Empilhar texto + botao verticalmente
- Reduzir padding para 8px top/bottom
- Texto 12px, botao centralizado abaixo do texto

---

## ALTERACAO 2 — BLOCO DE OFERTA CASHBACK (Entre Hero e Proposta de Valor)

**Onde:** ENTRE a Secao 01 (Hero) e a Secao 02 (Proposta de valor). Inserir como nova secao.

### No Elementor

1. Criar nova **Secao** entre Hero e Proposta de Valor
2. Layout: **1 coluna**, largura Boxed (max 800px para manter leitura confortavel)
3. Adicionar **CSS ID**: `oferta-cashback` (ancora da sticky bar)

### Configuracao da Secao

| Propriedade | Valor |
|---|---|
| **CSS Class** | `cashback-campaign` |
| **CSS ID** | `oferta-cashback` |
| **Background** | Gradiente suave (#F8F9FA para #FFFFFF) ou fundo branco com borda lateral colorida |
| **Padding** | 60px top / 60px bottom |
| **Margin top** | 0 (cola no hero) |

### Estrutura de widgets (de cima para baixo)

#### Widget 1 — Badge/selo (widget Image ou Icon Box)

- Criar imagem de badge "100% CASHBACK" no Canva ou usar widget **Icon Box**
- Cores do badge: fundo `#F5A623` (dourado), texto branco, bold
- Tamanho: ~120px largura
- Alinhamento: centro

#### Widget 2 — Titulo (widget Heading)

```
De 15 a 31/03, o GCN ta com 100% de cashback
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | H2 |
| **Tamanho** | 32-36px desktop / 24-28px mobile |
| **Peso** | Bold (700) |
| **Cor** | `#1A1A1A` (preto) |
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
| **Cor** | `#333333` |
| **Alinhamento** | Centro |
| **Margin bottom** | 20px |

#### Widget 4 — Os 3 passos (widget Icon List ou 3x Icon Box)

**Opcao A — Icon List (mais simples):**

Usar widget **Icon List** com 3 itens:

| # | Icone | Texto |
|---|---|---|
| 1 | 🛒 (ou fa-shopping-cart) | **Passo 1:** Compre o GCN normalmente pelo site (R$147) |
| 2 | 📱 (ou fa-mobile-alt) | **Passo 2:** Cadastre seu CPF |
| 3 | 💰 (ou fa-money-bill-wave) | **Passo 3:** Receba R$147 de volta na hora para gastar em mais de 2.000 lojas no Brasil |

| Propriedade | Valor |
|---|---|
| **Tamanho do icone** | 24px |
| **Cor do icone** | `#F5A623` (dourado) |
| **Tamanho do texto** | 16-18px |
| **Espacamento entre itens** | 15px |

**Opcao B — 3 colunas com Icon Box (mais visual):**

Inner Section com 3 colunas iguais (33% cada). Em cada coluna, widget **Icon Box**:

| Coluna | Numero | Icone | Titulo | Texto |
|---|---|---|---|---|
| 1 | 1 | fa-shopping-cart | Compre normal | Compre o GCN normalmente pelo site (R$147) |
| 2 | 2 | fa-mobile-alt | Baixe o app | Cadastre seu CPF |
| 3 | 3 | fa-money-bill-wave | Receba de volta | Receba R$147 de volta na hora para gastar em mais de 2.000 lojas |

- Em mobile: empilhar verticalmente

#### Widget 5 — Texto de reforco (widget Text Editor)

```
Simples assim. Voce fica com o GCN e recebe seu dinheiro de volta.

Oferta valida de 15 a 31 de marco.
```

| Propriedade | Valor |
|---|---|
| **Tamanho** | 16-18px |
| **Cor** | `#555555` |
| **Alinhamento** | Centro |
| **Primeira linha** | Bold |
| **Segunda linha** | Bold, cor `#E74C3C` (vermelho — urgencia) |

#### Widget 6 — CTA (widget Button)

```
QUERO MEU GCN COM CASHBACK
```

| Propriedade | Valor |
|---|---|
| **Link** | Ancora para `#checkout` ou link direto do checkout |
| **Cor do botao** | `#2ECC71` (verde) ou a cor primaria do CTA atual da pagina (manter consistencia) |
| **Cor do texto** | `#FFFFFF` |
| **Tamanho** | Large |
| **Largura** | Auto ou 60% da secao |
| **Border radius** | 8px |
| **Peso do texto** | Bold (700) |
| **Tamanho do texto** | 18-20px |
| **Padding** | 18px top/bottom, 40px left/right |
| **Hover** | Escurecer 10% a cor de fundo |

---

## ALTERACAO 3 — BADGE DE CASHBACK NA SECAO DE PRECO (Secao 08)

**Onde:** Secao 08 (Precificacao) — onde mostra "12x R$15,90 ou R$147 a vista"

### No Elementor

Adicionar 2 widgets **acima** ou **ao lado** do preco existente. NAO remover nada — apenas adicionar.

#### Widget 1 — Badge (widget Heading ou Image)

```
100% CASHBACK — Receba R$147 de volta
```

| Propriedade | Valor |
|---|---|
| **Tag HTML** | Span/Div (usar Text Editor) ou Heading H5 |
| **Background** | `#F5A623` (dourado) — inline |
| **Cor do texto** | `#FFFFFF` |
| **Padding** | 8px 20px |
| **Border radius** | 20px (pill) |
| **Tamanho** | 14-16px |
| **Peso** | Bold |
| **Alinhamento** | Centro |
| **CSS Class** | `cashback-campaign` |

#### Widget 2 — Linha explicativa (widget Text Editor)

```
Voce paga R$147 e recebe R$147 de volta pelo app de cashback
```

| Propriedade | Valor |
|---|---|
| **Tamanho** | 14-16px |
| **Cor** | `#555555` |
| **Alinhamento** | Centro |
| **Margin top** | 10px |
| **CSS Class** | `cashback-campaign` |

#### Widget 3 — Data limite (widget Text Editor)

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

## ALTERACAO 4 — FAQ CASHBACK (Secao 11)

**Onde:** Secao 11 (FAQ) — inserir no INICIO do accordion, ANTES das perguntas existentes.

### No Elementor

Localizar o widget **Accordion** ou **Toggle** existente na secao de FAQ. Adicionar 5 novos itens NO INICIO (antes dos existentes).

> **Dica Elementor:** Clicar no accordion, nos itens existentes usar "drag" para mover para baixo, ou criar os novos itens e arrastar para o topo.

### Novos itens do FAQ

**Item 1:**

| Campo | Conteudo |
|---|---|
| **Titulo** | O que e o cashback? |
| **Conteudo** | Voce compra o GCN pelo preco normal (R$147) e recebe o valor integral de volta pelo app Vale Bonus para gastar em mais de 2.000 lojas parceiras no Brasil. E como se voce levasse o GCN de graca. |

**Item 2:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Como recebo o cashback? |
| **Conteudo** | Apos a compra, baixe o app Vale Bonus (disponivel na App Store e Google Play), faca seu cadastro gratuito e o valor de R$147 cai na hora. |

**Item 3:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Onde posso usar o cashback? |
| **Conteudo** | Em mais de 2.000 lojas parceiras no Brasil pelo app Vale Bonus. Voce pode usar em compras do dia a dia. |

**Item 4:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Ate quando vale o cashback? |
| **Conteudo** | De 15 a 31 de marco de 2026. Apos essa data, o GCN volta ao valor normal sem cashback. |

**Item 5:**

| Campo | Conteudo |
|---|---|
| **Titulo** | Preciso fazer alguma coisa alem de comprar? |
| **Conteudo** | So baixar o app Vale Bonus e se cadastrar. O cashback cai automaticamente. |

### CSS Class

Adicionar `cashback-campaign` na secao ou nos itens individuais para facilitar remocao.

---

## ALTERACAO 5 — CTA FINAL COM BADGE (Secao 12)

**Onde:** Secao 12 (CTA final) — mesma logica da Alteracao 3.

### No Elementor

Replicar os mesmos 3 widgets da Alteracao 3 (badge + linha explicativa + data limite) nesta secao, junto a repeticao do preco.

- Mesmos textos
- Mesmas specs visuais
- Mesma classe CSS `cashback-campaign`

---

## CSS CUSTOMIZADO (adicionar no Elementor > Custom CSS ou no Customizer do tema)

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

/* Urgencia — data limite */
.cashback-deadline {
  color: #E74C3C;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .cashback-campaign .elementor-heading-title {
    font-size: 85% !important;
  }
}
```

---

## CHECKLIST DE IMPLEMENTACAO — GCN

- [ ] Sticky bar criada no topo com texto e botao
- [ ] Bloco de oferta cashback inserido entre Hero e Proposta de Valor
- [ ] Ancora `#oferta-cashback` configurada
- [ ] Badge de cashback adicionado na Secao de Preco (Secao 08)
- [ ] 5 perguntas de FAQ adicionadas no inicio do accordion
- [ ] Badge replicado no CTA final (Secao 12)
- [ ] CSS customizado adicionado
- [ ] Classe `cashback-campaign` em todos os elementos novos
- [ ] Testado em desktop
- [ ] Testado em mobile
- [ ] Links de CTA apontando para checkout correto
- [ ] Revisao visual final

---

*Guia criado por Jack (Estrategista) | Squad Nutri de Consultorio*
*Data: 15/03/2026*
