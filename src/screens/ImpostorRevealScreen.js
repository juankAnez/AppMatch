/* ================================================
   IMPOSTOR — PANTALLA REVEAL (Revelar Roles)
   
   Cada jugador toca para ver su palabra secreta
   o si es el impostor. Nadie puede ver el rol
   del otro jugador.
   
   Diseño: espía / misterio con animación
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
  Dimensions,
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
  text: '#E0E7FF',
  textMuted: '#8892B0',
  textBright: '#FFFFFF',
  border: 'rgba(0, 229, 255, 0.15)',
  glow: 'rgba(0, 229, 255, 0.25)',
};

export default function ImpostorRevealScreen({
  players,         // Array de nombres
  impostorIndex,   // Índice del impostor
  secretWord,      // La palabra secreta
  themeName,       // Nombre del tema
  onAllRevealed,   // Callback cuando todos vieron su rol
  onBack,
}) {
  // Quién ya vio su rol
  const [revealed, setRevealed] = useState(new Array(players.length).fill(false));
  // Quién está viendo actualmente (-1 = nadie)
  const [viewingIndex, setViewingIndex] = useState(-1);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 1, friction: 6, tension: 40, useNativeDriver: true,
      }),
    ]).start();

    // Pulso continuo para el botón activo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05, duration: 1000, useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 1000, useNativeDriver: true,
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

  const handleTapToReveal = (index) => {
    if (revealed[index]) return; // Ya lo vio
    setViewingIndex(index);

    // Animación de revelar
    revealAnim.setValue(0);
    Animated.spring(revealAnim, {
      toValue: 1, friction: 5, tension: 50, useNativeDriver: true,
    }).start();
  };

  const handleHide = (index) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setViewingIndex(-1);
  };

  const allSeen = revealed.every((r) => r === true);

  const isImpostor = (index) => index === impostorIndex;

  // Pantalla de revelación individual
  if (viewingIndex >= 0) {
    const playerName = players[viewingIndex];
    const isImp = isImpostor(viewingIndex);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />

        <Animated.View
          style={[
            styles.revealContainer,
            {
              opacity: revealAnim,
              transform: [{
                scale: revealAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              }],
            },
          ]}
        >
          {/* Icono grande */}
          <View style={[styles.revealIconWrap, isImp && styles.revealIconImpostor]}>
            <Ionicons
              name={isImp ? 'skull' : 'shield-checkmark'}
              size={64}
              color={isImp ? SPY.red : SPY.cyan}
            />
          </View>

          <Text style={styles.revealPlayerName}>{playerName}</Text>

          {isImp ? (
            <>
              <LinearGradient
                colors={[SPY.red, '#D50000']}
                style={styles.revealBadge}
              >
                <Ionicons name="warning" size={20} color={SPY.textBright} />
                <Text style={styles.revealBadgeText}>¡ERES EL IMPOSTOR!</Text>
              </LinearGradient>
              <Text style={styles.revealHint}>
                No conoces la palabra secreta. Intenta pasar desapercibido durante el debate.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.wordCard}>
                <Text style={styles.wordLabel}>Tu palabra secreta es:</Text>
                <Text style={styles.wordValue}>{secretWord}</Text>
                <View style={styles.wordTheme}>
                  <Ionicons name="folder" size={14} color={SPY.textMuted} />
                  <Text style={styles.wordThemeText}>{themeName}</Text>
                </View>
              </View>
              <Text style={styles.revealHint}>
                Memorízala bien. No dejes que el impostor descubra la palabra.
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.hideButton}
            onPress={() => handleHide(viewingIndex)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[SPY.cyan, SPY.cyanDark]}
              style={styles.hideButtonGradient}
            >
              <Ionicons name="eye-off" size={22} color={SPY.bgDark} />
              <Text style={styles.hideButtonText}>Ocultar y continuar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Lista de jugadores
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />

      {/* Glow */}
      <View style={styles.glowOrb} />

      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color={SPY.cyan} />
        <Text style={styles.backText}> Volver</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeSlideUp(headerAnim)]}>
          <Ionicons name="finger-print" size={48} color={SPY.cyan} />
          <Text style={styles.title}>Revelar Roles</Text>
          <Text style={styles.subtitle}>
            Cada agente debe tocar su tarjeta para ver su rol en privado
          </Text>
        </Animated.View>

        {/* Info de tema */}
        <Animated.View style={[styles.themeInfo, fadeSlideUp(contentAnim)]}>
          <Ionicons name="folder-open" size={16} color={SPY.purple} />
          <Text style={styles.themeInfoText}>Tema: {themeName}</Text>
        </Animated.View>

        {/* Lista de jugadores */}
        <Animated.View style={fadeSlideUp(contentAnim)}>
          {players.map((name, index) => {
            const seen = revealed[index];
            return (
              <Animated.View
                key={index}
                style={!seen ? { transform: [{ scale: pulseAnim }] } : undefined}
              >
                <TouchableOpacity
                  disabled={seen}
                  activeOpacity={0.7}
                  onPress={() => handleTapToReveal(index)}
                  style={[
                    styles.playerCard,
                    seen && styles.playerCardSeen,
                  ]}
                >
                  <View style={styles.playerCardLeft}>
                    <View style={[styles.playerAvatar, seen && styles.playerAvatarSeen]}>
                      {seen ? (
                        <Ionicons name="checkmark" size={22} color={SPY.green} />
                      ) : (
                        <Text style={styles.playerAvatarText}>
                          {name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text style={[styles.playerName, seen && styles.playerNameSeen]}>
                        {name}
                      </Text>
                      <Text style={styles.playerStatus}>
                        {seen ? '✓ Rol revelado' : 'Toca para ver tu rol'}
                      </Text>
                    </View>
                  </View>
                  {!seen && (
                    <Ionicons name="lock-closed" size={20} color={SPY.cyan} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Progreso */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(revealed.filter(Boolean).length / players.length) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {revealed.filter(Boolean).length} de {players.length} agentes han visto su rol
        </Text>

        {/* Botón comenzar debate */}
        {allSeen && (
          <TouchableOpacity
            style={styles.startDebateBtn}
            onPress={onAllRevealed}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[SPY.purple, SPY.purpleDark]}
              style={styles.startDebateGradient}
            >
              <Ionicons name="chatbubbles" size={24} color={SPY.textBright} />
              <Text style={styles.startDebateText}>¡Comenzar debate!</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingTop: 90,
    paddingBottom: 40,
  },
  glowOrb: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: SPY.glow,
    opacity: 0.3,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SIZES.lg,
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
  title: {
    fontSize: SIZES.fontTitle - 2,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    letterSpacing: 1,
    marginTop: SIZES.md,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontBody,
    color: SPY.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Tema info
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: SPY.purpleAlpha,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radiusFull,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.25)',
  },
  themeInfoText: {
    color: SPY.purple,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontSmall + 1,
    marginLeft: SIZES.xs,
  },

  // Player cards
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md + 4,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: SPY.border,
    shadowColor: SPY.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  playerCardSeen: {
    opacity: 0.6,
    borderColor: SPY.greenAlpha,
  },
  playerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SPY.cyanAlpha,
    borderWidth: 2,
    borderColor: SPY.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  playerAvatarSeen: {
    borderColor: SPY.green,
    backgroundColor: SPY.greenAlpha,
  },
  playerAvatarText: {
    color: SPY.cyan,
    fontWeight: FONTS.bold,
    fontSize: 18,
  },
  playerName: {
    color: SPY.textBright,
    fontWeight: FONTS.semibold,
    fontSize: SIZES.fontBody,
  },
  playerNameSeen: {
    color: SPY.textMuted,
  },
  playerStatus: {
    color: SPY.textMuted,
    fontSize: SIZES.fontSmall,
    marginTop: 2,
  },

  // Progress bar
  progressBar: {
    height: 6,
    backgroundColor: SPY.card,
    borderRadius: 3,
    marginTop: SIZES.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: SPY.cyan,
    borderRadius: 3,
  },
  progressText: {
    color: SPY.textMuted,
    fontSize: SIZES.fontSmall,
    textAlign: 'center',
    marginTop: SIZES.sm,
    marginBottom: SIZES.lg,
  },

  // Start debate button
  startDebateBtn: {
    marginTop: SIZES.md,
    marginBottom: SIZES.xxl,
  },
  startDebateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 4,
    borderRadius: SIZES.radiusXl,
    shadowColor: SPY.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  startDebateText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginLeft: SIZES.sm,
    letterSpacing: 0.5,
  },

  // Reveal overlay
  revealContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.xl,
  },
  revealIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SPY.cyanAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xl,
    borderWidth: 3,
    borderColor: SPY.cyan,
    shadowColor: SPY.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  revealIconImpostor: {
    backgroundColor: SPY.redAlpha,
    borderColor: SPY.red,
    shadowColor: SPY.red,
  },
  revealPlayerName: {
    fontSize: SIZES.fontTitle,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginBottom: SIZES.lg,
    letterSpacing: 1,
  },
  revealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusXl,
    marginBottom: SIZES.lg,
  },
  revealBadgeText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    marginLeft: SIZES.sm,
    letterSpacing: 2,
  },
  revealHint: {
    color: SPY.textMuted,
    fontSize: SIZES.fontBody,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.xl,
    paddingHorizontal: SIZES.md,
  },

  // Word card
  wordCard: {
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: SPY.cyan,
    width: '100%',
    alignItems: 'center',
    shadowColor: SPY.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  wordLabel: {
    color: SPY.textMuted,
    fontSize: SIZES.fontSmall,
    fontWeight: FONTS.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SIZES.md,
  },
  wordValue: {
    fontSize: SIZES.fontHero,
    fontWeight: FONTS.bold,
    color: SPY.cyan,
    textAlign: 'center',
    letterSpacing: 2,
  },
  wordTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  wordThemeText: {
    color: SPY.textMuted,
    fontSize: SIZES.fontSmall,
    marginLeft: SIZES.xs,
  },

  // Hide button
  hideButton: {
    width: '100%',
  },
  hideButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 2,
    borderRadius: SIZES.radiusXl,
  },
  hideButtonText: {
    color: SPY.bgDark,
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    marginLeft: SIZES.sm,
  },
});
