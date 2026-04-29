# Tasks: FOCO, Fases e Remocao de IA Smell

Data: 2026-04-28
Status geral: `done_except_external_mobile_validation`
Plano vinculado: `docs/superpowers/plans/2026-04-28-focus-phase-ia-smell-executive-plan.md`

## Legenda de Status

- `pending`: task ainda nao iniciada.
- `in_progress`: task em execucao ativa.
- `blocked`: task aguardando decisao, dependencia ou recurso externo.
- `review`: implementada, aguardando revisao/validacao.
- `done`: validada e concluida.
- `cancelled`: removida do escopo por decisao explicita.

## Regra de Mudanca de Status

Cada mudanca de status deve ser registrada na linha `Status Log` da task com:

- data/hora;
- status anterior;
- novo status;
- motivo;
- evidencia ou comando quando aplicavel.

Modelo:

```text
Status Log:
- 2026-04-28 HH:MM: pending -> in_progress: inicio da implementacao. Evidencia: branch/local workspace pronto.
```

## Gates Globais

- Gate G1: nenhuma mudanca de regra sem teste RED primeiro.
- Gate G2: `packages/game-core` nao deve importar React, DOM, Expo ou storage.
- Gate G3: conteudo e balanceamento devem viver em `packages/game-content` quando forem editaveis por fase.
- Gate G4: browser-proof deve cobrir desktop e mobile-width antes de fechamento.
- Gate G5: fechamento exige `npm run test`, `npm run typecheck --workspaces --if-present`, `npm run build`.

## Revisao de Fechamento

- 2026-04-28 23:53: review independente de regras encontrou e foi corrigido: `x^0` simbolico agora declara `x != 0`; `FOCUS_GAINED` nao emite `amount: 0` quando ja esta no cap.
- 2026-04-28 23:53: review independente de UI/runtime encontrou e foi corrigido: intervalo de decaimento fica ocioso quando FOCO e zero; HUD mobile remove emojis estruturais remanescentes.
- 2026-04-28 23:53: prova final apos correcoes: `npm run test`, `npm run typecheck --workspaces --if-present`, `npm run build` passaram.
- 2026-04-28 23:53: boundary proof do `game-core`: busca por React/content/storage/DOM/browser APIs em `packages/game-core/src` retornou sem achados.

## Marco 0: Preparacao

### T0.1 Confirmar faixa de execucao

Status: `done`
Prioridade: Alta
Responsavel: Usuario + agente

Descricao:
Escolher a faixa de execucao antes de alterar codigo.

Opcoes:

- Faixa 1: FOCO apenas.
- Faixa 2: FOCO + fases/questionarios.
- Faixa 3: FOCO + fases/questionarios + anti IA Smell visual.

Criterios de aceite:

- Uma faixa escolhida explicitamente.
- Escopo residual registrado.

Status Log:

- 2026-04-28 23:22: pending -> done: usuario autorizou continuar execucao completa. Evidencia: solicitacao "Continue if you have next steps".

### T0.2 Criar ponto de controle Git

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Antes de executar implementacao, confirmar branch limpa ou registrar alteracoes existentes. Se necessario, criar branch de trabalho.

Criterios de aceite:

- `git status --short --branch` registrado.
- Branch de trabalho definida.

Status Log:

- 2026-04-28 23:22: pending -> done: branch de trabalho confirmada. Evidencia: `git status --short --branch` mostrou `## execute-focus-phase-ia-smell`.

## Marco 1: Regras de FOCO

### T1.1 Escrever testes RED para ganho menor de FOCO

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Atualizar testes em `packages/game-core/src/__tests__/game-reducer.test.ts` para provar que acerto simples nao concede +15. O valor alvo recomendado e +5.

Criterios de aceite:

- Teste falha antes da implementacao.
- Falha ocorre pelo valor de FOCO, nao por erro de sintaxe.

Status Log:

- 2026-04-28 23:22: pending -> done: teste RED criado e depois validado. Evidencia: `npm run test -w @reino/game-core`.

### T1.2 Implementar ganho base e bonus de combo

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Implementar ganho base menor e bonus pequeno para combo 3+. A regra deve ser configuravel em balanceamento, nao hard-coded no reducer.

Arquivos provaveis:

- `packages/game-core/src/types.ts`
- `packages/game-core/src/game-reducer.ts`
- `packages/game-content/src/balance.ts`

Criterios de aceite:

- Acerto simples soma FOCO baixo.
- Combo 3+ soma bonus limitado.
- Testes passam.

