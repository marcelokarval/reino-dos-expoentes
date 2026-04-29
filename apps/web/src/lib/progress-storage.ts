const storageKey = 'reino-dos-expoentes:web-progress:v1';

export interface WebProgressState {
  highestUnlockedLevelIndex: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  updatedAt: string;
}

export const defaultWebProgress: WebProgressState = {
  highestUnlockedLevelIndex: 0,
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.32,
  sfxVolume: 0.55,
  updatedAt: new Date(0).toISOString(),
};

export function loadWebProgress(): WebProgressState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultWebProgress;

    const parsed = JSON.parse(stored) as Partial<WebProgressState> & { audioEnabled?: boolean };
    const legacyAudioEnabled = typeof parsed.audioEnabled === 'boolean' ? parsed.audioEnabled : true;
    return {
      highestUnlockedLevelIndex: Number.isInteger(parsed.highestUnlockedLevelIndex)
        ? Math.max(0, parsed.highestUnlockedLevelIndex ?? 0)
        : 0,
      musicEnabled: typeof parsed.musicEnabled === 'boolean' ? parsed.musicEnabled : legacyAudioEnabled,
      sfxEnabled: typeof parsed.sfxEnabled === 'boolean' ? parsed.sfxEnabled : legacyAudioEnabled,
      musicVolume: normalizeVolume(parsed.musicVolume, defaultWebProgress.musicVolume),
      sfxVolume: normalizeVolume(parsed.sfxVolume, defaultWebProgress.sfxVolume),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return defaultWebProgress;
  }
}

export function saveWebProgress(progress: WebProgressState) {
  window.localStorage.setItem(storageKey, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }));
}

export function clearWebProgress() {
  window.localStorage.removeItem(storageKey);
}

function normalizeVolume(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;
}
