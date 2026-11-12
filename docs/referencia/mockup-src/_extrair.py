"""Extrai o codigo legivel de docs/referencia/mockup-mobile.html (T-002).

Uso (da raiz do projeto):  python -I docs/referencia/mockup-src/_extrair.py
So biblioteca padrao. Nao altera o mockup; reescreve os arquivos desta pasta.

O mockup e um pacote em dois niveis:
  nivel 1: manifest {uuid: {mime, compressed, data}} + template (quadro com 4 iframes);
  nivel 2: cada iframe e outro pacote com o runtime "dc", React, 2 fontes woff2
           e um template com a tela (HTML + SVG estatico, sem JS de desenho).
"""
import base64
import gzip
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '..', 'mockup-mobile.html'))

# nome do arquivo de saida por titulo do iframe
PAGE_FILES = {
    'Cafeteria': '01-cafeteria.html',
    'Preparo da bebida': '02-preparo.html',
    'Decorar': '03-decorar.html',
    'Clientes da casa': '04-clientes.html',
}

VOID = {'meta', 'link', 'br', 'img', 'input', 'hr', 'source', 'wbr', 'area', 'col', 'base'}
UUID = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'


def script_block(html, kind):
    m = re.search(r'<script type="__bundler/%s"[^>]*>(.*?)</script>' % kind, html, re.S)
    return json.loads(m.group(1))


def unbundle(html):
    res = {}
    for uid, v in script_block(html, 'manifest').items():
        data = base64.b64decode(v['data'])
        if v.get('compressed'):
            data = gzip.decompress(data)
        res[uid] = (v['mime'], data)
    return res, script_block(html, 'template')


# ---------- pretty printer minimo (HTML + SVG inline) ----------
TOKEN = re.compile(r'<!--.*?-->|<(style|script)\b[^>]*>.*?</\1\s*>|<[^>]+>|[^<]+', re.S | re.I)


class Node:
    def __init__(self, tag, raw):
        self.tag, self.raw, self.kids, self.end = tag, raw, [], ''


def parse(html):
    root = Node(None, '')
    stack = [root]
    for m in TOKEN.finditer(html):
        t = m.group(0)
        if t.startswith('</'):
            name = t[2:-1].strip().lower()
            for i in range(len(stack) - 1, 0, -1):  # fecha ate o par
                if stack[i].tag == name:
                    stack[i].end = t
                    del stack[i:]
                    break
        elif t.startswith('<!') or not t.startswith('<'):
            stack[-1].kids.append(t)  # texto, comentario, doctype
        elif m.group(1):
            stack[-1].kids.append(t)  # style/script crus
        else:
            name = re.match(r'<([a-zA-Z0-9-]+)', t).group(1).lower()
            n = Node(name, t)
            stack[-1].kids.append(n)
            if not (t.endswith('/>') or name in VOID):
                stack.append(n)
    return root


def flat(n):
    if isinstance(n, str):
        return n
    return n.raw + ''.join(flat(k) for k in n.kids) + n.end


def has_text(n):
    return any(isinstance(k, str) and k.strip() and not k.startswith('<') for k in n.kids)


def serialize(n, depth=0, out=None):
    out = [] if out is None else out
    pad = '  ' * depth
    for k in n.kids:
        if isinstance(k, str):
            if k.strip():
                out.append(pad + k.strip())  # texto, comentario ou <style>/<script> cru
            continue
        elem_kids = [c for c in k.kids if not isinstance(c, str)]
        if not elem_kids or has_text(k) or k.tag in ('text', 'title'):
            out.append(pad + flat(k))  # folha ou conteudo misto: uma linha so
        else:
            out.append(pad + k.raw)
            serialize(k, depth + 1, out)
            if k.end:
                out.append(pad + k.end)
    return out


# ---------- limpeza da tela ----------
FONT_FACE = re.compile(r'/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', re.S)