Status Log:

- 2026-04-28 23:22: pending -> done: ganho base +5 e bonus configuravel de combo implementados. Evidencia: `npm run test -w @reino/game-core`.

### T1.3 Escrever testes RED para cap progressivo por fase

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Testar que fases iniciais nao permitem FOCO 100/100 cedo demais. Exemplo: fase 1 cap 30, fase 2 cap 45.

Criterios de aceite:

- Teste falha com regra atual.
- Teste expressa cap por fase ou por indice de fase.

Status Log:

- 2026-04-28 23:22: pending -> done: teste de cap progressivo criado e validado. Evidencia: `npm run test -w @reino/game-core`.

### T1.4 Implementar cap progressivo de FOCO

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar configuracao de cap por fase em conteudo/balanceamento e aplicar no ganho de FOCO.

Criterios de aceite:

- FOCO nao passa do cap da fase atual.
- Fases 5 e 6 podem chegar a 100.
- Regra coberta por testes.

Status Log:

- 2026-04-28 23:22: pending -> done: `focusCapByLevel` aplicado no ganho de FOCO. Evidencia: `npm run test -w @reino/game-core`.

### T1.5 Escrever testes RED para decaimento de FOCO apos 5 segundos

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar teste de acao/tick que so reduz FOCO depois da janela de calma de 5 segundos.

Criterios de aceite:

- Antes de 5s, FOCO nao reduz.
- Depois de 5s, FOCO reduz conforme taxa.
- Teste falha antes da implementacao.

Status Log:

- 2026-04-28 23:22: pending -> done: teste de `FOCUS_DECAY_TICK` cobre janela de 5s. Evidencia: `npm run test -w @reino/game-core`.

### T1.6 Implementar decaimento de FOCO no game-core

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar acao pura para decaimento, como `FOCUS_DECAY_TICK`, ou modelo equivalente. A UI deve disparar ticks, mas a regra deve ser calculada no core.

Criterios de aceite:

- Decaimento nao acontece antes de 5s.
- Fases sem timer drenam devagar.
- Fases com timer drenam mais rapido.
- FOCO nunca fica negativo.

Status Log:

- 2026-04-28 23:22: pending -> done: decaimento puro no core implementado para fases com e sem timer. Evidencia: `npm run test -w @reino/game-core`.

### T1.7 Revisar relacao entre timer e FOCO

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Reduzir ou remover `focusTimerBonusSeconds` se ele continuar anulando tensao das fases temporizadas. Preferir timer como pressao e FOCO como protecao drenavel.

Criterios de aceite:

- Regra documentada no balanceamento.
- Timer das fases 5 e 6 continua perceptivelmente desafiador.

Status Log:

- 2026-04-28 23:22: pending -> done: bonus de timer por FOCO removido via `focusTimerBonusSeconds: 0`, mantendo timer como pressao. Evidencia: `packages/game-content/src/balance.ts`.

## Marco 2: Runtime e UI de FOCO

### T2.1 Conectar decaimento de FOCO nos controllers web/mobile

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Disparar ticks de decaimento enquanto uma questao estiver ativa. Implementacao deve evitar duplicar regra entre web e mobile.

Arquivos provaveis:

- `apps/web/src/hooks/useGameController.ts`
- `apps/mobile/src/hooks/useGameController.ts`

Criterios de aceite:

- Decaimento ocorre apos 5s em fases sem timer.
- Decaimento ocorre em fases com timer.
- Intervalos sao limpos corretamente ao trocar questao/tela.

Status Log:

- 2026-04-28 23:22: pending -> done: web/mobile disparam `FOCUS_DECAY_TICK` enquanto questao esta ativa e limpam intervalos. Evidencia: `npm run typecheck --workspaces --if-present`.

### T2.2 Mostrar countdown de drenagem no HUD

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar texto visual como "FOCO drena em 3s" antes do decaimento e "FOCO drenando" apos a janela de calma.

Criterios de aceite:

- Desktop mostra estado sem quebrar HUD.
- Mobile mostra estado sem ocupar espaco excessivo.
- Texto corresponde ao estado real.

Status Log:

- 2026-04-28 23:22: pending -> done: HUD web/mobile mostra estado de drenagem e cap por fase. Evidencia: `npm run typecheck --workspaces --if-present`.

### T2.3 Feedback local de ganho/perda de FOCO

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Exibir `+5 FOCO`, `-1 FOCO`, `FOCO absorveu dano` perto da barra, evitando overlay central.

Criterios de aceite:

