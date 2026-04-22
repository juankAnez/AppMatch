/* ================================================
   IMPOSTOR — PANTALLA DE VOTACIÓN
   
   Los jugadores debaten y luego votan para
   eliminar al sospechoso. Si eliminan al impostor
   ganan los jugadores, si no, el juego continúa.
   
   Diseño: espía / misterio
   ================================================ */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

// Colores temáticos
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
  redAlpha: 'rgba(255, 23, 68, 0.15)',
  green: '#00E676',
  greenAlpha: 'rgba(0, 230, 118, 0.12)',
  yellow: '#FFEA00',
  yellowAlpha: 'rgba(255, 234, 0, 0.12)',
  text: '#E0E7FF',
  textMuted: '#8892B0',
  textBright: '#FFFFFF',
  border: 'rgba(0, 229, 255, 0.15)',
  glow: 'rgba(124, 77, 255, 0.25)',
};

export default function ImpostorVoteScreen({
  players,           // Array de todos los nombres
  activePlayers,     // Array de índices activos (no eliminados)
  impostorIndex,     // Índice del impostor en el array original
  secretWord,        // La palabra secreta
  themeName,         // Nombre del tema
  roundNumber,       // Número de ronda
  onImpostorFound,   // Callback: impostor descubierto
  onWrongVote,       // Callback: jugador incorrecto eliminado (recibe eliminatedIndex)
  onImpostorWins,    // Callback: impostor gana (quedan pocos jugadores)
  onNewRound,        // Callback: nueva ronda
  onViewScoreboard,  // Callback: ver tabla de puntuación
  onBack,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(-1);
  const [phase, setPhase] = useState('debate'); // 'debate', 'vote', 'result'
  const [resultInfo, setResultInfo] = useState(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(timerPulse, {
          toValue: 1.1, duration: 800, useNativeDriver: true,
        }),
        Animated.timing(timerPulse, {
          toValue: 1, duration: 800, useNativeDriver: true,
        }),
      ])
    ).start();
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

  const handleStartVote = () => {
    setPhase('vote');
    setSelectedPlayer(-1);
  };

  const handleConfirmVote = () => {
    if (selectedPlayer < 0) return;

    const wasImpostor = selectedPlayer === impostorIndex;

    if (wasImpostor) {
      // ¡Encontraron al impostor!
      setResultInfo({
        type: 'impostor_found',
        playerName: players[selectedPlayer],
      });
    } else {
      // Eliminaron a un inocente
      const remainingAfter = activePlayers.filter(
        (i) => i !== selectedPlayer
      );
      // Si quedan solo 2 jugadores (impostor + 1), el impostor gana
      const impostorWins = remainingAfter.length <= 2;

      setResultInfo({
        type: impostorWins ? 'impostor_wins' : 'wrong_vote',
        playerName: players[selectedPlayer],
        impostorWins,
      });
    }

    setPhase('result');
    resultAnim.setValue(0);
    Animated.spring(resultAnim, {
      toValue: 1, friction: 5, tension: 40, useNativeDriver: true,
    }).start();
  };

  const handleResultAction = () => {
    if (!resultInfo) return;

    if (resultInfo.type === 'impostor_found') {
      onImpostorFound();
    } else if (resultInfo.impostorWins) {
      onImpostorWins();
    } else {
      onWrongVote(selectedPlayer);
    }
  };

  // FASE: RESULTADO
  if (phase === 'result' && resultInfo) {
    const isGood = resultInfo.type === 'impostor_found';
    const isImpostorWin = resultInfo.type === 'wrong_vote' && resultInfo.impostorWins;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: resultAnim,
              transform: [{
                scale: resultAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              }],
            },
          ]}
        >
          <View
            style={[
              styles.resultIconWrap,
              {
                backgroundColor: isGood
                  ? SPY.greenAlpha
                  : isImpostorWin
                  ? SPY.redAlpha
                  : SPY.yellowAlpha,
                borderColor: isGood
                  ? SPY.green
                  : isImpostorWin
                  ? SPY.red
                  : SPY.yellow,
              },
            ]}
          >
            <Ionicons
              name={
                isGood
                  ? 'checkmark-circle'
                  : isImpostorWin
                  ? 'skull'
                  : 'alert-circle'
              }
              size={64}
              color={
                isGood ? SPY.green : isImpostorWin ? SPY.red : SPY.yellow
              }
            />
          </View>

          <Text style={styles.resultTitle}>
            {isGood
              ? '¡Impostor descubierto!'
              : isImpostorWin
              ? '¡El Impostor gana!'
              : '¡Agente inocente eliminado!'}
          </Text>

          <Text style={styles.resultSubtitle}>
            {resultInfo.playerName}{' '}
            {isGood
              ? 'era el impostor. ¡Los agentes ganan!'
              : 'NO era el impostor.'}
          </Text>

          {/* Revelar la palabra y el impostor */}
          {(isGood || isImpostorWin) && (
            <View style={styles.revealCard}>
              <View style={styles.revealRow}>
                <Text style={styles.revealLabel}>Palabra secreta:</Text>
                <Text style={styles.revealValue}>{secretWord}</Text>
              </View>
              <View style={styles.revealRow}>
                <Text style={styles.revealLabel}>El impostor era:</Text>
                <Text style={[styles.revealValue, { color: SPY.red }]}>
                  {players[impostorIndex]}
                </Text>
              </View>
            </View>
          )}

          {!isGood && !isImpostorWin && (
            <Text style={styles.resultHint}>
              El juego continúa sin {resultInfo.playerName}. Sigan debatiendo...
            </Text>
          )}

          {/* Acciones */}
          <View style={styles.resultActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleResultAction}
              style={{ flex: 1, marginRight: SIZES.sm }}
            >
              <LinearGradient
                colors={
                  isGood || isImpostorWin
                    ? [SPY.purple, SPY.purpleDark]
                    : [SPY.cyan, SPY.cyanDark]
                }
                style={styles.resultButton}
              >
                <Text style={styles.resultButtonText}>
                  {isGood || isImpostorWin ? 'Ver puntuación' : 'Continuar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {(isGood || isImpostorWin) && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onNewRound}
                style={{ flex: 1, marginLeft: SIZES.sm }}
              >
                <LinearGradient
                  colors={[SPY.cyan, SPY.cyanDark]}
                  style={styles.resultButton}
                >
                  <Text style={styles.resultButtonText}>Nueva ronda</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }

  // FASE: DEBATE / VOTO
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />

      <View style={styles.glowOrb} />

      {/* Botón volver */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color={SPY.cyan} />
        <Text style={styles.backText}> Abandonar</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeSlideUp(headerAnim)]}>
          <View style={styles.roundBadge}>
            <Ionicons name="radio" size={16} color={SPY.cyan} />
            <Text style={styles.roundBadgeText}>Ronda {roundNumber}</Text>
          </View>

          <Text style={styles.title}>
            {phase === 'debate' ? '🗣️ Fase de Debate' : '🗳️ Votación'}
          </Text>
          <Text style={styles.subtitle}>
            {phase === 'debate'
              ? 'Discutan entre ustedes. El impostor intentará pasar desapercibido.'
              : 'Selecciona al jugador que crees que es el impostor.'}
          </Text>
        </Animated.View>

        {/* Info del juego */}
        <Animated.View style={[styles.infoCard, fadeSlideUp(contentAnim)]}>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={18} color={SPY.cyan} />
            <Text style={styles.infoText}>
              {activePlayers.length} agentes activos
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Ionicons name="folder" size={18} color={SPY.purple} />
            <Text style={styles.infoText}>Tema: {themeName}</Text>
          </View>
        </Animated.View>

        {phase === 'debate' ? (
          /* Fase de debate */
          <Animated.View style={fadeSlideUp(contentAnim)}>
            <View style={styles.debateCard}>
              <Ionicons name="chatbubbles" size={40} color={SPY.cyan} />
              <Text style={styles.debateTitle}>Momento de debatir</Text>
              <Text style={styles.debateDescription}>
                Cada jugador debe dar pistas sutiles sobre la palabra que conoce.
                El impostor debe fingir que la conoce. Discutan y observen las reacciones de todos.
              </Text>

              <View style={styles.debateTips}>
                <View style={styles.tipRow}>
                  <Ionicons name="bulb" size={16} color={SPY.yellow} />
                  <Text style={styles.tipText}>
                    Da pistas que solo quien conoce la palabra entendería
                  </Text>
                </View>
                <View style={styles.tipRow}>
                  <Ionicons name="eye" size={16} color={SPY.cyan} />
                  <Text style={styles.tipText}>
                    Observa quién da respuestas vagas o confusas
                  </Text>
                </View>
                <View style={styles.tipRow}>
                  <Ionicons name="warning" size={16} color={SPY.red} />
                  <Text style={styles.tipText}>
                    ¡No digas la palabra directamente!
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartVote}
              style={{ marginTop: SIZES.lg }}
            >
              <LinearGradient
                colors={[SPY.red, '#D50000']}
                style={styles.voteButton}
              >
                <Ionicons name="hand-left" size={24} color={SPY.textBright} />
                <Text style={styles.voteButtonText}>
                  Pasar a votación
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* Fase de votación */
          <Animated.View style={fadeSlideUp(contentAnim)}>
            <Text style={styles.voteInstructions}>
              Selecciona al sospechoso:
            </Text>

            {activePlayers.map((playerIndex) => {
              const isSelected = selectedPlayer === playerIndex;
              return (
                <TouchableOpacity
                  key={playerIndex}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPlayer(playerIndex)}
                  style={[
                    styles.voteCard,
                    isSelected && styles.voteCardSelected,
                  ]}
                >
                  <View style={styles.voteCardLeft}>
                    <View
                      style={[
                        styles.voteAvatar,
                        isSelected && styles.voteAvatarSelected,
                      ]}
                    >
                      <Text style={styles.voteAvatarText}>
                        {players[playerIndex].charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.voteName,
                        isSelected && styles.voteNameSelected,
                      ]}
                    >
                      {players[playerIndex]}
                    </Text>
                  </View>
                  {isSelected && (
                    <Animated.View style={{ transform: [{ scale: timerPulse }] }}>
                      <Ionicons name="alert-circle" size={24} color={SPY.red} />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Confirmar */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={selectedPlayer < 0}
              onPress={handleConfirmVote}
              style={{ marginTop: SIZES.lg, marginBottom: SIZES.xxl }}
            >
              <LinearGradient
                colors={
                  selectedPlayer >= 0
                    ? [SPY.red, '#D50000']
                    : ['#1a2236', '#111827']
                }
                style={styles.confirmButton}
              >
                <Ionicons
                  name="remove-circle"
                  size={24}
                  color={selectedPlayer >= 0 ? SPY.textBright : SPY.textMuted}
                />
                <Text
                  style={[
                    styles.confirmButtonText,
                    selectedPlayer < 0 && { color: SPY.textMuted },
                  ]}
                >
                  Eliminar sospechoso
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================================================
   ESTILOS
   ================================================ */
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
    top: -40,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: SPY.glow,
    opacity: 0.2,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: SIZES.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  backText: {
    color: SPY.cyan,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.medium,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  roundBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SPY.cyanAlpha,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radiusFull,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  roundBadgeText: {
    color: SPY.cyan,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontSmall + 1,
    marginLeft: SIZES.xs,
  },
  title: {
    fontSize: SIZES.fontTitle - 4,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontBody,
    color: SPY.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Info card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: SPY.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  infoText: {
    color: SPY.text,
    fontSize: SIZES.fontSmall + 1,
    fontWeight: FONTS.medium,
    marginLeft: SIZES.xs,
  },
  infoDivider: {
    width: 1,
    height: 24,
    backgroundColor: SPY.border,
    marginHorizontal: SIZES.sm,
  },

  // Debate
  debateCard: {
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    borderWidth: 1,
    borderColor: SPY.border,
    alignItems: 'center',
  },
  debateTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  debateDescription: {
    color: SPY.textMuted,
    fontSize: SIZES.fontBody,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.lg,
  },
  debateTips: {
    width: '100%',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  tipText: {
    color: SPY.text,
    fontSize: SIZES.fontSmall + 1,
    marginLeft: SIZES.sm,
    flex: 1,
    lineHeight: 20,
  },

  // Vote button
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 4,
    borderRadius: SIZES.radiusXl,
    shadowColor: SPY.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  voteButtonText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginLeft: SIZES.sm,
  },

  // Vote cards
  voteInstructions: {
    color: SPY.textMuted,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.medium,
    marginBottom: SIZES.md,
  },
  voteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md + 4,
    marginBottom: SIZES.sm,
    borderWidth: 2,
    borderColor: SPY.border,
  },
  voteCardSelected: {
    borderColor: SPY.red,
    backgroundColor: SPY.redAlpha,
  },
  voteCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SPY.purpleAlpha,
    borderWidth: 2,
    borderColor: SPY.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  voteAvatarSelected: {
    borderColor: SPY.red,
    backgroundColor: SPY.redAlpha,
  },
  voteAvatarText: {
    color: SPY.textBright,
    fontWeight: FONTS.bold,
    fontSize: 18,
  },
  voteName: {
    color: SPY.textBright,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontBody,
  },
  voteNameSelected: {
    color: SPY.red,
  },

  // Confirm button
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 4,
    borderRadius: SIZES.radiusXl,
    shadowColor: SPY.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginLeft: SIZES.sm,
  },

  // Result
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.xl,
  },
  resultIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xl,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  resultTitle: {
    fontSize: SIZES.fontTitle - 4,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: SIZES.fontBody,
    color: SPY.textMuted,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    lineHeight: 24,
  },
  resultHint: {
    fontSize: SIZES.fontBody,
    color: SPY.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SIZES.xl,
  },

  // Reveal card
  revealCard: {
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    width: '100%',
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  revealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  revealLabel: {
    color: SPY.textMuted,
    fontSize: SIZES.fontBody,
  },
  revealValue: {
    color: SPY.cyan,
    fontWeight: FONTS.bold,
    fontSize: SIZES.fontLarge,
  },

  // Result actions
  resultActions: {
    flexDirection: 'row',
    width: '100%',
  },
  resultButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 2,
    borderRadius: SIZES.radiusXl,
  },
  resultButtonText: {
    color: SPY.textBright,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.bold,
  },
});
