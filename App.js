/* ================================================
   App.js — Archivo principal de Match Real App
   
   Este archivo controla QUÉ PANTALLA se muestra.
   Funciona como el "director" de la app:
   - Guarda en qué pantalla estamos
   - Guarda los datos del juego (nombres, puntajes)
   - Decide cuándo cambiar de pantalla
   
   En el futuro, esto se puede reemplazar con
   React Navigation para una navegación más avanzada.
   ================================================ */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';

export default function App() {
  // === ESTADO GLOBAL DEL JUEGO ===
  // "screen" guarda en qué pantalla estamos ahora
  // Puede ser: 'home', 'setup', 'game', 'results'
  const [screen, setScreen] = useState('home');

  // Datos de los jugadores (se llenarán en la Pantalla 2)
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  // Datos del juego (se usarán en las Pantallas 3 y 4)
  const [connectedCount, setConnectedCount] = useState(0);
  const [notConnectedCount, setNotConnectedCount] = useState(0);
  const [numQuestions, setNumQuestions] = useState(15);

  // === RENDERIZAR LA PANTALLA ACTUAL ===
  // Dependiendo del valor de "screen", muestra una pantalla diferente
  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onSelectModule={(moduleKey) => {
            if (moduleKey === 'couple') {
              setScreen('setup');
            } else {
              Alert.alert(
                'Módulo en desarrollo',
                'Este módulo todavía se está preparando. Elige "Pareja" para comenzar ahora mismo.',
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
          onConnected={() => setConnectedCount(prev => prev + 1)}
          onNotConnected={() => setNotConnectedCount(prev => prev + 1)}
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
            setScreen('home');
            setConnectedCount(0);
            setNotConnectedCount(0);
          }}
        />
      );

    // Las siguientes pantallas las construiremos después:

    default:
      return (
        <HomeScreen
          onSelectModule={(moduleKey) => {
            if (moduleKey === 'couple') {
              setScreen('setup');
            } else {
              Alert.alert(
                'Módulo en desarrollo',
                'Este módulo todavía se está preparando. Elige "Pareja" para comenzar ahora mismo.',
                [{ text: 'Entendido' }]
              );
            }
          }}
        />
      );
  }
}
