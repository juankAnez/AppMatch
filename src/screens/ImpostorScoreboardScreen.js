/* ================================================
   IMPOSTOR — PANTALLA SCOREBOARD (Puntuación)
   
   Muestra la tabla de puntuación acumulada.
   Permite iniciar nueva ronda o volver al inicio.
   
   Diseño: espía / misterio
   ================================================ */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';

const SPY = {
  bg: '#0a0e1a',
  bgDark: '#060810',
  card: '#111827',
  cardLight: '#1a2236',
  cyan: '#00E5FF',
  cyanDark: '#00B8D4',
  cyanAlpha: 'rgba(0, 229, 255, 0.12)',
  purple: '#7C4DFF',
  purpleDark: '#651FFF',
  purpleAlpha: 'rgba(124, 77, 255, 0.12)',
  red: '#FF1744',
  gold: '#FFD600',
  goldAlpha: 'rgba(255, 214, 0, 0.12)',
  silver: '#B0BEC5',
  bronze: '#FF8A65',
  green: '#00E676',
  text: '#E0E7FF',
  textMuted: '#8892B0',
  textBright: '#FFFFFF',
  border: 'rgba(0, 229, 255, 0.15)',
  glow: 'rgba(0, 229, 255, 0.25)',
};

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [SPY.gold, SPY.silver, SPY.bronze];

