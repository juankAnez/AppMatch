/* ================================================
   PANTALLA 4 — RESULTADOS (Results Screen)

   Muestra:
   - Estadísticas del juego
   - Mensaje final
   - Botón para jugar de nuevo
   - Estilo romántico y moderno
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
import { Ionicons } from '@expo/vector-icons';

export default function ResultsScreen({
  player1,
  player2,
  connectedCount,
  notConnectedCount,
  onPlayAgain,
}) {
  const total = connectedCount + notConnectedCount;
  const percentage = total > 0 ? Math.round((connectedCount / total) * 100) : 0;

  let message = '';
  if (percentage >= 80) {
    message = '¡Amor eterno! Han alcanzado una conexión profunda y verdadera.';
  } else if (percentage >= 60) {
    message = 'Buen progreso en su viaje romántico. Sigan descubriéndose.';
  } else {
    message = 'El amor crece con cada conversación. ¡No se rindan!';
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        <Text style={styles.title}>¡Romance completado!</Text>

        <View style={styles.badge}>
          <Ionicons name="heart-circle" size={22} color={COLORS.textBright} style={styles.badgeIcon} />
          <Text style={styles.badgeText}>Resultado romántico</Text>
        </View>

        <Text style={styles.players}>{player1} 💖 y 💕 {player2}</Text>

        <LinearGradient
          colors={[COLORS.cardDark, COLORS.card]}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{connectedCount}</Text>
              <Text style={styles.statLabel}>Conectadas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{notConnectedCount}</Text>
              <Text style={styles.statLabel}>No conectadas</Text>
            </View>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{percentage}%</Text>
            <Text style={styles.scoreLabel}>Amor</Text>
          </View>
        </LinearGradient>

        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Otra aventura romántica</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textBright,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    marginBottom: SIZES.md,
  },
  badgeIcon: {
    marginRight: SIZES.sm,
  },
  badgeText: {
    ...FONTS.body,
    color: COLORS.textBright,
    fontWeight: FONTS.semibold,
  },
  players: {
    ...FONTS.h3,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  statsCard: {
    width: '100%',
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: SIZES.xs,
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.textBright,
    marginBottom: SIZES.xs,
  },
  statLabel: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  scoreBadge: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    backgroundColor: COLORS.background,
  },
  scoreText: {
    ...FONTS.h1,
    color: COLORS.accent,
  },
  scoreLabel: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  message: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusXl,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.textBright,
    fontWeight: FONTS.semibold,
  },
});