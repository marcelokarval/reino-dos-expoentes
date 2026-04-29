# Plano Executivo: FOCO, Fases e Remocao de IA Smell

Data: 2026-04-28
Status: Draft executivo aguardando aprovacao
Origem: `.tmp/reports/focus-phase-ia-smell-report.md`

## 1. Objetivo

Transformar o Reino dos Expoentes em uma experiencia educativa mais equilibrada, clara e menos artificial, corrigindo a economia de FOCO, fortalecendo a identidade pedagogica de cada fase, redesenhando as telas principais com hierarquia visual profissional e removendo sinais de "IA Smell" como excesso de neon, card soup, emojis estruturais e feedback visual generico.

O plano nao altera a finalidade do jogo: ensinar propriedades de expoentes por meio de batalhas curtas, feedback do professor, progresso por fases e pratica repetida. A evolucao proposta apenas torna a experiencia mais estrategica, menos trivial e mais coerente com a aprendizagem.

## 2. Problemas Que Este Plano Resolve

### 2.1 FOCO cresce rapido demais

Hoje o jogo usa `focusCorrectGain: 15`. Com missao de 5 acertos por fase, o jogador pode ganhar ate 75 pontos de FOCO em uma fase. Como o FOCO persiste entre fases, a barra pode chegar a 100 muito cedo, removendo a tensao das fases temporizadas.

### 2.2 FOCO nao drena em fases sem timer

Nas fases 1 a 4, nao ha tempo regressivo. Isso e correto para introducao pedagogica, mas hoje tambem significa que FOCO nao sofre nenhum custo por demora. O jogador pode acumular protecao sem pressao.

### 2.3 Timer e FOCO comunicam regras confusas

Hoje o FOCO aumenta o tempo efetivo nas fases com timer (`focusTimerBonusSeconds`). Isso cria uma protecao indireta que pode reduzir a dificuldade justamente nas fases finais. A regra desejada e mais clara: FOCO e concentracao/protecao, e demora deve drenar essa concentracao.

### 2.4 Fases mudam formula, mas pouco mudam experiencia

As fases atuais mudam propriedade matematica, mas a experiencia de jogo e muito parecida entre elas. A fase 4 e especialmente fragil porque a resposta de `a^0` e sempre 1. A fase 6 diz "Mistura Total", mas hoje usa uma expressao fixa de produto/divisao.

### 2.5 Visual tem sinais fortes de IA Smell

O visual atual funciona, mas carrega sinais de prototipo gerado: neon roxo/ciano/magenta em excesso, muitos gradientes, emojis como sistema visual, bordas e brilhos em quase todos os componentes, tipografia default e movimentos exagerados.

## 3. Principios de Produto

1. Clareza primeiro: toda regra visivel precisa corresponder ao comportamento real.
2. Dificuldade gradual: as fases devem ensinar, depois pressionar, depois combinar.
3. FOCO como concentracao viva: cresce com dominio, cai com hesitacao, protege antes do HP.
4. Feedback local: ganho/perda de FOCO aparece perto da barra, nao como ruido central.
5. Visual menos generico: reduzir neon, emojis estruturais e card soup.
6. Sem dependencias novas sem necessidade concreta.
7. Regra de jogo fica em `packages/game-core`; conteudo e balanceamento em `packages/game-content`; UI apenas apresenta estado e eventos.

## 4. Escopo

### Incluido

- Rebalanceamento do FOCO.
- Decaimento de FOCO apos 5 segundos em todas as fases.
- Ajuste das regras de fase para suportar configuracao fina por fase.
- Melhorias em geracao de questoes das fases 4 e 6.
- Feedback visual para FOCO ganhando, drenando, absorvendo dano e zerado.
- Redesenho conceitual de menu, batalha, settings e vitoria.
- Auditoria e remocao progressiva de IA Smell.
- Testes de regra e validacao browser-proof.

### Fora do Escopo Inicial

- Criar arte original completa para todos os biomas.
- Trocar toda a biblioteca visual.
- Adicionar backend ou banco de dados.
- Criar login, ranking online ou multiplayer.
- Validacao iOS antes de Android estar estavel.

## 5. Arquitetura Proposta

