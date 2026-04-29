export interface SpriteDefinition {
  sheetPath: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  source: string;
}

const kenneyRoguelikeSheet = 'assets/sprites/kenney-roguelike.png';

function tile(column: number, row: number, label: string): SpriteDefinition {
  const step = 17;
  return {
    sheetPath: kenneyRoguelikeSheet,
    x: column * step,
    y: row * step,
    width: 16,
    height: 16,
    label,
    source: 'kenney-roguelike-rpg-pack',
  };
}

export const enemySpritesByKey = {
  'forest-guardian': tile(14, 9, 'Forest guardian placeholder'),
  'division-bat': tile(49, 0, 'Cave bat placeholder'),
  'power-ghost': tile(55, 15, 'Tower ghost placeholder'),
  'zero-scorpion': tile(46, 17, 'Desert creature placeholder'),
  'negative-demon': tile(54, 1, 'Negative demon placeholder'),
  'chaos-king': tile(42, 15, 'Chaos king placeholder'),
} as const;

export type EnemySpriteKey = keyof typeof enemySpritesByKey;

export const musicByCue = {
  menu: { path: 'assets/audio/music/menu-theme.wav', label: 'Menu theme' },
  forestGuardian: { path: 'assets/audio/music/forest-guardian.wav', label: 'Forest guardian theme' },
  divisionCave: { path: 'assets/audio/music/division-cave.wav', label: 'Division cave theme' },
  powerTower: { path: 'assets/audio/music/power-tower.wav', label: 'Power tower theme' },
  zeroDesert: { path: 'assets/audio/music/zero-desert.wav', label: 'Zero desert theme' },
  negativeAbyss: { path: 'assets/audio/music/negative-abyss.wav', label: 'Negative abyss theme' },
  chaosThrone: { path: 'assets/audio/music/chaos-throne.wav', label: 'Chaos throne theme' },
  battleBasic: { path: 'assets/audio/music/battle-basic.wav', label: 'Basic battle loop' },
  battleIntermediate: { path: 'assets/audio/music/battle-intermediate.wav', label: 'Intermediate battle loop' },
  battleAdvanced: { path: 'assets/audio/music/battle-advanced.wav', label: 'Advanced battle loop' },
  gameComplete: { path: 'assets/audio/music/game-complete.wav', label: 'Game complete theme' },
} as const;

export const sfxByCue = {
  startAdventure: { path: 'assets/audio/sfx/start-adventure.wav', label: 'Start adventure' },
  levelStart: { path: 'assets/audio/sfx/level-start.wav', label: 'Level start' },
  nextLevel: { path: 'assets/audio/sfx/next-level.wav', label: 'Next level' },
  correct: { path: 'assets/audio/sfx/correct.wav', label: 'Correct answer' },
  wrong: { path: 'assets/audio/sfx/wrong.wav', label: 'Wrong answer' },
  damage: { path: 'assets/audio/sfx/damage.wav', label: 'Player damage' },
  item: { path: 'assets/audio/sfx/item.wav', label: 'Item used' },
  victory: { path: 'assets/audio/sfx/victory.wav', label: 'Level victory' },
  gameOver: { path: 'assets/audio/sfx/game-over.wav', label: 'Game over' },
  completed: { path: 'assets/audio/sfx/completed.wav', label: 'Game completed' },
  timeout: { path: 'assets/audio/sfx/timeout.wav', label: 'Timeout' },
  timerWarning: { path: 'assets/audio/sfx/timer-warning.wav', label: 'Timer warning' },
  uiToggle: { path: 'assets/audio/sfx/ui-toggle.wav', label: 'UI toggle' },
} as const;

export type MusicCue = keyof typeof musicByCue;
export type SfxCue = keyof typeof sfxByCue;

export function getBattleMusicCue(levelIndex: number): MusicCue {
  const cueByLevel: MusicCue[] = ['forestGuardian', 'divisionCave', 'powerTower', 'zeroDesert', 'negativeAbyss', 'chaosThrone'];
  return cueByLevel[levelIndex] ?? 'battleBasic';
}

export const assetCatalog = {
  sprites: {
    enemies: enemySpritesByKey,
  },
  audio: {
    music: musicByCue,
    sfx: sfxByCue,
  },
} as const;
