import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@reino/logger';

const storageKey = 'reino-dos-expoentes:mobile-progress:v1';

export interface MobileProgressState {
  highestUnlockedLevelIndex: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  updatedAt: string;
}

export const defaultMobileProgress: MobileProgressState = {
  highestUnlockedLevelIndex: 0,
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.32,
  sfxVolume: 0.55,
  updatedAt: new Date(0).toISOString(),
};

export async function loadMobileProgress(): Promise<MobileProgressState> {
  try {
    const stored = await AsyncStorage.getItem(storageKey);
    if (!stored) return defaultMobileProgress;

    const parsed = JSON.parse(stored) as Partial<MobileProgressState> & { audioEnabled?: boolean };
    const legacyAudioEnabled = typeof parsed.audioEnabled === 'boolean' ? parsed.audioEnabled : true;
    return {
      highestUnlockedLevelIndex: Number.isInteger(parsed.highestUnlockedLevelIndex)
        ? Math.max(0, parsed.highestUnlockedLevelIndex ?? 0)
        : 0,
      musicEnabled: typeof parsed.musicEnabled === 'boolean' ? parsed.musicEnabled : legacyAudioEnabled,
      sfxEnabled: typeof parsed.sfxEnabled === 'boolean' ? parsed.sfxEnabled : legacyAudioEnabled,
      musicVolume: normalizeVolume(parsed.musicVolume, defaultMobileProgress.musicVolume),
      sfxVolume: normalizeVolume(parsed.sfxVolume, defaultMobileProgress.sfxVolume),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch (error) {
    logger.warn('MobileStorage', 'Failed to load progress', error);
    return defaultMobileProgress;
  }
}

function normalizeVolume(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;
}

export async function saveMobileProgress(progress: MobileProgressState) {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }));
  } catch (error) {
    logger.warn('MobileStorage', 'Failed to save progress', error);
  }
}

export async function clearMobileProgress() {
  try {
    await AsyncStorage.removeItem(storageKey);
  } catch (error) {
    logger.warn('MobileStorage', 'Failed to clear progress', error);
  }
}