- Feedback nao empurra layout.
- Feedback some sozinho.
- Feedback respeita reduced motion.

Status Log:

- 2026-04-28 23:22: pending -> done: HUD web/mobile mostra `+FOCO`, `-FOCO` e absorcao de dano junto da barra. Evidencia: `npm run typecheck --workspaces --if-present`.

### T2.4 Browser-proof de FOCO

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Validar no browser os estados de FOCO em desktop e mobile-width.

Cenarios:

- FOCO inicia zerado.
- Acerto aumenta pouco.
- Demora apos 5s drena.
- Erro consome FOCO antes de HP.
- Timer consome FOCO/HP conforme regra.

Criterios de aceite:

- Screenshots ou artefatos registrados em `.tmp/`.
- Achados corrigidos antes de seguir.

Status Log:

- 2026-04-28 23:22: pending -> done: FOCO validado em desktop, tablet e mobile-width com screenshots. Evidencia: `focus-proof-battle-desktop-focus-drain`, `focus-proof-battle-tablet-width`, `focus-proof-battle-mobile-width`.

## Marco 3: Fases e Questoes

### T3.1 Testes RED para fase 4 nao trivial

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Criar testes para garantir que a fase do zero nao gera apenas uma forma de pergunta com resposta textual identica.

Criterios de aceite:

- Teste falha no modelo atual se ele so produzir `base^0 = ?`.

Status Log:

- 2026-04-28 23:22: pending -> done: teste RED de variedade da fase 4 criado e validado. Evidencia: `npm run test -w @reino/game-core`.

### T3.2 Implementar pool variado da fase 4

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar formatos como `a^0`, `x^0`, `a^m / a^m = a^?` mantendo a finalidade da fase.

Criterios de aceite:

- Perguntas continuam matematicamente corretas.
- Distractor `0` aparece quando adequado.
- Testes cobrem formatos.

Status Log:

- 2026-04-28 23:22: pending -> done: pool de zero expoente inclui direto, simbolico e divisao por si mesma. Evidencia: `npm run test -w @reino/game-core`.

### T3.3 Testes RED para fase 6 realmente mista

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Criar testes para garantir que a fase final possui mais de um tipo de expressao e mistura propriedades ja ensinadas.

Criterios de aceite:

- Teste falha se a fase 6 continuar sempre no formato atual fixo.

Status Log:

- 2026-04-28 23:22: pending -> done: teste RED de fase 6 mista criado e validado. Evidencia: `npm run test -w @reino/game-core`.

### T3.4 Implementar pool misto da fase 6

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Adicionar formatos de produto/divisao, potencia de potencia, zero e negativo simples em combinacoes controladas.

Criterios de aceite:

- Questoes nao fogem das regras ensinadas.
- Respostas e distractors permanecem validos.
- Testes passam.

Status Log:

- 2026-04-28 23:22: pending -> done: fase complexa mistura produto/divisao, potencia de potencia, zero e negativo. Evidencia: `npm run test -w @reino/game-core`.

### T3.5 Ajustar mensagens do professor por fase/regra

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Mensagens devem explicar a regra aplicada, especialmente em erro, timeout e vitoria.

Criterios de aceite:

- Fase 1 fala soma.
- Fase 2 fala subtracao.
- Fase 3 fala multiplicacao.
- Fase 4 fala unidade/zero.
- Fase 5 fala inverso.
- Fase 6 fala resolver por etapas.

Status Log:

- 2026-04-28 23:22: pending -> done: timeout do professor contextualizado por propriedade. Evidencia: `npm run test -w @reino/game-content`.

## Marco 4: Anti IA Smell Visual

### T4.1 Criar baseline de IA Smell antes da mudanca

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Registrar pontuacao de smell atual com matriz: neon, framework leakage, card soup, fake data, tipografia, materialidade, memorabilidade, estados.

Criterios de aceite:

- Relatorio antes/depois criado em `.tmp/reports/`.

Status Log:

- 2026-04-28 23:40: pending -> done: baseline preexistente usado e relatorio final atualizado. Evidencia: `.tmp/reports/focus-phase-ia-smell-report.md`, `.tmp/reports/focus-phase-implementation-verification.md`.

### T4.2 Reduzir neon e glow global

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Atualizar tokens CSS e estilos para reduzir excesso de roxo/ciano/magenta e brilho em todos os componentes.

Criterios de aceite:

- Glow reservado para estados ativos.
- Tela ainda preserva identidade de jogo.
- Browser-proof confirma legibilidade.

