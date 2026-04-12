/* ================================================
   PANTALLA 1 — HOME (Inicio)
   
   Muestra:
   - Logo de la app con corazones
   - Título "Amor Verdadero"
   - Subtítulo "Descubre la conexión real con tu pareja"
   - Botón "Comenzar aventura"
   - Info del modo romántico en el pie
   ================================================ */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

// Obtenemos el tamaño de la pantalla del teléfono
const { width, height } = Dimensions.get('window');

export default function HomeScreen({ onSelectModule }) {
  // === Animaciones ===
  // Cada elemento tiene su propia animación de entrada
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const dividerAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada escalonada: cada elemento aparece uno después del otro
    Animated.stagger(180, [
      // Logo
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // Título
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Subtítulo
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Separador con corazón
      Animated.timing(dividerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Botón
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      // Pie de página
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación del resplandor: pulsa continuamente
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Efecto al presionar el botón
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

  // === Helpers para las animaciones de entrada ===
  const fadeSlideUp = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Resplandor decorativo detrás del logo */}
      <Animated.View style={[styles.glowOrb, { opacity: glowAnim }]} />

      {/* Partículas decorativas */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, i) => (
          <ParticleDot key={i} index={i} />
        ))}
      </View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoAnim,
            transform: [
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Título */}
      <Animated.Text style={[styles.title, fadeSlideUp(titleAnim)]}>
        Match Hub
      </Animated.Text>

      {/* Subtítulo */}
      <Animated.Text style={[styles.subtitle, fadeSlideUp(subtitleAnim)]}>
        Un centro de módulos para juegos de pareja, fiesta y diversión compartida
      </Animated.Text>

      {/* Separador */}
      <Animated.View style={[styles.divider, fadeSlideUp(dividerAnim)]}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerHeart}>✦</Text>
        <View style={styles.dividerLine} />
      </Animated.View>

      {/* Vista de módulos */}
      <Animated.View style={[styles.moduleGrid, fadeSlideUp(dividerAnim)]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModule('couple')}
          style={[styles.moduleCard, styles.moduleCardActive]}
        >
          <Ionicons name="heart" size={28} color={COLORS.accent} style={styles.moduleIcon} />
          <Text style={styles.moduleTitle}>Pareja</Text>
          <Text style={styles.moduleDescription}>Cartas íntimas para conocerse mejor.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModule('party')}
          style={styles.moduleCard}
        >
          <Ionicons name="beer" size={28} color={COLORS.secondary} style={styles.moduleIcon} />
          <Text style={styles.moduleTitle}>Fiesta</Text>
          <Text style={styles.moduleDescription}>Risas, retos y juegos para animar cualquier reunión.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectModule('adventure')}
          style={styles.moduleCard}
        >
          <Ionicons name="rocket" size={28} color={COLORS.accentLight} style={styles.moduleIcon} />
          <Text style={styles.moduleTitle}>Aventura</Text>
          <Text style={styles.moduleDescription}>Retos creativos para explorar juntos.</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Pie de información */}
      <Animated.Text style={[styles.footer, fadeSlideUp(footerAnim)]}>
        Multijuegos · Módulos variados · Próximamente más experiencias
      </Animated.Text>
    </View>
  );
}

/* ================================================
   Componente de partícula flotante decorativa
   ================================================ */
function ParticleDot({ index }) {
  const anim = useRef(new Animated.Value(0)).current;

  // Posiciones aleatorias pero fijas para cada partícula
  const positions = [
    { left: '10%', top: '15%' },
    { left: '85%', top: '12%' },
    { left: '20%', top: '65%' },
    { left: '75%', top: '75%' },
    { left: '50%', top: '35%' },
    { left: '90%', top: '50%' },
  ];

  useEffect(() => {
    const delay = index * 800;
    const duration = 3000 + index * 500;

    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        positions[index],
        {
          opacity: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.6, 0],
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -30],
              }),
            },
            {
              scale: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.5, 1],
              }),
            },
          ],
        },
      ]}
    />
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

  // Resplandor
  glowOrb: {
    position: 'absolute',
    top: height * 0.15,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.glow,
  },

  // Partículas
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accent,
  },

  // Logo
  logoContainer: {
    marginBottom: SIZES.lg,
    zIndex: 1,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: SIZES.radiusLg,
  },

  // Título
  title: {
    fontSize: SIZES.fontTitle,
    fontWeight: FONTS.bold,
    color: COLORS.textBright,
    letterSpacing: -0.5,
    marginBottom: SIZES.sm,
    zIndex: 1,
  },

  // Subtítulo
  subtitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: FONTS.light,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: SIZES.xl,
    zIndex: 1,
  },

  // Separador
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginBottom: SIZES.xxl,
    zIndex: 1,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
  },
  dividerHeart: {
    color: COLORS.accent,
    fontSize: 14,
    marginHorizontal: SIZES.md,
  },

  // Botón
  buttonOuter: {
    borderRadius: SIZES.radiusXl,
    // Sombra para iOS
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    // Sombra para Android
    elevation: 8,
    marginBottom: SIZES.xxl,
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
    fontSize: 22,
    marginRight: SIZES.sm,
  },
  buttonText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.semibold,
    color: COLORS.textBright,
    letterSpacing: 0.3,
  },

  moduleGrid: {
    width: '100%',
    marginBottom: SIZES.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  moduleCard: {
    flexBasis: '30%',
    minWidth: 100,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  moduleCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentAlpha,
  },
  moduleIcon: {
    marginBottom: SIZES.sm,
  },
  moduleTitle: {
    ...FONTS.h3,
    color: COLORS.textBright,
    marginBottom: SIZES.xs,
  },
  moduleDescription: {
    ...FONTS.body,
    color: COLORS.textMuted,
    lineHeight: 20,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: SIZES.xxl,
    fontSize: SIZES.fontSmall,
    fontWeight: FONTS.light,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
