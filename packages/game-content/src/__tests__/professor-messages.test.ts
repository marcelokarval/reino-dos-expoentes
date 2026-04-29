import { describe, expect, it } from 'vitest';
import { getProfessorMessage } from '../index';

describe('getProfessorMessage', () => {
  it('returns an encouraging correct-answer message', () => {
    const message = getProfessorMessage({ eventTypes: ['ANSWER_CORRECT'], combo: 1, property: 'multiplication' });

    expect(message.tone).toBe('praise');
    expect(message.text.length).toBeGreaterThan(10);
  });

  it('prioritizes combo encouragement for strong streaks', () => {
    const message = getProfessorMessage({ eventTypes: ['ANSWER_CORRECT'], combo: 3, property: 'division' });

    expect(message.tone).toBe('combo');
  });

  it('returns a coaching message for wrong answers', () => {
    const message = getProfessorMessage({ eventTypes: ['ANSWER_WRONG'], combo: 0, property: 'negative' });

    expect(message.tone).toBe('coach');
    expect(message.text).toContain('Expoente negativo');
  });

  it('avoids repeating the previous message when alternatives exist', () => {
    const first = getProfessorMessage({ eventTypes: ['ANSWER_CORRECT'], combo: 1, property: 'multiplication' });
    const second = getProfessorMessage({
      eventTypes: ['ANSWER_CORRECT'],
      combo: 1,
      previousText: first.text,
      property: 'multiplication',
    });

    expect(second.text).not.toBe(first.text);
  });

  it('returns phase-specific victory messages', () => {
    const multiplication = getProfessorMessage({ eventTypes: ['LEVEL_COMPLETE'], combo: 5, property: 'multiplication' });
    const negative = getProfessorMessage({ eventTypes: ['LEVEL_COMPLETE'], combo: 5, property: 'negative' });

    expect(multiplication.tone).toBe('celebrate');
    expect(multiplication.text).toContain('Produto');
    expect(negative.text).toContain('negativo');
    expect(negative.text).not.toBe(multiplication.text);
  });
});
