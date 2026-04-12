/* ================================================
   BANCO DE CARTAS — Las 15 preguntas del juego
   
   Cada carta tiene:
   - id: número único
   - category: tipo de pregunta
   - question: la pregunta que se muestra
   - icon: emoji decorativo
   
   En el futuro, estas cartas podrían venir de
   Firebase Firestore en lugar de estar aquí.
   ================================================ */

const cardBank = [
  {
    id: 1,
    category: 'Conexión',
    question: '¿Cuál fue el momento en que supiste que era especial para ti?',
    icon: '💫',
  },
  {
    id: 2,
    category: 'Recuerdo',
    question: '¿Cuál es el viaje juntos que más guardas en tu corazón?',
    icon: '✈️',
  },
  {
    id: 3,
    category: 'Sueño',
    question: 'Si pudiéramos vivir en cualquier lugar, ¿dónde sería?',
    icon: '🌍',
  },
  {
    id: 4,
    category: 'Ternura',
    question: '¿Qué pequeño gesto mío te hace sonreír sin que yo lo note?',
    icon: '😊',
  },
  {
    id: 5,
    category: 'Conexión',
    question: '¿Qué parte de mi personalidad te complementa mejor?',
    icon: '🧩',
  },
  {
    id: 6,
    category: 'Atrevida',
    question: '¿Hay algo que siempre quisiste pedirme pero no te atreviste?',
    icon: '🔥',
  },
  {
    id: 7,
    category: 'Recuerdo',
    question: '¿Existe alguna canción que te recuerde instantáneamente a nosotros?',
    icon: '🎵',
  },
  {
    id: 8,
    category: 'Sueño',
    question: '¿Cuál es el proyecto de vida que quieres construir conmigo?',
    icon: '🏡',
  },
  {
    id: 9,
    category: 'Ternura',
    question: '¿Cómo me describirías en tres palabras a alguien que no me conoce?',
    icon: '💬',
  },
  {
    id: 10,
    category: 'Conexión',
    question: '¿En qué momento difícil sentiste que realmente podías contar conmigo?',
    icon: '🤝',
  },
  {
    id: 11,
    category: 'Atrevida',
    question: '¿Qué fue lo primero que te atrajo de mí?',
    icon: '👀',
  },
  {
    id: 12,
    category: 'Sueño',
    question: 'Descríbeme cómo imaginas nuestra vida dentro de 10 años.',
    icon: '🔮',
  },
  {
    id: 13,
    category: 'Recuerdo',
    question: '¿Cuál ha sido la noche más divertida e inolvidable que hemos vivido?',
    icon: '🌙',
  },
  {
    id: 14,
    category: 'Ternura',
    question: '¿Cuándo fue la última vez que te sentiste completamente amado/a por mí?',
    icon: '❤️',
  },
  {
    id: 15,
    category: 'Conexión',
    question: '¿Qué es lo que más valoras de nuestra relación?',
    icon: '💎',
  },
];

export default cardBank;
