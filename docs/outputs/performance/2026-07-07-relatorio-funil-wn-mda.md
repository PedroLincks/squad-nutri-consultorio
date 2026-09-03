# Relatório de Funil — Webnutri × Dieta Ágil (junho/2026)

> Consolidação parcial do Max antes dos dados finais. Janela: **01–30 jun 2026**.
> Fontes cruzadas: **Meta Ads** (Graph API v21, invest/topo de funil) × **Utmify** (dashboard "Principal", venda atribuída) × **Digital Manager Guru** (venda real, fonte da verdade).
> Recorte: campanhas com tag `[WN]` (Webnutri) e `[MDA]` (Método Dieta Ágil / PDA), conta `168028315098298` (01 - Nutri de Consultório). Read-only — nada alterado no Meta.

---

## 1. Vendas (venda real — Guru, origem FB)

| Produto | Vendas FB | Receita | Investimento (Meta) | ROAS atribuído |
|---|---:|---:|---:|---:|
| **Webnutri** | 44 | R$ 12.249 | R$ 10.860,02 | **1,13x** |
| **Dieta Ágil** | 34 | R$ 7.207 | R$ 11.033,11 | **0,65x** |

- A **Webnutri se paga** no dado atribuído a FB (1,13x).
- A **Dieta Ágil está abaixo de 1x** (0,65x) — problema real de eficiência/oferta.

> **Escopo:** todo o relatório considera **apenas tráfego pago com origem FB** (`utm_source=FB`). Venda comercial, recompra, orgânico e checkout sem tag ficam fora.

---

## 2. Vendas por degrau (backredirect)

Funil: anúncio → pag01 (oferta cheia); sai → pag02 (downsell 1); sai → pag03 (downsell 2). Degrau inferido pela **faixa de valor pago** (o `offer.name` não separa; 12x infla ~1,21x).

### Webnutri — 297 / 247 / 197

| Degrau | Vendas | % | Leitura |
|---|---:|---:|---|
| **R$ 297** (pag01) | 23 | 52% | Oferta cheia domina — 60% da receita |
| R$ 247 (pag02) | 11 | 25% | Downsell 1 recupera |
| R$ 197 (pag03) | 10 | 23% | Downsell 2 recupera |

→ O backredirect **segura ~48%** das vendas (os que iam embora e desceram degrau). Estrutura saudável e funcionando.

### Dieta Ágil — 197 / 147 / 97

| Degrau | Vendas | % | Leitura |
|---|---:|---:|---|
| **R$ 197** (pag01) | ~97% | — | Quase toda a venda na oferta cheia |
| R$ 147 / R$ 97 | 5 no mês (todas as origens) | — | **ZERO via FB** |

🔴 O downsell da Dieta Ágil **não converte via tráfego pago** — os 5 do mês vieram de outras origens. Backredirect possivelmente desligado ou quebrado nesse funil. **Oportunidade parada**: a WN recupera 48% com downsell; a MDA recupera ~0%.

---

## 3. Order bumps (OB) por funil

OB = venda de bump no checkout. Na Guru entra como **transação separada** (`is_order_bump=true`) carregando a UTM do funil — soma faturamento sem inflar o ticket do produto-âncora, e por isso **não aparece na contagem de degraus** (§2, que só olha o produto principal). Recorte: vendas FB, junho.

| Funil | Pedidos principais | OB (vendas) | Receita OB | **Attach rate** |
|---|---:|---:|---:|---:|
| **Dieta Ágil** | 33 (R$ 7.009,88) | **17** | **R$ 830,28** | **48%** (16/33) |
| **Webnutri** | 39 (R$ 10.764,89) | 3 | R$ 175,40 | **8%** (3/39) |

### Dieta Ágil — OB funcionando

| Produto OB | Vendas | Receita | Valores |
|---|---:|---:|---|
| Box de Receitas | 9 | R$ 423,00 | R$ 47,00 (todas) |
| Trilha do Paciente | 8 | R$ 407,28 | R$ 47 / 49,40 / 61,44¹ |
| **Total** | **17** | **R$ 830,28** | — |

