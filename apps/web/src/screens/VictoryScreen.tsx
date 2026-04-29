import type { useGameController } from '../hooks/useGameController';
import { getProfessorMessage } from '@reino/game-content';

interface VictoryScreenProps {
  game: ReturnType<typeof useGameController>;
  title?: string;
  message?: string;
}

export function VictoryScreen({ game, title = 'VITÓRIA!', message }: VictoryScreenProps) {
  const missionCompleted = game.state.missionCurrent >= game.state.balance.missionTarget;
  const focusCap = game.state.balance.focusCapByLevel[game.state.currentLevelIndex] ?? game.state.balance.focusMax;
  const nextLevel = game.state.levels[game.state.currentLevelIndex + 1];
  const eventTypes = game.state.lastEvents.map((event) => event.type);
  const professorMessage = getProfessorMessage({
    eventTypes,
    combo: game.state.combo,
    property: game.level.property,
    playerHp: game.state.playerHp,
  });

  return (
    <div className="overlay-screen victory-celebration">
      <div className="mastery-medal" aria-hidden="true">OK</div>
      <span className="menu-kicker">Fase concluída</span>
      <h2>{title}</h2>
      <p className="reward-text">{message ?? `Regra dominada: ${game.level.rule}`}</p>
      <div className="victory-summary-grid">
        <div className="victory-summary-card">
          <span>Regra treinada</span>
          <strong>{ruleSummary(game.level.property)}</strong>
        </div>
        <div className="victory-summary-card">
          <span>Missão</span>
          <strong>{game.state.missionCurrent}/{game.state.balance.missionTarget}</strong>
        </div>
        <div className="victory-summary-card">
          <span>FOCO final</span>
          <strong>{Math.round(game.state.focus)}/{focusCap}</strong>
        </div>
      </div>
      {missionCompleted && <div className="conquest-alert">Missão concluída. Recursos restaurados para a próxima fase.</div>}
      <div className="professor-reaction professor-celebrate">
        <strong>Professor</strong>
        <span>{professorMessage.text}</span>
      </div>
      {nextLevel && <p className="next-level-note">Próximo desafio: {nextLevel.name}</p>}
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

function ruleSummary(property: ReturnType<typeof useGameController>['level']['property']) {
  switch (property) {
    case 'multiplication':
      return 'Bases iguais: some os expoentes.';
    case 'division':
      return 'Bases iguais: subtraia os expoentes.';
    case 'powerOfPower':
      return 'Potência de potência: multiplique os expoentes.';
    case 'zeroExponent':
      return 'Expoente zero transforma a base não nula em 1.';
    case 'negative':
      return 'Expoente negativo vira inverso da potência.';
    case 'complex':
      return 'Resolva por etapas e combine as regras.';
  }
}