def clean_page(tpl, fonts):
    """Remove runtime e fontes embutidas; desembrulha <x-dc>/<helmet>; restaura viewBox."""
    def strip_fonts(m):
        body = m.group(2)
        u = re.search(r'url\("(%s)"\)' % UUID, body)
        if u:  # so os subconjuntos embutidos; os demais apontam para fonts.gstatic.com
            fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
            wt = re.search(r'font-weight:\s*(\d+)', body).group(1)
            f = fonts.setdefault(u.group(1), [fam, m.group(1), []])
            if wt not in f[2]:
                f[2].append(wt)
        return ''
    tpl = FONT_FACE.sub(strip_fonts, tpl)
    tpl = re.sub(r'<style>\s*</style>\s*', '', tpl)
    tpl = re.sub(r'<script src="%s"></script>' % UUID,
                 '<!-- runtime "dc" omitido (ver README) -->', tpl)
    helmet = re.search(r'<helmet>(.*?)</helmet>', tpl, re.S).group(1).strip()
    tpl = re.sub(r'<helmet>.*?</helmet>', '', tpl, flags=re.S)
    tpl = tpl.replace('</head>', '<!-- @font-face (Baloo 2, Nunito) omitido: fontes na T-003 -->\n'
                      + helmet + '\n</head>', 1)
    tpl = tpl.replace('<x-dc>', '').replace('</x-dc>', '')
    tpl = tpl.replace('sc-camel-view-box=', 'viewBox=')
    tpl = tpl.replace('sc-camel-clip-path-units=', 'clipPathUnits=')
    return tpl


def pretty(html):
    return '\n'.join(serialize(parse(html))) + '\n'


# ---------- indice para o README ----------
# Partes da cena isometrica em 01-cafeteria.html (leitura manual, aproximada).
# Coordenadas do SVG: origem no canto de tras do piso; losango de 60x30 por celula.
ISO_PARTS = [
    (47, 48, 'laterais (espessura) do bloco do piso'),
    (49, 84, 'piso: 36 losangos 60x30 alternando #ecc194/#e2b181 (grade 6x6)'),
    (85, 125, 'parede esquerda, <g matrix(1 -0.5 0 1 0 0)>: faixa menta, lambri, quadros, relogio (113-115), bandeirinhas (116-124)'),
    (126, 179, 'parede direita, <g matrix(1 0.5 0 1 0 0)>: lousa "Cardapio" (143-151), janela com cortinas (152-165), cordao de luzes (166-178)'),
    (180, 185, 'luz da janela no chao; tapetes'),
    (186, 218, 'estante com 3 prateleiras de livros'),
    (219, 238, 'barista atras do balcao'),
    (239, 242, 'balcao (bloco isometrico: frente, lado, tampo)'),
    (243, 261, 'sobre o balcao: maquina de espresso, xicaras, pote, bolo'),
    (262, 269, '2 luminarias pendentes'),
    (270, 277, 'planta em vaso (esquerda)'),
    (278, 295, 'cliente 1 (cabelo castanho; mesmo rosto do retrato da linha 395)'),
    (296, 313, 'cliente 2 (cabelo branco, roupa lilas)'),
    (314, 323, 'planta alta em vaso (direita)'),
    (324, 332, 'gato dormindo na caminha, com "z"'),
    (333, 349, 'mesa com xicara entre 2 banquinhos'),
    (350, 363, 'cliente 3 (cabelo escuro, roupa azul)'),
    (364, 369, 'luminaria de chao'),
    (370, 382, 'pilha de caixas amarelas'),
    (383, 390, 'baloes de pedido sobre os clientes (gota, xicara, "Latte")'),
]


def context(lines, i):
    """Texto ou aria-label perto do SVG da linha i (1-based), para rotular desenhos sem aria-label."""
    for j in (i - 2, i - 3):  # botao/elemento pai com aria-label
        lab = re.search(r'aria-label="([^"]+)"', lines[j]) if j >= 0 else None
        if lab:
            return lab.group(1)
    depth = 0
    for j in range(i - 1, min(len(lines), i + 40)):
        s = lines[j].strip()
        depth += s.startswith('<svg') - s.startswith('</svg')
        if depth == 0 and j >= i:
            txt = re.sub(r'<[^>]+>', ' ', s).strip()
            if txt:
                return txt
    return ''


