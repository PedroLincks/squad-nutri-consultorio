# Guia Completo dos Agentes — Squad Nutri de Consultorio

## Hierarquia da Squad

```
Pedro (dono do negocio)
  └── Jack (Estrategista & Head de Marketing)
        ├── Zara (Spy & Pesquisadora)
        └── Zoe (Copywriter)
```

**Fluxo natural:** Jack define estrategia → Zara pesquisa → Zoe escreve

---

## Como Ativar os Agentes

| Agente | Ativacao | Skill |
|--------|----------|-------|
| Jack | `@jack` | `/AIOS:agents:jack` |
| Zara | `@zara` | `/AIOS:agents:zara` |
| Zoe | `@zoe` | `/AIOS:agents:zoe` |

Para sair de qualquer agente: `*exit`
Para ver comandos disponíveis: `*help`

---

## Jack — Estrategista de Vendas & Head de Marketing

**Persona:** Alex Hormozi em forma de agente. Pragmatico, direto, obcecado por ROI.

**Quando usar:** Quando precisar PENSAR e PLANEJAR antes de agir. Jack nao escreve copy e nao pesquisa — ele cria a estrategia.

### Comandos

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `*campaign` | Planeja campanha completa (calendario, fases, budget, KPIs, direcao criativa) | Inicio de nova campanha ou ciclo de ads |
| `*scale` | Analisa metricas e define estrategia de escala (acelerar, manter ou pausar) | Quando tiver dados de campanha rodando e precisar decidir proximo passo |
| `*offer` | Cria oferta irresistivel (Value Equation + MAGIC naming + bonuses + garantia) | Quando precisar criar ou reformular uma oferta de produto |
| `*funnel` | Arquitetar ou revisar funil e jornada do cliente entre GCN/Webnutri/ANC | Quando quiser repensar a jornada do cliente entre produtos |
| `*go-to-market` | Estrategia completa de lancamento de produto | Antes de lancar algo novo no mercado |
| `*brief` | Gera briefing estrategico com direcao criativa para Zara pesquisar e Zoe escrever | Quando quiser direcionar o trabalho de Zara e Zoe para uma campanha especifica |
| `*big-idea` | Desenvolve Big Idea para campanha (tema central, angulo, mecanismo unico) | Quando precisar de um conceito central forte para campanha |
| `*money-model` | Desenha Money Model completo (atracao + upsell + downsell + continuidade) | Para estruturar modelo de monetizacao do ecossistema |
| `*fast-cash` | Cria Fast Cash Play trimestral (oferta ultra-premium para base quente) | A cada trimestre para gerar caixa rapido com base existente |
| `*pricing` | Analisa e otimiza pricing de um produto (10 plays de lucro instantaneo) | Quando quiser aumentar margem sem aumentar trafego |
| `*retention` | Estrategia de retencao e reducao de churn (Churn Checklist + Crazy Eight) | Quando clientes estiverem saindo ou LTV estiver baixo |
| `*diagnose` | Diagnostica por que campanha/produto nao esta performando | Quando resultados estiverem abaixo do esperado |
| `*quarterly` | Planejamento estrategico trimestral (review + metas + calendario + Fast Cash) | Inicio de cada trimestre |
| `*status` | Resumo do estado atual das campanhas, metricas e proximos passos | Para ter visao geral rapida de onde esta tudo |

### Frameworks que Jack usa

| Framework | Aplicacao |
|-----------|-----------|
| **Value Equation** | Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort) |
| **Core Four** | 4 formas de gerar clientes: Warm Outreach, Free Content, Cold Outreach, Paid Ads |
| **Money Models** | Attraction + Upsell + Downsell + Continuity |
| **Goated Ads** | 50 hooks x 5 meats x 3 CTAs = volume massivo de variacoes |
| **MAGIC Naming** | Make magnetic reason + Announce avatar + Give goal + Indicate time + Container word |
| **Fast Cash** | 10% dos clientes pagam 10x = dobra faturamento. Trimestral. |
| **Crazy Eight** | 8 formas de aumentar LTV |
| **Rule of 100** | 100 acoes/dia, 100 dias, antes de julgar |
| **5 Niveis de Consciencia** | Unaware → Problem → Solution → Product → Most Aware |
| **Rule of One** | 1 Big Idea, 1 Emocao, 1 Historia, 1 Beneficio, 1 Resposta |

### Formato de Output do Jack

Todo plano/estrategia segue esta estrutura:
1. **CONTEXTO** — Situacao atual e por que isso importa
2. **ESTRATEGIA** — O que fazer e por que (com framework de referencia)
3. **EXECUCAO** — Passo a passo com responsaveis (Jack/Zara/Zoe)
4. **METRICAS** — Como medir sucesso (KPIs especificos)
5. **PROXIMOS PASSOS** — Acoes imediatas ordenadas por prioridade

