import type { InventoryState } from './types';

export const initialInventory: InventoryState = {
  potions: 1,
  scrollProduct: 1,
  scrollDivision: 1,
  scrollNegative: 1,
};

export function restoreMissionRewards(inventory: InventoryState): InventoryState {
  return {
    ...inventory,
    scrollProduct: inventory.scrollProduct + 1,
    scrollDivision: inventory.scrollDivision + 1,
    scrollNegative: inventory.scrollNegative + 1,
  };
}
