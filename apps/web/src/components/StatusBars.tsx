import type { GameState } from '@reino/game-core';
import type { GameEvent } from '@reino/game-core';

interface StatusBarsProps {
  state: GameState;
  events?: GameEvent[];
}

export function StatusBars({ state, events = [] }: StatusBarsProps) {
  const eventTypes = events.map((event) => event.type);
  const focusCap = state.balance.focusCapByLevel[state.currentLevelIndex] ?? state.balance.focusMax;
  const focusPercent = (state.focus / focusCap) * 100;
  const focusClassName = focusPercent <= 0 ? 'focus-empty' : focusPercent < 35 ? 'focus-low' : 'focus-high';
  const focusDelta = [...events].reverse().find((event) => event.type.startsWith('FOCUS_') && typeof event.payload?.amount === 'number');
  const focusDelayLeft = Math.max(0, state.balance.focusDecayDelaySeconds - state.focusDecayElapsedSeconds);
  const focusHint = state.status !== 'playing' || state.focus <= 0
    ? 'sem foco acumulado'
    : focusDelayLeft > 0
      ? `drena em ${Math.ceil(focusDelayLeft)}s`
      : 'drenando';
  const focusDeltaText = focusDelta ? focusEventText(focusDelta.type, Number(focusDelta.payload?.amount)) : focusHint;
  return (
    <div className="status-bar">
      <div className={`bar-container ${eventTypes.includes('PLAYER_DAMAGED') ? 'hero-hp-hit' : ''}`}>
        <div className="label">Herói <span>HP</span></div>
        <div className="progress-bg"><div className="progress-fill hp-fill" style={{ width: `${state.playerHp}%` }} /></div>
      </div>
      <div className={`bar-container ${eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('ITEM_USED') ? 'enemy-hp-hit' : ''}`}>
        <div className="label">Inimigo <span>HP</span></div>
        <div className="progress-bg"><div className="progress-fill enemy-hp-fill" style={{ width: `${state.enemyHp}%` }} /></div>
      </div>
      <div className={`bar-container ${eventTypes.includes('ANSWER_CORRECT') ? 'mission-pulse' : ''}`}>
        <div className="label">Missão <span>{state.missionCurrent}/{state.balance.missionTarget}</span></div>
        <div className="progress-bg">
          <div className="progress-fill xp-fill" style={{ width: `${(state.missionCurrent / state.balance.missionTarget) * 100}%` }} />
        </div>
      </div>
      <div className={`bar-container focus-container ${focusClassName} ${eventTypes.some((type) => type.startsWith('FOCUS_')) ? 'mission-pulse' : ''}`}>
        <div className="label">Foco <span>{Math.round(state.focus)}/{focusCap}</span></div>
        <div className="progress-bg">
          <div className="progress-fill focus-fill" style={{ width: `${focusPercent}%` }} />
        </div>
        <div className="focus-hint">{focusDeltaText}</div>
      </div>
    </div>
  );
}

function focusEventText(type: GameEvent['type'], amount: number) {
  if (type === 'FOCUS_GAINED') return `+${Math.round(amount)} FOCO`;
  if (type === 'FOCUS_DRAINED') return `-${Math.round(amount)} FOCO`;
  if (type === 'FOCUS_ABSORBED_DAMAGE') return `FOCO absorveu ${Math.round(amount)}`;
  if (type === 'FOCUS_DEPLETED') return 'FOCO esgotado';
  return 'FOCO ativo';
}
