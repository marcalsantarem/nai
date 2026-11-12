# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Idioma:** documentação, commits e conversa em pt-BR. Identificadores de código em inglês. Texto do jogo em pt-BR.
>
> Itens **[Proposta]** são sugestões ainda não aprovadas; **[A definir]** estão em aberto. Não trate proposta como decisão.

## Economia de tokens (regra obrigatória)

- Respostas e relatórios curtos e diretos, sem repetir contexto conhecido.
- Leia só o necessário: trechos e buscas direcionadas, não arquivos inteiros (a especificação e o mockup são grandes).
- Briefings objetivos. Commits agrupados por etapa concluída.

## Git (regras obrigatórias)

- Trabalhe e faça commit **somente na `dev`**. O líder faz commit e push por conta própria ao fechar uma etapa.
- A **`main` é protegida**: nunca commit nem push nela. Só recebe PR `dev` → `main`, aberto pelo dono quando ele pedir.
- Não crie outras branches sem pedido explícito do dono. Versões fechadas ficam só em **tag**.
- Detalhes em [docs/git-workflow.md](docs/git-workflow.md).

## Papel do Claude

O Claude principal é o **AG00 (líder)** e o **único interlocutor do dono**. Ele **gerencia e não implementa**: quebra o trabalho em tasks, escreve briefings, aciona os especialistas (subagents em `.claude/agents/`), confere o diff antes de aceitar, registra decisões, mantém backlog e faz os commits. Código, arte, textos e configs são feitos por um especialista.

- Ao falar com o dono, use sempre "AGxx (nome)", ex.: AG02 (UI).
- Briefing antes de acionar: `docs/briefings/BRF-NNN_AGxx_<entrega>.md`. Acione com "execute o briefing docs/briefings/BRF-NNN_...". Paralelo só sem arquivos em comum.
- Ao concluir uma etapa, envie ao dono duas listas tiradas do backlog: **concluídas** (id + descrição) e **próximas** (id + descrição + agente).
- Autonomia: rotina (commit/push na `dev`, próxima task dependente, backlog) faz e informa depois. Pergunte só sobre produto/design, PR para a `main`, tag/deploy e ações destrutivas.
- Verdade: dono > Bíblia > [docs/decisoes.md](docs/decisoes.md) > documento do agente.

**Se você é um especialista:** siga seu `docs/agentes/AGxx_*.md` e o briefing; não faça commit, push nem branch; fique no escopo; não altere arquivos compartilhados sem autorização; reporte o que mudou e o que **não** foi verificado.

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [docs/00_biblia_projeto.md](docs/00_biblia_projeto.md) | Bíblia: pitch, escopo do marco atual, time, regras. **Leia primeiro.** |
| [docs/especificacao.md](docs/especificacao.md) | Especificação completa do jogo (fonte da verdade de mecânicas, conteúdo, cores, áudio, salvamento, PWA) |
| [docs/referencia/mockup-mobile.html](docs/referencia/mockup-mobile.html) | Mockup visual obrigatório (4 telas). Pacote que se desempacota: `__bundler/manifest` (gzip+base64, inclui as fontes) e `__bundler/template` (HTML em JSON). Abra no navegador; não leia inteiro |
| [docs/referencia/mockup-src/](docs/referencia/mockup-src/) | Mockup extraído e legível, uma tela por arquivo, com índice no README. **Use este, não o pacote.** A arte é SVG estático (não há funções de desenho): `iso.js`/`art.js` são reconstruídos a partir das coordenadas |
| [docs/backlog.md](docs/backlog.md) · [docs/roadmap.md](docs/roadmap.md) | Tasks (T-NNN) e marcos/versões |
| [docs/decisoes.md](docs/decisoes.md) | Decisões numeradas com estado. **Atualize quando algo for decidido.** |
| [docs/agentes/](docs/agentes/) · `docs/briefings/` | Instruções dos agentes e briefings |

## O projeto (resumo; detalhe na especificação)

Nai's Cafe: jogo cozy de cafeteria, sem falha, presente pessoal para uma jogadora. iPhone em retrato (390 × 844; 360–430 de largura), PWA instalável e offline.

- **Stack:** HTML, CSS e JavaScript puro (módulos ES). Sem framework e **sem build**: não há comando de build, lint ou teste. Rodar localmente servindo a pasta (`npx serve .` ou `python -m http.server`).
- **Sem arquivos de imagem ou áudio** (exceto `icons/`): cena em canvas 2D desenhada por código, UI em HTML/CSS, som por Web Audio. Sem gradientes, desfoques nem emoji.
- **Só toque único**, alvos ≥ 44 pt. Nenhum estado de falha.
- **Estrutura prevista:** `index.html`, `css/{tokens,ui}.css`, `js/{main,state,data,iso,art,sim,audio}.js`, `js/screens/*.js`, `manifest.webmanifest`, `sw.js`, `icons/`, `fonts/`.
- **Isométrico:** `x = (gx − gy) × 30`, `y = (gx + gy) × 15 − altura`, grade 6 × 6, desenho em ordem crescente de `gx + gy`; toque volta à grade pela projeção inversa. Miniaturas e retratos usam as mesmas funções de `art.js`.
- **Salvamento:** `localStorage`, chave `nais-cafe-v1`, a cada mudança, tolerando falha.
- **Publicação:** Netlify, sem build. Push na `dev` → https://dev--naicafe.netlify.app; merge na `main` → https://naicafe.netlify.app (decisão 9).
