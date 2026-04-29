import { describe, expect, it } from 'vitest';
import { generateQuestion, type LevelDefinition } from '../index';

function level(property: LevelDefinition['property']): LevelDefinition {
  return {
    id: property,
    name: property,
    icon: 'x',
    property,
    rule: 'rule',
    difficulty: 5,
    timeLimitSeconds: 0,
  };
}

function fixedRandom(values: number[]) {
  let index = 0;
  return () => values[index++ % values.length];
}

describe('generateQuestion', () => {
  it('generates multiplication questions by adding exponents', () => {
    const question = generateQuestion(level('multiplication'), fixedRandom([0, 0.2, 0.4, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(5);
    expect(question.text).toContain('2<sup>2</sup> · 2<sup>3</sup>');
    expect(question.options).toContain(5);
  });

  it('generates division questions by subtracting exponents', () => {
    const question = generateQuestion(level('division'), fixedRandom([0, 0.2, 0.4, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(2);
    expect(question.text).toContain('2<sup>5</sup> / 2<sup>3</sup>');
  });

  it('generates power-of-power questions by multiplying exponents', () => {
    const question = generateQuestion(level('powerOfPower'), fixedRandom([0, 0.2, 0.4, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(6);
    expect(question.text).toContain('(2<sup>2</sup>)<sup>3</sup>');
  });

  it('generates zero exponent questions with answer 1', () => {
    const question = generateQuestion(level('zeroExponent'), fixedRandom([0, 0.2, 0.4, 0.5, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(1);
    expect(question.text).toContain('<sup>0</sup> = ?');
  });

  it('generates negative exponent questions with negative answer', () => {
    const question = generateQuestion(level('negative'), fixedRandom([0, 0.2, 0.4, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(-2);
    expect(question.text).toContain('1 / 2<sup>2</sup>');
  });

  it('generates complex questions by simplifying product and division', () => {
    const question = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(3);
    expect(question.text).toContain('/ 2<sup>2</sup>');
  });
});
