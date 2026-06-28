# PostAnswer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir `PostAnswer.jsx` para mostrar emojis animados (🥳✨ / 😭💔) con glassmorphism tintado según si la respuesta fue correcta o incorrecta, manteniendo todos los datos y sin tocar la lógica de audio ni el store.

**Architecture:** Reescritura completa de un solo componente. Reutiliza keyframes de `@emotion/react`, el mismo glassmorphism de `WaitingRoom`/`GameStart`, y los datos existentes del store `useGameStore`. El audio ya es correcto en `useGameAudio.js` — cero cambios ahí.

**Tech Stack:** React, MUI (Box, Typography, Alert, CircularProgress), @emotion/react (keyframes), Vitest + @testing-library/react

## Global Constraints

- Props/exports del componente sin cambios: `PostAnswer()` sin props, usa `useGameStore` internamente
- Variables de datos intocables: `myAnswer`, `isCorrect`, `points`, `retroalimentacion`, `selectedOption`, `score`, `currentQuestion`
- No modificar: `useGameAudio.js`, `useGameStore.js`, `ScoreDisplay.jsx`, `GamePage.jsx`
- Glassmorphism: `backdropFilter: 'blur(16px)'`, `borderRadius: '20px'`
- Correcto tinte: `rgba(34, 197, 94, 0.15)` / borde `rgba(34, 197, 94, 0.35)`
- Incorrecto tinte: `rgba(239, 68, 68, 0.15)` / borde `rgba(239, 68, 68, 0.35)`
- Tests en `src/tests/components/PostAnswer.test.jsx`
- No hay commits (preferencia del usuario)

---

### Task 1: Tests + Implementación completa del rediseño

**Files:**
- Create: `src/tests/components/PostAnswer.test.jsx`
- Modify: `src/features/game/states/PostAnswer.jsx`

**Interfaces:**
- Consumes: `useGameStore` de `../../../stores/useGameStore`, `ScoreDisplay` de `../components/ScoreDisplay`
- Produce: `PostAnswer()` con glassmorphism tintado, emojis `popIn`/`fadeSlideUp`, texto blanco, sin cambios de datos

- [ ] **Step 1: Escribir los tests**

