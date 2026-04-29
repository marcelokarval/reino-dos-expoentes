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
  focusCorrectGain: 5,
  focusComboGain: 2,
  focusMissionBonus: 10,
  focusDecayDelaySeconds: 5,
  focusDecayPerSecond: 1,
  timedFocusDecayPerSecond: 2,
  focusCapByLevel: [30, 45, 60, 75, 100, 100],
  focusTimerBonusSeconds: 0,
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
    focusDecayElapsedSeconds: 0,
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
    case 'FOCUS_DECAY_TICK':
      return decayFocus(state, action.deltaSeconds);
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
    focusDecayElapsedSeconds: 0,
    activeShield: false,
    lastEvents,
  }, lastEvents);
}

function withQuestion(state: GameState, lastEvents: GameEvent[] = []): GameState {
  if (state.status !== 'playing') return state;

  return {
    ...state,
    currentQuestion: generateQuestion(state.levels[state.currentLevelIndex]),
    focusDecayElapsedSeconds: 0,
    lastEvents,
  };
}

function answerQuestion(state: GameState, selected: number): GameState {
  if (state.status !== 'playing' || !state.currentQuestion) return state;

  if (selected === state.currentQuestion.correctValue) {
    const combo = state.combo + 1;
    const damage = getCorrectAnswerDamage(combo, state.balance);
    const focusGain = getCorrectFocusGain(combo, state.balance);
    const focus = addFocus(state, focusGain);
    const focusGained = focus - state.focus;
    const nextState: GameState = {
      ...state,
      combo,
      missionCurrent: Math.min(state.balance.missionTarget, state.missionCurrent + 1),
      enemyHp: Math.max(0, state.enemyHp - damage),
      focus,
      lastEvents: [event('ANSWER_CORRECT', { combo, damage }), ...(focusGained > 0 ? [event('FOCUS_GAINED', { amount: focusGained })] : [])],
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
    lastEvents: [
      event('ANSWER_WRONG', { selected, correctValue: state.currentQuestion.correctValue }),
      ...focusDamageEvents(damage - hpDamage, focus),
      ...hpDamageEvents(hpDamage),
    ],
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
    lastEvents: [event('TIMEOUT'), ...focusDamageEvents(state.balance.timeoutDamage - hpDamage, focus), ...hpDamageEvents(hpDamage)],
  };
  return resolveGameOver(nextState);
}

function resolveVictory(state: GameState): GameState {
  if (!hasEnemyLost(state)) return state;

  const missionCompleted = state.missionCurrent >= state.balance.missionTarget;
  const focus = missionCompleted ? addFocus(state, state.balance.focusMissionBonus) : state.focus;
  return {
    ...state,
    focus,
    status: 'victory',
    inventory: missionCompleted ? restoreMissionRewards(state.inventory) : state.inventory,
    lastEvents: [
      ...state.lastEvents,
      ...(missionCompleted && focus > state.focus ? [event('FOCUS_GAINED', { amount: focus - state.focus })] : []),
      event('LEVEL_COMPLETE', { missionCompleted }),
    ],
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

function getCorrectFocusGain(combo: number, balance: BalanceConfig) {
  return balance.focusCorrectGain + (combo >= balance.comboThreshold ? balance.focusComboGain : 0);
}

function addFocus(state: GameState, amount: number) {
  const cap = state.balance.focusCapByLevel[state.currentLevelIndex] ?? state.balance.focusMax;
  return Math.min(cap, state.focus + amount);
}

function decayFocus(state: GameState, deltaSeconds: number): GameState {
  if (state.status !== 'playing' || state.focus <= 0 || deltaSeconds <= 0) return state;

  const previousElapsed = state.focusDecayElapsedSeconds;
  const nextElapsed = previousElapsed + deltaSeconds;
  const delay = state.balance.focusDecayDelaySeconds;
  const drainableSeconds = Math.max(0, nextElapsed - delay) - Math.max(0, previousElapsed - delay);

  if (drainableSeconds <= 0) {
    return { ...state, focusDecayElapsedSeconds: nextElapsed, lastEvents: [] };
  }

  const level = state.levels[state.currentLevelIndex];
  const rate = level.timeLimitSeconds ? state.balance.timedFocusDecayPerSecond : state.balance.focusDecayPerSecond;
  const amount = Math.min(state.focus, drainableSeconds * rate);
  const focus = Math.max(0, state.focus - amount);

  return {
    ...state,
    focus,
    focusDecayElapsedSeconds: nextElapsed,
    lastEvents: [event('FOCUS_DRAINED', { amount }), ...(focus === 0 ? [event('FOCUS_DEPLETED')] : [])],
  };
}

function focusDamageEvents(amount: number, remainingFocus: number) {
  if (amount <= 0) return [];
  return [event('FOCUS_ABSORBED_DAMAGE', { amount }), ...(remainingFocus === 0 ? [event('FOCUS_DEPLETED')] : [])];
}

function hpDamageEvents(damage: number) {
  return damage > 0 ? [event('PLAYER_DAMAGED', { damage })] : [];
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
