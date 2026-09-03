# Swipe File — Engenharia Reversa de VSLs

Cada VSL tem três arquivos: a **análise** (identificação de elementos), o **PDF** diagramado e a **transcrição** original.

| # | VSL | Produto | Ticket | Análise | PDF | Transcrição |
|---|---|---|---|---|---|---|
| 01 | **Código Viral** — Oney Araújo | Treinamento de viralização, 3h | R$197 | `[VSL-01] ....md` | `[VSL-01] ....pdf` | `transcricoes/[VSL-01] ... (transcricao).md` |
| 02 | **Efeito Di** — Diandra Santos | Experiência digital / imersão | R$297 | `[VSL-02] ....md` | `[VSL-02] ....pdf` | `transcricoes/[VSL-02] ... (transcricao).md` |
| 03 | **Stories para Enriquecer** — Luana Carolina | Curso de vendas por stories | R$697 | `[VSL-03] ....md` | `[VSL-03] ....pdf` | `transcricoes/[VSL-03] ... (transcricao).md` |

## Formato das análises

Estrutura fixa em 14 seções, para permitir comparação lado a lado:

`00 Fundamentos` (avatar, big idea, nomes chiclete, pergunta paradoxal, única crença) · `01 Lead` · `02 Background Story` · `03 Emotional Story` · `04 Mecanismo de Problema` · `05 Mecanismo de Solução` · `06 Pontos Lógicos` · `07 Discovery & Product Build Up` · `08 Composição da Oferta` · `09 Construção da Oferta` · `10 Provas` · `11 Objeções Quebradas` · `12 Close` · `13 Elementos Ausentes`

Elementos que a VSL não possui são marcados com **NÃO TEM** em vez de omitidos — a ausência é informação.

## Gerar o PDF

```bash
python3 scripts/swipe2pdf.py "docs/references/swipe-file/[VSL-XX] Nome.md"
```

Convenções do markdown de entrada estão documentadas no topo de `scripts/swipe2pdf.py`.

## Sobre as transcrições

Preservadas **exatamente como recebidas**, sem correção. Todas chegaram com trechos truncados por desconfiguração de formatação na origem; os pontos afetados estão listados no cabeçalho de cada arquivo. Nada foi reconstruído no corpo do texto.

## Referência de método

A grade de análise segue o `Playbook VSL — DR Expert` (`docs/library/books/playbook-vsl-dr-expert.md` e `--sistema.md`).
