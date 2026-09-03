#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
swipe2pdf — converte uma analise de VSL do swipe file (markdown) em PDF diagramado.

Uso:  python3 scripts/swipe2pdf.py "docs/references/swipe-file/[VSL-01] ....md"

Convencoes do markdown de entrada:
  ---                    front matter: titulo, subtitulo, kicker, resumo + pares Chave: valor (capa)
  # 00 · Titulo          secao (quebra de pagina)
  > texto                logo apos o "#" vira subtitulo da secao; no corpo vira citacao
  ## / ###               subtitulos
  1. item                lista numerada estilizada
  - item                 lista comum
  | a | b |              tabela (1a linha = cabecalho)
  ::callout ... ::       bloco destacado
  ::naotem texto         selo preto "NAO TEM" + texto
  ::camada texto         rotulo de camada
"""
import re, sys, os, subprocess, html as _html

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
* { box-sizing: border-box; }
body { font-family: "Charter","Georgia","Times New Roman",serif; font-size: 10.2pt; line-height: 1.55; color: #1a1a1a; margin: 0; }
h1,h2,h3,.sans { font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; }
.cover { height: 252mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
.cover .kicker { font-family:"Helvetica Neue",sans-serif; font-size: 9pt; letter-spacing: .22em; text-transform: uppercase; color: #8a7a5c; margin-bottom: 10mm; }
.cover h1 { font-family:"Helvetica Neue",sans-serif; font-size: 34pt; line-height: 1.08; margin: 0 0 4mm; letter-spacing: -.02em; }
.cover h2 { font-family:"Helvetica Neue",sans-serif; font-weight: 400; font-size: 14pt; color: #555; margin: 0 0 14mm; border:none; padding:0; }
.rule { height: 3px; background: #1a1a1a; width: 46mm; margin: 0 0 12mm; }
.cover .resumo { font-family:'Helvetica Neue',sans-serif; font-size:10.5pt; color:#444; max-width:120mm; line-height:1.5; }
.meta { border-top: 1px solid #d8d3c8; padding-top: 6mm; margin-top: 12mm; }
.meta table { width: 100%; border-collapse: collapse; font-family:"Helvetica Neue",sans-serif; font-size: 9.5pt; }
.meta td { padding: 2.2mm 0; vertical-align: top; border: none; }
.meta td:first-child { width: 34mm; color: #8a7a5c; text-transform: uppercase; letter-spacing: .08em; font-size: 8pt; padding-top: 3mm; }
h1.sec { font-size: 19pt; margin: 0 0 1mm; padding-top: 2mm; letter-spacing: -.01em; page-break-before: always; page-break-after: avoid; }
h1.sec .num { color: #b8a888; margin-right: 4mm; }
.subtitle { font-family:"Helvetica Neue",sans-serif; font-size: 9.5pt; color: #777; margin: 0 0 7mm; padding-bottom: 4mm; border-bottom: 2px solid #1a1a1a; }
h1.nobreak { page-break-before: auto; }
h2 { font-size: 12.5pt; margin: 8mm 0 2.5mm; page-break-after: avoid; }
h3 { font-size: 10.5pt; margin: 6mm 0 2mm; text-transform: uppercase; letter-spacing: .07em; color: #6b5d43; page-break-after: avoid; }
p { margin: 0 0 3mm; }
ul { margin: 0 0 4mm; padding-left: 6mm; }
li { margin-bottom: 1.6mm; }
blockquote { margin: 4mm 0; padding: 3mm 0 3mm 6mm; border-left: 3px solid #c9bda0; font-style: italic; color: #333; page-break-inside: avoid; }
blockquote p:last-child { margin-bottom: 0; }
table { width: 100%; border-collapse: collapse; margin: 3mm 0 5mm; font-size: 9.3pt; page-break-inside: avoid; }
th { font-family:"Helvetica Neue",sans-serif; font-size: 8pt; text-transform: uppercase; letter-spacing: .07em; text-align: left; padding: 2.2mm 3mm 2.2mm 0; border-bottom: 1.5px solid #1a1a1a; color: #444; }
td { padding: 2.4mm 3mm 2.4mm 0; border-bottom: .5px solid #e2ddd2; vertical-align: top; }
td:last-child, th:last-child { padding-right: 0; }
.callout { background: #f7f4ec; border-left: 3px solid #b8a888; padding: 4mm 5mm; margin: 4mm 0; page-break-inside: avoid; }
.callout p:last-child, .callout blockquote { margin-bottom: 0; }
.callout blockquote { border-left-color:#b8a888; margin-top:0; }
.naotem-line { margin: 4mm 0; page-break-inside: avoid; }
.naotem { display:inline-block; font-family:"Helvetica Neue",sans-serif; font-size:7.5pt; font-weight:700; letter-spacing:.1em; text-transform:uppercase; background:#1a1a1a; color:#fff; padding:.8mm 2mm; border-radius:2px; margin-right:2mm; }
.camada { font-family:"Helvetica Neue",sans-serif; font-size: 8pt; letter-spacing:.1em; text-transform:uppercase; color:#8a7a5c; margin: 6mm 0 2mm; page-break-after: avoid; }
.step { display:flex; gap:4mm; margin-bottom:2.5mm; page-break-inside:avoid; }
.step .n { font-family:"Helvetica Neue",sans-serif; font-weight:700; font-size:9pt; color:#b8a888; min-width:6mm; }
.footer-note { font-size: 8.5pt; color: #777; font-style: italic; border-top: .5px solid #ddd; padding-top: 3mm; margin-top: 8mm; }
"""

