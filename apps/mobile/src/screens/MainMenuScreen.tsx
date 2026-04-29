import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import type { useGameController } from '../hooks/useGameController';

interface MainMenuScreenProps {
  game: ReturnType<typeof useGameController>;
}

export function MainMenuScreen({ game }: MainMenuScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>REINO DOS EXPOENTES</Text>
        <Text style={styles.subtitle}>Domine as propriedades, conquiste o reino.</Text>
        <Text style={styles.progress}>Progresso salvo: fase {game.progress.highestUnlockedLevelIndex + 1} desbloqueada</Text>
        <Text style={styles.guide}>📘 Básico: Produto e Divisão{`\n`}📗 Intermediário: Potência e Zero{`\n`}📕 Avançado: Negativos e Expressões</Text>
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryButton} onPress={game.actions.resetProgress}>
            <Text style={styles.secondaryButtonText}>Resetar progresso</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={game.actions.start}>
          <Text style={styles.buttonText}>INICIAR AVENTURA</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  card: { gap: spacing.lg, padding: spacing.xl, borderRadius: 20, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surface },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#aaa', textAlign: 'center', fontStyle: 'italic' },
  progress: { color: colors.secondary, padding: spacing.sm, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(3,218,198,0.28)', backgroundColor: 'rgba(3,218,198,0.08)', textAlign: 'center', fontWeight: '800' },
  guide: { color: colors.text, lineHeight: 24, padding: spacing.md, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.25)' },
  actionsRow: { gap: spacing.sm },
  secondaryButton: { padding: spacing.md, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: '#2a2a3a' },
  secondaryButtonText: { color: colors.text, textAlign: 'center', fontWeight: '800' },
  button: { padding: spacing.lg, borderRadius: 12, backgroundColor: colors.primary },
  buttonText: { color: colors.text, fontWeight: '900', textAlign: 'center', fontSize: 18 },
});
