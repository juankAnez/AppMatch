/* ================================================
   PANTALLA 2 — CONFIGURACIÓN DE JUGADORES
   
   Muestra:
   - Título "¡Hola, enamorados!"
   - Campo de texto para "Mi amor" (Jugador 1)
   - Campo de texto para "Mi vida" (Jugador 2)
   - Botón "Empezar romance" (solo activo si ambos
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
import { Ionicons } from '@expo/vector-icons';

export default function SetupScreen({ onStart, onBack }) {
  // Estado de los campos de texto
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [numQuestions, setNumQuestions] = useState('15');

  // Validaciones
  const bothFilled = name1.trim().length > 0 && name2.trim().length > 0;
  const num = numQuestions.trim() === '' ? NaN : parseInt(numQuestions);
  const numValid = !isNaN(num) && num >= 1;

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
    if (bothFilled && numValid) {
      onStart(name1.trim(), name2.trim(), num);
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
        <Ionicons name="heart-circle" size={60} color={COLORS.accent} />
        <Text style={styles.title}>¡Hola, enamorados!</Text>
        <Text style={styles.subtitle}>
          Ingresen sus nombres para comenzar esta aventura romántica
        </Text>
      </Animated.View>

      {/* Campo Jugador 1 */}
      <Animated.View style={[styles.inputCard, fadeSlideUp(card1Anim)]}>
        <View style={styles.inputLabel}>
          <Ionicons name="heart" size={24} color={COLORS.accent} style={styles.playerIcon} />
          <Text style={styles.playerLabel}>Mi amor</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre..."
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
          <Ionicons name="heart-outline" size={24} color={COLORS.secondary} style={styles.playerIcon} />
          <Text style={styles.playerLabel}>Mi vida</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre..."
          placeholderTextColor={COLORS.textMuted}
          value={name2}
          onChangeText={setName2}
          autoCapitalize="words"
          maxLength={20}
        />
      </Animated.View>

      {/* Número de preguntas */}
      <Animated.View style={[styles.inputCard, fadeSlideUp(card2Anim)]}>
        <View style={styles.inputLabel}>
          <Ionicons name="mail" size={24} color={COLORS.accent} />
          <Text style={styles.playerLabel}>Cartas de amor (1-50)</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="15"
          placeholderTextColor={COLORS.textMuted}
          value={numQuestions}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setNumQuestions(cleaned);
          }}
          keyboardType="numeric"
          maxLength={2}
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
          disabled={!bothFilled || !numValid}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleStart}
          style={[styles.buttonOuter, (!bothFilled || !numValid) && styles.buttonDisabled]}
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
            <Ionicons name="heart-circle-outline" size={24} color={COLORS.textBright} style={styles.buttonIcon} />
            <Text
              style={[
                styles.buttonText,
                !bothFilled && styles.buttonTextDisabled,
              ]}
            >
              Empezar romance
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
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm + 2,
  },
  playerIcon: {
    marginRight: SIZES.sm,
  },
  playerLabel: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.semibold,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.medium,
    color: COLORS.textBright,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  buttonIcon: {
    marginRight: SIZES.sm,
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
