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

  it('generates varied zero exponent question formats', () => {
    const direct = generateQuestion(level('zeroExponent'), fixedRandom([0, 0.2, 0.4, 0.1, 0.5, 0.9, 0.8, 0.7, 0.6]));
    const symbolic = generateQuestion(level('zeroExponent'), fixedRandom([0, 0.2, 0.4, 0.45, 0.5, 0.9, 0.8, 0.7, 0.6]));
    const simplified = generateQuestion(level('zeroExponent'), fixedRandom([0, 0.2, 0.4, 0.8, 0.5, 0.9, 0.8, 0.7, 0.6]));

    expect(new Set([direct.text, symbolic.text, simplified.text]).size).toBe(3);
    expect(symbolic.text).toContain('x<sup>0</sup>');
    expect(symbolic.text).toContain('x != 0');
    expect(simplified.text).toContain('/');
    expect([direct, symbolic, simplified].every((question) => question.options.includes(question.correctValue))).toBe(true);
  });

  it('generates negative exponent questions with negative answer', () => {
    const question = generateQuestion(level('negative'), fixedRandom([0, 0.2, 0.4, 0.1, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(-2);
    expect(question.text).toContain('1 / 2<sup>2</sup>');
  });

  it('generates complex questions by simplifying product and division', () => {
    const question = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.1, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(3);
    expect(question.text).toContain('/ 2<sup>2</sup>');
  });

  it('generates mixed complex question formats', () => {
    const productDivision = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.1, 0.9, 0.8, 0.7, 0.6]));
    const powerDivision = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.35, 0.9, 0.8, 0.7, 0.6]));
    const zeroStep = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.6, 0.9, 0.8, 0.7, 0.6]));
    const negativeStep = generateQuestion(level('complex'), fixedRandom([0, 0.2, 0.4, 0.9, 0.9, 0.8, 0.7, 0.6]));

    expect(new Set([productDivision.text, powerDivision.text, zeroStep.text, negativeStep.text]).size).toBe(4);
    expect(powerDivision.text).toContain(')<sup>');
    expect(zeroStep.text).toContain('<sup>0</sup>');
    expect(negativeStep.correctValue).toBeLessThan(0);
  });
});
