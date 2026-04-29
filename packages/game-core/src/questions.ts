import { randomInteger, shuffle } from './random';
import type { LevelDefinition, Question, QuestionSeed, RandomSource } from './types';

export function generateQuestion(level: LevelDefinition, random: RandomSource = Math.random, usedQuestionTexts: string[] = []): Question {
  const pool = buildQuestionPool(level);
  const availablePool = pool.filter((question) => !usedQuestionTexts.includes(question.text));
  const candidates = availablePool.length > 0 ? availablePool : pool;
  const selected = candidates[randomInteger(0, candidates.length - 1, random)];

  return {
    ...selected,
    options: buildOptions(selected.correctValue, random),
  };
}

export function buildQuestionPool(level: LevelDefinition): QuestionSeed[] {
  const questions: QuestionSeed[] = [];
  const maxBase = Math.max(8, level.difficulty + 5);
  const maxExponent = Math.max(4, level.difficulty + 2);

  for (let base = 2; base <= maxBase; base++) {
    for (let m = 1; m <= maxExponent; m++) {
      for (let n = 1; n <= maxExponent; n++) {
        questions.push(buildQuestionSeed(level, base, m, n));
      }
    }
  }

  return uniqueQuestions(questions);
}

function buildQuestionSeed(level: LevelDefinition, base: number, m: number, n: number): QuestionSeed {
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
      const zeroBase = base + (m * n);
      const variant = (base + m + n) % 4;
      if (variant === 0) {
        text = `${zeroBase}<sup>0</sup> = ?`;
        correctValue = 1;
      } else if (variant === 1) {
        text = `x<sup>0</sup> = ? (x != 0)`;
        correctValue = 1;
      } else if (variant === 2) {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = 0;
      } else {
        text = `(${base}<sup>${m}</sup>)<sup>0</sup> = ?`;
        correctValue = 1;
      }
      break;
    }
    case 'negative': {
      const variant = (base + m + n) % 4;
      if (variant === 0) {
        text = `1 / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = -m;
      } else if (variant === 1) {
        text = `${base}<sup>-${m}</sup> = 1 / ${base}<sup>?</sup>`;
        correctValue = m;
      } else if (variant === 2) {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m + n}</sup> = ${base}<sup>?</sup>`;
        correctValue = -n;
      } else {
        text = `(${base}<sup>-${m}</sup>)<sup>${n}</sup> = ${base}<sup>?</sup>`;
        correctValue = -m * n;
      }
      break;
    }
    case 'complex': {
      const variant = (base + m + n) % 6;
      if (variant === 0) {
        text = `(${base}<sup>${m}</sup> · ${base}<sup>${n}</sup>) / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = n;
      } else if (variant === 1) {
        text = `(${base}<sup>${m}</sup>)<sup>${n}</sup> / ${base}<sup>${m}</sup> = ${base}<sup>?</sup>`;
        correctValue = (m * n) - m;
      } else if (variant === 2) {
        text = `(${base}<sup>${m}</sup> · ${base}<sup>0</sup>) = ${base}<sup>?</sup>`;
        correctValue = m;
      } else if (variant === 3) {
        text = `${base}<sup>${m}</sup> / ${base}<sup>${m + n}</sup> = ${base}<sup>?</sup>`;
        correctValue = -n;
      } else if (variant === 4) {
        text = `(${base}<sup>${m}</sup> / ${base}<sup>${n}</sup>) · ${base}<sup>${n}</sup> = ${base}<sup>?</sup>`;
        correctValue = m;
      } else {
        text = `(${base}<sup>-${m}</sup> · ${base}<sup>${m + n}</sup>) = ${base}<sup>?</sup>`;
        correctValue = n;
      }
      break;
    }
    default: {
      const exhaustive: never = level.property;
      throw new Error(`Unsupported exponent property: ${exhaustive}`);
    }
  }

  return { text, correctValue };
}

export function buildOptions(correctValue: number, random: RandomSource = Math.random): number[] {
  const options = [correctValue];

  while (options.length < 4) {
    const fake = correctValue + randomInteger(-5, 4, random);
    if (!options.includes(fake)) options.push(fake);
  }

  return shuffle(options, random);
}

function uniqueQuestions(questions: QuestionSeed[]) {
  const byText = new Map<string, QuestionSeed>();
  questions.forEach((question) => byText.set(question.text, question));
  return [...byText.values()];
}
