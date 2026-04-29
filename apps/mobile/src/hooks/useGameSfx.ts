import { useEffect } from 'react';
import { Audio } from 'expo-av';
import { getAudioCues, type AudioCue, type GameEvent } from '@reino/game-core';
import { logger } from '@reino/logger';

declare const require: (path: string) => number;

const sourceByCue: Record<AudioCue, number> = {
  startAdventure: require('../../assets/audio/sfx/start-adventure.wav'),
  levelStart: require('../../assets/audio/sfx/level-start.wav'),
  nextLevel: require('../../assets/audio/sfx/next-level.wav'),
  correct: require('../../assets/audio/sfx/correct.wav'),
  wrong: require('../../assets/audio/sfx/wrong.wav'),
  damage: require('../../assets/audio/sfx/damage.wav'),
  item: require('../../assets/audio/sfx/item.wav'),
  victory: require('../../assets/audio/sfx/victory.wav'),
  gameOver: require('../../assets/audio/sfx/game-over.wav'),
  completed: require('../../assets/audio/sfx/completed.wav'),
  timeout: require('../../assets/audio/sfx/timeout.wav'),
  timerWarning: require('../../assets/audio/sfx/timer-warning.wav'),
};

export function useGameSfx(events: GameEvent[], enabled = true, volume = 0.55) {
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    }).catch((error: unknown) => logger.warn('MobileAudio', 'Failed to configure audio mode', error));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    for (const cue of getAudioCues(events)) {
      Audio.Sound.createAsync(sourceByCue[cue], { shouldPlay: true, volume })
        .then(({ sound }) => {
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync().catch((error: unknown) => logger.warn('MobileAudio', 'Failed to unload sound', error));
            }
          });
        })
        .catch((error: unknown) => logger.warn('MobileAudio', 'Failed to play sound', { cue, error }));
    }
  }, [enabled, events, volume]);
}