---

## Zara — Spy & Pesquisadora de Copy

**Persona:** Analitica, curiosa, organizada. Devora livros de copy e esta sempre de olho no mercado.

**Quando usar:** Quando precisar de DADOS e INSIGHTS antes de escrever. Zara nao escreve copy — ela entrega a municao para Zoe.

### Comandos

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `*spy` | Pesquisa e analisa copies de um nicho ou concorrente especifico | Quando quiser espionar o que concorrentes estao fazendo |
| `*analyze-hooks` | Analisa e categoriza hooks dos winning ads por produto | Para entender quais tipos de hooks estao funcionando |
| `*patterns` | Identifica padroes nas copies vencedoras de um produto | Para descobrir estruturas e angulos que convertem |
| `*benchmark` | Compara copies atuais com melhores praticas do mercado | Para avaliar se as copies estao no nivel do mercado |
| `*swipe` | Adiciona nova referencia ao swipe file com analise | Quando encontrar uma copy boa e quiser salvar com analise |
| `*briefing` | Gera briefing de pesquisa completo para Zoe criar copies | Quando a pesquisa estiver pronta e for hora de passar para Zoe |
| `*angles` | Lista angulos de copy disponiveis para um produto | Quando precisar de ideias de angulos para uma campanha |
| `*gaps` | Identifica gaps e oportunidades nas copies atuais | Para encontrar o que esta faltando nas campanhas |

### O que Zara consulta

| Documento | Caminho |
|-----------|---------|
| Briefing do produto | `docs/prd/{produto}/briefing.md` |
| Avatar do produto | `docs/prd/{produto}/avatar.md` |
| Tone of voice | `docs/prd/tone-of-voice.md` |
| Winning ads | `docs/references/winning-ads/winning-ads-{produto}.md` |
| Principios de copy | `docs/library/principles.md` |
| Formulas classicas | `docs/library/formulas.md` |
| Lendas do copy | `docs/library/legends.md` |

### O que Zara entrega

- Hooks categorizados por tipo e eficacia
- Angulos de copy com justificativa
- Padroes identificados nos winning ads
- Briefings completos para Zoe
- Oportunidades e gaps no mercado
- Swipe files anotados

---

## Zoe — Copywriter de Anuncios

**Persona:** Criativa, persuasiva, direta. Escreve como a Leticia Lincks fala — informal, pratica, sem cliches de marketing.

**Quando usar:** Quando precisar ESCREVER copies prontas para usar. Zoe e a executora final.

### Comandos

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `*write-copy` | Escreve copy completa (hook + body + CTA) | Para criar um anuncio do zero |
| `*variations` | Gera variacoes A/B de uma copy existente | Quando tiver uma copy boa e quiser testar variacoes |
| `*hooks` | Gera opcoes de hooks para um angulo especifico | Quando precisar de varias aberturas para testar |
| `*roteiro` | Escreve roteiro completo para video ad | Para videos frontais, UGC ou narrados |
| `*adapt` | Adapta copy para outra plataforma ou formato | Para reaproveitar copy em diferentes formatos |
| `*review` | Revisa e melhora uma copy existente | Quando tiver uma copy que precisa de ajustes |
| `*rewrite` | Reescreve um winning ad com novo angulo | Para pegar um ad que funciona e criar versao nova |
| `*batch` | Cria lote de copies para campanha completa | Quando precisar de varias copies de uma vez |

### Formatos de Output da Zoe

**Meta Ads:**
- **Hook:** Frase de abertura (3-5 segundos de atencao)
- **Body:** Corpo do anuncio (argumentacao, prova, demonstracao)
- **CTA:** Chamada para acao final

**Roteiro de Video:**
- **Hook (0-3s):** Abertura que prende
- **Body (3-45s):** Desenvolvimento (problema → agitacao → solucao)
- **CTA (45-60s):** Chamada para acao
- **Notas de cena:** Instrucoes visuais para gravacao

**Carrossel:**
- **Capa:** Slide 1 com hook visual + texto
- **Slides 2-9:** Desenvolvimento
- **Slide final:** CTA
- **Legenda:** Texto do post

### Regras de Escrita da Zoe

**USAR:** "Na pratica", "Vou te explicar", "Deixa eu te mostrar", "Faz sentido?", "Vou te dar um exemplo"

**NUNCA USAR:** "Transformar", "Descubra o segredo", "Fala galera", "Conteudo de valor", "Nao e sobre X, e sobre Y", "Jornada", "Impactar"

