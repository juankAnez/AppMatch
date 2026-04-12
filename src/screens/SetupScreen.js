/* ================================================
   PANTALLA 2 — CONFIGURACIÓN DE JUGADORES
   
   Muestra:
   - Título "¿Quiénes juegan?"
   - Campo de texto para Jugador 1
   - Campo de texto para Jugador 2
   - Botón "Comenzar juego" (solo activo si ambos
     nombres están llenos)
   - Botón "Volver" para regresar al inicio
   ================================================ */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function SetupScreen({ onStart, onBack }) {
  // Estado de los campos de texto
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');

  // ¿Están ambos campos llenos?
  const bothFilled = name1.trim().length > 0 && name2.trim().length > 0;

  // === ANIMACIONES ===
  const headerAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(card1Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(card2Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Helpers de animación
  const fadeSlideUp = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleStart = () => {
    if (bothFilled) {
      onStart(name1.trim(), name2.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      {/* Header */}
      <Animated.View style={[styles.header, fadeSlideUp(headerAnim)]}>
        <Text style={styles.emoji}>👫</Text>
        <Text style={styles.title}>¿Quiénes juegan?</Text>
        <Text style={styles.subtitle}>
          Ingresen sus nombres para comenzar la ronda
        </Text>
      </Animated.View>

      {/* Campo Jugador 1 */}
      <Animated.View style={[styles.inputCard, fadeSlideUp(card1Anim)]}>
        <View style={styles.inputLabel}>
          <Text style={styles.playerIcon}>💜</Text>
          <Text style={styles.playerLabel}>Jugador 1</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Escribe su nombre..."
          placeholderTextColor={COLORS.textMuted}
          value={name1}
          onChangeText={setName1}
          autoCapitalize="words"
          maxLength={20}
        />
      </Animated.View>

      {/* Campo Jugador 2 */}
      <Animated.View style={[styles.inputCard, fadeSlideUp(card2Anim)]}>
        <View style={styles.inputLabel}>
          <Text style={styles.playerIcon}>🩷</Text>
          <Text style={styles.playerLabel}>Jugador 2</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Escribe su nombre..."
          placeholderTextColor={COLORS.textMuted}
          value={name2}
          onChangeText={setName2}
          autoCapitalize="words"
          maxLength={20}
        />
      </Animated.View>

      {/* Botón Comenzar */}
      <Animated.View
        style={[
          fadeSlideUp(buttonAnim),
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!bothFilled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleStart}
          style={[styles.buttonOuter, !bothFilled && styles.buttonDisabled]}
        >
          <LinearGradient
            colors={
              bothFilled
                ? [COLORS.accent, COLORS.accentDark]
                : ['#3a2a30', '#2a1a20']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonIcon}>🎮</Text>
            <Text
              style={[
                styles.buttonText,
                !bothFilled && styles.buttonTextDisabled,
              ]}
            >
              Comenzar juego
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Mensaje de ayuda */}
      {!bothFilled && (
        <Text style={styles.hint}>
          Completa ambos nombres para comenzar
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

/* ================================================
   ESTILOS
   ================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },

  // Botón volver
  backButton: {
    position: 'absolute',
    top: 50,
    left: SIZES.lg,
    zIndex: 10,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.medium,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl + SIZES.md,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.fontLarge + 4,
    fontWeight: FONTS.bold,
    color: COLORS.textBright,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.light,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Tarjeta de input
  inputCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.elevated,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm + 2,
    gap: SIZES.sm,
  },
  playerIcon: {
    fontSize: 18,
  },
  playerLabel: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.fontMedium,
    fontWeight: FONTS.medium,
    color: COLORS.textBright,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Botón
  buttonOuter: {
    borderRadius: SIZES.radiusXl,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginTop: SIZES.lg,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 2,
    paddingHorizontal: SIZES.xxl + SIZES.md,
    borderRadius: SIZES.radiusXl,
    gap: SIZES.sm,
  },
  buttonIcon: {
    fontSize: 22,
  },
  buttonText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.semibold,
    color: COLORS.textBright,
    letterSpacing: 0.3,
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },

  // Mensaje de ayuda
  hint: {
    marginTop: SIZES.md,
    fontSize: SIZES.fontSmall,
    color: COLORS.textMuted,
    fontWeight: FONTS.light,
  },
});