- **Attach rate de 48%** — quase metade dos compradores do Dieta Ágil adiciona um bump. Saudável.
- OB adiciona **+11,8%** sobre a receita do âncora → funil MDA fecha em **R$ 7.840,16** e puxa o ROAS de **0,64x → 0,71x**.
- Confirma os "cross-sells" da Utmify (Box + Trilha) como **OB de verdade** — a flag `is_order_bump` bate exato (9 + 8 = 17).

### Webnutri — OB subaproveitado

| Produto OB | Vendas | Receita | Valores |
|---|---:|---:|---|
| Biblioteca de Refeições | 2 | R$ 128,40 | R$ 57 / 71,40¹ |
| Trilha do Paciente | 1 | R$ 47,00 | R$ 47,00 |
| **Total** | **3** | **R$ 175,40** | — |

- 🟡 **Attach rate de só 8%** contra 48% do Dieta Ágil. O funil que mais fatura é o que **menos monetiza no bump** — dinheiro na mesa.

¹ variação de valor = parcelamento 12x inflando o preço.

> **Nota de escopo:** este recorte conta transações com `utm_campaign` contendo a tag limpa (`[WN]`/`[MDA]`). Vendas WN com UTM quebrada (macro `{{campaign.name}}` não renderizada, encoding `5BWN5D`) ficam de fora — por isso o principal WN aqui (39) é um pouco menor que as 44 do §1. Não afeta a leitura do OB.

---

## 4. Connect rate & funil de topo (Meta = Utmify, batem 100%)

> Spend, cliques, LPV e checkout são **idênticos** nas duas plataformas — a Utmify relaya o Meta. Números confiáveis do topo, mas *self-reported pelo pixel*.
> GOTCHA respeitado: só `omni_initiated_checkout` (os 5 action_types de checkout têm valor idêntico; somar triplica).

| Métrica | **Webnutri** | **Dieta Ágil** |
|---|---:|---:|
| Investimento | R$ 10.860,02 | R$ 11.033,11 |
| Impressões | 520.619 | 407.534 |
| Cliques (all) | 5.089 | 4.329 |
| Cliques no link | 3.538 | 3.102 |
| **Page views (LPV)** | 2.557 | 2.262 |
| **Compras iniciadas** (checkout) | 129 | 120 |
| **CONNECT RATE** (LPV / clique-link) | **72,3%** | **72,9%** |
| Page → checkout (checkout / LPV) | 5,0% | 5,3% |
| Vendas reais FB (Guru) | 44 | 34 |
| **CONVERSÃO DO FUNIL** (venda / clique-link) | **1,2%** | **1,1%** |

> **Taxa de conversão de ponta a ponta:** de cada 100 cliques pagos no link, ~1,2 viram venda na WN e ~1,1 na MDA. Sobre o total de cliques (all), fica **0,86% (WN)** e **0,79% (MDA)**.

**Leitura:**
- Connect ~72% nos dois = **piso do saudável** (faixa 70–85%). ~28% do clique pago não vira LPV rastreado (~R$3k/produto/mês).
- ⚠️ Como o connect é self-reported do pixel, parte desses 28% pode ser **subcontagem de pixel** (pixel não dispara em toda página do backredirect), não abandono real. Precisa validar o disparo do pixel antes de culpar a página.
- **LPV → checkout de ~5%** é o degrau mais fraco e é confiável (o checkout iniciado bate nas duas fontes). É aqui que há espaço real de página/oferta.

---

## 5. 🔴 Achado crítico — pixel de compra inflado 3–4×

| Camada de "compra" | WN | MDA |
|---|---:|---:|
| Pixel do Meta (`omni_purchase` = `salesFromFacebook`) | 163 | 133 |
| **Venda real atribuída** (Guru FB / Utmify aprovadas) | 44 | 34 |
| **Fator de inflação do pixel** | **3,8×** | **2,7×** |

- Isso explica a anomalia impossível num funil sadio: **checkout iniciado (129) < compras pixel (163)** na WN.
- O `initiate_checkout` está subcontado **e** o `purchase` está disparando múltiplas vezes (provável: as 3 páginas do backredirect, recompra ou order bump).
- **Consequência:** o algoritmo do Meta está otimizando para **3–4× conversões-fantasma**. Ele acha que a WN converte a 163; converte a 44. Envenena a entrega e o CPA-alvo.

