# Guia Completo: Copy Squad + Hormozi Squad

**Como usar seus dois squads de elite no terminal do Claude Code**

---

## Visao Geral

Voce tem **dois squads especializados** alem dos agentes internos (Jack, Zara, Zoe):

| Squad | Agentes | Foco |
|-------|---------|------|
| **Copy Squad** | 23 (22 copywriters lendarios + 1 orquestrador) | Escrever copy de nivel mundial |
| **Hormozi Squad** | 16 (15 especialistas + 1 orquestrador) | Estrategia de negocios, ofertas e escala |

---

## Hierarquia Completa

```
Pedro (dono do negocio)
  │
  ├── Jack (Estrategista & Head de Marketing)
  │     ├── Zara (Spy & Pesquisadora)
  │     └── Zoe (Copywriter)
  │
  ├── Copy Squad (22 lendas do copywriting)
  │     └── Cyrus (Copy Chief — orquestrador)
  │           ├── Tier 1A: Halbert, Schwartz, Hopkins, Bencivenga, Collier, Carlton, Rutz
  │           ├── Tier 1B: Kennedy, Kern, Brunson, Brown, Georgi, Benson, Ry Schwartz
  │           ├── Tier 1C: Settle, Chaperon, Dan Koe
  │           └── Tier 1D: Sugarman, Ogilvy, Makepeace, Lampropoulos, Deutsch
  │
  └── Hormozi Squad (15 especialistas Hormozi)
        └── Hormozi Chief (orquestrador)
              ├── hormozi-offers (Grand Slam Offers)
              ├── hormozi-leads ($100M Leads)
              ├── hormozi-pricing (Pricing)
              ├── hormozi-closer (CLOSER framework)
              ├── hormozi-ads (Ads)
              ├── hormozi-content (Content Machine)
              ├── hormozi-hooks (Hooks)
              ├── hormozi-launch (Lancamento)
              ├── hormozi-retention (Retencao & LTV)
              ├── hormozi-scale (Escala)
              ├── hormozi-models (Modelos de negocio)
              ├── hormozi-audit (Auditoria)
              ├── hormozi-copy (Copy estilo Hormozi)
              ├── hormozi-workshop (Workshops)
              └── hormozi-advisor (Conselheiro estrategico)
```

---

## Como Ativar Cada Squad

### Copy Squad

| Forma | Comando | Quando usar |
|-------|---------|-------------|
| Via orquestrador | `@copy-chief` | Quando nao sabe qual copywriter usar — ele escolhe pra voce |
| Direto no especialista | `@copy-squad:gary-halbert` | Quando sabe exatamente quem quer |
| Via skill | `/AIOS:agents:copy-chief` | Alternativa ao @ |

### Hormozi Squad

| Forma | Comando | Quando usar |
|-------|---------|-------------|
| Via orquestrador | `@hormozi-chief` | Quando tem um problema de negocio e nao sabe qual agente usar |
| Direto no especialista | `@hormozi-offers` | Quando sabe exatamente o que precisa |

### Comandos universais

| Comando | O que faz |
|---------|-----------|
| `*help` | Mostra comandos disponiveis do agente ativo |
| `*exit` | Sai do agente e volta ao modo normal |
| `*roster` | Mostra todos os agentes do squad |

---

## Copy Squad — Guia Detalhado

### Quando usar o Copy Squad vs Zoe

| Situacao | Quem usar |
|----------|-----------|
| Copy rapida para Meta Ads do GCN/Webnutri/ANC | **Zoe** (ja conhece os produtos) |
| Sales letter longa e persuasiva | **Copy Squad** (Gary Halbert ou John Carlton) |
| Sequencia de emails tipo novela | **Copy Squad** (Andre Chaperon) |
| VSL / roteiro de video de vendas | **Copy Squad** (Stefan Georgi ou Jon Benson) |
| Headlines matadoras | **Copy Squad** (Eugene Schwartz) |
| Funil completo de copy | **Copy Squad** (Russell Brunson + Frank Kern) |
| Copy de marca premium | **Copy Squad** (David Ogilvy) |
| Bullets e fascinations | **Copy Squad** (Gary Bencivenga) |
| Emails diarios de engajamento | **Copy Squad** (Ben Settle) |

### Quem e quem — Guia rapido de selecao

#### Preciso de uma Sales Letter / Carta de Vendas
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **Gary Halbert** | Visceral, emocional, historia crua | Quando precisa de emocao bruta e storytelling |
| **John Carlton** | Casual, engraçado, "street smart" | Quando o publico e informal e precisa de personalidade |
| **Robert Collier** | Empatico, elegante, classico | Quando precisa se conectar profundamente com a dor do leitor |
| **Jim Rutz** | Magalog, editorial, jornalistico | Quando quer parecer conteudo editorial, nao anuncio |

