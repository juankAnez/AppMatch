# Plan de Desarrollo - juegoMovie

Este documento detalla la hoja de ruta para finalizar y profesionalizar la aplicación.

## 1. Pulido de Experiencia de Usuario (UX/UI)
- **Sistema de Tiempos:** Implementar un temporizador regresivo en `ImpostorVoteScreen` para limitar la fase de debate y añadir presión al juego.
- **Feedback Auditivo:** Integrar efectos de sonido para eventos clave (ej. cuando se descubre al impostor, votación errónea o fin de ronda).
- **Transiciones Fluidas:** Implementar animaciones de transición entre pantallas (utilizando `react-navigation` o animaciones personalizadas) para evitar saltos bruscos.
- **Refuerzo de Contenido:** Expandir los archivos `impostorWords.js` y `cards.js` con más categorías y palabras para evitar la repetitividad.

## 2. Nuevas Funcionalidades (Features)
- **Persistencia de Datos:** Implementar `AsyncStorage` para guardar el historial de partidas, récords de puntuación y preferencias del usuario.
- **Configuración Avanzada:** Añadir opciones en `ImpostorSetupScreen` para personalizar el puntaje por victoria o el número máximo de rondas.
- **Modo "Espectador":** Permitir que jugadores eliminados puedan seguir el debate sin interferir en la votación.
- **Sistema de Sugerencias:** Agregar una lista de "preguntas sugeridas" en la pantalla de juego para ayudar a los jugadores a iniciar el debate.

## 3. Evolución Técnica y Arquitectura
- **Gestión de Estado:** Migrar la lógica de `App.js` a un Context API o Redux para evitar el "prop drilling" y organizar mejor los módulos de "Pareja" e "Impostor".
- **Soporte Multiplataforma:** Optimizar la responsividad para tablets y asegurar que la versión Web sea totalmente funcional.
- **Sincronización Online (Opcional/Avanzado):** Investigar la integración de Firebase o Socket.io para permitir que cada jugador use su propio dispositivo en lugar de pasar un solo teléfono.

## 4. Control de Calidad y Lanzamiento
- **Pruebas de Estrés:** Realizar sesiones de juego con diferentes cantidades de personas para detectar bugs de lógica en la asignación de roles.
- **Linting y Tipado:** Ejecutar una limpieza de código general y considerar la migración a TypeScript para evitar errores de tipos en la gestión de los jugadores activos.
