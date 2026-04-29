import { describe, expect, it } from 'vitest';
import { getAudioCues, type GameEvent } from '../index';

describe('getAudioCues', () => {
  it('maps adventure and level transition events to SFX cues', () => {
    const events: GameEvent[] = [
      { type: 'GAME_STARTED' },
      { type: 'LEVEL_STARTED' },
      { type: 'NEXT_LEVEL_REQUESTED' },
    ];

    expect(getAudioCues(events)).toEqual(['startAdventure', 'levelStart', 'nextLevel']);
  });
});