### 5.1 `packages/game-core`

Responsavel por regras puras:

- Estado de FOCO.
- Eventos de ganho/perda/drenagem.
- Absorcao de dano por FOCO.
- Evolucao de fase mantendo acumulado.
- Geracao de questoes por propriedade.
- Testes unitarios de gameplay.

Mudancas esperadas:

- Adicionar eventos como `FOCUS_GAINED`, `FOCUS_DRAINED`, `FOCUS_DEPLETED`, `FOCUS_ABSORBED_DAMAGE` se necessario.
- Adicionar acao de tick de FOCO ou tempo de questao, como `FOCUS_DECAY_TICK`, para nao deixar decaimento preso apenas na UI.
- Ajustar balanceamento para suportar `focusCorrectGain`, `focusComboGain`, `focusMissionBonus`, `focusDecayDelaySeconds`, `focusDecayPerSecond`, `timedFocusDecayPerSecond`, `focusCapByLevel` ou equivalente.

### 5.2 `packages/game-content`

Responsavel por conteudo e configuracao:

- Definicao de fases.
- Dificuldade.
- Timer.
- Regras por fase.
- Parametros de FOCO por fase.
- Bancos de mensagens do professor.

Mudancas esperadas:

- Enriquecer `LevelDefinition` ou criar mapa de `levelBalance` por fase.
- Fase 4 deve ter pool de questoes menos trivial.
- Fase 6 deve ter pool real de questoes mistas.
- Mensagens do professor devem explicar a regra especifica aplicada.

### 5.3 Web e Mobile

Responsaveis por runtime e apresentacao:

- Timer visual.
- Decaimento visual sincronizado ao estado real.
- HUD responsivo.
- Settings modal.
- Feedback de FOCO e professor.

Mudancas esperadas:

- Remover logica de regra de FOCO dos controllers se ela puder viver no reducer.
- UI deve mostrar "Foco drenando em Xs" e depois "-1 foco" quando aplicavel.
- Browser-proof desktop, tablet e mobile-width.

## 6. Novo Modelo de FOCO

### 6.1 Regras Recomendadas

| Evento | Regra Proposta | Observacao |
| --- | --- | --- |
| Inicio do jogo | FOCO = 0 | evita vantagem gratis |
| Acerto simples | +5 FOCO | ganho baixo, sustentavel |
| Combo 3+ | +7 FOCO total ou +2 bonus | recompensa dominio |
| Missao completa | +10 FOCO | recompensa conclusao da fase |
| Erro | -18 a -20 FOCO antes do HP | preserva funcao defensiva |
| Timeout | -12 a -18 FOCO antes do HP | timer continua perigoso |
| 5s sem resposta, fase sem timer | -1 FOCO por segundo | ritmo leve |
| 5s sem resposta, fase com timer | -2 FOCO por segundo | pressao maior |
| FOCO zerado | proximo erro/timeout atinge HP | estado deve ser claro |

### 6.2 Cap Progressivo Recomendado

| Fase | Cap de FOCO Recomendado | Motivo |
| --- | --- | --- |
| 1 | 30 | introdutoria |
| 2 | 45 | adiciona subtracao |
| 3 | 60 | adiciona multiplicacao |
| 4 | 75 | prepara fases com tempo |
| 5 | 100 | primeira fase temporizada |
| 6 | 100 | desafio final |

### 6.3 Estados Visuais

| Estado | Condicao | Visual |
| --- | --- | --- |
| Sem FOCO | 0 | barra cinza, texto "Sem foco" |
| Baixo | 1 a 25 | vermelho discreto, pulso leve |
| Estavel | 26 a 60 | azul/verde com pouco brilho |
| Forte | 61 a 100 | dourado frio, sem neon exagerado |
| Drenando | apos 5s sem resposta | seta/label local `-1 foco` |
| Absorvendo | erro/timeout com FOCO > 0 | flash curto na barra, nao shake global pesado |

## 7. Plano por Fase

### Fase 1: Floresta dos Produtos

Objetivo pedagogico: somar expoentes com bases iguais.

Mudancas:

