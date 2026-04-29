import { useEffect, useMemo, useRef } from 'react';
import { Audio } from 'expo-av';
import { getBattleMusicCue, type MusicCue } from '@reino/assets';
import type { GameStatus } from '@reino/game-core';
import { logger } from '@reino/logger';

declare const require: (path: string) => number;

const sourceByCue: Record<MusicCue, number> = {
  menu: require('../../assets/audio/music/menu-theme.wav'),
  forestGuardian: require('../../assets/audio/music/forest-guardian.wav'),
  divisionCave: require('../../assets/audio/music/division-cave.wav'),
  powerTower: require('../../assets/audio/music/power-tower.wav'),
  zeroDesert: require('../../assets/audio/music/zero-desert.wav'),
  negativeAbyss: require('../../assets/audio/music/negative-abyss.wav'),
  chaosThrone: require('../../assets/audio/music/chaos-throne.wav'),
  battleBasic: require('../../assets/audio/music/battle-basic.wav'),
  battleIntermediate: require('../../assets/audio/music/battle-intermediate.wav'),
  battleAdvanced: require('../../assets/audio/music/battle-advanced.wav'),
  gameComplete: require('../../assets/audio/music/game-complete.wav'),
};

interface UseGameMusicOptions {
  enabled: boolean;
  status: GameStatus;
  levelIndex: number;
  volume: number;
}

export function useGameMusic({ enabled, status, levelIndex, volume }: UseGameMusicOptions) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const cue = useMemo(() => getMusicCue(status, levelIndex), [levelIndex, status]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    }).catch((error: unknown) => logger.warn('MobileMusic', 'Failed to configure audio mode', error));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function replaceMusic() {
      if (soundRef.current) {
        const current = soundRef.current;
        soundRef.current = null;
        await current.unloadAsync().catch((error: unknown) => logger.warn('MobileMusic', 'Failed to unload music', error));
      }

      if (!enabled || !cue) return;

      const { sound } = await Audio.Sound.createAsync(sourceByCue[cue], {
        isLooping: true,
        shouldPlay: true,
        volume,
      });

      if (cancelled) {
        await sound.unloadAsync().catch((error: unknown) => logger.warn('MobileMusic', 'Failed to cleanup cancelled music', error));
        return;
      }

      soundRef.current = sound;
    }

    replaceMusic().catch((error: unknown) => logger.warn('MobileMusic', 'Failed to replace music', { cue, error }));

    return () => {
      cancelled = true;
    };
  }, [cue, enabled, volume]);

  useEffect(() => {
    soundRef.current?.setVolumeAsync(volume).catch((error: unknown) => logger.warn('MobileMusic', 'Failed to update music volume', error));
  }, [volume]);

  useEffect(() => () => {
    soundRef.current?.unloadAsync().catch((error: unknown) => logger.warn('MobileMusic', 'Failed to unload music on unmount', error));
  }, []);
}

function getMusicCue(status: GameStatus, levelIndex: number): MusicCue | null {
  if (status === 'menu') return 'menu';
  if (status === 'playing') return getBattleMusicCue(levelIndex);
  if (status === 'completed') return 'gameComplete';
  return null;
}