#### Preciso de um VSL / Video Sales Letter
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **Stefan Georgi** | RMBC Method, estruturado | VSLs longos com estrutura apertada |
| **Jon Benson** | Inventor do VSL, slides | VSLs tipo slideshow com texto |
| **Todd Brown** | E5 Method, Big Idea | Quando precisa de uma Big Idea poderosa no centro |

#### Preciso de Emails
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **Andre Chaperon** | Soap Opera Sequence, intimo | Sequencias de nurture que criam relacionamento |
| **Ben Settle** | Diario, anti-guru, polarizante | Emails diarios que vendem todo dia |
| **Ry Schwartz** | Niveis de consciencia em email | Emails segmentados por awareness level |
| **Dan Koe** | Marca pessoal, one-person business | Emails de personal brand |

#### Preciso de Funnel / Landing Page
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **Russell Brunson** | Perfect Webinar, funis | Funis completos, webinar scripts |
| **Frank Kern** | Behavioral sequences, launches | Lancamentos e sequencias comportamentais |
| **Dan Kennedy** | No-BS, direto, oferta forte | Landing pages focadas em conversao |

#### Preciso de Headlines / Bullets
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **Eugene Schwartz** | 5 niveis de consciencia, breakthrough | Headlines que param o leitor (o mestre) |
| **Gary Bencivenga** | Fascinations, curiosidade | Bullets que criam desejo incontrolavel |
| **Clayton Makepeace** | Power bullets, saude/financas | Bullets para nicho de saude |

#### Preciso de Copy Premium / Marca
| Copywriter | Estilo | Melhor para |
|-----------|--------|-------------|
| **David Ogilvy** | Elegante, premium, brand | Quando quer soar sofisticado e premium |
| **David Deutsch** | Persuasao sofisticada | Sales pages de alto ticket |

### Tasks do Copy Squad

| Task | Comando | O que faz |
|------|---------|-----------|
| Headline | `*write-headline` | Cria headlines usando frameworks do especialista |
| Sales Letter | `*write-sales-letter` | Carta de vendas completa |
| VSL | `*write-vsl-script` | Roteiro de video de vendas |
| Emails | `*write-email-sequence` | Sequencia de emails |
| Ad Copy | `*write-ad-copy` | Copy para anuncios |
| Landing Page | `*write-landing-page` | Copy de landing page |
| Bullets | `*write-bullets` | Fascinations e bullet points |
| Funnel | `*create-funnel-copy` | Copy de funil completo |
| Oferta | `*create-offer` | Estrutura de oferta |
| Analise | `*analyze-copy` | Analisa copy existente |
| Critica | `*critique-copy` | Critica detalhada com sugestoes |
| Diagnostico | `*diagnose` | Identifica problemas na copy |
| Review | `*review` | Revisao geral |

### Workflows do Copy Squad

**1. Full Copy Project** (`*full-copy-project`)
```
Brief → Diagnostico → Atribuicao do especialista → Escrita → Review → Entrega
```

**2. Copy Review Cycle** (`*copy-review-cycle`)
```
Escrita → Critica → Revisao → (repete ate 3x) → Aprovacao
```

---

## Hormozi Squad — Guia Detalhado

### Quando usar o Hormozi Squad vs Jack

| Situacao | Quem usar |
|----------|-----------|
| Estrategia de campanha para GCN/Webnutri/ANC | **Jack** (conhece os produtos) |
| Criar Grand Slam Offer do zero | **Hormozi Squad** (hormozi-offers) |
| Framework $100M Leads completo | **Hormozi Squad** (hormozi-leads) |
| Pricing baseado em valor | **Hormozi Squad** (hormozi-pricing) |
| Script de vendas CLOSER | **Hormozi Squad** (hormozi-closer) |
| Estrategia de escala $1M→$10M | **Hormozi Squad** (hormozi-scale) |
| Auditoria completa do negocio | **Hormozi Squad** (hormozi-audit) |
| Retencao e churn | **Hormozi Squad** (hormozi-retention) |

### Quem e quem no Hormozi Squad

