export type ExponentProperty =
  | 'multiplication'
  | 'division'
  | 'powerOfPower'
  | 'zeroExponent'
  | 'negative'
  | 'complex';

export type GameStatus = 'menu' | 'playing' | 'victory' | 'game-over' | 'completed';

export type GameEventType =
  | 'GAME_STARTED'
  | 'LEVEL_STARTED'
  | 'NEXT_LEVEL_REQUESTED'
  | 'ANSWER_CORRECT'
  | 'ANSWER_WRONG'
  | 'PLAYER_DAMAGED'
  | 'ITEM_USED'
  | 'LEVEL_COMPLETE'
  | 'GAME_OVER'
  | 'GAME_COMPLETED'
  | 'TIMEOUT'
  | 'TIMEOUT_WARNING'
  | 'FOCUS_GAINED'
  | 'FOCUS_DRAINED'
  | 'FOCUS_DEPLETED'
  | 'FOCUS_ABSORBED_DAMAGE';

export interface LevelDefinition {
  id: string;
  name: string;
  icon: string;
  property: ExponentProperty;
  rule: string;
  difficulty: number;
  timeLimitSeconds: number;
}

export interface BalanceConfig {
  playerMaxHp: number;
  enemyMaxHp: number;
  missionTarget: number;
  baseCorrectDamage: number;
  comboCorrectDamage: number;
  comboThreshold: number;
  wrongAnswerDamage: number;
  shieldWrongAnswerDamage: number;
  timeoutDamage: number;
  scrollDamage: number;
  focusMax: number;
  focusStart: number;
  focusCorrectGain: number;
  focusComboGain: number;
  focusMissionBonus: number;
  focusDecayDelaySeconds: number;
  focusDecayIntervalSeconds: number;
  focusDecayPerSecond: number;
  timedFocusDecayPerSecond: number;
  focusCapByLevel: number[];
  focusTimerBonusSeconds: number;
}

export interface InventoryState {
  potions: number;
  scrollProduct: number;
  scrollDivision: number;
  scrollNegative: number;
}

export interface Question {
  text: string;
  correctValue: number;
  options: number[];
}

export type QuestionSeed = Pick<Question, 'text' | 'correctValue'>;

export interface GameEvent {
  type: GameEventType;
  payload?: Record<string, unknown>;
}

export interface GameState {
  status: GameStatus;
  levels: LevelDefinition[];
  balance: BalanceConfig;
  currentLevelIndex: number;
  playerHp: number;
  focus: number;
  focusDecayElapsedSeconds: number;
  enemyHp: number;
  currentQuestion: Question | null;
  usedQuestionTexts: string[];
  combo: number;
  inventory: InventoryState;
  missionCurrent: number;
  activeShield: boolean;
  lastEvents: GameEvent[];
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'ANSWER'; selected: number }
  | { type: 'TIMEOUT' }
  | { type: 'FOCUS_DECAY_TICK'; deltaSeconds: number }
  | { type: 'NEXT_LEVEL' }
  | { type: 'USE_SCROLL'; scroll: 'product' | 'division' | 'negative' }
  | { type: 'USE_POTION' }
  | { type: 'RESET_GAME' }
  | { type: 'GENERATE_QUESTION' };

export type RandomSource = () => number;
