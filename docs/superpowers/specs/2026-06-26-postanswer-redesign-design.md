---
name: postanswer-redesign
description: Rediseño visual de PostAnswer.jsx con glassmorphism, emojis animados (🥳✨ / 😭💔) según resultado, y verificación de audio correcto/incorrecto
metadata:
  type: project
---

# PostAnswer Redesign — Diseño Visual con Emojis Animados

## Contexto

`PostAnswer.jsx` se muestra cuando el alumno ya respondió y está esperando que el docente avance. El fondo ya es `#212121` (oscuro) establecido en `GamePage.STATE_BG`. El componente actualmente usa un `Paper` blanco con `CheckCircleIcon`/`CancelIcon` de MUI — sin animaciones ni coherencia con el design system de la app.

La lógica de audio ya está correcta en `useGameAudio.js`:
- `POST_ANSWER` + correcto → `boump.mp3`
- `POST_ANSWER` + incorrecto → `answersSound.mp3`

**No se modifican:** `useGameAudio.js`, el store (`useGameStore`), ni ninguna variable de datos (`myAnswer`, `isCorrect`, `points`, `retroalimentacion`, `selectedOption`, `score`). Solo cambios visuales.

## Objetivo

Card centrado con glassmorphism tintado según resultado, emojis animados en lugar de íconos MUI, y texto/colores coherentes con la app. Pantalla de espera bonita pero no sobrecargada.

## Archivos modificados

- `src/features/game/states/PostAnswer.jsx` — reescritura completa de JSX y estilos

## Archivos NO modificados

- `src/hooks/useGameAudio.js` — audio ya correcto
- `src/stores/useGameStore.js` — store intacto
- `src/features/game/components/ScoreDisplay.jsx` — se importa igual
- `src/pages/game/GamePage.jsx` — sin cambios

## Keyframes

```js
// Nuevo — solo en PostAnswer.jsx
const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  60%  { transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
`

// Reutilizar (definir localmente, igual que en GameStart y JoinPage)
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`
```

## Estructura del componente

### Card glassmorphism con tinte emocional

| Propiedad | Correcto | Incorrecto |
|-----------|----------|------------|
| `background` | `rgba(34, 197, 94, 0.15)` | `rgba(239, 68, 68, 0.15)` |
| `border` | `1px solid rgba(34, 197, 94, 0.35)` | `1px solid rgba(239, 68, 68, 0.35)` |
| `backdropFilter` | `blur(16px)` | `blur(16px)` |
| `borderRadius` | `20px` | `20px` |
| `px / py` | `{ xs: 3, sm: 5 } / { xs: 4, sm: 5 }` | igual |

### Sección de emojis (reemplaza MUI icons)

| | Correcto | Incorrecto |
|--|----------|------------|
| Emoji principal | 🥳 `fontSize: '4rem'` | 😭 `fontSize: '4rem'` |
| Animación principal | `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both` | igual |
| Emoji secundario | ✨ `fontSize: '2rem'` | 💔 `fontSize: '2rem'` |
| Animación secundaria | `fadeSlideUp 0.4s ease-out 0.2s both` | igual |

### Contenido textual (datos sin cambios)

Animaciones `fadeSlideUp` escalonadas:

| Delay | Elemento |
|-------|----------|
| 0.1s | Título: "¡Respuesta Correcta!" / "Respuesta Incorrecta" — `variant="h5"`, `fontWeight: 700`, color blanco |
| 0.2s | "Tu respuesta: **{selectedOption?.texto}**" — `variant="body1"`, `rgba(255,255,255,0.8)` |
| 0.3s | Puntos: "+{points} pts" / "+0 pts" — `variant="h4"`, `fontWeight: 700`, verde brillante `#4ade80` si correcto, `rgba(255,255,255,0.5)` si incorrecto |
| 0.4s | Alert de retroalimentación — se renderiza solo si `retroalimentacion` es truthy (igual que ahora), `severity="info"`, `sx={{ textAlign: 'left', mt: 1 }}` sin cambios |

### Sección inferior de espera

- `ScoreDisplay` — sin cambios
- "Esperando al profesor..." — `color: 'rgba(255,255,255,0.7)'`
- `CircularProgress` — `sx={{ color: 'white' }}`

## Props del componente (sin cambios)

```jsx
PostAnswer()  // sin props, usa useGameStore internamente
```

## Verificación de audio (solo lectura, sin cambios)

Confirmado en `useGameAudio.js` líneas 41-45:
```js
useEffect(() => {
  if (status === 'POST_ANSWER') {
    play(isCorrect ? 'boump' : 'answersSound')
  }
}, [status, isCorrect])
```
- `boump.mp3` → acierto ✅
- `answersSound.mp3` → error ✅
