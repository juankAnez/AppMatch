/* ================================================
   IMPOSTOR — PANTALLA SETUP
   
   Permite:
   - Agregar jugadores (mínimo 3)
   - Seleccionar temática de palabras
   - Iniciar la misión
   
   Diseño: estilo espía / misterio con cyan + púrpura
   ================================================ */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../constants/theme';
import { IMPOSTOR_THEMES, ALL_WORDS_THEME } from '../data/impostorWords';

const { width } = Dimensions.get('window');

// Colores temáticos del Impostor (espionaje)
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
  redAlpha: 'rgba(255, 23, 68, 0.12)',
  text: '#E0E7FF',
  textMuted: '#8892B0',
  textBright: '#FFFFFF',
  border: 'rgba(0, 229, 255, 0.15)',
  glow: 'rgba(0, 229, 255, 0.25)',
};

export default function ImpostorSetupScreen({ onStart, onBack }) {
  const [players, setPlayers] = useState(['', '', '']);
  const [newName, setNewName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [useHints, setUseHints] = useState(false);

  // Animaciones
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(contentAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de escaneo continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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

  const addPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (players.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert('Nombre duplicado', 'Ya existe un jugador con ese nombre.');
      return;
    }
    setPlayers([...players, trimmed]);
    setNewName('');
  };

  const updatePlayer = (index, value) => {
    const copy = [...players];
    copy[index] = value;
    setPlayers(copy);
  };

  const removePlayer = (index) => {
    if (players.length <= 3) {
      Alert.alert('Mínimo 3 jugadores', 'Necesitas al menos 3 jugadores para jugar.');
      return;
    }
    setPlayers(players.filter((_, i) => i !== index));
  };

  const allFilled = players.every((p) => p.trim().length > 0) && players.length >= 3;

  // Verificar duplicados
  const hasDuplicates = () => {
    const trimmed = players.map((p) => p.trim().toLowerCase()).filter((p) => p.length > 0);
    return new Set(trimmed).size !== trimmed.length;
  };

  const canStart = allFilled && !hasDuplicates();

  const handleStart = () => {
    if (!canStart) return;
    const trimmedPlayers = players.map((p) => p.trim());
    onStart(trimmedPlayers, selectedTheme, useHints);
  };

  const allThemes = [ALL_WORDS_THEME, ...IMPOSTOR_THEMES];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={SPY.bg} />

      {/* Glow decorativo */}
      <Animated.View
        style={[
          styles.glowOrb,
          {
            opacity: scanAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.5],
            }),
          },
        ]}
      />

      {/* Botón volver */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color={SPY.cyan} />
        <Text style={styles.backText}> Volver</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, fadeSlideUp(headerAnim)]}>
          <View style={styles.spyIconWrap}>
            <Ionicons name="eye" size={48} color={SPY.cyan} />
          </View>
          <Text style={styles.title}>Misión Impostor</Text>
          <Text style={styles.subtitle}>
            Configura los agentes y la temática de la misión
          </Text>
        </Animated.View>

        <Animated.View style={fadeSlideUp(contentAnim)}>
          {/* Sección Jugadores */}
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color={SPY.cyan} />
            <Text style={styles.sectionTitle}>
              Agentes ({players.length})
            </Text>
            <Text style={styles.sectionBadge}>Mín. 3</Text>
          </View>

          {players.map((name, index) => (
            <View key={index} style={styles.playerRow}>
              <View style={styles.playerNumber}>
                <Text style={styles.playerNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={styles.playerInput}
                placeholder={`Agente ${index + 1}...`}
                placeholderTextColor={SPY.textMuted}
                value={name}
                onChangeText={(val) => updatePlayer(index, val)}
                autoCapitalize="words"
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePlayer(index)}
              >
                <Ionicons name="close-circle" size={24} color={SPY.red} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Agregar jugador */}
          <View style={styles.addRow}>
            <TextInput
              style={[styles.playerInput, { flex: 1 }]}
              placeholder="Nombre del nuevo agente..."
              placeholderTextColor={SPY.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
              maxLength={15}
              onSubmitEditing={addPlayer}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
              <LinearGradient
                colors={[SPY.cyan, SPY.cyanDark]}
                style={styles.addBtnGradient}
              >
                <Ionicons name="add" size={24} color={SPY.bgDark} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {hasDuplicates() && (
            <Text style={styles.errorText}>
              ⚠ Hay nombres duplicados. Cada agente necesita un nombre único.
            </Text>
          )}

          {/* Sección Temática */}
          <View style={[styles.sectionHeader, { marginTop: SIZES.xl }]}>
            <Ionicons name="folder-open" size={20} color={SPY.purple} />
            <Text style={styles.sectionTitle}>Temática</Text>
          </View>

          <View style={styles.themeGrid}>
            {allThemes.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    isSelected && styles.themeCardSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTheme(theme.id)}
                >
                  <Text style={styles.themeIcon}>{theme.icon}</Text>
                  <Text
                    style={[
                      styles.themeName,
                      isSelected && styles.themeNameSelected,
                    ]}
                  >
                    {theme.name}
                  </Text>
                  <Text style={styles.themeCount}>
                    {theme.words.length} palabras
                  </Text>
                  {isSelected && (
                    <View style={styles.themeCheck}>
                      <Ionicons name="checkmark-circle" size={18} color={SPY.cyan} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Opción de Pistas */}
          <View style={styles.hintToggleContainer}>
            <View style={styles.hintToggleLeft}>
              <Ionicons name="bulb" size={20} color={SPY.yellow || '#FFD600'} />
              <View style={{ marginLeft: SIZES.sm }}>
                <Text style={styles.hintToggleTitle}>Pista para el Impostor</Text>
                <Text style={styles.hintToggleDesc}>
                  El impostor recibirá una pista relacionada a la palabra secreta.
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: SPY.cardLight, true: SPY.cyan }}
              thumbColor={useHints ? SPY.textBright : 
                           Platform.OS === 'ios' ? '#f4f3f4' : SPY.textMuted}
              ios_backgroundColor={SPY.cardLight}
              onValueChange={setUseHints}
              value={useHints}
            />
          </View>

          {/* Botón Iniciar */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canStart}
            onPress={handleStart}
            style={{ marginTop: SIZES.xl, marginBottom: SIZES.xxl }}
          >
            <LinearGradient
              colors={
                canStart
                  ? [SPY.cyan, SPY.purple]
                  : ['#1a2236', '#111827']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <Ionicons
                name="finger-print"
                size={24}
                color={canStart ? SPY.bgDark : SPY.textMuted}
              />
              <Text
                style={[
                  styles.startText,
                  !canStart && { color: SPY.textMuted },
                ]}
              >
                ¡Iniciar misión!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: SPY.glow,
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
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  spyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: SPY.cyanAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
    borderWidth: 2,
    borderColor: SPY.border,
  },
  title: {
    fontSize: SIZES.fontTitle,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
    letterSpacing: 1,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.light,
    color: SPY.textMuted,
    textAlign: 'center',
  },

  // Secciones
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: FONTS.semibold,
    color: SPY.textBright,
    marginLeft: SIZES.sm,
    flex: 1,
  },
  sectionBadge: {
    fontSize: SIZES.fontSmall,
    color: SPY.cyan,
    fontWeight: FONTS.medium,
    backgroundColor: SPY.cyanAlpha,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
  },

  // Jugadores
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SPY.purpleAlpha,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: SPY.purple,
  },
  playerNumberText: {
    color: SPY.purple,
    fontWeight: FONTS.bold,
    fontSize: 14,
  },
  playerInput: {
    flex: 1,
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md - 2,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.medium,
    color: SPY.textBright,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  removeBtn: {
    marginLeft: SIZES.sm,
    padding: 4,
  },

  // Agregar jugador
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  addBtn: {
    marginLeft: SIZES.sm,
  },
  addBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: SPY.red,
    fontSize: SIZES.fontSmall,
    marginTop: SIZES.sm,
    fontWeight: FONTS.medium,
  },

  // Temas
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: (width - SIZES.lg * 2 - SIZES.sm) / 2,
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: SPY.border,
    position: 'relative',
  },
  themeCardSelected: {
    borderColor: SPY.cyan,
    backgroundColor: SPY.cyanAlpha,
  },
  themeIcon: {
    fontSize: 28,
    marginBottom: SIZES.sm,
  },
  themeName: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.semibold,
    color: SPY.text,
    marginBottom: 2,
  },
  themeNameSelected: {
    color: SPY.cyan,
  },
  themeCount: {
    fontSize: SIZES.fontSmall,
    color: SPY.textMuted,
  },
  themeCheck: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
  },

  // Botón inicio
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md + 4,
    borderRadius: SIZES.radiusXl,
    shadowColor: SPY.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  startText: {
    fontSize: SIZES.fontLarge,
    fontWeight: FONTS.bold,
    color: SPY.bgDark,
    marginLeft: SIZES.sm,
    letterSpacing: 0.5,
  },
  // Toggle Pistas
  hintToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SPY.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginTop: SIZES.lg,
    borderWidth: 1,
    borderColor: SPY.border,
  },
  hintToggleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SIZES.sm,
  },
  hintToggleTitle: {
    fontSize: SIZES.fontBody,
    fontWeight: FONTS.bold,
    color: SPY.textBright,
  },
  hintToggleDesc: {
    fontSize: SIZES.fontSmall,
    color: SPY.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
});
