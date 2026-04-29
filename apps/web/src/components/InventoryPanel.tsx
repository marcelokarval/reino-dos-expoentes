import type { GameState } from '@reino/game-core';
import type { useGameController } from '../hooks/useGameController';

interface InventoryPanelProps {
  state: GameState;
  actions: ReturnType<typeof useGameController>['actions'];
}

export function InventoryPanel({ state, actions }: InventoryPanelProps) {
  const itemUsed = state.lastEvents.some((event) => event.type === 'ITEM_USED');

  return (
      <div className={itemUsed ? 'side-panel inventory-pulse' : 'side-panel'}>
        <div className="combo-badge">COMBO: {state.combo}</div>
      <div className="inventory-section">
        <div className="label inventory-label">Recursos táticos</div>
        <InventoryItem label="Produto (Auto)" count={state.inventory.scrollProduct} onUse={actions.useProductScroll} />
        <InventoryItem label="Divisão (Stun)" count={state.inventory.scrollDivision} onUse={actions.useDivisionScroll} />
        <InventoryItem label="Expo. Neg. (Escudo)" count={state.inventory.scrollNegative} onUse={actions.useNegativeScroll} />
        <InventoryItem label="Poção" count={state.inventory.potions} onUse={actions.usePotion} potion />
      </div>
    </div>
  );
}

function InventoryItem({ label, count, onUse, potion = false }: { label: string; count: number; onUse: () => void; potion?: boolean }) {
  return (
    <div className={potion ? 'scroll-item potion' : 'scroll-item'}>
      <span>{label}</span>
      <button className={potion ? 'btn-use-scroll btn-potion' : 'btn-use-scroll'} type="button" disabled={count <= 0} onClick={onUse}>
        USAR ({count})
      </button>
    </div>
  );
}
