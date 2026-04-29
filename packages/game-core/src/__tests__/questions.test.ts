import { describe, expect, it } from 'vitest';
import { buildOptions, buildQuestionPool, generateQuestion, type LevelDefinition } from '../index';

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
    const question = generateQuestion(level('multiplication'), fixedRandom([0, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(2);
    expect(question.text).toContain('2<sup>1</sup> · 2<sup>1</sup>');
    expect(question.options).toContain(question.correctValue);
  });

  it('generates division questions by subtracting exponents', () => {
    const question = generateQuestion(level('division'), fixedRandom([0, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(1);
    expect(question.text).toContain('2<sup>2</sup> / 2<sup>1</sup>');
  });

  it('generates power-of-power questions by multiplying exponents', () => {
    const question = generateQuestion(level('powerOfPower'), fixedRandom([0, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(1);
    expect(question.text).toContain('(2<sup>1</sup>)<sup>1</sup>');
  });

  it('generates zero exponent questions with answer 1', () => {
    const question = generateQuestion(level('zeroExponent'), fixedRandom([0, 0.2, 0.4, 0.5, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBe(1);
    expect(question.text).toContain('<sup>0</sup> = ?');
  });

  it('generates varied zero exponent question formats', () => {
    const pool = buildQuestionPool(level('zeroExponent'));
    const direct = pool.find((question) => /^\d+<sup>0<\/sup> = \?$/.test(question.text));
    const symbolic = pool.find((question) => question.text.includes('x<sup>0</sup>'));
    const simplified = pool.find((question) => question.text.includes('/'));

    expect(direct).toBeDefined();
    expect(symbolic).toBeDefined();
    expect(simplified).toBeDefined();
    expect(symbolic?.text).toContain('x != 0');
  });

  it('generates negative exponent questions with negative answer', () => {
    const question = generateQuestion(level('negative'), fixedRandom([0.03, 0.9, 0.8, 0.7, 0.6]));
    expect(question.correctValue).toBeLessThan(0);
    expect(question.text).toContain('<sup>');
  });

  it('generates complex questions by simplifying product and division', () => {
    const question = generateQuestion(level('complex'), fixedRandom([0.01, 0.9, 0.8, 0.7, 0.6]));
    expect(question.text).toContain('<sup>');
    expect(question.options).toContain(question.correctValue);
  });

  it('generates mixed complex question formats', () => {
    const pool = buildQuestionPool(level('complex'));
    const productDivision = pool.find((question) => question.text.includes('·') && question.text.includes('/'));
    const powerDivision = pool.find((question) => question.text.includes(')<sup>') && question.text.includes('/'));
    const zeroStep = pool.find((question) => question.text.includes('<sup>0</sup>'));
    const negativeStep = pool.find((question) => question.correctValue < 0);

    expect(new Set([productDivision?.text, powerDivision?.text, zeroStep?.text, negativeStep?.text]).size).toBe(4);
    expect([productDivision, powerDivision, zeroStep, negativeStep].every(Boolean)).toBe(true);
  });

  it('skips questions already used in the current flow', () => {
    const currentLevel = level('multiplication');
    const first = generateQuestion(currentLevel, fixedRandom([0, 0.9, 0.8, 0.7, 0.6]));
    const second = generateQuestion(currentLevel, fixedRandom([0, 0.9, 0.8, 0.7, 0.6]), [first.text]);

    expect(second.text).not.toBe(first.text);
  });

  it('builds a larger question pool for each phase', () => {
    const minimumPoolSize = 80;

    expect(buildQuestionPool(level('multiplication')).length).toBeGreaterThanOrEqual(minimumPoolSize);
    expect(buildQuestionPool(level('division')).length).toBeGreaterThanOrEqual(minimumPoolSize);
    expect(buildQuestionPool(level('powerOfPower')).length).toBeGreaterThanOrEqual(minimumPoolSize);
    expect(buildQuestionPool(level('zeroExponent')).length).toBeGreaterThanOrEqual(minimumPoolSize);
    expect(buildQuestionPool(level('negative')).length).toBeGreaterThanOrEqual(minimumPoolSize);
    expect(buildQuestionPool(level('complex')).length).toBeGreaterThanOrEqual(minimumPoolSize);
  });

  it('shuffles answer options instead of keeping a fixed order', () => {
    const firstOrder = buildOptions(5, fixedRandom([0.1, 0.2, 0.3, 0.4, 0.1, 0.2, 0.3]));
    const secondOrder = buildOptions(5, fixedRandom([0.9, 0.8, 0.7, 0.6, 0.9, 0.8, 0.7]));

    expect(firstOrder).not.toEqual(secondOrder);
    expect(firstOrder).toContain(5);
    expect(secondOrder).toContain(5);
  });
});
