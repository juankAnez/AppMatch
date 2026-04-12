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
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  // === ESTADO GLOBAL DEL JUEGO ===
  // "screen" guarda en qué pantalla estamos ahora
  // Puede ser: 'home', 'setup', 'game', 'results'
  const [screen, setScreen] = useState('home');

  // Datos de los jugadores (se llenarán en la Pantalla 2)
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  // Datos del juego (se usarán en las Pantallas 3 y 4)
  const [answeredCount, setAnsweredCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  // === RENDERIZAR LA PANTALLA ACTUAL ===
  // Dependiendo del valor de "screen", muestra una pantalla diferente
  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onPlay={() => setScreen('setup')}
        />
      );

    // Las siguientes pantallas las construiremos después:
    // case 'setup':
    //   return <SetupScreen ... />;
    // case 'game':
    //   return <GameScreen ... />;
    // case 'results':
    //   return <ResultsScreen ... />;

    default:
      return (
        <HomeScreen
          onPlay={() => setScreen('setup')}
        />
      );
  }
}