Crear `src/tests/components/PostAnswer.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostAnswer from '../../features/game/states/PostAnswer'
import { useGameStore } from '../../stores/useGameStore'

vi.mock('../../stores/useGameStore', () => ({
  useGameStore: vi.fn(),
}))

vi.mock('../../features/game/components/ScoreDisplay', () => ({
  default: ({ score }) => <div data-testid="score-display">{score}</div>,
}))

const correctState = {
  myAnswer: {
    isCorrect: true,
    points: 150,
    retroalimentacion: 'La mitocondria produce energía.',
    opcionId: 'opt-1',
  },
  score: 450,
  currentQuestion: { opciones: [{ id_opcion: 'opt-1', texto: 'Mitocondria' }] },
}

const incorrectState = {
  myAnswer: {
    isCorrect: false,
    points: 0,
    retroalimentacion: null,
    opcionId: 'opt-2',
  },
  score: 300,
  currentQuestion: { opciones: [{ id_opcion: 'opt-2', texto: 'Núcleo' }] },
}

describe('PostAnswer — respuesta correcta', () => {
  beforeEach(() => vi.mocked(useGameStore).mockReturnValue(correctState))

  it('renders without crashing', () => {
    const { container } = render(<PostAnswer />)
    expect(container.firstChild).toBeTruthy()
  })

  it('shows happy emoji 🥳', () => {
    render(<PostAnswer />)
    expect(screen.getByText('🥳')).toBeInTheDocument()
  })

  it('shows sparkle emoji ✨', () => {
    render(<PostAnswer />)
    expect(screen.getByText('✨')).toBeInTheDocument()
  })

  it('shows correct title', () => {
    render(<PostAnswer />)
    expect(screen.getByText('¡Respuesta Correcta!')).toBeInTheDocument()
  })

  it('shows selected answer text', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Mitocondria')).toBeInTheDocument()
  })

  it('shows points earned', () => {
    render(<PostAnswer />)
    expect(screen.getByText('+150 pts')).toBeInTheDocument()
  })

  it('shows retroalimentacion when present', () => {
    render(<PostAnswer />)
    expect(screen.getByText(/mitocondria produce energía/)).toBeInTheDocument()
  })

  it('shows ScoreDisplay', () => {
    render(<PostAnswer />)
    expect(screen.getByTestId('score-display')).toBeInTheDocument()
  })

  it('shows waiting message', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Esperando al profesor...')).toBeInTheDocument()
  })
})

describe('PostAnswer — respuesta incorrecta', () => {
  beforeEach(() => vi.mocked(useGameStore).mockReturnValue(incorrectState))

  it('shows sad emoji 😭', () => {
    render(<PostAnswer />)
    expect(screen.getByText('😭')).toBeInTheDocument()
  })

  it('shows broken heart emoji 💔', () => {
    render(<PostAnswer />)
    expect(screen.getByText('💔')).toBeInTheDocument()
  })

  it('shows incorrect title', () => {
    render(<PostAnswer />)
    expect(screen.getByText('Respuesta Incorrecta')).toBeInTheDocument()
  })

  it('shows zero points', () => {
    render(<PostAnswer />)
    expect(screen.getByText('+0 pts')).toBeInTheDocument()
  })

  it('does not show retroalimentacion when null', () => {
    render(<PostAnswer />)
    expect(screen.queryByText(/Explicación/)).not.toBeInTheDocument()
  })
})

describe('PostAnswer — sin respuesta', () => {
  it('renders nothing when myAnswer is null', () => {
    vi.mocked(useGameStore).mockReturnValue({ myAnswer: null, score: 0, currentQuestion: null })
    const { container } = render(<PostAnswer />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Ejecutar tests para verificar que fallan**

```bash
npx vitest run src/tests/components/PostAnswer.test.jsx
```

Resultado esperado: múltiples FAILs — especialmente los de emojis (🥳, ✨, 😭, 💔) porque el componente actual usa MUI icons, no emojis.

- [ ] **Step 3: Implementar el rediseño completo de PostAnswer.jsx**

Reemplazar TODO el contenido de `src/features/game/states/PostAnswer.jsx`:

```jsx
import { Box, Typography, Alert, CircularProgress } from '@mui/material'
import { keyframes } from '@emotion/react'
import ScoreDisplay from '../components/ScoreDisplay'
import { useGameStore } from '../../../stores/useGameStore'

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.5); }
  60%  { transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
`

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`

export default function PostAnswer() {
  const { myAnswer, score, currentQuestion } = useGameStore()
  if (!myAnswer) return null

  const { isCorrect, points, retroalimentacion } = myAnswer
  const selectedOption = currentQuestion?.opciones?.find((o) => o.id_opcion === myAnswer.opcionId)

  const cardBg = isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
  const cardBorder = isCorrect
    ? '1px solid rgba(34, 197, 94, 0.35)'
    : '1px solid rgba(239, 68, 68, 0.35)'

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Box
        sx={{
          background: cardBg,
          backdropFilter: 'blur(16px)',
          border: cardBorder,
          borderRadius: '20px',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '4rem',
            lineHeight: 1,
            mb: 0.5,
            display: 'block',
            animation: `${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
          }}
        >
          {isCorrect ? '🥳' : '😭'}
        </Typography>

        <Typography
          sx={{
            fontSize: '2rem',
            lineHeight: 1,
            mb: 2,
            display: 'block',
            animation: `${fadeSlideUp} 0.4s ease-out 0.2s both`,
          }}
        >
          {isCorrect ? '✨' : '💔'}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            color: 'white',
            mb: 1,
            animation: `${fadeSlideUp} 0.4s ease-out 0.1s both`,
          }}
        >
          {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 2,
            animation: `${fadeSlideUp} 0.4s ease-out 0.2s both`,
          }}
        >
          Tu respuesta: <strong>{selectedOption?.texto ?? '—'}</strong>
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: isCorrect ? '#4ade80' : 'rgba(255,255,255,0.5)',
            mb: 2,
            animation: `${fadeSlideUp} 0.4s ease-out 0.3s both`,
          }}
        >
          {isCorrect ? `+${points} pts` : '+0 pts'}
        </Typography>

        {retroalimentacion && (
          <Box sx={{ animation: `${fadeSlideUp} 0.4s ease-out 0.4s both` }}>
            <Alert severity="info" sx={{ textAlign: 'left', mt: 1 }}>
              <strong>Explicación:</strong> {retroalimentacion}
            </Alert>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
        <ScoreDisplay score={score} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Esperando al profesor...
        </Typography>
        <CircularProgress size={20} sx={{ color: 'white' }} />
      </Box>
    </Box>
  )
}
```

- [ ] **Step 4: Ejecutar tests para verificar que pasan**

```bash
npx vitest run src/tests/components/PostAnswer.test.jsx
```

Resultado esperado: 15 tests en PASS.

- [ ] **Step 5: Ejecutar todos los tests del proyecto**

```bash
npx vitest run
```

Resultado esperado: todos los tests de GameStart, Layout, ScienceBackground y PostAnswer pasan. Los 3 de JoinPage siguen fallando (pre-existente, no regresión nuestra).

- [ ] **Step 6: Verificación visual**

Agregar ruta temporal a `src/router.jsx` para ver ambos estados:

```jsx
// Al inicio del archivo, añadir este import:
import PostAnswer from './features/game/states/PostAnswer'

// Dentro del array de createBrowserRouter, añadir estas dos rutas:
{
  path: '/__test_correct',
  element: (() => {
    const { useGameStore } = require('./stores/useGameStore')
    // No funciona con require en ESM — usar enfoque de wrapper
    return null
  })()
},
```

Como `useGameStore` es un store de Zustand que no acepta props, la mejor forma de probar visualmente es modificar temporalmente el componente para forzar un estado. En su lugar, crear un wrapper temporal directo en el router:

```jsx
// En src/router.jsx, añadir al inicio:
import PostAnswer from './features/game/states/PostAnswer'
import { useGameStore } from './stores/useGameStore'

// Componente wrapper temporal para testing visual
function PostAnswerTestCorrect() {
  useGameStore.setState({
    myAnswer: { isCorrect: true, points: 200, retroalimentacion: 'La mitocondria produce ATP.', opcionId: 'opt-1' },
    score: 600,
    currentQuestion: { opciones: [{ id_opcion: 'opt-1', texto: 'Mitocondria' }] },
  })
  return <PostAnswer />
}

function PostAnswerTestIncorrect() {
  useGameStore.setState({
    myAnswer: { isCorrect: false, points: 0, retroalimentacion: null, opcionId: 'opt-2' },
    score: 300,
    currentQuestion: { opciones: [{ id_opcion: 'opt-2', texto: 'Núcleo' }] },
  })
  return <PostAnswer />
}

// Añadir al array de rutas:
{ path: '/__test_correct',   element: <PostAnswerTestCorrect /> },
{ path: '/__test_incorrect', element: <PostAnswerTestIncorrect /> },
```

Iniciar el servidor (ya corre en puerto 8004 si está activo, si no: `npm run dev`).

Verificar en el navegador:
- `http://localhost:8004/__test_correct` → card verde tintado, 🥳, ✨, "¡Respuesta Correcta!", puntos en verde, retroalimentación visible
- `http://localhost:8004/__test_incorrect` → card rojo tintado, 😭, 💔, "Respuesta Incorrecta", puntos en blanco apagado, sin retroalimentación

Después de verificar, **eliminar** del `router.jsx`: los dos imports (`PostAnswer`, `useGameStore`), los dos componentes wrapper (`PostAnswerTestCorrect`, `PostAnswerTestIncorrect`) y las dos rutas (`/__test_correct`, `/__test_incorrect`).
