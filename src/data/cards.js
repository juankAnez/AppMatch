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
    id: 16,
    category: 'Recuerdo',
    question: '¿Cuál es el regalo más significativo que me has dado?',
    icon: '🎁',
  },
  {
    id: 17,
    category: 'Sueño',
    question: '¿Qué aventura juntos te gustaría vivir algún día?',
    icon: '🗺️',
  },
  {
    id: 18,
    category: 'Ternura',
    question: '¿Cómo te hago sentir seguro/a cuando estamos juntos?',
    icon: '🛡️',
  },
  {
    id: 19,
    category: 'Conexión',
    question: '¿Qué cualidad mía admiras más?',
    icon: '👑',
  },
  {
    id: 20,
    category: 'Atrevida',
    question: '¿Qué secreto mío conoces que nadie más sabe?',
    icon: '🔒',
  },
  {
    id: 21,
    category: 'Recuerdo',
    question: '¿Cuál fue nuestro primer beso inolvidable?',
    icon: '💋',
  },
  {
    id: 22,
    category: 'Sueño',
    question: '¿Dónde te imaginas que envejeceremos juntos?',
    icon: '🏖️',
  },
  {
    id: 23,
    category: 'Ternura',
    question: '¿Qué te hace sentir más amado/a en nuestra relación?',
    icon: '💕',
  },
  {
    id: 24,
    category: 'Conexión',
    question: '¿Cómo hemos crecido juntos como personas?',
    icon: '🌱',
  },
  {
    id: 25,
    category: 'Atrevida',
    question: '¿Qué fantasía tuya me has contado?',
    icon: '💭',
  },
  {
    id: 26,
    category: 'Recuerdo',
    question: '¿Cuál es la foto nuestra favorita?',
    icon: '📸',
  },
  {
    id: 27,
    category: 'Sueño',
    question: '¿Qué quieres lograr juntos en los próximos años?',
    icon: '🎯',
  },
  {
    id: 28,
    category: 'Ternura',
    question: '¿Cómo expresas tu amor por mí?',
    icon: '💌',
  },
  {
    id: 29,
    category: 'Conexión',
    question: '¿Qué nos hace únicos como pareja?',
    icon: '💫',
  },
  {
    id: 30,
    category: 'Atrevida',
    question: '¿Qué cosa loca harías conmigo?',
    icon: '🤪',
  },
  {
    id: 31,
    category: 'Recuerdo',
    question: '¿Cuál es el momento más romántico que hemos vivido?',
    icon: '🌹',
  },
  {
    id: 32,
    category: 'Sueño',
    question: '¿Cómo imaginas nuestras vacaciones perfectas?',
    icon: '✈️',
  },
  {
    id: 33,
    category: 'Ternura',
    question: '¿Qué apodo cariñoso me pones?',
    icon: '😘',
  },
  {
    id: 34,
    category: 'Conexión',
    question: '¿Qué lección hemos aprendido juntos?',
    icon: '📚',
  },
  {
    id: 35,
    category: 'Atrevida',
    question: '¿Qué te excita de mí?',
    icon: '🔥',
  },
  {
    id: 36,
    category: 'Recuerdo',
    question: '¿Cuál es nuestra canción?',
    icon: '🎶',
  },
  {
    id: 37,
    category: 'Sueño',
    question: '¿Qué casa soñamos juntos?',
    icon: '🏠',
  },
  {
    id: 38,
    category: 'Ternura',
    question: '¿Cómo te consuelo cuando estás triste?',
    icon: '🤗',
  },
  {
    id: 39,
    category: 'Conexión',
    question: '¿Qué nos fortalece como pareja?',
    icon: '💪',
  },
  {
    id: 40,
    category: 'Atrevida',
    question: '¿Qué secreto te guardas de mí?',
    icon: '🤫',
  },
  {
    id: 41,
    category: 'Recuerdo',
    question: '¿Cuál fue el día más feliz de nuestra relación?',
    icon: '😄',
  },
  {
    id: 42,
    category: 'Sueño',
    question: '¿Qué futuro ves para nosotros?',
    icon: '🔮',
  },
  {
    id: 43,
    category: 'Ternura',
    question: '¿Qué te hace sonreír de mí?',
    icon: '😊',
  },
  {
    id: 44,
    category: 'Conexión',
    question: '¿Cómo nos complementamos?',
    icon: '🧩',
  },
  {
    id: 45,
    category: 'Atrevida',
    question: '¿Qué aventura sexual quieres probar?',
    icon: '🍆',
  },
  {
    id: 46,
    category: 'Recuerdo',
    question: '¿Cuál es el viaje más memorable?',
    icon: '🚗',
  },
  {
    id: 47,
    category: 'Sueño',
    question: '¿Qué quieres construir juntos?',
    icon: '🔨',
  },
  {
    id: 48,
    category: 'Ternura',
    question: '¿Cómo demuestras tu amor?',
    icon: '❤️',
  },
  {
    id: 49,
    category: 'Conexión',
    question: '¿Qué nos hace inseparables?',
    icon: '🔗',
  },
  {
    id: 50,
    category: 'Atrevida',
    question: '¿Qué kink tienes?',
    icon: '🪢',
  },
];

export default cardBank;
