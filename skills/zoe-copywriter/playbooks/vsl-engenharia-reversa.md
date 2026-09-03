# Playbook — Engenharia Reversa de VSL (processo do swipe file)

> Processo definido com o Pedro em 02-03/09/2026, a partir das análises de Código Viral, Efeito Di e Stories para Enriquecer.
> Grade de análise: `vsl-dr-expert.md` · Swipe file: `docs/references/swipe-file/`

## O FLUXO — quatro etapas, nesta ordem

```
1. Pedro envia a transcrição da VSL
2. Zoe destrincha e entrega a análise NO TERMINAL
3. Pedro revisa e corrige
4. Só então: salvar o .md e gerar o PDF
```

**A etapa 3 é obrigatória.** Nunca gerar arquivo nem PDF antes da revisão do Pedro. Análise entregue direto em arquivo já foi motivo de retrabalho.

---

## O QUE A ANÁLISE É — e o que ela não é

> **É identificação de elementos. Não é crítica, não é Pareto, não é lista de insights.**

Foi a correção mais importante que o Pedro fez no processo:

> *"Eu quero a VSL desmembrada: Lead, Mecanismos, Pontos Lógicos, História, Oferta etc. O que não tiver, é só sinalizar: não tem! Agora não precisa colocar insights, quero apenas a identificação dos elementos."*

Se ele quiser leitura crítica, comentário de mesa ou análise de Pareto, ele pede explicitamente. O default é **identificação pura**.

### As cinco regras da identificação

1. **Citar o texto literal da VSL**, entre aspas. Nunca parafrasear o que o copy diz — a citação é a evidência
2. **Sinalizar o ausente, nunca omitir.** Se a VSL não tem Background Story, a seção existe e diz **NÃO TEM**. A ausência é informação: foi ela que revelou que o Código Viral corta as 4 histórias e o Stories para Enriquecer não
3. **Não forçar o formato.** VSL curta e VSL longa têm arquiteturas diferentes; a análise descreve o que existe, não cobra o que "deveria" existir
4. **Separar o que é fala da VSL do que é classificação.** Citação em blockquote, classificação em texto corrido ou tabela
5. **Marcar trechos truncados** da transcrição em vez de reconstruir por conta própria

---

## AS 14 SEÇÕES — estrutura fixa

A ordem é sempre a mesma, para permitir comparação lado a lado entre VSLs.

| # | Seção | O que entra |
|---|---|---|
| **00** | **Fundamentos** | Avatar · Big Idea · Nomes Chiclete (tabela: nome → aplicado a) · Pergunta Paradoxal (decomposta na fórmula) · Única Crença |
| **01** | **Lead** | Ângulo declarado + todos os elementos numerados na ordem em que aparecem |
| **02** | **Background Story** | Credenciais, autoridade, gancho de saída |
| **03** | **Emotional Story** | Cenário, dor, fundo do poço, dilema — ou o que ocupa esse lugar |
| **04** | **Mecanismo de Problema** | Dividido em camadas numeradas, com a causa raiz destacada |
| **05** | **Mecanismo de Solução** | Componentes, modelos, a regra central, e se há demonstração prática |
| **06** | **Pontos Lógicos** | A cadeia completa do argumento, numerada, na ordem |
| **07** | **Discovery Story & Product Build Up** | Os dois; se um faltar, sinalizar |
| **08** | **Composição da Oferta** | Produto principal, estrutura/etapas, bônus com valor declarado e objeção que cada um neutraliza |
| **09** | **Construção da Oferta** | Transição, ancoragem, preço, reason why, garantia, escassez, future pacing |
| **10** | **Provas** | Tabela de casos (nome · nicho · antes→depois · onde aparece) + prova própria + superestruturas |
| **11** | **Objeções Quebradas** | Tabela: objeção → onde é tratada |
| **12** | **Close** | Elementos numerados na ordem |
| **13** | **Elementos Ausentes** | Lista do que a VSL não faz |

---

## OS ARQUIVOS

### Convenção de nomes

```
Transcrição:  docs/references/swipe-file/transcricoes/[VSL] Produto - Expert.md
Análise:      docs/references/swipe-file/[VSL] Analise Produto - Expert.md
PDF:          docs/references/swipe-file/[VSL] Analise Produto - Expert.pdf
```

### A transcrição

Salvar **exatamente como recebida, sem correção**. As colagens costumam vir com trechos comidos por desconfiguração de formatação.

**Não reconstruir o texto no corpo.** Em vez disso, listar os truncamentos no cabeçalho do arquivo, no formato:

```
> ⚠️ Texto preservado exatamente como chegou. Trechos truncados identificados:
> - "trecho como veio" — falta "o que provavelmente estava ali"
```

Motivo: um arquivo de swipe file precisa ser **fonte**, não interpretação. Daqui a seis meses ninguém lembra o que era original e o que foi preenchido.

### O front matter da análise (alimenta a capa do PDF)

```yaml
---
titulo: Nome do Produto
subtitulo: Nome do Expert
kicker: Swipe File · Engenharia Reversa de VSL
resumo: Identificação completa dos elementos de copy: big idea, mecanismos, pontos lógicos, histórias, provas, objeções e oferta.
Produto: descrição curta
Ticket: valor
Nicho: mercado
Formato: VSL curta/longa · tráfego frio · particularidades
Análise: data por extenso
---
```

### Marcadores do markdown (lidos pelo conversor)

| Marcador | Vira |
|---|---|
| `# 04 · Mecanismo de Problema` | Seção com quebra de página |
| `> subtítulo` logo abaixo do `#` | Subtítulo da seção |
| `::callout` … `::` | Bloco destacado em fundo bege |
| `::naotem texto` | Selo preto **NÃO TEM** + texto |
| `::camada Camada 3 — nome` | Rótulo de camada |
| `1. item` | Passo numerado estilizado |
| `> citação` | Citação com barra lateral |
| tabela markdown | Tabela diagramada |

### Gerar o PDF

```bash
python3 scripts/swipe2pdf.py "docs/references/swipe-file/[VSL] Analise Produto - Expert.md"
```

Sai um A4 com capa, ~20 páginas, cada seção abrindo em página própria. Editar o `.md` e rodar de novo regenera em segundos.

---

## CHECAGEM ANTES DE ENTREGAR

- [ ] Todas as 14 seções estão presentes (as ausentes marcadas com **NÃO TEM**)
- [ ] Toda afirmação sobre o copy tem citação literal que a sustente
- [ ] Nomes chiclete separados por função: problema, solução, produto, formato
- [ ] Pergunta paradoxal decomposta na fórmula (grupo · comportamento contraintuitivo · resultado melhor)
- [ ] Provas em tabela com antes→depois e o ponto da VSL onde aparecem
- [ ] Bônus com valor declarado e objeção que cada um neutraliza
- [ ] Truncamentos da transcrição sinalizados, não reconstruídos
- [ ] Entregue **no terminal** — arquivo e PDF só depois do OK do Pedro
