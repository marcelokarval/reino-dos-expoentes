import type { GameState } from '@reino/game-core';
import type { GameEvent } from '@reino/game-core';

interface StatusBarsProps {
  state: GameState;
  events?: GameEvent[];
}

export function StatusBars({ state, events = [] }: StatusBarsProps) {
  const eventTypes = events.map((event) => event.type);
  const focusPercent = (state.focus / state.balance.focusMax) * 100;
  const focusClassName = focusPercent <= 0 ? 'focus-empty' : focusPercent < 35 ? 'focus-low' : 'focus-high';
  return (
    <div className="status-bar">
      <div className={`bar-container ${eventTypes.includes('PLAYER_DAMAGED') ? 'hero-hp-hit' : ''}`}>
        <div className="label">❤️ Herói (HP)</div>
        <div className="progress-bg"><div className="progress-fill hp-fill" style={{ width: `${state.playerHp}%` }} /></div>
      </div>
      <div className={`bar-container ${eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('ITEM_USED') ? 'enemy-hp-hit' : ''}`}>
        <div className="label">👾 Inimigo (HP)</div>
        <div className="progress-bg"><div className="progress-fill enemy-hp-fill" style={{ width: `${state.enemyHp}%` }} /></div>
      </div>
      <div className={`bar-container ${eventTypes.includes('ANSWER_CORRECT') ? 'mission-pulse' : ''}`}>
        <div className="label">📜 Missão: <span>{state.missionCurrent}/{state.balance.missionTarget}</span></div>
        <div className="progress-bg">
          <div className="progress-fill xp-fill" style={{ width: `${(state.missionCurrent / state.balance.missionTarget) * 100}%` }} />
        </div>
      </div>
      <div className={`bar-container focus-container ${focusClassName} ${eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('PLAYER_DAMAGED') ? 'mission-pulse' : ''}`}>
        <div className="label">✨ Foco: <span>{Math.round(state.focus)}/{state.balance.focusMax}</span></div>
        <div className="progress-bg">
          <div className="progress-fill focus-fill" style={{ width: `${focusPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
