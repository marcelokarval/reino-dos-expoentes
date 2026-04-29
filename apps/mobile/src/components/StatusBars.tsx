import { StyleSheet, Text, View } from 'react-native';
import type { GameEvent, GameState } from '@reino/game-core';
import { colors, spacing } from '../theme/tokens';

interface StatusBarsProps {
  state: GameState;
  events?: GameEvent[];
}

export function StatusBars({ state, events = [] }: StatusBarsProps) {
  const eventTypes = events.map((event) => event.type);
  const focusPercent = (state.focus / state.balance.focusMax) * 100;
  const focusColor = focusPercent <= 0 ? '#d6d6dc' : focusPercent < 35 ? '#ff5252' : '#00c853';
  return (
    <View style={styles.card}>
      <Bar label="❤️ Herói (HP)" value={state.playerHp} color="#ff1744" active={eventTypes.includes('PLAYER_DAMAGED')} />
      <Bar label="👾 Inimigo (HP)" value={state.enemyHp} color="#ff9100" active={eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('ITEM_USED')} />
      <Bar label={`📜 Missão: ${state.missionCurrent}/${state.balance.missionTarget}`} value={(state.missionCurrent / state.balance.missionTarget) * 100} color="#00bcd4" active={eventTypes.includes('ANSWER_CORRECT')} />
      <Bar label={`✨ Foco: ${Math.round(state.focus)}/${state.balance.focusMax}`} value={focusPercent} color={focusColor} active={eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('PLAYER_DAMAGED')} />
    </View>
  );
}

function Bar({ label, value, color, active }: { label: string; value: number; color: string; active?: boolean }) {
  return (
    <View style={[styles.barWrap, active && styles.activeBar]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]}>
          <View style={styles.barShine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  barWrap: { gap: 6, padding: 2, borderRadius: 10 },
  activeBar: { backgroundColor: 'rgba(255,255,255,0.08)' },
  label: { color: colors.text, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  barBg: { height: 14, overflow: 'hidden', borderRadius: 8, backgroundColor: '#202033', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  barFill: { height: '100%', borderRadius: 8, shadowColor: '#fff', shadowOpacity: 0.35, shadowRadius: 8 },
  barShine: { flex: 1, backgroundColor: 'rgba(255,255,255,0.16)' },
});