> As campanhas também vendem **order bumps/cross-sell** (Box de Receitas, Trilha do Paciente, Biblioteca) — por isso Utmify "aprovadas" (WN 43 / MDA 50) > venda do produto-âncora puro (WN ~40 / MDA ~33).

---

## 6. CRO / Heatmap — página Webnutri (Clarity + DOM real)

> Fonte: Microsoft Clarity, página `https://webnutri.com.br/v8-ads`, **celular**, últimos 30 dias. **3.055 pageviews**, 5.025 cliques (todo o tráfego, não só FB). Estrutura mapeada abrindo o DOM real (Playwright) — página pura (sem VSL), com o value stack em carrosséis.

Explica o mecanismo por trás do `LPV→checkout de 5%` (§4). Gargalo **duplo**: topo (hero) + oferta trancada atrás de carrosséis.

### Mapa real: conteúdo × profundidade de scroll × atenção

| Scroll | Bloco | Atenção | Chegam |
|---|---|---:|---:|
| 1–3% | **Hero** — headline = *pergunta de problema* "Dificuldade em fidelizar seus pacientes...?" + CTA1 | 10,5% | 39% |
| 10–14% | Como funciona o **P.A.V** (Praticidade / Imersão Visual / Adesão) | | |
| 17–19% | Comparação comum × P.A.V + CTA2 | | |
| 21% | Prova "+10.000 nutricionistas" | | |
| **28%** | Value stack — "Pack Didática Visual" · **carrossel 14 slides** | **22,5% (pico)** | ~30% |
| **32%** | "Kit de adesão e suporte" · **carrossel 18 slides** | | |
| **36%** | "Layouts de entrega premium" · **carrossel 10 slides** | | |
| 41–48% | Formatos + atualizações mensais | | |
| **52%** | Bônus 🎁 "NutriDocs" · **carrossel 12 slides** | | ~22% |
| 56% | Nutrimap | | |
| 63% | **Depoimentos** (elogios dos pacientes) | | ~21% |
| **70–73%** | **Oferta/Preço** (R$1.532 → hoje) | | **~19%** |
| 75% | CTA3 "QUERO ACESSO À WEBNUTRI" | | |
| 80% | "Vamos fazer um acordo?" (garantia) | | ⚠️ queda 80→85%: -32% |
| 83% | Quem somos | | |
| 88–90% | FAQ (acesso / tempo / dúvida / "a garantia é real?") | | ~11% |
| 92–98% | Oferta repetida + CTA final + contato | 16,2% (95%) | 6% |

### Retenção (scroll) — pior que a MDA

- 5%: **38,9%** → 61% saem antes de rolar (MDA 56%) · 50%: 21,2% · 80%: 15,5% · 100%: 3,7%. Só 4 em 10 passam da 1ª tela; ~1 em 27 chega ao fim.

### Toque — 2 em cada 3 cliques são em carrossel

| O que clicam | Cliques | % |
|---|---:|---:|
| Carrosséis (setas + imagem) | 2.669 | **~68%** |
| FAQ | 633 | 16,2% |
| CTA + Checkout | 421 | ~11% |
| WhatsApp | 29 | 0,7% |

### Diagnóstico (ancorado no DOM)

1. **Vazamento nº1 = hero:** 61% saem antes de 5%. O hero abre com **pergunta de problema** ("Dificuldade em fidelizar...?"), não com promessa/prova — não fisga rápido. *(Ressalva: pode haver promessa na imagem do hero, não lida pelo parser de texto.)*
2. **A oferta está trancada em 54 slides de carrossel.** O value stack são **4 carrosséis** (14+18+10+12 slides) entre 28–56%, todos com swipe manual. Por isso 68% dos cliques são em seta — e o pico de atenção (30%) cai nos 2 primeiros. A maioria vê só o 1º slide de cada; o produto não é visto por inteiro.
3. **Payoff enterrado (pior que a MDA):** depoimentos em 63%, preço em **70–73%**, e só **~19%** chegam ao preço.
4. **Página longuíssima** (15.703px) inflada pelos carrosséis.

### Ações de CRO (priorizadas)

