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
      const zeroBase = randomInteger(1, 99, random);
      text = `${zeroBase}<sup>0</sup> = ?`;
      correctValue = 1;
      break;
    }
    case 'negative':
      text = `1 / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
      correctValue = -m;
      break;
    case 'complex':
      text = `(${base}<sup>${m}</sup> · ${base}<sup>${n}</sup>) / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
      correctValue = n;
      break;
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
