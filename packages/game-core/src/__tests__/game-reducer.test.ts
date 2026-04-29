import { describe, expect, it } from 'vitest';
import { createInitialGameState, gameReducer, type LevelDefinition } from '../index';

const levels: LevelDefinition[] = [
  {
    id: 'test-level',
    name: 'Test Level',
    icon: 'x',
    property: 'multiplication',
    rule: 'rule',
    difficulty: 3,
    timeLimitSeconds: 0,
  },
  {
    id: 'test-level-2',
    name: 'Test Level 2',
    icon: 'y',
    property: 'division',
    rule: 'rule',
    difficulty: 3,
    timeLimitSeconds: 0,
  },
];

function playingState() {
  return gameReducer(createInitialGameState(levels), { type: 'START_GAME' });
}

describe('gameReducer', () => {
  it('starts the first level with a generated question', () => {
    const state = playingState();
    expect(state.status).toBe('playing');
    expect(state.currentQuestion).not.toBeNull();
    expect(state.enemyHp).toBe(100);
    expect(state.focus).toBe(0);
    expect(state.missionCurrent).toBe(0);
    expect(state.lastEvents.map((event) => event.type)).toEqual(['GAME_STARTED', 'LEVEL_STARTED']);
  });

  it('correct answers increase mission progress and damage enemy', () => {
    const state = playingState();
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue });
    expect(next.missionCurrent).toBe(1);
    expect(next.enemyHp).toBe(82);
    expect(next.combo).toBe(1);
    expect(next.focus).toBe(5);
    expect(next.lastEvents.some((event) => event.type === 'ANSWER_CORRECT')).toBe(true);
    expect(next.lastEvents).toContainEqual(expect.objectContaining({ type: 'FOCUS_GAINED', payload: { amount: 5 } }));
  });

  it('adds a small focus bonus for combo streaks', () => {
    const state = { ...playingState(), combo: 2, focus: 10 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue });
    expect(next.combo).toBe(3);
    expect(next.focus).toBe(17);
    expect(next.lastEvents).toContainEqual(expect.objectContaining({ type: 'FOCUS_GAINED', payload: { amount: 7 } }));
  });

  it('caps focus by the current phase', () => {
    const state = { ...playingState(), focus: 28 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue });
    expect(next.focus).toBe(30);
  });

  it('does not emit a focus gained event when already capped', () => {
    const state = { ...playingState(), focus: 30 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue });
    expect(next.focus).toBe(30);
    expect(next.lastEvents.some((event) => event.type === 'FOCUS_GAINED')).toBe(false);
  });

  it('keeps accumulated focus when moving to the next level', () => {
    const state = { ...playingState(), status: 'victory' as const, focus: 45 };
    const next = gameReducer(state, { type: 'NEXT_LEVEL' });
    expect(next.focus).toBe(45);
  });

  it('wrong answers drain focus before player hp and reset combo', () => {
    const state = { ...playingState(), combo: 2, focus: 15 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue + 99 });
    expect(next.focus).toBe(0);
    expect(next.playerHp).toBe(95);
    expect(next.combo).toBe(0);
    expect(next.lastEvents.some((event) => event.type === 'ANSWER_WRONG')).toBe(true);
    expect(next.lastEvents).toContainEqual(expect.objectContaining({ type: 'FOCUS_ABSORBED_DAMAGE', payload: { amount: 15 } }));
  });

  it('wrong answers do not damage hp while focus absorbs all damage', () => {
    const state = { ...playingState(), focus: 25 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue + 99 });
    expect(next.focus).toBe(5);
    expect(next.playerHp).toBe(100);
    expect(next.lastEvents.some((event) => event.type === 'PLAYER_DAMAGED')).toBe(false);
  });

  it('does not drain focus before the grace window expires', () => {
    const state = { ...playingState(), focus: 20 };
    const next = gameReducer(state, { type: 'FOCUS_DECAY_TICK', deltaSeconds: 4 });
    expect(next.focus).toBe(20);
  });

  it('drains focus after the grace window on untimed phases', () => {
    const state = { ...playingState(), focus: 20 };
    const next = gameReducer(state, { type: 'FOCUS_DECAY_TICK', deltaSeconds: 6 });
    expect(next.focus).toBe(19);
    expect(next.lastEvents).toContainEqual(expect.objectContaining({ type: 'FOCUS_DRAINED', payload: { amount: 1 } }));
  });

  it('drains focus faster after the grace window on timed phases', () => {
    const timedLevels = [{ ...levels[0], timeLimitSeconds: 12 }];
    const state = { ...gameReducer(createInitialGameState(timedLevels), { type: 'START_GAME' }), focus: 20 };
    const next = gameReducer(state, { type: 'FOCUS_DECAY_TICK', deltaSeconds: 6 });
    expect(next.focus).toBe(18);
  });

  it('negative scroll shield reduces wrong-answer damage once', () => {
    const shielded = gameReducer({ ...playingState(), focus: 0 }, { type: 'USE_SCROLL', scroll: 'negative' });
    const next = gameReducer(shielded, { type: 'ANSWER', selected: shielded.currentQuestion!.correctValue + 99 });
    expect(next.playerHp).toBe(95);
    expect(next.activeShield).toBe(false);
  });

  it('timeout damages player once per action', () => {
    const state = { ...playingState(), focus: 0 };
    const afterTimeout = gameReducer(state, { type: 'TIMEOUT' });
    expect(afterTimeout.playerHp).toBe(90);
    const afterSecondTimeout = gameReducer(afterTimeout, { type: 'TIMEOUT' });
    expect(afterSecondTimeout.playerHp).toBe(80);
  });

  it('allows mission target to be reached before victory', () => {
    let state = playingState();
    for (let count = 0; count < 5; count++) {
      state = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue });
      if (state.status === 'playing') {
        state = gameReducer(state, { type: 'GENERATE_QUESTION' });
      }
    }
    expect(state.status).toBe('victory');
    expect(state.missionCurrent).toBe(5);
  });

  it('division scroll can finish a level', () => {
    const state = { ...playingState(), enemyHp: 20 };
    const next = gameReducer(state, { type: 'USE_SCROLL', scroll: 'division' });
    expect(next.status).toBe('victory');
    expect(next.enemyHp).toBe(0);
  });

  it('moves to the next level after victory', () => {
    const state = { ...playingState(), status: 'victory' as const };
    const next = gameReducer(state, { type: 'NEXT_LEVEL' });
    expect(next.status).toBe('playing');
    expect(next.currentLevelIndex).toBe(1);
    expect(next.playerHp).toBe(100);
    expect(next.lastEvents.map((event) => event.type)).toEqual(['NEXT_LEVEL_REQUESTED', 'LEVEL_STARTED']);
  });

  it('marks game over when player hp reaches zero', () => {
    const state = { ...playingState(), playerHp: 10, focus: 0 };
    const next = gameReducer(state, { type: 'ANSWER', selected: state.currentQuestion!.correctValue + 99 });
    expect(next.status).toBe('game-over');
    expect(next.lastEvents.some((event) => event.type === 'GAME_OVER')).toBe(true);
  });
});
