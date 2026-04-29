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
      <h1 className="game-title">REINO DOS EXPOENTES</h1>
      <p className="menu-subtitle">Domine as propriedades, conquiste o reino.</p>
      <div className="progress-card">
        Progresso salvo: fase {highestUnlockedLevelIndex + 1} desbloqueada
      </div>
      <div className="menu-guide">
        <p>
          📘 <b>Básico:</b> Produto e Divisão (Combate Inicial)<br />
          📗 <b>Intermediário:</b> Potência de Potência e Zero (Combos Ativos)<br />
          📕 <b>Avançado:</b> Negativos e Expressões (Pressão de Tempo!)
        </p>
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
