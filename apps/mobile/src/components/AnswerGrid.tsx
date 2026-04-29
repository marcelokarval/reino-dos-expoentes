import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';

interface AnswerGridProps {
  options: number[];
  onAnswer: (selected: number) => void;
}

export function AnswerGrid({ options, onAnswer }: AnswerGridProps) {
  return (
    <View style={styles.grid}>
      {options.map((option) => (
        <Pressable key={option} style={styles.button} onPress={() => onAnswer(option)}>
          <Text style={styles.buttonText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  button: { minWidth: '47%', flexGrow: 1, padding: spacing.lg, borderRadius: 12, backgroundColor: colors.primary },
  buttonText: { color: colors.text, fontSize: 20, fontWeight: '900', textAlign: 'center' },
});
