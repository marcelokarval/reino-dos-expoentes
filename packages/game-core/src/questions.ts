import { randomInteger, shuffle } from './random';
import type { LevelDefinition, Question, RandomSource } from './types';

export function generateQuestion(level: LevelDefinition, random: RandomSource = Math.random): Question {
  const base = randomInteger(2, 6, random);
  const m = randomInteger(1, level.difficulty, random);
  const n = randomInteger(1, level.difficulty, random);
  let text = '';
  let correctValue = 0;

  switch (level.property) {
    case 'multiplication':
      text = `${base}<sup>${m}</sup> · ${base}<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m + n;
      break;
    case 'division':
      text = `${base}<sup>${m + n}</sup> / ${base}<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m;
      break;
    case 'powerOfPower':
      text = `(${base}<sup>${m}</sup>)<sup>${n}</sup> = ${base}<sup>?</sup>`;
      correctValue = m * n;
      break;
    case 'zeroExponent': {
      const variant = random();
      const zeroBase = randomInteger(1, 99, random);
      if (variant < 0.34) {
        text = `${zeroBase}<sup>0</sup> = ?`;
        correctValue = 1;
      } else if (variant < 0.67) {
        text = `x<sup>0</sup> = ? (x != 0)`;
        correctValue = 1;
      } else {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = 0;
      }
      break;
    }
    case 'negative': {
      const variant = random();
      if (variant < 0.34) {
        text = `1 / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = -m;
      } else if (variant < 0.67) {
        text = `${base}<sup>-${m}</sup> = 1 / ${base}<sup>?</sup>`;
        correctValue = m;
      } else {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m + n}</sup> = ${base}<sup>?</sup>`;
        correctValue = -n;
      }
      break;
    }
    case 'complex': {
      const variant = random();
      if (variant < 0.25) {
        text = `(${base}<sup>${m}</sup> · ${base}<sup>${n}</sup>) / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = n;
      } else if (variant < 0.5) {
        text = `(${base}<sup>${m}</sup>)<sup>${n}</sup> / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = (m * n) - m;
      } else if (variant < 0.75) {
        text = `(${base}<sup>${m}</sup> · ${base}<sup>0</sup>) = ${base}<sup>?</sup>`;
        correctValue = m;
      } else {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m + n}</sup> = ${base}<sup>?</sup>`;
        correctValue = -n;
      }
      break;
    }
    default: {
      const exhaustive: never = level.property;
      throw new Error(`Unsupported exponent property: ${exhaustive}`);
    }
  }

  return {
    text,
    correctValue,
    options: buildOptions(correctValue, random),
  };
}

export function buildOptions(correctValue: number, random: RandomSource = Math.random): number[] {
  const options = [correctValue];

  while (options.length < 4) {
    const fake = correctValue + randomInteger(-5, 4, random);
    if (!options.includes(fake)) options.push(fake);
  }

  return shuffle(options, random);
}
