# Swipe File — Engenharia Reversa de VSLs

Cada VSL tem três arquivos: a **análise** (identificação de elementos), o **PDF** diagramado e a **transcrição** original.

| VSL | Produto | Ticket | Arquivos |
|---|---|---|---|
| **Código Viral** — Oney Araújo | Treinamento de viralização, 3h | R$197 | `[VSL] Analise Codigo Viral - Oney Araujo` (.md e .pdf)<br>`transcricoes/[VSL] Codigo Viral - Oney Araujo.md` |
| **Efeito Di** — Diandra Santos | Experiência digital / imersão | R$297 | `[VSL] Analise Efeito Di - Diandra Santos` (.md e .pdf)<br>`transcricoes/[VSL] Efeito Di - Diandra Santos.md` |
| **Stories para Enriquecer** — Luana Carolina | Curso de vendas por stories | R$697 | `[VSL] Analise Stories para Enriquecer - Luana Carolina` (.md e .pdf)<br>`transcricoes/[VSL] Stories para Enriquecer - Luana Carolina.md` |

## Convenção de nomes

- **Transcrição:** `[VSL] Nome do Produto - Nome do Expert.md` — fica em `transcricoes/`
- **Análise:** `[VSL] Analise Nome do Produto - Nome do Expert.md` (e o `.pdf` de mesmo nome)

## Formato das análises

Estrutura fixa em 14 seções, para permitir comparação lado a lado:

`00 Fundamentos` (avatar, big idea, nomes chiclete, pergunta paradoxal, única crença) · `01 Lead` · `02 Background Story` · `03 Emotional Story` · `04 Mecanismo de Problema` · `05 Mecanismo de Solução` · `06 Pontos Lógicos` · `07 Discovery & Product Build Up` · `08 Composição da Oferta` · `09 Construção da Oferta` · `10 Provas` · `11 Objeções Quebradas` · `12 Close` · `13 Elementos Ausentes`

Elementos que a VSL não possui são marcados com **NÃO TEM** em vez de omitidos — a ausência é informação.

## Gerar o PDF

```bash
python3 scripts/swipe2pdf.py "docs/references/swipe-file/[VSL] Analise Nome - Expert.md"
```

Convenções do markdown de entrada estão documentadas no topo de `scripts/swipe2pdf.py`.

## Sobre as transcrições

Preservadas **exatamente como recebidas**, sem correção. Todas chegaram com trechos truncados por desconfiguração de formatação na origem; os pontos afetados estão listados no cabeçalho de cada arquivo. Nada foi reconstruído no corpo do texto.

## O processo

O fluxo de trabalho — do envio da transcrição até o PDF — está em `skills/zoe-copywriter/playbooks/vsl-engenharia-reversa.md`.

```
1. Pedro envia a transcrição da VSL
2. Análise entregue no terminal
3. Pedro revisa e corrige
4. Só então: salvar o .md e gerar o PDF
```

## Referência de método

A grade de análise segue o `Playbook VSL — DR Expert` (`docs/library/books/playbook-vsl-dr-expert.md` e `--sistema.md`).
