import type { useGameController } from '../hooks/useGameController';
import { getProfessorMessage } from '@reino/game-content';

interface VictoryScreenProps {
  game: ReturnType<typeof useGameController>;
  title?: string;
  message?: string;
}

export function VictoryScreen({ game, title = 'VITÓRIA!', message }: VictoryScreenProps) {
  const missionCompleted = game.state.missionCurrent >= game.state.balance.missionTarget;
  const eventTypes = game.state.lastEvents.map((event) => event.type);
  const professorMessage = getProfessorMessage({
    eventTypes,
    combo: game.state.combo,
    property: game.level.property,
    playerHp: game.state.playerHp,
  });

  return (
    <div className="overlay-screen victory-celebration">
      <div className="star-award" aria-hidden="true">★</div>
      <div className="star-burst" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <h2>{title}</h2>
      <p className="reward-text">{message ?? `Regra Dominada: ${game.level.rule}`}</p>
      {missionCompleted && <div className="conquest-alert">📜 Missão Concluída! Itens Restaurados!</div>}
      <div className="professor-reaction professor-celebrate">
        <strong>👨‍🏫 Professor</strong>
        <span>{professorMessage.text}</span>
      </div>
      <div className="trophy-icon">🏆</div>
      <button
        className="full-width-button"
        type="button"
        onClick={game.state.status === 'game-over' ? game.actions.reset : game.actions.nextLevel}
      >
        {game.state.status === 'completed' || game.state.status === 'game-over' ? 'REINICIAR' : 'AVANÇAR'}
      </button>
    </div>
  );
}
