import type { GameEvent, GameEventType } from './types';

export function event(type: GameEventType, payload?: Record<string, unknown>): GameEvent {
  return payload ? { type, payload } : { type };
}
