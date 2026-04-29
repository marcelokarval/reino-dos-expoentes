import { useEffect, useMemo, useRef } from 'react';
import { getBattleMusicCue, musicByCue, type MusicCue } from '@reino/assets';
import type { GameStatus } from '@reino/game-core';

interface UseGameMusicOptions {
  enabled: boolean;
  status: GameStatus;
  levelIndex: number;
  volume: number;
}

export function useGameMusic({ enabled, status, levelIndex, volume }: UseGameMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const cue = useMemo(() => getMusicCue(status, levelIndex), [levelIndex, status]);

  useEffect(() => {
    const unlock = () => {
      unlockedRef.current = true;
      if (audioRef.current && enabled) {
        audioRef.current.play().catch(() => undefined);
      }
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [enabled]);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;

    if (!enabled || !cue) return;

    const audio = new Audio(musicByCue[cue].path);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;
    audio.load();

    if (unlockedRef.current) {
      audio.play().catch(() => undefined);
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [cue, enabled, volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
}

function getMusicCue(status: GameStatus, levelIndex: number): MusicCue | null {
  if (status === 'menu') return 'menu';
  if (status === 'playing') return getBattleMusicCue(levelIndex);
  if (status === 'completed') return 'gameComplete';
  return null;
}