def svg_index(fname, text):
    rows = []
    lines = text.split('\n')
    for i, line in enumerate(lines, 1):
        s = line.strip()
        if not s.startswith('<svg'):
            continue
        vb = re.search(r'viewBox="([^"]+)"', s)
        lab = re.search(r'aria-label="([^"]+)"', s)
        w = re.search(r' width="(\d+)"', s)
        h = re.search(r' height="(\d+)"', s)
        vb = vb.group(1) if vb else ''
        if lab:
            what = lab.group(1)
        else:
            kind = {'0 0 24 24': 'icone', '0 0 64 64': 'retrato'}.get(vb, 'miniatura')
            what = '%s, perto de: "%s"' % (kind, context(lines, i)[:60])
        rows.append((fname, i, vb, '%sx%s' % (w.group(1) if w else '?', h.group(1) if h else '?'), what))
    return rows


def main():
    html = open(SRC, encoding='utf-8').read()
    res, board = unbundle(html)
    fonts, binaries, vendor = {}, [], []
    shapes = Counter()
    colors = Counter()
    pages = []
    for title, fname in PAGE_FILES.items():
        uid = re.search(r'about:blank#(%s)" title="%s"' % (UUID, re.escape(title)), board).group(1)
        board = board.replace('about:blank#' + uid, fname)
        inner_res, tpl = unbundle(res[uid][1].decode('utf-8'))
        for iu, (mime, data) in inner_res.items():
            if mime.startswith('font/'):
                binaries.append((fname, iu, mime, len(data)))
            else:
                head = data[:80].decode('utf-8', 'replace')
                kind = 'runtime dc' if 'dc-runtime' in head else ('react-dom' if 'react-dom' in head else 'react')
                vendor.append((fname, iu, mime, len(data), kind))
        text = pretty(clean_page(tpl, fonts))
        with open(os.path.join(HERE, fname), 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        shapes.update(re.findall(r'<(polygon|ellipse|rect|path|circle|text)\b', text))
        colors.update(c.lower() for c in re.findall(r'#[0-9a-fA-F]{6}\b', text))
        pages.append((title, fname, uid, text))

    board = re.sub(r'(<title>)(.*?)(</title>)', r'\1\2\3', board)
    with open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(pretty(board))

    write_readme(pages, binaries, vendor, fonts, colors, shapes)
    print('ok:', ', '.join(['index.html'] + [p[1] for p in pages] + ['README.md']))


def write_readme(pages, binaries, vendor, fonts, colors, shapes):
    L = []
    a = L.append
    a('# mockup-src — fonte legivel do mockup')
    a('')
    a('Gerado por `_extrair.py` a partir de `../mockup-mobile.html` (nao editar a mao; rode '
      '`python -I docs/referencia/mockup-src/_extrair.py` da raiz).')
    a('')
    a('## Arquivos')
    a('')
    a('| Arquivo | O que e |')
    a('|---|---|')
    a('| `index.html` | Quadro do mockup: as 4 telas lado a lado em iframes 390x844 (agora apontando para os arquivos abaixo). |')
    for title, fname, uid, text in pages:
        a('| `%s` | Tela "%s" (%d linhas). Iframe `%s` do pacote. |' % (fname, title, text.count('\n'), uid))
    a('| `_extrair.py` | Refaz a extracao. |')
    a('')
    a('**Importante: o mockup nao tem funcoes de desenho.** Cada tela e HTML com estilos inline e '
      'SVG estatico (poligonos, elipses, retangulos ja calculados). O unico script de cada tela e um '
      '`class Component extends DCLogic { renderVals() { return {}; } }` vazio, mantido no fim do arquivo. '
      'Nao ha CSS nem JS grandes para separar; por isso nao existem arquivos `.js`/`.css` aqui. '
      'O desenho por codigo (`js/iso.js`, `js/art.js`) tera de ser reconstruido a partir das coordenadas dos SVGs.')
    a('')
    a('Mudancas em relacao ao original (para abrir sem o runtime): `sc-camel-view-box` virou `viewBox`; '
      '`<x-dc>`/`<helmet>` desembrulhados (estilos foram para o `<head>`); `@font-face` e o `<script src>` do '
      'runtime removidos. Sem as fontes, Baloo 2 e Nunito caem para o fallback do sistema.')
    a('')
    a('## Indice dos desenhos (SVG)')
    a('')
    a('| Arquivo:linha | viewBox | Tamanho | Rotulo / o que desenha |')
    a('|---|---|---|---|')
    for title, fname, uid, text in pages:
        for f, ln, vb, sz, what in svg_index(fname, text):
            a('| `%s:%d` | `%s` | %s | %s |' % (f, ln, vb, sz, what))
    a('')
    a('### Partes da cena isometrica (`01-cafeteria.html`, leitura manual aproximada)')
    a('')
    a('As formas estao em ordem de pintura (de tras para frente). `03-decorar.html` repete a mesma cena '
      '(9 linhas antes) e acrescenta um `<g opacity="0.8">` com a previa do item sendo posicionado.')
    a('')
    a('| Linhas | O que desenha |')
    a('|---|---|')
    cafe = pages[0][3].split('\n')
    if not (cafe[46].strip().startswith('<polygon') and cafe[390].strip() == '</svg>'):
        print('aviso: linhas da cena isometrica mudaram; revise ISO_PARTS', file=sys.stderr)
    for s, e, d in ISO_PARTS:
        a('| %d-%d | %s |' % (s, e, d))
    a('')
    a('Onde fica o resto: paleta (secao abaixo; cores estao inline em `fill`/`style`); telas = um arquivo '
      'cada; componentes de interface (cabecalho com nivel e moedas, cartao de pedido, barra de navegacao, '
      'cartoes da loja, lista de clientes) sao `<header>`, `<section>`, `<nav>`, `<ul>/<li>` com estilo inline. '
      'Obs.: o texto do mockup ainda diz "Nossa Cafeteria"; o nome do jogo e "Nai\'s Cafe".')
    a('')
    a('Contagem de formas nas 4 telas: ' + ', '.join('%s %d' % kv for kv in shapes.most_common()) + '.')
    a('')
    a('## Paleta (cores hex mais usadas nas 4 telas)')
    a('')
    a('| Cor | Usos |')
    a('|---|---|')
    for c, n in colors.most_common(24):
        a('| `%s` | %d |' % (c, n))
    a('')
    a('## Recursos binarios e de terceiros (nao extraidos)')
    a('')
    a('Fontes (T-003). Cada tela embute as mesmas 2 fontes com uuids proprios:')
    a('')
    a('| Tela | uuid | mime | bytes | familia / subconjunto / pesos |')
    a('|---|---|---|---|---|')
    for fname, uid, mime, size in binaries:
        fam, sub, wts = fonts.get(uid, ('?', '?', []))
        a('| `%s` | `%s` | %s | %d | %s / %s / %s |' % (fname, uid, mime, size, fam, sub, ' '.join(wts)))
    a('')
    a('Os subconjuntos devanagari, vietnamese e latin-ext nao estao embutidos: o original os pede a '
      'fonts.gstatic.com (Baloo 2 v23, Nunito v32).')
    a('')
    a('JavaScript de terceiros (iguais nas 4 telas; necessarios so para o runtime do pacote):')
    a('')
    a('| Tela | uuid | mime | bytes | o que e |')
    a('|---|---|---|---|---|')
    for fname, uid, mime, size, kind in vendor:
        a('| `%s` | `%s` | %s | %d | %s |' % (fname, uid, mime, size, kind))
    a('')
    with open(os.path.join(HERE, 'README.md'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(L))


if __name__ == '__main__':
    sys.exit(main())
