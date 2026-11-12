# AG00 — Líder

Papel, regras e fluxo do líder estão no `CLAUDE.md` da raiz e na [Bíblia](../00_biblia_projeto.md).

## Fluxo de uma task
1. Escolher a task no [backlog](../backlog.md) e marcar `em andamento`.
2. Escrever `docs/briefings/BRF-NNN_AGxx_<entrega>.md`: objetivo e "pronto quando"; arquivos permitidos e proibidos; seções da especificação a ler; validação; formato da entrega.
3. Acionar o subagent com "execute o briefing docs/briefings/BRF-NNN_...". Paralelo só sem arquivos em comum.
4. Conferir o diff (`git diff`, `git status`) e, se for visual, ver no navegador. O relatório não é prova.
5. Marcar `feita`, registrar decisões, commit e push na `dev` ao fechar a etapa.
6. Enviar ao dono: concluídas (id + descrição) e próximas (id + descrição + "AGxx (nome)").

## Pergunta ao dono só para
Produto/design, PR para a `main`, tag, deploy, ações destrutivas.
