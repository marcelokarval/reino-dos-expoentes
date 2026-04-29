import { useEffect, useReducer, useRef, useState } from 'react';
import { createInitialGameState, gameReducer } from '@reino/game-core';
import { defaultGameBalance, levels } from '@reino/game-content';
import { logger } from '@reino/logger';
import { clearWebProgress, loadWebProgress, saveWebProgress } from '../lib/progress-storage';

export function useGameController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState(levels, defaultGameBalance));
  const [progress, setProgress] = useState(loadWebProgress);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  const level = state.levels[state.currentLevelIndex];
  const focusTimerBonus = level.timeLimitSeconds ? (state.focus / state.balance.focusMax) * state.balance.focusTimerBonusSeconds : 0;
  const effectiveTimeLimitSeconds = (level.timeLimitSeconds ?? 0) + focusTimerBonus;

  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (state.status !== 'playing' || !effectiveTimeLimitSeconds || state.currentQuestion === null) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(effectiveTimeLimitSeconds);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((current) => {
        const next = Math.max(0, current - 0.1);
        if (next <= 0) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          dispatch({ type: 'TIMEOUT' });
          dispatch({ type: 'GENERATE_QUESTION' });
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [state.status, state.currentQuestion, effectiveTimeLimitSeconds]);

  useEffect(() => {
    state.lastEvents.forEach((gameEvent) => logger.info('GameEvent', gameEvent.type, gameEvent.payload));
  }, [state.lastEvents]);

  useEffect(() => {
    if (state.status !== 'victory' && state.status !== 'completed') return;

    setProgress((current) => {
      const next = {
        ...current,
        highestUnlockedLevelIndex: Math.max(current.highestUnlockedLevelIndex, state.currentLevelIndex + 1),
      };
      saveWebProgress(next);
      return next;
    });
  }, [state.currentLevelIndex, state.status]);

  function answer(selected: number) {
    dispatch({ type: 'ANSWER', selected });
    setTimeout(() => dispatch({ type: 'GENERATE_QUESTION' }), 700);
  }

  return {
    state,
    level,
    progress,
    timeLeft,
    effectiveTimeLimitSeconds,
    timerPercent: effectiveTimeLimitSeconds ? (timeLeft / effectiveTimeLimitSeconds) * 100 : 0,
    actions: {
      start: () => dispatch({ type: 'START_GAME' }),
      answer,
      nextLevel: () => dispatch({ type: 'NEXT_LEVEL' }),
      useProductScroll: () => dispatch({ type: 'USE_SCROLL', scroll: 'product' }),
      useDivisionScroll: () => dispatch({ type: 'USE_SCROLL', scroll: 'division' }),
      useNegativeScroll: () => dispatch({ type: 'USE_SCROLL', scroll: 'negative' }),
      usePotion: () => dispatch({ type: 'USE_POTION' }),
      reset: () => dispatch({ type: 'RESET_GAME' }),
      resetProgress: () => {
        clearWebProgress();
        setProgress(loadWebProgress());
        dispatch({ type: 'RESET_GAME' });
      },
      toggleMusic: () => setProgress((current) => {
        const next = { ...current, musicEnabled: !current.musicEnabled };
        saveWebProgress(next);
        return next;
      }),
      toggleSfx: () => setProgress((current) => {
        const next = { ...current, sfxEnabled: !current.sfxEnabled };
        saveWebProgress(next);
        return next;
      }),
      setMusicVolume: (volume: number) => setProgress((current) => {
        const next = { ...current, musicVolume: clampVolume(volume) };
        saveWebProgress(next);
        return next;
      }),
      setSfxVolume: (volume: number) => setProgress((current) => {
        const next = { ...current, sfxVolume: clampVolume(volume) };
        saveWebProgress(next);
        return next;
      }),
    },
  };
}

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}
