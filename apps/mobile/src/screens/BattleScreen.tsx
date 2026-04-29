import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { AnswerGrid } from '../components/AnswerGrid';
import { EnemySprite } from '../components/EnemySprite';
import { InventoryPanel } from '../components/InventoryPanel';
import { QuestionCard } from '../components/QuestionCard';
import { StatusBars } from '../components/StatusBars';
import { enemiesByLevelId, getProfessorMessage } from '@reino/game-content';
import type { useGameController } from '../hooks/useGameController';
import { colors, spacing } from '../theme/tokens';

interface BattleScreenProps {
  game: ReturnType<typeof useGameController>;
}

export function BattleScreen({ game }: BattleScreenProps) {
  const question = game.state.currentQuestion;
  const enemy = enemiesByLevelId[game.level.id as keyof typeof enemiesByLevelId];
  const damaged = game.state.lastEvents.some((event) => event.type === 'PLAYER_DAMAGED');
  const eventTypes = game.state.lastEvents.map((event) => event.type);
  const successQuake = eventTypes.includes('ANSWER_CORRECT') && game.state.combo >= 2;
  const latestDamage = [...game.state.lastEvents].reverse().find((event) => typeof event.payload?.damage === 'number')?.payload?.damage as number | undefined;
  const professorMessage = getProfessorMessage({
    eventTypes,
    combo: game.state.combo,
    property: game.level.property,
    playerHp: game.state.playerHp,
  });
  const translateX = useSharedValue(0);
  const professorOpacity = useSharedValue(1);
  const professorTranslateY = useSharedValue(0);

  useEffect(() => {
    if (!damaged && !successQuake) return;
    if (successQuake) {
      translateX.value = withSequence(
        withTiming(0, { duration: 20 }),
        withTiming(-3, { duration: 45 }),
        withTiming(3, { duration: 45 }),
        withTiming(0, { duration: 80 }),
      );
      return;
    }
    translateX.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(0, { duration: 80 }),
    );
  }, [damaged, successQuake, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const professorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: professorOpacity.value,
    transform: [{ translateY: professorTranslateY.value }],
  }));

  useEffect(() => {
    professorOpacity.value = 0;
    professorTranslateY.value = 8;
    professorOpacity.value = withSequence(withTiming(1, { duration: 180 }), withDelay(3200, withTiming(0, { duration: 520 })));
    professorTranslateY.value = withSequence(withTiming(0, { duration: 180 }), withDelay(3200, withTiming(-8, { duration: 520 })));
  }, [game.state.lastEvents, professorOpacity, professorTranslateY]);

  if (!question) return null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.animatedWrap, animatedStyle]}>
        <StatusBars state={game.state} events={game.state.lastEvents} />
        <Text style={styles.stage}>{game.level.name}</Text>
        <View style={styles.enemyWrap}>
          <EnemySprite icon={game.level.icon} spriteKey={enemy?.spriteKey} events={game.state.lastEvents} />
          {latestDamage && eventTypes.includes('ANSWER_CORRECT') && <Text style={styles.floatingDamage}>-{latestDamage}</Text>}
          {eventTypes.includes('ANSWER_CORRECT') && <Text style={styles.enemyBurst}>✦</Text>}
          {eventTypes.includes('ANSWER_CORRECT') && <Text style={[styles.missionGain, missionGainStyle(game.state.missionCurrent / game.state.balance.missionTarget)]}>★ +1 missão</Text>}
        </View>
        <QuestionCard question={question} timerPercent={game.timerPercent} />
        <AnswerGrid options={question.options} onAnswer={game.actions.answer} />
        <Text style={styles.feedback}>{game.state.lastEvents.at(-1)?.type.replaceAll('_', ' ')}</Text>
        <Animated.View style={[styles.professorReaction, game.state.combo >= 3 ? styles.professorCombo : null, professorAnimatedStyle]} key={`${professorMessage.text}-${game.state.lastEvents.at(-1)?.type ?? 'idle'}`}>
          <Text style={styles.professorTitle}>👨‍🏫 Professor</Text>
          <Text style={styles.professorText}>{professorMessage.text}</Text>
        </Animated.View>
        <InventoryPanel state={game.state} actions={game.actions} />
      </Animated.View>
    </ScrollView>
  );
}

function missionGainStyle(progress: number) {
  if (progress >= 1) return styles.missionGainGold;
  if (progress >= 0.6) return styles.missionGainWarm;
  return styles.missionGainCool;
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { gap: spacing.md, padding: spacing.lg },
  animatedWrap: { gap: spacing.md },
  stage: { color: colors.secondary, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  enemyWrap: { minHeight: 108, alignItems: 'center', justifyContent: 'center' },
  floatingDamage: { position: 'absolute', top: 0, color: colors.warning, fontSize: 24, fontWeight: '900', textShadowColor: '#ff9100', textShadowRadius: 10 },
  enemyBurst: { position: 'absolute', top: 28, color: colors.warning, fontSize: 58, opacity: 0.85 },
  missionGain: { position: 'absolute', bottom: 0, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, overflow: 'hidden', color: '#151018', fontWeight: '900' },
  missionGainCool: { backgroundColor: colors.secondary },
  missionGainWarm: { backgroundColor: colors.warning },
  missionGainGold: { backgroundColor: '#ffb300' },
  feedback: { minHeight: 24, color: colors.secondary, textAlign: 'center', fontWeight: '800' },
  professorReaction: { gap: 4, padding: spacing.md, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.secondary, backgroundColor: 'rgba(3,218,198,0.08)' },
  professorCombo: { borderLeftColor: colors.accent, backgroundColor: 'rgba(255,0,255,0.08)' },
  professorTitle: { color: colors.text, fontWeight: '900' },
  professorText: { color: colors.text, lineHeight: 20 },
});