- Manter sem timer regressivo.
- Aplicar decaimento de FOCO apos 5 segundos.
- Mostrar dica visual nas primeiras perguntas: destacar expoentes que serao somados.
- Cap de FOCO sugerido: 30.
- Professor deve reforcar: "bases iguais, some expoentes".

Critério de aceite:

- Jogador entende a regra sem precisar abrir ajuda externa.
- FOCO nao passa do cap da fase.
- Demora apos 5s drena FOCO de forma visivel.

### Fase 2: Caverna das Divisoes

Objetivo pedagogico: subtrair expoentes com bases iguais.

Mudancas:

- Mostrar comparacao visual numerador vs denominador.
- Incluir questoes com resultado 0 para preparar fase 4.
- Cap acumulado sugerido: 45.
- Professor deve explicar: "mesma base na divisao, subtraia expoentes".

Critério de aceite:

- Questoes nao parecem apenas uma copia da fase 1 com outro simbolo.
- O jogador ve claramente por que o expoente diminui.

### Fase 3: Torre das Potencias

Objetivo pedagogico: multiplicar expoentes em potencia de potencia.

Mudancas:

- Feedback pos-acerto deve mostrar `m x n`.
- Combo passa a ser apresentado como mecanica oficial.
- Combo 3+ concede pequeno bonus de FOCO.
- Cap acumulado sugerido: 60.

Critério de aceite:

- O jogador entende que nao deve somar nessa fase.
- Bonus de combo nao quebra o balanceamento.

### Fase 4: Deserto do Zero

Objetivo pedagogico: fixar expoente zero e unidade.

Mudancas:

- Substituir pool trivial por questoes variadas:
  - `7^0 = ?`
  - `x^0 = ?`
  - `9^3 / 9^3 = 9^?`
  - `a^m / a^m = a^?`
- Manter distractor `0` para reforcar conceito.
- Cap acumulado sugerido: 75.

Critério de aceite:

- Resposta correta nao e sempre 1 no mesmo formato visual.
- A fase ensina a origem do expoente zero por simplificacao.

### Fase 5: Abismo Negativo

Objetivo pedagogico: entender expoente negativo como inverso.

Mudancas:

- Timer de 15s permanece.
- FOCO drena apos 5s em ritmo maior.
- Alternar formatos:
  - `1/a^m = a^?`
  - `a^-m = 1/a^?`
  - `a^m / a^n` com resultado negativo quando `n > m`.
- Feedback quando FOCO absorver dano.

Critério de aceite:

- Timer aumenta pressao sem virar punicao opaca.
- FOCO protege, mas nao elimina risco.

### Fase 6: Trono do Caos

Objetivo pedagogico: combinar regras em expressoes mistas.

Mudancas:

- Timer de 12s permanece.
- Pool real de expressoes mistas:
  - produto + divisao;
  - potencia de potencia + divisao;
  - zero como etapa;
  - negativo simples como etapa final.
- Feedback por etapa, quando possivel.
- Conclusao final deve resumir regras dominadas.

Critério de aceite:

- A fase realmente parece final.
- A mistura nao foge da finalidade educativa.

## 8. Direcao Visual Anti IA Smell

### 8.1 Problemas atuais

- Paleta roxo/ciano/magenta muito generica.
- Gradientes em excesso.
- Glow em quase todos os componentes.
- Emojis usados como estrutura visual.
- Tipografia default sem personalidade.
- Muitos cards competindo.
- Motion exagerado.
- Feedback grande demais para eventos pequenos.

### 8.2 Direcao proposta

- Reduzir o roxo para base de interface, nao identidade inteira.
- Criar paleta por bioma/fase com acentos controlados.
- Trocar emojis estruturais por sprites/icones consistentes quando possivel.
- Usar glow apenas para estado ativo ou magia/matematica.
- Reduzir bordas duplicadas.
- Separar HUD, arena e painel de professor com hierarquia clara.
- Usar uma fonte display para titulo e uma fonte legivel para expressoes matematicas.

### 8.3 Benchmark Influence Map

