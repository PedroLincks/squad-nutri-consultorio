# Relatório de Padrões Vencedores — Webnutri (validação do loop)

> Primeira execução real do squad de performance (Max). Janela 17–23/jun/2026.
> Conta Meta: 01 - Nutri de Consultório (168028315098298). Venda real: Digital Manager Guru.
> Cruzamento por `utm_content` → ad id do Meta.

## 1. Janela & volume

- Período: **17–23 jun 2026** (7 dias).
- Vendas aprovadas no gateway (período): **92** no total da conta.
- ⚠️ **Cobertura de atribuição baixa:** R$ 19.099,53 (46 vendas) vieram **`sem_utm`** + R$ 1.672,30 como `vitrine`. Ou seja, a maior parte da receita NÃO está rastreada por criativo (direto/orgânico/recompra/checkout sem UTM). Os ROAS abaixo são calculados só sobre a fatia **rastreada** — leia como piso, não teto.

## 2. Ranking de criativos (cruzamento Meta × Guru)

| Criativo (ad id) | Spend (Meta) | Receita (Guru) | Vendas | ROAS real | CTR |
|---|---:|---:|---:|---:|---:|
| **[WN] CRTV01 "É ASSIM QUE" HK01** `…850633` | R$ 705,70 | R$ 1.785,01 | 6 | **2,53x** | 0,97% |
| [WN] CRTV01 "É ASSIM QUE" HK01 — Cópia `…050633` | R$ 512,84 | R$ 1.174,06 | 4 | **2,29x** | 0,99% |
| [WN] CRTV02 "É ASSIM QUE" HK01 `…760633` | R$ 43,34 | R$ 272,88 | 1 | 6,30x¹ | 1,42% |
| [WN] CRTV05 "É ASSIM QUE" HK03 `…900633` | R$ 25,16 | R$ 197,00 | 1 | 7,83x¹ | 1,16% |
| [WN] CRTV01 **VSL** CNST COMUM HK04 `…430633` | R$ 407,67 | R$ 297,00 | 1 | **0,73x** | 1,01% |

¹ Volume baixo (1 venda) — sinal fraco, não conclua ainda.

> Bônus (mesma conta, Método Dieta Ágil): MDA POV HK04 = 1,58x; MDA CASOS NARRADO HK03 = 1,36x; HK02 = 1,31x.

## 3. Padrões vencedores

- **Formato "É ASSIM QUE" (POV/imagem, HK01)** é o vencedor claro e com volume: 2,3–2,5x de ROAS sobre R$ 1,2k de spend somado e 10 vendas rastreadas. Confirma o winning ad documentado da Webnutri (hook POV "é assim que você ensina seus pacientes…").
- **Hook HK01** ("E assim que…") performa melhor que os demais hooks do mesmo criativo.
- A **VSL** (CRTV01 VSL HK04) está **abaixo de 1x** no rastreado — o formato imagem/POV está vencendo a VSL nesta janela para Webnutri. (Próximo passo: cruzar com retenção da vTurb para ver se o problema é o criativo que manda tráfego ou a própria VSL.)

## 4. Padrões perdedores / hygiene de dados (ação do Pedro)

- 🔴 **R$ 247 com `utm_content = "{{ad.name}}|{{ad.id}}"`** — há ad(s) com a macro do UTM **não renderizada**. O Meta não substituiu o template → atribuição perdida. Corrigir o parâmetro de URL desse anúncio.
- 🔴 **R$ 247 com `5BWN5D CRTV01…7C…050633`** — colchetes `[ ]` e pipe `|` do nome do criativo viraram URL-encoding quebrado (`%5B`/`%5D`/`%7C`) no UTM. Recomendo evitar `[ ] |` no `utm_content` ou garantir encoding consistente.
- 🟡 **80%+ da receita `sem_utm`** — vale investigar se o checkout da Guru está recebendo as UTMs em todos os fluxos. Fechar esse gap multiplica a precisão do loop inteiro.

## 5. Hipóteses pro próximo lote (matéria-prima pro Jack)

1. Escalar o ângulo **"É ASSIM QUE" HK01** (vencedor com volume) e produzir novas variações do mesmo padrão POV/imagem.
2. Testar **novos hooks** sobre o mesmo corpo do CRTV01 (o corpo vende; o hook é a alavanca).
3. Reavaliar a **VSL**: cruzar retenção (vTurb) antes de matar — pode ser criativo de entrada errado, não a VSL.

## 6. Handoff pro Jack

> O formato **POV "É ASSIM QUE" (HK01)** é o vencedor rastreado da Webnutri (2,3–2,5x, 10 vendas). A VSL está abaixo de 1x nesta janela. Briefe a Zoe pra novas variações do padrão "É ASSIM QUE" com hooks novos sobre o mesmo corpo. **Aviso:** 80% da receita está sem atribuição — decisões sobre os criativos de baixo volume ainda são de sinal fraco.

---
*Validação do loop: Meta Ads MCP (spend/CTR) × Digital Manager Guru (venda real) cruzados por ad id. Cruzamento confirmado funcionando. Read-only — nenhuma alteração feita no Meta.*