| Agente | Especialidade | Framework principal |
|--------|---------------|---------------------|
| **hormozi-chief** | Diagnostica e roteia | Todos os frameworks |
| **hormozi-offers** | Criacao de ofertas | Grand Slam Offer + Value Equation |
| **hormozi-leads** | Geracao de leads | Core 4 / $100M Leads |
| **hormozi-pricing** | Precificacao | Value Equation / Price-to-Value |
| **hormozi-closer** | Vendas e fechamento | CLOSER framework |
| **hormozi-ads** | Anuncios pagos | Ad frameworks |
| **hormozi-content** | Conteudo organico | Content Machine |
| **hormozi-hooks** | Criacao de hooks | Hook frameworks |
| **hormozi-launch** | Lancamento | Launch methodology |
| **hormozi-retention** | Retencao e LTV | Churn reduction frameworks |
| **hormozi-scale** | Escala | Scaling $1M→$100M+ |
| **hormozi-models** | Modelo de negocio | Business model design |
| **hormozi-audit** | Auditoria | Business evaluation |
| **hormozi-copy** | Copy estilo Hormozi | Hormozi-style direct copy |
| **hormozi-workshop** | Workshops | Workshop design |
| **hormozi-advisor** | Conselho estrategico | Strategic advice |

### Tasks do Hormozi Squad

| Task | Comando | O que faz |
|------|---------|-----------|
| Diagnostico | `*diagnose` | Identifica o problema central do negocio |
| Criar oferta | `*create-offer` | Grand Slam Offer completa |
| Gerar leads | `*generate-leads` | Estrategia Core 4 de lead gen |
| Pricing | `*set-pricing` | Precificacao baseada em valor |
| Fechar venda | `*close-sale` | Script CLOSER |
| Criar hooks | `*create-hooks` | Hooks para ads e conteudo |
| Planejar lancamento | `*plan-launch` | Estrategia de lancamento |
| Auditar negocio | `*audit-business` | Avaliacao completa do negocio |
| Workshop | `*design-workshop` | Design de workshop |
| Review | `*review` | Revisao de qualquer output |

### Workflows do Hormozi Squad

**1. Business Turnaround** (`*business-turnaround`)
```
Auditoria → Diagnostico → Correcao de oferta → Leads → Vendas → Escala
```

**2. Offer Pipeline** (`*offer-pipeline`)
```
Pesquisa → Value Equation → Grand Slam Offer → Naming → Garantia → Bonuses → Pricing
```

---

## Fluxos Combinados (Squad + Agentes Internos)

### Fluxo 1: Campanha de Lancamento Completa

```
1. @jack *campaign               → Define estrategia e calendario
2. @hormozi-offers *create-offer → Cria Grand Slam Offer com Value Equation
3. @jack *brief                  → Briefing criativo baseado na oferta
4. @zara *spy                    → Pesquisa concorrentes
5. @copy-chief *brief            → Cyrus atribui ao copywriter certo
6. (especialista escreve)        → Sales letter, emails, VSL...
7. @zoe *batch                   → Adapta para Meta Ads
8. @zoe *variations              → Variacoes A/B
```

### Fluxo 2: Criar Oferta Irresistivel + Copy de Vendas

```
1. @hormozi-offers *create-offer         → Grand Slam Offer
2. @hormozi-pricing *set-pricing         → Pricing otimizado
3. @copy-squad:stefan-georgi             → VSL da oferta
   *write-vsl-script
4. @copy-squad:andre-chaperon            → Sequencia de emails
   *write-email-sequence
5. @copy-squad:dan-kennedy               → Landing page
   *write-landing-page
```

### Fluxo 3: Diagnosticar + Corrigir Campanha

```
1. @jack *diagnose                → O que nao esta funcionando?
2. @hormozi-chief *diagnose      → Analise Hormozi (oferta? leads? vendas?)
3. @zara *gaps                   → Oportunidades perdidas
4. (corrigir com o agente certo) → Depende do diagnostico
5. @zoe *rewrite                 → Novas copies
```

### Fluxo 4: Email Sequence de Nivel Mundial

```
1. @jack *brief                          → Direcao estrategica
2. @copy-squad:andre-chaperon            → Soap Opera Sequence
   *write-email-sequence
3. @copy-chief *review                   → Revisao de qualidade
4. Ajustes finais
```

### Fluxo 5: Planejamento Trimestral Profundo

```
1. @jack *quarterly                  → Review + metas
2. @hormozi-audit *audit-business    → Auditoria do negocio
3. @hormozi-scale                    → Estrategia de escala
4. @jack *fast-cash                  → Fast Cash Play
5. @jack *campaign                   → Proxima campanha
```

### Fluxo 6: Criar Hooks Poderosos

```
1. @hormozi-hooks *create-hooks     → Hooks estilo Hormozi (volume)
2. @copy-squad:eugene-schwartz      → Headlines usando 5 niveis de consciencia
   *write-headline
3. Combinar os melhores de cada um
```

---

## Quando Usar Quem — Regra de Ouro

