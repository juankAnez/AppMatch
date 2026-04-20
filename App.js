/* ================================================
   App.js — Archivo principal de Match Real App
   
   Este archivo controla QUÉ PANTALLA se muestra.
   Funciona como el "director" de la app:
   - Guarda en qué pantalla estamos
   - Guarda los datos del juego (nombres, puntajes)
   - Decide cuándo cambiar de pantalla
   ================================================ */

import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';

// Impostor screens
import ImpostorSetupScreen from './src/screens/ImpostorSetupScreen';
import ImpostorRevealScreen from './src/screens/ImpostorRevealScreen';
import ImpostorVoteScreen from './src/screens/ImpostorVoteScreen';
import ImpostorScoreboardScreen from './src/screens/ImpostorScoreboardScreen';

// Impostor data
import { IMPOSTOR_THEMES, ALL_WORDS_THEME } from './src/data/impostorWords';

export default function App() {
  // ─── Navegación ───────────────────────────────
  const [screen, setScreen] = useState('home');

  // ─── Módulo Pareja ────────────────────────────
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [connectedCount, setConnectedCount] = useState(0);
  const [notConnectedCount, setNotConnectedCount] = useState(0);
  const [numQuestions, setNumQuestions] = useState(15);

  // ─── Módulo Impostor ─────────────────────────
  // Datos fijos de la partida actual
  const [impPlayers, setImpPlayers] = useState([]);       // ["Ana","Luis","Sara",...]
  const [impThemeId, setImpThemeId] = useState('all');

  // Datos de la ronda actual
  const [impImpostorIndex, setImpImpostorIndex] = useState(-1);
  const [impSecretWord, setImpSecretWord] = useState('');
  const [impThemeName, setImpThemeName] = useState('');

  // Jugadores activos: índices dentro de impPlayers que no han sido eliminados
  const [impActivePlayers, setImpActivePlayers] = useState([]);

  // Puntuación acumulada: { nombreJugador: puntos }
  const [impScores, setImpScores] = useState({});

  // Rondas
  const [impRoundNumber, setImpRoundNumber] = useState(1);
  const [impRoundsPlayed, setImpRoundsPlayed] = useState(0);

  // ─── Helper: iniciar una ronda del Impostor ───
  const startImpostorRound = useCallback((players, themeId, activeIdxs) => {
    // Elegir tema
    const theme =
      themeId === 'all'
        ? ALL_WORDS_THEME
        : IMPOSTOR_THEMES.find((t) => t.id === themeId) || ALL_WORDS_THEME;

    // Elegir palabra aleatoria
    const word = theme.words[Math.floor(Math.random() * theme.words.length)];

    // Elegir impostor aleatorio entre los activos
    const randomActivePos = Math.floor(Math.random() * activeIdxs.length);
    const impostorIdx = activeIdxs[randomActivePos];

    setImpImpostorIndex(impostorIdx);
    setImpSecretWord(word);
    setImpThemeName(theme.name);
    setImpActivePlayers([...activeIdxs]);

    setScreen('impostor-reveal');
  }, []);

  // ─── Ayuda: sumar puntos ──────────────────────
  const addPoints = useCallback((names, pts) => {
    setImpScores((prev) => {
      const next = { ...prev };
      names.forEach((name) => {
        next[name] = (next[name] || 0) + pts;
      });
      return next;
    });
  }, []);

  // ─── Render principal ─────────────────────────
  switch (screen) {

    /* ========================================
       MÓDULO PAREJA
       ======================================== */
    case 'home':
      return (
        <HomeScreen
          onSelectModule={(moduleKey) => {
            if (moduleKey === 'couple') {
              setScreen('setup');
            } else if (moduleKey === 'impostor') {
              setScreen('impostor-setup');
            } else {
              Alert.alert(
                'Módulo en desarrollo',
                'Este módulo todavía se está preparando. Elige otro para comenzar ahora mismo.',
                [{ text: 'Entendido' }]
              );
            }
          }}
        />
      );

    case 'setup':
      return (
        <SetupScreen
          onStart={(p1, p2, num) => {
            setPlayer1(p1);
            setPlayer2(p2);
            setNumQuestions(num);
            setScreen('game');
          }}
          onBack={() => setScreen('home')}
        />
      );

    case 'game':
      return (
        <GameScreen
          player1={player1}
          player2={player2}
          numQuestions={numQuestions}
          onConnected={() => setConnectedCount((prev) => prev + 1)}
          onNotConnected={() => setNotConnectedCount((prev) => prev + 1)}
          onFinish={() => setScreen('results')}
        />
      );

    case 'results':
      return (
        <ResultsScreen
          player1={player1}
          player2={player2}
          connectedCount={connectedCount}
          notConnectedCount={notConnectedCount}
          onPlayAgain={() => {
            setConnectedCount(0);
            setNotConnectedCount(0);
            setScreen('home');
          }}
        />
      );

    /* ========================================
       MÓDULO IMPOSTOR
       ======================================== */

    // ── Setup: configurar jugadores y tema ──────
    case 'impostor-setup':
      return (
        <ImpostorSetupScreen
          onStart={(players, themeId) => {
            // Inicializar puntos en 0 para cada jugador
            const initialScores = {};
            players.forEach((name) => { initialScores[name] = 0; });

            setImpPlayers(players);
            setImpThemeId(themeId);
            setImpScores(initialScores);
            setImpRoundNumber(1);
            setImpRoundsPlayed(0);

            // Todos los jugadores activos al inicio
            const allIdxs = players.map((_, i) => i);
            startImpostorRound(players, themeId, allIdxs);
          }}
          onBack={() => setScreen('home')}
        />
      );

    // ── Reveal: cada jugador ve su rol en privado ─
    case 'impostor-reveal':
      return (
        <ImpostorRevealScreen
          players={impPlayers}
          impostorIndex={impImpostorIndex}
          secretWord={impSecretWord}
          themeName={impThemeName}
          onAllRevealed={() => setScreen('impostor-vote')}
          onBack={() => {
            Alert.alert(
              'Abandonar ronda',
              '¿Seguro que quieres salir? Se perderá la ronda actual.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Salir',
                  style: 'destructive',
                  onPress: () => setScreen('impostor-setup'),
                },
              ]
            );
          }}
        />
      );

    // ── Vote: debate y votación ──────────────────
    case 'impostor-vote':
      return (
        <ImpostorVoteScreen
          // key fuerza re-mount cuando cambia la lista de activos
          // (evita que la pantalla quede en phase='result' tras wrong vote)
          key={`vote-${impActivePlayers.length}-${impRoundNumber}`}
          players={impPlayers}
          activePlayers={impActivePlayers}
          impostorIndex={impImpostorIndex}
          secretWord={impSecretWord}
          themeName={impThemeName}
          roundNumber={impRoundNumber}

          // Jugadores adivinan correctamente al impostor
          onImpostorFound={() => {
            // +10 a cada jugador activo NO impostor
            const winners = impActivePlayers
              .filter((idx) => idx !== impImpostorIndex)
              .map((idx) => impPlayers[idx]);
            addPoints(winners, 10);
            setImpRoundsPlayed((prev) => prev + 1);
            setScreen('impostor-scoreboard');
          }}

          // Eliminaron a un inocente → el juego continúa sin ese jugador
          onWrongVote={(eliminatedIndex) => {
            const newActive = impActivePlayers.filter((i) => i !== eliminatedIndex);
            setImpActivePlayers(newActive);
            // El screen se mantiene en 'impostor-vote' pero el key
            // cambia porque impActivePlayers.length cambió, forzando re-mount
          }}

          // El impostor ganó (quedan ≤ 2 jugadores activos)
          onImpostorWins={() => {
            addPoints([impPlayers[impImpostorIndex]], 15);
            setImpRoundsPlayed((prev) => prev + 1);
            setScreen('impostor-scoreboard');
          }}

          // Nueva ronda desde el resultado (dentro de la misma partida)
          onNewRound={() => {
            setImpRoundsPlayed((prev) => prev + 1);
            const nextRound = impRoundNumber + 1;
            setImpRoundNumber(nextRound);
            // Resetear activos con todos los jugadores de la partida
            const allIdxs = impPlayers.map((_, i) => i);
            startImpostorRound(impPlayers, impThemeId, allIdxs);
          }}

          onViewScoreboard={() => setScreen('impostor-scoreboard')}

          onBack={() => {
            Alert.alert(
              'Abandonar ronda',
              '¿Seguro que quieres salir?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Salir',
                  style: 'destructive',
                  onPress: () => setScreen('impostor-setup'),
                },
              ]
            );
          }}
        />
      );

    // ── Scoreboard: tabla de puntuación ──────────
    case 'impostor-scoreboard':
      return (
        <ImpostorScoreboardScreen
          players={impPlayers}
          scores={impScores}
          roundsPlayed={impRoundsPlayed}
          onNewRound={() => {
            const nextRound = impRoundNumber + 1;
            setImpRoundNumber(nextRound);
            // Nueva ronda con todos los jugadores activos
            const allIdxs = impPlayers.map((_, i) => i);
            startImpostorRound(impPlayers, impThemeId, allIdxs);
          }}
          onGoHome={() => setScreen('home')}
        />
      );

    // ── Default ─────────────────────────────────
    default:
      return (
        <HomeScreen
          onSelectModule={(moduleKey) => {
            if (moduleKey === 'couple') setScreen('setup');
            else if (moduleKey === 'impostor') setScreen('impostor-setup');
            else {
              Alert.alert(
                'Módulo en desarrollo',
                'Este módulo todavía se está preparando.',
                [{ text: 'Entendido' }]
              );
            }
          }}
        />
      );
  }
}
