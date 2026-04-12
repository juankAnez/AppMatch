/* ================================================
   PANTALLA 4 — RESULTADOS (Results Screen)

   Muestra:
   - Estadísticas del juego
   - Mensaje final
   - Botón para jugar de nuevo
   ================================================ */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function ResultsScreen({
  player1,
  player2,
  answeredCount,
  skippedCount,
  onPlayAgain,
}) {
  const total = answeredCount + skippedCount;
  const percentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  let message = '';
  if (percentage >= 80) {
    message = '¡Excelente conexión! Han profundizado mucho en su relación.';
  } else if (percentage >= 60) {
    message = 'Buen trabajo. Hay mucho más por descubrir.';
  } else {
    message = 'No se preocupen, cada conversación es un paso adelante.';
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        <Text style={styles.title}>¡Juego terminado!</Text>
        <Text style={styles.players}>
          {player1} 💜 y 🩷 {player2}
        </Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>Preguntas respondidas: {answeredCount}</Text>
          <Text style={styles.stat}>Preguntas saltadas: {skippedCount}</Text>
          <Text style={styles.percentage}>{percentage}% completado</Text>
        </View>

        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Jugar de nuevo</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: 20,
  },
  players: {
    ...FONTS.h2,
    color: COLORS.accent,
    marginBottom: 30,
  },
  stats: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  stat: {
    ...FONTS.body,
    color: COLORS.text,
    marginBottom: 10,
  },
  percentage: {
    ...FONTS.h3,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  message: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.background,
  },
});