**Emojis favoritos:** ✅✨👀😮‍💨💰🤑🙂‍↕️🫠🥲🥹

### Copy por Produto

| Produto | Preco | Hook ideal | Vende |
|---------|-------|------------|-------|
| **GCN** | R$147 | Cenario clinico desafiador | SEGURANCA |
| **Webnutri** | R$297/ano | POV ou contraste visual | DIFERENCIACAO |
| **ANC** | R$2k/4k | Resultado financeiro | MODELO DE NEGOCIO |

---

## Fluxos de Trabalho Recomendados

### Fluxo 1: Campanha Nova (do zero)

```
1. @jack *campaign        → Define estrategia, calendario, budget
2. @jack *brief           → Cria briefing para Zara e Zoe
3. @zara *spy             → Pesquisa concorrentes e mercado
4. @zara *patterns        → Identifica o que funciona
5. @zara *briefing        → Entrega insights para Zoe
6. @zoe *batch            → Cria lote de copies
7. @zoe *variations       → Gera variacoes A/B
```

### Fluxo 2: Melhorar Campanha Existente

```
1. @jack *diagnose        → Identifica o que nao esta funcionando
2. @zara *gaps            → Encontra oportunidades perdidas
3. @zara *analyze-hooks   → Analisa quais hooks performam
4. @zoe *rewrite          → Reescreve ads com novos angulos
5. @zoe *variations       → Cria testes A/B
```

### Fluxo 3: Criar Oferta Irresistivel

```
1. @jack *offer           → Cria oferta com Value Equation
2. @jack *pricing         → Otimiza preco
3. @jack *brief           → Briefing com direcao criativa
4. @zara *angles          → Lista angulos possiveis
5. @zoe *write-copy       → Escreve copy da oferta
```

### Fluxo 4: Planejamento Trimestral

```
1. @jack *quarterly       → Review + metas + calendario
2. @jack *fast-cash       → Fast Cash Play do trimestre
3. @jack *money-model     → Revisa modelo de monetizacao
4. @jack *campaign        → Planeja proxima campanha
```

### Fluxo 5: Pesquisa Rapida + Copy

```
1. @zara *spy             → Pesquisa rapida do mercado
2. @zara *briefing        → Briefing para Zoe
3. @zoe *write-copy       → Escreve copy
```

### Fluxo 6: Escala

```
1. @jack *status          → Estado atual
2. @jack *scale           → Decisao de escala
3. @zoe *batch            → Novas copies para escalar
```

---

## Dicas de Uso

1. **Sempre comece pelo Jack** quando for algo estrategico. Ele define o "que" e "por que" antes de Zara e Zoe executarem.

2. **Use Zara antes de Zoe** para garantir que as copies tenham fundamento em dados reais, nao achismo.

3. **Zoe pode trabalhar direto** se voce ja tiver clareza do angulo, produto e formato. Nao precisa sempre passar por Jack e Zara.

4. **Jack nao escreve copy.** Se pedir copy para ele, ele vai criar um briefing estrategico e direcionar para Zoe.

5. **Zara nao escreve copy.** Ela entrega pesquisa e insights. A execucao e da Zoe.

6. **Especifique o produto** (GCN, Webnutri ou ANC) ao usar qualquer agente — cada produto tem avatar, tom e estrategia diferentes.

7. **Use `*help`** dentro de qualquer agente para ver os comandos disponiveis.

8. **Use `*exit`** para sair do agente e voltar ao modo normal.

---

## Squads de Elite

Alem dos agentes internos (Jack, Zara, Zoe), voce tem dois squads especializados:

| Squad | Agentes | Ativacao | Foco |
|-------|---------|----------|------|
| **Copy Squad** | 23 (22 lendas + Cyrus orquestrador) | `@copy-chief` ou `@copy-squad:{nome}` | Copy de nivel mundial |
| **Hormozi Squad** | 16 (15 especialistas + orquestrador) | `@hormozi-chief` ou `@hormozi-{area}` | Estrategia, ofertas, escala |

**Guia completo:** `docs/Guia Squads - Copy Squad e Hormozi Squad.md`

---

## Produtos do Ecossistema

| Produto | Preco | Tipo | O que vende |
|---------|-------|------|-------------|
| **GCN** (Guia de Condutas Nutricionais) | R$147 | Front-end | Seguranca clinica |
| **Webnutri** | R$297/ano | Mid-ticket recorrente | Diferenciacao visual |
| **ANC** (Aceleracao Nutri de Consultorio) | R$2k-4k | High-ticket | Modelo de negocio |

**Funil natural:** GCN (entrada) → Webnutri (complemento) → ANC (transformacao completa)
