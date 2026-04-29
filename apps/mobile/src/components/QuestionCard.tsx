import { StyleSheet, Text, View } from 'react-native';
import type { Question } from '@reino/game-core';
import { colors, spacing } from '../theme/tokens';

interface QuestionCardProps {
  question: Question;
  timerPercent: number;
}

export function QuestionCard({ question, timerPercent }: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.question}>{stripHtml(question.text)}</Text>
      <View style={styles.timerBg}>
        <View style={[styles.timerFill, { width: `${Math.max(0, Math.min(100, timerPercent))}%` }]} />
      </View>
    </View>
  );
}

function stripHtml(value: string) {
  return value
    .replaceAll('<sup>', '^')
    .replaceAll('</sup>', '')
    .replaceAll('&nbsp;', ' ');
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.35)' },
  question: { padding: spacing.lg, color: colors.text, fontSize: 28, textAlign: 'center' },
  timerBg: { height: 4, backgroundColor: 'transparent' },
  timerFill: { height: 4, backgroundColor: '#ff5252' },
});
