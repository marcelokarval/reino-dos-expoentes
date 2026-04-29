import { useEffect, useRef } from 'react';
import { getAudioCues, type AudioCue, type GameEvent } from '@reino/game-core';
import { sfxByCue } from '@reino/assets';

const frequencyByCue: Record<AudioCue, number> = {
  startAdventure: 392,
  levelStart: 523,
  nextLevel: 587,
  correct: 660,
  wrong: 180,
  damage: 140,
  item: 520,
  victory: 880,
  gameOver: 110,
  completed: 990,
  timeout: 220,
  timerWarning: 440,
};

export function useGameSfx(events: GameEvent[], enabled = true, volume = 0.55) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unlock = () => {
      audioContextRef.current ??= new AudioContext();
      audioContextRef.current.resume().catch(() => undefined);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    for (const cue of getAudioCues(events)) {
      const asset = sfxByCue[cue];
      if (asset) {
        const audio = new Audio(asset.path);
        audio.volume = volume;
        audio.play().catch(() => playFallbackCue(audioContextRef.current, cue, volume));
      } else {
        playFallbackCue(audioContextRef.current, cue, volume);
      }
    }
  }, [enabled, events, volume]);
}

function playFallbackCue(audioContext: AudioContext | null, cue: AudioCue, volume: number) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = cue === 'wrong' || cue === 'gameOver' ? 'sawtooth' : 'sine';
  oscillator.frequency.setValueAtTime(frequencyByCue[cue], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.3), now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}
