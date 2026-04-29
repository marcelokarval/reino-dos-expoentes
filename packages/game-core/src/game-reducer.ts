import { getCorrectAnswerDamage, getWrongAnswerDamage, hasEnemyLost, hasPlayerLost } from './combat';
import { event } from './events';
import { generateQuestion } from './questions';
import { initialInventory, restoreMissionRewards } from './inventory';
import type { BalanceConfig, GameAction, GameEvent, GameState, LevelDefinition } from './types';

export const defaultBalance: BalanceConfig = {
  playerMaxHp: 100,
  enemyMaxHp: 100,
  missionTarget: 5,
  baseCorrectDamage: 18,
  comboCorrectDamage: 22,
  comboThreshold: 3,
  wrongAnswerDamage: 20,
  shieldWrongAnswerDamage: 5,
  timeoutDamage: 10,
  scrollDamage: 25,
  focusMax: 100,
  focusStart: 0,
  focusCorrectGain: 15,
  focusTimerBonusSeconds: 5,
};

export function createInitialGameState(
  levels: LevelDefinition[],
  balance: BalanceConfig = defaultBalance,
): GameState {
  return {
    status: 'menu',
    levels,
    balance,
    currentLevelIndex: 0,
    playerHp: balance.playerMaxHp,
    focus: balance.focusStart,
    enemyHp: balance.enemyMaxHp,
    currentQuestion: null,
    combo: 0,
    inventory: initialInventory,
    missionCurrent: 0,
    activeShield: false,
    lastEvents: [],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return startLevel(
        { ...state, status: 'playing', currentLevelIndex: 0, playerHp: state.balance.playerMaxHp },
        [event('GAME_STARTED')],
      );
    case 'GENERATE_QUESTION':
      return withQuestion(state);
    case 'ANSWER':
      return answerQuestion(state, action.selected);
    case 'TIMEOUT':
      return timeoutQuestion(state);
    case 'NEXT_LEVEL':
      return nextLevel(state);
    case 'USE_SCROLL':
      return useScroll(state, action.scroll);
    case 'USE_POTION':
      return usePotion(state);
    case 'RESET_GAME':
      return createInitialGameState(state.levels, state.balance);
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

function startLevel(state: GameState, introEvents: GameEvent[] = []): GameState {
  const lastEvents = [...introEvents, event('LEVEL_STARTED', { levelIndex: state.currentLevelIndex })];
  return withQuestion({
    ...state,
    status: 'playing',
    enemyHp: state.balance.enemyMaxHp,
    missionCurrent: 0,
    activeShield: false,
    lastEvents,
  }, lastEvents);
}

function withQuestion(state: GameState, lastEvents: GameEvent[] = []): GameState {
  if (state.status !== 'playing') return state;

  return {
    ...state,
    currentQuestion: generateQuestion(state.levels[state.currentLevelIndex]),
    lastEvents,
  };
}

function answerQuestion(state: GameState, selected: number): GameState {
  if (state.status !== 'playing' || !state.currentQuestion) return state;

  if (selected === state.currentQuestion.correctValue) {
    const combo = state.combo + 1;
    const damage = getCorrectAnswerDamage(combo, state.balance);
    const nextState: GameState = {
      ...state,
      combo,
      missionCurrent: Math.min(state.balance.missionTarget, state.missionCurrent + 1),
      enemyHp: Math.max(0, state.enemyHp - damage),
      focus: Math.min(state.balance.focusMax, state.focus + state.balance.focusCorrectGain),
      lastEvents: [event('ANSWER_CORRECT', { combo, damage })],
    };
    return resolveVictory(nextState);
  }

  const damage = getWrongAnswerDamage(state.activeShield, state.balance);
  const { focus, hpDamage } = absorbDamageWithFocus(state, damage);
  const nextState: GameState = {
    ...state,
    combo: 0,
    activeShield: false,
    focus,
    playerHp: Math.max(0, state.playerHp - hpDamage),
    lastEvents: [event('ANSWER_WRONG', { selected, correctValue: state.currentQuestion.correctValue }), event('PLAYER_DAMAGED', { damage: hpDamage, focusDamage: damage - hpDamage })],
  };
  return resolveGameOver(nextState);
}

function timeoutQuestion(state: GameState): GameState {
  if (state.status !== 'playing') return state;

  const { focus, hpDamage } = absorbDamageWithFocus(state, state.balance.timeoutDamage);
  const nextState: GameState = {
    ...state,
    combo: 0,
    focus,
    playerHp: Math.max(0, state.playerHp - hpDamage),
    lastEvents: [event('TIMEOUT'), event('PLAYER_DAMAGED', { damage: hpDamage, focusDamage: state.balance.timeoutDamage - hpDamage })],
  };
  return resolveGameOver(nextState);
}

function resolveVictory(state: GameState): GameState {
  if (!hasEnemyLost(state)) return state;

  const missionCompleted = state.missionCurrent >= state.balance.missionTarget;
  return {
    ...state,
    status: 'victory',
    inventory: missionCompleted ? restoreMissionRewards(state.inventory) : state.inventory,
    lastEvents: [...state.lastEvents, event('LEVEL_COMPLETE', { missionCompleted })],
  };
}

function resolveGameOver(state: GameState): GameState {
  if (!hasPlayerLost(state)) return state;
  return {
    ...state,
    status: 'game-over',
    lastEvents: [...state.lastEvents, event('GAME_OVER')],
  };
}

function nextLevel(state: GameState): GameState {
  if (state.status === 'game-over' || state.status === 'completed') {
    return gameReducer(createInitialGameState(state.levels, state.balance), { type: 'START_GAME' });
  }

  const nextLevelIndex = state.currentLevelIndex + 1;
  if (nextLevelIndex >= state.levels.length) {
    return {
      ...state,
      status: 'completed',
      lastEvents: [event('GAME_COMPLETED')],
    };
  }

  return startLevel({
    ...state,
    currentLevelIndex: nextLevelIndex,
    playerHp: state.balance.playerMaxHp,
  }, [event('NEXT_LEVEL_REQUESTED')]);
}

function absorbDamageWithFocus(state: GameState, damage: number) {
  const focusDamage = Math.min(state.focus, damage);
  return {
    focus: Math.max(0, state.focus - damage),
    hpDamage: damage - focusDamage,
  };
}

function useScroll(state: GameState, scroll: 'product' | 'division' | 'negative'): GameState {
  if (state.status !== 'playing') return state;

  if (scroll === 'product' && state.inventory.scrollProduct > 0 && state.currentQuestion) {
    return answerQuestion({
      ...state,
      inventory: { ...state.inventory, scrollProduct: state.inventory.scrollProduct - 1 },
      lastEvents: [event('ITEM_USED', { item: scroll })],
    }, state.currentQuestion.correctValue);
  }

  if (scroll === 'division' && state.inventory.scrollDivision > 0) {
    const nextState: GameState = {
      ...state,
      enemyHp: Math.max(0, state.enemyHp - state.balance.scrollDamage),
      inventory: { ...state.inventory, scrollDivision: state.inventory.scrollDivision - 1 },
      lastEvents: [event('ITEM_USED', { item: scroll, damage: state.balance.scrollDamage })],
    };
    return resolveVictory(nextState);
  }

  if (scroll === 'negative' && state.inventory.scrollNegative > 0) {
    return {
      ...state,
      activeShield: true,
      inventory: { ...state.inventory, scrollNegative: state.inventory.scrollNegative - 1 },
      lastEvents: [event('ITEM_USED', { item: scroll })],
    };
  }

  return state;
}

function usePotion(state: GameState): GameState {
  if (state.status !== 'playing' || state.inventory.potions <= 0) return state;

  return {
    ...state,
    inventory: { ...state.inventory, potions: state.inventory.potions - 1 },
    lastEvents: [event('ITEM_USED', { item: 'potion' })],
  };
}
