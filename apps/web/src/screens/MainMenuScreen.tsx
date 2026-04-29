interface MainMenuScreenProps {
  onStart: () => void;
  highestUnlockedLevelIndex?: number;
  onResetProgress?: () => void;
}

export function MainMenuScreen({
  onStart,
  highestUnlockedLevelIndex = 0,
  onResetProgress,
}: MainMenuScreenProps) {
  return (
    <div id="main-menu">
      <span className="menu-kicker">Aventura matemática</span>
      <h1 className="game-title">REINO DOS EXPOENTES</h1>
      <p className="menu-subtitle">Domine as propriedades, conquiste o reino.</p>
      <div className="progress-card">
        Progresso salvo: fase {highestUnlockedLevelIndex + 1} desbloqueada
      </div>
      <div className="learning-path" aria-label="Trilha de aprendizado">
        <div className="path-item">
          <span className="path-marker path-basic" />
          <strong>Básico</strong>
          <span>Produto e divisão no combate inicial</span>
        </div>
        <div className="path-item">
          <span className="path-marker path-intermediate" />
          <strong>Intermediário</strong>
          <span>Potência de potência e expoente zero</span>
        </div>
        <div className="path-item">
          <span className="path-marker path-advanced" />
          <strong>Avançado</strong>
          <span>Negativos, expressões e pressão de tempo</span>
        </div>
      </div>
      <div className="menu-actions-row">
        <button className="secondary-button" type="button" onClick={onResetProgress}>
          Resetar progresso
        </button>
      </div>
      <button className="start-button" type="button" onClick={onStart}>INICIAR AVENTURA</button>
    </div>
  );
}
