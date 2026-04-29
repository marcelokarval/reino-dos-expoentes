import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { GameState } from '@reino/game-core';
import type { useGameController } from '../hooks/useGameController';
import { colors, spacing } from '../theme/tokens';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface InventoryPanelProps {
  state: GameState;
  actions: ReturnType<typeof useGameController>['actions'];
}

export function InventoryPanel({ state, actions }: InventoryPanelProps) {
  const itemUsed = state.lastEvents.some((event) => event.type === 'ITEM_USED');
  const glow = useSharedValue(0);

  useEffect(() => {
    if (!itemUsed) return;
    glow.value = withSequence(withTiming(1, { duration: 160 }), withTiming(0, { duration: 420 }));
  }, [glow, itemUsed]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: itemUsed ? colors.scroll : 'rgba(255,255,255,0.05)',
    opacity: 0.96 + glow.value * 0.04,
    transform: [{ scale: 1 + glow.value * 0.015 }],
  }));

  return (
    <Animated.View style={[styles.panel, animatedStyle]}>
      <Text style={styles.combo}>COMBO: {state.combo}</Text>
      <Text style={styles.inventoryTitle}>📜 Pergaminhos</Text>
      <Item label="Produto (Auto)" count={state.inventory.scrollProduct} onUse={actions.useProductScroll} />
      <Item label="Divisão (Stun)" count={state.inventory.scrollDivision} onUse={actions.useDivisionScroll} />
      <Item label="Expo. Neg. (Escudo)" count={state.inventory.scrollNegative} onUse={actions.useNegativeScroll} />
      <Item label="🧪 Poção" count={state.inventory.potions} onUse={actions.usePotion} />
    </Animated.View>
  );
}

function Item({ label, count, onUse }: { label: string; count: number; onUse: () => void }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{label}</Text>
      <Pressable style={[styles.itemButton, count <= 0 && styles.disabled]} disabled={count <= 0} onPress={onUse}>
        <Text style={styles.itemButtonText}>USAR ({count})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: spacing.sm, padding: spacing.md, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.35)' },
  combo: { color: colors.accent, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  inventoryTitle: { color: colors.scroll, fontWeight: '900', textTransform: 'uppercase' },
  item: { gap: spacing.sm, padding: spacing.sm, borderWidth: 1, borderColor: colors.scroll, borderRadius: 8, backgroundColor: '#2c2c3d' },
  itemText: { color: colors.text },
  itemButton: { padding: spacing.sm, borderRadius: 6, backgroundColor: colors.scroll },
  itemButtonText: { color: '#000', fontWeight: '900', textAlign: 'center' },
  disabled: { opacity: 0.5 },
});