Status Log:

- 2026-04-28 23:40: pending -> done: paleta e sombras globais suavizadas, glow reservado a estados. Evidencia: screenshots `visual-proof-*`.

### T4.3 Reduzir card soup e reorganizar hierarquia

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Reorganizar menu, HUD, arena, professor e recursos para que cada area tenha funcao visual clara.

Criterios de aceite:

- Menos bordas competindo.
- Menos containers redundantes.
- CTA principal mais claro.

Status Log:

- 2026-04-28 23:40: pending -> done: menu virou trilha clara, HUD/batalha/recursos ganharam hierarquia menos redundante. Evidencia: screenshots `visual-proof-menu-desktop`, `visual-proof-battle-desktop`.

### T4.4 Substituir emojis estruturais quando viavel

Status: `done`
Prioridade: Baixa
Responsavel: agente

Descricao:
Reduzir dependencia de emojis em HUD e labels, usando texto, sprites ou icones consistentes ja disponiveis.

Criterios de aceite:

- Sem regressao de compreensao.
- Visual fica menos prototipado.

Status Log:

- 2026-04-28 23:40: pending -> done: labels estruturais da web removem emojis em HUD, recursos e professor. Evidencia: `apps/web/src/components/StatusBars.tsx`, `apps/web/src/components/InventoryPanel.tsx`.

### T4.5 Redesenhar tela de vitoria educativa

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Vitoria deve resumir regra dominada, resultado, FOCO ganho e proxima fase, reduzindo trofeu/explosao generica.

Criterios de aceite:

- Vitoria ensina algo.
- CTA proximo e claro.
- Visual nao parece template.

Status Log:

- 2026-04-28 23:40: pending -> done: vitoria agora resume regra, missao, FOCO e proximo desafio. Evidencia: `visual-proof-victory-desktop`, `visual-proof-victory-mobile-width`.

## Marco 5: Validacao Final

### T5.1 Rodar testes completos

Status: `done`
Prioridade: Alta
Responsavel: agente

Comandos:

```bash
npm run test
npm run typecheck --workspaces --if-present
npm run build
```

Criterios de aceite:

- Todos passam sem erros.

Status Log:

- 2026-04-28 23:22: pending -> done: comandos completos passaram. Evidencia: `npm run test`, `npm run typecheck --workspaces --if-present`, `npm run build`.

### T5.2 Browser-proof desktop, tablet e mobile-width

Status: `done`
Prioridade: Alta
Responsavel: agente

Descricao:
Validar menu, settings, batalha, vitoria, foco drenando, erro com FOCO e fase temporizada.

Criterios de aceite:

- Desktop validado.
- Tablet-width validado.
- Mobile-width validado.
- Correcoes feitas em loop ate nao haver quebra visual obvia.

Status Log:

- 2026-04-28 23:22: pending -> done: browser-proof rapido validou desktop, tablet e mobile-width para batalha/FOCO. Evidencia: screenshots `focus-proof-*`.

### T5.3 Relatorio final de execucao

Status: `done`
Prioridade: Media
Responsavel: agente

Descricao:
Criar relatorio final em `.tmp/reports/` com mudancas, evidencias, comandos e pendencias Android/iOS.

Criterios de aceite:

- Relatorio inclui Product Correctness.
- Relatorio inclui IA Smell antes/depois.
- Relatorio inclui pendencias externas.

Status Log:

- 2026-04-28 23:22: pending -> done: relatorio de verificacao criado. Evidencia: `.tmp/reports/focus-phase-implementation-verification.md`.

## Marco 6: Validacao Mobile Real

### T6.1 Validar Android em emulador/dispositivo

Status: `blocked`
Prioridade: Alta
Responsavel: usuario + agente

Bloqueio:
Depende de emulador ou dispositivo Android disponivel.

Criterios de aceite:

- App abre.
- Settings funciona.
- Batalha funciona.
- FOCO drena visualmente.
- Audio nao quebra runtime.

Status Log:

- 2026-04-28: pending -> blocked: recurso externo necessario. Evidencia: sem emulador/dispositivo confirmado.

### T6.2 Validar iOS apos Android

Status: `blocked`
Prioridade: Media
Responsavel: usuario + agente

Bloqueio:
Depende de Android estar estavel e ambiente iOS disponivel.

Criterios de aceite:

- App abre no iOS.
- Audio/settings funcionam.
- Layout mobile nao quebra.

Status Log:

- 2026-04-28: pending -> blocked: aguarda validacao Android e ambiente iOS.