def inline(t):
    t = _html.escape(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'`(.+?)`', r'<code>\1</code>', t)
    return t

def parse(md):
    meta, body = {}, md
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', md, re.S)
    if m:
        for line in m.group(1).split('\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                meta[k.strip()] = v.strip()
        body = m.group(2)
    return meta, body

def render(meta, body):
    out, i = [], 0
    lines = body.split('\n')
    first_sec = True
    while i < len(lines):
        ln = lines[i]; s = ln.strip()

        if not s:
            i += 1; continue

        if s.startswith('# '):
            title = s[2:].strip()
            num, rest = '', title
            m = re.match(r'^(\S+)\s*·\s*(.*)$', title)
            if m: num, rest = m.group(1), m.group(2)
            cls = 'sec nobreak' if first_sec else 'sec'
            first_sec = False
            numhtml = '<span class="num">%s</span>' % _html.escape(num) if num else ''
            out.append('<h1 class="%s">%s%s</h1>' % (cls, numhtml, inline(rest)))
            if i+1 < len(lines) and lines[i+1].strip().startswith('> '):
                out.append('<p class="subtitle">%s</p>' % inline(lines[i+1].strip()[2:]))
                i += 1
            i += 1; continue

        if s.startswith('## '):
            out.append('<h2>%s</h2>' % inline(s[3:])); i += 1; continue
        if s.startswith('### '):
            out.append('<h3>%s</h3>' % inline(s[4:])); i += 1; continue

        if s.startswith('::naotem'):
            txt = s[len('::naotem'):].strip()
            out.append('<p class="naotem-line"><span class="naotem">Não tem</span>%s</p>' % (inline(txt) if txt else ''))
            i += 1; continue

        if s.startswith('::camada'):
            out.append('<div class="camada">%s</div>' % inline(s[len('::camada'):].strip()))
            i += 1; continue

        if s == '::callout':
            i += 1; buf = []
            while i < len(lines) and lines[i].strip() != '::':
                buf.append(lines[i]); i += 1
            i += 1
            out.append('<div class="callout">%s</div>' % render(meta, '\n'.join(buf)))
            continue

        if s.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                r = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{2,}:?', c) for c in r if c):
                    rows.append(r)
                i += 1
            if rows:
                h = ''.join('<th>%s</th>' % inline(c) for c in rows[0])
                b = ''.join('<tr>%s</tr>' % ''.join('<td>%s</td>' % inline(c) for c in r) for r in rows[1:])
                out.append('<table><tr>%s</tr>%s</table>' % (h, b))
            continue

        if re.match(r'^\d+\.\s', s):
            while i < len(lines) and re.match(r'^\d+\.\s', lines[i].strip()):
                m = re.match(r'^(\d+)\.\s+(.*)$', lines[i].strip())
                out.append('<div class="step"><div class="n">%02d</div><div>%s</div></div>' % (int(m.group(1)), inline(m.group(2))))
                i += 1
            continue

        if s.startswith('- '):
            items = []
            while i < len(lines) and lines[i].strip().startswith('- '):
                items.append('<li>%s</li>' % inline(lines[i].strip()[2:])); i += 1
            out.append('<ul>%s</ul>' % ''.join(items))
            continue

        if s.startswith('> '):
            buf = []
            while i < len(lines) and lines[i].strip().startswith('> '):
                buf.append(inline(lines[i].strip()[2:])); i += 1
            out.append('<blockquote>%s</blockquote>' % ''.join('<p>%s</p>' % b for b in buf))
            continue

        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|>|\||-\s|\d+\.\s|::)', lines[i].strip()):
            buf.append(lines[i].strip()); i += 1
        out.append('<p>%s</p>' % inline(' '.join(buf)))
    return '\n'.join(out)

def cover(meta):
    skip = {'titulo','subtitulo','kicker','resumo'}
    rows = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (_html.escape(k), inline(v))
                   for k, v in meta.items() if k not in skip)
    return """<div class="cover">
<div class="kicker">%s</div><h1>%s</h1><h2>%s</h2><div class="rule"></div>
<p class="resumo">%s</p><div class="meta"><table>%s</table></div></div>""" % (
        _html.escape(meta.get('kicker','')), _html.escape(meta.get('titulo','')),
        _html.escape(meta.get('subtitulo','')), inline(meta.get('resumo','')), rows)

def main():
    src = sys.argv[1]
    meta, body = parse(open(src, encoding='utf-8').read())
    doc = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s%s</body></html>' % (
        _html.escape(meta.get('titulo','Análise')), CSS, cover(meta), render(meta, body))
    base = os.path.splitext(src)[0]
    tmp = base + '.tmp.html'
    open(tmp, 'w', encoding='utf-8').write(doc)
    pdf = base + '.pdf'
    subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-pdf-header-footer',
                    '--print-to-pdf=' + os.path.abspath(pdf), 'file://' + os.path.abspath(tmp)],
                   capture_output=True)
    os.remove(tmp)
    print('PDF:', pdf)

if __name__ == '__main__':
    main()
