# Spec: Fondo de imagen en pantalla de pregunta/respuesta

**Fecha:** 2026-06-27  
**Estado:** Aprobado

## Objetivo

Reemplazar el fondo negro plano (`#121212`) de las pantallas de pregunta y respuesta por una imagen ilustrativa de aula con un overlay semitransparente, para dar atmósfera gamificada sin sacrificar legibilidad.

## Contexto

El `GamePage.jsx` gestiona el fondo de todos los estados del juego mediante el diccionario `STATE_BG`. Los estados `SHOW_QUESTION` y `SELECT_ANSWER` actualmente usan `#121212`. Los demás estados (`SHOW_ROOM`, `SHOW_START`, etc.) no se ven afectados.

## Recursos

- **Imagen:** `src/assets/fondo-cuest.jpg` — ilustración estilo cartoon de un aula escolar con colores vivos.

## Diseño

### Archivo modificado

`src/pages/game/GamePage.jsx` — único archivo a tocar.

### Cambios

1. Importar la imagen al inicio del archivo:
   ```js
   import fondoCuest from '../../assets/fondo-cuest.jpg'
   ```

2. Detectar los estados de pregunta/respuesta con una variable booleana:
   ```js
   const isQuestionState = status === 'SHOW_QUESTION' || status === 'SELECT_ANSWER'
   ```

3. En el `<Box>` raíz aplicar estilos condicionalmente:
   - **Estados de pregunta/respuesta:** imagen de fondo + overlay oscuro azulado al 60% de opacidad.
   - **Resto de estados:** `bgcolor` con el color existente del diccionario `STATE_BG` (sin cambios).

   ```jsx
   <Box sx={{
     minHeight: '100vh',
     color,
     transition: 'background 0.4s',
     ...(isQuestionState
       ? {
           background: `linear-gradient(rgba(10,10,30,0.60), rgba(10,10,30,0.60)), url(${fondoCuest})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed',
         }
       : { bgcolor: bg }
     ),
   }}>
   ```

### Overlay

- Color: `rgba(10, 10, 30, 0.60)` — azul muy oscuro al 60% de opacidad.
- Efecto: permite ver la ilustración del aula difuminada detrás del contenido, manteniendo texto blanco y botones de colores (rojo, azul, amarillo, verde) completamente legibles y vibrantes.

## Alcance

- Afecta: `SHOW_QUESTION` y `SELECT_ANSWER`.
- No afecta: `SHOW_ROOM`, `SHOW_START`, `SHOW_PREPARED`, `POST_ANSWER`, `SHOW_LEADERBOARD`, `FINISHED`.
- No se modifica `Question.jsx`, `Answers.jsx`, ni ningún otro componente.

## Criterios de éxito

- La imagen del aula se ve detrás del contenido en ambas pantallas.
- El texto de la pregunta es legible (blanco sobre overlay oscuro).
- Los botones de respuesta mantienen sus colores vivos (rojo, azul, amarillo, verde).
- El resto de pantallas del juego no se ven afectadas.
