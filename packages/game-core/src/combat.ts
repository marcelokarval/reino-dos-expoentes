import type { BalanceConfig, GameState } from './types';

export function getCorrectAnswerDamage(combo: number, balance: BalanceConfig): number {
  return combo >= balance.comboThreshold ? balance.comboCorrectDamage : balance.baseCorrectDamage;
}

export function getWrongAnswerDamage(activeShield: boolean, balance: BalanceConfig): number {
  return activeShield ? balance.shieldWrongAnswerDamage : balance.wrongAnswerDamage;
}

export function hasPlayerLost(state: GameState): boolean {
  return state.playerHp <= 0;
}

export function hasEnemyLost(state: GameState): boolean {
  return state.enemyHp <= 0;
}