export default function ImpostorScoreboardScreen({
  players,       // Array de nombres
  scores,        // Objeto { nombre: puntos }
  roundsPlayed,  // Número de rondas jugadas
  onNewRound,    // Callback: nueva ronda
  onGoHome,      // Callback: volver al inicio
}) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const trophyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
      Animated.spring(trophyAnim, {
        toValue: 1, friction: 4, tension: 30, useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fadeSlideUp = (anim) => ({
    opacity: anim,
    transform: [{
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 0],
      }),
    }],
  });

  // Ordenar jugadores por puntuación (mayor a menor)
  const sortedPlayers = [...players].sort(
    (a, b) => (scores[b] || 0) - (scores[a] || 0)
  );

  const maxScore = Math.max(...players.map((p) => scores[p] || 0), 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />
      <View style={styles.glowOrb} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeSlideUp(headerAnim)]}>
          <Ionicons name="trophy" size={48} color={SPY.gold} />
          <Text style={styles.title}>Tabla de Puntuación</Text>
          <View style={styles.roundsBadge}>
            <Ionicons name="radio" size={14} color={SPY.cyan} />
            <Text style={styles.roundsBadgeText}>
              {roundsPlayed} {roundsPlayed === 1 ? 'ronda jugada' : 'rondas jugadas'}
            </Text>
          </View>
        </Animated.View>

        {/* Podio top 3 */}
        {sortedPlayers.length >= 3 && (
          <Animated.View
            style={[
              styles.podium,
              {
                opacity: trophyAnim,
                transform: [{
                  scale: trophyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                }],
              },
            ]}
          >
            {/* 2do lugar */}
            <View style={styles.podiumSpot}>
              <Text style={styles.podiumMedal}>{MEDALS[1]}</Text>
              <View style={[styles.podiumBar, styles.podiumBar2]}>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {sortedPlayers[1]}
                </Text>
                <Text style={styles.podiumScore}>{scores[sortedPlayers[1]] || 0}</Text>
              </View>
            </View>

            {/* 1er lugar */}
            <View style={styles.podiumSpot}>
              <Text style={styles.podiumMedal}>{MEDALS[0]}</Text>
              <View style={[styles.podiumBar, styles.podiumBar1]}>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {sortedPlayers[0]}
                </Text>
                <Text style={[styles.podiumScore, { color: SPY.gold }]}>
                  {scores[sortedPlayers[0]] || 0}
                </Text>
              </View>
            </View>

            {/* 3er lugar */}
            <View style={styles.podiumSpot}>
              <Text style={styles.podiumMedal}>{MEDALS[2]}</Text>
              <View style={[styles.podiumBar, styles.podiumBar3]}>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {sortedPlayers[2]}
                </Text>
                <Text style={styles.podiumScore}>{scores[sortedPlayers[2]] || 0}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Lista completa */}
        <Animated.View style={fadeSlideUp(contentAnim)}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>Ranking completo</Text>
          </View>

          {sortedPlayers.map((name, rank) => {
            const score = scores[name] || 0;
            const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0;
            const hasMedal = rank < 3;

            return (
              <View key={name} style={styles.rankRow}>
                <View style={styles.rankLeft}>
                  <View
                    style={[
                      styles.rankBadge,
                      hasMedal && {
                        backgroundColor: `${MEDAL_COLORS[rank]}20`,
                        borderColor: MEDAL_COLORS[rank],
                      },
                    ]}
                  >
                    {hasMedal ? (
                      <Text style={{ fontSize: 16 }}>{MEDALS[rank]}</Text>
                    ) : (
                      <Text style={styles.rankNumber}>{rank + 1}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rankName}>{name}</Text>
                    <View style={styles.scoreBarBg}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${barWidth}%`,
                            backgroundColor: hasMedal
                              ? MEDAL_COLORS[rank]
                              : SPY.cyan,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
                <Text
                  style={[
                    styles.rankScore,
                    hasMedal && { color: MEDAL_COLORS[rank] },
                  ]}
                >
                  {score} pts
                </Text>
              </View>
            );
          })}

          {/* Leyenda de puntos */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Sistema de puntos</Text>
            <View style={styles.legendRow}>
              <Ionicons name="shield-checkmark" size={16} color={SPY.green} />
              <Text style={styles.legendText}>
                +10 pts — Votaste correctamente al impostor
              </Text>
            </View>
            <View style={styles.legendRow}>
              <Ionicons name="skull" size={16} color={SPY.red} />
              <Text style={styles.legendText}>
                +15 pts — Ganaste como impostor
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onNewRound}
              style={{ flex: 1, marginRight: SIZES.sm }}
            >
              <LinearGradient
                colors={[SPY.cyan, SPY.cyanDark]}
                style={styles.actionButton}
              >
                <Ionicons name="refresh" size={22} color={SPY.bgDark} />
                <Text style={styles.actionButtonTextDark}>Nueva ronda</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onGoHome}
              style={{ flex: 1, marginLeft: SIZES.sm }}
            >
              <View style={styles.actionButtonOutline}>
                <Ionicons name="home" size={22} color={SPY.cyan} />
                <Text style={styles.actionButtonTextLight}>Inicio</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPY.bg,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  glowOrb: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: SPY.goldAlpha,
    opacity: 0.4,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: SIZES.fontTitle - 2,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    letterSpacing: 1,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  roundsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SPY.cyanAlpha,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  roundsBadgeText: {
    color: SPY.cyan,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontSmall + 1,
    marginLeft: SIZES.xs,
  },

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: SIZES.xl,
    height: 180,
  },
  podiumSpot: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  podiumMedal: {
    fontSize: 28,
    marginBottom: SIZES.sm,
  },
  podiumBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: SIZES.radiusMd,
    borderTopRightRadius: SIZES.radiusMd,
    padding: SIZES.sm,
  },
  podiumBar1: {
    height: 120,
    backgroundColor: SPY.goldAlpha,
    borderWidth: 1,
    borderColor: SPY.gold,
    borderBottomWidth: 0,
  },
  podiumBar2: {
    height: 90,
    backgroundColor: `${SPY.silver}15`,
    borderWidth: 1,
    borderColor: SPY.silver,
    borderBottomWidth: 0,
  },
  podiumBar3: {
    height: 70,
    backgroundColor: `${SPY.bronze}15`,
    borderWidth: 1,
    borderColor: SPY.bronze,
    borderBottomWidth: 0,
  },
  podiumName: {
    color: SPY.textBright,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontSmall,
    textAlign: 'center',
  },
  podiumScore: {
    color: SPY.textMuted,
    fontWeight: FONTS.bold,
    fontSize: SIZES.fontLarge,
    marginTop: SIZES.xs,
  },

  // List
  listHeader: {
    marginBottom: SIZES.md,
  },
  listHeaderText: {
    color: SPY.textMuted,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SPY.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  rankNumber: {
    color: SPY.textMuted,
    fontWeight: FONTS.bold,
    fontSize: 14,
  },
  rankName: {
    color: SPY.textBright,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontBody,
    marginBottom: SIZES.xs,
  },
  scoreBarBg: {
    height: 4,
    backgroundColor: SPY.cardLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: 4,
    borderRadius: 2,
  },
  rankScore: {
    color: SPY.cyan,
    fontWeight: FONTS.bold,
    fontSize: SIZES.fontBody,
    marginLeft: SIZES.md,
  },

  // Legend
  legend: {
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginTop: SIZES.lg,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  legendTitle: {
    color: SPY.textBright,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontBody,
    marginBottom: SIZES.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  legendText: {
    color: SPY.textMuted,
    fontSize: SIZES.fontSmall + 1,
    marginLeft: SIZES.sm,
    flex: 1,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    marginTop: SIZES.xl,
    marginBottom: SIZES.xxl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 2,
    borderRadius: SIZES.radiusXl,
  },
  actionButtonTextDark: {
    color: SPY.bgDark,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.bold,
    marginLeft: SIZES.sm,
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 2,
    borderRadius: SIZES.radiusXl,
    borderWidth: 2,
    borderColor: SPY.cyan,
  },
  actionButtonTextLight: {
    color: SPY.cyan,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.bold,
    marginLeft: SIZES.sm,
  },
});