| Benchmark | Qualidade Relevante | Principio Adotado | Impacto no Projeto | Limite de Nao-Copia |
| --- | --- | --- | --- | --- |
| Linear | hierarquia limpa | HUD com menos chrome | reduzir card soup e bordas | nao copiar SaaS cinza |
| Duolingo | feedback educativo imediato | microfeedback claro por acerto/erro | ganho/perda de FOCO local | nao infantilizar demais |
| Nintendo puzzle/educational | jogo ensina pela acao | professor e fase explicam regra | feedback contextual por fase | nao copiar marcas/personagens |
| Monument Valley/Apple Arcade | materialidade calma | biomas com identidade visual | paleta por fase e motion contido | nao copiar layout/arte |

## 9. Wireframes Executivos

### 9.1 Menu Principal

```text
╔════════════════════════════════════════════════════════════════════╗
║ Reino dos Expoentes                                      [⚙]     ║
║ Domine propriedades. Vença desafios. Aprenda por domínio.         ║
╠════════════════════════════════════════════════════════════════════╣
║ Progresso: Fase 2 desbloqueada                                   ║
║ FOCO acumulado: 35/100  ▓▓▓▓░░░░░░                               ║
╠════════════════════════════════════════════════════════════════════╣
║ Jornada                                                          ║
║ ✓ 1 Produto        concluída                                     ║
║ → 2 Divisão        atual                                         ║
║ · 3 Potência       bloqueada                                     ║
║ · 4 Zero           bloqueada                                     ║
║ · 5 Negativos      bloqueada / com tempo                         ║
║ · 6 Caos           bloqueada / desafio final                     ║
╠════════════════════════════════════════════════════════════════════╣
║ [Continuar Jornada]                                              ║
║ [Revisar Regras]                       [Resetar Progresso]       ║
╚════════════════════════════════════════════════════════════════════╝
```

### 9.2 Batalha Desktop

```text
╔════════════════════════════════════════════════════════════════════════════╗
║ HP Heroi ▓▓▓▓▓▓▓▓▓░  HP Inimigo ▓▓▓▓▓▓░  Missão 2/5  FOCO 28/100 [⚙]   ║
║ FOCO drenando em: 3s  estado: calma                                      ║
╠══════════════════════════════════════════╦═════════════════════════════════╣
║ Fase 2: Caverna das Divisões            ║ Professor                       ║
║                                          ║ "Mesma base na divisão:         ║
║              [sprite inimigo]            ║ subtraia expoentes."            ║
║                                          ╠═════════════════════════════════╣
║        6^8 / 6^3 = 6^?                  ║ Recursos                        ║
║                                          ║ Produto      [usar]             ║
║ [ 3 ] [ 5 ] [ 8 ] [ 11 ]                ║ Divisão      [usar]             ║
║                                          ║ Escudo       [usar]             ║
║ Feedback local: +5 FOCO, -18 inimigo     ║ Poção        [usar]             ║
╚══════════════════════════════════════════╩═════════════════════════════════╝
```

### 9.3 Batalha Mobile

```text
╔════════════════════════════════════╗
║ [⚙]                               ║
║ HP Herói      ▓▓▓▓▓▓▓▓░           ║
║ HP Inimigo    ▓▓▓▓▓░░░            ║
║ Missão 2/5    ▓▓░░░░░             ║
║ FOCO 28/100   ▓▓░░░░░  drena em 3s║
╠════════════════════════════════════╣
║ Fase 2: Caverna das Divisões      ║
║          [sprite inimigo]         ║
║ 6^8 / 6^3 = 6^?                   ║
║ [ 3 ]                             ║
║ [ 5 ]                             ║
║ [ 8 ]                             ║
║ [ 11 ]                            ║
╠════════════════════════════════════╣
║ Professor: subtraia expoentes.    ║
║ Recursos: Produto | Divisão | Poção║
╚════════════════════════════════════╝
```

### 9.4 Configurações

