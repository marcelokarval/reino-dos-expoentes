import { StyleSheet, Text, View } from 'react-native';
import type { GameEvent, GameState } from '@reino/game-core';
import { colors, spacing } from '../theme/tokens';

interface StatusBarsProps {
  state: GameState;
  events?: GameEvent[];
}

export function StatusBars({ state, events = [] }: StatusBarsProps) {
  const eventTypes = events.map((event) => event.type);
  const focusCap = state.balance.focusCapByLevel[state.currentLevelIndex] ?? state.balance.focusMax;
  const focusPercent = (state.focus / focusCap) * 100;
  const focusColor = focusPercent <= 0 ? '#d6d6dc' : focusPercent < 35 ? '#ff5252' : '#00c853';
  const focusDelta = [...events].reverse().find((event) => event.type.startsWith('FOCUS_') && typeof event.payload?.amount === 'number');
  const focusDelayLeft = Math.max(0, state.balance.focusDecayDelaySeconds - state.focusDecayElapsedSeconds);
  const focusHint = state.status !== 'playing' || state.focus <= 0
    ? 'sem foco acumulado'
    : focusDelayLeft > 0
      ? `drena em ${Math.ceil(focusDelayLeft)}s`
      : 'drenando';
  const focusDeltaText = focusDelta ? focusEventText(focusDelta.type, Number(focusDelta.payload?.amount)) : focusHint;
  return (
    <View style={styles.card}>
      <Bar label="Herói HP" value={state.playerHp} color="#ff1744" active={eventTypes.includes('PLAYER_DAMAGED')} />
      <Bar label="Inimigo HP" value={state.enemyHp} color="#ff9100" active={eventTypes.includes('ANSWER_CORRECT') || eventTypes.includes('ITEM_USED')} />
      <Bar label={`Missão: ${state.missionCurrent}/${state.balance.missionTarget}`} value={(state.missionCurrent / state.balance.missionTarget) * 100} color="#00bcd4" active={eventTypes.includes('ANSWER_CORRECT')} />
      <Bar label={`Foco: ${Math.round(state.focus)}/${focusCap}`} value={focusPercent} color={focusColor} active={eventTypes.some((type) => type.startsWith('FOCUS_'))} hint={focusDeltaText} />
    </View>
  );
}

function Bar({ label, value, color, active, hint }: { label: string; value: number; color: string; active?: boolean; hint?: string }) {
  return (
    <View style={[styles.barWrap, active && styles.activeBar]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]}>
          <View style={styles.barShine} />
        </View>
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

function focusEventText(type: GameEvent['type'], amount: number) {
  if (type === 'FOCUS_GAINED') return `+${Math.round(amount)} FOCO`;
  if (type === 'FOCUS_DRAINED') return `-${Math.round(amount)} FOCO`;
  if (type === 'FOCUS_ABSORBED_DAMAGE') return `FOCO absorveu ${Math.round(amount)}`;
  if (type === 'FOCUS_DEPLETED') return 'FOCO esgotado';
  return 'FOCO ativo';
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.35)' },
  barWrap: { gap: 6, padding: 2, borderRadius: 10 },
  activeBar: { backgroundColor: 'rgba(255,255,255,0.08)' },
  label: { color: colors.text, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  hint: { color: '#cfd0df', fontSize: 11, fontWeight: '700' },
  barBg: { height: 14, overflow: 'hidden', borderRadius: 8, backgroundColor: '#202033', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  barFill: { height: '100%', borderRadius: 8, shadowColor: '#fff', shadowOpacity: 0.35, shadowRadius: 8 },
  barShine: { flex: 1, backgroundColor: 'rgba(255,255,255,0.16)' },
});
