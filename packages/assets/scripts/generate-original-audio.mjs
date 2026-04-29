import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const targets = [
  join(root, 'audio'),
  join(root, '../../apps/web/public/assets/audio'),
  join(root, '../../apps/mobile/assets/audio'),
];

const music = {
  'music/menu-theme.wav': { notes: [392, 494, 587, 659], duration: 10, bpm: 96, wave: 'triangle', volume: 0.22 },
  'music/forest-guardian.wav': { notes: [262, 330, 392, 523], duration: 9, bpm: 104, wave: 'triangle', volume: 0.2 },
  'music/division-cave.wav': { notes: [147, 196, 220, 294], duration: 9, bpm: 112, wave: 'sine', volume: 0.22 },
  'music/power-tower.wav': { notes: [330, 494, 659, 988], duration: 9, bpm: 126, wave: 'triangle', volume: 0.2 },
  'music/zero-desert.wav': { notes: [220, 247, 330, 247], duration: 9, bpm: 92, wave: 'saw', volume: 0.16 },
  'music/negative-abyss.wav': { notes: [110, 165, 208, 247], duration: 9, bpm: 140, wave: 'square', volume: 0.17 },
  'music/chaos-throne.wav': { notes: [98, 147, 233, 311], duration: 9, bpm: 156, wave: 'saw', volume: 0.17 },
  'music/battle-basic.wav': { notes: [196, 247, 294, 330], duration: 9, bpm: 118, wave: 'square', volume: 0.18 },
  'music/battle-intermediate.wav': { notes: [220, 277, 330, 392], duration: 9, bpm: 132, wave: 'square', volume: 0.18 },
  'music/battle-advanced.wav': { notes: [165, 208, 247, 311], duration: 9, bpm: 148, wave: 'saw', volume: 0.17 },
  'music/game-complete.wav': { notes: [523, 659, 784, 1047], duration: 8, bpm: 104, wave: 'triangle', volume: 0.24 },
};

const sfx = {
  'sfx/start-adventure.wav': { notes: [392, 523, 659, 784], duration: 0.72, wave: 'triangle', volume: 0.45 },
  'sfx/level-start.wav': { notes: [330, 494, 659], duration: 0.52, wave: 'triangle', volume: 0.4 },
  'sfx/next-level.wav': { notes: [440, 554, 740], duration: 0.46, wave: 'triangle', volume: 0.38 },
  'sfx/correct.wav': { notes: [660, 880], duration: 0.28, wave: 'sine', volume: 0.42 },
  'sfx/wrong.wav': { notes: [220, 164], duration: 0.32, wave: 'saw', volume: 0.36 },
  'sfx/damage.wav': { notes: [132, 98], duration: 0.36, wave: 'square', volume: 0.36 },
  'sfx/item.wav': { notes: [523, 659, 988], duration: 0.42, wave: 'triangle', volume: 0.38 },
  'sfx/victory.wav': { notes: [523, 659, 784, 1047], duration: 0.9, wave: 'triangle', volume: 0.42 },
  'sfx/game-over.wav': { notes: [196, 147, 110], duration: 0.9, wave: 'saw', volume: 0.34 },
  'sfx/completed.wav': { notes: [659, 784, 988, 1319], duration: 1.05, wave: 'triangle', volume: 0.43 },
  'sfx/timeout.wav': { notes: [440, 330, 220], duration: 0.58, wave: 'square', volume: 0.32 },
  'sfx/timer-warning.wav': { notes: [880, 0, 880], duration: 0.42, wave: 'square', volume: 0.25 },
  'sfx/ui-toggle.wav': { notes: [587, 784], duration: 0.2, wave: 'sine', volume: 0.28 },
};

for (const target of targets) {
  for (const [file, spec] of Object.entries({ ...music, ...sfx })) {
    const out = join(target, file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, makeWav(spec));
  }
}

function makeWav(spec) {
  const sampleRate = 22050;
  const sampleCount = Math.floor(sampleRate * spec.duration);
  const data = Buffer.alloc(sampleCount * 2);
  const beatSamples = spec.bpm ? Math.floor(sampleRate * (60 / spec.bpm)) : Math.floor(sampleCount / spec.notes.length);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const noteIndex = Math.min(spec.notes.length - 1, Math.floor(i / beatSamples) % spec.notes.length);
    const frequency = spec.notes[noteIndex];
    const envelope = Math.min(1, i / (sampleRate * 0.03)) * Math.min(1, (sampleCount - i) / (sampleRate * 0.08));
    const tremolo = 0.85 + 0.15 * Math.sin(2 * Math.PI * 4 * t);
    const value = frequency === 0 ? 0 : oscillator(spec.wave, frequency, t) * spec.volume * envelope * tremolo;
    data.writeInt16LE(Math.max(-1, Math.min(1, value)) * 32767, i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

function oscillator(wave, frequency, t) {
  const phase = (t * frequency) % 1;
  if (wave === 'square') return phase < 0.5 ? 1 : -1;
  if (wave === 'saw') return 2 * phase - 1;
  if (wave === 'triangle') return 1 - 4 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
  return Math.sin(2 * Math.PI * frequency * t);
}