| # | Problema (dado) | Ação | Impacto |
|---|---|---|---|
| A | 61% saem antes de 5%; hero é pergunta-problema | **Hero novo**: promessa + prova na 1ª tela, CTA acima da dobra | 🔴 Alto |
| B | Value stack preso em 54 slides de carrossel | **Tirar do swipe**: empilhar/estático ou autoplay; encurtar; mostrar o produto sem depender de seta | 🔴 Alto |
| C | Preço em ~70–73%; só ~19% chegam | **Subir prova + âncora de preço pra antes de 40%** (junto do pico de atenção) | 🔴 Alto |
| D | Queda de 32% entre 80–85% (pós-oferta) | Encurtar cauda; reforçar transição garantia→CTA | 🟡 Médio |
| E | FAQ (88–90%, rodapé) quase só logístico | Adicionar FAQ de objeção e subir | 🟢 Baixo |

---

## 7. CRO / Heatmap — página Dieta Ágil (Clarity + DOM real)

> Fonte: Microsoft Clarity, página `https://nutrideconsultorio.com/mda`, **celular**, últimos 30 dias. **~2.918 pageviews**, 1.393 cliques. Estrutura da página mapeada abrindo o DOM real (Playwright) — **não é VSL, é página pura** (só copy + imagem).

### Mapa real: conteúdo × profundidade de scroll × atenção

| Scroll | Bloco | Atenção | Chegam |
|---|---|---:|---:|
| 0–5% | Hero + CTA1 | 10,5% | 56% |
| 9% | "Não é dieta de gaveta" (quebra de mito) | — | ⚠️ queda 5→10%: **-33%** |
| 13–15% | Os 4 problemas | baixo | |
| 18–31% | Estrutura da consulta 1h30 + CTA2 | | |
| 35–40% | O que recebe (Metodologia + Biblioteca) | subindo | |
| **44–49%** | 🎁 **Bônus grátis** (Templates + Box) | **29,8% (pico)** | ~35% |
| 53% | Prova social "+3.000 nutris" + **depoimentos** | | ~30% |
| 57–58% | Escolha: tradicional vs. ágil | | |
| **64–70%** | 💰 **Oferta/Preço** (R$588→R$197) + CTA3 | | **~27%** |
| 73% | Cashback 100% | | |
| 79% | Garantia | 6,9% | ~19% |
| 84% | Sobre a Leticia | | |
| 89–90% | FAQ (4 perguntas) | | ~11% |
| 96–97% | Repete oferta + CTA final | | 6% |

### Retenção (scroll) — segura melhor que a WN

- 5%: 56,4% (WN 38,9%) · 50%: 30,1% (WN 21,2%) · 100%: 6,4% (WN 3,7%). Hero prende bem.
- Mas **queda de 33% entre 5–10%** (na seção defensiva "não é dieta de gaveta").

### Toque — FAQ + CTA, sem carrossel

| O que clicam | Cliques | % |
|---|---:|---:|
| FAQ (abrir perguntas) | 713 | **52,5%** |
| Botão CTA | 369 | **27,2%** (WN só 11%) |
| Imagens/outros | ~277 | 20% |

As 4 perguntas do FAQ são **todas logísticas** (como recebo acesso / quanto tempo / formas de pagamento / tem suporte) — não são objeção. Os 52% de cliques = intenção checando logística, não "copy não vence objeção".

### Diagnóstico (ancorado no DOM)

1. **Pico de atenção (45%) = seção de BÔNUS grátis**, não o método. O que mais prende é o "de graça".
2. 🔴 **Payoff enterrado:** depoimentos em ~53% e oferta/preço em ~64–70%, mas só **~27% chegam ao preço** e ~30% aos depoimentos. Topo (0–35%) é quase todo agitação de problema.
3. **Depoimentos existem e são fortes** (WhatsApp prints: "não levei trabalho pra casa", "45 min e finalizei") — mas posicionados fundo demais; a maioria não vê.
4. FAQ (89–90%, rodapé) só logístico — objeção real fica sem resposta.

### Ações de CRO — Dieta Ágil