```text
┌────────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░ jogo escurecido ░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░╔══════════════════════════════╗░░░░░░░░░░░░░░░│
│░░░░░░░░░░░║ Configurações           [×] ║░░░░░░░░░░░░░░░│
│░░░░░░░░░░░╠══════════════════════════════╣░░░░░░░░░░░░░░░│
│░░░░░░░░░░░║ Áudio                         ║░░░░░░░░░░░░░░│
│░░░░░░░░░░░║ Música [ligada]  ▓▓▓░░ 32%    ║░░░░░░░░░░░░░░│
│░░░░░░░░░░░║ Efeitos[ligados] ▓▓▓▓▓ 55%    ║░░░░░░░░░░░░░░│
│░░░░░░░░░░░╠══════════════════════════════╣░░░░░░░░░░░░░░░│
│░░░░░░░░░░░║ Futuro: contraste, vibração   ║░░░░░░░░░░░░░░│
│░░░░░░░░░░░╚══════════════════════════════╝░░░░░░░░░░░░░░░│
└────────────────────────────────────────────────────────────┘
```

### 9.5 Vitória

```text
╔════════════════════════════════════════════════════════════╗
║ Fase vencida: Caverna das Divisões                  [⚙] ║
╠════════════════════════════════════════════════════════════╣
║ Regra dominada: a^m / a^n = a^(m-n)                      ║
║ Resultado: 5/5 missões | FOCO +10 | Itens restaurados     ║
║                                                            ║
║ Professor: "Você subtraiu expoentes com precisão."        ║
║                                                            ║
║ [Avançar para Torre das Potências]                         ║
║ [Revisar regra]                                            ║
╚════════════════════════════════════════════════════════════╝
```

## 10. Sequenciamento Executivo

### Fase A: Regra e testes de FOCO

Objetivo: corrigir a economia antes de mexer em estética.

Entregas:

- Balanceamento de FOCO menor.
- Cap progressivo por fase.
- Decaimento apos 5s.
- Eventos de ganho/perda.
- Testes RED/GREEN em `game-core`.

Gate de saida:

- `npm run test -w @reino/game-core` passa.

### Fase B: UI de FOCO e runtime web/mobile

Objetivo: tornar ganho/perda de FOCO compreensivel.

Entregas:

- Label "drena em Xs".
- Feedback local `+5 FOCO` e `-1 FOCO`.
- Estado visual para FOCO zerado.
- Timer sem bonus confuso.

Gate de saida:

- Browser-proof mostra FOCO drenando em fase sem timer.
- Browser-proof mostra FOCO drenando em fase com timer.

### Fase C: Questoes e fases

Objetivo: reduzir repeticao e aumentar finalidade pedagogica.

Entregas:

- Fase 4 com pool variado.
- Fase 6 com pool misto real.
- Professor contextual por regra aplicada.

Gate de saida:

- Testes de geracao de questoes cobrem novos formatos.

### Fase D: Anti IA Smell visual

Objetivo: reduzir aparencia de prototipo/IA sem reescrever todo app.

Entregas:

- Tokens visuais mais contidos.
- HUD menos neon.
- Menos card soup.
- Settings menos SaaS/neon.
- Vitoria mais educativa e menos generica.

Gate de saida:

- Browser-proof desktop/tablet/mobile-width.
- Smell score documentado antes/depois.

### Fase E: Prova final

Objetivo: garantir que o jogo continua funcionando.

Entregas:

- `npm run test`.
- `npm run typecheck --workspaces --if-present`.
- `npm run build`.
- Relatorio final em `.tmp/reports/`.

Gate de saida:

- Nenhum teste/build falhando.
- Browser-proof anexado/registrado.

## 11. Riscos

| Risco | Severidade | Mitigacao |
| --- | --- | --- |
| FOCO virar punicao irritante | Alta | decaimento leve nas fases 1-4; feedback claro |
| Fase 4 ficar confusa demais | Media | introduzir variacao gradualmente |
| Fase 6 ficar fora da finalidade | Alta | limitar pool a propriedades ja ensinadas |
| Redesign virar reescrita grande | Alta | aplicar por tokens/HUD/componentes existentes |
| Mobile quebrar por densidade | Alta | validar mobile-width no browser e Expo depois |

## 12. Status Atual

Status do plano: `draft_approved_for_review`

Proximo passo recomendado: revisar `docs/superpowers/tasks/2026-04-28-focus-phase-ia-smell-tasks.md` e aprovar uma das tres faixas de execucao:

1. FOCO apenas.
2. FOCO + fases.
3. FOCO + fases + anti IA Smell visual.
