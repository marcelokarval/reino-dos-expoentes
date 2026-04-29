import { AnswerGrid } from '../components/AnswerGrid';
import { EnemyDisplay } from '../components/EnemyDisplay';
import { InventoryPanel } from '../components/InventoryPanel';
import { QuestionCard } from '../components/QuestionCard';
import { StatusBars } from '../components/StatusBars';
import type { useGameController } from '../hooks/useGameController';
import { enemiesByLevelId, getProfessorMessage } from '@reino/game-content';
import { professorSpritesByKey } from '@reino/assets';
import { useEffect, useRef, useState } from 'react';
import type { GameEventType } from '@reino/game-core';

interface BattleScreenProps {
  game: ReturnType<typeof useGameController>;
}

interface FeedbackSnapshot {
  id: number;
  eventTypes: GameEventType[];
  latestDamage?: number;
  missionGained: boolean;
  professorMessage: ReturnType<typeof getProfessorMessage>;
}

export function BattleScreen({ game }: BattleScreenProps) {
  const question = game.state.currentQuestion;
  const enemy = enemiesByLevelId[game.level.id as keyof typeof enemiesByLevelId];
  const eventTypes = game.state.lastEvents.map((event) => event.type);
  const [feedbackSnapshot, setFeedbackSnapshot] = useState<FeedbackSnapshot | null>(null);
  const previousProfessorTextRef = useRef<string | undefined>(undefined);
  const activeEventTypes = feedbackSnapshot?.eventTypes ?? eventTypes;
  const latestDamage = feedbackSnapshot?.latestDamage;
  const missionGained = Boolean(feedbackSnapshot?.missionGained);
  const missionProgress = game.state.missionCurrent / game.state.balance.missionTarget;
  const missionGainClassName = missionProgress >= 1 ? 'mission-gain mission-gain-gold' : missionProgress >= 0.6 ? 'mission-gain mission-gain-warm' : 'mission-gain mission-gain-cool';
  const professorMessage = feedbackSnapshot?.professorMessage;
  const professorSprite = professorSpritesByKey.guide;

  useEffect(() => {
    if (game.state.lastEvents.length === 0) return;

    const nextEventTypes = game.state.lastEvents.map((event) => event.type);
    const nextProfessorMessage = getProfessorMessage({
      eventTypes: nextEventTypes,
      combo: game.state.combo,
      property: game.level.property,
      playerHp: game.state.playerHp,
      previousText: previousProfessorTextRef.current,
    });
    previousProfessorTextRef.current = nextProfessorMessage.text;

    setFeedbackSnapshot({
      id: Date.now(),
      eventTypes: nextEventTypes,
      latestDamage: [...game.state.lastEvents].reverse().find((event) => typeof event.payload?.damage === 'number')?.payload?.damage as number | undefined,
      missionGained: nextEventTypes.includes('ANSWER_CORRECT'),
      professorMessage: nextProfessorMessage,
    });

    const timeout = window.setTimeout(() => setFeedbackSnapshot(null), 10500);
    return () => window.clearTimeout(timeout);
  }, [game.level.property, game.state.combo, game.state.lastEvents, game.state.playerHp]);

  const battleClassName = [
    'battle-shell',
    eventTypes.includes('PLAYER_DAMAGED') ? 'battle-shell-damaged' : '',
    eventTypes.includes('ANSWER_WRONG') || eventTypes.includes('TIMEOUT') ? 'battle-shell-error-quake' : '',
    eventTypes.includes('ANSWER_CORRECT') && game.state.combo >= 2 ? 'battle-shell-success-quake' : '',
    eventTypes.includes('ITEM_USED') ? 'battle-shell-item-used' : '',
    game.state.combo >= 3 ? 'battle-shell-combo' : '',
  ].filter(Boolean).join(' ');
  const enemyClassName = activeEventTypes.includes('ANSWER_CORRECT') || activeEventTypes.includes('ITEM_USED') ? 'enemy-hit' : '';
  const feedbackClassName = eventTypes.includes('ANSWER_WRONG') || eventTypes.includes('TIMEOUT')
    ? 'feedback wrong-feedback'
    : 'feedback correct-feedback';

  if (!question) return null;

  return (
    <div id="game-ui" className={battleClassName}>
      <StatusBars state={game.state} events={game.state.lastEvents} />
      <div id="combat-area">
        <div className="combat-main">
          <div className="stage-name">{game.level.name}</div>
          <div className="enemy-feedback-wrap">
            <EnemyDisplay icon={game.level.icon} spriteKey={enemy?.spriteKey} className={enemyClassName} />
            {latestDamage && activeEventTypes.includes('ANSWER_CORRECT') && <span className="floating-damage">-{latestDamage}</span>}
            {activeEventTypes.includes('ANSWER_CORRECT') && <span className="enemy-burst" aria-hidden="true" />}
          </div>
          {missionGained && <div className={missionGainClassName}><span aria-hidden="true">★</span> +1 missão</div>}
          <QuestionCard question={question} timerPercent={game.timerPercent} />
          <AnswerGrid options={question.options} onAnswer={game.actions.answer} />
          <div id="feedback" className={feedbackClassName}>{game.state.lastEvents.at(-1)?.type.replaceAll('_', ' ')}</div>
        </div>
        <div className="side-panel-stack">
          {professorMessage && (
            <div className={`professor-reaction professor-chat-bubble professor-${professorMessage.tone}`} key={feedbackSnapshot?.id}>
              <div className="professor-avatar" aria-label={professorSprite.label} title={professorSprite.label}>
                <span
                  className="sprite-tile professor-avatar-tile"
                  style={{
                    backgroundImage: `url(${professorSprite.sheetPath})`,
                    backgroundPosition: `-${professorSprite.x}px -${professorSprite.y}px`,
                    width: professorSprite.width,
                    height: professorSprite.height,
                  }}
                />
              </div>
              <div className="professor-copy">
                <strong>Professor</strong>
                <span>{professorMessage.text}</span>
              </div>
            </div>
          )}
          <InventoryPanel state={game.state} actions={game.actions} />
        </div>
      </div>
    </div>
  );
}
