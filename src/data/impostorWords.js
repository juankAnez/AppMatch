/* ================================================
   BANCO DE PALABRAS — Juego del Impostor

   100 palabras distribuidas en 5 temas (20 c/u).
   Se puede elegir un tema específico o mezclar todos.
   ================================================ */

const IMPOSTOR_THEMES = [
  {
    id: 'food',
    name: 'Comida',
    icon: '🍕',
    color: '#FF6D00',
    words: [
      'Pizza', 'Sushi', 'Tacos', 'Hamburguesa', 'Paella',
      'Ceviche', 'Pasta', 'Empanada', 'Ramen', 'Burrito',
      'Croissant', 'Arepa', 'Lasaña', 'Nachos', 'Churros',
      'Tamales', 'Pupusas', 'Pancakes', 'Asado', 'Croquetas',
    ],
  },
  {
    id: 'movies',
    name: 'Películas',
    icon: '🎬',
    color: '#D500F9',
    words: [
      'Titanic', 'Avatar', 'Matrix', 'Coco', 'Inception',
      'Joker', 'Frozen', 'Gladiator', 'Shrek', 'Batman',
      'Rapidos y Furiosos', 'Harry Potter', 'Star Wars', 'Jurassic Park', 'Iron Man',
      'El Rey León', 'Toy Story', 'Interstellar', 'Venom', 'Spider-Man',
    ],
  },
  {
    id: 'sports',
    name: 'Deportes',
    icon: '⚽',
    color: '#00C853',
    words: [
      'Fútbol', 'Tenis', 'Natación', 'Basketball', 'Boxeo',
      'Volleyball', 'Béisbol', 'Golf', 'Ciclismo', 'Atletismo',
      'Surf', 'Karate', 'Rugby', 'Skate', 'Snowboard',
      'Esgrima', 'Polo', 'Escalada', 'Tiro con arco', 'Lucha libre',
    ],
  },
  {
    id: 'countries',
    name: 'Países',
    icon: '🌍',
    color: '#2979FF',
    words: [
      'México', 'Japón', 'Italia', 'Brasil', 'Egipto',
      'Francia', 'Argentina', 'Australia', 'India', 'Canadá',
      'Colombia', 'Alemania', 'España', 'Rusia', 'Corea del Sur',
      'Perú', 'Grecia', 'Turquía', 'Noruega', 'Cuba',
    ],
  },
  {
    id: 'music',
    name: 'Música',
    icon: '🎵',
    color: '#FF1744',
    words: [
      'Reggaetón', 'Rock', 'Salsa', 'Jazz', 'Pop',
      'Hip Hop', 'Cumbia', 'Bachata', 'Metal', 'Blues',
      'Electrónica', 'Vallenato', 'Trap', 'Mariachi', 'Reggae',
      'K-Pop', 'Country', 'Merengue', 'Clásica', 'R&B',
    ],
  },
];

// Tema especial: todas las palabras mezcladas
const ALL_WORDS_THEME = {
  id: 'all',
  name: 'Todos los temas',
  icon: '🎲',
  color: '#00E5FF',
  words: IMPOSTOR_THEMES.flatMap((t) => t.words),
};

export { IMPOSTOR_THEMES, ALL_WORDS_THEME };
