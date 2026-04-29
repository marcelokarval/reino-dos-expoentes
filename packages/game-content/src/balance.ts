import type { BalanceConfig } from '@reino/game-core';

export const defaultGameBalance: BalanceConfig = {
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
