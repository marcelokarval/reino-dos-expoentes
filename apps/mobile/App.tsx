import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MobileApp } from './src/App';

export default function App() {
  return (
    <View style={styles.root}>
      <MobileApp />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
});
