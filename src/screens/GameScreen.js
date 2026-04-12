/* ================================================
   PANTALLA 3 — JUEGO (Game Screen)

   Muestra:
   - Nombres de los jugadores
   - Carta actual con pregunta
   - Botones "Respondida" y "Saltar"
   - Progreso (pregunta X de Y)
   - Cuando termina, va a resultados
   ================================================ */

import React, { useState, useEffect } from 'react';
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
import { cardBank } from '../data/cards';

export default function GameScreen({
  player1,
  player2,
  onAnswered,
  onSkipped,
  onFinish,
}) {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Shuffle the cards
    const shuffled = [...cardBank].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  const currentCard = shuffledCards[currentIndex];

  const handleAnswered = () => {
    onAnswered();
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handleSkipped = () => {
    onSkipped();
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando preguntas...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.backgroundDark]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header con nombres */}
      <View style={styles.header}>
        <Text style={styles.players}>
          {player1} 💜 vs 🩷 {player2}
        </Text>
        <Text style={styles.progress}>
          Pregunta {currentIndex + 1} de {shuffledCards.length}
        </Text>
      </View>

      {/* Carta */}
      <View style={styles.card}>
        <Text style={styles.category}>{currentCard.category}</Text>
        <Text style={styles.icon}>{currentCard.icon}</Text>
        <Text style={styles.question}>{currentCard.question}</Text>
      </View>

      {/* Botones */}
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkipped}>
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.answerButton]} onPress={handleAnswered}>
          <Text style={styles.answerText}>Respondida</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  players: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: 10,
  },
  progress: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  category: {
    ...FONTS.caption,
    color: COLORS.accent,
    marginBottom: 10,
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
  question: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  skipButton: {
    backgroundColor: COLORS.secondary,
  },
  skipText: {
    ...FONTS.button,
    color: COLORS.text,
  },
  answerButton: {
    backgroundColor: COLORS.accent,
  },
  answerText: {
    ...FONTS.button,
    color: COLORS.background,
  },
  loading: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});