```
ESTRATEGIA DO NEGOCIO?     → Jack (rapido) ou Hormozi Squad (profundo)
PESQUISA DE MERCADO?        → Zara
COPY RAPIDA PRA META ADS?  → Zoe
COPY DE ALTO NIVEL?         → Copy Squad (via Copy Chief ou direto)
OFERTA / PRICING / ESCALA?  → Hormozi Squad
```

### Combinacoes Poderosas

| Objetivo | Combinacao |
|----------|------------|
| Campanha completa | Jack + Hormozi Offers + Copy Squad + Zoe |
| Email sequence | Jack (brief) + Andre Chaperon (escrita) |
| VSL de produto | Hormozi Offers (oferta) + Stefan Georgi (roteiro) |
| Escalar ads | Jack (estrategia) + Zara (pesquisa) + Zoe (copies) |
| Reformular oferta | Hormozi Offers + Hormozi Pricing + Dan Kennedy (landing) |
| Funil do zero | Hormozi Chief (diagnostico) + Russell Brunson (funil) + Chaperon (emails) |

---

## Dicas Importantes

1. **Copy Chief (Cyrus) nao escreve copy.** Ele diagnostica, escolhe o copywriter certo e revisa o output. Use ele quando nao souber por onde comecar.

2. **Hormozi Chief nao executa.** Ele diagnostica o problema do negocio e roteia pro especialista certo. Use quando nao souber se o problema e de oferta, leads, pricing ou vendas.

3. **Voce pode ir direto no especialista.** Nao precisa sempre passar pelo orquestrador. Se sabe que quer um VSL, chame `@copy-squad:stefan-georgi` direto.

4. **Jack conhece seus produtos. Os squads nao.** Sempre passe contexto sobre GCN, Webnutri ou ANC quando usar os squads. Jack ja sabe tudo isso.

5. **Use squads para trabalho profundo e de referencia.** Para o dia a dia das campanhas, Jack + Zara + Zoe sao mais rapidos porque ja conhecem o contexto.

6. **Combine squads.** O melhor resultado vem de usar Hormozi Squad para a oferta/estrategia e Copy Squad para a execucao da copy.

7. **Especifique sempre:** produto, publico, nivel de consciencia, formato desejado. Quanto mais contexto, melhor o output.

---

## Referencia Rapida de Ativacao

```
# Agentes internos
@jack                          → Estrategista
@zara                          → Spy / Pesquisadora
@zoe                           → Copywriter rapida

# Copy Squad
@copy-chief                    → Orquestrador (Cyrus)
@copy-squad:gary-halbert       → Sales letters, emocao crua
@copy-squad:eugene-schwartz    → Headlines, consciencia
@copy-squad:stefan-georgi      → VSL (RMBC)
@copy-squad:andre-chaperon     → Email sequences (Soap Opera)
@copy-squad:ben-settle         → Emails diarios
@copy-squad:russell-brunson    → Funis, webinars
@copy-squad:dan-kennedy        → Ads, landing pages, ofertas
@copy-squad:david-ogilvy       → Copy premium / marca
@copy-squad:gary-bencivenga    → Bullets / fascinations
@copy-squad:todd-brown         → Big Idea / conceitos
@copy-squad:frank-kern         → Lancamentos
@copy-squad:jon-benson         → VSL slides
@copy-squad:john-carlton       → Long-form casual
@copy-squad:robert-collier     → Empatia / cartas
@copy-squad:jim-rutz           → Magalogs
@copy-squad:ry-schwartz        → Emails por awareness
@copy-squad:dan-koe            → Personal brand
@copy-squad:joe-sugarman       → Triggers psicologicos
@copy-squad:clayton-makepeace  → Copy saude/financas
@copy-squad:parris-lampropoulos → Direct response saude
@copy-squad:david-deutsch      → Persuasao sofisticada
@copy-squad:claude-hopkins     → Copy cientifico, testes

# Hormozi Squad
@hormozi-chief                 → Orquestrador
@hormozi-offers                → Grand Slam Offers
@hormozi-leads                 → Lead Generation
@hormozi-pricing               → Pricing
@hormozi-closer                → Vendas / CLOSER
@hormozi-ads                   → Anuncios pagos
@hormozi-content               → Conteudo organico
@hormozi-hooks                 → Hooks
@hormozi-launch                → Lancamento
@hormozi-retention             → Retencao / LTV
@hormozi-scale                 → Escala
@hormozi-models                → Modelo de negocio
@hormozi-audit                 → Auditoria
@hormozi-copy                  → Copy estilo Hormozi
@hormozi-workshop              → Workshops
@hormozi-advisor               → Conselho estrategico
```
