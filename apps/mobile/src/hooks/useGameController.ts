import { useEffect, useReducer, useRef, useState } from 'react';
import { createInitialGameState, gameReducer } from '@reino/game-core';
import { defaultGameBalance, levels } from '@reino/game-content';
import { logger } from '@reino/logger';
import { clearMobileProgress, defaultMobileProgress, loadMobileProgress, saveMobileProgress } from '../storage/progress-storage';

export function useGameController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState(levels, defaultGameBalance));
  const [progress, setProgress] = useState(defaultMobileProgress);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusDecayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const level = state.levels[state.currentLevelIndex];
  const focusTimerBonus = level.timeLimitSeconds ? (state.focus / state.balance.focusMax) * state.balance.focusTimerBonusSeconds : 0;
  const effectiveTimeLimitSeconds = (level.timeLimitSeconds ?? 0) + focusTimerBonus;

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (state.status !== 'playing' || !effectiveTimeLimitSeconds || state.currentQuestion === null) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(effectiveTimeLimitSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((current) => {
        const next = Math.max(0, current - 0.1);
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          dispatch({ type: 'TIMEOUT' });
          dispatch({ type: 'GENERATE_QUESTION' });
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.currentQuestion, effectiveTimeLimitSeconds]);

  useEffect(() => {
    if (focusDecayRef.current) {
      clearInterval(focusDecayRef.current);
      focusDecayRef.current = null;
    }

    if (state.status !== 'playing' || state.currentQuestion === null || state.focus <= 0) return;

    focusDecayRef.current = setInterval(() => {
      dispatch({ type: 'FOCUS_DECAY_TICK', deltaSeconds: 1 });
    }, 1000);

    return () => {
      if (focusDecayRef.current) clearInterval(focusDecayRef.current);
    };
  }, [state.status, state.currentQuestion, state.focus]);

  useEffect(() => {
    loadMobileProgress().then(setProgress).catch((error: unknown) => logger.warn('MobileStorage', 'Progress load failed', error));
  }, []);

  useEffect(() => {
    state.lastEvents.forEach((gameEvent) => logger.info('MobileGameEvent', gameEvent.type, gameEvent.payload));
  }, [state.lastEvents]);

  useEffect(() => {
    if (state.status !== 'victory' && state.status !== 'completed') return;

    setProgress((current) => {
      const next = {
        ...current,
        highestUnlockedLevelIndex: Math.max(current.highestUnlockedLevelIndex, state.currentLevelIndex + 1),
      };
      saveMobileProgress(next).catch((error: unknown) => logger.warn('MobileStorage', 'Progress save failed', error));
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
        clearMobileProgress().catch((error: unknown) => logger.warn('MobileStorage', 'Progress clear failed', error));
        setProgress(defaultMobileProgress);
        dispatch({ type: 'RESET_GAME' });
      },
      toggleMusic: () => setProgress((current) => {
        const next = { ...current, musicEnabled: !current.musicEnabled };
        saveMobileProgress(next).catch((error: unknown) => logger.warn('MobileStorage', 'Music preference save failed', error));
        return next;
      }),
      toggleSfx: () => setProgress((current) => {
        const next = { ...current, sfxEnabled: !current.sfxEnabled };
        saveMobileProgress(next).catch((error: unknown) => logger.warn('MobileStorage', 'SFX preference save failed', error));
        return next;
      }),
      setMusicVolume: (volume: number) => setProgress((current) => {
        const next = { ...current, musicVolume: clampVolume(volume) };
        saveMobileProgress(next).catch((error: unknown) => logger.warn('MobileStorage', 'Music volume save failed', error));
        return next;
      }),
      setSfxVolume: (volume: number) => setProgress((current) => {
        const next = { ...current, sfxVolume: clampVolume(volume) };
        saveMobileProgress(next).catch((error: unknown) => logger.warn('MobileStorage', 'SFX volume save failed', error));
        return next;
      }),
    },
  };
}

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume));
}