| # | Problema (dado) | Ação | Impacto |
|---|---|---|---|
| A | Depoimentos em ~53%; só ~30% chegam | Subir 1–2 depoimentos pro topo (após hero + no pico de 45%) | 🔴 Alto |
| B | Oferta/preço em ~64–70%; ~27% chegam | Ancorar preço/oferta mais cedo (ou repetir CTA+preço no pico de 45%) | 🔴 Alto |
| C | Queda 33% em 5–10% (seção "mito") | Trocar defesa de mito por prova/demo do método logo após o hero | 🟡 Médio |
| D | FAQ (rodapé) só logístico | Adicionar FAQ de objeção (iniciante? online? preciso saber cálculo?) e subir | 🟡 Médio |
| E | Atenção concentra nos bônus, não no método | Liderar com resultado + prova; bônus como reforço | 🟢 Baixo |

**MDA ≠ WN:** a Webnutri precisa de CRO de **página** (hero + carrossel); a Dieta Ágil precisa de **reordenação** — os ingredientes existem (promessa, prova, oferta, garantia, cashback), mas na ordem errada pra mobile: agitação demais no topo, payoff fundo demais, só ~1/4 chega lá.

---

## 8. Síntese & prioridades

| # | Achado | Prioridade | Ação |
|---|---|---|---|
| 1 | Pixel de purchase inflado 3–4× (163 pixel vs 44 venda FB) | 🔴 Alta | Auditar disparo do pixel nas 3 páginas do backredirect |
| 2 | Hero da WN vaza 61% antes de 5%; abre com pergunta-problema (§6-A) | 🔴 Alta | Hero novo: promessa + prova na 1ª tela, CTA acima da dobra |
| 3 | WN: value stack preso em 54 slides de carrossel; oferta em ~70%, só ~19% chegam (§6-B/C) | 🔴 Alta | Tirar value stack do swipe + subir prova/preço pra antes de 40% |
| 4 | MDA: prova e oferta enterradas (só ~27% chegam ao preço em ~65%) (§7-A/B) | 🔴 Alta | Subir depoimentos + ancorar preço mais cedo (mobile) |
| 5 | OB da WN subaproveitado (attach 8% vs 48% da MDA) | 🟡 Média | Replicar a estrutura de OB do Dieta Ágil no funil Webnutri |
| 6 | Downsell MDA converte ~0% via FB | 🟡 Média | Verificar se backredirect da MDA está ligado/funcional |
| 7 | LPV→checkout de 5% (mecanismo = §6/§7) | 🟡 Média | CTA após o pico de atenção + atalho pro checkout no meio |
| 8 | MDA: FAQ só logístico, no rodapé | 🟡 Média | Adicionar FAQ de objeção e subir |
| 9 | Connect 72% (piso) | 🟢 Baixa | Só após validar pixel — pode ser subcontagem, não abandono |

**Ordem de ataque do Max:** (1) hygiene do pixel **antes** de decisão de escala; (2) CRO por página. **Padrão comum às duas:** o payoff (prova + preço) está enterrado — só ~19% (WN) e ~27% (MDA) chegam ao preço. **Diferença:** a WN tem o agravante do value stack preso em 54 slides de carrossel (§6) e um hero de pergunta-problema; a MDA é mais questão de reordenar (§7). Enquanto o pixel infla 3,8×, qualquer decisão de escala por conversão do pixel é chute com dado corrompido.

---

## 9. Pendente (dados finais)

- [ ] Quebrar o `omni_purchase` por `action_type` e por página do funil (confirmar a hipótese do disparo múltiplo)
- [ ] Foto de julho (01–07) para comparar tendência
- [ ] Cruzar retenção das VSLs (vTurb) com o connect rate — separar "criativo de entrada ruim" de "página lenta"
- [x] ~~Clarity: conteúdo das seções de pico de atenção~~ — resolvido via DOM (WN: carrosséis do value stack em 28–36%; MDA: bônus grátis em 45%)
- [ ] Validar visualmente a promessa do hero da WN (pode estar em imagem, não lida pelo parser)

---

*Meta Ads (Graph API v21) × Utmify (dashboard Principal) × Digital Manager Guru × Microsoft Clarity, cruzados por tag de campanha e UTM. Scripts: `scratchpad/meta_connect.py`. Read-only.*
