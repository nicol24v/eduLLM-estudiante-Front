# Answer Button Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar fuente gamificada a la pantalla de juego, rediseñar los botones de respuesta con estilo 3D, y fijar el grid de respuestas a 2 columnas siempre.

**Architecture:** Tres cambios independientes y secuenciales: (1) fuente via Google Fonts en `index.html` + `GamePage.jsx`, (2) estilo 3D en `AnswerButton.jsx` con arrays de colores claro/oscuro, (3) grid 2x2 fijo en `Answers.jsx` y `Question.jsx`. Ningún cambio toca lógica de juego, stores ni hooks.

**Tech Stack:** React, MUI v5 (`Button`, `Box`, `Grid`), Google Fonts (Fredoka One, Nunito).

## Global Constraints

- No modificar props ni callbacks de `AnswerButton` (`onClick`, `disabled`, `selected`, `index`, `label`).
- No tocar `useGameStore`, `usePlayerSocket` ni ningún store/hook.
- La fuente gamificada aplica solo dentro de `GamePage` — no afecta el resto de la app.
- Colores base `COLORS` no cambian; solo se agregan `COLORS_DARK` y `COLORS_LIGHT`.

---

### Task 1: Fuente gamificada

**Files:**
- Modify: `index.html`
- Modify: `src/pages/game/GamePage.jsx`

**Interfaces:**
- Consumes: nada de tareas anteriores
- Produces: fuente `'Fredoka One', 'Nunito', cursive` disponible y aplicada en el `<Box>` raíz de `GamePage`; Tasks 2 y 3 la heredan automáticamente.

- [ ] **Step 1: Agregar Google Fonts en index.html**

Abrir `index.html`. Agregar las tres líneas de Google Fonts justo antes del cierre `</head>`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>edullm-estudiante-front</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Agregar fontFamily en el Box raíz de GamePage.jsx**

Localizar el `<Box sx={{...}}>` en el `return` de `GamePage.jsx` (línea ~82). Agregar `fontFamily` como primera propiedad del objeto `sx`:

```jsx
<Box sx={{
  minHeight: '100vh',
  color,
  fontFamily: "'Fredoka One', 'Nunito', cursive",
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

- [ ] **Step 3: Verificar fuente en navegador**

Con el servidor corriendo (`npm run dev`), entrar al juego y llegar a la pantalla de pregunta. Verificar que el texto de la pregunta, el timer y el puntaje usan una fuente redondeada y gamificada (no Roboto). Las demás páginas (JoinPage, homepage) deben mantener su fuente original.

- [ ] **Step 4: Commit**

```bash
git add index.html src/pages/game/GamePage.jsx
git commit -m "feat: apply Fredoka One gamified font to game screen"
```

---

### Task 2: Rediseño 3D de AnswerButton

**Files:**
- Modify: `src/features/game/components/AnswerButton.jsx`

**Interfaces:**
- Consumes: fuente `'Fredoka One', 'Nunito', cursive` ya disponible via Task 1 (también declarada inline en el botón como refuerzo)
- Produces: `AnswerButton` con estilo 3D, `height: '100%'` para estirarse en la celda del grid — usado por Tasks 3 (grid stretch).

- [ ] **Step 1: Reemplazar el contenido completo de AnswerButton.jsx**

```jsx
import { Button, Box } from '@mui/material'

const COLORS       = ['#e53935', '#1e88e5', '#f9a825', '#43a047']
const COLORS_DARK  = ['#b71c1c', '#1565c0', '#f57f17', '#2e7d32']
const COLORS_LIGHT = ['#ef5350', '#42a5f5', '#ffca28', '#66bb6a']
const ICONS = ['▲', '◆', '●', '■']

