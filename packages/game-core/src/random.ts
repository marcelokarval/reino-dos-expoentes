import type { RandomSource } from './types';

export function randomInteger(min: number, max: number, random: RandomSource = Math.random): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function shuffle<T>(items: T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
