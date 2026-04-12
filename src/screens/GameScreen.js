/* ================================================
   PANTALLA 3 — JUEGO (Game Screen)

   Muestra:
   - Nombres de los jugadores
   - Carta actual con pregunta
   - Botones "Conectamos" y "No conectamos"
   - Progreso en modo romántico
   - Diseño moderno y responsivo
   ================================================ */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import cardBank from '../data/cards';
import { Ionicons } from '@expo/vector-icons';

export default function GameScreen({
  player1,
  player2,
  numQuestions,
  onConnected,
  onNotConnected,
  onFinish,
}) {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shuffled = [...cardBank].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, fadeAnim]);

  const gameCards = shuffledCards.slice(0, Math.min(numQuestions, shuffledCards.length));
  const currentCard = gameCards[currentIndex];

  const handleConnected = () => {
    onConnected();
    if (currentIndex < gameCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handleNotConnected = () => {
    onNotConnected();
    if (currentIndex < gameCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  if (!currentCard) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.loading}>Preparando cartas de amor...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Animated.View
        style={[
          styles.headerCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={styles.players}>{player1} 💖 {player2}</Text>
          <View style={styles.modeTag}>
            <Ionicons name="sparkles" size={14} color={COLORS.textBright} style={styles.iconSpacing} />
            <Text style={styles.modeTagText}>Romántico</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>Carta</Text>
            <Text style={styles.progressValue}>{currentIndex + 1} / {gameCards.length}</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{currentCard.category}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.category}>{currentCard.category}</Text>
          <Ionicons name="heart" size={24} color={COLORS.accent} />
        </View>

        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>{currentCard.icon}</Text>
        </View>

        <Text style={styles.question}>{currentCard.question}</Text>
      </Animated.View>

      <View style={styles.buttons}>          
        <LinearGradient
          colors={[COLORS.secondaryDark, COLORS.secondary]}
          style={styles.actionButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.actionInner} onPress={handleNotConnected}>
            <Ionicons name="heart-dislike" size={20} color={COLORS.textBright} style={styles.iconSpacing} />
            <Text style={styles.actionText}>No conectamos</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={[COLORS.accentLight, COLORS.accent]}
          style={styles.actionButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.actionInner} onPress={handleConnected}>
            <Ionicons name="heart" size={20} color={COLORS.textBright} style={styles.iconSpacing} />
            <Text style={styles.actionText}>Conectamos</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
        <Text style={styles.tipText}>
          Elige lo que mejor describe cómo se sienten con esta carta.
        </Text>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    paddingBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  players: {
    ...FONTS.h3,
    color: COLORS.textBright,
    flex: 1,
    flexWrap: 'wrap',
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusMd,
  },
  modeTagText: {
    ...FONTS.body,
    color: COLORS.textBright,
    fontWeight: FONTS.semibold,
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
  },
  progressLabel: {
    ...FONTS.body,
    color: COLORS.textMuted,
    marginBottom: SIZES.xs,
  },
  progressValue: {
    ...FONTS.h2,
    color: COLORS.textBright,
  },
  categoryPill: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
  },
  categoryPillText: {
    ...FONTS.body,
    color: COLORS.textBright,
    fontWeight: FONTS.semibold,
  },
  card: {
    flex: 1,
    borderRadius: SIZES.radiusLg,
    marginTop: SIZES.lg,
    padding: SIZES.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 14,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  category: {
    ...FONTS.caption,
    color: COLORS.accentLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconWrapper: {
    marginBottom: SIZES.lg,
    backgroundColor: 'rgba(233, 30, 99, 0.12)',
    borderRadius: SIZES.radiusFull,
    padding: SIZES.xl,
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
  },
  question: {
    ...FONTS.h2,
    color: COLORS.textBright,
    textAlign: 'center',
    lineHeight: 34,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: SIZES.radiusLg,
    marginHorizontal: SIZES.sm,
    overflow: 'hidden',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  actionInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  actionText: {
    ...FONTS.button,
    color: COLORS.textBright,
    fontWeight: FONTS.semibold,
  },
  iconSpacing: {
    marginRight: SIZES.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.lg,
    backgroundColor: COLORS.cardDark,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    marginLeft: SIZES.sm,
    flex: 1,
  },
  loading: {
    ...FONTS.h2,
    color: COLORS.text,
  },
});