export default function AnswerButton({ index, label, disabled, onClick, selected }) {
  const color      = COLORS[index % 4]
  const colorDark  = COLORS_DARK[index % 4]
  const colorLight = COLORS_LIGHT[index % 4]
  const icon       = ICONS[index % 4]

  return (
    <Button
      variant="contained"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      sx={{
        background: `linear-gradient(to bottom, ${colorLight} 0%, ${color} 70%)`,
        boxShadow: `0 6px 0 ${colorDark}, 0 8px 12px rgba(0,0,0,0.25)`,
        borderRadius: '14px',
        border: selected ? '3px solid white' : '3px solid transparent',
        color: 'white',
        fontWeight: 700,
        fontSize: '1rem',
        fontFamily: "'Fredoka One', 'Nunito', cursive",
        textShadow: '0 2px 4px rgba(0,0,0,0.35)',
        textTransform: 'none',
        p: 2,
        height: '100%',
        minHeight: '72px',
        width: '100%',
        justifyContent: 'flex-start',
        gap: 2,
        transition: 'transform 0.08s, box-shadow 0.08s',
        '&:hover': {
          background: `linear-gradient(to bottom, ${colorLight} 0%, ${color} 70%)`,
          transform: 'translateY(2px)',
          boxShadow: `0 4px 0 ${colorDark}, 0 6px 8px rgba(0,0,0,0.2)`,
        },
        '&:active': {
          transform: 'translateY(6px)',
          boxShadow: `0 0px 0 ${colorDark}, 0 2px 4px rgba(0,0,0,0.15)`,
        },
        '&.Mui-disabled': {
          background: `linear-gradient(to bottom, ${colorLight}88 0%, ${color}88 70%)`,
          boxShadow: `0 6px 0 ${colorDark}88`,
          color: 'white',
        },
      }}
    >
      <Box component="span" sx={{ fontSize: '1.2rem' }}>{icon}</Box>
      {label}
    </Button>
  )
}
```

- [ ] **Step 2: Verificar estilo 3D en navegador**

Llegar a la pantalla de respuesta. Verificar:
- Los 4 botones tienen gradiente vertical (color claro arriba → color base abajo).
- Hay una sombra oscura visible en el borde inferior de cada botón (efecto 3D).
- Al pasar el mouse el botón baja 2px.
- Al hacer clic el botón baja 6px (se hunde).
- El botón seleccionado muestra borde blanco.
- Los botones deshabilitados (estado `SHOW_QUESTION`) tienen la misma forma pero semitransparentes.

- [ ] **Step 3: Commit**

```bash
git add src/features/game/components/AnswerButton.jsx
git commit -m "feat: redesign AnswerButton with 3D game style and equal height"
```

---

### Task 3: Grid 2x2 fijo en Answers y Question

**Files:**
- Modify: `src/features/game/states/Answers.jsx`
- Modify: `src/features/game/states/Question.jsx`

**Interfaces:**
- Consumes: `AnswerButton` con `height: '100%'` de Task 2 — necesario para que `alignItems="stretch"` funcione.
- Produces: grid siempre 2 columnas, botones de igual altura por fila.

- [ ] **Step 1: Corregir grid en Answers.jsx**

Localizar el `<Grid container>` en `Answers.jsx` (línea ~36). Cambiar `spacing={2}` a `spacing={2} alignItems="stretch"` y en cada `<Grid item>` cambiar `xs={12} sm={6}` a `xs={6}`:

```jsx
<Grid container spacing={2} alignItems="stretch">
  {currentQuestion.opciones.map((op, i) => (
    <Grid item xs={6} key={op.id_opcion}>
      <AnswerButton
        index={i}
        label={op.texto}
        disabled={selected !== null}
        selected={selected === op.id_opcion}
        onClick={() => handleSelect(op.id_opcion)}
      />
    </Grid>
  ))}
</Grid>
```

- [ ] **Step 2: Corregir grid en Question.jsx**

Localizar el `<Grid container>` en `Question.jsx` (línea ~27). Aplicar el mismo cambio:

```jsx
<Grid container spacing={2} alignItems="stretch">
  {currentQuestion.opciones.map((op, i) => (
    <Grid item xs={6} key={op.id_opcion}>
      <AnswerButton index={i} label={op.texto} disabled />
    </Grid>
  ))}
</Grid>
```

- [ ] **Step 3: Verificar grid 2x2 en navegador**

En la pantalla de pregunta/respuesta, verificar:
- Los 4 botones forman siempre 2 columnas (A+B arriba, C+D abajo) sin importar el largo del texto.
- Una opción con texto muy largo no rompe la fila — el texto se ajusta dentro del botón.
- Los dos botones de cada fila tienen la misma altura.

- [ ] **Step 4: Commit**

```bash
git add src/features/game/states/Answers.jsx src/features/game/states/Question.jsx
git commit -m "fix: enforce 2-column grid for answer buttons with equal height"
```
